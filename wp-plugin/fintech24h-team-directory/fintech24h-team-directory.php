<?php
/**
 * Plugin Name:       Fintech24h Team Directory
 * Description:       Minimal, dependency-free custom post type ("Team Member": LinkedIn/Telegram/Instagram/email, "has left Fintech24h" flag) plus a free-form Ecosystem Links registry, powering the public anti-impersonation lookup at fintech24h.com/verify-members/. No third-party libraries, no external network calls, no update mechanism.
 * Version:           1.1.1
 * Requires at least: 6.4
 * Requires PHP:      8.0
 * Author:            Fintech24h
 * License:           Proprietary
 *
 * ─── SECURITY DESIGN NOTES (read before modifying) ──────────────────────────
 * 1. Single file, zero dependencies, zero external HTTP calls at runtime —
 *    nothing here can be hijacked via a compromised third-party package or a
 *    hijacked update server, because there is neither.
 * 2. The custom post type is `public => false` / `publicly_queryable => false`
 *    — there is no front-end template, no archive, no single-post URL for
 *    WordPress itself to serve. The ONLY consumer is the Astro Worker, which
 *    reads it read-only via the REST API (same mechanism already used for
 *    blog posts).
 * 3. Every write path (the classic meta box save handler) is nonce-protected,
 *    capability-checked, and the LinkedIn/Telegram/Instagram fields are each
 *    validated against an exact-domain allowlist — not just sanitized.
 *    Anything else is silently rejected and the editor is shown a one-time
 *    admin notice explaining why, so a typo (or a compromised session
 *    pasting a phishing link) can never end up published as a "verified
 *    official channel". The free-form Ecosystem Links registry (section 4)
 *    is deliberately NOT domain-locked — that's its entire purpose — but
 *    still only ever stores a well-formed http(s) URL or email address,
 *    gated behind manage_options rather than the per-member edit_post
 *    capability.
 * 4. All admin-UI output is escaped (`esc_attr`, `esc_url`) even though only
 *    the two existing site admins can ever reach this screen — defense in
 *    depth costs nothing here.
 * 5. Only plain WordPress core APIs are used (register_post_type,
 *    register_post_meta, the Media Library, `media_sideload_image()`) — no
 *    raw SQL, no `eval`/`unserialize`, no custom file upload handling beyond
 *    WordPress's own (already-hardened) media uploader.
 * 6. Activation seeds the 4 existing About-page founders exactly once (guarded
 *    by a post-count check so re-activating never duplicates them), sideloading
 *    their photos from the site's own already-public wp-content URLs — not
 *    from user input, so there is no SSRF surface.
 */

defined('ABSPATH') || exit;

// ─── 1. Custom Post Type ─────────────────────────────────────────────────────

