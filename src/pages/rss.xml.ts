// src/pages/rss.xml.ts
// RSS 2.0 feed — auto-discovered by browsers and feed readers.
// Pulls latest 20 posts from WordPress at build time.
import type { APIRoute } from 'astro';
import { getAllPosts, getExcerpt, getFeaturedImage } from '../lib/wordpress';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();
  const latest = posts.slice(0, 20);

  const items = latest.map(post => {
    const title = post.title.rendered.replace(/<[^>]+>/g, '');
    const excerpt = getExcerpt(post, 300);
    const image = getFeaturedImage(post);
    const url = `https://fintech24h.com/blog/${post.slug}`;

    return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.date)}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
      ${image.url ? `<enclosure url="${escapeXml(image.url)}" type="image/jpeg" length="0" />` : ''}
      <author>info@fintech24h.com (Fintech24h Research Team)</author>
    </item>`;
  }).join('\n');

  const buildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Fintech24h — Blockchain &amp; Web3 Marketing Insights</title>
    <link>https://fintech24h.com</link>
    <description>Strategy, trends, and insights on Blockchain, Fintech &amp; AI marketing — KOL campaigns, PR, community growth, and Web3 SEO from the Fintech24h team.</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>info@fintech24h.com (Fintech24h)</managingEditor>
    <webMaster>info@fintech24h.com (Fintech24h)</webMaster>
    <ttl>1440</ttl>
    <atom:link href="https://fintech24h.com/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://fintech24h.com/wp-content/uploads/2026/07/Logo-Fintech24h.webp</url>
      <title>Fintech24h</title>
      <link>https://fintech24h.com</link>
      <width>144</width>
      <height>100</height>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
