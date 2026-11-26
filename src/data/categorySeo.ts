// Editorial SEO copy for public blog archive pages.
// This is intentionally maintained in the frontend: WordPress category
// descriptions are empty, and archive copy should be reviewed independently
// from partner-supplied posts.

export interface CategorySeo {
  title: string;
  metaDescription: string;
  intro: string;
}

const categorySeo: Record<string, CategorySeo> = {
  knowledge: {
    title: 'Blockchain, Web3 & Fintech Knowledge',
    metaDescription: 'Practical explainers and analysis on blockchain, Web3, fintech, AI, and growth marketing for teams building in the digital economy.',
    intro: 'Practical explainers and analysis on blockchain, Web3, fintech, AI, and growth marketing. Use this archive to understand the concepts, channels, and strategic decisions behind sustainable digital-economy growth.',
  },
  news: {
    title: 'Blockchain, Web3 & Fintech News',
    metaDescription: 'News and updates on blockchain, Web3, fintech, AI, events, and ecosystem developments curated by Fintech24h.',
    intro: 'News and updates on blockchain, Web3, fintech, AI, events, and ecosystem developments relevant to founders, operators, investors, and marketing teams.',
  },
  'partner-relationship': {
    title: 'Web3 Media & Ecosystem Partnerships',
    metaDescription: 'Partnership announcements and ecosystem updates from Fintech24h and its Web3, blockchain, fintech, and event partners.',
    intro: 'Partnership announcements and ecosystem updates from Fintech24h and its Web3, blockchain, fintech, and event partners. Partner-supplied announcements are presented as partner updates, not as independent research.',
  },
  'dealmakers-pulse': {
    title: 'DealMakers Pulse — Web3 & Fintech Ecosystem Updates',
    metaDescription: 'Updates, opportunities, and ecosystem signals from the Fi24h DealMakers’ Club for Web3 and fintech decision-makers.',
    intro: 'Updates, opportunities, and ecosystem signals from the Fi24h DealMakers’ Club for Web3 and fintech decision-makers looking to build credible business relationships.',
  },
};

// Short labels and one-line blurbs for the blog's desk tabs, desk index and
// "Explore other desks" cards.
const deskCopy: Record<string, { short: string; blurb: string }> = {
  knowledge: { short: 'Knowledge', blurb: 'Frameworks, rankings and deep dives on blockchain infrastructure, fintech systems and Web3 growth.' },
  news: { short: 'News', blurb: 'Market moves and industry news that change how blockchain projects launch and grow.' },
  'partner-relationship': { short: 'Partners', blurb: 'Ecosystem partners, agency and developer rankings, and the events Fintech24h supports as a media partner.' },
  'dealmakers-pulse': { short: 'Pulse', blurb: 'Media partners and KOLs joining Fi24h Dealmakers’ Club Season 3.' },
};

export function getDeskCopy(slug: string, categoryName: string): { short: string; blurb: string } {
  return deskCopy[slug] ?? { short: categoryName, blurb: `Research and updates on ${categoryName}.` };
}

export function getCategorySeo(slug: string, categoryName: string): CategorySeo {
  return categorySeo[slug] ?? {
    title: `${categoryName} — Fintech24h Insights`,
    metaDescription: `Research, updates, and practical insights on ${categoryName} from Fintech24h.`,
    intro: `Browse research, updates, and practical insights related to ${categoryName}.`,
  };
}
