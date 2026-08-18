import { type ClassValue, clsx } from 'clsx';
import { PureComponent } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with tailwind-merge and clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats clean numbers to standard abbreviations (e.g. 1000 -> 1.0k)
 */
export function formatCompactNumber(number: number): string {
  if (number < 1000) return String(number);
  const formatter = Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
  return formatter.format(number);
}

/**
 * Returns estimated reading time for a text block in minutes
 */
export function getReadingTime(text: string): number {
  const wordsPerMinute = 225;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

const HTML_NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

/**
 * Decodes HTML entities (numeric — decimal and hex — plus the handful of
 * named entities WordPress's REST API actually emits) back into real
 * characters. WP's `.rendered` text fields (post titles, heading text pulled
 * out of post content, etc.) come back already entity-encoded — e.g. a
 * literal `&#8217;` for a curly apostrophe. That's correct as-is when
 * inserted via `set:html` (the browser's HTML parser decodes it once), but
 * fatal when a caller strips tags and renders it as plain text through
 * Astro's `{expr}` — Astro escapes the literal `&` a second time, so the
 * page shows the raw entity code instead of the character.
 */
export function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === '#') {
      const isHex = entity[1] === 'x' || entity[1] === 'X';
      const code = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return HTML_NAMED_ENTITIES[entity] ?? match;
  });
}

export interface TocItem {
  id: string;
  text: string;
}

/**
 * Injects an `id` into every <h2> in a WordPress content HTML string (WP does
 * not add these) and returns the matching table-of-contents entries. Respects
 * any id WordPress already set instead of overwriting it.
 */
export function getTableOfContents(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = [];
  const usedSlugs = new Set<string>();

  const withIds = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const text = decodeHtmlEntities(inner.replace(/<[^>]+>/g, '').trim());
    if (!text) return match;

    const existingId = attrs.match(/\bid=["']([^"']+)["']/);
    if (existingId) {
      usedSlugs.add(existingId[1]);
      items.push({ id: existingId[1], text });
      return match;
    }

    const base = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';

    let slug = base;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${suffix++}`;
    }
    usedSlugs.add(slug);
    items.push({ id: slug, text });

    return `<h2${attrs} id="${slug}">${inner}</h2>`;
  });

  return { html: withIds, items };
}
