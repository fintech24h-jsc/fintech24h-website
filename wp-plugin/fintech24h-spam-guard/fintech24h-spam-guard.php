<?php
/**
 * Plugin Name: Fintech24h Spam Guard (mu-plugin)
 * Description: Quarantines injected casino/betting posts. Any post that trips a rule is forced to DRAFT (never published) and the admin is emailed. Install as wp-content/mu-plugins/fintech24h-spam-guard.php.
 * Version: 1.0.0
 *
 * Built from the 2026-09 incident (145 posts, see docs/security/). Signals used:
 *   - published straight into the default "Chưa phân loại" category (id 1) — every legit post has a real category
 *   - external link + gambling vocabulary, or external link + non-English body on an English site
 *   - backdated publish date (spam used dates ~12 months in the past)
 *   - bursts (20 posts in an hour, 4 posts in 4 seconds)
 * Rules downgrade to draft instead of erroring, so a false positive costs one click ("Publish") and nothing is lost.
 */

if (!defined('ABSPATH')) exit;

const F24H_GUARD_DEFAULT_CATEGORY = 1;   // "Chưa phân loại"
const F24H_GUARD_BURST_LIMIT      = 4;   // max new published posts per user per window
const F24H_GUARD_BURST_WINDOW     = 600; // seconds
const F24H_GUARD_MAX_BACKDATE     = 7 * DAY_IN_SECONDS;

function f24h_guard_gambling_regex(): string {
    // Deliberately narrow: no bare "bet"/"betting" so ordinary English ("betting on X") does not match.
    return '/\b(casino|casinos|kasyn\w*|kasino\w*|kaszin\w*|cazinou\w*|kazino\w*|1win\w*|jackpot\w*|apuestas|tragamonedas|gl[üu]cksspiel\w*|kansspel\w*|online\s+betting|sports?\s+betting|sportwetten|paris\s+sportifs|slot\s+(machines?|games?)|online\s+slots?)\b/iu';
}

function f24h_guard_external_links(string $html): array {
    $home = wp_parse_url(home_url(), PHP_URL_HOST) ?: 'fintech24h.com';
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
    if (count($words) < 60) return false;
    $stop = ['the' => 1, 'and' => 1, 'of' => 1, 'to' => 1, 'in' => 1, 'is' => 1, 'for' => 1, 'with' => 1];
    $hit = 0;
    foreach ($words as $w) if (isset($stop[$w])) $hit++;
    return ($hit / count($words)) < 0.04;
}

/** Returns the reason string when the post must be quarantined, or '' when it is fine. */
function f24h_guard_reason(array $data, array $postarr): string {
    $title   = (string) ($data['post_title'] ?? '');
    $content = (string) ($data['post_content'] ?? '');
    $links   = f24h_guard_external_links($content);

    // 1. Published into the default category (or with no category at all).
    $cats = isset($postarr['post_category']) ? array_filter(array_map('intval', (array) $postarr['post_category'])) : [];
    if (!empty($postarr['ID'])) {
        $existing = wp_get_post_categories((int) $postarr['ID']);
        if (!$cats) $cats = $existing;
    }
    if (!$cats || $cats === [F24H_GUARD_DEFAULT_CATEGORY]) return 'default-category';

    // 2. Gambling vocabulary + at least one external link.
    if ($links && preg_match(f24h_guard_gambling_regex(), $title . ' ' . $data['post_name'] . ' ' . wp_strip_all_tags($content))) return 'gambling-keywords+external-link';

    // 3. External link in a body that is not in the site language.
    if ($links && f24h_guard_looks_non_english($title . ' ' . $content)) return 'foreign-language+external-link';

    // 4. Backdated publish date on a NEW post.
    if (empty($postarr['ID']) && !empty($data['post_date_gmt']) && $data['post_date_gmt'] !== '0000-00-00 00:00:00') {
        if (strtotime($data['post_date_gmt'] . ' UTC') < time() - F24H_GUARD_MAX_BACKDATE) return 'backdated';
    }

    return '';
}

add_filter('wp_insert_post_data', function (array $data, array $postarr) {
    if (($data['post_type'] ?? '') !== 'post') return $data;
    if (!in_array($data['post_status'] ?? '', ['publish', 'future'], true)) return $data;
    if (wp_is_post_revision($postarr['ID'] ?? 0) || (defined('WP_IMPORTING') && WP_IMPORTING)) return $data;
    // Never touch a post that is ALREADY published (Studio routinely updates old posts, e.g. interlinking).
    // Only new posts, and drafts being published, are screened.
    if (!empty($postarr['ID']) && get_post_status((int) $postarr['ID']) === 'publish') return $data;

    $reason = f24h_guard_reason($data, $postarr);

    // 5. Burst limit per author for NEW posts.
    if ($reason === '' && empty($postarr['ID'])) {
        $key   = 'f24h_guard_burst_' . (int) ($data['post_author'] ?? 0);
        $stamp = get_transient($key);
        $stamp = is_array($stamp) ? array_filter($stamp, fn($t) => $t > time() - F24H_GUARD_BURST_WINDOW) : [];
        $stamp[] = time();
        set_transient($key, $stamp, F24H_GUARD_BURST_WINDOW);
        if (count($stamp) > F24H_GUARD_BURST_LIMIT) $reason = 'burst';
    }

    if ($reason === '') return $data;

    $data['post_status'] = 'draft';
    $GLOBALS['f24h_guard_last'] = ['reason' => $reason, 'title' => $data['post_title'] ?? ''];
    return $data;
}, 1, 2);

// One email per quarantined post (throttled to 1 per 10 minutes per reason so a flood cannot spam the inbox).
add_action('wp_after_insert_post', function ($post_id) {
    if (empty($GLOBALS['f24h_guard_last'])) return;
    $info = $GLOBALS['f24h_guard_last']; unset($GLOBALS['f24h_guard_last']);
    update_post_meta($post_id, '_f24h_guard_quarantined', $info['reason']);
    error_log('[f24h-spam-guard] quarantined post ' . $post_id . ' reason=' . $info['reason']);
    $tk = 'f24h_guard_mail_' . $info['reason'];
    if (get_transient($tk)) return;
    set_transient($tk, 1, 600);
    wp_mail(get_option('admin_email'), '[Fintech24h] Post quarantined: ' . $info['reason'],
        "A post was forced to draft by Fintech24h Spam Guard.\nReason: {$info['reason']}\nTitle: {$info['title']}\nEdit: " . admin_url('post.php?post=' . (int) $post_id . '&action=edit') .
        "\nIf this was a legitimate post, open it and click Publish.\nIf not, a credential is compromised: rotate passwords and application passwords now.");
}, 10, 1);
