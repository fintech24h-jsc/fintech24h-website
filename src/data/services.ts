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
    slug: 'kol-marketing',
    icon: 'Users',
    shortDescription: 'Most KOL campaigns fail before they start. We build campaigns around audience fit, not follower count.',
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
      { label: 'Audience Fit', value: 'Vetted' },
      { label: 'Campaign Reporting', value: 'Live' },
      { label: 'Market Coverage', value: 'Global' }
    ]
  },
  {
    id: 'pr-media',
    title: 'PR & Media Campaigns',
    slug: 'pr-media',
    icon: 'FileText',
    shortDescription: 'A press release distributed to 200 outlets nobody reads does nothing. We place editorial coverage that builds credibility.',
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
      { label: 'Editorial Strategy', value: 'Focused' },
      { label: 'Coverage Reporting', value: 'Clear' },
      { label: 'Media Outreach', value: 'Targeted' }
    ]
  },
  {
    id: 'community-growth',
    title: 'Community Growth & Management',
    slug: 'community-growth',
    icon: 'MessageSquare',
    shortDescription: 'Follower count is vanity. Daily active engagement, organic sharing, and community-led growth is what moves the needle.',
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
      { label: 'Community Operations', value: 'Active' },
      { label: 'Security Design', value: 'Layered' },
      { label: 'Engagement Reporting', value: 'Weekly' }
    ]
  },
  {
    id: 'event-marketing',
    title: 'Event Marketing',
    slug: 'event-marketing',
    icon: 'Ticket',
    shortDescription: 'Conferences don\'t create opportunities. Preparation and follow-through do. We handle every layer of event marketing.',
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
      { label: 'Event Planning', value: 'End-to-End' },
      { label: 'Audience Curation', value: 'Strategic' },
      { label: 'Post-Event Follow-Up', value: 'Structured' }
    ]
  },
  {
    id: 'ai-marketing',
    title: 'AI Marketing',
    slug: 'ai-marketing',
    icon: 'Cpu',
    shortDescription: 'Every startup claims AI. Projects that win trust communicate what their AI actually does, clearly and without hype.',
    longDescription: 'Deploy intelligence at scale. We integrate custom AI solutions to supercharge your marketing operations, from sentiment analysis bots that track community health to automated content distribution pipelines that operate with machine precision.',
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
      { label: 'Workflow Automation', value: 'Scoped' },
      { label: 'Sentiment Monitoring', value: 'Continuous' },
      { label: 'Human Oversight', value: 'Built In' }
    ]
  },
  {
    id: 'business-development',
    title: 'Business Development',
    slug: 'business-development',
    icon: 'Briefcase',
    shortDescription: 'Who you integrate with, where you\'re listed, and who backs you is as important as what you\'ve built.',
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
      { label: 'Partner Mapping', value: 'Relevant' },
      { label: 'Market Entry', value: 'Planned' },
      { label: 'Introductions', value: 'Qualified' }
    ]
  }
];
