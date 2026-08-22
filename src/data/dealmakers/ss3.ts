// src/data/dealmakers/ss3.ts
// Content model for DealMakers' Club — F-Matching Season 3 (/dealmakers/ss3/).
// Everything the page renders is data-driven so logos/profiles/copy can be
// swapped without touching component code. `confirmed: false` entries render
// as neutral placeholders ("Your logo", "Confirming...") — never fake proof.

export const seasonMeta = {
  slug: 'ss3',
  seasonNumber: 3,
  name: 'F-Matching Season 3',
  status: 'active' as const,
  title: 'Join Verified Web3 & Fintech Deal Flow | DealMakers’ Club',
  description:
    'Curated, moderated intros between verified Web3/fintech Founders, Investors & Exchanges. Real deal flow, no cold outreach. Apply to join Season 3 now.',
  canonical: 'https://fintech24h.com/dealmakers/ss3/',
  keywords: 'Fintech24h DealMakers Club, F-Matching, Web3 deal flow network, fintech investor introductions, Web3 investor network Vietnam, Southeast Asia deal flow, DealMakers Club Season 3',
};

// ─── Hero partners ────────────────────────────────────────────────────────
// Capital Partner logo is intentionally unset (to be added later).
// tier hierarchy: capital (largest, center) > exchange/infrastructure/growth.

export interface HeroPartner {
  category: 'capital' | 'exchange' | 'infrastructure' | 'growth';
  label: string;
  name: string | null; // null = "not yet confirmed" placeholder
  logoUrl: string | null;
  websiteUrl?: string;
  confirmed: boolean;
}

export const heroPartners: HeroPartner[] = [
  { category: 'capital', label: 'Capital Partner', name: null, logoUrl: null, confirmed: false },
  { category: 'exchange', label: 'Exchange Partner', name: null, logoUrl: null, confirmed: false },
  { category: 'infrastructure', label: 'Infrastructure Partner', name: null, logoUrl: null, confirmed: false },
  { category: 'growth', label: 'Growth Partner', name: null, logoUrl: null, confirmed: false },
];

// ─── Featured DealMakers ──────────────────────────────────────────────────
// Illustrative / placeholder company profiles — clearly labeled "Sample
// profile" in the UI until real Season 3 DealMakers are onboarded.

export interface DealMakerProfile {
  slug: string;
  name: string;
  role: string;
  company: string;
  companyInitials: string;
  market: string;
  offerTags: string[];
  needTags: string[];
  about: string;
  weOffer: string;
  weAreLookingFor: string;
  videoUrl?: string;
  posterGradient: string; // tailwind gradient classes for the placeholder poster
  featured: boolean;
  illustrative: boolean; // true = fictional placeholder profile, not a real applicant
}

