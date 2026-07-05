import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://fintech24h.com',
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [
    tailwind({
      // Dùng global.css làm entry point chính — chứa @tailwind directives + @layer components
      configFile: './tailwind.config.mjs',
      applyBaseStyles: false,
    }),
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap({
      filter: (page) => !page.includes('/wp-admin') && !page.includes('/wp-json'),
      // Priority & changefreq per URL type — helps Google prioritize crawl budget
      serialize(item) {
        const url = item.url;
        // Homepage
        if (url === 'https://fintech24h.com/' || url === 'https://fintech24h.com') {
          return { ...item, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() };
        }
        // Individual service pages
        if (/\/services\/[^/]+\/?$/.test(url)) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        // Services index
        if (/\/services\/?$/.test(url)) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        // Blog posts
        if (/\/blog\/[^/]+\/?$/.test(url) && !url.includes('/category/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        // Blog index
        if (/\/blog\/?$/.test(url)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 };
        }
        // Case studies
        if (url.includes('/case-studies/')) {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        // About & Contact
        if (url.includes('/about') || url.includes('/contact')) {
          return { ...item, changefreq: 'monthly', priority: 0.6 };
        }
        return { ...item, changefreq: 'monthly', priority: 0.5 };
      },
    }),
  ],
  build: {
    assets: '_assets',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    ssr: {
      noExternal: ['gsap'],
    },
  },
});
