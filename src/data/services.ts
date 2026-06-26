export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string; // Lucide icon name or emoji representation
  shortDescription: string;
  longDescription: string;
  features: string[];
  benefits: string[];
  metrics: { label: string; value: string }[];
}

export const services: Service[] = [
  {
    id: 'kol-influencer',
    title: 'KOL & Influencer Marketing',
    slug: 'kol-influencer-marketing',
    icon: 'Users',
    shortDescription: 'Access a vetted network of 500+ Web3, Crypto, and AI influencers in Tier 1 and Tier 2 markets.',
    longDescription: 'Establish trust and generate massive reach through our global network of crypto and AI influencers. We manage the entire lifecycle from onboarding and content alignment to tracking ROI, conversions, and key engagement metrics.',
    features: [
      'Tier 1 influencer partnerships across Twitter/X, YouTube, and Telegram',
      'Regional KOL targeting (Vietnam, Singapore, UAE, Indonesia, Thailand, India)',
      'Content creation, brief review, and style optimization workflows',
      'Real-time tracking of impressions, clicks, and member registrations'
    ],
    benefits: [
      'Immediate brand visibility to highly targeted crypto investors',
      'Verified engagement rates ensuring ad-spend efficiency',
      'Localized campaigns that fit culture and language'
    ],
    metrics: [
      { label: 'Vetted Web3 KOLs', value: '500+' },
      { label: 'Avg Campaign Reach', value: '2.5M+' },
      { label: 'Conversion Boost', value: '35%+' }
    ]
  },
  {
    id: 'pr-media',
    title: 'PR & Media Coverage',
    slug: 'pr-media',
    icon: 'FileText',
    shortDescription: 'Get featured on Tier-1 financial and crypto publications: Bloomberg, CoinTelegraph, Yahoo Finance.',
    longDescription: 'Establish authority and project credibility. We write compelling narratives and pitch to leading editors on major platforms to secure premium editorial space for your product launches, updates, and fundraising announcements.',
    features: [
      'Tier-1 media placements (Bloomberg, Forbes, Yahoo Finance, CoinTelegraph, Decrypt)',
      'Press release draft writing, translations, and editorial review',
      'SEO backlink building to boost domain authority',
      'Crisis PR management and brand narrative control'
    ],
    benefits: [
      'Unmatched credibility and trust index for investors',
      'Permanent high-quality backlinks for search indexing',
      'Widespread organic distribution across crypto syndicates'
    ],
    metrics: [
      { label: 'Media Partners', value: '150+' },
      { label: 'Placements Secured', value: '1,200+' },
      { label: 'Domain Authority Increase', value: '20x+' }
    ]
  },
  {
    id: 'community-management',
    title: 'Community Management',
    slug: 'community-management',
    icon: 'MessageSquare',
    shortDescription: '24/7 moderation, engagement, and hype-building across Telegram, Discord, and Twitter.',
    longDescription: 'Your community is your currency. We provide professional community managers and moderators who operate 24/7 to welcome new users, moderate discussions, answer technical FAQs, prevent scams, and organize AMA events.',
    features: [
      '24/7 multi-lingual moderation (English, Vietnamese, Chinese, Bahasa, etc.)',
      'Weekly interactive AMA sessions, quizzes, and community rewards',
      'Advanced anti-spam and security bot configurations',
      'Weekly analysis reports on sentiment and growth analytics'
    ],
    benefits: [
      'Safe, scam-free environments that foster investor confidence',
      'High retention rates of active, supportive community advocates',
      'Direct channel to convert users to active product testers'
    ],
    metrics: [
      { label: 'Active Members Managed', value: '100K+' },
      { label: 'Scams Prevented', value: '99.9%' },
      { label: 'Avg Response Time', value: '<2 mins' }
    ]
  },
  {
    id: 'growth-airdrop',
    title: 'Growth & Airdrop Campaigns',
    slug: 'growth-airdrop',
    icon: 'TrendingUp',
    shortDescription: 'Launch viral referral, Zealy campaigns, and structured airdrops that acquire active users.',
    longDescription: 'Scale your active user base fast. We design and execute data-driven viral loops, referral schemes, and gamified task boards (Zealy, Galxe, QuestN) to reward users for on-chain interactions and social engagement.',
    features: [
      'Viral referral loop design and smart contract reward triggers',
      'Zealy, Galxe, and QuestN task board setup and optimization',
      'Sybil defense strategies to filter bot traffic and protect budget',
      'Incentivized testnet and mainnet transaction growth programs'
    ],
    benefits: [
      'Explosive social media and on-chain transaction growth',
      'High-intent user acquisition for products and protocols',
      'Gamified marketing that improves community product knowledge'
    ],
    metrics: [
      { label: 'Campaign Participants', value: '500K+' },
      { label: 'Anti-Sybil Filtering', value: '98%' },
      { label: 'On-chain Growth', value: '15x+' }
    ]
  },
  {
    id: 'business-development',
    title: 'Business Development & Partnerships',
    slug: 'business-development',
    icon: 'Briefcase',
    shortDescription: 'Connect with exchanges, VC networks, launchpads, and strategic partners globally.',
    longDescription: 'Accelerate your market entry with critical B2B partnerships. We introduce your project to key decision-makers at tier-1 launchpads, venture capital firms, market makers, and layer-1 blockchains to expand your distribution channels.',
    features: [
      'Introductions to Top 20 centralized exchanges (CEXs) and launchpads',
      'VC fundraising matching and pitch deck audit and design services',
      'Strategic partnership networking with relevant Web3 projects',
      'Market Maker onboarding and liquidity provider consultation'
    ],
    benefits: [
      'Reduced listing fees and launchpad onboarding friction',
      'Direct access to capital and strategic smart money',
      'Co-marketing opportunities with major industry leaders'
    ],
    metrics: [
      { label: 'VC Partner Network', value: '80+' },
      { label: 'Exchanges Connected', value: '25+' },
      { label: 'Capital Facilitated', value: '$12M+' }
    ]
  },
  {
    id: 'content-strategy-seo',
    title: 'Content Strategy & Technical SEO',
    slug: 'content-strategy-seo',
    icon: 'Search',
    shortDescription: 'Rank for high-intent search terms. Full-funnel content design + programmatic SEO.',
    longDescription: 'Own search engine results page (SERP) real estate. We write long-form guides, documentation, and educational content optimized for Web3 keywords to ensure consistent flow of organic traffic without reliance on paid advertising.',
    features: [
      'In-depth crypto keyword mapping and competitive analysis',
      'Astro-optimized technical SEO structure (schema, page speed)',
      'High-quality, plagiarism-free educational articles and guides',
      'Programmatic landing pages for token pairs and market data'
    ],
    benefits: [
      'Compounding flow of high-intent organic visitors',
      'Enhanced search indexation speed on Google and Bing',
      'Decreased user acquisition cost (CAC) over time'
    ],
    metrics: [
      { label: 'Monthly Organic Visits', value: '300K+' },
      { label: 'Keywords Ranked Top 3', value: '1,500+' },
      { label: 'CPC Savings', value: '$45K/mo' }
    ]
  }
];