export const featuredDealMakers: DealMakerProfile[] = [
  {
    slug: 'nexa-protocol',
    name: 'Daniel Whitfield',
    role: 'Founder',
    company: 'NEXA Protocol',
    companyInitials: 'NX',
    market: 'RWA · Seed · Vietnam / Singapore',
    offerTags: ['RWA infrastructure', 'MVP tokenization'],
    needTags: ['Seed capital $500K–$1M'],
    about:
      'RWA tokenization infrastructure focused on enterprise onboarding across Vietnam and Singapore.',
    weOffer: 'MVP tokenization, RWA partner network, and pilot programs for enterprises.',
    weAreLookingFor: 'Seed capital $500K–$1M; investors with fintech / compliance experience.',
    posterGradient: 'from-[#241e17] to-[#12241c]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'horizon-ventures',
    name: 'Sofia Marín',
    role: 'Partner',
    company: 'Horizon Ventures',
    companyInitials: 'HV',
    market: 'Investment · Pre-seed · Vietnam / Singapore',
    offerTags: ['Ticket $100K–$300K'],
    needTags: ['AI & RWA deal flow'],
    about:
      'Early-stage fund prioritizing strong technical teams with regionally scalable problems.',
    weOffer: 'Ticket size $100K–$300K, fundraising strategy support, and follow-on network access.',
    weAreLookingFor: 'Pre-seed deals in AI, stablecoins, compliance, or consumer Web3.',
    posterGradient: 'from-[#2b2013] to-[#11291f]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'arcwave-exchange',
    name: 'Marcus Reyes',
    role: 'Growth Lead',
    company: 'ArcWave Exchange',
    companyInitials: 'AW',
    market: 'Exchange · Listing · Global',
    offerTags: ['Listing support'],
    needTags: ['Quality projects'],
    about:
      'Quality-first exchange supporting projects preparing for listing and liquidity expansion.',
    weOffer: 'Listing advisory, user acquisition support, and launch campaigns.',
    weAreLookingFor: 'Projects with a live product, active community, and clear token economics.',
    posterGradient: 'from-[#231a12] to-[#152317]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'vertex-labs',
    name: 'Elena Novak',
    role: 'BD Director',
    company: 'Vertex Labs',
    companyInitials: 'VX',
    market: 'Infrastructure · Developer tools · Vietnam',
    offerTags: ['Infra credits', 'Technical support'],
    needTags: ['Distribution partner'],
    about:
      'Blockchain infrastructure provider offering node, RPC, and developer tooling solutions.',
    weOffer: 'Infra credits, technical support, and co-marketing for builder teams.',
    weAreLookingFor: 'Distribution partners and ecosystem community reach in Vietnam.',
    posterGradient: 'from-[#1f2416] to-[#0f2018]',
    featured: true,
    illustrative: true,
  },
];

// ─── Last Season partners (up to 8 logo slots) ────────────────────────────
// Only the entries confirmed by the project owner carry a real name; the
// rest are neutral "Your logo" placeholders until confirmed.

export interface PartnerLogo {
  name: string | null;
  logoUrl: string | null;
  websiteUrl?: string;
  confirmed: boolean;
}

export const lastSeasonPartners: PartnerLogo[] = [
  { name: 'MEXC', logoUrl: null, confirmed: true },
  { name: 'CoinGape', logoUrl: '/dealmakers/partners/coingape.png', confirmed: true },
  { name: 'BeInCrypto', logoUrl: '/dealmakers/partners/beincrypto.png', confirmed: true },
  { name: 'Cointelegraph', logoUrl: '/dealmakers/partners/cointelegraph.png', confirmed: true },
  { name: 'Mpost', logoUrl: '/dealmakers/partners/mpost.png', confirmed: true },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
];

// ─── Media Partners (free, editorial support in exchange for logo placement) ─
// None confirmed yet — all placeholder slots.

export const mediaPartners: PartnerLogo[] = Array.from({ length: 6 }, () => ({
  name: null,
  logoUrl: null,
  confirmed: false,
}));

// ─── Qualified Listing Directory ──────────────────────────────────────────

export type DirectoryCategory = 'capital' | 'listing' | 'partner' | 'service';

export interface DirectoryProfile {
  slug: string;
  companyName: string;
  companyInitials: string;
  contactName: string;
  role: string;
  dealGoal: string;
  category: DirectoryCategory;
  tags: string[];
  sponsored: boolean;
  about: string;
  weOffer: string;
  weAreLookingFor: string;
  focusMarket: string;
  illustrative: boolean;
}

