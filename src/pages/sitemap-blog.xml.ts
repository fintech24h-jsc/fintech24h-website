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
// Rendered per request (cached 180s by fetchWP), not baked at build time: a build
// that ran while WordPress was slow/rate-limited used to ship an EMPTY feed.
export const prerender = false;
import type { APIRoute } from 'astro';
import { getAllCategories, getAllPosts } from '../lib/wordpress';
import type { WPCategory, WPPost } from '../lib/wordpress';

const PER_PAGE = 100;
// Safety cap on how many pages we're willing to request (600 posts of
// headroom). Pages are fetched CONCURRENTLY (see below) — a single WP page
// request takes ~8.5s, and fetching pages sequentially was blowing past the
// Worker's execution time limit once the corpus grew past ~200 posts,
// which made the whole sitemap silently come back empty. Fetching them in
// parallel keeps total latency close to a single request instead of N.
const MAX_PAGES = 6;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function getEveryPost(): Promise<WPPost[]> {
  const pages = await Promise.all(
    Array.from({ length: MAX_PAGES }, (_, i) => getAllPosts(i + 1, PER_PAGE))
  );

  // Do not stop at the first short page: the spam filter in getAllPosts can
  // shrink a full WP page below PER_PAGE, which would silently truncate the
  // sitemap. Pages past the real end resolve to [], so concatenating is safe.
  const all: WPPost[] = [];
  const seen = new Set<number>();
  for (const batch of pages) {
    for (const post of batch) {
      if (!seen.has(post.id)) {
        seen.add(post.id);
        all.push(post);
      }
    }
  }
  return all;
}

export const GET: APIRoute = async () => {
  const [posts, categories] = await Promise.all([getEveryPost(), getAllCategories()]);

  // An empty sitemap is worse than none: crawlers cache it and drop URLs.
  // WordPress being slow or rate-limited must surface as a retryable 503.
  if (posts.length === 0) {
    return new Response('Sitemap temporarily unavailable', {
      status: 503,
      headers: { 'Retry-After': '300', 'Cache-Control': 'no-store' },
    });
  }

  const postUrls = posts
    .map((post) => {
      const loc = escapeXml(`https://fintech24h.com/blog/${post.slug}`);
      const lastmod = new Date(post.modified || post.date).toISOString();
      return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    })
    .join('\n');

  // Archive pages are server-rendered, so Astro's static sitemap cannot see
  // them. Including each public category here gives crawlers a direct,
  // canonical discovery path to the editorial hubs and their linked articles.
  const categoryUrls = categories
    .map((category: WPCategory) => `  <url><loc>${escapeXml(`https://fintech24h.com/blog/category/${category.slug}`)}</loc><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
    .join('\n');

  const urls = [
    '  <url><loc>https://fintech24h.com/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>',
    categoryUrls,
    postUrls,
  ].filter(Boolean).join('\n');

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

// Validators and some crawlers probe with HEAD; the old static file answered it.
export const HEAD: APIRoute = async (context) => {
  const res = await GET(context);
  return new Response(null, { status: res.status, headers: res.headers });
};