add_action('init', 'fi24h_register_team_member_cpt');
function fi24h_register_team_member_cpt(): void {
    register_post_type('team_member', [
        'labels' => [
            'name'               => 'Team Members',
            'singular_name'      => 'Team Member',
            'add_new_item'       => 'Add Team Member',
            'edit_item'          => 'Edit Team Member',
            'new_item'           => 'New Team Member',
            'all_items'          => 'Team Members',
            'search_items'       => 'Search Team Members',
            'not_found'          => 'No team members yet.',
        ],
        'menu_icon'             => 'dashicons-groups',
        'menu_position'         => 20,
        // No front-end footprint on purpose — see security note #2 above.
        'public'                => false,
        'publicly_queryable'    => false,
        'exclude_from_search'   => true,
        'show_in_nav_menus'     => false,
        'show_in_admin_bar'     => false,
        // But fully manageable in wp-admin and readable via REST — that's the
        // whole point (Astro's /verify page fetches it read-only).
        'show_ui'               => true,
        'show_in_menu'          => true,
        'show_in_rest'          => true,
        'rest_base'             => 'team-members',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        // 'custom-fields' is REQUIRED here even though nothing uses the
        // classic custom-fields meta box (the one below is a dedicated meta
        // box instead) — WordPress core only registers the 'meta' field on
        // this post type's REST schema at all when
        // post_type_supports($post_type, 'custom-fields') is true. Without
        // it, register_post_meta()'s show_in_rest is silently a no-op: role/
        // linkedin/telegram/instagram/email/left_company/departure_date
        // would never appear in the REST response no matter how correctly
        // they're registered or filled in.
        'supports'              => ['title', 'thumbnail', 'custom-fields'],
        'has_archive'           => false,
        'rewrite'               => false,
        'capability_type'       => 'post', // maps to the standard Administrator/Editor capabilities already governing this site's 2 admin accounts
        'hierarchical'          => false,
    ]);

    $meta_args_common = [
        'type'         => 'string',
        'single'       => true,
        'show_in_rest' => true,
        // REST reads are public on purpose (the verify tool fetches anonymously,
        // same trust level as this site's blog posts). REST *writes* still
        // require a logged-in user with edit_post capability — unchanged from
        // WordPress's own default enforcement.
        'auth_callback' => function ($allowed, $meta_key, $post_id) {
            return current_user_can('edit_post', $post_id);
        },
    ];

    register_post_meta('team_member', 'role', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_sanitize_role',
    ]));
    register_post_meta('team_member', 'linkedin', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_validate_linkedin_url',
    ]));
    register_post_meta('team_member', 'telegram', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_validate_telegram_url',
    ]));
    register_post_meta('team_member', 'instagram', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_validate_instagram_url',
    ]));
    register_post_meta('team_member', 'email', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_sanitize_member_email',
    ]));
    register_post_meta('team_member', 'left_company', array_merge($meta_args_common, [
        'type'              => 'boolean',
        'sanitize_callback' => 'rest_sanitize_boolean',
    ]));
    register_post_meta('team_member', 'departure_date', array_merge($meta_args_common, [
        'sanitize_callback' => 'fi24h_sanitize_departure_date',
    ]));
}

// ─── 2. Field validation (shared by the meta-box save handler AND any REST
//        write, since these are also the registered sanitize_callbacks) ─────

function fi24h_sanitize_role($value): string {
    $value = sanitize_text_field((string) $value);
    return mb_substr($value, 0, 100); // plenty for "Global Business Development"; just a sanity cap
}

/**
 * Strict `Y-m-d` validation: right shape, a real calendar date, and not in
 * the future (a departure date can't happen after today). Returns '' for
 * anything else — including empty, which is valid and means "left, but no
 * date on record" rather than "still active".
 */
function fi24h_sanitize_departure_date($value): string {
    $value = trim((string) $value);
    if ($value === '') return '';
    if (!preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $m)) return '';
    [, $y, $mo, $d] = $m;
    if (!checkdate((int) $mo, (int) $d, (int) $y)) return '';
    if ($value > current_time('Y-m-d')) return ''; // reject future dates (site runs on UTC; see wp-config)
    return $value;
}

/**
 * Accepts EITHER a full LinkedIn URL (any of: `linkedin.com/in/x`,
 * `https://www.linkedin.com/in/x/`, with or without scheme/www) OR a bare
 * vanity handle (`phatvt`, `@phatvt`) and always returns the one canonical
 * form (`https://www.linkedin.com/in/{handle}/`) — or '' if neither parses.
 * Storing one canonical form regardless of how the admin typed it is what
 * lets /verify match a visitor-pasted full URL even when the admin only
 * ever typed the short handle.
 */
function fi24h_validate_linkedin_url($value): string {
    $handle = fi24h_extract_handle((string) $value, ['linkedin.com', 'www.linkedin.com'], '/^in\//i');
    if ($handle === null) return '';
    return 'https://www.linkedin.com/in/' . $handle . '/';
}

/**
 * Same idea for Telegram: accepts a full t.me/telegram.me URL or a bare
 * @username, always stores the canonical `https://t.me/{handle}` form.
 */
function fi24h_validate_telegram_url($value): string {
    $handle = fi24h_extract_handle((string) $value, ['t.me', 'telegram.me'], null);
    if ($handle === null) return '';
    return 'https://t.me/' . $handle;
}

/**
 * Same idea for Instagram: accepts a full instagram.com URL or a bare
 * @username, always stores the canonical `https://www.instagram.com/{handle}/` form.
 */
function fi24h_validate_instagram_url($value): string {
    $handle = fi24h_extract_handle((string) $value, ['instagram.com', 'www.instagram.com'], null);
    if ($handle === null) return '';
    return 'https://www.instagram.com/' . $handle . '/';
}

