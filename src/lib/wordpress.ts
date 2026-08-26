// src/lib/wordpress.ts
// WordPress Headless API Client
// WP runs in background at fintech24h.com/wp-json/
//
// NOTE: this fetches origin.fintech24h.com (gray-cloud DNS-only, ->
// 172.96.186.230) directly rather than the public fintech24h.com/wp-json/*
// path. The public path gets routed by Cloudflare to the separate
// `fintech24h-wp-proxy` Worker (Worker-to-Worker subrequest on the same
// zone), which was intermittently timing out (`WP API Error 522`) in
// production even though the origin itself responded reliably and fast to
// direct requests. Fetching the origin directly removes that unreliable
// extra hop. Caching is handled ourselves below via the Workers Cache API,
// so it doesn't matter which URL we fetch through — see fetchWP().

import { decodeHtmlEntities } from './utils';

const WP_API_BASE = (import.meta.env?.WP_API_URL || 'https://origin.fintech24h.com/wp-json/wp/v2').replace(/\/$/, '');

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf?: Record<string, any>;
  // AIOSEO exposes its saved SEO title/description on the REST response
  // itself (not post meta) — this is the CTR-optimized title editors set in
  // the AIOSEO panel, distinct from (and usually shorter than) the raw post
  // title/H1 in `title.rendered`.
  aioseo_meta_data?: {
    title?: string | null;
    description?: string | null;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      description: string;
      avatar_urls?: Record<string, string>;
    }>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: Record<string, any>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export interface CaseStudy extends WPPost {
  acf: {
    client_name: string;
    client_logo: string;
    industry: string;
    challenge: string;
    solution: string;
    result_roi: string;
    result_reach: string;
    result_leads: string;
    result_timeline: string;
    testimonial_quote: string;
    testimonial_author: string;
    testimonial_role: string;
    services_used: string[];
    featured: boolean;
  };
}

// ─── In-Memory Cache for Static Build ───────────────────────────────────────

let cachedCategories: WPCategory[] | null = null;
let cachedCaseStudies: CaseStudy[] | null = null;

// ─── Fetch Helpers ────────────────────────────────────────────────────────────
//
// NOTE ON CACHING: this fetch targets fintech24h.com/wp-json/*, which Cloudflare
// routes to the separate `fintech24h-wp-proxy` Worker (see workers/wp-proxy).
// Worker-to-Worker subrequests on the same zone bypass Cloudflare's automatic
// edge cache, so the `cf: { cacheEverything, cacheTtl }` fetch option below is
// NOT reliable here — every call was silently hitting WordPress live. Under
// real traffic (every visit to `/`, `/blog`, `/blog/[slug]` re-fetches, since
// those pages run SSR with `prerender = false`) this repeatedly triggered
// WordPress/LiteSpeed's rate limiting (added after the 2026-07 bot-flood
// incident) and *that* is what caused posts to intermittently fail and show
// mock/empty data — not a bug in the Astro fetch logic itself.
//
// Fix: cache responses explicitly with the Workers Cache API (`caches.default`),
// which we control directly and isn't subject to the Worker-to-Worker bypass.
// A short "fresh" TTL absorbs traffic bursts across visitors sharing the same
// edge location; a long-lived "stale" backup lets us keep serving real posts
// (instead of hiding the blog) if WordPress is rate-limiting or briefly down.

const FRESH_TTL_SECONDS = 180;          // normal cache window
const STALE_TTL_SECONDS = 7 * 86400;    // last-known-good fallback window (7 days)

async function fetchWP<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  url.searchParams.set('_embed', '1');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  // @ts-ignore — `caches` is a Workers runtime global, not a Node/browser type
  const cache: Cache | undefined = typeof caches !== 'undefined' ? caches.default : undefined;
  const freshKey = new Request(url.toString());
  const staleUrl = new URL(url.toString());
  staleUrl.searchParams.set('_stale_backup', '1');
  const staleKey = new Request(staleUrl.toString());

  if (cache) {
    const hit = await cache.match(freshKey);
    if (hit) return hit.json() as Promise<T>;
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Fintech24h-Astro-SSR/1.0',
        'Host': 'fintech24h.com',
      },
    });

    if (!res.ok) throw new Error(`WP API Error ${res.status}: ${endpoint}`);
    const data = await res.json();

    if (cache) {
      const body = JSON.stringify(data);
      await cache.put(freshKey, new Response(body, {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${FRESH_TTL_SECONDS}` },
      }));
      await cache.put(staleKey, new Response(body, {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${STALE_TTL_SECONDS}` },
      }));
    }

    return data as T;
  } catch (err) {
    if (cache) {
      const stale = await cache.match(staleKey);
      if (stale) {
        console.warn(`WP API fail, serving stale cache for ${endpoint}:`, err);
        return stale.json() as Promise<T>;
      }
    }
    throw err;
  }
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

