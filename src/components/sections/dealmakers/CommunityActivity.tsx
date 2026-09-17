import { useEffect, useState } from 'react';
import { getSS3Content, type DealmakersLocale } from '../../../data/dealmakers/content';

// One-off role notes for specific real members, keyed by Telegram username
// (lowercase). Not a general feature — just how this specific person's
// title is surfaced next to their activity.
const MEMBER_ROLE_NOTES: Record<string, string> = {
  phatvt: 'Co-Founder & CPO, Fintech24h',
  vincentnguyen0501: 'Co-Founder & CEO, Fintech24h',
  fintech24hijayc: 'Head of CM, Fintech24h',
  tracyho12: 'Content & Social Media Specialist, Fintech24h',
};

type CommunityMember = {
  telegramUserId?: string;
  displayName: string;
  username?: string | null;
  lastActiveAt: string;
  source?: 'message' | 'admin_seed';
  hasAvatar?: boolean;
};

type CommunityPulse = {
  activeMembersLast24Hours: number;
  activeMembersLast7Days: number;
  updatedAt: string;
  members: CommunityMember[];
};

// The public Worker URL is a safe fallback for the production campaign.
// PUBLIC_DEALMAKERS_PULSE_API_URL can override it for a custom domain or a
// staging Worker without requiring a component change.
const pulseApiUrl = import.meta.env.PUBLIC_DEALMAKERS_PULSE_API_URL
  || 'https://fintech24h-dealmakers-community.fintech24hvn.workers.dev/v1/pulse';
const workerBaseUrl = pulseApiUrl.replace(/\/v1\/pulse\/?$/, '');
const refreshIntervalMs = 60_000;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'DM';
}

function relativeTime(iso: string, locale: DealmakersLocale) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (locale === 'ar') {
    if (seconds < 60) return 'نشط الآن';
    if (minutes < 60) return `نشط منذ ${minutes} د`;
    if (hours < 24) return `نشط منذ ${hours} س`;
    return `نشط منذ ${days} يوم`;
  }
  if (seconds < 60) return 'Active just now';
  if (minutes < 60) return `Active ${minutes}m ago`;
  if (hours < 24) return `Active ${hours}h ago`;
  return `Active ${days}d ago`;
}

function updatedTime(iso: string, locale: DealmakersLocale) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  if (locale === 'ar') {
    return seconds < 60 ? 'تم التحديث الآن' : `تم التحديث منذ ${minutes} د`;
  }
  return seconds < 60 ? 'Updated just now' : `Updated ${minutes} min ago`;
}

// Real Telegram profile photo when available, proxied through the Worker
// so the bot token never reaches the browser — falls back to an
// initials badge on 404 (no photo set) or any load error.
function MemberAvatar({ member }: { member: CommunityMember }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = member.hasAvatar && member.telegramUserId && !failed;

  return (
    <span className="relative w-11 h-11 shrink-0 rounded-full p-[1.5px]" style={{ background: 'linear-gradient(135deg, var(--dm-gold), var(--dm-emerald))' }}>
      <span className="flex w-full h-full items-center justify-center rounded-full bg-[var(--dm-bg-secondary)] overflow-hidden">
        {showPhoto ? (
          <img
            src={`${workerBaseUrl}/v1/avatar/${member.telegramUserId}`}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="font-mono font-medium text-[12px] text-[var(--dm-gold-bright)]">{initials(member.displayName)}</span>
        )}
      </span>
    </span>
  );
}

interface Props {
  locale?: DealmakersLocale;
}