export const directoryProfiles: DirectoryProfile[] = [
  {
    slug: 'nexa',
    companyName: 'NEXA Protocol',
    companyInitials: 'NX',
    contactName: 'Daniel Whitfield',
    role: 'Founder',
    dealGoal: 'Seeking $500K–$1M',
    category: 'capital',
    tags: ['RWA', 'SEA'],
    sponsored: true,
    about: 'Real-world-asset tokenization infrastructure.',
    weOffer: 'MVP tokenization, RWA partner network.',
    weAreLookingFor: 'Seed capital $500K–$1M.',
    focusMarket: 'RWA · Seed · SEA',
    illustrative: true,
  },
  {
    slug: 'orbital',
    companyName: 'Orbital Games',
    companyInitials: 'OG',
    contactName: 'Lucas Bennett',
    role: 'Co-founder',
    dealGoal: 'Seeking listing & liquidity',
    category: 'listing',
    tags: ['GameFi', 'Global / SEA'],
    sponsored: true,
    about: 'Web3 game studio with an existing player community.',
    weOffer: 'Game IP, community, and a live-operations roadmap.',
    weAreLookingFor: 'Exchange listing, market maker, and liquidity partner.',
    focusMarket: 'GameFi · Listing · Global / SEA',
    illustrative: true,
  },
  {
    slug: 'unify',
    companyName: 'Unify Growth',
    companyInitials: 'UG',
    contactName: 'Priya Anand',
    role: 'Managing Partner',
    dealGoal: 'Community growth network',
    category: 'service',
    tags: ['Growth', 'SEA'],
    sponsored: true,
    about: 'Growth network helping Web3 companies scale community.',
    weOffer: 'KOL network, community operations, and campaign analytics.',
    weAreLookingFor: 'Protocol / exchange seeking a long-term growth partner.',
    focusMarket: 'Growth · Community · SEA',
    illustrative: true,
  },
  {
    slug: 'horizon',
    companyName: 'Horizon Ventures',
    companyInitials: 'HV',
    contactName: 'Sofia Marín',
    role: 'Partner',
    dealGoal: '$100K–$300K',
    category: 'capital',
    tags: ['Pre-seed', 'AI / Stablecoin'],
    sponsored: false,
    about: 'Early-stage venture fund.',
    weOffer: 'Ticket $100K–$300K, fundraising strategy.',
    weAreLookingFor: 'Pre-seed deals in AI, stablecoins, consumer Web3.',
    focusMarket: 'Investment · Pre-seed · Vietnam / SG',
    illustrative: true,
  },
  {
    slug: 'arcwave',
    companyName: 'ArcWave Exchange',
    companyInitials: 'AW',
    contactName: 'Marcus Reyes',
    role: 'Growth Lead',
    dealGoal: 'Quality projects for listing',
    category: 'listing',
    tags: ['Listing', 'Global'],
    sponsored: false,
    about: 'Quality-first exchange.',
    weOffer: 'Listing advisory, user acquisition.',
    weAreLookingFor: 'Projects with a live product and clear token economics.',
    focusMarket: 'Exchange · Listing · Global',
    illustrative: true,
  },
  {
    slug: 'vertex',
    companyName: 'Vertex Labs',
    companyInitials: 'VX',
    contactName: 'Elena Novak',
    role: 'BD Director',
    dealGoal: 'Distribution partner',
    category: 'partner',
    tags: ['Infrastructure', 'Vietnam'],
    sponsored: false,
    about: 'Blockchain infrastructure provider.',
    weOffer: 'Infra credits, technical support.',
    weAreLookingFor: 'Distribution and ecosystem community reach in Vietnam.',
    focusMarket: 'Infrastructure · Developer tools · Vietnam',
    illustrative: true,
  },
  {
    slug: 'meridian',
    companyName: 'Meridian Fintech',
    companyInitials: 'MF',
    contactName: 'Omar Haddad',
    role: 'CEO',
    dealGoal: 'Strategic capital',
    category: 'capital',
    tags: ['Fintech', 'SEA'],
    sponsored: false,
    about: 'Cross-border payments fintech.',
    weOffer: 'Payment rails, merchant pilot programs.',
    weAreLookingFor: 'Strategic capital and go-to-market partner.',
    focusMarket: 'Fintech · Payments · SEA',
    illustrative: true,
  },
  {
    slug: 'safeguard',
    companyName: 'SafeGuard Digital',
    companyInitials: 'SG',
    contactName: 'Nina Kowalski',
    role: 'CEO',
    dealGoal: 'Enterprise security partner',
    category: 'partner',
    tags: ['Security', 'APAC'],
    sponsored: false,
    about: 'Security, audit, and compliance solutions.',
    weOffer: 'Security review, compliance roadmap.',
    weAreLookingFor: 'Enterprise, exchange, and protocol clients needing security.',
    focusMarket: 'Security · Compliance · APAC',
    illustrative: true,
  },
  {
    slug: 'blueorbit',
    companyName: 'BlueOrbit Studio',
    companyInitials: 'BO',
    contactName: 'Ethan Cole',
    role: 'Founder',
    dealGoal: 'Product & brand partner',
    category: 'service',
    tags: ['Product', 'Web3'],
    sponsored: false,
    about: 'Product studio for Web3 teams.',
    weOffer: 'Product design, brand systems.',
    weAreLookingFor: 'Founders / protocols needing a product & brand partner.',
    focusMarket: 'Product · Brand · Web3',
    illustrative: true,
  },
  {
    slug: 'nodehouse',
    companyName: 'NodeHouse',
    companyInitials: 'NH',
    contactName: 'Grace Liu',
    role: 'Community Lead',
    dealGoal: 'Builder community partner',
    category: 'service',
    tags: ['Community', 'Vietnam'],
    sponsored: false,
    about: 'Builder-focused community.',
    weOffer: 'Developer activation, events, and builder community reach.',
    weAreLookingFor: 'Ecosystem, infrastructure, and partners reaching builders.',
    focusMarket: 'Community · Events · Vietnam',
    illustrative: true,
  },
];

