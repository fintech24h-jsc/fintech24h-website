// WordPress proxy for Cloudflare Workers
//
// Architecture:
//   fintech24h.com/@  → Pages (Astro) — KEEP AS IS
//   proxy.fintech24h.com → 172.96.186.230 GRAY CLOUD (DNS only, not proxied)
//
// resolveOverride trick:
//   - URL stays "http://fintech24h.com/..." → Host header = fintech24h.com ✅
//   - DNS resolved via proxy.fintech24h.com (gray cloud) → TCP hits 172.96.186.230 directly ✅
//   - LiteSpeed has virtual host for fintech24h.com → serves WordPress ✅

const SITE_HOST  = 'fintech24h.com';
const PROXY_HOST = 'proxy.fintech24h.com'; // MUST be gray cloud (DNS only)

const STRIP_REQ = new Set([
  'cf-connecting-ip', 'cf-ipcountry', 'cf-ray', 'cf-visitor',
  'cf-worker', 'x-forwarded-for', 'x-real-ip',
]);
const STRIP_RES = new Set([
  'transfer-encoding', 'connection', 'keep-alive', 'server',
]);

function rewriteLocation(v) {
  return v
    .replace(/^https?:\/\/172\.96\.186\.230/i, `https://${SITE_HOST}`)
    .replace(/^http:\/\//i, 'https://');
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const isAdmin  = url.pathname.startsWith('/wp-admin') || url.pathname.startsWith('/wp-login');
    const isApi    = url.pathname.startsWith('/wp-json');
    const isStatic = url.pathname.startsWith('/wp-content') || url.pathname.startsWith('/wp-includes');

    const reqHeaders = new Headers();
    for (const [k, v] of request.headers) {
      if (!STRIP_REQ.has(k.toLowerCase())) reqHeaders.set(k, v);
    }
    reqHeaders.set('X-Forwarded-Proto', 'https');
    reqHeaders.set('X-Forwarded-Host', SITE_HOST);

    const originReq = new Request(`http://${SITE_HOST}${url.pathname}${url.search}`, {
      method:  request.method,
      headers: reqHeaders,
      body:    ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
      // @ts-ignore
      cf: {
        // Gray-cloud DNS resolves proxy.fintech24h.com → 172.96.186.230 (direct IP, not Cloudflare)
        // Host header in the request = fintech24h.com (from URL) → LiteSpeed serves WordPress
        resolveOverride: PROXY_HOST,
      },
    });

    let res;
    try { res = await fetch(originReq); }
    catch (e) { return new Response(`Proxy error: ${e.message}`, { status: 502 }); }

    const resHeaders = new Headers();
    for (const [k, v] of res.headers) {
      const lk = k.toLowerCase();
      if (STRIP_RES.has(lk)) continue;
      if (lk === 'set-cookie') continue;
      if (lk === 'location') {
        resHeaders.set('Location', rewriteLocation(v));
        continue;
      }
      resHeaders.append(k, v);
    }

    for (const cookie of res.headers.getSetCookie()) {
      resHeaders.append('Set-Cookie', cookie);
    }

    if (isStatic) {
      resHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (isAdmin || isApi) {
      resHeaders.set('Cache-Control', 'no-store, private');
    }

    if (isApi) resHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(res.body, { status: res.status, headers: resHeaders });
  },
};
