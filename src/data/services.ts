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
    longDescription: 'Reach the crypto audiences that matter through vetted KOLs on X, YouTube and Telegram. We manage the full lifecycle, from shortlisting and briefing to content review, disclosure and reporting on engagement and conversions.',
    features: [
      'Vetted KOL partnerships across X, YouTube and Telegram',
      'Regional KOL targeting (Vietnam, Singapore, UAE, Indonesia, Thailand, India)',
      'Content creation, brief review, and style optimization workflows',
      'Real-time tracking of impressions, clicks, and member registrations'
    ],
    benefits: [
      'Visibility with the crypto audiences most likely to act',
      'Audience checks before any budget is spent',
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
    shortDescription: 'A press release syndicated to feeds nobody reads does nothing. We earn editorial coverage that builds credibility.',
    longDescription: 'Establish authority and project credibility. We write compelling narratives and pitch to leading editors on major platforms to secure premium editorial space for your product launches, updates, and fundraising announcements.',
    features: [
      'Editorial placements in crypto-native, business and regional media',
      'Press release draft writing, translations, and editorial review',
      'SEO backlink building to boost domain authority',
      'Crisis PR management and brand narrative control'
    ],
    benefits: [
      'Third-party credibility with investors and partners',
      'Relevant backlinks that support search visibility',
      'Coverage that keeps working in search and AI answers'
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
    longDescription: 'Your community is your support desk, feedback loop and first line of defense. We design quests and referral loops, moderate around your members\' time zones and turn passive members into advocates, with Sybil defense built in.',
    features: [
      'Multilingual moderation and proactive engagement',
      'Viral referral loop design and gamified task boards (Zealy, Galxe)',
      'Sybil defense mechanisms and anti-spam security configurations',
      'Weekly analysis reports on sentiment, retention, and growth metrics'
    ],
    benefits: [
      'Safe, scam-free environments that foster investor confidence',
      'Active members who help each other and invite others',
      'Long-term retention of supportive community advocates'
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
    longDescription: 'Turn conference trips into relationships and deals. From side events during major conference weeks to private investor dinners, we plan, run and follow up on experiences that put you in the room with the right partners.',
    features: [
      'End-to-end event conceptualization and logistical execution',
      'Curated guest lists of investors, founders and KOLs',
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
    shortDescription: 'Crypto AI marketing with a person in the loop. AI handles routine community, monitoring and content work, and our team reviews what matters before it goes out.',
    longDescription: 'Blockchain AI marketing for crypto, Web3, fintech and AI startups. We set up AI workflows for community support, sentiment monitoring and multilingual content, agree the scope and approved data sources with you first, and keep a person reviewing anything that speaks for your brand. You get a regular report on what the AI did and what our team changed.',
    features: [
      'AI community support on Telegram and Discord, with human escalation',
      'Sentiment monitoring across X, Telegram, Reddit and Discord',
      'Multilingual posts reviewed by an editor before publishing',
      'Regular reports on what the AI handled and what we adjusted'
    ],
    benefits: [
      'Routine questions answered from your approved docs, while people handle the sensitive ones',
      'Early warning on FUD and recurring issues, checked against the facts by our team',
      'Content in the languages your markets need, without skipping human review'
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
    longDescription: 'Open the doors that matter. We prepare your project and introduce it to decision-makers at exchanges, launchpads, venture funds, market makers and Layer 1 ecosystems through people they already trust.',
    features: [
      'Introductions to exchanges and launchpads that fit your stage',
      'VC fundraising matching and pitch deck audit and design services',
      'Strategic partnership networking with relevant Web3 projects',
      'Market Maker onboarding and liquidity provider consultation'
    ],
    benefits: [
      'A well-prepared listing process with fewer surprises',
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
