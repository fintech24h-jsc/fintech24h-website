// src/data/dealmakers/chrome.ts
// Layout chrome copy (header nav, footer, cookie banner, breadcrumb labels)
// that doesn't belong in ss3.ts's per-season content model — this is the
// same on every season, just localized. "Season 3" and "FAQ" stay in
// English in the Arabic set per project decision.
export const en = {
  nav: {
    featured: 'Featured',
    directory: 'Directory',
    members: 'Members',
    packages: 'Packages',
    benefits: 'Benefits',
    faq: 'FAQ',
    applyToJoin: 'Apply to Join',
    toggleAria: 'Toggle navigation menu',
    mobileNavAria: 'Mobile section navigation',
    sectionNavAria: 'Section navigation',
  },
  capitalPartnerFallback: 'Capital Partner',
  footer: {
    presentedByAria: 'Presented by Fintech24h, Official Capital Partner Season 3',
    description: 'A curated matching program for verified Web3 and fintech decision-makers, connecting qualified deal flow through moderated introductions.',
    socialAria: (label: string) => `DealMakers' Club on ${label}`,
    programHeading: 'Program',
    featuredDealMakers: 'Featured DealMakers',
    qualifiedDirectory: 'Qualified Directory',
    membersDirectory: 'Members Directory',
    packages: 'Packages',
    partnerBenefits: 'Partner Benefits',
    joinClub: 'Join Fi24h DealMakers’ Club',
    faq: 'FAQ',
    legalHeading: 'Legal & Contact',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    verifyMember: 'Verify a Team Member',
    cookiePreferences: 'Cookie Preferences',
    copyright: (year: number) => `© ${year} DealMakers’ Club. All rights reserved.`,
    backToSeason2: 'Back to Season 2',
  },
  cookie: {
    text: 'We use cookies to understand site traffic (Google Analytics). Nothing runs until you choose, see our',
    privacyLink: 'Privacy Policy',
    textSuffix: 'for details.',
    accept: 'Accept',
    reject: 'Reject non-essential',
    customize: 'Customize',
    necessary: 'Necessary',
    necessaryNote: 'Always on: required for the site to function',
    analytics: 'Analytics',
    analyticsNote: 'Google Analytics: aggregate traffic only, no ad tracking',
    toggleAnalyticsAria: 'Toggle Analytics cookies',
    savePreferences: 'Save preferences',
    back: 'Back',
    consentAria: 'Cookie consent',
  },
  breadcrumbs: {
    home: 'Home',
    dealmakersClub: 'DealMakers’ Club',
  },
};

export type ChromeDict = typeof en;

export const ar: ChromeDict = {
  nav: {
    featured: 'المميّزون',
    directory: 'الدليل',
    members: 'الأعضاء',
    packages: 'الباقات',
    benefits: 'المزايا',
    faq: 'FAQ',
    applyToJoin: 'تقدّم بطلب الانضمام',
    toggleAria: 'إظهار/إخفاء قائمة التنقل',
    mobileNavAria: 'تنقّل الأقسام على الجوال',
    sectionNavAria: 'تنقّل الأقسام',
  },
  capitalPartnerFallback: 'الشريك الرأسمالي',
  footer: {
    presentedByAria: 'تقدّمها Fintech24h، الشريك الرأسمالي الرسمي لـ Season 3',
    description: 'برنامج مطابقة منسّق لأصحاب القرار الموثّقين في مجالي Web3 والتكنولوجيا المالية، يربط تدفق صفقات مؤهّلة عبر تعارفات تحت إشراف.',
    socialAria: (label: string) => `DealMakers' Club على ${label}`,
    programHeading: 'البرنامج',
    featuredDealMakers: 'صانعو الصفقات المميّزون',
    qualifiedDirectory: 'الدليل المؤهّل',
    membersDirectory: 'دليل الأعضاء',
    packages: 'الباقات',
    partnerBenefits: 'مزايا الشراكة',
    joinClub: 'انضم إلى Fi24h DealMakers’ Club',
    faq: 'FAQ',
    legalHeading: 'الشؤون القانونية والتواصل',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    verifyMember: 'تحقّق من عضوية فريق العمل',
    cookiePreferences: 'تفضيلات ملفات تعريف الارتباط',
    copyright: (year: number) => `© ${year} DealMakers’ Club. جميع الحقوق محفوظة.`,
    backToSeason2: 'العودة إلى Season 2',
  },
  cookie: {
    text: 'نستخدم ملفات تعريف الارتباط لفهم حركة الزوار على الموقع (Google Analytics). لا يعمل أي منها إلا بعد اختيارك، راجع',
    privacyLink: 'سياسة الخصوصية',
    textSuffix: 'لمزيد من التفاصيل.',
    accept: 'موافقة',
    reject: 'رفض غير الضروري',
    customize: 'تخصيص',
    necessary: 'ضروري',
    necessaryNote: 'مُفعّل دائمًا: ضروري لتشغيل الموقع',
    analytics: 'التحليلات',
    analyticsNote: 'Google Analytics: بيانات حركة إجمالية فقط، دون تتبع إعلاني',
    toggleAnalyticsAria: 'تفعيل/إيقاف ملفات تعريف ارتباط التحليلات',
    savePreferences: 'حفظ التفضيلات',
    back: 'رجوع',
    consentAria: 'موافقة على ملفات تعريف الارتباط',
  },
  breadcrumbs: {
    home: 'الرئيسية',
    dealmakersClub: 'DealMakers’ Club',
  },
};

export function getChrome(locale: 'en' | 'ar'): ChromeDict {
  return locale === 'ar' ? ar : en;
}