// WP's REST API returns `title.rendered` already HTML-entity-encoded (e.g. a
// literal `&#8217;` for a curly apostrophe). That's fine when inserted via
// `set:html`, but breaks the moment a caller renders it as plain text —
// decode it once here so every consumer across the site gets clean text
// automatically instead of each having to remember to do it.
function decodeTitle<T extends { title: { rendered: string } }>(item: T): T {
  return { ...item, title: { rendered: decodeHtmlEntities(item.title.rendered) } };
}

// The <title>/og:title/twitter:title tags must use the CTR-optimized title
// saved in AIOSEO, not the raw post title/H1 — AIOSEO exposes it on the REST
// response itself as `aioseo_meta_data.title` (not regular post meta).
// Falls back to the post title for the (rare) post with no AIOSEO title set.
export function getSeoTitle(post: WPPost): string {
  const aioseoTitle = post.aioseo_meta_data?.title?.trim();
  return aioseoTitle ? decodeHtmlEntities(aioseoTitle) : post.title.rendered;
}

export async function getAllPosts(page = 1, perPage = 24): Promise<WPPost[]> {
  try {
    const posts = await fetchWP<WPPost[]>('/posts', {
      page: String(page),
      per_page: String(perPage),
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
    return posts.map(decodeTitle);
  } catch (err) {
    console.warn('WP API fail: getAllPosts', err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await fetchWP<WPPost[]>('/posts', { slug, status: 'publish' });
    return posts[0] ? decodeTitle(posts[0]) : null;
  } catch (err) {
    console.warn(`WP API fail: getPostBySlug ${slug}`, err);
    return null;
  }
}

export async function getPostsByCategory(categorySlug: string, perPage = 24): Promise<WPPost[]> {
  try {
    const categories = await fetchWP<WPCategory[]>('/categories', { slug: categorySlug });
    if (!categories[0]) return [];
    const posts = await fetchWP<WPPost[]>('/posts', {
      categories: String(categories[0].id),
      per_page: String(perPage),
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
    return posts.map(decodeTitle);
  } catch (err) {
    console.warn(`WP API fail: getPostsByCategory ${categorySlug}`, err);
    return [];
  }
}

export async function getRecentPosts(count = 3): Promise<WPPost[]> {
  return getAllPosts(1, count);
}

// ─── Blog Availability (used to hide blog nav/section when WP is unreachable) ─
// Memoized so Navbar + Footer + BlogHighlight share a single check per
// build/isolate instead of each triggering their own WP request (which was
// tripping WP's rate limiter when called redundantly on every static page).

let blogAvailablePromise: Promise<boolean> | null = null;

export function isBlogAvailable(): Promise<boolean> {
  if (!blogAvailablePromise) {
    blogAvailablePromise = getAllPosts(1, 1).then((posts) => posts.length > 0);
  }
  return blogAvailablePromise;
}

// ─── Case Studies (Custom Post Type) ─────────────────────────────────────────

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  if (cachedCaseStudies && cachedCaseStudies.length > 0) {
    return cachedCaseStudies;
  }

  try {
    const items = (await fetchWP<CaseStudy[]>('/case-study', {
      per_page: '100',
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    })).map(decodeTitle);
    if (items && items.length > 0) {
      cachedCaseStudies = items;
      return items;
    }
    // An empty CMS collection is not permission to publish sample claims.
    return [];
  } catch (err) {
    // Production must fail closed: publishing mock clients, ROI, or quotes is
    // materially worse than temporarily omitting this optional section.
    console.warn('WP case-study endpoint unavailable; omitting case studies.', err);
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const items = await getAllCaseStudies();
  return items.find(cs => cs.slug === slug) || null;
}

export async function getFeaturedCaseStudy(): Promise<CaseStudy | null> {
  const items = await getAllCaseStudies();
  return items.find((cs) => cs.acf?.featured) || items[0] || null;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<WPCategory[]> {
  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  try {
    const items = (await fetchWP<WPCategory[]>('/categories', { per_page: '100', hide_empty: 'true' }))
      .map((c) => ({ ...c, name: decodeHtmlEntities(c.name), description: decodeHtmlEntities(c.description) }));
    if (items && items.length > 0) {
      cachedCategories = items;
      return items;
    }
    return [];
  } catch (err) {
    console.warn('WP API fail: returning no categories in production.', err);
    return [];
  }
}

// ─── Utility: Strip HTML ─────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, '')).trim();
}

export function getExcerpt(post: WPPost, maxLength = 160): string {
  const text = stripHtml(post.excerpt.rendered || post.content.rendered);
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function getFeaturedImage(post: WPPost): { url: string; alt: string } {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return {
    url: media?.source_url || '/images/default-og.jpg',
    alt: media?.alt_text || stripHtml(post.title.rendered),
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─── Author Integrations ─────────────────────────────────────────────────────

import { team } from '../data/team';

export interface WPUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls?: Record<string, string>;
}

export function getPostAuthor(post: WPPost) {
  const wpAuthor = post._embedded?.['author']?.[0];
  
  // If no author is embedded, or the author is admin, default to Phat Vo
  const isDefaultOrAdmin = !wpAuthor || wpAuthor.name === 'admin' || wpAuthor.slug === 'admin';
  const authorName = isDefaultOrAdmin ? 'Phat Vo' : decodeHtmlEntities(wpAuthor.name);
  
  // Convert Phat Vo's slug from WordPress ('phat') to the public URL slug ('phat-vo')
  const originalSlug = isDefaultOrAdmin ? 'phat' : wpAuthor.slug;
  const authorSlug = originalSlug === 'phat' ? 'phat-vo' : originalSlug;

  // Find matching team member by slug or name
  const teamMember = team.find(m => {
    const nameMatch = m.name.toLowerCase().includes(authorName.toLowerCase()) || authorName.toLowerCase().includes(m.name.toLowerCase());
    const slugMatch = m.name.toLowerCase().replace(/\s+/g, '-') === authorSlug || (authorSlug === 'phat-vo' && m.name === 'Phat Vo');
    return nameMatch || slugMatch;
  });

  if (teamMember) {
    return {
      name: teamMember.name,
      role: teamMember.role,
      image: teamMember.image || 'https://fintech24h.com/wp-content/uploads/2026/07/Logo-Fintech24h.webp',
      slug: authorSlug,
      telegram: teamMember.telegram,
      linkedin: teamMember.linkedin,
      bio: teamMember.bio
    };
  }

  return {
    name: authorName,
    role: 'Contributor',
    image: wpAuthor?.avatar_urls?.['96'] || 'https://fintech24h.com/wp-content/uploads/2026/07/Logo-Fintech24h.webp',
    slug: authorSlug,
    telegram: 'https://telegram.me/fintech24h',
    linkedin: 'https://www.linkedin.com/company/fintech24h/',
    bio: (wpAuthor?.description && decodeHtmlEntities(wpAuthor.description)) || 'Fintech24h team member and contributor.'
  };
}

export async function getUserBySlug(slug: string): Promise<WPUser | null> {
  try {
    const users = await fetchWP<WPUser[]>('/users', { slug });
    const user = users[0];
    return user ? { ...user, name: decodeHtmlEntities(user.name), description: decodeHtmlEntities(user.description) } : null;
  } catch (err) {
    console.warn(`WP API fail: getUserBySlug ${slug}`, err);
    return null;
  }
}

export async function getPostsByAuthor(authorId: number, page = 1, perPage = 24): Promise<WPPost[]> {
  try {
    const posts = await fetchWP<WPPost[]>('/posts', {
      author: String(authorId),
      page: String(page),
      per_page: String(perPage),
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
    return posts.map(decodeTitle);
  } catch (err) {
    console.warn(`WP API fail: getPostsByAuthor ${authorId}`, err);
    return [];
  }
}
