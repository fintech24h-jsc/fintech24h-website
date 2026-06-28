import { useState, useEffect } from 'react';
import { submitHubSpotForm } from '../../lib/hubspot';

type ProjectType = 'DeFi' | 'L1/L2' | 'Exchange' | 'GameFi' | 'AI Project' | 'Other';
type TargetRegion = 'Vietnam' | 'Singapore' | 'UAE' | 'Europe' | 'United States' | 'United Kingdom' | 'Hong Kong' | 'South Korea' | 'Japan' | 'Southeast Asia (SEA)' | 'Global' | 'Other';

interface ServiceOption {
  id: string;
  name: string;
}

const SERVICES_OPTIONS: ServiceOption[] = [
  { id: 'kol', name: 'KOL & Influencer Marketing' },
  { id: 'pr', name: 'PR & Media Coverage (Bloomberg, etc.)' },
  { id: 'community', name: '24/7 Moderation & Bot Security' },
  { id: 'growth', name: 'Airdrop & Referral Quests' },
  { id: 'events', name: 'Event Marketing & Side Events' },
  { id: 'bd', name: 'B2B Business Development' },
  { id: 'seo', name: 'Content Strategy & SEO' },
  { id: 'ai', name: 'AI Automation & Marketing Bots' },
  { id: 'other', name: 'Other (Custom Tactic)' }
];

const BUDGET_MILESTONES = [3000, 5000, 10000, 15000, 25000, 35000, 50000];

