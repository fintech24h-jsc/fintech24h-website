// /consent.js — shared cookie-consent core for fintech24h.com and every
// /dealmakers/* microsite. Loaded as a plain (non-Partytown) script so it
// runs on the real main thread before gtag.js does, and pushes into the
// same window.dataLayer that Partytown's `forward: ['dataLayer.push']`
// config relays into the worker (see astro.config.mjs). Both sites read
// and write the same first-party cookie (same top-level domain), so a
// choice made on one carries over to the other automatically — only the
// banner UI differs per layout, never the underlying consent state.
(function () {
  var COOKIE_NAME = 'fi24h_consent';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 12 months
  // Bump when the Privacy Policy's data-processing section changes
  // materially — a version mismatch makes get() return null, which
  // re-prompts the banner instead of silently honoring a stale consent.
  var POLICY_VERSION = 1;

  function readCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(name, value, maxAgeSeconds) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAgeSeconds + '; SameSite=Lax' + secure;
  }

  function push(entry) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(entry);
  }

  // Only analytics_storage is ever granted here — this project has no ad
  // pixels today (see privacy.astro §5). ad_* stay permanently denied so
  // Consent Mode v2's ad-related signals never fire until that changes.
  function gtagDefault(analyticsGranted) {
    push(['consent', 'default', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    }]);
  }

  function gtagUpdate(analyticsGranted) {
    push(['consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied'
    }]);
  }

  function get() {
    var raw = readCookie(COOKIE_NAME);
    if (!raw) return null;
    try {
      var parsed = JSON.parse(raw);
      if (parsed.v !== POLICY_VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function set(analytics) {
    var record = { analytics: !!analytics, ts: Date.now(), v: POLICY_VERSION };
    writeCookie(COOKIE_NAME, JSON.stringify(record), COOKIE_MAX_AGE);
    gtagUpdate(!!analytics);
    document.dispatchEvent(new CustomEvent('fi24h-consent-changed', { detail: record }));
  }

  // "Cookie preferences" footer links call this to reopen the banner
  // instead of forcing users to clear cookies to change their mind.
  function openPreferences() {
    document.dispatchEvent(new CustomEvent('fi24h-consent-reopen'));
  }

  // Set the default the instant this script runs, before gtag.js (loaded
  // via Partytown further down <head>) has a chance to send anything.
  var existing = get();
  gtagDefault(existing ? existing.analytics : false);

  window.Fi24hConsent = { get: get, set: set, openPreferences: openPreferences, COOKIE_NAME: COOKIE_NAME };
})();
