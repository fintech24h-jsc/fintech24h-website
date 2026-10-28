// src/pages/dealmakers/pulse.json.ts
// Latest DealMakers Pulse posts as JSON. The Season 3 pages are prerendered, so
// PulseNews.astro bakes in the posts that existed at deploy time and then asks
// this endpoint for the current list, so a new Pulse post appears without a
// redeploy. WordPress reads go through fetchWP's Workers cache (180 s fresh,
// 7-day stale backup); the response itself is edge-cached for 5 minutes.
export const prerender = false;
import type { APIRoute } from 'astro';
import { getPulseCards } from '../../lib/dealmakersPulse';

export const GET: APIRoute = async () => {
  const cards = await getPulseCards();
  return new Response(JSON.stringify({ cards }), {
    status: cards.length > 0 ? 200 : 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cards.length > 0 ? 'public, max-age=300' : 'no-store',
    },
  });
};