export default function CampaignCalculator() {
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [customProjectType, setCustomProjectType] = useState('');
  
  const [region, setRegion] = useState<TargetRegion>('Vietnam');
  const [customRegion, setCustomRegion] = useState('');

  const [budget, setBudget] = useState<number>(10000);
  const [selectedServices, setSelectedServices] = useState<string[]>(['kol', 'pr', 'community']);
  const [customService, setCustomService] = useState('');

  // Accordion Expand State
  const [expandedSection, setExpandedSection] = useState<'specs' | 'tactics' | 'budget' | null>(null);

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadLinkedIn, setLeadLinkedIn] = useState('');
  const [leadTelegram, setLeadTelegram] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadNote, setLeadNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-open form if a service hash anchor is triggered or service button is clicked
  useEffect(() => {
    const handleHashCheck = () => {
      if (window.location.hash === '#get-proposal' && projectType === null) {
        setProjectType('DeFi'); // Auto-select DeFi to open the form if scrolled via CTA
      }
    };
    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [projectType]);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSection = (section: 'specs' | 'tactics' | 'budget') => {
    setExpandedSection(prev => prev === section ? null : section);
  };

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
      const finalProject = projectType === 'Other' && customProjectType ? `Other: ${customProjectType}` : (projectType || 'DeFi');

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
          { name: 'message', value: leadNote || 'Calculated campaign via custom strategy configurator.' },
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
    <div className="max-w-2xl mx-auto w-full">
      <div className="card-default p-5 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-xl transition-all duration-500">
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(0, 200, 240, 0.02) 0%, transparent 60%) pointer-events-none"></div>

        {/* Heading */}
        <div className="border-b border-white/5 pb-4">
          <h3 className="font-mono text-xs text-[var(--accent-cyan)] uppercase tracking-[0.18em] font-bold mb-1">
            Campaign Configurator
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-body">
            Select your project type below to begin your tailored strategy request.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs text-red-400 border border-red-500/20 bg-red-500/5 rounded-xl font-body">
            {errorMsg}
          </div>
        )}

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] border border-[var(--color-success)]/20 flex items-center justify-center mx-auto text-[var(--color-success)] text-xl">
              ✓
            </div>
            <h4 className="font-display text-lg font-bold text-white">Strategy Request Sent!</h4>
            <p className="text-xs text-[var(--text-secondary)] font-body max-w-sm mx-auto">
              Our growth specialists will review your selections and prepare a tailored proposal within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Step 1: Sector pills (Always visible) */}
            <div>
              <span className="font-mono text-[9px] text-[var(--accent-cyan)] uppercase tracking-wider block mb-3">
                Choose Project Type
              </span>
              <div className="flex flex-wrap gap-2.5">
                {(['DeFi', 'L1/L2', 'Exchange', 'GameFi', 'AI Project', 'Other'] as ProjectType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProjectType(type)}
                    className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold font-display transition-all duration-300 ${
                      projectType === type
                        ? 'border-[var(--accent-cyan)] bg-[rgba(0,200,240,0.06)] text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,200,240,0.1)]'
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
                  required
                  value={customProjectType}
                  onChange={e => setCustomProjectType(e.target.value)}
                  placeholder="Specify sector..."
                  className="mt-3 w-full input-field text-xs py-2 px-3 h-10 animate-[fadeIn_0.2s_ease-out]"
                />
              )}
            </div>

            {/* Rest of the form (Geography, Tactics, Budget, Contact & Submit) - Reveals after sector is clicked */}
            {projectType !== null && (
              <form onSubmit={handleFormSubmit} className="space-y-6 pt-4 border-t border-white/5 animate-[fadeIn_0.4s_ease-out]">
                
                {/* Accordions */}
                <div className="space-y-3">

                  {/* Section 1: Specs (Geography) */}
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={() => toggleSection('specs')}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-[var(--accent-cyan)] uppercase tracking-wider block mb-0.5">Target Market Geography</span>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {region === 'Other' && customRegion ? customRegion : region}
                        </span>
                      </div>
                      <span className={`text-xs transition-transform duration-300 ${expandedSection === 'specs' ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {expandedSection === 'specs' && (
                      <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 animate-[fadeIn_0.2s_ease-out]">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {(['Vietnam', 'Singapore', 'UAE', 'Europe', 'United States', 'United Kingdom', 'Hong Kong', 'South Korea', 'Japan', 'Southeast Asia (SEA)', 'Global', 'Other'] as TargetRegion[]).map(r => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setRegion(r)}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-300 ${
                                  region === r
                                    ? 'border-[var(--accent-cyan)] bg-[rgba(0,200,240,0.06)] text-[var(--accent-cyan)]'
                                    : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:text-white hover:border-white/10'
                                }`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                          {region === 'Other' && (
                            <input
                              type="text"
                              required
                              value={customRegion}
                              onChange={e => setCustomRegion(e.target.value)}
                              placeholder="Specify geography..."
                              className="mt-2 w-full input-field text-xs py-1.5 px-3 h-8"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 2: Tactics */}
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={() => toggleSection('tactics')}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-[var(--accent-purple)] uppercase tracking-wider block mb-0.5">Services &amp; Tactics Selection</span>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          Selected {selectedServices.length} Tactics
                        </span>
                      </div>
                      <span className={`text-xs transition-transform duration-300 ${expandedSection === 'tactics' ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {expandedSection === 'tactics' && (
                      <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-3 animate-[fadeIn_0.2s_ease-out]">
                        <div className="grid sm:grid-cols-2 gap-2">
                          {SERVICES_OPTIONS.map(opt => {
                            const isActive = selectedServices.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => toggleService(opt.id)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all duration-300 ${
                                  isActive
                                    ? 'border-[var(--accent-cyan)]/30 bg-[rgba(0,200,240,0.02)]'
                                    : 'border-white/5 bg-white/5 opacity-70 hover:opacity-100 hover:border-white/10'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                  isActive ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)] text-[#050810]' : 'border-white/20'
                                }`}>
                                  {isActive && (
                                    <svg className="w-2.5 h-2.5 font-bold" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs font-medium text-[var(--text-primary)] font-body">{opt.name}</span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedServices.includes('other') && (
                          <input
                            type="text"
                            required
                            value={customService}
                            onChange={e => setCustomService(e.target.value)}
                            placeholder="Specify custom marketing tactic..."
                            className="w-full input-field text-xs py-1.5 px-3 h-8"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Section 3: Budget */}
                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01]">
                    <button
                      type="button"
                      onClick={() => toggleSection('budget')}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <span className="font-mono text-[9px] text-[#f0a278] uppercase tracking-wider block mb-0.5">Monthly Growth Budget Allocation</span>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          ${budget.toLocaleString()} / mo
                        </span>
                      </div>
                      <span className={`text-xs transition-transform duration-300 ${expandedSection === 'budget' ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {expandedSection === 'budget' && (
                      <div className="px-5 pb-8 pt-4 border-t border-white/5 space-y-4 animate-[fadeIn_0.2s_ease-out] relative">
                        <input
                          type="range"
                          min="3000"
                          max="50000"
                          step="1000"
                          value={budget}
                          onChange={e => setBudget(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-cyan)]"
                        />
                        
                        {/* Milestones */}
                        <div class="absolute left-5 right-5 bottom-2 flex justify-between px-1">
                          {BUDGET_MILESTONES.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setBudget(val)}
                              class="group flex flex-col items-center focus:outline-none"
                            >
                              <span class={`w-2 h-2 rounded-full border transition-all duration-300 ${
                                budget >= val ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)] scale-125' : 'bg-neutral-800 border-white/10'
                              }`}></span>
                              <span class="text-[8px] font-mono text-[var(--text-muted)] mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                ${(val / 1000).toFixed(0)}K
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Contact Information Fields */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="font-mono text-[9px] text-[var(--text-secondary)] uppercase tracking-wider block mb-1">Contact details</span>
                  
                  <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-1 font-body">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={e => setLeadName(e.target.value)}
                        placeholder="Jane Doe"
                        className="w-full input-field text-xs py-2 px-3 h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-1 font-body">Telegram Username *</label>
                      <input
                        type="text"
                        required
                        value={leadTelegram}
                        onChange={e => setLeadTelegram(e.target.value)}
                        placeholder="@jane_telegram"
                        className="w-full input-field text-xs py-2 px-3 h-10"
                      />
                    </div>
                  </div>

                  <div class="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-1 font-body">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={e => setLeadEmail(e.target.value)}
                        placeholder="jane@project.io"
                        className="w-full input-field text-xs py-2 px-3 h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-1 font-body">LinkedIn URL (Optional)</label>
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
                    <label className="block text-[10px] font-medium text-[var(--text-secondary)] mb-1 font-body">Strategy Requirements (Optional)</label>
                    <textarea
                      value={leadNote}
                      onChange={e => setLeadNote(e.target.value)}
                      placeholder="Share details about your launch timeline, token status, etc..."
                      className="w-full input-field text-xs py-2 px-3 h-20 resize-none"
                    />
                  </div>
                </div>

                {/* Liquid Glass Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center bg-[rgba(0,200,240,0.1)] border border-[rgba(0,200,240,0.35)] backdrop-blur-md text-white font-mono font-semibold uppercase tracking-wider text-xs py-3.5 rounded-full shadow-[0_8px_24px_rgba(0,200,240,0.08),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-[rgba(0,200,240,0.18)] hover:border-[rgba(0,200,240,0.6)] hover:shadow-[0_4px_12px_rgba(0,200,240,0.15),inset_0_1px_3px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Submitting Strategy...' : 'Get Custom Strategy Blueprint →'}</span>
                </button>

              </form>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
