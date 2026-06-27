import { useState, useEffect } from 'react';

type ProjectType = 'DeFi' | 'L1/L2' | 'Exchange' | 'GameFi' | 'AI Project';
type TargetRegion = 'Vietnam' | 'Singapore' | 'UAE' | 'Europe' | 'Global';

interface ServiceOption {
  id: string;
  name: string;
  costWeight: number;
}

const SERVICES_OPTIONS: ServiceOption[] = [
  { id: 'kol', name: 'KOL & Influencer Marketing', costWeight: 0.4 },
  { id: 'pr', name: 'PR & Media Coverage (Bloomberg, etc.)', costWeight: 0.25 },
  { id: 'community', name: '24/7 Moderation & Bot Security', costWeight: 0.15 },
  { id: 'growth', name: 'Airdrop & Referral Quests', costWeight: 0.2 },
];

export default function CampaignCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>('DeFi');
  const [region, setRegion] = useState<TargetRegion>('Vietnam');
  const [budget, setBudget] = useState<number>(10000);
  const [selectedServices, setSelectedServices] = useState<string[]>(['kol', 'pr', 'community']);

  const [results, setResults] = useState({
    reach: '0',
    kols: 0,
    community: '0',
    prCount: 0,
    roi: '0',
  });

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    // Calculate estimates based on parameters
    let serviceMultiplier = selectedServices.length * 0.25;
    if (selectedServices.length === 0) serviceMultiplier = 0.05;

    // Budget weighting
    const baseReach = (budget * 12) * serviceMultiplier;
    const reachVal = region === 'Global' ? baseReach * 0.8 : region === 'Europe' ? baseReach * 0.6 : region === 'Singapore' ? baseReach * 0.7 : region === 'UAE' ? baseReach * 0.9 : baseReach * 1.3;

    // KOLs count
    const hasKol = selectedServices.includes('kol');
    const kolsVal = hasKol ? Math.round((budget * 0.4) / (region === 'Vietnam' ? 250 : 600)) : 0;

    // Community size
    const hasCommunity = selectedServices.includes('community');
    const hasGrowth = selectedServices.includes('growth');
    let commMultiplier = 1;
    if (hasCommunity) commMultiplier += 0.5;
    if (hasGrowth) commMultiplier += 1.2;
    const communityVal = Math.round((budget * 0.35) * commMultiplier / (region === 'Vietnam' ? 1.2 : 3.5));

    // PR Placements
    const hasPR = selectedServices.includes('pr');
    const prVal = hasPR ? Math.max(1, Math.round((budget * 0.25) / 1200)) : 0;

    // ROI Multiplier estimation
    let baseROI = 12;
    if (projectType === 'AI Project') baseROI += 8;
    if (projectType === 'L1/L2') baseROI += 5;
    if (selectedServices.includes('kol') && selectedServices.includes('pr')) baseROI += 15;
    if (region === 'Vietnam' || region === 'UAE') baseROI += 6;
    const roiMultiplier = (baseROI * (0.8 + (budget / 50000) * 0.4)).toFixed(1);

    // Format numbers
    const formatNumber = (num: number) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
      return num.toString();
    };

    setResults({
      reach: formatNumber(Math.round(reachVal)),
      kols: Math.max(0, kolsVal),
      community: formatNumber(Math.max(0, communityVal)),
      prCount: prVal,
      roi: roiMultiplier + 'x',
    });
  }, [projectType, region, budget, selectedServices]);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      {/* Configuration Controls (Left) */}
      <div className="lg:col-span-7 card-default p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h3 className="font-mono text-[10px] text-[#ff9966] uppercase tracking-[0.15em] mb-3">01 / Configure Project</h3>
            <div className="flex flex-wrap gap-2">
              {(['DeFi', 'L1/L2', 'Exchange', 'GameFi', 'AI Project'] as ProjectType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setProjectType(type)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold font-display transition-all ${
                    projectType === type
                      ? 'border-[#ff5e62] bg-[rgba(255,94,98,0.06)] text-[#ff9966]'
                      : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-mono text-[10px] text-[var(--accent-cyan)] uppercase tracking-[0.15em] mb-3">02 / Target Geography</h3>
            <div className="flex flex-wrap gap-2">
              {(['Vietnam', 'Singapore', 'UAE', 'Europe', 'Global'] as TargetRegion[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`px-4 py-2 rounded-lg border text-xs font-semibold font-display transition-all ${
                    region === r
                      ? 'border-[var(--accent-cyan)] bg-[rgba(0,200,240,0.06)] text-[var(--accent-cyan)]'
                      : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-mono text-[10px] text-[var(--accent-purple)] uppercase tracking-[0.15em]">03 / Monthly Growth Budget</h3>
              <span className="font-display text-sm font-bold text-white bg-white/[0.04] border border-white/10 px-3 py-1 rounded">
                ${budget.toLocaleString()} / mo
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="50000"
              step="1000"
              value={budget}
              onChange={e => setBudget(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff5e62]"
            />
            <div className="flex justify-between text-[9px] font-mono text-[var(--text-muted)] mt-1.5">
              <span>$3,000</span>
              <span>$25,000</span>
              <span>$50,000+</span>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="font-mono text-[10px] text-[#ff9966] uppercase tracking-[0.15em] mb-3">04 / Growth Tactic Toggles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {SERVICES_OPTIONS.map(opt => {
                const isActive = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleService(opt.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                      isActive
                        ? 'border-[#ff5e62]/40 bg-[rgba(255,94,98,0.03)]'
                        : 'border-white/5 bg-white/5 opacity-60 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isActive ? 'border-[#ff5e62] bg-[#ff5e62] text-[#050810]' : 'border-white/20'
                    }`}>
                      {isActive && (
                        <svg className="w-2.5 h-2.5 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-primary)] font-body">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Results Dashboard (Right) */}
      <div className="lg:col-span-5 p-8 flex flex-col justify-between rounded-[24px] border border-[#ff5e62]/30 bg-gradient-to-br from-[rgba(255,94,98,0.06)] via-transparent to-[rgba(124,92,252,0.04)] shadow-[0_20px_50px_rgba(255,94,98,0.08)] relative overflow-hidden">
        {/* Shimmer effect inside */}
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,94,98,0.05) 0%, transparent 60%) pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h4 className="font-mono text-xs text-[#ff9966] uppercase tracking-widest font-semibold">Estimate ROI & KPIs</h4>
            <span className="tag bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/30 font-mono text-[9px]">90-Day Simulation</span>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
              <div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">Estimated Reach</span>
                <span className="text-sm font-body text-[var(--text-secondary)]">Target regional audience</span>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-bold text-white tracking-tight">{results.reach}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
              <div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">KOL Partnerships</span>
                <span className="text-sm font-body text-[var(--text-secondary)]">Vetted influencers activated</span>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-bold text-[var(--accent-cyan)] tracking-tight">{results.kols}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
              <div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">Community Growth</span>
                <span className="text-sm font-body text-[var(--text-secondary)]">Estimated active members</span>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-bold text-[var(--accent-purple)] tracking-tight">{results.community}</span>
              </div>
            </div>

            <div className="flex justify-between items-end border-b border-white/[0.04] pb-4">
              <div>
                <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">PR Placements</span>
                <span className="text-sm font-body text-[var(--text-secondary)]">Tier-1 editorial slots</span>
              </div>
              <div className="text-right">
                <span className="font-display text-3xl font-bold text-white tracking-tight">{results.prCount}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <span className="font-mono text-[9px] text-[#ff9966] uppercase tracking-widest font-semibold block mb-1">Projected ROI</span>
                <span className="text-xs font-body text-[var(--text-muted)]">Historical average reference</span>
              </div>
              <div className="text-right bg-gradient-to-r from-[#ff5e62] to-[#ff9966] bg-clip-text text-transparent">
                <span className="font-display text-4xl font-bold tracking-tighter">{results.roi}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
          <a
            href="#get-proposal"
            className="btn-primary w-full text-center justify-center font-display text-sm flex items-center gap-2 py-3.5 bg-gradient-to-r from-[#ff5e62] to-[#ff9966] text-[#050810] border-none shadow-[0_4px_20px_rgba(255,94,98,0.25)] hover:shadow-[0_4px_30px_rgba(255,94,98,0.4)]"
          >
            <span>Request Detailed Proposal</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
