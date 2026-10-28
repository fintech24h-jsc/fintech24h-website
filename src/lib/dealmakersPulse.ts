// src/lib/dealmakersPulse.ts
// Cards for the DealMakers Pulse section (WordPress category "dealmakers-pulse").
// Shared by PulseNews.astro (build time, for the static Season 3 pages) and the
// /dealmakers/pulse.json endpoint (per request, so a post published after the
// last deploy still shows up without a new deploy).
import { getPostsByCategory, getFeaturedImage, stripHtml } from './wordpress';
import type { PulseCard } from '../data/dealmakers/pulse-fallback';

export const PULSE_SLUG = 'dealmakers-pulse';
export const PULSE_COUNT = 9;

export async function getPulseCards(count = PULSE_COUNT, attempts = 1): Promise<PulseCard[]> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const posts = (await getPostsByCategory(PULSE_SLUG, count)).slice(0, count);
    if (posts.length > 0) {
      return posts.map((p) => {
        const img = getFeaturedImage(p);
        const media: any = p._embedded?.['wp:featuredmedia']?.[0];
        const sized = media?.media_details?.sizes?.medium_large?.source_url || media?.media_details?.sizes?.large?.source_url;
        return { slug: p.slug, title: stripHtml(p.title.rendered), date: p.date, img: sized || img.url, alt: img.alt };
      });
    }
    if (attempt < attempts - 1) await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  return [];
}