export default function CommunityActivity({ locale = 'en' }: Props) {
  const { telegramGroupUrl } = getSS3Content(locale);
  const copy = locale === 'ar' ? {
    eyebrow: 'نشاط المجتمع',
    h2a: 'أشخاص حقيقيون،',
    h2b: 'ونقاشات نشطة.',
    intro: 'عرض مباشر للأعضاء النشطين مؤخرًا في Fi24h DealMakers’ Club. لا نعرض أو نخزّن محتوى الرسائل هنا إطلاقًا.',
    recentlyActive: 'الأعضاء النشطون مؤخرًا',
    fallbackMember: 'عضو في Fi24h DealMakers',
    team: 'الفريق',
    warmingUpH: 'نشاط المجتمع في طور التهيئة',
    warmingUpB: 'سيظهر بث الأعضاء المباشر هنا فور ربط خدمة نشاط تيليجرام الخاصة بـ DealMakers.',
    reconnecting: ' نحن بصدد إعادة الاتصال بأحدث بيانات النشاط.',
  } : {
    eyebrow: 'Community activity',
    h2a: 'Real people,',
    h2b: 'active conversations.',
    intro: 'A live view of members recently active in Fi24h DealMakers’ Club. We never show or store message content here.',
    recentlyActive: 'Recently active members',
    fallbackMember: 'Fi24h DealMakers member',
    team: 'Team',
    warmingUpH: 'Community activity is warming up',
    warmingUpB: 'The live member feed will appear here as soon as the DealMakers Telegram activity service is connected.',
    reconnecting: ' We’re reconnecting to the latest activity data.',
  };
  const [pulse, setPulse] = useState<CommunityPulse | null>(null);
  const [hasError, setHasError] = useState(false);
  // Ticks every second purely to re-render — relativeTime()/updatedTime()
  // read Date.now() fresh each render, so "Active 2m ago" visibly counts up
  // in real time between the 60s network refetches instead of looking
  // frozen. No data changes here, just a render trigger.
  const [, setTick] = useState(0);

  useEffect(() => {
    const clock = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!pulseApiUrl) return;

    let cancelled = false;

    const loadPulse = async () => {
      try {
        const response = await fetch(pulseApiUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`Community pulse request failed: ${response.status}`);
        const nextPulse = await response.json() as CommunityPulse;
        if (!cancelled) {
          setPulse(nextPulse);
          setHasError(false);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setHasError(true);
      }
    };

    loadPulse();
    const interval = window.setInterval(loadPulse, refreshIntervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const hasActivity = Boolean(pulse && (pulse.activeMembersLast7Days > 0 || pulse.members.length > 0));

  return (
    <section id="community-activity" className="relative py-20 lg:py-28" aria-labelledby="community-activity-heading">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute w-[420px] h-[420px] rounded-full opacity-25 mix-blend-screen dm-orb-emerald" style={{ top: '-25%', right: '-10%', filter: 'blur(100px)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10" data-dm-reveal>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] text-[var(--dm-emerald-bright)] uppercase tracking-[0.18em] mb-3">
            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--dm-emerald)] ${hasActivity ? 'dm-live-dot' : ''}`} aria-hidden="true" />
            {copy.eyebrow}
          </div>
          <h2 id="community-activity-heading" className="font-display font-semibold text-h2 text-[var(--dm-text-primary)] mb-4">
            {copy.h2a} <span className="dm-text-gradient">{copy.h2b}</span>
          </h2>
          <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed">
            {copy.intro}
          </p>
        </div>

        {hasActivity && pulse ? (
          <div className="dm-card max-w-5xl mx-auto overflow-hidden" aria-live="polite">
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[var(--dm-border)]">
              <h3 className="font-display font-semibold text-base text-[var(--dm-text-primary)]">{copy.recentlyActive}</h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--dm-emerald-bright)] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-emerald-bright)] dm-live-dot" aria-hidden="true" />
                {updatedTime(pulse.updatedAt, locale)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--dm-border)]">
              {pulse.members.map((member) => {
                const roleNote = member.username ? MEMBER_ROLE_NOTES[member.username.toLowerCase()] : undefined;
                return (
                  <a
                    key={`${member.telegramUserId ?? member.username ?? member.displayName}-${member.lastActiveAt}`}
                    href={telegramGroupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-4 bg-[var(--dm-bg-secondary)] transition-colors duration-200 hover:bg-white/[0.03]"
                  >
                    <MemberAvatar member={member} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--dm-text-primary)] truncate">{member.displayName}</p>
                      <p className="text-[11px] text-[var(--dm-text-muted)] truncate">
                        {member.username ? `@${member.username}` : copy.fallbackMember}
                        {roleNote ? <span className="text-[var(--dm-gold-bright)]"> · {roleNote}</span> : null}
                      </p>
                    </div>
                    {member.source === 'admin_seed' ? (
                      <span className="dm-tag dm-tag-gold shrink-0">{copy.team}</span>
                    ) : (
                      <span className="dm-tag dm-tag-emerald shrink-0 whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dm-emerald-bright)] dm-live-dot" aria-hidden="true" />
                        {relativeTime(member.lastActiveAt, locale)}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="dm-card p-6 sm:p-8 max-w-3xl" data-dm-reveal>
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 shrink-0 rounded-xl border border-[var(--dm-border)] bg-[var(--dm-bg-tertiary)] flex items-center justify-center text-[var(--dm-gold)]" aria-hidden="true">✦</span>
              <div>
                <h3 className="font-display font-semibold text-base text-[var(--dm-text-primary)] mb-2">{copy.warmingUpH}</h3>
                <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed">
                  {copy.warmingUpB}
                  {hasError ? copy.reconnecting : ''}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
