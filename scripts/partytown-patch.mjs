// scripts/partytown-patch.mjs
// Runs at the end of every `astro build` (astro.config.mjs, astro:build:done).
//
// Partytown (up to at least 1.0.1) writes the page's visibility state into its
// per-window environment without checking that the environment exists yet:
//   else if(o===t.DocumentVisibilityState)I[s].T=i[2];
// When a tab is hidden/shown before the worker has registered that window,
// this throws "Cannot set properties of undefined (setting 'T')" in the
// console. The patch only adds the missing existence check. If the minified
// pattern is not found (Partytown upgraded), nothing is changed and a warning
// is printed, so re-check whether the upstream bug is still there.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const FILES = ['partytown-sw.js', 'partytown-atomics.js'];
const PATTERN = /(else if\(o===t\.DocumentVisibilityState\))I\[s\]\.(\w)=i\[2\];/;

export function patchPartytown(distDir) {
  for (const name of FILES) {
    const file = path.join(distDir, '~partytown', name);
    if (!existsSync(file)) continue;
    const src = readFileSync(file, 'utf8');
    if (!PATTERN.test(src)) {
      console.warn(`[partytown-patch] pattern not found in ${name}; left unchanged`);
      continue;
    }
    writeFileSync(file, src.replace(PATTERN, (_, cond, prop) => `${cond}I[s]&&(I[s].${prop}=i[2]);`));
    console.log(`[partytown-patch] patched DocumentVisibilityState guard in ${name}`);
  }
}
