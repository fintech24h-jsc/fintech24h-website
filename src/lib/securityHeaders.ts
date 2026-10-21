// Security headers for responses rendered by the Worker (SSR routes: `/`,
// `/blog/*`, `/author/*`, 404, country pages, legacy redirects...).
//
// Cloudflare's `public/_headers` file only applies to STATIC assets served
// straight from the assets binding. Anything rendered by the Worker bypasses
// it, which is why `/` and `/blog/*` used to ship with no security headers at
// all. src/middleware.ts applies this set to every Worker response.
//
// Keep the non-CSP values in sync with the `/*` block in public/_headers.

// Directives shared by both policies (static pages and SSR pages).
//
// 'unsafe-inline' (script-src): Astro inlines small hoisted <script> bundles
// and every layout ships inline bootstrap code (consent banner, GA dataLayer
// stub for Partytown). Hash-based CSP would have to be regenerated on every
// build and cannot cover SSR pages whose inline code varies per request.
// 'unsafe-inline' (style-src): React islands, framer-motion and GSAP write
// inline `style` attributes at runtime; WordPress post bodies carry hundreds
// of inline `style="..."` attributes too.
// 'unsafe-eval' is NOT allowed: nothing on the site needs it. Partytown runs
// GA inside its own sandbox iframe/worker, which is not covered by this policy.
const SHARED_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://platform.twitter.com",
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
];

// SSR pages render WordPress post bodies, which hotlink images from ~200
// different third-party hosts (checked 2026-10-21 across all 381 posts), so
// images are allowed from any HTTPS origin here. Images cannot run code, so
// this is the usual trade-off for CMS content.
export const SSR_CSP = [...SHARED_DIRECTIVES, "img-src 'self' data: blob: https:"].join('; ');

const SECURITY_HEADERS: Record<string, string> = {
  // No includeSubDomains: autodiscover.fintech24h.com (mail host at tino.vn)
  // does not answer over HTTPS, so pinning every subdomain to HTTPS is unsafe.
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  // Report-only while it is verified against every page type in production.
  // Switch the key to 'Content-Security-Policy' once no violations remain.
  'Content-Security-Policy-Report-Only': SSR_CSP,
};

/** Adds the security headers to a Worker response without overriding values a route set itself. */
export function withSecurityHeaders(response: Response): Response {
  let target = response;
  try {
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!target.headers.has(name)) target.headers.set(name, value);
    }
  } catch {
    // Response.redirect() and fetch() responses have immutable headers.
    target = new Response(response.body, response);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      if (!target.headers.has(name)) target.headers.set(name, value);
    }
  }
  return target;
}
