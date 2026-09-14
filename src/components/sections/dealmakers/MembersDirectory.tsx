import { useEffect, useMemo, useRef, useState } from 'react';
import { dealMakersMembers, type DealMakerMember } from '../../../data/dealmakers/members';

const PAGE_SIZE = 24;

export default function MembersDirectory() {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealMakersMembers;
    return dealMakersMembers.filter((m) =>
      m.name.toLowerCase().includes(q)
      || (m.company ?? '').toLowerCase().includes(q)
      || (m.role ?? '').toLowerCase().includes(q)
    );
  }, [query]);

  const visible = filtered.slice(0, visibleCount);
  const activeMember: DealMakerMember | undefined = dealMakersMembers.find((m) => m.slug === activeSlug);

  const openMember = (slug: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) triggerRef.current = e.currentTarget as HTMLElement;
    setActiveSlug(slug);
    setCopied(false);
    window.history.pushState(null, '', `#${slug}`);
  };

  const closeMember = () => {
    setActiveSlug(null);
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    triggerRef.current?.focus();
  };

  // Deep-link support: open the matching member on load, and react to
  // back/forward navigation (so a copied #slug link and the browser's own
  // history both work).
  useEffect(() => {
    const applyHash = () => {
      const slug = window.location.hash.replace(/^#/, '');
      if (slug && dealMakersMembers.some((m) => m.slug === slug)) {
        setActiveSlug(slug);
      } else {
        setActiveSlug(null);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    window.addEventListener('popstate', applyHash);
    return () => {
      window.removeEventListener('hashchange', applyHash);
      window.removeEventListener('popstate', applyHash);
    };
  }, []);

  // Focus trap + Escape + return focus, same pattern as QualifiedDirectory.
  useEffect(() => {
    if (!activeSlug) return;
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMember();
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

  const copyLink = async () => {
    if (!activeMember) return;
    const url = `${window.location.origin}${window.location.pathname}#${activeMember.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the URL is already in the address bar.
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dm-text-muted)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-3.8-3.8" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            placeholder="Search by name, company, or role…"
            aria-label="Search DealMakers members"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] text-sm text-[var(--dm-text-primary)] placeholder:text-[var(--dm-text-muted)] focus:outline-none focus:border-[var(--dm-border-accent)] transition-colors"
          />
        </div>
        <p className="text-center text-xs text-[var(--dm-text-muted)] mt-3 font-mono">
          {filtered.length} of {dealMakersMembers.length} members
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--dm-text-secondary)] py-16">
          No members match “{query}”.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((m, i) => (
              <button
                key={m.slug}
                type="button"
                onClick={(e) => openMember(m.slug, e)}
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
                className="dm-card group text-left overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--dm-gold)] focus-visible:outline-offset-2"
                aria-haspopup="dialog"
                aria-label={`View ${m.name}'s DealMakers card`}
              >
                <span className="block aspect-[916/768] overflow-hidden">
                  <img
                    src={m.photo}
                    alt={`${m.name} — Fi24h DealMakers' Club invite card`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </span>
              </button>
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="dm-btn-ghost py-2.5 px-6 text-[10px]"
              >
                Load more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {activeMember && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(6,5,4,0.8)] backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeMember(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dm-member-title"
            className="relative w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-[var(--dm-border)] bg-[rgba(19,17,16,0.97)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          >
            <button
              onClick={closeMember}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 w-8 h-8 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:border-[var(--dm-border-hover)] flex items-center justify-center transition-colors"
            >
              ×
            </button>

            <img
              src={activeMember.photo}
              alt={`${activeMember.name} — Fi24h DealMakers' Club invite card`}
              className="w-full aspect-[916/768] object-cover"
            />

            <div className="p-6 sm:p-7">
              <h3 id="dm-member-title" className="font-display font-semibold text-xl text-[var(--dm-text-primary)]">{activeMember.name}</h3>
              {(activeMember.role || activeMember.company) && (
                <p className="text-sm text-[var(--dm-text-secondary)] mt-1">
                  {activeMember.role}
                  {activeMember.role && activeMember.company && ' · '}
                  {activeMember.company}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 mt-5">
                {activeMember.website && (
                  <a href={activeMember.website} target="_blank" rel="noopener noreferrer" className="dm-btn-ghost py-2 px-4 text-[10px]">
                    Website ↗
                  </a>
                )}
                {activeMember.linkedin && (
                  <a href={activeMember.linkedin} target="_blank" rel="noopener noreferrer" className="dm-btn-ghost py-2 px-4 text-[10px]">
                    LinkedIn ↗
                  </a>
                )}
                {activeMember.telegramLink && (
                  <a href={activeMember.telegramLink} target="_blank" rel="noopener noreferrer" className="dm-btn-primary py-2 px-4 text-[10px]">
                    Telegram ↗
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={copyLink}
                className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] text-xs text-[var(--dm-text-secondary)] hover:text-[var(--dm-text-primary)] hover:border-[var(--dm-border-hover)] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 012-2h10" />
                </svg>
                {copied ? 'Link copied!' : 'Copy link to this card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
