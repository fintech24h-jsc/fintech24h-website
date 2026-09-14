// One-shot scraper that rebuilds src/data/dealmakers/members.ts and
// public/dealmakers/members/*.jpg from the public Fi24h DealMakers Club
// Season 2 archive (https://fi24h-dealmakersclub.super.site/).
//
// The site is a Super.so (Notion-powered) microsite. Its "Members" gallery
// is client-side virtualized (only visible cards exist in the live DOM), but
// the full member roster — name, role, company, website, LinkedIn, photo —
// is embedded as a JSON blob in the homepage's raw SSR HTML (two Notion
// collection views titled "Members" and "Members (1)"). Each member's own
// profile page (e.g. /hakim-bousba) is fully server-rendered and additionally
// contains their Telegram deep link: the exact welcome message posted for
// them in the Fi24h DealMakers' Club group (t.me/Fi24h_DealMakers_Club/1/N).
//
// Usage: node scripts/dealmakers-members-scraper/run.mjs
// Output: src/data/dealmakers/members.ts (data) + public/dealmakers/members/
// (photos, resized to 400px via the source CDN's own transform).
//
// Re-run this whenever new members should be picked up — it's a full
// snapshot rebuild, not incremental.

import { writeFileSync, mkdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const BASE = 'https://fi24h-dealmakersclub.super.site';
const PHOTOS_DIR = path.join(REPO_ROOT, 'public/dealmakers/members');
const DATA_OUT = path.join(REPO_ROOT, 'src/data/dealmakers/members.ts');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// ── Step 1: extract the "Members" + "Members (1)" collection blocks from
// the homepage's embedded JSON ────────────────────────────────────────────
function unescapeJsonString(s) {
  return s.replace(/\\"/g, '"');
}

function extractMembersFromHtml(html) {
  const itemsArrays = [];
  const itemsRe = /\\"items\\":\[([\s\S]*?)\],\\"/g;
  let m;
  while ((m = itemsRe.exec(html))) {
    const tail = html.slice(m.index, m.index + m[0].length + 300);
    const titleMatch = tail.match(/\\"title\\":\[\[\\"([^\\]*)\\"\]\]/);
    if (!titleMatch) continue;
    const title = titleMatch[1];
    if (!title.startsWith('Members')) continue;
    const arrText = '[' + unescapeJsonString(m[1]) + ']';
    let ids;
    try { ids = JSON.parse(arrText); } catch { continue; }
    itemsArrays.push({ title, ids });
  }

  const allIds = itemsArrays.flatMap((g) => g.ids);

  function extractBlock(id) {
    const key = `\\"${id}\\":{`;
    const start = html.indexOf(key);
    if (start === -1) return null;
    let i = start + key.length - 1;
    let depth = 0;
    let j = i;
    for (; j < html.length; j++) {
      const ch = html[j];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { j++; break; } }
    }
    try { return JSON.parse(unescapeJsonString(html.slice(i, j))); } catch { return null; }
  }

  const records = {};
  for (const id of allIds) {
    if (records[id]) continue;
    const block = extractBlock(id);
    if (block) records[id] = block;
  }
  return { itemsArrays, records };
}

function textOf(rich) {
  if (!rich) return null;
  if (Array.isArray(rich)) {
    const first = rich[0];
    if (Array.isArray(first)) return first[0] ?? null;
    if (first && typeof first === 'object' && 'value' in first) return first.value;
  }
  return null;
}

// ── Step 2: fetch each member's own page for their Telegram deep link ─────
async function fetchTelegramLink(uri) {
  const html = await fetchText(BASE + uri);
  const m = html.match(/https:\\?\/\\?\/t\.me\\?\/Fi24h_DealMakers_Club\\?\/1\\?\/(\d+)/);
  if (m) return `https://t.me/Fi24h_DealMakers_Club/1/${m[1]}`;
  const m2 = html.match(/https:\\?\/\\?\/t\.me\\?\/Fi24h_DealMakers_Club[^"'\\\s]*/);
  return m2 ? m2[0].replace(/\\\//g, '/') : null;
}

// ── Step 3: download + crop each photo ─────────────────────────────────────
// Every member's "photo" property is not a plain headshot — it's a branded
// 916×768 "Dealmakers' Club invitation card" graphic (logo, event tagline,
// QR code) with the actual headshot inset in a fixed rectangle on the left.
// That rectangle's pixel position is identical across every card (verified
// across multiple samples), so we crop it out locally with ffmpeg before
// using it as an avatar — using the raw card image would show mostly badge/
// QR code at avatar size instead of a face.
const FACE_CROP = { w: 313, h: 485, x: 92, y: 110 };

function slugify(id) {
  return id.replace(/^member-/, '').replace(/^members-1-/, '');
}

async function downloadPhoto(photoUrl, slug) {
  const res = await fetch(photoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`img HTTP ${res.status} for ${slug}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tmpFile = path.join(os.tmpdir(), `dm-member-${slug}-${Date.now()}.jpg`);
  writeFileSync(tmpFile, buf);

  const filename = `${slug}.jpg`;
  const outFile = path.join(PHOTOS_DIR, filename);
  const { w, h, x, y } = FACE_CROP;
  try {
    await execFileAsync('ffmpeg', [
      '-y', '-i', tmpFile,
      '-vf', `crop=${w}:${h}:${x}:${y},scale=300:-2`,
      '-q:v', '4',
      outFile,
    ]);
  } finally {
    unlinkSync(tmpFile);
  }
  return `/dealmakers/members/${filename}`;
}

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

async function main() {
  console.log('Fetching homepage…');
  const homeHtml = await fetchText(BASE + '/');
  const { itemsArrays, records } = extractMembersFromHtml(homeHtml);
  console.log('Groups found:', itemsArrays.map((g) => `${g.title} (${g.ids.length})`).join(', '));

  const base = [];
  for (const [id, v] of Object.entries(records)) {
    const name = v.title?.[0]?.[0];
    if (!name || name.trim().toLowerCase().startsWith('updating')) continue;
    const pv = v.propertyValues || {};
    base.push({
      id,
      name: name.trim(),
      company: textOf(pv['BwCx']),
      role: textOf(pv['RdAD']),
      linkedin: textOf(pv['B;wU']),
      website: textOf(pv['GRiM']),
      photoUrl: v.viewCovers ? Object.values(v.viewCovers)[0] : null,
      uri: v.uri,
    });
  }
  console.log('Real members found:', base.length);

  console.log('Fetching Telegram deep links…');
  let done = 0;
  const withTelegram = await mapWithConcurrency(base, 6, async (m) => {
    const telegramLink = await fetchTelegramLink(m.uri).catch(() => null);
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${base.length}`);
    return { ...m, telegramLink };
  });

  console.log('Downloading photos…');
  mkdirSync(PHOTOS_DIR, { recursive: true });
  const seenSlugs = new Set();
  done = 0;
  const final = await mapWithConcurrency(withTelegram, 6, async (m) => {
    let slug = slugify(m.id);
    let n = 2;
    while (seenSlugs.has(slug)) slug = `${slugify(m.id)}-${n++}`;
    seenSlugs.add(slug);
    let photo = null;
    try {
      photo = m.photoUrl ? await downloadPhoto(m.photoUrl, slug) : null;
    } catch (e) {
      console.warn('  photo failed for', slug, String(e));
    }
    done++;
    if (done % 20 === 0) console.log(`  ${done}/${withTelegram.length}`);
    return { ...m, slug, photo };
  });

  const clean = final
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      company: (m.company || '').trim() || null,
      role: (m.role || '').trim() || null,
      website: m.website || null,
      linkedin: m.linkedin || null,
      telegramLink: m.telegramLink || null,
      photo: m.photo,
    }))
    .filter((m) => m.photo) // drop anything whose photo failed to download
    .sort((a, b) => a.name.localeCompare(b.name));

  const header = `// Auto-generated snapshot of Fi24h DealMakers Club member directory,
// scraped from https://fi24h-dealmakersclub.super.site/ (Season 2 archive).
// This data spans all seasons (not season-specific) — re-run
// \`node scripts/dealmakers-members-scraper/run.mjs\` to refresh when new
// members join. Photos live in public/dealmakers/members/.
export interface DealMakerMember {
  slug: string;
  name: string;
  company: string | null;
  role: string | null;
  website: string | null;
  linkedin: string | null;
  telegramLink: string | null;
  photo: string;
}

export const dealMakersMembers: DealMakerMember[] = ${JSON.stringify(clean, null, 2)};
`;

  writeFileSync(DATA_OUT, header);
  console.log(`\nDone. Wrote ${clean.length} members to ${path.relative(REPO_ROOT, DATA_OUT)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
