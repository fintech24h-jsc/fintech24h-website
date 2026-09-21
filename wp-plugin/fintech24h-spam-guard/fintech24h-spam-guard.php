<?php
/**
 * Plugin Name: Fintech24h Spam Guard (mu-plugin)
 * Description: Quarantines injected casino/betting posts. A post that trips a rule is forced back to DRAFT (never left published) and the admin is emailed. Install as wp-content/mu-plugins/fintech24h-spam-guard.php.
 * Version: 1.1.1
 *
 * Built from the 2026-09 incident (145 posts, see docs/security/). Rules only screen a post at the moment it is
 * being PUBLISHED (new post, or draft/pending/future -> publish). Posts that are already published are never touched,
 * so Content Studio updating old posts (interlinks) is unaffected.
 *
 *   A. gambling vocabulary + at least one external link
 *   B. external link + body not in English (site language)          [F24H_GUARD_FOREIGN_RULE]
 *   C. NEW post published with a date more than 7 days in the past (spam used dates ~12 months back)
 *   D. more than 4 NEW posts published by the same author within 10 minutes (spam: 20 posts/hour, 4 posts/4 s)
 *   E. published while in the default category (id 1) or with no category
 *
 * Rule E is evaluated AFTER WordPress has assigned categories: the REST API (block editor, Content Studio, bots)
 * saves categories after the row is inserted, so checking earlier would wrongly catch every legitimate post.
 *
 * A quarantined post is a draft, so a false positive costs one click ("Publish") and nothing is lost.
 */

if (!defined('ABSPATH')) exit;

const F24H_GUARD_DEFAULT_CATEGORY = 1;    // "Chưa phân loại"
const F24H_GUARD_BURST_LIMIT      = 4;
const F24H_GUARD_BURST_WINDOW     = 600;  // seconds
const F24H_GUARD_MAX_BACKDATE     = 604800; // 7 days
const F24H_GUARD_FOREIGN_RULE     = true; // set false if you intentionally publish non-English posts that contain links

function f24h_guard_gambling_regex(): string {
    // Deliberately narrow: no bare "bet"/"betting", so ordinary English ("betting on X") does not match.
    return '/\b(casino|casinos|kasyn\w*|kasino\w*|kaszin\w*|cazinou\w*|kazino\w*|1win\w*|jackpot\w*|apuestas|tragamonedas|gl[üu]cksspiel\w*|kansspel\w*|online\s+betting|sports?\s+betting|sportwetten|paris\s+sportifs|slot\s+(machines?|games?)|online\s+slots?)\b/iu';
}

function f24h_guard_external_links(string $html): array {
    $home = wp_parse_url(home_url(), PHP_URL_HOST) ?: 'fintech24h.com';
    $home = strtolower(preg_replace('/^www\./', '', $home));
    $out  = [];
    if (preg_match_all('/href\s*=\s*["\']https?:\/\/([^\/"\'?#]+)/i', $html, $m)) {
        foreach ($m[1] as $host) {
            $host = strtolower(preg_replace('/^www\./', '', $host));
            if ($host !== $home && substr($host, -strlen($home) - 1) !== '.' . $home) $out[$host] = true;
        }
    }
    return array_keys($out);
}

function f24h_guard_looks_non_english(string $text): bool {
    $words = preg_split('/\s+/u', strtolower(wp_strip_all_tags($text)), -1, PREG_SPLIT_NO_EMPTY);
    if (!$words || count($words) < 60) return false;
    $stop = ['the' => 1, 'and' => 1, 'of' => 1, 'to' => 1, 'in' => 1, 'is' => 1, 'for' => 1, 'with' => 1];
    $hit = 0;
    foreach ($words as $w) if (isset($stop[$w])) $hit++;
    return ($hit / count($words)) < 0.04;
}

/** Rules A-C: decided from the content itself, at insert time. Returns a reason or ''. */
function f24h_guard_content_reason(array $data, bool $is_new): string {
    // wp_insert_post_data hands us SLASHED data (href=\"https://..\"), so unslash before matching.
    $title   = wp_unslash((string) ($data['post_title'] ?? ''));
    $content = wp_unslash((string) ($data['post_content'] ?? ''));
    $links   = f24h_guard_external_links($content);

    if ($links && preg_match(f24h_guard_gambling_regex(), $title . ' ' . ($data['post_name'] ?? '') . ' ' . wp_strip_all_tags($content))) {
        return 'gambling-keywords+external-link';
    }
    if (F24H_GUARD_FOREIGN_RULE && $links && f24h_guard_looks_non_english($title . ' ' . $content)) {
        return 'foreign-language+external-link';
    }
    if ($is_new && !empty($data['post_date_gmt']) && $data['post_date_gmt'] !== '0000-00-00 00:00:00'
        && strtotime($data['post_date_gmt'] . ' UTC') < time() - F24H_GUARD_MAX_BACKDATE) {
        return 'backdated';
    }
    return '';
}

