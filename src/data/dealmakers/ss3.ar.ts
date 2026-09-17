// src/data/dealmakers/ss3.ar.ts
// Arabic (Modern Standard Arabic, formal Gulf/UAE B2B register) parallel of
// ss3.ts — same shape, same keys, translated values. Proper nouns, prices,
// URLs, slugs, and "Season 3" / "FAQ" are kept in English per project
// decision (see the approved translation reference). Do not hand-edit
// without updating ss3.ts's shape first — src/data/dealmakers/content.ts
// assumes both files export an identical set of names.
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
  title: 'انضم إلى تدفق صفقات موثّق في Web3 والتكنولوجيا المالية | DealMakers\' Club',
  description:
    'تعارف منسّق ومُشرَف عليه بين مؤسسين ومستثمرين ومنصات تداول موثّقة في مجالي Web3 والتكنولوجيا المالية. تدفق صفقات حقيقي دون تواصل عشوائي. قدّم طلبك للانضمام إلى Season 3 الآن.',
  canonical: 'https://fintech24h.com/dealmakers/ar/ss3/',
  keywords: 'Fintech24h DealMakers Club, F-Matching, شبكة تدفق صفقات Web3, تعارفات مستثمرين في التكنولوجيا المالية, شبكة مستثمرين Web3 في فيتنام, تدفق صفقات جنوب شرق آسيا, DealMakers Club Season 3',
  ogImage: 'https://fintech24h.com/dealmakers/og-ss3.png',
};

export const heroPartners: HeroPartner[] = [
  { category: 'capital', label: 'الشريك الرأسمالي', name: null, logoUrl: null, confirmed: false },
  { category: 'exchange', label: 'شريك منصة التداول', name: null, logoUrl: null, confirmed: false },
  { category: 'infrastructure', label: 'شريك البنية التحتية', name: null, logoUrl: null, confirmed: false },
  { category: 'growth', label: 'شريك النمو', name: null, logoUrl: null, confirmed: false },
];

