// src/data/dealmakers/ss3.zh.ts
// Simplified Chinese (formal business/fintech register) parallel of ss3.ts
// — same shape, same keys, translated values. Proper nouns, prices, URLs,
// slugs, and "Season 3" / "FAQ" are kept in English per project decision
// (see ss3.ar.ts for the same rule applied to Arabic). Do not hand-edit
// without updating ss3.ts's shape first — src/data/dealmakers/content.ts
// assumes all locale files export an identical set of names.
import type {
  HeroPartner,
  DealMakerProfile,
  PartnerLogo,
  DirectoryProfile,
  PricingPackage,
  PartnerTrack,
  MatrixValue,
} from './ss3';

export const seasonMeta = {
  slug: 'ss3',
  seasonNumber: 3,
  name: 'F-Matching Season 3',
  status: 'active' as const,
  title: '加入经验证的 Web3 与金融科技交易流 | DealMakers’ Club',
  description:
    '在经验证的 Web3 / 金融科技创始人、投资人与交易所之间进行精选、受监督的引荐。真实的交易流，无需冷启动式陌生开发。立即申请加入 Season 3。',
  canonical: 'https://fintech24h.com/dealmakers/zh/ss3/',
  keywords: 'Fintech24h DealMakers Club, F-Matching, Web3 交易流网络, 金融科技投资人引荐, 越南 Web3 投资人网络, 东南亚交易流, DealMakers Club Season 3',
  ogImage: 'https://fintech24h.com/dealmakers/og-ss3.png',
};

export const heroPartners: HeroPartner[] = [
  { category: 'capital', label: '资本合作伙伴', name: null, logoUrl: null, confirmed: false },
  { category: 'exchange', label: '交易所合作伙伴', name: null, logoUrl: null, confirmed: false },
  { category: 'infrastructure', label: '基础设施合作伙伴', name: null, logoUrl: null, confirmed: false },
  { category: 'growth', label: '增长合作伙伴', name: null, logoUrl: null, confirmed: false },
];

export const featuredDealMakers: DealMakerProfile[] = [
  {
    slug: 'nexa-protocol',
    name: 'Daniel Whitfield',
    role: 'Founder',
    company: 'NEXA Protocol',
    companyInitials: 'NX',
    market: 'RWA · Seed · Vietnam / Singapore',
    offerTags: ['RWA 基础设施', 'MVP 代币化'],
    needTags: ['种子轮融资 50 万–100 万美元'],
    about:
      '专注于越南与新加坡企业接入的现实世界资产（RWA）代币化基础设施。',
    weOffer: 'MVP 代币化、RWA 合作伙伴网络，以及面向企业的试点项目。',
    weAreLookingFor: '种子轮融资 50 万–100 万美元；具备金融科技 / 合规经验的投资人。',
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
    offerTags: ['投资额 10 万–30 万美元'],
    needTags: ['AI 与 RWA 交易流'],
    about:
      '专注早期阶段的投资基金，优先考虑具备区域可扩展性问题的强技术团队。',
    weOffer: '投资额 10 万–30 万美元，融资策略支持，以及后续轮融资网络对接。',
    weAreLookingFor: 'AI、稳定币、合规或消费级 Web3 领域的 Pre-seed 项目。',
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
    offerTags: ['上币支持'],
    needTags: ['优质项目'],
    about:
      '以质量为先的交易所，支持正准备上币及扩大流动性的项目。',
    weOffer: '上币顾问、用户增长支持，以及上线推广活动。',
    weAreLookingFor: '拥有已上线产品、活跃社区及清晰代币经济模型的项目。',
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
    offerTags: ['基础设施额度', '技术支持'],
    needTags: ['分销合作伙伴'],
    about:
      '区块链基础设施提供商，提供节点、RPC 与开发者工具解决方案。',
    weOffer: '基础设施额度、技术支持，以及面向建设者团队的联合市场推广。',
    weAreLookingFor: '分销合作伙伴，以及在越南的生态社区触达能力。',
    posterGradient: 'from-[#1f2416] to-[#0f2018]',
    featured: true,
    illustrative: true,
  },
];

