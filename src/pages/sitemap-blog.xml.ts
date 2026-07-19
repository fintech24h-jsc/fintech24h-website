// src/pages/sitemap-blog.xml.ts
// Blog sitemap — lists every /blog/{slug} post so Google can discover them.
//
// WHY THIS EXISTS: the @astrojs/sitemap integration only sees STATIC
// (prerendered) routes at build time. The blog posts are served from a
// dynamic route, so they never appear in sitemap-0.xml — meaning Google was
// never explicitly told about a single blog post. This endpoint fills that
// gap. Built at build time (same as rss.xml.ts), so it stays in sync with WP
// on every deploy and avoids the runtime WP-fetch failures documented in
// DEPLOYMENT.md (incident 2026-07-05).
//
// Registered in public/robots.txt as an extra Sitemap line, and submitted
// separately in Google Search Console.
import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/wordpress';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  const urls = posts
    .map((post) => {
      const loc = escapeXml(`https://fintech24h.com/blog/${post.slug}`);
      const lastmod = new Date(post.modified || post.date).toISOString();
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
