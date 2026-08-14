import { defineMiddleware } from 'astro:middleware';

const CANONICAL_HOST = 'fintech24h.com';
const WWW_HOST = `www.${CANONICAL_HOST}`;

function canonicalPathname(pathname: string): string {
  const lowercasePath = pathname.toLowerCase();

  // Historic homepage files have a single equivalent and should not create
  // an additional hop through the legacy dynamic route.
  if (lowercasePath === '/home' || lowercasePath === '/home.html') return '/';

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
  const isBlogIndex = normalizedPathname === '/blog';

  if (isLegacyCategory) {
    target.pathname = `/blog/category/${isLegacyCategory[1]}`;
    target.search = '';
  } else {
    target.pathname = normalizedPathname;

    // The blog index intentionally has no query-string variants. Preserve the
    // existing behaviour, but collapse the URL in the same permanent redirect.
    if (isBlogIndex && target.search) target.search = '';
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