/**
 * A member's own email address. Any real address is accepted (WordPress's
 * own `is_email()` — no domain restriction here, since this is what a
 * visitor's pasted email gets compared AGAINST, not something to gatekeep at
 * entry time). The @fintech24h.com-vs-other-domain distinction happens in
 * the read-only /verify-members matching logic on the Astro side, not here.
 */
function fi24h_sanitize_member_email($value): string {
    $value = strtolower(trim((string) $value));
    if ($value === '') return '';
    return is_email($value) ? $value : '';
}

/**
 * Shared parser: pulls a handle out of a full URL on an allowed host, OR out
 * of a bare `handle` / `@handle` string. Returns null (reject) for anything
 * else — including a URL on any host NOT in $allowed_hosts, so this can
 * never be tricked into storing a link to some other domain.
 *
 * $strip_prefix_regex: for LinkedIn, the path is `/in/{handle}` — this trims
 * the leading `in/` segment before returning just the handle. Telegram paths
 * are already bare (`/{handle}`), so it's null there.
 */
function fi24h_extract_handle(string $value, array $allowed_hosts, ?string $strip_prefix_regex): ?string {
    $value = trim($value);
    if ($value === '') return null;

    $looks_like_url = (bool) preg_match('#^(https?://|www\.)#i', $value)
        || (bool) preg_match('#^(' . implode('|', array_map('preg_quote', $allowed_hosts)) . ')/#i', $value);

    if ($looks_like_url) {
        $with_scheme = preg_match('#^https?://#i', $value) ? $value : 'https://' . $value;

        // esc_url_raw strips anything that isn't a well-formed http(s) URL,
        // so a `javascript:` or other non-http scheme never survives this.
        $clean = esc_url_raw($with_scheme, ['http', 'https']);
        if ($clean === '') return null;

        $parts = wp_parse_url($clean);
        if (!$parts || empty($parts['scheme']) || empty($parts['host'])) return null;
        if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) return null;
        if (!in_array(strtolower($parts['host']), $allowed_hosts, true)) return null;

        $path = trim($parts['path'] ?? '', '/');
        if ($strip_prefix_regex !== null) {
            // A required prefix (LinkedIn's `/in/`) must actually be present —
            // otherwise this is some other kind of LinkedIn URL (a company
            // page, a school page, a post...) and treating its first path
            // segment as a personal handle would be wrong, not just lenient.
            if (!preg_match($strip_prefix_regex, $path)) return null;
            $path = preg_replace($strip_prefix_regex, '', $path);
        }
        $handle = explode('/', $path)[0] ?? '';
        $handle = sanitize_text_field($handle);
        return $handle !== '' ? $handle : null;
    }

    // Not a URL — treat as a bare handle. LinkedIn vanity handles and
    // Telegram usernames are both, in practice, letters/digits/hyphen/
    // underscore only; this intentionally rejects anything with slashes,
    // spaces, or other punctuation rather than guessing.
    $handle = ltrim($value, '@');
    if (!preg_match('/^[A-Za-z0-9_\-]{3,100}$/', $handle)) return null;
    return $handle;
}

// ─── 3. Admin UI: a plain meta box (no page builder / ACF dependency) ───────

add_action('add_meta_boxes', 'fi24h_add_team_member_meta_box');
function fi24h_add_team_member_meta_box(): void {
    add_meta_box(
        'fi24h_team_member_details',
        'Verification Details',
        'fi24h_render_team_member_meta_box',
        'team_member',
        'normal',
        'high'
    );

    // 'custom-fields' post-type support (see the register_post_type() call
    // above — required for meta to appear in REST at all) also makes
    // WordPress add its own generic "Custom Fields" key/value box. Its saves
    // still go through the same registered sanitize_callback (WordPress
    // applies that at the update_post_meta() level, not per-UI), so it's not
    // a validation bypass — just a confusing, redundant second place to edit
    // the same fields. Remove it.
    remove_meta_box('postcustom', 'team_member', 'normal');
}

