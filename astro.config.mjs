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
      // `/blog` and `/dealmakers` are dynamic routes whose public canonical
      // URL does not end in a slash. Exclude Astro's static directory forms
      // (which redirect) and add only the canonical blog hub below.
      customPages: ['https://fintech24h.com/blog'],
      // The post/category sitemap is generated at runtime from WordPress, so
      // register it in the sitemap index as well as robots.txt.
      customSitemaps: ['https://fintech24h.com/sitemap-blog.xml'],
      // Case studies are excluded until the CMS exposes verified records.
      filter: (page) => !page.includes('/wp-admin')
        && !page.includes('/wp-json')
        && !page.includes('/case-studies')
        && page !== 'https://fintech24h.com/blog/'
        && page !== 'https://fintech24h.com/dealmakers/',
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
        // Vietnam SEO pillar page — same crawl priority as a core service page
        if (url.includes('/blockchain-marketing-agency-vietnam')) {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        // DealMakers' Club — active revenue-driving campaign, not a static page
        if (/\/dealmakers\//.test(url)) {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
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
