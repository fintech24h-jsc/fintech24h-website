import { useState, useEffect } from 'react';
import { submitHubSpotForm } from '../../lib/hubspot';

type ProjectType = 'DeFi' | 'L1/L2' | 'Exchange' | 'GameFi' | 'AI Project' | 'Other';
type TargetRegion = 'Vietnam' | 'Singapore' | 'UAE' | 'Europe' | 'United States' | 'Hong Kong' | 'South Korea' | 'Japan' | 'United Kingdom' | 'Southeast Asia (SEA)' | 'Global' | 'Other';

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
  { id: 'events', name: 'Event Marketing & Side Events', costWeight: 0.2 },
  { id: 'bd', name: 'B2B Business Development', costWeight: 0.15 },
  { id: 'seo', name: 'Content Strategy & SEO', costWeight: 0.15 },
  { id: 'ai', name: 'AI Automation & Marketing Bots', costWeight: 0.15 },
  { id: 'other', name: 'Other (Custom Tactic)', costWeight: 0.2 }
];

const BUDGET_MILESTONES = [3000, 5000, 10000, 15000, 25000, 35000, 50000];

export default function CampaignCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>('DeFi');
  const [customProjectType, setCustomProjectType] = useState('');
  
  const [region, setRegion] = useState<TargetRegion>('Vietnam');
  const [customRegion, setCustomRegion] = useState('');

  const [budget, setBudget] = useState<number>(10000);
  const [selectedServices, setSelectedServices] = useState<string[]>(['kol', 'pr', 'community']);
  const [customService, setCustomService] = useState('');

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadLinkedIn, setLeadLinkedIn] = useState('');
  const [leadTelegram, setLeadTelegram] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadNote, setLeadNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    let serviceMultiplier = selectedServices.length * 0.2;
    if (selectedServices.length === 0) serviceMultiplier = 0.05;

    // Budget weighting
    const baseReach = (budget * 12) * serviceMultiplier;
    
    // Region weighting
    let regionMult = 1.0;
    if (region === 'Global') regionMult = 0.8;
    else if (region === 'Europe' || region === 'United States' || region === 'United Kingdom') regionMult = 0.65;
    else if (region === 'Singapore' || region === 'Hong Kong' || region === 'South Korea' || region === 'Japan') regionMult = 0.75;
    else if (region === 'UAE') regionMult = 0.9;
    else if (region === 'Vietnam' || region === 'Southeast Asia (SEA)') regionMult = 1.35;
    else if (region === 'Other') regionMult = 0.85;

    const reachVal = baseReach * regionMult;

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail || !leadTelegram) {
      setErrorMsg('Please fill in Name, Email, and Telegram fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const portalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID || '000000';
      const formId = import.meta.env.PUBLIC_HUBSPOT_FORM_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      const servicesString = selectedServices
        .map(id => {
          const opt = SERVICES_OPTIONS.find(o => o.id === id);
          if (id === 'other' && customService) {
            return `Other: ${customService}`;
          }
          return opt ? opt.name : id;
        })
        .join(', ');

      const finalRegion = region === 'Other' && customRegion ? `Other: ${customRegion}` : region;
      const finalProject = projectType === 'Other' && customProjectType ? `Other: ${customProjectType}` : projectType;

      const payload = {
        fields: [
          { name: 'firstname', value: leadName.split(' ')[0] || leadName },
          { name: 'lastname', value: leadName.split(' ').slice(1).join(' ') || '' },
          { name: 'email', value: leadEmail },
          { name: 'linkedin_url', value: leadLinkedIn },
          { name: 'telegram_handle', value: leadTelegram },
          { name: 'project_type', value: finalProject },
          { name: 'target_region', value: finalRegion },
          { name: 'budget_range', value: `$${budget.toLocaleString()} / mo` },
          { name: 'service_interest', value: servicesString },
          { name: 'message', value: leadNote || 'Calculated campaign via ROI Simulator.' },
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title,
        },
      };

      await submitHubSpotForm(portalId, formId, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Submission failed. Please contact us directly at info@fintech24h.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Configuration Controls (Left) */}
      <div className="lg:col-span-7 card-default p-6 sm:p-10 flex flex-col justify-between">
        <div class="space-y-8">
          
          {/* Heading 1 */}
          <div>
            <h3 className="font-mono text-xs sm:text-sm text-[#f0a278] uppercase tracking-[0.18em] mb-4 font-bold">
              01 / Configure Project Sector
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {(['DeFi', 'L1/L2', 'Exchange', 'GameFi', 'AI Project', 'Other'] as ProjectType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProjectType(type)}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold font-display transition-all duration-300 ${
                    projectType === type
                      ? 'border-[#ff6b83] bg-[rgba(255,107,131,0.04)] text-[#f0a278] shadow-[0_0_15px_rgba(255,107,131,0.1)]'
                      : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {projectType === 'Other' && (
              <input
                type="text"
                value={customProjectType}
                onChange={e => setCustomProjectType(e.target.value)}
                placeholder="Specify your project type..."
                className="mt-3 w-full input-field"
              />
            )}
          </div>

          {/* Heading 2 */}
          <div>
            <h3 className="font-mono text-xs sm:text-sm text-[var(--accent-cyan)] uppercase tracking-[0.18em] mb-4 font-bold">
              02 / Target Geography
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {(['Vietnam', 'Singapore', 'UAE', 'Europe', 'United States', 'Hong Kong', 'South Korea', 'Japan', 'United Kingdom', 'Southeast Asia (SEA)', 'Global', 'Other'] as TargetRegion[]).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold font-display transition-all duration-300 ${
                    region === r
                      ? 'border-[var(--accent-cyan)] bg-[rgba(0,200,240,0.06)] text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,200,240,0.1)]'
                      : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:text-white hover:border-white/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {region === 'Other' && (
              <input
                type="text"
                value={customRegion}
                onChange={e => setCustomRegion(e.target.value)}
                placeholder="Specify your target country/region..."
                className="mt-3 w-full input-field"
              />
            )}
          </div>

          {/* Heading 3 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono text-xs sm:text-sm text-[var(--accent-purple)] uppercase tracking-[0.18em] font-bold">
                03 / Monthly Growth Budget
              </h3>
              <span className="font-display text-sm sm:text-base font-bold text-white bg-white/[0.04] border border-white/10 px-3.5 py-1.5 rounded-xl">
                ${budget.toLocaleString()} / mo
              </span>
            </div>
            
            <div className="relative pt-2 pb-6">
              <input
                type="range"
                min="3000"
                max="50000"
                step="1000"
                value={budget}
                onChange={e => setBudget(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff6b83]"
              />
              
              {/* Timeline dot ticks representing budget milestones */}
              <div class="absolute left-0 right-0 top-6 flex justify-between px-1">
                {BUDGET_MILESTONES.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudget(val)}
                    class="group flex flex-col items-center focus:outline-none"
                  >
                    <span class={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                      budget >= val ? 'bg-[#ff6b83] border-[#ff6b83] scale-125' : 'bg-neutral-800 border-white/10 hover:border-white/40'
                    }`}></span>
                    <span class="text-[8px] font-mono text-[var(--text-muted)] mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      ${(val / 1000).toFixed(0)}K
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Heading 4 */}
          <div>
            <h3 className="font-mono text-xs sm:text-sm text-[#f0a278] uppercase tracking-[0.18em] mb-4 font-bold">
              04 / Growth Tactic Toggles
            </h3>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {SERVICES_OPTIONS.map(opt => {
                const isActive = selectedServices.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleService(opt.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-300 ${
                      isActive
                        ? 'border-[#ff6b83]/40 bg-[rgba(255,107,131,0.02)]'
                        : 'border-white/5 bg-white/5 opacity-70 hover:opacity-100 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      isActive ? 'border-[#ff6b83] bg-[#ff6b83] text-[#050810]' : 'border-white/20'
                    }`}>
                      {isActive && (
                        <svg className="w-3 h-3 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] font-body">{opt.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedServices.includes('other') && (
              <input
                type="text"
                value={customService}
                onChange={e => setCustomService(e.target.value)}
                placeholder="Specify your custom marketing tactic..."
                className="mt-3.5 w-full input-field"
              />
            )}
          </div>

        </div>
      </div>

      {/* Dynamic Results & Contact Form (Right) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Results Card */}
        <div className="p-8 rounded-[24px] border border-[#ff6b83]/20 bg-gradient-to-br from-[rgba(255,107,131,0.03)] via-transparent to-[rgba(124,92,252,0.04)] shadow-[0_20px_50px_rgba(255,107,131,0.04)] relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,107,131,0.03) 0%, transparent 60%) pointer-events-none"></div>

          <div className="relative z-10">
            <div class="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <h4 className="font-mono text-xs text-[#f0a278] uppercase tracking-widest font-bold">Estimated ROI &amp; KPIs</h4>
              <span className="tag bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/30 font-mono text-[9px]">90-Day Simulation</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-end border-b border-white/[0.04] pb-3.5">
                <div>
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Estimated Reach</span>
                  <span className="text-xs text-[var(--text-secondary)] font-body">Target regional audience</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">{results.reach}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-white/[0.04] pb-3.5">
                <div>
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">KOL Partnerships</span>
                  <span className="text-xs text-[var(--text-secondary)] font-body">Vetted influencers activated</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--accent-cyan)] tracking-tight">{results.kols}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-white/[0.04] pb-3.5">
                <div>
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">Community Growth</span>
                  <span className="text-xs text-[var(--text-secondary)] font-body">Estimated active members</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-[var(--accent-purple)] tracking-tight">{results.community}</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-white/[0.04] pb-3.5">
                <div>
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">PR Placements</span>
                  <span className="text-xs text-[var(--text-secondary)] font-body">Tier-1 editorial slots</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">{results.prCount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3">
                <div>
                  <span className="font-mono text-[9px] text-[#f0a278] uppercase tracking-widest font-semibold block mb-0.5">Projected ROI</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-body">Historical reference average</span>
                </div>
                <div className="text-right bg-gradient-to-r from-[#ff6b83] to-[#f0a278] bg-clip-text text-transparent">
                  <span className="font-display text-3xl sm:text-4xl font-bold tracking-tighter">{results.roi}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Details Card */}
        <div className="card-default p-6 sm:p-8 flex flex-col justify-between">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <h4 className="font-mono text-xs text-[var(--accent-cyan)] uppercase tracking-widest font-bold border-b border-white/5 pb-3 mb-2">
              05 / Claim Custom Proposal
            </h4>

            {errorMsg && (
              <div className="p-3 text-xs text-red-400 border border-red-500/20 bg-red-500/5 rounded-xl font-body">
                {errorMsg}
              </div>
            )}

            {isSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] border border-[var(--color-success)]/20 flex items-center justify-center mx-auto text-[var(--color-success)] text-xl">
                  ✓
                </div>
                <h5 className="font-display text-base font-bold text-white">Strategy Submitted!</h5>
                <p className="text-xs text-[var(--text-secondary)] font-body">
                  Thank you. Our experts will reach out to schedule a proposal review within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <div class="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1 font-body">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      placeholder="Alex Nguyen"
                      className="w-full input-field text-xs py-2 px-3 h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1 font-body">Telegram Username *</label>
                    <input
                      type="text"
                      required
                      value={leadTelegram}
                      onChange={e => setLeadTelegram(e.target.value)}
                      placeholder="@alex_handle"
                      className="w-full input-field text-xs py-2 px-3 h-10"
                    />
                  </div>
                </div>

                <div class="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1 font-body">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={e => setLeadEmail(e.target.value)}
                      placeholder="alex@project.io"
                      className="w-full input-field text-xs py-2 px-3 h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1 font-body">LinkedIn URL</label>
                    <input
                      type="url"
                      value={leadLinkedIn}
                      onChange={e => setLeadLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full input-field text-xs py-2 px-3 h-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[var(--text-secondary)] mb-1 font-body">Strategy Requirements / Notes</label>
                  <textarea
                    rows={2}
                    value={leadNote}
                    onChange={e => setLeadNote(e.target.value)}
                    placeholder="E.g., Token launch date, specific KOL requirements..."
                    className="w-full input-field text-xs py-2 px-3 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full text-center justify-center font-display text-xs flex items-center gap-2 py-3 bg-gradient-to-r from-[#ff6b83] to-[#f0a278] text-[#050810] border-none shadow-[0_4px_15px_rgba(255,107,131,0.15)] hover:opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Request...' : 'Claim Custom Strategy'}
                </button>
              </>
            )}
          </form>
        </div>

      </div>

    </div>
  );
}
