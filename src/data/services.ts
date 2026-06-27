export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
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
    title: 'PR & Media Campaigns',
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
    id: 'community-growth',
    title: 'Community Growth & Management',
    slug: 'community-management',
    icon: 'MessageSquare',
    shortDescription: 'Scale your active user base fast with viral loops, 24/7 moderation, and structured airdrops.',
    longDescription: 'Your community is your currency. We design data-driven viral loops and provide 24/7 moderation to turn passive members into active advocates. From anti-sybil airdrops to deep engagement tracking, we handle the entire funnel.',
    features: [
      '24/7 multi-lingual moderation and proactive engagement strategies',
      'Viral referral loop design and gamified task boards (Zealy, Galxe)',
      'Sybil defense mechanisms and anti-spam security configurations',
      'Weekly analysis reports on sentiment, retention, and growth metrics'
    ],
    benefits: [
      'Safe, scam-free environments that foster investor confidence',
      'Explosive social media and on-chain transaction growth',
      'High retention rates of active, supportive community advocates'
    ],
    metrics: [
      { label: 'Members Managed', value: '100K+' },
      { label: 'Anti-Sybil Filtering', value: '98%' },
      { label: 'Avg Response Time', value: '<2 mins' }
    ]
  },
  {
    id: 'event-marketing',
    title: 'Web3 Event Marketing',
    slug: 'event-marketing',
    icon: 'Ticket',
    shortDescription: 'Host exclusive side-events, VC dinners, and hackathons that leave a lasting impact.',
    longDescription: 'Transform digital presence into real-world authority. From Token2049 side-events to private VC dinners in Tier-1 cities, we design, manage, and execute offline experiences that connect you directly with strategic partners and high-net-worth individuals.',
    features: [
      'End-to-end event conceptualization and logistical execution',
      'Curated guest list management (VCs, Founders, Tier-1 KOLs)',
      'High-impact venue sourcing and immersive brand experiences',
      'Post-event media coverage and partnership follow-up sequences'
    ],
    benefits: [
      'Direct face-time with industry leaders and potential investors',
      'Elevated brand perception through premium real-world experiences',
      'High-conversion networking environments optimized for deal-flow'
    ],
    metrics: [
      { label: 'Events Hosted', value: '50+' },
      { label: 'Tier-1 Attendees', value: '5,000+' },
      { label: 'Lead Conversion', value: '45%+' }
    ]
  },
  {
    id: 'ai-marketing',
    title: 'AI-Powered Marketing',
    slug: 'ai-marketing',
    icon: 'Cpu',
    shortDescription: 'Automate community engagement, data scraping, and sentiment analysis with specialized AI models.',
    longDescription: 'Deploy intelligence at scale. We integrate custom AI solutions to supercharge your marketing operations—from sentiment analysis bots that track community health to automated content distribution pipelines that operate with machine precision.',
    features: [
      'Custom AI bots for automated, context-aware community moderation',
      'Deep data scraping and real-time sentiment analysis on social platforms',
      'Programmatic content generation and localized distribution',
      'Predictive analytics for campaign performance and churn reduction'
    ],
    benefits: [
      '24/7 operational efficiency without scaling human headcount',
      'Data-driven insights that eliminate guesswork from marketing',
      'Hyper-personalized engagement at a massive scale'
    ],
    metrics: [
      { label: 'Automated Interactions', value: '1M+' },
      { label: 'Sentiment Accuracy', value: '95%' },
      { label: 'Operational Savings', value: '$80K/mo' }
    ]
  },
  {
    id: 'business-development',
    title: 'Business Development',
    slug: 'business-development',
    icon: 'Briefcase',
    shortDescription: 'Connect with tier-1 exchanges, VC networks, launchpads, and strategic partners globally.',
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
  }
];
