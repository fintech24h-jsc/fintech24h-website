import { defineMiddleware } from 'astro:middleware';
import { seasons } from './data/dealmakers/seasons';

const CANONICAL_HOST = 'fintech24h.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;
const LEGACY_PAGED_CATEGORY_SLUGS = new Set(['knowledge', 'news', 'partner-relationship']);

function canonicalPathname(pathname: string): string {
  const lowercasePath = pathname.toLowerCase();

  // Historic homepage files have a single equivalent and should not create
  // an additional hop through the legacy dynamic route.
  if (lowercasePath === '/home' || lowercasePath === '/home.html') return '/';

  // WordPress commonly exposed this underscore variant; Astro publishes the
  // canonical hyphenated sitemap index instead.
  if (lowercasePath === '/sitemap_index.xml') return '/sitemap-index.xml';

  // Dynamic blog, category and author routes are canonical without a trailing
  // slash. These routes otherwise serve both variants as separate 200 pages.
  if (
    pathname !== '/' &&
    pathname.endsWith('/') &&
    (pathname === '/blog/' || pathname.startsWith('/blog/') || pathname.startsWith('/author/'))
  ) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

export const onRequest = defineMiddleware((context, next) => {
  const target = new URL(context.url);
  const normalizedPathname = canonicalPathname(target.pathname);
  const isLegacyCategory = /^\/category\/([^/]+)\/?$/i.exec(target.pathname);
  const isLegacyPagedCategory = /^\/category\/([^/]+)\/page\/\d+\/?$/i.exec(target.pathname);
  const isLegacyBlogPage = /^\/blog\/page\/\d+\/?$/i.test(normalizedPathname);
  const isLegacyBlogFeed = /^\/blog\/feed\/?$/i.test(normalizedPathname);
  const isLegacyAdminArchive = /^\/author\/admin(?:\/page\/\d+)?\/?$/i.test(normalizedPathname);
  const isBlogIndex = normalizedPathname === '/blog';
  // With only one season, /dealmakers/ is a stub that just points at it —
  // a real 301 here beats the page's client-side meta-refresh (no flash,
  // no 1s delay, unambiguous for crawlers). Once a second season exists
  // this stops firing and /dealmakers/ becomes a real picker page again,
  // matching the `seasons.length > 1` gate in dealmakers/index.astro.
  const isDealmakersRoot = normalizedPathname === '/dealmakers' || normalizedPathname === '/dealmakers/';
  const activeSeason = seasons.find((s) => s.status === 'active') ?? seasons[0];

  if (isLegacyCategory) {
    target.pathname = `/blog/category/${isLegacyCategory[1]}`;
    target.search = '';
  } else if (isLegacyPagedCategory && LEGACY_PAGED_CATEGORY_SLUGS.has(isLegacyPagedCategory[1].toLowerCase())) {
    // The current blog has no crawlable archive pagination. Preserve the
    // topical archive instead of returning a 404 for historic WP page URLs.
    target.pathname = `/blog/category/${isLegacyPagedCategory[1].toLowerCase()}`;
    target.search = '';
  } else {
    target.pathname = normalizedPathname;

    if (isDealmakersRoot && seasons.length === 1) {
      target.pathname = activeSeason.href;
      target.search = '';
    } else if (isLegacyBlogFeed) {
      // Astro's site-wide RSS feed replaces the legacy WordPress blog feed.
      target.pathname = '/rss.xml';
      target.search = '';
    } else if (isLegacyBlogPage) {
      // Historic WordPress pagination has no one-to-one page in the current
      // blog, so consolidate it with the canonical blog index.
      target.pathname = '/blog';
      target.search = '';
    } else if (isLegacyAdminArchive) {
      // Only admin has a current author archive. Collapse its obsolete
      // pagination/query variants without guessing destinations for other
      // removed authors.
      target.pathname = '/author/admin';
      target.search = '';
      // The blog index intentionally has no query-string variants. Preserve the
      // existing behaviour, but collapse the URL in the same permanent redirect.
    } else if (isBlogIndex && target.search) {
      target.search = '';
    }
  }

  const isWrongHost = target.hostname.toLowerCase() === WWW_HOST;
  const isInsecureProtocol = target.protocol !== 'https:';
  const hasChangedUrl = target.pathname !== context.url.pathname || target.search !== context.url.search;

  // A canonical tag is only a hint, so protocol variants must redirect rather
  // than serve a second 200 response. This keeps HTTP, www, legacy paths and
  // query variants on a single permanent URL.
  if (isWrongHost || isInsecureProtocol || hasChangedUrl) {
    target.protocol = 'https:';
    target.hostname = CANONICAL_HOST;
    target.port = '';
    return Response.redirect(target, 301);
  }

  return next();
});