function fi24h_render_team_member_meta_box(WP_Post $post): void {
    if (!current_user_can('edit_post', $post->ID)) return;

    $role           = get_post_meta($post->ID, 'role', true);
    $linkedin       = get_post_meta($post->ID, 'linkedin', true);
    $telegram       = get_post_meta($post->ID, 'telegram', true);
    $instagram      = get_post_meta($post->ID, 'instagram', true);
    $email          = get_post_meta($post->ID, 'email', true);
    $left_company   = (bool) get_post_meta($post->ID, 'left_company', true);
    $departure_date = get_post_meta($post->ID, 'departure_date', true);

    wp_nonce_field('fi24h_save_team_member', 'fi24h_team_member_nonce');
    ?>
    <p>
        <label for="fi24h_role"><strong>Role</strong></label><br>
        <input type="text" id="fi24h_role" name="fi24h_role" style="width:100%;"
               maxlength="100" value="<?php echo esc_attr($role); ?>"
               placeholder="e.g. Head of Community Management">
    </p>
    <p>
        <label for="fi24h_linkedin"><strong>LinkedIn</strong></label><br>
        <input type="text" id="fi24h_linkedin" name="fi24h_linkedin" style="width:100%;"
               value="<?php echo esc_attr($linkedin); ?>"
               placeholder="phatvt  —  or the full https://www.linkedin.com/in/phatvt/ link">
        <span style="color:#787c82;">Just the handle or the full linkedin.com URL both work — always saved as the full canonical link so it matches whatever a visitor pastes. Anything on another domain is rejected on save.</span>
    </p>
    <p>
        <label for="fi24h_telegram"><strong>Telegram</strong></label><br>
        <input type="text" id="fi24h_telegram" name="fi24h_telegram" style="width:100%;"
               value="<?php echo esc_attr($telegram); ?>"
               placeholder="phatvt  —  or the full https://t.me/phatvt link">
        <span style="color:#787c82;">Just the @username or the full t.me URL both work — always saved as the full canonical link. Anything on another domain is rejected on save.</span>
    </p>
    <p>
        <label for="fi24h_instagram"><strong>Instagram</strong></label><br>
        <input type="text" id="fi24h_instagram" name="fi24h_instagram" style="width:100%;"
               value="<?php echo esc_attr($instagram); ?>"
               placeholder="phatvt  —  or the full https://www.instagram.com/phatvt/ link">
        <span style="color:#787c82;">Just the @username or the full instagram.com URL both work. Anything on another domain is rejected on save.</span>
    </p>
    <p>
        <label for="fi24h_email"><strong>Work Email</strong></label><br>
        <input type="email" id="fi24h_email" name="fi24h_email" style="width:100%;"
               value="<?php echo esc_attr($email); ?>"
               placeholder="name@fintech24h.com">
        <span style="color:#787c82;">Used to answer "is this really their email?" on /verify-members/. Any well-formed address is accepted (not restricted to @fintech24h.com) — an invalid format is simply not saved.</span>
    </p>
    <p style="border-top:1px solid #dcdcde; padding-top:10px;">
        <label>
            <input type="checkbox" id="fi24h_left_company" name="fi24h_left_company" value="1" <?php checked($left_company); ?>>
            <strong>This person has left Fintech24h</strong>
        </label>
    </p>
    <p id="fi24h_departure_date_row" style="<?php echo $left_company ? '' : 'display:none;'; ?>">
        <label for="fi24h_departure_date">Departure date <span style="color:#787c82; font-weight:normal;">(optional — leave blank to just show "no longer with Fintech24h" with no date)</span></label><br>
        <input type="date" id="fi24h_departure_date" name="fi24h_departure_date"
               value="<?php echo esc_attr($departure_date); ?>"
               max="<?php echo esc_attr(current_time('Y-m-d')); ?>">
    </p>
    <script>
    (function () {
        var box  = document.getElementById('fi24h_left_company');
        var row  = document.getElementById('fi24h_departure_date_row');
        if (!box || !row) return;
        box.addEventListener('change', function () {
            row.style.display = box.checked ? '' : 'none';
        });
    })();
    </script>
    <p style="border-top:1px solid #dcdcde; padding-top:10px; color:#787c82;">
        Featured Image (sidebar →) is used as the profile photo.<br>
        <strong>Published</strong> = verifiable on fintech24h.com/verify-members/.
        <strong>Draft</strong> = hidden from verification entirely (use "has left Fintech24h" above instead, if you want the tool to actively warn people rather than just say nothing).
    </p>
    <?php
}

