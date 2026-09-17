import { useEffect, useMemo, useRef, useState } from 'react';
import { getSS3Content, type DealmakersLocale } from '../../../data/dealmakers/content';
import type { DirectoryCategory, DirectoryProfile } from '../../../data/dealmakers/ss3';

type FilterKey = 'all' | 'sponsored' | DirectoryCategory;

interface Props {
  locale?: DealmakersLocale;
}

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
    browseBy: 'تصفّح حسب هدف الصفقة أو الملفات ذات أولوية الظهور.',
    qualifiedListingLead: 'الإدراج المؤهّل: 200 دولار / الموسم.',
    addSponsored: 'أضف',
    sponsoredSuffix: 'للحصول على وسم "مدعوم" وأولوية في الظهور.',
    submitProfile: 'أرسل ملفك التعريفي',
    ariaLabel: 'دليل الإدراج المؤهّل',
    sponsoredBadge: '✦ مدعوم',
    viewProfile: 'عرض الملف التعريفي',
    closeProfile: 'إغلاق الملف التعريفي',
    qualifiedProfile: 'ملف تعريفي مؤهّل',
    sponsoredProfile: '✦ ملف تعريفي مدعوم',
    weOffer: 'نحن نقدّم',
    weAreLookingFor: 'نحن نبحث عن',
    focusMarkets: 'التركيز والأسواق',
    requestIntro: 'طلب تعارف',
    joinClub: 'الانضمام إلى DealMakers’ Club',
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
    browseBy: 'Browse by deal goal or profiles prioritized for visibility.',
    qualifiedListingLead: 'Qualified Listing: $200 / season.',
    addSponsored: 'Add',
    sponsoredSuffix: 'for a Sponsored label and priority placement.',
    submitProfile: 'Submit your profile',
    ariaLabel: 'Qualified Listing Directory',
    sponsoredBadge: '✦ Sponsored',
    viewProfile: 'View profile',
    closeProfile: 'Close profile',
    qualifiedProfile: 'Qualified profile',
    sponsoredProfile: '✦ Sponsored profile',
    weOffer: 'We Offer',
    weAreLookingFor: 'We Are Looking For',
    focusMarkets: 'Focus & markets',
    requestIntro: 'Request Introduction',
    joinClub: 'Join DealMakers’ Club',
  };

  function countFor(key: FilterKey): number {
    if (key === 'all') return directoryProfiles.length;
    if (key === 'sponsored') return directoryProfiles.filter((p) => p.sponsored).length;
    return directoryProfiles.filter((p) => p.category === key).length;
  }

  function dispatchPrefill(interest: string, context: string) {
    window.dispatchEvent(new CustomEvent('dm:prefill', { detail: { interest, context } }));
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'dealmakers_ss3_request_introduction', label: context });
    }
  }

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visibleProfiles = useMemo(() => {
    if (activeFilter === 'all') return directoryProfiles;
    if (activeFilter === 'sponsored') return directoryProfiles.filter((p) => p.sponsored);
    return directoryProfiles.filter((p) => p.category === activeFilter);
  }, [activeFilter, directoryProfiles]);

  const activeProfile: DirectoryProfile | undefined = directoryProfiles.find((p) => p.slug === activeSlug);

  const openProfile = (slug: string, e: React.MouseEvent | React.KeyboardEvent) => {
    triggerRef.current = e.currentTarget as HTMLElement;
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

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      {/* Filters */}
      <aside className="dm-card p-5 h-fit">
        <h3 className="font-display font-semibold text-sm text-[var(--dm-text-primary)] mb-1">{copy.filterProfiles}</h3>
        <p className="text-xs text-[var(--dm-text-secondary)] mb-4">{copy.browseBy}</p>
        <div className="grid gap-2">
          {copy.filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              aria-pressed={activeFilter === f.key}
              className="dm-select-option flex items-center justify-between text-left"
              data-dm-track="directory_filter"
              data-dm-track-label={f.key}
            >
              <span>{f.label}</span>
              <b className="font-mono text-[10px] text-[var(--dm-text-muted)]">{String(countFor(f.key)).padStart(2, '0')}</b>
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--dm-text-secondary)] mt-5 leading-relaxed">
          <strong className="text-[var(--dm-text-primary)]">{copy.qualifiedListingLead}</strong><br />
          {copy.addSponsored} <strong className="text-[var(--dm-gold)]">$150</strong> {copy.sponsoredSuffix}
        </p>
        <a
          href="#apply"
          data-dm-prefill-interest="Qualified Listing ($200/season)"
          data-dm-track="directory_post_listing"
          className="dm-btn-ghost w-full justify-center text-xs mt-4"
        >
          {copy.submitProfile}
        </a>
      </aside>

      {/* Deal list */}
      <div className="grid gap-3" role="list" aria-label={copy.ariaLabel}>
        {visibleProfiles.map((p, i) => (
          <article
            key={p.slug}
            role="button"
            tabIndex={0}
            onClick={(e) => openProfile(p.slug, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProfile(p.slug, e);
              }
            }}
            style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
            className={`dm-anim-in group grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
              p.sponsored
                ? 'border-[var(--dm-border-accent)] bg-gradient-to-r from-[rgba(217,178,106,0.1)] to-transparent hover:border-[var(--dm-gold)] shadow-[0_0_0_1px_rgba(217,178,106,0.06)]'
                : 'border-[var(--dm-border)] bg-white/[0.02] hover:border-[var(--dm-border-hover)] hover:bg-white/[0.04]'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--dm-gold)] focus-visible:outline-offset-2`}
          >
            <span className="w-11 h-11 rounded-xl bg-[var(--dm-bg-tertiary)] border border-[var(--dm-border)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--dm-gold)]">
              {p.companyInitials}
            </span>
            <div className="min-w-0">
              <h4 className="font-display font-semibold text-sm text-[var(--dm-text-primary)] flex items-center gap-2 flex-wrap">
                {p.companyName}
                {p.sponsored && (
                  <span className="dm-badge-sponsored">{copy.sponsoredBadge}</span>
                )}
              </h4>
              <p className="text-xs text-[var(--dm-text-muted)] truncate">{p.contactName} · {p.role} · {p.dealGoal}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.tags.map((t) => <span key={t} className="dm-tag dm-tag-gray text-[9px] py-0.5 px-1.5">{t}</span>)}
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[var(--dm-gold)] text-xs font-display font-semibold group-hover:gap-2 transition-all">
              {copy.viewProfile}
              <svg className="w-3.5 h-3.5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </article>
        ))}
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

            <p className="font-mono text-[10px] text-[var(--dm-gold)] uppercase tracking-widest mb-3">{copy.qualifiedProfile}</p>
            <div className="flex items-start gap-4 mb-5">
              <span className="w-14 h-14 rounded-2xl bg-[var(--dm-bg-tertiary)] border border-[var(--dm-border)] flex items-center justify-center font-mono text-sm font-bold text-[var(--dm-gold)] shrink-0">
                {activeProfile.companyInitials}
              </span>
              <div className="min-w-0">
                <h3 id="dm-profile-title" className="font-display font-semibold text-xl text-[var(--dm-text-primary)]">{activeProfile.companyName}</h3>
                <p className="text-xs text-[var(--dm-text-muted)]">{activeProfile.contactName} · {activeProfile.role}</p>
                {activeProfile.sponsored && <span className="dm-badge-sponsored mt-2">{copy.sponsoredProfile}</span>}
              </div>
            </div>

            <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed mb-5">{activeProfile.about}</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
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

            <a
              href="#apply"
              onClick={() => {
                dispatchPrefill(copy.joinClub, `${activeProfile.companyName} (${activeProfile.contactName})`);
                closeProfile();
              }}
              className="dm-btn-primary w-full justify-center text-xs"
            >
              {copy.requestIntro} <span className="rtl:inline-block rtl:rotate-180">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
