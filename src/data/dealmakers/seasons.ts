// src/data/dealmakers/seasons.ts
// Registry of every DealMakers' Club / F-Matching season.
// /dealmakers/ reads this list to render one card per season (active + archived).
// A new season (ss4, ss5, ...) only needs a new entry here + a new
// src/data/dealmakers/ssN.ts + a new src/pages/dealmakers/ssN/index.astro —
// nothing else changes.

export interface SeasonMeta {
  slug: string; // matches the route folder: /dealmakers/{slug}/
  seasonNumber: number;
  name: string;
  tagline: string;
  status: 'active' | 'upcoming' | 'archived';
  href: string;
}

export const seasons: SeasonMeta[] = [
  {
    slug: 'ss3',
    seasonNumber: 3,
    name: 'F-Matching Season 3',
    tagline: 'Where Web3 decision-makers meet to make deals.',
    status: 'active',
    href: '/dealmakers/ss3/',
  },
];
