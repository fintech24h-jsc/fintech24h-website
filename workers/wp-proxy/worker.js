const ORIGIN_HOST = 'origin.fintech24h.com';
const SITE_HOST   = 'fintech24h.com';

const CF_STRIP_HEADERS = new Set([
  'cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor',
  'cf-worker', 'x-forwarded-for', 'x-real-ip', 'x-forwarded-proto',
]);
const RES_STRIP_HEADERS = new Set([
  'transfer-encoding', 'connection', 'keep-alive', 'server',
]);

function rewriteUrl(v) {
  return v
    .replace(/^https?:\/\/172\.96\.186\.230/i,         `https://${SITE_HOST}`)
    .replace(/^https?:\/\/origin\.fintech24h\.com/i,   `https://${SITE_HOST}`)
    .replace(/^https?:\/\/fintech24h\.com/i,           `https://${SITE_HOST}`)
    .replace(/^http:\/\//i, 'https://');
}

// Rewrite Set-Cookie: fix domain to SITE_HOST and ensure Secure flag is present.
// WordPress sets cookie Domain to the origin host; browsers reject those cookies
// when served from fintech24h.com, breaking the login session.
function rewriteCookie(cookie) {
  let result = cookie
    .replace(/;\s*domain=172\.96\.186\.230/gi,         `; Domain=${SITE_HOST}`)
    .replace(/;\s*domain=origin\.fintech24h\.com/gi,   `; Domain=${SITE_HOST}`)
    .replace(/;\s*domain=fintech24h\.com/gi,           `; Domain=${SITE_HOST}`);
  if (!/;\s*secure/i.test(result)) result += '; Secure';
  return result;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const isRestApi     = url.pathname.startsWith('/wp-json');
    const isAdminPath   = url.pathname.startsWith('/wp-admin') ||
                          url.pathname.startsWith('/wp-login') ||
                          url.pathname.startsWith('/wp-includes') ||
                          isRestApi;
    const isStaticAsset = url.pathname.startsWith('/wp-content');

    const reqHeaders = new Headers();
    for (const [k, v] of request.headers) {
      if (!CF_STRIP_HEADERS.has(k.toLowerCase())) reqHeaders.set(k, v);
    }
    reqHeaders.set('Host', SITE_HOST);
    reqHeaders.set('X-Forwarded-Host', SITE_HOST);
    reqHeaders.set('X-Forwarded-Proto', 'https');

    const originReq = new Request(`http://${ORIGIN_HOST}${url.pathname}${url.search}`, {
      method:   request.method,
      headers:  reqHeaders,
      body:     ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    });

    let res;
    try { res = await fetch(originReq); }
    catch (err) { return new Response(`Proxy error: ${err.message}`, { status: 502 }); }

    const resHeaders = new Headers();
    for (const [k, v] of res.headers) {
      const lower = k.toLowerCase();
      if (RES_STRIP_HEADERS.has(lower)) continue;
      if (lower === 'set-cookie') continue; // handled separately below
      if (lower === 'location') {
        resHeaders.set('Location', rewriteUrl(v));
      } else {
        resHeaders.append(k, v);
      }
    }

    // Rewrite each Set-Cookie header individually — Headers.append() must be
    // called per-cookie so the browser receives separate Set-Cookie lines.
    for (const cookie of res.headers.getSetCookie()) {
      resHeaders.append('Set-Cookie', rewriteCookie(cookie));
    }

    if (isStaticAsset) {
      const ct = res.headers.get('content-type') || '';
      if (ct.startsWith('image/') || ct.startsWith('video/') ||
          ct.includes('font') || ct.includes('css') || ct.includes('javascript')) {
        resHeaders.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      }
    } else if (isAdminPath) {
      resHeaders.set('Cache-Control', 'no-store, private');
    }

    if (isRestApi) resHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(res.body, { status: res.status, headers: resHeaders });
  },
};
