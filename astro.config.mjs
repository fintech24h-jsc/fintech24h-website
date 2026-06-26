import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fintech24h.com',
  integrations: [
    tailwind(),
    react(),
    sitemap({
      customPages: [
        'https://fintech24h.com/services/kol-influencer-marketing',
        'https://fintech24h.com/services/pr-media',
        'https://fintech24h.com/services/community-management',
        'https://fintech24h.com/services/growth-airdrop',
        'https://fintech24h.com/services/business-development',
        'https://fintech24h.com/services/content-strategy-seo',
      ],
      filter: (page) => !page.includes('/wp-admin'),
    }),
  ],
  output: 'static',
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
