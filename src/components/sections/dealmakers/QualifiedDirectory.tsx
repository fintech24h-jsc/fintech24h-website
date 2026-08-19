import { useEffect, useMemo, useRef, useState } from 'react';
import { directoryProfiles, type DirectoryCategory, type DirectoryProfile } from '../../../data/dealmakers/ss3';

type FilterKey = 'all' | 'sponsored' | DirectoryCategory;

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả profile' },
  { key: 'sponsored', label: 'Sponsored' },
  { key: 'capital', label: 'Tìm vốn' },
  { key: 'listing', label: 'Listing & liquidity' },
  { key: 'partner', label: 'Đối tác chiến lược' },
  { key: 'service', label: 'Growth & services' },
];

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

export default function QualifiedDirectory() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const visibleProfiles = useMemo(() => {
    if (activeFilter === 'all') return directoryProfiles;
    if (activeFilter === 'sponsored') return directoryProfiles.filter((p) => p.sponsored);
    return directoryProfiles.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

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
      <aside className="card-default p-5 h-fit">
        <h3 className="font-display font-bold text-sm text-[var(--text-primary)] mb-1">Lọc profile</h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">Khám phá theo mục tiêu deal hoặc profile được ưu tiên hiển thị.</p>
        <div className="grid gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              aria-pressed={activeFilter === f.key}
              className="select-option flex items-center justify-between text-left"
              data-dm-track="directory_filter"
              data-dm-track-label={f.key}
            >
              <span>{f.label}</span>
              <b className="font-mono text-[10px] text-[var(--text-muted)]">{String(countFor(f.key)).padStart(2, '0')}</b>
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-5 leading-relaxed">
          <strong className="text-[var(--text-primary)]">Qualified Listing: $200 / season.</strong><br />
          Thêm <strong className="text-[var(--accent-cyan)]">$150</strong> để gắn nhãn Sponsored và ưu tiên xuất hiện.
        </p>
        <a
          href="#apply"
          data-dm-prefill-interest="Qualified Listing — $200/season"
          data-dm-track="directory_post_listing"
          className="btn-ghost w-full justify-center text-xs mt-4 border border-[var(--border-default)]"
        >
          Đăng profile của bạn
        </a>
      </aside>

      {/* Deal list */}
      <div className="grid gap-3" role="list" aria-label="Qualified Listing Directory">
        {visibleProfiles.map((p) => (
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
            className={`group grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
              p.sponsored
                ? 'border-[var(--accent-cyan)]/35 bg-gradient-to-r from-[var(--accent-cyan)]/8 to-transparent hover:border-[var(--accent-cyan)]/55'
                : 'border-[var(--border-default)] bg-white/[0.02] hover:border-[var(--border-hover)] hover:bg-white/[0.04]'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-cyan)] focus-visible:outline-offset-2`}
          >
            <span className="w-11 h-11 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--accent-cyan)]">
              {p.companyInitials}
            </span>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-sm text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
                {p.companyName}
                {p.sponsored && (
                  <span className="tag tag-cyan text-[9px] py-0.5 px-2">✦ Sponsored</span>
                )}
              </h4>
              <p className="text-xs text-[var(--text-muted)] truncate">{p.contactName} · {p.role} · {p.dealGoal}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.tags.map((t) => <span key={t} className="tag tag-gray text-[9px] py-0.5 px-1.5">{t}</span>)}
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[var(--accent-cyan)] text-xs font-display font-semibold group-hover:gap-2 transition-all">
              Xem profile
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </article>
        ))}
      </div>

      {/* Profile modal */}
      {activeProfile && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#020310]/80 backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeProfile(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-profile-title"
            className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-white/10 bg-[#0c1226]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-7"
          >
            <button
              onClick={closeProfile}
              aria-label="Đóng profile"
              className="absolute right-4 top-4 w-8 h-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-hover)] flex items-center justify-center transition-colors"
            >
              ×
            </button>

            <p className="font-mono text-[10px] text-[var(--accent-cyan)] uppercase tracking-widest mb-3">Qualified profile</p>
            <div className="flex items-start gap-4 mb-5">
              <span className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center font-mono text-sm font-bold text-[var(--accent-cyan)] shrink-0">
                {activeProfile.companyInitials}
              </span>
              <div className="min-w-0">
                <h3 id="dm-profile-title" className="font-display font-bold text-xl text-[var(--text-primary)]">{activeProfile.companyName}</h3>
                <p className="text-xs text-[var(--text-muted)]">{activeProfile.contactName} · {activeProfile.role}</p>
                {activeProfile.sponsored && <span className="tag tag-cyan text-[9px] py-0.5 px-2 mt-2 inline-block">✦ Sponsored profile</span>}
              </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">{activeProfile.about}</p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--accent-cyan)] mb-1.5">We Offer</strong>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{activeProfile.weOffer}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                <strong className="block text-[10px] uppercase tracking-widest text-[var(--accent-purple)] mb-1.5">We Are Looking For</strong>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{activeProfile.weAreLookingFor}</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-tertiary)] mb-6">
              <strong className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">Focus & markets</strong>
              <p className="text-xs text-[var(--text-secondary)]">{activeProfile.focusMarket}</p>
            </div>

            <a
              href="#apply"
              onClick={() => {
                dispatchPrefill('Tham gia DealMakers’ Club', `${activeProfile.companyName} — ${activeProfile.contactName}`);
                closeProfile();
              }}
              className="btn-primary w-full justify-center text-xs"
            >
              Request Introduction →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
