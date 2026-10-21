// Tailwind config for src/styles/dealmakers.css only (selected there with
// `@config`). Same theme as the main site, but content is limited to the files
// that render /dealmakers/* pages. With the global `./src/**` glob, the
// DealMakers stylesheet also carried every utility used anywhere on the main
// site: 147 KB raw, ~80% unused on these pages, all of it render-blocking.
// If a DealMakers page starts using a component from outside these paths, add
// that path here or its classes will be missing.
import base from './tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  ...base,
  content: [
    './src/layouts/DealMakersLayout.astro',
    './src/pages/dealmakers/**/*.{astro,ts,tsx}',
    './src/components/sections/dealmakers/**/*.{astro,ts,tsx}',
    './src/components/seo/**/*.astro',
    './src/components/ui/AsyncStylesheet.astro',
    './src/data/dealmakers/**/*.ts',
  ],
};
