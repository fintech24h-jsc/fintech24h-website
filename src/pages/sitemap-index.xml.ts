import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://fintech24h.com/sitemap-0.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndexXml, {
    headers: {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff'
    }
  });
};
