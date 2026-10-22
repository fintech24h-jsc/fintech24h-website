// scripts/csp-hashes.mjs
// Runs at the end of every `astro build` (astro:build:done hook registered in
// astro.config.mjs), so it also runs in Cloudflare's git-connected build.
//
// Static pages are served straight from the assets binding with headers from
// dist/_headers, so their CSP cannot use a per-request nonce. Instead every
// inline <script> left in the built HTML is hashed and the placeholder
// __CSP_SCRIPT_HASHES__ in dist/_headers is replaced with the sha256 list.
// SSR pages get a nonce from src/lib/securityHeaders.ts instead.
//
// Fails the build (throws) rather than shipping a broken policy when:
//  - the placeholder is missing from dist/_headers, or
//  - a _headers line exceeds Cloudflare's 2,000 character limit (too many
//    inline scripts: move some to processed <script> tags / external files).

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const PLACEHOLDER = '__CSP_SCRIPT_HASHES__';
const MAX_HEADERS_LINE = 2000;
// Script types the browser does not execute (data blocks) — CSP script-src
// does not apply to them. `text/partytown` bodies ARE hashed: if Partytown's
// service worker is not ready in time, its fallback re-runs them as normal
// inline scripts on the main thread.
const NON_EXECUTABLE_TYPES = new Set(['application/ld+json', 'application/json']);

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name === '_worker.js') continue; // SSR bundle, not served as a page
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

export function collectInlineScriptHashes(distDir) {
  const hashes = new Map(); // hash -> first file it was seen in
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const file of htmlFiles(distDir)) {
    const html = readFileSync(file, 'utf8');
    for (let [, attrs, body] of html.matchAll(scriptRe)) {
      const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)?.[1]?.toLowerCase();
      if (type && NON_EXECUTABLE_TYPES.has(type)) continue;
      // Partytown's fallback copies only innerHTML, so a `text/partytown` script
      // with a src becomes an EMPTY inline script; allow that (it runs nothing).
      if (/\bsrc\s*=/i.test(attrs) && type !== 'text/partytown') continue;
      if (/\bsrc\s*=/i.test(attrs)) body = '';
      const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
      if (!hashes.has(hash)) hashes.set(hash, path.relative(distDir, file));
    }
  }
  return hashes;
}

export function injectCspHashes(distDir) {
  const headersPath = path.join(distDir, '_headers');
  const headers = readFileSync(headersPath, 'utf8');
  if (!headers.includes(PLACEHOLDER)) {
    throw new Error(`[csp-hashes] ${PLACEHOLDER} not found in ${headersPath}`);
  }
  const hashes = collectInlineScriptHashes(distDir);
  const updated = headers.split(PLACEHOLDER).join([...hashes.keys()].join(' '));
  const tooLong = updated.split('\n').filter((line) => line.length > MAX_HEADERS_LINE);
  if (tooLong.length) {
    throw new Error(
      `[csp-hashes] ${tooLong.length} _headers line(s) exceed ${MAX_HEADERS_LINE} chars ` +
        `(${hashes.size} inline script hashes). Move inline scripts to processed <script> tags.`,
    );
  }
  writeFileSync(headersPath, updated);
  console.log(`[csp-hashes] ${hashes.size} inline script hash(es) written to _headers`);
  for (const [hash, file] of hashes) console.log(`[csp-hashes]   ${hash} (first seen in ${file})`);
  return hashes;
}