add_filter('wp_insert_post_data', function (array $data, array $postarr) {
    if (($data['post_type'] ?? '') !== 'post') return $data;
    if (!in_array($data['post_status'] ?? '', ['publish', 'future'], true)) return $data;
    if (defined('WP_IMPORTING') && WP_IMPORTING) return $data;

    $id = (int) ($postarr['ID'] ?? 0);
    // Never touch a post that is ALREADY published.
    if ($id && get_post_status($id) === 'publish') return $data;

    $reason = f24h_guard_content_reason($data, $id === 0);

    // Rule D: burst of NEW posts straight to publish by the same author.
    if ($reason === '' && $id === 0) {
        $key   = 'f24h_guard_burst_' . (int) ($data['post_author'] ?? 0);
        $stamp = get_transient($key);
        $stamp = is_array($stamp) ? array_values(array_filter($stamp, function ($t) { return $t > time() - F24H_GUARD_BURST_WINDOW; })) : [];
        $stamp[] = time();
        set_transient($key, $stamp, F24H_GUARD_BURST_WINDOW);
        if (count($stamp) > F24H_GUARD_BURST_LIMIT) $reason = 'burst';
    }

    if ($reason === '') return $data;

    $data['post_status'] = 'draft';
    $GLOBALS['f24h_guard_notify'] = ['reason' => $reason, 'title' => (string) ($data['post_title'] ?? '')];
    return $data;
}, 1, 2);

// Remember posts that just went live so Rule E can look at their FINAL categories.
add_action('transition_post_status', function ($new, $old, $post) {
    if ($post && $post->post_type === 'post' && $new === 'publish' && $old !== 'publish') {
        $GLOBALS['f24h_guard_pending'][(int) $post->ID] = true;
    }
}, 10, 3);

function f24h_guard_notify(int $post_id, string $reason, string $title): void {
    update_post_meta($post_id, '_f24h_guard_quarantined', $reason);
    error_log('[f24h-spam-guard] quarantined post ' . $post_id . ' reason=' . $reason);
    $tk = 'f24h_guard_mail_' . $reason;           // at most one email per reason per 10 minutes
    if (get_transient($tk)) return;
    set_transient($tk, 1, 600);
    wp_mail(get_option('admin_email'), '[Fintech24h] Post quarantined: ' . $reason,
        "A post was forced to draft by Fintech24h Spam Guard.\nReason: {$reason}\nTitle: {$title}\nEdit: " . admin_url('post.php?post=' . $post_id . '&action=edit') .
        "\nIf this was a legitimate post, open it and click Publish.\nIf not, a credential is compromised: rotate passwords and application passwords now.");
}

function f24h_guard_is_rest(): bool {
    return (defined('REST_REQUEST') && REST_REQUEST)
        || (function_exists('wp_is_serving_rest_request') && wp_is_serving_rest_request());
}

/** Rule E, run once categories are final. */
function f24h_guard_late_check(int $post_id): void {
    static $busy = false;
    if ($busy || empty($GLOBALS['f24h_guard_pending'][$post_id])) return;
    unset($GLOBALS['f24h_guard_pending'][$post_id]);

    $cats = array_map('intval', (array) wp_get_post_categories($post_id));
    if ($cats && $cats !== [F24H_GUARD_DEFAULT_CATEGORY]) return;

    $busy = true;
    wp_update_post(['ID' => $post_id, 'post_status' => 'draft']);
    $busy = false;
    $p = get_post($post_id);
    f24h_guard_notify($post_id, 'default-category', $p ? (string) $p->post_title : '');
}

// REST (block editor, Content Studio, bots): categories are saved after insert, so wait for this hook.
add_action('rest_after_insert_post', function ($post) { f24h_guard_late_check((int) $post->ID); }, 99, 1);

add_action('wp_after_insert_post', function ($post_id) {
    // Content-rule quarantine (set by the wp_insert_post_data filter): notify.
    if (!empty($GLOBALS['f24h_guard_notify'])) {
        $info = $GLOBALS['f24h_guard_notify']; unset($GLOBALS['f24h_guard_notify']);
        f24h_guard_notify((int) $post_id, $info['reason'], $info['title']);
    }
    // Non-REST paths (classic editor, XML-RPC, bulk edit) have their categories set by now.
    if (!f24h_guard_is_rest()) f24h_guard_late_check((int) $post_id);
}, 99, 1);
