import { useState } from 'react';
import { submitLead } from '../../lib/leadSubmit';

type ProjectType = 'DeFi' | 'Exchange' | 'L1/L2 Blockchain' | 'NFT/GameFi' | 'AI Project' | 'Other';

interface FormData {
  projectType: ProjectType | '';
  projectName: string;
  projectUrl: string;
  contactName: string;
  email: string;
  telegram: string;
  serviceInterest: string;
  budget: string;
  timeline: string;
}

const PROJECT_TYPES: { label: ProjectType; icon: React.ReactNode }[] = [
  {
    label: 'DeFi',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3 8 9l4 12 4-12-3-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
      </svg>
    )
  },
  {
    label: 'Exchange',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M12 1v22" />
        <rect x="4" y="6" width="4" height="10" rx="1" fill="none" />
        <rect x="10" y="4" width="4" height="14" rx="1" fill="none" />
        <rect x="16" y="9" width="4" height="8" rx="1" fill="none" />
      </svg>
    )
  },
  {
    label: 'L1/L2 Blockchain',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
        <rect x="3" y="15" width="6" height="6" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h6M9 18h6M6 9v6M18 9v6" />
      </svg>
    )
  },
  {
    label: 'NFT/GameFi',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h4M8 10v4M15 11h.01M18 13h.01" />
      </svg>
    )
  },
  {
    label: 'AI Project',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
      </svg>
    )
  },
  {
    label: 'Other',
    icon: (
      <svg className="w-6 h-6 text-[var(--accent-cyan)] mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
];

const SERVICES = [
  'KOL & Influencer Marketing',
  'PR & Media Coverage',
  'Community Management',
  'Growth & Airdrop Campaigns',
  'Business Development',
  'Full-Stack Strategy',
];

const BUDGETS = [
  { label: 'Under $5k/mo', value: '<5000' },
  { label: '$5k – $20k/mo', value: '5000-20000' },
  { label: '$20k+/mo', value: '>20000' },
];

const TIMELINES = [
  { label: 'ASAP (< 2 weeks)', value: 'asap' },
  { label: '1–3 months', value: '1-3months' },
  { label: '3+ months', value: '3months+' },
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    projectName: '',
    projectUrl: '',
    contactName: '',
    email: '',
    telegram: '',
    serviceInterest: '',
    budget: '',
    timeline: '',
  });

  const update = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitToHubSpot = async () => {
    setIsSubmitting(true);
    setError('');

    const result = await submitLead(formData, 'Multi Step Proposal', [
      { name: 'firstname', value: formData.contactName.split(' ')[0] || formData.contactName },
      { name: 'lastname', value: formData.contactName.split(' ').slice(1).join(' ') || '' },
      { name: 'email', value: formData.email },
      { name: 'company', value: formData.projectName },
      { name: 'website', value: formData.projectUrl },
      { name: 'telegram_handle', value: formData.telegram },
      { name: 'project_type', value: formData.projectType },
      { name: 'service_interest', value: formData.serviceInterest },
      { name: 'budget_range', value: formData.budget },
      { name: 'timeline', value: formData.timeline },
    ]);

    setIsSubmitting(false);

    if (result.ok) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Something went wrong. Please email info@fintech24h.com');
    }
  };

  return (
    <>
      <div>
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-display transition-all duration-300 ${
                s < step
                  ? 'bg-[var(--accent-cyan)] text-[#050810]'
                  : s === step
                  ? 'border-2 border-[var(--accent-cyan)] text-[var(--accent-cyan)]'
                  : 'border border-[var(--border-default)] text-[var(--text-secondary)]'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--border-default)]'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Project Type */}
      {step === 1 && (
        <div>
          <p className="text-sm text-[var(--text-secondary)] text-center font-body mb-4">What type of project are you building?</p>
          <div className="grid grid-cols-2 gap-3">
            {PROJECT_TYPES.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => { update('projectType', label); setStep(2); }}
                className={`card-default p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-[#f0a278]/40 hover:scale-[1.03] ${
                  formData.projectType === label ? 'border-[#ff6b83] bg-[rgba(255,107,131,0.02)] shadow-[0_0_15px_rgba(255,107,131,0.05)]' : ''
                }`}
                aria-pressed={formData.projectType === label}
              >
                <div className="mb-2 text-[var(--accent-cyan)] group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-xs font-semibold text-[var(--text-primary)] font-display tracking-wide">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] text-center font-body mb-4">How can we reach you?</p>

          <div>
            <label htmlFor="contactName" className="block text-xs text-[var(--text-secondary)] mb-1 font-body">Your Name *</label>
            <input
              id="contactName"
              type="text"
              value={formData.contactName}
              onChange={(e) => update('contactName', e.target.value)}
              placeholder="Alex Nguyen"
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs text-[var(--text-secondary)] mb-1 font-body">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="alex@project.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="telegram" className="block text-xs text-[var(--text-secondary)] mb-1 font-body">Telegram (Preferred) *</label>
            <input
              id="telegram"
              type="text"
              value={formData.telegram}
              onChange={(e) => update('telegram', e.target.value)}
              placeholder="@yourhandle"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="projectName" className="block text-xs text-[var(--text-secondary)] mb-1 font-body">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(e) => update('projectName', e.target.value)}
              placeholder="MyDeFi Protocol"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="projectUrl" className="block text-xs text-[var(--text-secondary)] mb-1 font-body">Project Website / Whitepaper</label>
            <input
              id="projectUrl"
              type="url"
              value={formData.projectUrl}
              onChange={(e) => update('projectUrl', e.target.value)}
              placeholder="https://myproject.io"
              className="input-field"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              className="btn-ghost flex-1 text-sm font-display font-medium"
              aria-label="Go back to step 1"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (!formData.contactName || !formData.email) { setError('Please fill in your name and email.'); return; }
                setError('');
                setStep(3);
              }}
              className="btn-primary flex-1 text-sm font-display font-semibold"
            >
              Next →
            </button>
          </div>
          {error && <p className="text-red-400 text-sm text-center font-body" role="alert">{error}</p>}
        </div>
      )}

      {/* Step 3: Service + Budget + Timeline */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="text-sm text-[var(--text-secondary)] text-center font-body mb-4">Almost done — help us understand your goals.</p>

          {/* Service Interest */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-2 font-body">Primary Service Needed</label>
            <div className="grid grid-cols-1 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => update('serviceInterest', s)}
                  className={`select-option text-left !justify-start ${
                    formData.serviceInterest === s
                      ? 'active'
                      : ''
                  }`}
                  aria-pressed={formData.serviceInterest === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Budget (large tap targets) */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-2 font-body">Monthly Budget Range *</label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGETS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => update('budget', value)}
                  className={`select-option font-display font-semibold ${
                    formData.budget === value
                      ? 'active'
                      : ''
                  }`}
                  aria-pressed={formData.budget === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-xs text-[var(--text-secondary)] mb-2 font-body">When do you want to launch?</label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => update('timeline', value)}
                  className={`select-option font-display font-semibold ${
                    formData.timeline === value
                      ? '!border-[var(--accent-purple)] !bg-[rgba(124,92,252,0.1)] !text-[var(--accent-purple)]'
                      : ''
                  }`}
                  aria-pressed={formData.timeline === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(2)}
              className="btn-ghost flex-1 text-sm font-display font-medium"
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (!formData.budget) { setError('Please select a budget range.'); return; }
                setError('');
                submitToHubSpot();
              }}
              disabled={isSubmitting}
              className="btn-primary flex-1 text-sm font-display font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Sending...' : 'Get My Strategy →'}</span>
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center font-body" role="alert">{error}</p>}
        </div>
      )}
      </div>

      {/* Success Modal Popup in Liquid Glass Style */}
      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#080C1A]/80 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0c1226]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,200,240,0.15)] text-center animate-[scale-in_0.3s_ease-out] overflow-hidden">
            {/* Spotlight glow inside */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,200,240,0.08) 0%, transparent 60%)' }} />
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff6b83] to-[#f0a278] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,107,131,0.3)]">
              <svg className="w-8 h-8 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-2xl font-display font-bold text-white mb-3">
              Request Sent Successfully!
            </h3>

            <p className="text-sm text-white/70 font-body max-w-sm mx-auto mb-8 leading-relaxed">
              Thank you. The <span className="text-[#f0a278] font-bold">Fintech24h</span> strategy team will reach out to you shortly to discuss your campaign.
            </p>

            <div className="flex flex-col gap-3 relative z-10">
              {/* Liquid glass primary CTA */}
              <a
                href="https://t.me/fintech24h"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl overflow-hidden font-display text-xs font-semibold tracking-[0.15em] uppercase text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(145deg, rgba(0,200,240,0.14) 0%, rgba(124,92,252,0.12) 100%)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.25)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer-slide_1.5s_ease-out_infinite]" />
                <span className="relative z-10 flex items-center gap-2">
                  Connect instantly on Telegram
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>

              {/* Liquid glass secondary */}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setStep(1);
                  setFormData({
                    projectType: '',
                    projectName: '',
                    projectUrl: '',
                    contactName: '',
                    email: '',
                    telegram: '',
                    serviceInterest: '',
                    budget: '',
                    timeline: '',
                  });
                }}
                className="w-full py-3 px-5 text-xs font-semibold uppercase tracking-wider text-white/60 hover:text-white rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