add_action('save_post_team_member', 'fi24h_save_team_member_meta');
function fi24h_save_team_member_meta(int $post_id): void {
    if (
        !isset($_POST['fi24h_team_member_nonce']) ||
        !wp_verify_nonce(
            sanitize_text_field(wp_unslash($_POST['fi24h_team_member_nonce'])),
            'fi24h_save_team_member'
        )
    ) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $rejected = [];

    if (isset($_POST['fi24h_role'])) {
        update_post_meta($post_id, 'role', fi24h_sanitize_role(wp_unslash($_POST['fi24h_role'])));
    }

    if (isset($_POST['fi24h_linkedin'])) {
        $raw = wp_unslash($_POST['fi24h_linkedin']);
        $clean = fi24h_validate_linkedin_url($raw);
        if (trim((string) $raw) !== '' && $clean === '') {
            $rejected[] = 'LinkedIn (must be a handle or a linkedin.com link)';
        } else {
            update_post_meta($post_id, 'linkedin', $clean);
        }
    }

    if (isset($_POST['fi24h_telegram'])) {
        $raw = wp_unslash($_POST['fi24h_telegram']);
        $clean = fi24h_validate_telegram_url($raw);
        if (trim((string) $raw) !== '' && $clean === '') {
            $rejected[] = 'Telegram (must be a @username or a t.me/telegram.me link)';
        } else {
            update_post_meta($post_id, 'telegram', $clean);
        }
    }

    if (isset($_POST['fi24h_instagram'])) {
        $raw = wp_unslash($_POST['fi24h_instagram']);
        $clean = fi24h_validate_instagram_url($raw);
        if (trim((string) $raw) !== '' && $clean === '') {
            $rejected[] = 'Instagram (must be a @username or an instagram.com link)';
        } else {
            update_post_meta($post_id, 'instagram', $clean);
        }
    }

    if (isset($_POST['fi24h_email'])) {
        $raw = wp_unslash($_POST['fi24h_email']);
        $clean = fi24h_sanitize_member_email($raw);
        if (trim((string) $raw) !== '' && $clean === '') {
            $rejected[] = 'Work Email (must be a valid email address)';
        } else {
            update_post_meta($post_id, 'email', $clean);
        }
    }

    // Checkboxes are simply absent from $_POST when unchecked — that IS the
    // "false" signal, not something to validate.
    $left_company = isset($_POST['fi24h_left_company']) && $_POST['fi24h_left_company'] === '1';
    update_post_meta($post_id, 'left_company', $left_company);

    if ($left_company && isset($_POST['fi24h_departure_date'])) {
        $raw_date = wp_unslash($_POST['fi24h_departure_date']);
        $clean_date = fi24h_sanitize_departure_date($raw_date);
        if (trim((string) $raw_date) !== '' && $clean_date === '') {
            $rejected[] = 'Departure date (must be a real, non-future date)';
        } else {
            update_post_meta($post_id, 'departure_date', $clean_date);
        }
    } else {
        // Not marked as departed — clear any previously stored date so a
        // later "left the company" doesn't inherit a stale date from an
        // unrelated earlier edit.
        update_post_meta($post_id, 'departure_date', '');
    }

    if (!empty($rejected)) {
        set_transient('fi24h_team_member_rejected_' . get_current_user_id(), $rejected, 60);
    }
}

add_action('admin_notices', 'fi24h_show_rejected_fields_notice');
function fi24h_show_rejected_fields_notice(): void {
    $key = 'fi24h_team_member_rejected_' . get_current_user_id();
    $rejected = get_transient($key);
    if (empty($rejected)) return;
    delete_transient($key);
    ?>
    <div class="notice notice-warning is-dismissible">
        <p><strong>Fintech24h Team Directory:</strong> the following field(s) were <em>not</em> saved because they failed the official-domain check: <?php echo esc_html(implode(', ', $rejected)); ?>.</p>
    </div>
    <?php
}

// ─── 4. Ecosystem Links — a free-form registry for anything that doesn't fit
//        the structured per-member fields (a company Facebook page, a shared
//        inbox like support@fintech24h.com, a sister project's official
//        site...). One flat option, not a post type — deliberately the
//        simplest possible shape for "a big list of label + url/email
//        pairs" that a visitor's pasted input can be checked against.

const FI24H_ECOSYSTEM_OPTION = 'fi24h_ecosystem_links';

