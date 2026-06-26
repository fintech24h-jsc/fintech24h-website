import { useState } from 'react';
import { submitHubSpotForm } from '../../lib/hubspot';

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

const PROJECT_TYPES: { label: ProjectType; icon: string }[] = [
  { label: 'DeFi', icon: '💎' },
  { label: 'Exchange', icon: '📊' },
  { label: 'L1/L2 Blockchain', icon: '⛓️' },
  { label: 'NFT/GameFi', icon: '🎮' },
  { label: 'AI Project', icon: '🤖' },
  { label: 'Other', icon: '🚀' },
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

    try {
      const portalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID || '000000';
      const formId = import.meta.env.PUBLIC_HUBSPOT_FORM_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      const payload = {
        fields: [
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
      setError('Something went wrong. Please reach us directly at info@fintech24h.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-xl font-display font-semibold text-[#f0f4ff] mb-2">
          Proposal Request Received!
        </h3>
        <p className="text-[#94a3b8] font-body mb-4">
          Our team will reach out within <strong className="text-cyan-400">24 hours</strong> with a custom growth strategy for your project.
        </p>
        <a
          href="https://t.me/fintech24h"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          Chat Now on Telegram →
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Step ${step} of 3`}>
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold font-display transition-all duration-300 ${
                s < step
                  ? 'bg-cyan-400 text-black'
                  : s === step
                  ? 'border-2 border-cyan-400 text-cyan-400'
                  : 'border border-white/20 text-white/30'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-cyan-400' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Project Type */}
      {step === 1 && (
        <div>
          <p className="text-sm text-[#94a3b8] text-center font-body mb-4">What type of project are you building?</p>
          <div className="grid grid-cols-2 gap-3">
            {PROJECT_TYPES.map(({ label, icon }) => (
              <button
                key={label}
                onClick={() => { update('projectType', label); setStep(2); }}
                className={`glass-card rounded-xl p-4 text-left transition-all duration-200 hover:border-cyan-400/50 ${
                  formData.projectType === label ? 'border-cyan-400/70 bg-cyan-400/10' : ''
                }`}
                aria-pressed={formData.projectType === label}
              >
                <span className="text-2xl mb-1 block" aria-hidden="true">{icon}</span>
                <span className="text-sm font-medium text-[#f0f4ff] font-body">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-[#94a3b8] text-center font-body mb-4">How can we reach you?</p>

          <div>
            <label htmlFor="contactName" className="block text-xs text-[#94a3b8] mb-1 font-body">Your Name *</label>
            <input
              id="contactName"
              type="text"
              value={formData.contactName}
              onChange={(e) => update('contactName', e.target.value)}
              placeholder="Alex Nguyen"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f0f4ff] font-body text-sm placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs text-[#94a3b8] mb-1 font-body">Email *</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="alex@project.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f0f4ff] font-body text-sm placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="telegram" className="block text-xs text-[#94a3b8] mb-1 font-body">Telegram (Preferred) *</label>
            <input
              id="telegram"
              type="text"
              value={formData.telegram}
              onChange={(e) => update('telegram', e.target.value)}
              placeholder="@yourhandle"
              className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f0f4ff] font-body text-sm placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="projectName" className="block text-xs text-[#94a3b8] mb-1 font-body">Project Name</label>
            <input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(e) => update('projectName', e.target.value)}
              placeholder="MyDeFi Protocol"
              className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f0f4ff] font-body text-sm placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="projectUrl" className="block text-xs text-[#94a3b8] mb-1 font-body">Project Website / Whitepaper</label>
            <input
              id="projectUrl"
              type="url"
              value={formData.projectUrl}
              onChange={(e) => update('projectUrl', e.target.value)}
              placeholder="https://myproject.io"
              className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f0f4ff] font-body text-sm placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
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
          <p className="text-sm text-[#94a3b8] text-center font-body mb-4">Almost done — help us understand your goals.</p>

          {/* Service Interest */}
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 font-body">Primary Service Needed</label>
            <div className="grid grid-cols-1 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  onClick={() => update('serviceInterest', s)}
                  className={`text-left px-4 py-2.5 rounded-lg border text-sm font-body transition-all ${
                    formData.serviceInterest === s
                      ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-400'
                      : 'border-white/10 text-[#94a3b8] hover:border-white/30'
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
            <label className="block text-xs text-[#94a3b8] mb-2 font-body">Monthly Budget Range *</label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGETS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => update('budget', value)}
                  className={`py-3 rounded-lg border text-xs font-semibold font-display text-center transition-all ${
                    formData.budget === value
                      ? 'border-cyan-400/70 bg-cyan-400/10 text-cyan-400'
                      : 'border-white/10 text-[#94a3b8] hover:border-white/30'
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
            <label className="block text-xs text-[#94a3b8] mb-2 font-body">When do you want to launch?</label>
            <div className="grid grid-cols-3 gap-2">
              {TIMELINES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => update('timeline', value)}
                  className={`py-3 rounded-lg border text-xs font-semibold font-display text-center transition-all ${
                    formData.timeline === value
                      ? 'border-purple-400/70 bg-purple-400/10 text-purple-400'
                      : 'border-white/10 text-[#94a3b8] hover:border-white/30'
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
              {isSubmitting ? 'Sending...' : 'Get My Strategy →'}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center font-body" role="alert">{error}</p>}
        </div>
      )}
    </div>
  );
}