export const lastSeasonPartners: PartnerLogo[] = [
  { name: 'Cointelegraph', logoUrl: '/dealmakers/partners/cointelegraph.png', confirmed: true },
  { name: 'BeInCrypto', logoUrl: '/dealmakers/partners/beincrypto.png', confirmed: true },
  { name: 'CoinGape', logoUrl: '/dealmakers/partners/coingape.png', confirmed: true },
  { name: 'Mpost', logoUrl: '/dealmakers/partners/mpost.png', confirmed: true },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
  { name: null, logoUrl: null, confirmed: false },
];

export const mediaPartners: PartnerLogo[] = [
  { name: 'CMO Intern', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/CMO-Intern-F-matching-club-ss3-1.png', websiteUrl: 'https://cmointern.com', confirmed: true },
  { name: 'Coinstori', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/Coinstori-F-matching-club-ss3-1.png', websiteUrl: 'https://coinstori.com', confirmed: true },
  { name: 'BD Ventures', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/BD-Venture.png', websiteUrl: 'https://www.bdventures.vn/', confirmed: true },
  { name: 'Unity Hub', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/Unity-Hub.png', websiteUrl: 'https://unityhub-inc.ai/', confirmed: true },
  { name: 'BD GemX', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/BD-GemX-dealmakers-fintech24h.png', confirmed: true },
  { name: 'Captain Capital', logoUrl: 'https://fintech24h.com/wp-content/uploads/2026/09/Captain-Capital-logo-is-horizontal-and-cut-out-ver-2.png', confirmed: true },
];

export const directoryProfiles: DirectoryProfile[] = [
  {
    slug: 'nexa',
    companyName: 'NEXA Protocol',
    companyInitials: 'NX',
    contactName: 'Daniel Whitfield',
    role: 'Founder',
    dealGoal: '寻求 50 万–100 万美元融资',
    category: 'capital',
    tags: ['RWA', 'SEA'],
    sponsored: true,
    about: '现实世界资产（RWA）代币化基础设施。',
    weOffer: 'MVP 代币化、RWA 合作伙伴网络。',
    weAreLookingFor: '种子轮融资 50 万–100 万美元。',
    focusMarket: 'RWA · Seed · SEA',
    illustrative: true,
  },
  {
    slug: 'orbital',
    companyName: 'Orbital Games',
    companyInitials: 'OG',
    contactName: 'Lucas Bennett',
    role: 'Co-founder',
    dealGoal: '寻求上币与流动性支持',
    category: 'listing',
    tags: ['GameFi', 'Global / SEA'],
    sponsored: true,
    about: '拥有现有玩家社区的 Web3 游戏工作室。',
    weOffer: '游戏 IP、社区，以及运营路线图。',
    weAreLookingFor: '交易所上币、做市商，以及流动性合作伙伴。',
    focusMarket: 'GameFi · Listing · Global / SEA',
    illustrative: true,
  },
  {
    slug: 'unify',
    companyName: 'Unify Growth',
    companyInitials: 'UG',
    contactName: 'Priya Anand',
    role: 'Managing Partner',
    dealGoal: '社区增长网络',
    category: 'service',
    tags: ['Growth', 'SEA'],
    sponsored: true,
    about: '帮助 Web3 公司扩大社区规模的增长网络。',
    weOffer: 'KOL 网络、社区运营，以及活动数据分析。',
    weAreLookingFor: '寻求长期增长合作伙伴的协议方或交易所。',
    focusMarket: 'Growth · Community · SEA',
    illustrative: true,
  },
  {
    slug: 'horizon',
    companyName: 'Horizon Ventures',
    companyInitials: 'HV',
    contactName: 'Sofia Marín',
    role: 'Partner',
    dealGoal: '10 万–30 万美元',
    category: 'capital',
    tags: ['Pre-seed', 'AI / Stablecoin'],
    sponsored: false,
    about: '早期阶段风险投资基金。',
    weOffer: '投资额 10 万–30 万美元，融资策略支持。',
    weAreLookingFor: 'AI、稳定币、消费级 Web3 领域的 Pre-seed 项目。',
    focusMarket: 'Investment · Pre-seed · Vietnam / SG',
    illustrative: true,
  },
  {
    slug: 'arcwave',
    companyName: 'ArcWave Exchange',
    companyInitials: 'AW',
    contactName: 'Marcus Reyes',
    role: 'Growth Lead',
    dealGoal: '寻找优质上币项目',
    category: 'listing',
    tags: ['Listing', 'Global'],
    sponsored: false,
    about: '以质量为先的交易所。',
    weOffer: '上币顾问、用户增长支持。',
    weAreLookingFor: '拥有已上线产品及清晰代币经济模型的项目。',
    focusMarket: 'Exchange · Listing · Global',
    illustrative: true,
  },
  {
    slug: 'vertex',
    companyName: 'Vertex Labs',
    companyInitials: 'VX',
    contactName: 'Elena Novak',
    role: 'BD Director',
    dealGoal: '分销合作伙伴',
    category: 'partner',
    tags: ['Infrastructure', 'Vietnam'],
    sponsored: false,
    about: '区块链基础设施提供商。',
    weOffer: '基础设施额度、技术支持。',
    weAreLookingFor: '越南的分销及生态社区触达能力。',
    focusMarket: 'Infrastructure · Developer tools · Vietnam',
    illustrative: true,
  },
  {
    slug: 'meridian',
    companyName: 'Meridian Fintech',
    companyInitials: 'MF',
    contactName: 'Omar Haddad',
    role: 'CEO',
    dealGoal: '战略融资',
    category: 'capital',
    tags: ['Fintech', 'SEA'],
    sponsored: false,
    about: '跨境支付金融科技公司。',
    weOffer: '支付通道、商户试点项目。',
    weAreLookingFor: '战略融资及市场进入合作伙伴。',
    focusMarket: 'Fintech · Payments · SEA',
    illustrative: true,
  },
  {
    slug: 'safeguard',
    companyName: 'SafeGuard Digital',
    companyInitials: 'SG',
    contactName: 'Nina Kowalski',
    role: 'CEO',
    dealGoal: '企业安全合作伙伴',
    category: 'partner',
    tags: ['Security', 'APAC'],
    sponsored: false,
    about: '安全、审计与合规解决方案。',
    weOffer: '安全审查、合规路线图。',
    weAreLookingFor: '需要安全服务的企业、交易所及协议方客户。',
    focusMarket: 'Security · Compliance · APAC',
    illustrative: true,
  },
  {
    slug: 'blueorbit',
    companyName: 'BlueOrbit Studio',
    companyInitials: 'BO',
    contactName: 'Ethan Cole',
    role: 'Founder',
    dealGoal: '产品与品牌合作伙伴',
    category: 'service',
    tags: ['Product', 'Web3'],
    sponsored: false,
    about: '面向 Web3 团队的产品工作室。',
    weOffer: '产品设计、品牌体系。',
    weAreLookingFor: '需要产品与品牌合作伙伴的创始人 / 协议方。',
    focusMarket: 'Product · Brand · Web3',
    illustrative: true,
  },
  {
    slug: 'nodehouse',
    companyName: 'NodeHouse',
    companyInitials: 'NH',
    contactName: 'Grace Liu',
    role: 'Community Lead',
    dealGoal: '开发者社区合作伙伴',
    category: 'service',
    tags: ['Community', 'Vietnam'],
    sponsored: false,
    about: '专注开发者的社区。',
    weOffer: '开发者激励、活动组织，以及建设者社区触达。',
    weAreLookingFor: '面向开发者的生态、基础设施及合作伙伴。',
    focusMarket: 'Community · Events · Vietnam',
    illustrative: true,
  },
];

export const pricingPackages: PricingPackage[] = [
  {
    id: 'category-partner',
    kicker: '面向战略品牌',
    title: '类别合作伙伴',
    description: '在 Season 3 交易流中，独占你所在类别的曝光位置。',
    price: '5,000 美元起',
    priceQualifier: '/ 赛季',
    highlight: false,
    benefits: [
      '每个类别仅设一个独占名额',
      '登陆页全站展示品牌标识与档案',
      '联合主持 Deal Room / 战略内容',
      '获取潜客与引荐报告',
    ],
    detailLink: { href: '/dealmakers/zh/ss3/partner-benefits/', label: '查看资本 / 解决方案 / 媒体合作伙伴权益' },
    ctaLabel: '获取合作伙伴资料包',
    ctaInterest: '类别合作伙伴 / 赞助',
  },
  {
    id: 'solution-partner',
    kicker: '面向解决方案提供商',
    title: '解决方案合作伙伴',
    description: '专属通道，面向为 Season 3 项目提供上币、流动性、法律、技术或增长解决方案的团队。',
    price: '3,000 美元',
    priceQualifier: '/ 赛季 · 3 个名额',
    highlight: false,
    benefits: [
      '本赛季仅开放 3 个解决方案合作伙伴名额',
      '品牌标识登上 Season 3 媒体资料包',
      '直接引荐给合格项目',
      '联合主持 / 网络研讨会机会',
      '潜客生成与商务拓展引荐',
    ],
    detailLink: { href: '/dealmakers/zh/ss3/partner-benefits/', label: '查看解决方案合作伙伴完整权益' },
    ctaLabel: '申请成为解决方案合作伙伴',
    ctaInterest: '解决方案合作伙伴（3,000 美元 / 赛季 · 3 个名额）',
  },
  {
    id: 'featured-dealmaker',
    kicker: '面向创始人与公司',
    title: '精选 DealMaker',
    description: '一份突出的档案，让合适的人快速了解你在做什么、需要什么。',
    price: '1,000 美元',
    priceQualifier: '/ 赛季',
    highlight: true,
    ribbon: '现已开放',
    benefits: [
      '最长 2 分钟的介绍视频',
      '精选公司 / 创始人档案',
      '展示"我们提供"与"我们寻求"信息',
      '受监督的「请求引荐」按钮',
      '一次社交 / 社区专题曝光',
    ],
    ctaLabel: '申请成为精选 DealMaker',
    ctaInterest: '精选 DealMaker（每赛季 1,000 美元）',
  },
  {
    id: 'qualified-listing',
    kicker: '面向已验证企业',
    title: '资质入驻',
    description: '经审核的 Deal Board 档案，可接收受监督的引荐请求。',
    price: '200 美元',
    priceQualifier: '/ 赛季',
    highlight: false,
    benefits: [
      '一份公司 / 代表人档案',
      '清晰展示"我们提供"与"我们寻求"信息',
      '收录于资质目录中',
    ],
    addOn: {
      label: '+150 美元加价推广',
      description: '带有"推广"标签的优先展示位置。',
    },
    ctaLabel: '提交资质入驻申请',
    ctaInterest: '资质入驻（每赛季 200 美元）',
  },
];

export const partnerTracks: PartnerTrack[] = [
  {
    id: 'capital',
    icon: 'CAP',
    title: '资本合作伙伴',
    description: '面向风险投资机构、基金、家族办公室、天使投资人及投资平台。',
    benefits: [
      '品牌标识登上 Season 3 媒体资料包',
      '与合格项目直接对接',
      '与相关项目的优先匹配',
      '联合品牌公关与社交媒体发布',
    ],
    fullBenefits: [
      '品牌标识登上完整版 Season 3 媒体资料包',
      '网站上展示资本合作伙伴品牌标识',
      '专属合作伙伴档案与公司信息',
      '在 Season 3 公关报道中获得曝光',
      '与合格项目直接对接',
      '与创始人及高管的商务匹配',
      '在社交活动中获得引荐',
      '联合品牌社交媒体发布',
      '在 Fintech24h 生态系统中交叉传播',
      '可展示投资 / 融资机会',
      '与相关项目的优先匹配',
    ],
    interest: '资本合作伙伴（5,000 美元起 / 赛季）',
  },
  {
    id: 'solution',
    icon: 'SOL',
    title: '解决方案合作伙伴',
    description: '面向交易所、上币平台、做市商、法律、技术及服务提供商。每赛季限 3 个名额。',
    benefits: [
      '品牌标识登上 Season 3 媒体资料包',
      '直接引荐给合格项目',
      '联合主持 / 网络研讨会机会',
      '潜客生成与商务拓展引荐',
    ],
    fullBenefits: [
      '本赛季仅开放 3 个解决方案合作伙伴名额',
      '官方解决方案合作伙伴定位',
      '品牌标识登上 Season 3 媒体资料包',
      '在 DealMakers’ Club 上展示公司档案',
      '合作伙伴公告文章',
      '专属公关宣传机会',
      '直接引荐给合格项目',
      '项目匹配',
      '联合主持 / 网络研讨会机会',
      '社交媒体曝光',
      '生态系统内交叉推广',
      '潜客生成与商务拓展引荐',
    ],
    interest: '解决方案合作伙伴（3,000 美元 / 赛季 · 3 个名额）',
  },
  {
    id: 'media',
    icon: 'MED',
    title: '媒体合作伙伴',
    description: '面向加密货币、金融科技、商业媒体、新闻通讯、播客及社区媒体的编辑资源置换——无需支付入驻费，因此权益特意精简至核心内容。',
    benefits: [
      '网站展示品牌标识',
      '在社交媒体公告中获得曝光',
    ],
    fullBenefits: [
      '网站展示品牌标识',
      '在社交媒体公告中获得曝光',
    ],
    interest: '媒体合作伙伴',
  },
];

export const projectOnboardBenefits: string[] = [
  '收录于 DealMakers’ Club',
  '专属项目档案',
  '公司 / 项目信息',
  '机会匹配',
  '资本匹配',
  '解决方案合作伙伴匹配',
  '媒体曝光',
  '社交公告',
  '公关宣传机会',
  '商务与创始人社交',
  '对接精选全球领袖资源',
];

export const partnerBenefitsMatrix: { label: string; capital: MatrixValue; solution: MatrixValue; media: MatrixValue; project: MatrixValue }[] = [
  { label: '官方合作伙伴身份', capital: 'yes', solution: 'yes', media: 'no', project: 'yes' },
  { label: '媒体资料包品牌标识', capital: 'yes', solution: 'yes', media: 'yes', project: 'yes' },
  { label: 'DealMakers 收录', capital: 'yes', solution: 'yes', media: 'no', project: 'yes' },
  { label: '合作伙伴公告', capital: 'yes', solution: 'yes', media: 'no', project: 'no' },
  { label: '专属公关宣传', capital: 'yes', solution: 'yes', media: 'no', project: 'optional' },
  { label: '社交媒体曝光', capital: 'yes', solution: 'yes', media: 'yes', project: 'yes' },
  { label: '交叉传播', capital: 'yes', solution: 'yes', media: 'no', project: 'optional' },
  { label: '商务匹配', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: '资本匹配', capital: 'star', solution: 'no', media: 'no', project: 'star' },
  { label: '解决方案匹配', capital: 'no', solution: 'star', media: 'no', project: 'star' },
  { label: '媒体曝光', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: '创始人 / 高管社交', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: '联合主持机会', capital: 'star', solution: 'star', media: 'no', project: 'no' },
];

export const faq: { question: string; answer: string }[] = [
  {
    question: 'DealMakers’ Club: F-Matching 是什么？',
    answer:
      '这是 Fintech24h 面向 Web3 / 金融科技领域创始人、投资人、交易所及战略合作伙伴推出的精选匹配项目。交易信号被清晰陈述，引荐经过监督，而非任由公开联系目录随意使用。',
  },
  {
    question: '这个项目适合谁，不适合谁？',
    answer:
      '适合具备清晰交易信号的创始人 / 高管、投资人 / 基金、交易所、基础设施提供商，以及增长 / 服务合作伙伴。如果你只是想收集联系方式用于批量陌生开发，这里并不适合你。',
  },
  {
    question: '什么样的档案算作资质入驻？',
    answer:
      '经过 Fintech24h 团队审核批准、可在 Deal Board 上展示的档案，带有清晰的"我们提供 / 我们寻求"信息。',
  },
  {
    question: '每赛季 200 美元包含哪些内容？',
    answer:
      '一份公司或代表人档案，在整个 Season 3 期间收录于资质入驻目录，并有资格通过 Fintech24h 接收受监督的引荐请求。',
  },
  {
    question: '推广入驻（+150 美元）与标准入驻有何区别？',
    answer:
      '推广入驻带有"✦ 推广"标签，并在资质入驻目录顶部获得优先展示，以提升曝光度。',
  },
  {
    question: '精选 DealMaker（每赛季 1,000 美元）包含哪些内容？',
    answer:
      '一段最长 2 分钟的介绍视频、页面上的精选档案、可见的"我们提供 / 我们寻求"信息、专属的"请求引荐"按钮，以及一次 Fintech24h 社交 / 社区渠道的专题曝光。',
  },
  {
    question: '精选 DealMaker 视频应遵循什么格式？',
    answer:
      '时长不超过 2 分钟，需清晰说明你是谁、正在构建什么，以及正在寻找什么。Fintech24h 将在你提交申请后发送详细的技术规范指引（画幅比例、分辨率）。',
  },
  {
    question: '「请求引荐」如何运作？联系方式会被直接共享吗？',
    answer:
      '你提交一份说明目标的请求；Fintech24h 会审核匹配度，并在开启联系之前征得接收方的同意。直接联系方式永远不会被共享，也并非每个请求都会获得批准。',
  },
  {
    question: 'Fintech24h 审核档案与引荐时采用哪些标准？',
    answer:
      '双方目标、阶段 / 地域的匹配度，以及申请人是否为直接决策者或经授权的代表。',
  },
  {
    question: '如何成为类别合作伙伴或媒体合作伙伴？',
    answer:
      '提交「申请加入」表单并选择"类别合作伙伴"，或直接通过 Telegram 或邮件联系我们。Fintech24h 团队将发送合作伙伴资料包并确认类别独占权。',
  },
];

export const weOfferOptions: string[] = [
  '资本 / 投资',
  '产品 / 技术',
  '交易所 / 上币支持',
  '流动性 / 做市',
  '社区 / 分销',
  '媒体 / 公关',
  'KOL / 增长',
  '基础设施 / API',
  '合规 / 安全',
  '市场进入 / 合作伙伴关系',
];

export const weAreLookingForOptions: string[] = [
  '投资 / 融资',
  '联合投资人',
  '交易所上币',
  '流动性合作伙伴',
  '战略合作伙伴',
  '分销 / 社区',
  '企业客户',
  '产品 / 技术合作伙伴',
  '媒体 / KOL 支持',
  '市场进入',
];

export const interestOptions: string[] = [
  '加入 DealMakers’ Club',
  '精选 DealMaker（每赛季 1,000 美元）',
  '资质入驻（每赛季 200 美元）',
  '推广入驻（加价 150 美元）',
  '类别合作伙伴 / 赞助',
  '资本合作伙伴（5,000 美元起 / 赛季）',
  '解决方案合作伙伴（3,000 美元 / 赛季 · 3 个名额）',
  '媒体合作伙伴',
];

export const telegramGroupUrl = 'https://t.me/Fi24h_DealMakers_Club';
export const telegramGroupName = 'Fi24h DealMakers’ Club';

export const fundingStatusOptions: string[] = [
  '正在寻求融资',
  '有资金可供投资',
  '目前不涉及融资或投资',
];
