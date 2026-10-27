// src/data/dealmakers/pulse-fallback.ts
// Last-known DealMakers Pulse posts, used by PulseNews.astro only when the
// WordPress fetch fails at build time (it happened on the 2026-10-27 deploy and
// the section vanished from the live page). Refresh this list when you want the
// fallback to match newer Pulse posts; normal builds read WordPress directly.

export interface PulseCard {
  slug: string;
  title: string;
  date: string;
  img: string;
  alt: string;
}

export const pulseFallback: PulseCard[] = [
  {
    slug: 'welcome-theholycoins-official-media-partner-of-fi24h-dealmakers-club-season-3',
    title: 'Welcome TheHolyCoins: Official Media Partner of Fi24h DealMakers’ Club Season 3',
    date: '2026-10-27T03:34:05',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/The-holy-coins-Fintech24h-768x552.jpeg',
    alt: 'Welcome TheHolyCoins: Official Media Partner of Fi24h DealMakers’ Club Season 3',
  },
  {
    slug: 'the-cryptonomist-joins-f-matching-season-3-as-media-partner',
    title: 'The Cryptonomist Joins F Matching Season 3 as Media Partner',
    date: '2026-10-26T01:48:00',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/cryptonomist-fintech24h-dealmakers-768x552.png',
    alt: 'The Cryptonomist joins F-Matching Season 3 as Media Partner',
  },
  {
    slug: 'vooc-zone-joins-dealmakers-club-season-3-as-media-partner',
    title: 'Vooc Zone Joins DealMakers’ Club Season 3 as Media Partner',
    date: '2026-10-23T04:30:27',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/Dealmakers-Fi24h-Partners--768x552.png',
    alt: 'Vooc Zone joins DealMakers’ Club Season 3 as Media Partner',
  },
];