export const featuredDealMakers: DealMakerProfile[] = [
  {
    slug: 'nexa-protocol',
    name: 'Daniel Whitfield',
    role: 'Founder',
    company: 'NEXA Protocol',
    companyInitials: 'NX',
    market: 'RWA · Seed · Vietnam / Singapore',
    offerTags: ['بنية تحتية للأصول الواقعية (RWA)', 'ترميز نموذج المنتج الأولي (MVP)'],
    needTags: ['تمويل تأسيسي بقيمة 500 ألف – مليون دولار'],
    about:
      'بنية تحتية لترميز الأصول الواقعية تركّز على تأهيل الشركات في فيتنام وسنغافورة.',
    weOffer: 'ترميز نموذج المنتج الأولي، وشبكة شركاء الأصول الواقعية، وبرامج تجريبية للشركات.',
    weAreLookingFor: 'تمويل تأسيسي بقيمة 500 ألف – مليون دولار؛ مستثمرون لديهم خبرة في التكنولوجيا المالية أو الامتثال.',
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
    offerTags: ['حصة استثمارية بقيمة 100–300 ألف دولار'],
    needTags: ['تدفق صفقات في الذكاء الاصطناعي والأصول الواقعية'],
    about:
      'صندوق استثماري لمراحل مبكرة يمنح الأولوية للفرق التقنية القوية التي تعالج مشكلات قابلة للتوسّع إقليميًا.',
    weOffer: 'حصة استثمارية بقيمة 100–300 ألف دولار، ودعم في استراتيجية جمع التمويل، والوصول إلى شبكة تمويل لاحق.',
    weAreLookingFor: 'صفقات في مرحلة ما قبل التأسيس ضمن الذكاء الاصطناعي، أو العملات المستقرة، أو الامتثال، أو تطبيقات Web3 الاستهلاكية.',
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
    offerTags: ['دعم الإدراج'],
    needTags: ['مشاريع ذات جودة عالية'],
    about:
      'منصة تداول تُعلي الجودة أولًا، تدعم المشاريع المستعدة للإدراج وتوسيع السيولة.',
    weOffer: 'استشارات الإدراج، ودعم اكتساب المستخدمين، وحملات الإطلاق.',
    weAreLookingFor: 'مشاريع ذات منتج فعلي قيد التشغيل، ومجتمع نشط، واقتصاد رمزي واضح.',
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
    offerTags: ['أرصدة بنية تحتية', 'دعم تقني'],
    needTags: ['شريك توزيع'],
    about:
      'مزوّد بنية تحتية لسلسلة الكتل يقدّم حلول العقد وواجهات RPC وأدوات المطورين.',
    weOffer: 'أرصدة بنية تحتية، ودعم تقني، وتسويق مشترك لفرق البناء.',
    weAreLookingFor: 'شركاء توزيع، ووصول إلى مجتمع النظام البيئي في فيتنام.',
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
  ...Array.from({ length: 4 }, () => ({
    name: null,
    logoUrl: null,
    confirmed: false,
  })),
];

export const directoryProfiles: DirectoryProfile[] = [
  {
    slug: 'nexa',
    companyName: 'NEXA Protocol',
    companyInitials: 'NX',
    contactName: 'Daniel Whitfield',
    role: 'Founder',
    dealGoal: 'يسعى إلى تمويل بقيمة 500 ألف – مليون دولار',
    category: 'capital',
    tags: ['RWA', 'SEA'],
    sponsored: true,
    about: 'بنية تحتية لترميز الأصول الواقعية.',
    weOffer: 'ترميز نموذج المنتج الأولي، وشبكة شركاء الأصول الواقعية.',
    weAreLookingFor: 'تمويل تأسيسي بقيمة 500 ألف – مليون دولار.',
    focusMarket: 'RWA · Seed · SEA',
    illustrative: true,
  },
  {
    slug: 'orbital',
    companyName: 'Orbital Games',
    companyInitials: 'OG',
    contactName: 'Lucas Bennett',
    role: 'Co-founder',
    dealGoal: 'يسعى إلى الإدراج والسيولة',
    category: 'listing',
    tags: ['GameFi', 'Global / SEA'],
    sponsored: true,
    about: 'استوديو ألعاب Web3 يمتلك مجتمع لاعبين قائمًا.',
    weOffer: 'ملكية فكرية للعبة، ومجتمع، وخارطة طريق للتشغيل الحي.',
    weAreLookingFor: 'الإدراج في منصة تداول، وصانع سوق، وشريك سيولة.',
    focusMarket: 'GameFi · Listing · Global / SEA',
    illustrative: true,
  },
  {
    slug: 'unify',
    companyName: 'Unify Growth',
    companyInitials: 'UG',
    contactName: 'Priya Anand',
    role: 'Managing Partner',
    dealGoal: 'شبكة نمو المجتمع',
    category: 'service',
    tags: ['Growth', 'SEA'],
    sponsored: true,
    about: 'شبكة نمو تساعد شركات Web3 على توسيع مجتمعاتها.',
    weOffer: 'شبكة من قادة الرأي (KOL)، وإدارة عمليات المجتمع، وتحليلات الحملات.',
    weAreLookingFor: 'بروتوكول أو منصة تداول تبحث عن شريك نمو طويل الأمد.',
    focusMarket: 'Growth · Community · SEA',
    illustrative: true,
  },
  {
    slug: 'horizon',
    companyName: 'Horizon Ventures',
    companyInitials: 'HV',
    contactName: 'Sofia Marín',
    role: 'Partner',
    dealGoal: '100–300 ألف دولار',
    category: 'capital',
    tags: ['Pre-seed', 'AI / Stablecoin'],
    sponsored: false,
    about: 'صندوق استثمار جريء لمراحل مبكرة.',
    weOffer: 'حصة استثمارية بقيمة 100–300 ألف دولار، واستراتيجية جمع التمويل.',
    weAreLookingFor: 'صفقات في مرحلة ما قبل التأسيس ضمن الذكاء الاصطناعي، والعملات المستقرة، وتطبيقات Web3 الاستهلاكية.',
    focusMarket: 'Investment · Pre-seed · Vietnam / SG',
    illustrative: true,
  },
  {
    slug: 'arcwave',
    companyName: 'ArcWave Exchange',
    companyInitials: 'AW',
    contactName: 'Marcus Reyes',
    role: 'Growth Lead',
    dealGoal: 'مشاريع ذات جودة عالية للإدراج',
    category: 'listing',
    tags: ['Listing', 'Global'],
    sponsored: false,
    about: 'منصة تداول تُعلي الجودة أولًا.',
    weOffer: 'استشارات الإدراج، واكتساب المستخدمين.',
    weAreLookingFor: 'مشاريع ذات منتج فعلي قيد التشغيل واقتصاد رمزي واضح.',
    focusMarket: 'Exchange · Listing · Global',
    illustrative: true,
  },
  {
    slug: 'vertex',
    companyName: 'Vertex Labs',
    companyInitials: 'VX',
    contactName: 'Elena Novak',
    role: 'BD Director',
    dealGoal: 'شريك توزيع',
    category: 'partner',
    tags: ['Infrastructure', 'Vietnam'],
    sponsored: false,
    about: 'مزوّد بنية تحتية لسلسلة الكتل.',
    weOffer: 'أرصدة بنية تحتية، ودعم تقني.',
    weAreLookingFor: 'التوزيع والوصول إلى مجتمع النظام البيئي في فيتنام.',
    focusMarket: 'Infrastructure · Developer tools · Vietnam',
    illustrative: true,
  },
  {
    slug: 'meridian',
    companyName: 'Meridian Fintech',
    companyInitials: 'MF',
    contactName: 'Omar Haddad',
    role: 'CEO',
    dealGoal: 'تمويل استراتيجي',
    category: 'capital',
    tags: ['Fintech', 'SEA'],
    sponsored: false,
    about: 'شركة تكنولوجيا مالية للمدفوعات عبر الحدود.',
    weOffer: 'قنوات دفع، وبرامج تجريبية للتجار.',
    weAreLookingFor: 'تمويل استراتيجي وشريك لدخول السوق.',
    focusMarket: 'Fintech · Payments · SEA',
    illustrative: true,
  },
  {
    slug: 'safeguard',
    companyName: 'SafeGuard Digital',
    companyInitials: 'SG',
    contactName: 'Nina Kowalski',
    role: 'CEO',
    dealGoal: 'شريك أمني للشركات',
    category: 'partner',
    tags: ['Security', 'APAC'],
    sponsored: false,
    about: 'حلول الأمن، والتدقيق، والامتثال.',
    weOffer: 'مراجعة أمنية، وخارطة طريق للامتثال.',
    weAreLookingFor: 'عملاء من الشركات ومنصات التداول والبروتوكولات بحاجة إلى الأمان.',
    focusMarket: 'Security · Compliance · APAC',
    illustrative: true,
  },
  {
    slug: 'blueorbit',
    companyName: 'BlueOrbit Studio',
    companyInitials: 'BO',
    contactName: 'Ethan Cole',
    role: 'Founder',
    dealGoal: 'شريك في المنتج والعلامة التجارية',
    category: 'service',
    tags: ['Product', 'Web3'],
    sponsored: false,
    about: 'استوديو منتجات لفرق Web3.',
    weOffer: 'تصميم المنتجات، وأنظمة العلامة التجارية.',
    weAreLookingFor: 'مؤسسون أو بروتوكولات بحاجة إلى شريك في المنتج والعلامة التجارية.',
    focusMarket: 'Product · Brand · Web3',
    illustrative: true,
  },
  {
    slug: 'nodehouse',
    companyName: 'NodeHouse',
    companyInitials: 'NH',
    contactName: 'Grace Liu',
    role: 'Community Lead',
    dealGoal: 'شريك مجتمع المطورين',
    category: 'service',
    tags: ['Community', 'Vietnam'],
    sponsored: false,
    about: 'مجتمع يركّز على المطورين.',
    weOffer: 'تفعيل المطورين، والفعاليات، والوصول إلى مجتمع البنّائين.',
    weAreLookingFor: 'نظام بيئي، وبنية تحتية، وشركاء يصلون إلى المطورين.',
    focusMarket: 'Community · Events · Vietnam',
    illustrative: true,
  },
];

export const pricingPackages: PricingPackage[] = [
  {
    id: 'category-partner',
    kicker: 'للعلامات التجارية الاستراتيجية',
    title: 'شريك الفئة',
    description: 'حضور حصري في فئتك ضمن تدفق صفقات Season 3.',
    price: 'ابتداءً من 5,000 دولار',
    priceQualifier: '/ الموسم',
    highlight: false,
    benefits: [
      'مقعد حصري واحد لكل فئة',
      'شعارك وملفك التعريفي على صفحة الهبوط بالكامل',
      'استضافة مشتركة لغرفة الصفقات أو المحتوى الاستراتيجي',
      'تقارير عن العملاء المحتملين والتعارفات',
    ],
    detailLink: { href: '/dealmakers/ar/ss3/partner-benefits/', label: 'اطّلع على مزايا الشريك الرأسمالي / شريك الحلول / الشريك الإعلامي' },
    ctaLabel: 'احصل على ملف عرض الشراكة',
    ctaInterest: 'شريك الفئة / الرعاية',
  },
  {
    id: 'solution-partner',
    kicker: 'لمزوّدي الحلول',
    title: 'شريك الحلول',
    description: 'مسار مخصص للفرق التي تقدّم حلول الإدراج، أو السيولة، أو الشؤون القانونية، أو التقنية، أو النمو لمشاريع Season 3.',
    price: '3,000 دولار',
    priceQualifier: '/ الموسم · 3 مقاعد',
    highlight: false,
    benefits: [
      '3 مقاعد فقط لشريك الحلول هذا الموسم',
      'الشعار ضمن الحقيبة الإعلامية لـ Season 3',
      'تعارف مباشر مع مشاريع مؤهّلة',
      'فرص استضافة مشتركة أو ندوات عبر الإنترنت',
      'توليد العملاء المحتملين وتعارفات تطوير الأعمال',
    ],
    detailLink: { href: '/dealmakers/ar/ss3/partner-benefits/', label: 'اطّلع على كامل مزايا شريك الحلول' },
    ctaLabel: 'قدّم طلبًا كشريك حلول',
    ctaInterest: 'شريك الحلول (3,000 دولار / الموسم · 3 مقاعد)',
  },
  {
    id: 'featured-dealmaker',
    kicker: 'للمؤسسين والشركات',
    title: 'صانع الصفقات المميّز',
    description: 'ملف تعريفي بارز يتيح للأشخاص المناسبين فهم ما تقدّمه وما تحتاجه بسرعة.',
    price: '1,000 دولار',
    priceQualifier: '/ الموسم',
    highlight: true,
    ribbon: 'مفتوح الآن',
    benefits: [
      'فيديو تعريفي لا يتجاوز دقيقتين',
      'ملف تعريفي مميّز للشركة أو المؤسس',
      'نحن نقدّم & نحن نبحث عن',
      'زر "طلب تعارف" مُشرَف عليه',
      'إبراز واحد عبر القنوات الاجتماعية أو المجتمعية',
    ],
    ctaLabel: 'قدّم طلبًا كصانع صفقات مميّز',
    ctaInterest: 'صانع الصفقات المميّز (1,000 دولار / الموسم)',
  },
  {
    id: 'qualified-listing',
    kicker: 'للشركات الموثّقة',
    title: 'الإدراج المؤهّل',
    description: 'ملف تعريفي مُدقَّق ضمن لوحة الصفقات يستقبل طلبات تعارف مُشرَفًا عليها.',
    price: '200 دولار',
    priceQualifier: '/ الموسم',
    highlight: false,
    benefits: [
      'ملف تعريفي واحد للشركة أو الممثل',
      'بيانات واضحة لـ"نحن نقدّم" و"نحن نبحث عن"',
      'مُدرَج في الدليل المؤهّل',
    ],
    addOn: {
      label: '+150 دولار للإدراج المدعوم',
      description: 'أولوية في الظهور مع وسم "مدعوم".',
    },
    ctaLabel: 'أرسل طلب الإدراج المؤهّل',
    ctaInterest: 'الإدراج المؤهّل (200 دولار / الموسم)',
  },
];

export const partnerTracks: PartnerTrack[] = [
  {
    id: 'capital',
    icon: 'CAP',
    title: 'الشريك الرأسمالي',
    description: 'لصناديق رأس المال الجريء، والصناديق الاستثمارية، والمكاتب العائلية، والمستثمرين الملائكيين، ومنصات الاستثمار.',
    benefits: [
      'الشعار ضمن الحقيبة الإعلامية لـ Season 3',
      'تواصل مباشر مع مشاريع مؤهّلة',
      'مطابقة ذات أولوية مع المشاريع ذات الصلة',
      'إعلانات علاقات عامة ومنشورات اجتماعية مشتركة العلامة',
    ],
    fullBenefits: [
      'الشعار ضمن الحقيبة الإعلامية الكاملة لـ Season 3',
      'ظهور علامة الشريك الرأسمالي على الموقع الإلكتروني',
      'ملف تعريفي مخصص للشريك ومعلومات الشركة',
      'ظهور ضمن التغطية الإعلامية لـ Season 3',
      'تواصل مباشر مع مشاريع مؤهّلة',
      'مطابقة أعمال مع المؤسسين والرؤساء التنفيذيين',
      'تعريف ضمن فعاليات التواصل',
      'منشورات على وسائل التواصل الاجتماعي مشتركة العلامة',
      'نشر متبادل عبر منظومة Fintech24h',
      'إمكانية إبراز فرص الاستثمار / التمويل',
      'مطابقة ذات أولوية مع المشاريع ذات الصلة',
    ],
    interest: 'الشريك الرأسمالي (ابتداءً من 5,000 دولار / الموسم)',
  },
  {
    id: 'solution',
    icon: 'SOL',
    title: 'شريك الحلول',
    description: 'لمنصات التداول، ومنصات الإدراج، وصنّاع السوق، ومزوّدي الخدمات القانونية والتقنية. محدودة بـ3 مقاعد لكل موسم.',
    benefits: [
      'الشعار ضمن الحقيبة الإعلامية لـ Season 3',
      'تعارف مباشر مع مشاريع مؤهّلة',
      'فرص استضافة مشتركة أو ندوات عبر الإنترنت',
      'توليد العملاء المحتملين وتعارفات تطوير الأعمال',
    ],
    fullBenefits: [
      '3 مقاعد فقط لشريك الحلول هذا الموسم',
      'مكانة رسمية كشريك حلول',
      'الشعار ضمن الحقيبة الإعلامية لـ Season 3',
      'ملف تعريفي للشركة على DealMakers\' Club',
      'مقالة إعلان عن الشراكة',
      'فرصة علاقات عامة مخصصة',
      'تعارف مباشر مع مشاريع مؤهّلة',
      'مطابقة مع المشاريع',
      'فرص استضافة مشتركة أو ندوات عبر الإنترنت',
      'ظهور على وسائل التواصل الاجتماعي',
      'ترويج متبادل عبر المنظومة',
      'توليد العملاء المحتملين وتعارفات تطوير الأعمال',
    ],
    interest: 'شريك الحلول (3,000 دولار / الموسم · 3 مقاعد)',
  },
  {
    id: 'media',
    icon: 'MED',
    title: 'الشريك الإعلامي',
    description: 'تبادل تحريري لوسائل إعلام العملات الرقمية والتكنولوجيا المالية والأعمال، والنشرات البريدية، والبودكاست، والإعلام المجتمعي — دون رسوم إدراج، لذا اقتصرت المزايا عمدًا على الأساسيات.',
    benefits: [
      'الشعار على الموقع الإلكتروني',
      'مشاركة ضمن منشورات وسائل التواصل الاجتماعي',
    ],
    fullBenefits: [
      'الشعار على الموقع الإلكتروني',
      'مشاركة ضمن منشورات وسائل التواصل الاجتماعي',
    ],
    interest: 'الشريك الإعلامي',
  },
];

export const projectOnboardBenefits: string[] = [
  'إدراج في DealMakers\' Club',
  'ملف تعريفي مخصص للمشروع',
  'معلومات الشركة / المشروع',
  'مطابقة الفرص',
  'مطابقة رأس المال',
  'مطابقة مع شركاء الحلول',
  'ظهور إعلامي',
  'إعلان اجتماعي',
  'فرص علاقات عامة',
  'تواصل في مجالي الأعمال والمؤسسين',
  'الوصول إلى نخبة مختارة من القادة العالميين',
];

export const partnerBenefitsMatrix: { label: string; capital: MatrixValue; solution: MatrixValue; media: MatrixValue; project: MatrixValue }[] = [
  { label: 'صفة الشريك الرسمي', capital: 'yes', solution: 'yes', media: 'no', project: 'yes' },
  { label: 'الشعار ضمن الحقيبة الإعلامية', capital: 'yes', solution: 'yes', media: 'yes', project: 'yes' },
  { label: 'إدراج DealMakers', capital: 'yes', solution: 'yes', media: 'no', project: 'yes' },
  { label: 'إعلان الشراكة', capital: 'yes', solution: 'yes', media: 'no', project: 'no' },
  { label: 'علاقات عامة مخصصة', capital: 'yes', solution: 'yes', media: 'no', project: 'optional' },
  { label: 'ظهور على وسائل التواصل الاجتماعي', capital: 'yes', solution: 'yes', media: 'yes', project: 'yes' },
  { label: 'نشر متبادل', capital: 'yes', solution: 'yes', media: 'no', project: 'optional' },
  { label: 'مطابقة الأعمال', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: 'مطابقة رأس المال', capital: 'star', solution: 'no', media: 'no', project: 'star' },
  { label: 'مطابقة الحلول', capital: 'no', solution: 'star', media: 'no', project: 'star' },
  { label: 'ظهور إعلامي', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: 'تواصل المؤسسين / المدراء التنفيذيين', capital: 'star', solution: 'star', media: 'no', project: 'star' },
  { label: 'فرصة استضافة مشتركة', capital: 'star', solution: 'star', media: 'no', project: 'no' },
];

export const faq: { question: string; answer: string }[] = [
  {
    question: 'ما هو DealMakers\' Club: F-Matching؟',
    answer:
      'إنه برنامج مطابقة منسّق من Fintech24h موجّه للمؤسسين والمستثمرين ومنصات التداول والشركاء الاستراتيجيين في مجالي Web3 والتكنولوجيا المالية. تُذكر إشارات الصفقة بوضوح، وتتم التعارفات تحت إشراف، بدلًا من تركها لدليل تواصل مفتوح.',
  },
  {
    question: 'لمن هذا البرنامج، ولمن لا يناسبه؟',
    answer:
      'يناسب المؤسسين وكبار التنفيذيين، والمستثمرين والصناديق، ومنصات التداول، ومزوّدي البنية التحتية، وشركاء النمو والخدمات ممن لديهم إشارة صفقة واضحة. لا يناسب من يسعى فقط لجمع جهات اتصال لأغراض التواصل الجماعي.',
  },
  {
    question: 'ما الذي يُعدّ إدراجًا مؤهّلًا؟',
    answer:
      'ملف تعريفي راجعه فريق Fintech24h ووافق عليه للعرض على لوحة الصفقات، مع تفاصيل واضحة لـ"نحن نقدّم" و"نحن نبحث عن".',
  },
  {
    question: 'ماذا يشمل مبلغ 200 دولار / الموسم؟',
    answer:
      'ملف تعريفي واحد للشركة أو الممثل، مُدرَج في دليل الإدراج المؤهّل طوال Season 3 بالكامل، إضافة إلى الأهلية لتلقّي طلبات تعارف مُشرَف عليها عبر Fintech24h.',
  },
  {
    question: 'ما الفرق بين الإدراج المدعوم (+150 دولار) والإدراج العادي؟',
    answer:
      'يحمل الإدراج المدعوم وسم "✦ مدعوم" ويُمنح أولوية الظهور في أعلى دليل الإدراج المؤهّل لتحقيق ظهور أكبر.',
  },
  {
    question: 'ماذا يشمل صانع الصفقات المميّز (1,000 دولار / الموسم)؟',
    answer:
      'فيديو تعريفي لا يتجاوز دقيقتين، وملف تعريفي مميّز على الصفحة، وبيانات ظاهرة لـ"نحن نقدّم" و"نحن نبحث عن"، وزر مخصص لـ"طلب تعارف"، وإبراز واحد عبر القنوات الاجتماعية والمجتمعية لـ Fintech24h.',
  },
  {
    question: 'ما الصيغة التي يجب أن يتبعها فيديو صانع الصفقات المميّز؟',
    answer:
      'بحد أقصى دقيقتين، مع بيان واضح لهويتك، وما تبنيه، وما تبحث عنه. سترسل Fintech24h إرشادات تقنية تفصيلية (نسبة العرض إلى الارتفاع، الدقة) فور تقديم الطلب.',
  },
  {
    question: 'كيف يعمل "طلب التعارف"، وهل تُشارَك معلومات الاتصال مباشرةً؟',
    answer:
      'تُقدّم طلبًا يوضّح هدفك؛ وتراجع Fintech24h مدى الملاءمة وتطلب موافقة الطرف المُستقبِل قبل فتح أي تواصل. لا تُشارَك معلومات الاتصال المباشرة مطلقًا، ولا تتم الموافقة على كل طلب.',
  },
  {
    question: 'ما المعايير التي تعتمدها Fintech24h لمراجعة الملفات التعريفية والتعارفات؟',
    answer:
      'مدى الملاءمة بين أهداف الطرفين، والمرحلة والموقع الجغرافي، وما إذا كان مقدّم الطلب صاحب قرار مباشر أو ممثلًا مفوّضًا.',
  },
  {
    question: 'كيف أصبح شريك فئة أو شريكًا إعلاميًا؟',
    answer:
      'قدّم استمارة "طلب الانضمام" واختر "شريك الفئة"، أو تواصل مباشرةً عبر تيليجرام أو البريد الإلكتروني. سيرسل فريق Fintech24h ملف عرض الشراكة ويؤكد حصرية الفئة.',
  },
];

export const weOfferOptions: string[] = [
  'رأس المال / الاستثمار',
  'المنتج / التقنية',
  'منصة تداول / دعم الإدراج',
  'السيولة / صناعة السوق',
  'المجتمع / التوزيع',
  'الإعلام / العلاقات العامة',
  'قادة الرأي (KOL) / النمو',
  'البنية التحتية / واجهات البرمجة (API)',
  'الامتثال / الأمان',
  'دخول السوق / الشراكات',
];

export const weAreLookingForOptions: string[] = [
  'الاستثمار / جمع التمويل',
  'مستثمرون مشاركون',
  'الإدراج في منصة تداول',
  'شريك سيولة',
  'شريك استراتيجي',
  'التوزيع / المجتمع',
  'عملاء من الشركات',
  'شريك في المنتج / التقنية',
  'دعم إعلامي / من قادة الرأي',
  'دخول السوق',
];

export const interestOptions: string[] = [
  'الانضمام إلى DealMakers\' Club',
  'صانع الصفقات المميّز (1,000 دولار / الموسم)',
  'الإدراج المؤهّل (200 دولار / الموسم)',
  'الإدراج المدعوم (أضف 150 دولارًا)',
  'شريك الفئة / الرعاية',
  'الشريك الرأسمالي (ابتداءً من 5,000 دولار / الموسم)',
  'شريك الحلول (3,000 دولار / الموسم · 3 مقاعد)',
  'الشريك الإعلامي',
];

export const telegramGroupUrl = 'https://t.me/Fi24h_DealMakers_Club';
export const telegramGroupName = 'Fi24h DealMakers\' Club';

export const fundingStatusOptions: string[] = [
  'يبحث عن تمويل',
  'لديه تمويل جاهز للاستثمار',
  'لا يسعى لجمع تمويل أو الاستثمار حاليًا',
];
