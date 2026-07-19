// src/pages/sitemap-blog.xml.ts
// Blog sitemap — lists EVERY published /blog/{slug} post so Google can
// discover them all.
//
// WHY THIS EXISTS: the @astrojs/sitemap integration only sees STATIC
// (prerendered) routes at build time. The blog posts are served from a
// dynamic route, so they never appear in sitemap-0.xml — meaning Google was
// never explicitly told about a single blog post. This endpoint fills that
// gap and stays in sync with WordPress, reusing the same Workers cache as the
// blog itself (avoids the runtime WP-fetch failures in the 2026-07-05
// incident — see DEPLOYMENT.md).
//
// WordPress caps a REST response at 100 posts per page, so we page through the
// full corpus (currently ~236 posts) instead of listing only the first page.
// Registered in public/robots.txt and submitted in Google Search Console.
import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/wordpress';
import type { WPPost } from '../lib/wordpress';

const PER_PAGE = 100;
const MAX_PAGES = 20; // safety cap (2000 posts) so a WP glitch can't loop forever

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getEveryPost(): Promise<WPPost[]> {
  const all: WPPost[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const batch = await getAllPosts(page, PER_PAGE);
    all.push(...batch);
    // A short (or empty) page means we're done. getAllPosts returns [] on
    // error in production, so this also terminates cleanly if WordPress is
    // briefly unreachable.
    if (batch.length < PER_PAGE) break;
  }
  return all;
}

export const GET: APIRoute = async () => {
  const posts = await getEveryPost();

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