// ─── Pricing packages ──────────────────────────────────────────────────────

export interface PricingPackage {
  id: 'category-partner' | 'featured-dealmaker' | 'qualified-listing';
  kicker: string;
  title: string;
  description: string;
  price: string;
  priceQualifier: string;
  highlight: boolean;
  ribbon?: string;
  benefits: string[];
  addOn?: { label: string; description: string };
  ctaLabel: string;
  ctaInterest: string;
}

export const pricingPackages: PricingPackage[] = [
  {
    id: 'category-partner',
    kicker: 'For strategic brands',
    title: 'Category Partner',
    description: 'Exclusive presence in your category as part of Season 3 deal flow.',
    price: 'From $5,000',
    priceQualifier: '/ season',
    highlight: false,
    benefits: [
      'One exclusive slot per category',
      'Logo & profile across the landing page',
      'Co-host Deal Room / strategic content',
      'Lead and introduction reporting',
    ],
    ctaLabel: 'Get Partner Deck',
    ctaInterest: 'Category Partner / Sponsorship',
  },
  {
    id: 'featured-dealmaker',
    kicker: 'For founders & companies',
    title: 'Featured DealMaker',
    description: 'A standout profile so the right people quickly understand what you do and need.',
    price: '$1,000',
    priceQualifier: '/ season',
    highlight: true,
    ribbon: 'Open now',
    benefits: [
      'Up to 2-minute intro video',
      'Featured company / founder profile',
      'We Offer & We Are Looking For',
      'Moderated Request Introduction button',
      'One social / community feature',
    ],
    ctaLabel: 'Apply as Featured',
    ctaInterest: 'Featured DealMaker ($1,000/season)',
  },
  {
    id: 'qualified-listing',
    kicker: 'For verified companies',
    title: 'Qualified Listing',
    description: 'A vetted profile in the Deal Board that receives moderated introduction requests.',
    price: '$200',
    priceQualifier: '/ season',
    highlight: false,
    benefits: [
      'One company / representative profile',
      'Clear We Offer & We Are Looking For',
      'Listed in the Qualified Directory',
    ],
    addOn: {
      label: '+$150 Sponsored',
      description: 'Priority placement with a Sponsored label.',
    },
    ctaLabel: 'Submit Qualified Listing',
    ctaInterest: 'Qualified Listing ($200/season)',
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────

export const faq: { question: string; answer: string }[] = [
  {
    question: 'What is DealMakers’ Club: F-Matching?',
    answer:
      'It’s Fintech24h’s curated matching program for Founders, Investors, Exchanges, and strategic partners in Web3/fintech. Deal signals are stated clearly and introductions are moderated, not left to an open contact directory.',
  },
  {
    question: 'Who is this program for, and who is it not for?',
    answer:
      'It fits Founders/C-level, Investors/funds, Exchanges, infrastructure providers, and growth/service partners with a clear deal signal. It’s not a fit if you only want to collect contacts for mass outreach.',
  },
  {
    question: 'What counts as a Qualified Listing?',
    answer:
      'A profile that has been reviewed and approved by the Fintech24h team for display on the Deal Board, with clear We Offer / We Are Looking For details.',
  },
  {
    question: 'What does $200 / season include?',
    answer:
      'One company or representative profile, listed in the Qualified Listing Directory for the full Season 3, plus eligibility to receive moderated Request Introductions via Fintech24h.',
  },
  {
    question: 'How is Sponsored Listing (+$150) different from a standard listing?',
    answer:
      'Sponsored Listing carries a "✦ Sponsored" label and is prioritized at the top of the Qualified Listing Directory for greater visibility.',
  },
  {
    question: 'What does Featured DealMaker ($1,000 / season) include?',
    answer:
      'An intro video up to 2 minutes, a featured profile on the page, visible We Offer / We Are Looking For, a dedicated Request Introduction button, and one feature on Fintech24h’s social/community channels.',
  },
  {
    question: 'What format should the Featured DealMaker video follow?',
    answer:
      'Up to 2 minutes, clearly stating who you are, what you’re building, and what you’re looking for. Fintech24h will send detailed technical guidelines (aspect ratio, resolution) once you apply.',
  },
  {
    question: 'How does Request Introduction work, and is contact info shared directly?',
    answer:
      'You submit a request stating your goal; Fintech24h reviews fit and asks the receiving party for consent before opening a connection. Direct contact info is never shared, and not every request is approved.',
  },
  {
    question: 'What criteria does Fintech24h use to review profiles and introductions?',
    answer:
      'Fit between both parties’ goals, stage/geography, and whether the applicant is a direct decision-maker or an authorized representative.',
  },
  {
    question: 'How do I become a Category Partner or Media Partner?',
    answer:
      'Submit the Apply to Join form and select "Category Partner," or reach out directly via Telegram or email. The Fintech24h team will send a partner deck and confirm category exclusivity.',
  },
];

// ─── Apply form: We Offer / We Are Looking For suggestion chips ───────────

export const weOfferOptions: string[] = [
  'Capital / Investment',
  'Product / Technology',
  'Exchange / Listing support',
  'Liquidity / Market making',
  'Community / Distribution',
  'Media / PR',
  'KOL / Growth',
  'Infrastructure / API',
  'Compliance / Security',
  'Market entry / Partnerships',
];

export const weAreLookingForOptions: string[] = [
  'Investment / fundraising',
  'Co-investors',
  'Exchange listing',
  'Liquidity partner',
  'Strategic partner',
  'Distribution / community',
  'Enterprise clients',
  'Product / technical partner',
  'Media / KOL support',
  'Market entry',
];

export const interestOptions: string[] = [
  'Join DealMakers’ Club',
  'Featured DealMaker ($1,000/season)',
  'Qualified Listing ($200/season)',
  'Sponsored Listing (add $150)',
  'Category Partner / Sponsorship',
  'Media Partner',
];

// ─── Telegram community join form ──────────────────────────────────────────
// A standalone, shareable page (/dealmakers/ss3/join/) so the team can send
// this link directly to a prospect for vetting, without them having to find
// a button on the full landing page first.

export const telegramGroupUrl = 'https://t.me/Fi24h_DealMakers_Club';
export const telegramGroupName = 'Fi24h DealMakers’ Club';

export const fundingStatusOptions: string[] = [
  'Looking for capital',
  'Have capital to deploy',
  'Not raising or investing right now',
];
