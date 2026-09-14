// scripts/indexnow-submit.mjs
// Runs automatically after every `npm run build` (see package.json's
// "postbuild" script — npm's lifecycle hooks trigger it with no extra
// wiring). Pushes every URL in the generated sitemap to the IndexNow API,
// which fans out to every participating search engine (Bing, Yandex, Seznam,
// Naver, and others) in one call — instead of waiting for them to crawl the
// sitemap on their own schedule.
//
// Ownership of the site is proven by a key file at the domain root (see
// public/<key>.txt) rather than per-engine verification, which is why this
// covers "index nhanh nhất" for more than just Bing.
//
// Deliberately never fails the build: if the network call fails (Cloudflare's
// build sandbox blocks egress, IndexNow is down, etc.) this logs a warning
// and exits 0, since a missed indexing ping is not worth blocking a deploy.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HOST = 'fintech24h.com';
const KEY = '4e228d271f6e1393afee825f4259cd7d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(__dirname, '..', 'dist', 'sitemap-0.xml');

function extractUrls(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1]);
}

async function main() {
  if (!existsSync(sitemapPath)) {
    console.warn(`[indexnow] Skipping: ${sitemapPath} not found (build may not have produced a sitemap this run).`);
    return;
  }

  const xml = readFileSync(sitemapPath, 'utf-8');
  const urlList = extractUrls(xml);

  if (urlList.length === 0) {
    console.warn('[indexnow] Skipping: sitemap-0.xml had no <loc> entries.');
    return;
  }

  console.log(`[indexnow] Submitting ${urlList.length} URLs to IndexNow (Bing, Yandex, and other participating engines)...`);

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    });

    if (res.ok) {
      console.log(`[indexnow] Submitted successfully (HTTP ${res.status}).`);
    } else {
      const body = await res.text().catch(() => '');
      console.warn(`[indexnow] Non-OK response (HTTP ${res.status}): ${body.slice(0, 300)}`);
    }
  } catch (err) {
    console.warn(`[indexnow] Request failed, continuing build anyway: ${err instanceof Error ? err.message : err}`);
  }
}

await main();
