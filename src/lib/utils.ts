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
    const text = inner.replace(/<[^>]+>/g, '').trim();
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
