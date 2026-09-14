import { useMemo, useState } from 'react';
import { dealMakersMembers } from '../../../data/dealmakers/members';

const PAGE_SIZE = 24;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function MembersDirectory() {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((m, i) => (
              <article
                key={m.slug}
                className="dm-card group p-5 flex flex-col items-center text-center"
                style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  width={72}
                  height={72}
                  loading="lazy"
                  className="w-16 h-16 rounded-full object-cover border border-[var(--dm-border)] mb-3"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <span
                  className="hidden w-16 h-16 rounded-full border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] items-center justify-center font-mono text-xs font-bold text-[var(--dm-gold)] mb-3"
                  aria-hidden="true"
                >
                  {initials(m.name)}
                </span>

                <h3 className="font-display font-semibold text-sm text-[var(--dm-text-primary)] leading-snug">{m.name}</h3>
                {(m.role || m.company) && (
                  <p className="text-[11px] text-[var(--dm-text-muted)] mt-1 leading-snug">
                    {m.role}
                    {m.role && m.company && <br />}
                    {m.company}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4">
                  {m.website && (
                    <a
                      href={m.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name}'s website`}
                      className="dm-btn-icon"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" />
                        <path strokeLinecap="round" d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                      </svg>
                    </a>
                  )}
                  {m.telegramLink && (
                    <a
                      href={m.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${m.name} on Telegram`}
                      className="dm-btn-icon"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.1.02-1.62 1.03-4.57 3.02-.43.3-.82.45-1.17.44-.39-.01-1.15-.22-1.71-.41-.69-.23-1.24-.35-1.19-.74.03-.2.3-.41.82-.62 3.2-1.39 5.34-2.31 6.42-2.76 3.05-1.28 3.68-1.5 4.1-.11.02.04.05.09.05.14z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </article>
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
    </div>
  );
}
