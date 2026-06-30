import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fintech24h.com',
  integrations: [
    tailwind({
      // Dùng global.css làm entry point chính — chứa @tailwind directives + @layer components
      configFile: './tailwind.config.mjs',
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      // Các trang thật được @astrojs/sitemap tự quét từ build output. Trước đây
      // customPages khai 4 slug service KHÔNG tồn tại (kol-influencer-marketing,
      // community-management, growth-airdrop, content-strategy-seo) → sitemap chứa
      // URL 404. Đã bỏ; chỉ lọc bỏ route WordPress.
      filter: (page) => !page.includes('/wp-admin') && !page.includes('/wp-json'),
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