add_action('admin_menu', 'fi24h_add_ecosystem_links_page');
function fi24h_add_ecosystem_links_page(): void {
    add_submenu_page(
        'edit.php?post_type=team_member',
        'Ecosystem Links',
        'Ecosystem Links',
        // Deliberately tighter than the per-member post capability — this is
        // one flat trust list covering the whole company, not one person's
        // own profile, so it's worth a slightly higher bar.
        'manage_options',
        'fi24h-ecosystem-links',
        'fi24h_render_ecosystem_links_page'
    );
}

function fi24h_get_ecosystem_links(): array {
    $raw = get_option(FI24H_ECOSYSTEM_OPTION, []);
    return is_array($raw) ? $raw : [];
}

/**
 * Parses the admin textarea (one `Label | url-or-email` per line) into a
 * clean array, silently dropping malformed lines rather than rejecting the
 * whole save — a stray blank line or missing `|` shouldn't lose everything
 * else that was fine.
 */
function fi24h_parse_ecosystem_links(string $raw_text): array {
    $lines = preg_split('/\r\n|\r|\n/', $raw_text) ?: [];
    $out = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '') continue;

        $parts = explode('|', $line, 2);
        if (count($parts) !== 2) continue;

        $label = sanitize_text_field(trim($parts[0]));
        $value = fi24h_sanitize_ecosystem_value(trim($parts[1]));
        if ($label === '' || $value === '') continue;

        $out[] = ['label' => mb_substr($label, 0, 120), 'value' => $value];
    }
    return $out;
}

/**
 * Deliberately permissive about WHICH domain (that's the whole point of this
 * table — any platform, unlike the domain-locked per-member fields), but
 * still only ever stores a well-formed http(s) URL or a valid email address.
 * A `javascript:` URL, or anything that's neither, is rejected exactly like
 * everywhere else in this plugin.
 */
function fi24h_sanitize_ecosystem_value(string $value): string {
    $value = trim($value);
    if ($value === '') return '';
    if (is_email($value)) return strtolower($value);

    $with_scheme = preg_match('#^https?://#i', $value) ? $value : 'https://' . $value;
    $clean = esc_url_raw($with_scheme, ['http', 'https']);
    if ($clean === '') return '';

    // esc_url_raw alone isn't strict enough to catch a typo like "not-a-url"
    // (no email, no dot) from silently becoming "https://not-a-url" — require
    // an actual dotted host, same spirit as the domain checks elsewhere in
    // this file, just without a fixed allowlist (any real domain is fine here).
    $parts = wp_parse_url($clean);
    if (!$parts || empty($parts['scheme']) || empty($parts['host'])) return '';
    if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) return '';
    if (strpos($parts['host'], '.') === false) return '';

    return $clean;
}

function fi24h_render_ecosystem_links_page(): void {
    if (!current_user_can('manage_options')) return;

    $saved = false;
    if (
        isset($_POST['fi24h_ecosystem_nonce']) &&
        wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['fi24h_ecosystem_nonce'])), 'fi24h_save_ecosystem_links')
    ) {
        $raw_text = wp_unslash($_POST['fi24h_ecosystem_text'] ?? '');
        update_option(FI24H_ECOSYSTEM_OPTION, fi24h_parse_ecosystem_links((string) $raw_text), false);
        $saved = true;
    }

    $links = fi24h_get_ecosystem_links();
    $textarea_value = implode("\n", array_map(
        static fn($l) => $l['label'] . ' | ' . $l['value'],
        $links
    ));
    ?>
    <div class="wrap">
        <h1>Ecosystem Links</h1>
        <p>
            One entry per line: <code>Label | URL or email</code>. Checked by
            <a href="https://fintech24h.com/verify-members/" target="_blank" rel="noopener">fintech24h.com/verify-members/</a>
            as a catch-all for anything that isn't a specific person's LinkedIn/Telegram/Instagram/email — a company
            Facebook page, a shared inbox like <code>support@fintech24h.com</code>, Coinstori, CMO Intern, etc.
        </p>
        <?php if ($saved): ?>
            <div class="notice notice-success"><p>Saved <?php echo (int) count($links); ?> ecosystem link(s).</p></div>
        <?php endif; ?>
        <form method="post">
            <?php wp_nonce_field('fi24h_save_ecosystem_links', 'fi24h_ecosystem_nonce'); ?>
            <textarea name="fi24h_ecosystem_text" rows="14" style="width:100%; max-width:800px; font-family:monospace;"
                      placeholder="Fintech24h Official Support Email | support@fintech24h.com&#10;Fintech24h Company Facebook | https://www.facebook.com/fintech24hnews&#10;Coinstori | https://coinstori.com"><?php echo esc_textarea($textarea_value); ?></textarea>
            <p><?php submit_button('Save Ecosystem Links', 'primary', 'submit', false); ?></p>
        </form>
    </div>
    <?php
}

