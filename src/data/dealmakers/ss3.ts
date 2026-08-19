// src/data/dealmakers/ss3.ts
// Content model for DealMakers' Club — F-Matching Season 3 (/dealmakers/ss3/).
// Everything the page renders is data-driven so logos/profiles/copy can be
// swapped without touching component code. `confirmed: false` entries render
// as neutral placeholders ("Your logo", "Đang xác nhận") — never fake proof.

export const seasonMeta = {
  slug: 'ss3',
  seasonNumber: 3,
  name: 'F-Matching Season 3',
  status: 'active' as const,
  title: 'DealMakers’ Club — F-Matching Season 3 | Fintech24h',
  description:
    'Fintech24h DealMakers’ Club – F-Matching Season 3. Nơi những người ra quyết định Web3 gặp nhau để tạo deal.',
  canonical: 'https://fintech24h.com/dealmakers/ss3/',
};

// ─── Hero partners ────────────────────────────────────────────────────────
// Capital Partner logo is intentionally unset (user will add it later).
// tier hierarchy: capital (largest, center) > exchange/infrastructure/growth.

export interface HeroPartner {
  category: 'capital' | 'exchange' | 'infrastructure' | 'growth';
  label: string;
  name: string | null; // null = "chưa công bố" placeholder
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
// Illustrative / placeholder company profiles — clearly labeled "Ví dụ minh
// hoạ" in the UI (per project owner instruction) until real Season 3
// DealMakers are onboarded. Video fields are optional; card shows a static
// gradient poster with a disabled play affordance when no video is set.

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
    name: 'Minh Trần',
    role: 'Founder',
    company: 'NEXA Protocol',
    companyInitials: 'NX',
    market: 'RWA · Seed · Vietnam / Singapore',
    offerTags: ['RWA infrastructure', 'MVP tokenization'],
    needTags: ['Seed capital $500K–$1M'],
    about:
      'Ví dụ minh hoạ: startup hạ tầng tokenization tài sản thực, tập trung onboarding doanh nghiệp tại Việt Nam và Singapore.',
    weOffer: 'MVP tokenization, network đối tác RWA và pilot cho doanh nghiệp.',
    weAreLookingFor: 'Seed capital $500K–$1M; nhà đầu tư có kinh nghiệm fintech / compliance.',
    posterGradient: 'from-[#1d2450] to-[#1a0e34]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'horizon-ventures',
    name: 'Anh Lê',
    role: 'Partner',
    company: 'Horizon Ventures',
    companyInitials: 'HV',
    market: 'Investment · Pre-seed · Vietnam / Singapore',
    offerTags: ['Ticket $100K–$300K'],
    needTags: ['AI & RWA deal flow'],
    about:
      'Ví dụ minh hoạ: quỹ đầu tư giai đoạn sớm, ưu tiên team kỹ thuật mạnh và bài toán có khả năng mở rộng trong khu vực.',
    weOffer: 'Ticket $100K–$300K, hỗ trợ fundraising strategy và network follow-on.',
    weAreLookingFor: 'Deal pre-seed trong AI, stablecoin, compliance hoặc consumer Web3.',
    posterGradient: 'from-[#2c1645] to-[#112b3a]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'arcwave-exchange',
    name: 'Khoa Lâm',
    role: 'Growth Lead',
    company: 'ArcWave Exchange',
    companyInitials: 'AW',
    market: 'Exchange · Listing · Global',
    offerTags: ['Listing support'],
    needTags: ['Quality projects'],
    about:
      'Ví dụ minh hoạ: exchange theo định hướng chất lượng, hỗ trợ dự án chuẩn bị listing và mở rộng thanh khoản.',
    weOffer: 'Listing advisory, user acquisition và launch campaigns.',
    weAreLookingFor: 'Dự án đã có sản phẩm, cộng đồng và token economics rõ ràng.',
    posterGradient: 'from-[#332315] to-[#1a1948]',
    featured: true,
    illustrative: true,
  },
  {
    slug: 'vertex-labs',
    name: 'Duy Nguyễn',
    role: 'BD Director',
    company: 'Vertex Labs',
    companyInitials: 'VX',
    market: 'Infrastructure · Developer tools · Vietnam',
    offerTags: ['Infra credits', 'Technical support'],
    needTags: ['Distribution partner'],
    about:
      'Ví dụ minh hoạ: đơn vị hạ tầng blockchain hỗ trợ node, RPC và giải pháp developer tooling.',
    weOffer: 'Infra credits, technical support và co-marketing cho builder.',
    weAreLookingFor: 'Distribution partner và ecosystem community tại Việt Nam.',
    posterGradient: 'from-[#142544] to-[#0d1428]',
    featured: true,
    illustrative: true,
  },
];

