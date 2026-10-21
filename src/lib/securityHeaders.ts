// Security headers for responses rendered by the Worker (SSR routes: `/`,
// `/blog/*`, `/author/*`, 404, country pages, legacy redirects...).
//
// Cloudflare's `public/_headers` file only applies to STATIC assets served
// straight from the assets binding. Anything rendered by the Worker bypasses
// it, which is why `/` and `/blog/*` used to ship with no security headers at
// all. src/middleware.ts applies this set to every Worker response.
//
// Keep the non-CSP values in sync with the `/*` block in public/_headers.

// The CSP is built by buildCsp() so the inline-script source can differ:
//  - SSR (this file): a fresh nonce per request, added to our own <script>
//    tags by HTMLRewriter below.
//  - Static pages (public/_headers): sha256 hashes generated at build time by
//    scripts/csp-hashes.mjs.
// Keep the directive list in sync with the CSP lines in public/_headers.
//
// 'unsafe-inline' (style-src) stays: React islands and framer-motion render
// `style="..."` attributes, Astro emits scoped <style> blocks, and WordPress
// post bodies carry hundreds of inline `style="..."` attributes. Hashing
// attributes would need 'unsafe-hashes' and break on every CMS edit.
// 'unsafe-eval' is NOT allowed: nothing on the site needs it. Partytown runs
// GA inside its own sandbox iframe/worker, which is not covered by this policy.
function buildCsp(inlineScriptSource: string): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    // static.cloudflareinsights.com: Cloudflare Web Analytics beacon, injected
    // by Cloudflare at the edge.
    `script-src 'self' ${inlineScriptSource} https://www.googletagmanager.com https://static.cloudflareinsights.com https://platform.twitter.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    [
      "connect-src 'self'",
      'https://script.google.com',
      'https://script.googleusercontent.com',
      'https://api.hsforms.com',
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://fintech24h-dealmakers-community.fintech24hvn.workers.dev',
      'https://cloudflareinsights.com',
    ].join(' '),
    [
      "frame-src 'self'",
      'https://calendly.com',
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://player.vimeo.com',
      'https://www.linkedin.com',
      'https://platform.twitter.com',
      'https://syndication.twitter.com',
    ].join(' '),
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    // SSR pages render WordPress post bodies, which hotlink images from ~200
    // different third-party hosts (checked 2026-10-21 across all 381 posts),
    // so images are allowed from any HTTPS origin here. Images cannot run code.
    "img-src 'self' data: blob: https:",
  ].join('; ');
}

// 'report-only': the nonce policy is sent as Content-Security-Policy-Report-Only
// next to the previous enforced policy (which still has 'unsafe-inline').
// 'enforce': the nonce policy is the only, enforced policy.
const NONCE_CSP_MODE: 'report-only' | 'enforce' = 'report-only';

const LEGACY_CSP = buildCsp("'unsafe-inline'");

const BASE_HEADERS: Record<string, string> = {
  // No includeSubDomains: autodiscover.fintech24h.com (mail host at tino.vn)
  // does not answer over HTTPS, so pinning every subdomain to HTTPS is unsafe.
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
};

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...bytes));
}

function setMissing(headers: Headers, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) {
    if (!headers.has(name)) headers.set(name, value);
  }
}

/**
 * Adds the security headers to a Worker response without overriding values a
 * route set itself. HTML responses get a per-request CSP nonce, which
 * HTMLRewriter (Cloudflare Workers runtime) adds to every <script> EXCEPT those
 * inside `[data-cms-content]` (WordPress HTML rendered with set:html), so a
 * script smuggled into a post body stays blocked.
 *
 * Note: this returns a new Response object. Fine today because nothing uses
 * Astro.cookies; if that changes, check cookies still reach the response.
 */
export function withSecurityHeaders(response: Response): Response {
  const target = new Response(response.body, response);
  setMissing(target.headers, BASE_HEADERS);

  const Rewriter = (globalThis as { HTMLRewriter?: any }).HTMLRewriter;
  const isHtml = (target.headers.get('content-type') ?? '').includes('text/html');
  if (!isHtml || !target.body || !Rewriter || target.headers.has('Content-Security-Policy')) {
    // Redirects, XML/RSS, or `astro dev` (Node has no HTMLRewriter).
    setMissing(target.headers, { 'Content-Security-Policy': LEGACY_CSP });
    return target;
  }

  const nonce = createNonce();
  const nonceCsp = buildCsp(`'nonce-${nonce}'`);
  if (NONCE_CSP_MODE === 'enforce') {
    target.headers.set('Content-Security-Policy', nonceCsp);
  } else {
    target.headers.set('Content-Security-Policy', LEGACY_CSP);
    target.headers.set('Content-Security-Policy-Report-Only', nonceCsp);
  }

  let cmsDepth = 0;
  return new Rewriter()
    .on('[data-cms-content]', {
      element(el: any) {
        cmsDepth += 1;
        el.onEndTag(() => {
          cmsDepth -= 1;
        });
      },
    })
    .on('script', {
      element(el: any) {
        if (cmsDepth === 0) el.setAttribute('nonce', nonce);
        else el.removeAttribute('nonce');
      },
    })
    .transform(target);
}
