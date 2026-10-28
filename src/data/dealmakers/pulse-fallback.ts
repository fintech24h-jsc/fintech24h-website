// src/data/dealmakers/pulse-fallback.ts
// Last-known DealMakers Pulse posts (snapshot 2026-10-28), used by PulseNews.astro
// only when the WordPress fetch fails at build time (it happened on the 2026-10-27 deploy and
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
    slug: 'newspatrolling-named-official-media-partner-of-fi24h-dealmakers-club-season-3',
    title: 'NewsPatrolling Named Official Media Partner of Fi24h DealMakers’ Club Season 3',
    date: '2026-10-28T04:21:07',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/Social-Banner-Fi24h-DealMaker-Club-V3-NewsPatrolling-768x552.png',
    alt: 'NewsPatrolling',
  },
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
    alt: 'cryptonomist fintech24h dealmakers',
  },
  {
    slug: 'vooc-zone-joins-dealmakers-club-season-3-as-media-partner',
    title: 'Vooc Zone Joins DealMakers’ Club Season 3 as Media Partner',
    date: '2026-10-23T04:30:27',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/Dealmakers-Fi24h-Partners--768x552.png',
    alt: 'Dealmakers Fi24h Partners',
  },
  {
    slug: 'fintech24h-welcomes-thecryptohype-as-official-media-partner-for-f-matching-season-3',
    title: 'Fintech24h Welcomes TheCryptoHype as Official Media Partner for F-Matching Season 3',
    date: '2026-10-05T02:56:46',
    img: 'https://fintech24h.com/wp-content/uploads/2026/10/The-Crypto-Hype-768x552.png',
    alt: 'Fintech24h Welcomes TheCryptoHype as Official Media Partner for F-Matching Season 3',
  },
  {
    slug: 'bd-gemx-joins-f-matching-season-3-as-official-media-partner',
    title: 'BD GemX Joins F-Matching Season 3 as Official Media Partner',
    date: '2026-09-22T04:43:35',
    img: 'https://fintech24h.com/wp-content/uploads/2026/09/photo_2026-09-22-09.42.09-768x552.jpeg',
    alt: 'BDGEMX dealmakers club',
  },
  {
    slug: 'captain-capital-joins-f-matching-season-3-as-official-media-partner',
    title: 'Captain Capital Joins F-Matching Season 3 as Official Media Partner',
    date: '2026-09-22T04:40:53',
    img: 'https://fintech24h.com/wp-content/uploads/2026/09/photo_2026-09-22-08.58.39-768x552.jpeg',
    alt: 'Caption capital dealmakers club',
  },
  {
    slug: 'atok-joins-f-matching-season-3-as-official-media-partner',
    title: 'Atok Joins F-Matching Season 3 as Official Media Partner',
    date: '2026-09-22T04:36:00',
    img: 'https://fintech24h.com/wp-content/uploads/2026/09/Ss3-Partner-Social-Banner-Fi24h-DealMaker-Club-V3-4-768x552.png',
    alt: 'Partner Social Banner Fi24h DealMaker Club',
  },
];