// ─── Last Season partners (up to 8 logo slots) ────────────────────────────
// Only the 3 confirmed by the project owner carry a real name; the rest are
// neutral "Your logo" placeholders until confirmed.

export interface PartnerLogo {
  name: string | null;
  logoUrl: string | null;
  websiteUrl?: string;
  confirmed: boolean;
}

export const lastSeasonPartners: PartnerLogo[] = [
  { name: 'MEXC', logoUrl: null, confirmed: true },
  { name: 'CoinGape', logoUrl: null, confirmed: true },
  { name: 'BeInCrypto', logoUrl: null, confirmed: true },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
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
    contactName: 'Minh Trần',
    role: 'Founder',
    dealGoal: 'Seeking $500K–$1M',
    category: 'capital',
    tags: ['RWA', 'SEA'],
    sponsored: true,
    about: 'Ví dụ minh hoạ: hạ tầng tokenization tài sản thực.',
    weOffer: 'MVP tokenization, network đối tác RWA.',
    weAreLookingFor: 'Seed capital $500K–$1M.',
    focusMarket: 'RWA · Seed · SEA',
    illustrative: true,
  },
  {
    slug: 'orbital',
    companyName: 'Orbital Games',
    companyInitials: 'OG',
    contactName: 'Hải Phạm',
    role: 'Co-founder',
    dealGoal: 'Seeking listing & liquidity',
    category: 'listing',
    tags: ['GameFi', 'Global / SEA'],
    sponsored: true,
    about: 'Ví dụ minh hoạ: studio game Web3 với cộng đồng người chơi hiện hữu.',
    weOffer: 'Game IP, cộng đồng và roadmap live operations.',
    weAreLookingFor: 'Exchange listing, market maker và liquidity partner.',
    focusMarket: 'GameFi · Listing · Global / SEA',
    illustrative: true,
  },
  {
    slug: 'unify',
    companyName: 'Unify Growth',
    companyInitials: 'UG',
    contactName: 'Linh Võ',
    role: 'Managing Partner',
    dealGoal: 'Community growth network',
    category: 'service',
    tags: ['Growth', 'SEA'],
    sponsored: true,
    about: 'Ví dụ minh hoạ: growth network hỗ trợ Web3 companies mở rộng cộng đồng.',
    weOffer: 'KOL network, community operations và campaign analytics.',
    weAreLookingFor: 'Protocol / exchange cần growth partner dài hạn.',
    focusMarket: 'Growth · Community · SEA',
    illustrative: true,
  },
  {
    slug: 'horizon',
    companyName: 'Horizon Ventures',
    companyInitials: 'HV',
    contactName: 'Anh Lê',
    role: 'Partner',
    dealGoal: '$100K–$300K',
    category: 'capital',
    tags: ['Pre-seed', 'AI / Stablecoin'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: quỹ đầu tư giai đoạn sớm.',
    weOffer: 'Ticket $100K–$300K, fundraising strategy.',
    weAreLookingFor: 'Deal pre-seed AI, stablecoin, consumer Web3.',
    focusMarket: 'Investment · Pre-seed · Vietnam / SG',
    illustrative: true,
  },
  {
    slug: 'arcwave',
    companyName: 'ArcWave Exchange',
    companyInitials: 'AW',
    contactName: 'Khoa Lâm',
    role: 'Growth Lead',
    dealGoal: 'Quality projects for listing',
    category: 'listing',
    tags: ['Listing', 'Global'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: exchange theo định hướng chất lượng.',
    weOffer: 'Listing advisory, user acquisition.',
    weAreLookingFor: 'Dự án có sản phẩm và token economics rõ ràng.',
    focusMarket: 'Exchange · Listing · Global',
    illustrative: true,
  },
  {
    slug: 'vertex',
    companyName: 'Vertex Labs',
    companyInitials: 'VX',
    contactName: 'Duy Nguyễn',
    role: 'BD Director',
    dealGoal: 'Distribution partner',
    category: 'partner',
    tags: ['Infrastructure', 'Vietnam'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: đơn vị hạ tầng blockchain.',
    weOffer: 'Infra credits, technical support.',
    weAreLookingFor: 'Distribution và ecosystem community tại Việt Nam.',
    focusMarket: 'Infrastructure · Developer tools · Vietnam',
    illustrative: true,
  },
  {
    slug: 'meridian',
    companyName: 'Meridian Fintech',
    companyInitials: 'MF',
    contactName: 'Thảo Đỗ',
    role: 'CEO',
    dealGoal: 'Strategic capital',
    category: 'capital',
    tags: ['Fintech', 'SEA'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: fintech thanh toán xuyên biên giới.',
    weOffer: 'Payment rails, merchant pilot.',
    weAreLookingFor: 'Strategic capital và đối tác go-to-market.',
    focusMarket: 'Fintech · Payments · SEA',
    illustrative: true,
  },
  {
    slug: 'safeguard',
    companyName: 'SafeGuard Digital',
    companyInitials: 'SG',
    contactName: 'Quân Bùi',
    role: 'CEO',
    dealGoal: 'Enterprise security partner',
    category: 'partner',
    tags: ['Security', 'APAC'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: giải pháp security, audit và compliance.',
    weOffer: 'Security review, compliance roadmap.',
    weAreLookingFor: 'Enterprise, exchange và protocol cần bảo mật.',
    focusMarket: 'Security · Compliance · APAC',
    illustrative: true,
  },
  {
    slug: 'blueorbit',
    companyName: 'BlueOrbit Studio',
    companyInitials: 'BO',
    contactName: 'Mai Hoàng',
    role: 'Founder',
    dealGoal: 'Product & brand partner',
    category: 'service',
    tags: ['Product', 'Web3'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: product studio cho các đội Web3.',
    weOffer: 'Product design, brand systems.',
    weAreLookingFor: 'Founder / protocol cần đối tác product & brand.',
    focusMarket: 'Product · Brand · Web3',
    illustrative: true,
  },
  {
    slug: 'nodehouse',
    companyName: 'NodeHouse',
    companyInitials: 'NH',
    contactName: 'Nam Đặng',
    role: 'Community Lead',
    dealGoal: 'Builder community partner',
    category: 'service',
    tags: ['Community', 'Vietnam'],
    sponsored: false,
    about: 'Ví dụ minh hoạ: cộng đồng dành cho builders.',
    weOffer: 'Developer activation, sự kiện và cộng đồng builders.',
    weAreLookingFor: 'Ecosystem, infrastructure và partner muốn tiếp cận builders.',
    focusMarket: 'Community · Events · Vietnam',
    illustrative: true,
  },
];

// ─── Pricing packages (per brief text — the confirmed price table) ────────

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
    description: 'Hiện diện độc quyền ở đúng nhóm ngành và trở thành một phần của deal flow.',
    price: 'Từ $5,000',
    priceQualifier: '/ season',
    highlight: false,
    benefits: [
      '01 vị trí độc quyền theo category',
      'Logo & profile xuyên suốt landing page',
      'Co-host Deal Room / nội dung chiến lược',
      'Báo cáo lead và introduction phù hợp',
    ],
    ctaLabel: 'Nhận Partner Deck',
    ctaInterest: 'Category Partner / Sponsorship',
  },
  {
    id: 'featured-dealmaker',
    kicker: 'For founders & companies',
    title: 'Featured DealMaker',
    description: 'Hồ sơ nổi bật giúp đúng người hiểu nhanh bạn đang làm gì và đang cần gì.',
    price: '$1,000',
    priceQualifier: '/ season',
    highlight: true,
    ribbon: 'Không giới hạn sớm',
    benefits: [
      'Video giới thiệu tối đa 02 phút',
      'Featured company / founder profile',
      'We Offer & We Are Looking For',
      'Nút Request Introduction có điều phối',
      '01 lần giới thiệu social / community',
    ],
    ctaLabel: 'Đăng ký Featured',
    ctaInterest: 'Featured DealMaker — $1,000/season',
  },
  {
    id: 'qualified-listing',
    kicker: 'For verified companies',
    title: 'Qualified Listing',
    description: 'Profile được kiểm duyệt, hiển thị trên Deal Board và nhận yêu cầu introduction có điều phối.',
    price: '$200',
    priceQualifier: '/ season',
    highlight: false,
    benefits: [
      '01 profile công ty / người đại diện',
      'We Offer & We Are Looking For rõ ràng',
      'Hiển thị trong Qualified Listing Directory',
    ],
    addOn: {
      label: '+$150 Sponsored',
      description: 'Nhãn nổi bật và ưu tiên vị trí hiển thị.',
    },
    ctaLabel: 'Đăng Qualified Listing',
    ctaInterest: 'Qualified Listing — $200/season',
  },
];

// ─── FAQ ───────────────────────────────────────────────────────────────────

export const faq: { question: string; answer: string }[] = [
  {
    question: 'DealMakers’ Club – F-Matching là gì?',
    answer:
      'Là chương trình kết nối có chọn lọc của Fintech24h dành cho Founder, Investor, Exchange và các đối tác chiến lược trong Web3/fintech — nơi tín hiệu deal được nêu rõ và giới thiệu được điều phối, không phải một danh bạ contact mở.',
  },
  {
    question: 'Chương trình phù hợp với ai và không phù hợp với ai?',
    answer:
      'Phù hợp với Founder/C-level, Investor/fund, Exchange, đơn vị hạ tầng và đối tác dịch vụ/growth có tín hiệu deal rõ ràng. Không phù hợp nếu bạn chỉ muốn thu thập danh sách contact để outreach hàng loạt.',
  },
  {
    question: 'Thế nào là một Qualified Listing?',
    answer:
      'Là một profile đã được đội Fintech24h rà soát và duyệt hiển thị trên Deal Board, kèm thông tin We Offer / We Are Looking For rõ ràng.',
  },
  {
    question: '$200 / season bao gồm những gì?',
    answer:
      '01 profile công ty hoặc người đại diện, hiển thị trong Qualified Listing Directory suốt Season 3, và khả năng nhận Request Introduction có điều phối qua Fintech24h.',
  },
  {
    question: 'Sponsored Listing +$150 khác gì với listing thường?',
    answer:
      'Sponsored Listing gắn nhãn “✦ Sponsored” và được ưu tiên hiển thị ở đầu Qualified Listing Directory, giúp tăng khả năng được chú ý.',
  },
  {
    question: 'Featured DealMaker $1,000 / season có những quyền lợi nào?',
    answer:
      'Video giới thiệu tối đa 2 phút, profile nổi bật trên trang, hiển thị We Offer / We Are Looking For, nút Request Introduction riêng và 01 lần giới thiệu trên kênh social/community của Fintech24h.',
  },
  {
    question: 'Video Featured DealMaker cần chuẩn bị theo format nào?',
    answer:
      'Tối đa 2 phút, nêu rõ bạn là ai, đang xây gì và đang tìm gì. Fintech24h sẽ gửi hướng dẫn kỹ thuật chi tiết (tỷ lệ khung hình, độ phân giải) khi bạn đăng ký.',
  },
  {
    question: 'Request Introduction hoạt động như thế nào và có chia sẻ contact trực tiếp không?',
    answer:
      'Bạn gửi yêu cầu nêu rõ mục tiêu; Fintech24h rà soát mức độ phù hợp và xin đồng ý từ phía nhận trước khi mở kết nối. Không chia sẻ contact trực tiếp và không phải mọi request đều được chấp thuận.',
  },
  {
    question: 'Fintech24h dựa vào tiêu chí nào để xét duyệt profile / introduction?',
    answer:
      'Mức độ phù hợp với mục tiêu hai bên, stage/geography, và việc người đăng ký có phải người ra quyết định (hoặc được uỷ quyền) hay không.',
  },
  {
    question: 'Làm thế nào để trở thành Category Partner hoặc Media Partner?',
    answer:
      'Gửi form Apply to Join và chọn mục “Category Partner” hoặc liên hệ trực tiếp qua Telegram/Email — đội Fintech24h sẽ gửi partner deck và xác nhận tính độc quyền của category bạn quan tâm.',
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
  'Tham gia DealMakers’ Club',
  'Featured DealMaker — $1,000/season',
  'Qualified Listing — $200/season',
  'Sponsored Listing — thêm $150',
  'Category Partner / Sponsorship',
  'Media Partner',
];