// Public, read-only, unauthenticated — same trust model as /team-members:
// this data exists specifically so an anonymous visitor's pasted link can be
// checked against it.
add_action('rest_api_init', function () {
    register_rest_route('fintech24h/v1', '/ecosystem-links', [
        'methods'             => 'GET',
        'callback'            => function () {
            return rest_ensure_response(fi24h_get_ecosystem_links());
        },
        'permission_callback' => '__return_true',
    ]);
});

// ─── 5. One-time activation seed: the 4 current About-page founders ─────────
// Idempotent — only runs when the CPT has zero posts, so re-activating (or
// activating on a site that already has entries) never creates duplicates.

register_activation_hook(__FILE__, 'fi24h_seed_founders_on_activation');
function fi24h_seed_founders_on_activation(): void {
    // register_post_type() isn't guaranteed to have run yet at activation
    // time, and wp_insert_post() needs the post type to exist.
    fi24h_register_team_member_cpt();

    $existing = wp_count_posts('team_member');
    $already_seeded = $existing && (
        (int) $existing->publish + (int) $existing->draft + (int) $existing->pending > 0
    );
    if ($already_seeded) return;

    $founders = [
        [
            'name'     => 'Vincent Nguyen',
            'role'     => 'Co-Founder & CEO',
            'linkedin' => 'https://www.linkedin.com/in/vincentnguyen0501/',
            'telegram' => 'https://telegram.me/vincentnguyen0501',
            'photo'    => 'https://fintech24h.com/wp-content/uploads/2026/07/Vincent-300x300.png',
        ],
        [
            'name'     => 'Phat Vo',
            'role'     => 'Co-Founder & CPO',
            'linkedin' => 'https://www.linkedin.com/in/phatvt/',
            'telegram' => 'https://telegram.me/phatvt',
            'photo'    => 'https://fintech24h.com/wp-content/uploads/2026/07/Phat-vo-300x300.png',
        ],
        [
            'name'     => 'JayC',
            'role'     => 'Head of CM',
            'linkedin' => 'https://www.linkedin.com/in/jayc24h/',
            'telegram' => 'https://telegram.me/Fintech24hIJAYC',
            'photo'    => 'https://fintech24h.com/wp-content/uploads/2026/07/JayC-300x300.png',
        ],
        [
            'name'     => 'Gemi',
            'role'     => 'Global Business Development',
            'linkedin' => 'https://www.linkedin.com/in/quangviet0706/',
            'telegram' => 'https://telegram.me/qviet0706',
            'photo'    => 'https://fintech24h.com/wp-content/uploads/2026/07/Gemi-300x300.png',
        ],
    ];

    // Needed for media_sideload_image() outside the normal admin request lifecycle.
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    foreach ($founders as $founder) {
        $post_id = wp_insert_post([
            'post_type'   => 'team_member',
            'post_title'  => sanitize_text_field($founder['name']),
            'post_status' => 'publish',
        ], true);

        if (is_wp_error($post_id) || !$post_id) continue;

        update_post_meta($post_id, 'role', fi24h_sanitize_role($founder['role']));
        update_post_meta($post_id, 'linkedin', fi24h_validate_linkedin_url($founder['linkedin']));
        update_post_meta($post_id, 'telegram', fi24h_validate_telegram_url($founder['telegram']));

        // Photo URL is a hardcoded constant above (this site's own existing
        // media), never user input, so sideloading it carries no SSRF risk.
        $attachment_id = media_sideload_image($founder['photo'], $post_id, $founder['name'], 'id');
        if (!is_wp_error($attachment_id)) {
            set_post_thumbnail($post_id, $attachment_id);
        }
    }
}
