// Picks the service page a blog post should link to, from the post's slug and
// title. Owner decision (2026-10-22): keep old "agency" blog posts live and
// point them at the matching service page instead of redirecting them.
// Rules run in order, most specific first; the hub is the fallback.

export interface RelatedService {
  href: string;
  anchor: string;
  pitch: string;
}

const RULES: { test: RegExp; service: RelatedService }[] = [
  {
    // Generic "NFT / DeFi / Web3 marketing agency" listicles: the hub covers every vertical.
    test: /\b(nft|defi|web3|crypto|blockchain|metaverse|gamefi|fintech) (marketing|branding|seo|digital marketing) (agency|agencies|company|companies|firm|firms|services)\b/,
    service: { href: '/services/', anchor: 'blockchain, DeFi and NFT marketing services', pitch: 'KOL marketing, PR, community, events, AI marketing and business development for Web3 projects.' }
  },
  {
    test: /\b(ai|artificial intelligence|chatgpt|gpt|llm|machine learning|singularity)\b/,
    service: { href: '/services/ai-marketing/', anchor: 'crypto AI marketing services', pitch: 'Supervised AI for community support, sentiment monitoring and multilingual content.' }
  },
  {
    test: /\b(pr|press|press release|media coverage|public relations|journalist|news ?wire)\b/,
    service: { href: '/services/pr-media/', anchor: 'blockchain PR agency services', pitch: 'Earned coverage in crypto, business and regional media, written and pitched by our team.' }
  },
  {
    test: /\b(kol|kols|influencer|influencers|youtuber|tiktok|creator|creators)\b/,
    service: { href: '/services/kol-marketing/', anchor: 'crypto KOL and influencer marketing', pitch: 'Vetted KOLs on X, YouTube and Telegram, briefed and reported on by our team.' }
  },
  {
    test: /\b(community|communities|discord|telegram|ambassador|ambassadors|airdrop|moderat\w*|zealy|galxe)\b/,
    service: { href: '/services/community-growth/', anchor: 'crypto community management', pitch: 'Telegram and Discord communities with moderation, quests and ambassador programs.' }
  },
  {
    test: /\b(event|events|conference|summit|expo|hackathon|token2049|side event|meetup|show|gm vietnam|blockchain week|festival)\b/,
    service: { href: '/services/event-marketing/', anchor: 'crypto event marketing services', pitch: 'Side events, sponsorships and follow-up plans that turn conferences into deals.' }
  },
  {
    test: /\b(vc|vcs|venture|investor|investors|fundrais\w*|partnership|partnerships|listing|exchange|launchpad|b2b|business development|alliance)\b/,
    service: { href: '/services/business-development/', anchor: 'Web3 business development', pitch: 'Warm introductions to exchanges, investors and ecosystem partners.' }
  },
  {
    test: /\b(token launch|tge|ico|ido|go to market|gtm|launch strategy|tokenomics|rwa)\b/,
    service: { href: '/services/custom-solutions/', anchor: 'crypto go-to-market strategy', pitch: 'One plan and one team for launches that need several channels at once.' }
  }
];

const FALLBACK: RelatedService = {
  href: '/services/',
  anchor: 'blockchain marketing services',
  pitch: 'KOL marketing, PR, community, events, AI marketing and business development for Web3 projects.'
};

export function getRelatedService(slug: string, title: string): RelatedService {
  const haystack = `${slug.replace(/-/g, ' ')} ${title}`.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
  return RULES.find((r) => r.test.test(haystack))?.service ?? FALLBACK;
}
