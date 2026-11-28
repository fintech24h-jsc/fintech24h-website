import { useEffect, useMemo, useRef, useState } from 'react';
import { getSS3Content, type DealmakersLocale } from '../../../data/dealmakers/content';
import type { DirectoryCategory, DirectoryProfile } from '../../../data/dealmakers/ss3';

type FilterKey = 'all' | 'sponsored' | DirectoryCategory;

interface Props {
  locale?: DealmakersLocale;
}

// Cards per page: two full rows (4 columns from 1280px, 3 below), so the
// directory reads in one landscape view instead of a long vertical list.
const WIDE_QUERY = '(min-width: 1280px)';

export default function QualifiedDirectory({ locale = 'en' }: Props) {
  const { directoryProfiles } = getSS3Content(locale);

  const copy = locale === 'ar' ? {
    filters: [
      { key: 'all' as FilterKey, label: 'جميع الملفات' },
      { key: 'sponsored' as FilterKey, label: 'مدعوم' },
      { key: 'capital' as FilterKey, label: 'يجمع تمويلًا' },
      { key: 'listing' as FilterKey, label: 'الإدراج والسيولة' },
      { key: 'partner' as FilterKey, label: 'شريك استراتيجي' },
      { key: 'service' as FilterKey, label: 'النمو والخدمات' },
    ],
    filterProfiles: 'تصفية الملفات',
    searchLabel: 'ابحث في الملفات',
    searchPlaceholder: 'ابحث عن شركة',
    noResults: 'لا توجد ملفات مطابقة.',
    pageInfo: (a: number, b: number, n: number) => `${a}–${b} من ${n}`,
    prevPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    pricing: 'الإدراج المؤهّل 200 دولار / الموسم · ظهور مدعوم +150 دولار',
    submitProfile: 'أدرج شركتك',
    ariaLabel: 'دليل الإدراج المؤهّل',
    sponsoredBadge: 'مدعوم',
    verified: 'عضو موثّق',
    exampleBadge: 'مثال توضيحي',
    viewProfile: 'عرض الملف التعريفي',
    closeProfile: 'إغلاق الملف التعريفي',
    qualifiedProfile: 'ملف تعريفي مؤهّل',
    exampleProfile: 'ملف تعريفي توضيحي (مثال)',
    sponsoredProfile: 'ملف تعريفي مدعوم',
    visitWebsite: 'زيارة الموقع',
    weOffer: 'نحن نقدّم',
    weAreLookingFor: 'نحن نبحث عن',
    focusMarkets: 'التركيز والأسواق',
    introTitle: (name: string) => `اطلب تعارفًا مع ${name}`,
    introAsk: 'ماذا تريد منهم؟',
    intents: ['شراكة', 'الاستفادة من خدماتهم', 'مزيد من المعلومات', 'استثمار'],
    requestIntro: (name: string) => `اطلب تعارفًا مع ${name}`,
    introNote: 'تراجع Fintech24h كل طلب، ولا تتم مشاركة بيانات التواصل إلا بعد موافقة الطرفين.',
    joinClub: 'الانضمام إلى DealMakers’ Club',
  } : locale === 'zh' ? {
    filters: [
      { key: 'all' as FilterKey, label: '全部档案' },
      { key: 'sponsored' as FilterKey, label: '推广' },
      { key: 'capital' as FilterKey, label: '正在融资' },
      { key: 'listing' as FilterKey, label: '上币与流动性' },
      { key: 'partner' as FilterKey, label: '战略合作伙伴' },
      { key: 'service' as FilterKey, label: '增长与服务' },
    ],
    filterProfiles: '筛选档案',
    searchLabel: '搜索档案',
    searchPlaceholder: '搜索公司',
    noResults: '没有匹配的档案。',
    pageInfo: (a: number, b: number, n: number) => `第 ${a}–${b} 个，共 ${n} 个`,
    prevPage: '上一页',
    nextPage: '下一页',
    pricing: '资质入驻每赛季 200 美元 · 推广展示另加 150 美元',
    submitProfile: '提交公司档案',
    ariaLabel: '资质入驻目录',
    sponsoredBadge: '推广',
    verified: '已认证成员',
    exampleBadge: '示例',
    viewProfile: '查看档案',
    closeProfile: '关闭档案',
    qualifiedProfile: '资质档案',
    exampleProfile: '示例档案',
    sponsoredProfile: '推广档案',
    visitWebsite: '访问网站',
    weOffer: '我们提供',
    weAreLookingFor: '我们寻求',
    focusMarkets: '关注方向与市场',
    introTitle: (name: string) => `请求引荐 ${name}`,
    introAsk: '你希望从对方获得什么？',
    intents: ['合作', '使用其服务', '了解更多信息', '投资'],
    requestIntro: (name: string) => `请求引荐 ${name}`,
    introNote: 'Fintech24h 会审核每一条请求，仅在双方同意后才会交换联系方式。',
    joinClub: '加入 DealMakers’ Club',
  } : {
    filters: [
      { key: 'all' as FilterKey, label: 'All profiles' },
      { key: 'sponsored' as FilterKey, label: 'Sponsored' },
      { key: 'capital' as FilterKey, label: 'Raising capital' },
      { key: 'listing' as FilterKey, label: 'Listing & liquidity' },
      { key: 'partner' as FilterKey, label: 'Strategic partner' },
      { key: 'service' as FilterKey, label: 'Growth & services' },
    ],
    filterProfiles: 'Filter profiles',
    searchLabel: 'Search profiles',
    searchPlaceholder: 'Search companies',
    noResults: 'No profiles match.',
    pageInfo: (a: number, b: number, n: number) => `${a}–${b} of ${n}`,
    prevPage: 'Previous page',
    nextPage: 'Next page',
    pricing: 'Qualified Listing $200 / season · Sponsored placement +$150',
    submitProfile: 'List your company',
    ariaLabel: 'Qualified Listing Directory',
    sponsoredBadge: 'Sponsored',
    verified: 'Verified member',
    exampleBadge: 'Example',
    viewProfile: 'View profile',
    closeProfile: 'Close profile',
    qualifiedProfile: 'Qualified profile',
    exampleProfile: 'Example profile',
    sponsoredProfile: 'Sponsored profile',
    visitWebsite: 'Visit website',
    weOffer: 'We Offer',
    weAreLookingFor: 'We Are Looking For',
    focusMarkets: 'Focus & markets',
    introTitle: (name: string) => `Request an introduction to ${name}`,
    introAsk: 'What would you like from them?',
    intents: ['Partnership', 'Use their services', 'More information', 'Investment'],
    requestIntro: (name: string) => `Request intro to ${name}`,
    introNote: 'Fintech24h reviews every request; contact details are shared only after both sides agree.',
    joinClub: 'Join DealMakers’ Club',
  };

  const categoryLabel = (c: DirectoryCategory) => copy.filters.find((f) => f.key === c)?.label ?? c;

  function dispatchPrefill(interest: string, context: string) {
    window.dispatchEvent(new CustomEvent('dm:prefill', { detail: { interest, context } }));
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'dealmakers_ss3_request_introduction', label: context });
    }
  }

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [intent, setIntent] = useState(0);
  const [wide, setWide] = useState(true);
  const PAGE_SIZE = wide ? 8 : 6;

  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visibleProfiles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directoryProfiles.filter((p) => {
      if (activeFilter === 'sponsored' && !p.sponsored) return false;
      if (activeFilter !== 'all' && activeFilter !== 'sponsored' && p.category !== activeFilter) return false;
      if (!q) return true;
      return [p.companyName, p.headline ?? '', p.about, p.focusMarket, ...p.tags].join(' ').toLowerCase().includes(q);
    });
  }, [activeFilter, query, directoryProfiles]);

  const pageCount = Math.max(1, Math.ceil(visibleProfiles.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageProfiles = visibleProfiles.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const activeProfile: DirectoryProfile | undefined = directoryProfiles.find((p) => p.slug === activeSlug);

  const openProfile = (slug: string, e: React.MouseEvent) => {
    triggerRef.current = e.currentTarget as HTMLElement;
    setIntent(0);
    setActiveSlug(slug);
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'dealmakers_ss3_open_profile', label: slug });
    }
  };

  const closeProfile = () => {
    setActiveSlug(null);
    triggerRef.current?.focus();
  };

  // Focus trap + Escape + return focus
  useEffect(() => {
    if (!activeSlug) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProfile();
        return;
      }
      if (e.key === 'Tab' && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('overflow-hidden');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('overflow-hidden');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlug]);

  const pagerButton =
    'w-10 h-10 inline-flex items-center justify-center rounded-full border border-[var(--dm-border)] text-[var(--dm-text-primary)] transition-colors hover:border-[var(--dm-border-hover)] disabled:text-[var(--dm-text-muted)] disabled:opacity-50 disabled:cursor-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dm-gold)]';

  return (
    <div>
      {/* Filters + search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
        <div
          role="group"
          aria-label={copy.filterProfiles}
          className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {copy.filters.map((f) => {
            const on = activeFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => { setActiveFilter(f.key); setPage(0); }}
                aria-pressed={on}
                data-dm-track="directory_filter"
                data-dm-track-label={f.key}
                className={`shrink-0 h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dm-gold)] ${
                  on
                    ? 'bg-[var(--dm-text-primary)] text-[var(--dm-text-inverted)]'
                    : 'text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:bg-white/[0.05]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2.5 w-full lg:w-80 h-11 px-4 rounded-full border border-[var(--dm-border)] bg-[var(--dm-bg-secondary)] text-[var(--dm-text-muted)] focus-within:border-[var(--dm-border-accent)] shrink-0">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="sr-only">{copy.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder={copy.searchPlaceholder}
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)]"
          />
        </label>
      </div>

      {/* Cards */}
      {pageProfiles.length > 0 ? (
        <ul className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2.5" aria-label={copy.ariaLabel}>
          {pageProfiles.map((p, i) => (
            <li key={p.slug} className="relative dm-anim-in" style={{ animationDelay: `${Math.min(i, 7) * 50}ms` }}>
              {p.sponsored && (
                <span className="absolute -top-2.5 end-4 z-10 inline-flex items-center gap-1 h-6 px-3 rounded-full bg-[var(--dm-gold)] text-[var(--dm-text-inverted)] font-mono text-[10px] font-semibold uppercase tracking-[0.1em] shadow-[0_4px_14px_rgba(217,178,106,0.35)]">
                  <span aria-hidden="true">★</span>{copy.sponsoredBadge}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => openProfile(p.slug, e)}
                aria-label={`${copy.viewProfile}: ${p.companyName}`}
                className={`group w-full h-full flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 sm:min-h-[212px] rounded-[20px] bg-[var(--dm-bg-secondary)] border text-start transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--dm-bg-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dm-gold)] ${
                  p.sponsored ? 'border-[var(--dm-border-accent)] hover:border-[var(--dm-gold)]' : 'border-[var(--dm-border)] hover:border-[var(--dm-border-hover)]'
                }`}
              >
                <span className="flex items-center gap-3.5 min-w-0">
                  <span className="w-[60px] h-[60px] shrink-0 rounded-2xl bg-[var(--dm-bg-tertiary)] flex items-center justify-center overflow-hidden font-mono text-[13px] font-semibold text-[var(--dm-gold)]">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt="" width={60} height={60} loading="lazy" decoding="async" className="w-full h-full object-contain p-2" />
                    ) : p.companyInitials}
                  </span>
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span className="font-display font-semibold text-lg leading-tight text-[var(--dm-text-primary)] line-clamp-2 break-words">{p.companyName}</span>
                    {!p.illustrative && (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" role="img" aria-label={copy.verified}>
                        <circle cx="12" cy="12" r="10" fill="var(--dm-emerald)" />
                        <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="var(--dm-text-inverted)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="text-sm leading-relaxed text-[var(--dm-text-secondary)] line-clamp-2">{p.headline ?? p.about}</span>
                <span className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--dm-text-secondary)] truncate">
                    {categoryLabel(p.category)}{p.illustrative ? ` · ${copy.exampleBadge}` : ''}
                  </span>
                  <svg className="w-[18px] h-[18px] shrink-0 text-[var(--dm-gold)] transition-transform duration-200 group-hover:translate-x-0.5 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-16 text-center text-sm text-[var(--dm-text-secondary)]">{copy.noResults}</p>
      )}

      {/* Pricing + pager */}
      <div className="mt-8 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs sm:text-sm text-[var(--dm-text-secondary)] text-center sm:text-start">
          {copy.pricing}
          {' · '}
          <a
            href="#apply"
            data-dm-prefill-interest="Qualified Listing ($200/season)"
            data-dm-track="directory_post_listing"
            className="font-semibold text-[var(--dm-gold)] hover:text-[var(--dm-gold-bright)] underline underline-offset-4 decoration-[var(--dm-border-accent)]"
          >
            {copy.submitProfile} <span aria-hidden="true">→</span>
          </a>
        </p>
        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-2.5">
            <span className="text-sm text-[var(--dm-text-secondary)] me-1" aria-live="polite">
              {copy.pageInfo(currentPage * PAGE_SIZE + 1, Math.min(visibleProfiles.length, currentPage * PAGE_SIZE + PAGE_SIZE), visibleProfiles.length)}
            </span>
            <button type="button" className={pagerButton} onClick={() => setPage(currentPage - 1)} disabled={currentPage === 0} aria-label={copy.prevPage}>
              <svg className="w-4 h-4 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" className={pagerButton} onClick={() => setPage(currentPage + 1)} disabled={currentPage >= pageCount - 1} aria-label={copy.nextPage}>
              <svg className="w-4 h-4 rtl:-scale-x-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Profile modal */}
      {activeProfile && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(6,5,4,0.8)] backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeProfile(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-profile-title"
            className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-[var(--dm-border)] bg-[rgba(19,17,16,0.97)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-7"
          >
            <button
              onClick={closeProfile}
              aria-label={copy.closeProfile}
              className="absolute end-4 top-4 w-8 h-8 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:border-[var(--dm-border-hover)] flex items-center justify-center transition-colors"
            >
              ×
            </button>

            <p className="font-mono text-[10px] text-[var(--dm-gold)] uppercase tracking-widest mb-4">{activeProfile.illustrative ? copy.exampleProfile : copy.qualifiedProfile}</p>
            <div className="flex items-center gap-4 mb-5">
              <span className="w-16 h-16 rounded-2xl overflow-hidden bg-[var(--dm-bg-tertiary)] border border-[var(--dm-border)] flex items-center justify-center font-mono text-sm font-bold text-[var(--dm-gold)] shrink-0">
                {activeProfile.logoUrl ? (
                  <img src={activeProfile.logoUrl} alt={`${activeProfile.companyName} logo`} width={64} height={64} decoding="async" className="w-full h-full object-contain p-2.5" />
                ) : activeProfile.companyInitials}
              </span>
              <div className="min-w-0">
                <h3 id="dm-profile-title" className="font-display font-semibold text-xl text-[var(--dm-text-primary)]">{activeProfile.companyName}</h3>
                <p className="text-sm text-[var(--dm-text-secondary)] leading-snug">{activeProfile.headline ?? activeProfile.about}</p>
                {(activeProfile.websiteUrl || activeProfile.sponsored) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2">
                    {activeProfile.sponsored && <span className="dm-badge-sponsored">✦ {copy.sponsoredProfile}</span>}
                    {activeProfile.websiteUrl && (
                      <a
                        href={activeProfile.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--dm-gold)] hover:text-[var(--dm-gold-bright)] underline underline-offset-4 decoration-[var(--dm-border-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dm-gold)]"
                      >
                        {copy.visitWebsite} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {activeProfile.headline && (
              <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed mb-5">{activeProfile.about}</p>
            )}

            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div className="p-3.5 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)]">
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--dm-gold)] mb-1.5">{copy.weOffer}</strong>
                <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed">{activeProfile.weOffer}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)]">
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--dm-emerald)] mb-1.5">{copy.weAreLookingFor}</strong>
                <p className="text-xs text-[var(--dm-text-secondary)] leading-relaxed">{activeProfile.weAreLookingFor}</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] mb-6">
              <strong className="block text-[10px] uppercase tracking-widest text-[var(--dm-text-muted)] mb-1.5">{copy.focusMarkets}</strong>
              <p className="text-xs text-[var(--dm-text-secondary)]">{activeProfile.focusMarket}</p>
            </div>

            {/* Personalised introduction request: the visitor picks what they
                want from this company, and that intent travels into the apply
                form's note together with the company name. */}
            <div className="p-4 sm:p-5 rounded-2xl border border-[var(--dm-border-accent)] bg-[rgba(217,178,106,0.05)]">
              <p className="font-display font-semibold text-base text-[var(--dm-text-primary)]">{copy.introTitle(activeProfile.companyName)}</p>
              <p className="text-xs text-[var(--dm-text-secondary)] mt-1 mb-3">{copy.introAsk}</p>
              <div role="radiogroup" aria-label={copy.introAsk} className="flex flex-wrap gap-2 mb-4">
                {copy.intents.map((label, idx) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={intent === idx}
                    onClick={() => setIntent(idx)}
                    className={`min-h-9 px-3.5 rounded-full text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dm-gold)] ${
                      intent === idx
                        ? 'bg-[var(--dm-text-primary)] text-[var(--dm-text-inverted)]'
                        : 'border border-[var(--dm-border-hover)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <a
                href="#apply"
                onClick={() => {
                  dispatchPrefill(copy.joinClub, `${activeProfile.companyName} (${activeProfile.contactName}) — ${copy.intents[intent]}`);
                  closeProfile();
                }}
                className="dm-btn-primary w-full justify-center text-xs"
              >
                {copy.requestIntro(activeProfile.companyName)} <span aria-hidden="true">→</span>
              </a>
              <p className="text-[11px] text-[var(--dm-text-secondary)] leading-relaxed mt-3 text-center">{copy.introNote}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
