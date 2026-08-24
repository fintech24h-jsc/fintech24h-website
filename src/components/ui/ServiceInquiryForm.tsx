import { useState } from 'react';
import { submitLead } from '../../lib/leadSubmit';

interface ServiceInquiryFormProps {
  defaultService?: string;
}

export default function ServiceInquiryForm({ defaultService = '' }: ServiceInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    linkedin: '',
    projectName: '',
    website: '',
    serviceInterest: defaultService,
    budget: '',
    message: '',
    companyWebsite: '',
    marketingOptIn: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const servicesList = [
    'KOL & Influencer Marketing',
    'PR & Media Coverage',
    'Community Management',
    'B2B Business Development',
    'Event Marketing',
    'AI Marketing Solutions',
  ];

  const budgetRanges = [
    'Flexible / Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $30,000',
    'Above $30,000 / Month',
  ];

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.telegram) {
      setError('Please fill in all required fields (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await submitLead({ ...formData, marketingOptIn: String(formData.marketingOptIn) }, 'Service Inquiry', [
      { name: 'firstname', value: formData.name.split(' ')[0] || formData.name },
      { name: 'lastname', value: formData.name.split(' ').slice(1).join(' ') || '' },
      { name: 'email', value: formData.email },
      { name: 'company', value: formData.projectName },
      { name: 'website', value: formData.website },
      { name: 'telegram_handle', value: formData.telegram },
      { name: 'linkedin', value: formData.linkedin },
      { name: 'service_interest', value: formData.serviceInterest },
      { name: 'budget_range', value: formData.budget },
      { name: 'message', value: formData.message },
      { name: 'marketing_opt_in', value: formData.marketingOptIn ? 'true' : 'false' },
    ]);

    setIsSubmitting(false);

    if (result.ok) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'An error occurred. Please email info@fintech24h.com');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="company-website">Company website</label>
          <input
            id="company-website"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.companyWebsite}
            onChange={e => update('companyWebsite', e.target.value)}
          />
        </div>
        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-body backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Alex Nguyen"
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => update('email', e.target.value)}
              placeholder="alex@project.io"
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Telegram Username *</label>
            <input
              type="text"
              required
              value={formData.telegram}
              onChange={e => update('telegram', e.target.value)}
              placeholder="@alex_handle"
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Project Name</label>
            <input
              type="text"
              value={formData.projectName}
              onChange={e => update('projectName', e.target.value)}
              placeholder="My Web3 Protocol"
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="service-interest" className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Service of Interest</label>
            <select
              id="service-interest"
              value={formData.serviceInterest}
              onChange={e => update('serviceInterest', e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] transition-all duration-300 font-body appearance-none shadow-inner backdrop-blur-md"
            >
              <option value="" className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">Select a service...</option>
              {servicesList.map(s => (
                <option key={s} value={s} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget-range" className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Estimated Monthly Budget</label>
            <select
              id="budget-range"
              value={formData.budget}
              onChange={e => update('budget', e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] transition-all duration-300 font-body appearance-none shadow-inner backdrop-blur-md"
            >
              <option value="" className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">Select budget range...</option>
              {budgetRanges.map(b => (
                <option key={b} value={b} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Website / Pitchdeck URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={e => update('website', e.target.value)}
              placeholder="https://myproject.io"
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">LinkedIn Profile (Optional)</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={e => update('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Message / Details</label>
          <textarea
            value={formData.message}
            onChange={e => update('message', e.target.value)}
            placeholder="Tell us about your timeline, current metrics, and specific goals..."
            rows={2}
            className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md resize-none"
          ></textarea>
        </div>

        <p className="text-[11px] text-[var(--text-secondary)] opacity-70 font-body leading-relaxed">
          Your information is used only to review and respond to this inquiry. See our{' '}
          <a href="/privacy/" className="underline hover:text-[var(--accent-cyan)]">Privacy Policy</a>.
        </p>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.marketingOptIn}
            onChange={e => setFormData(prev => ({ ...prev, marketingOptIn: e.target.checked }))}
            className="mt-0.5 w-4 h-4 rounded border-[var(--border-default)] bg-[var(--surface-soft)] accent-[var(--accent-cyan)] shrink-0"
          />
          <span className="text-[11px] text-[var(--text-secondary)] opacity-70 font-body leading-relaxed">
            Send me occasional updates about Fintech24h's services (optional — you can unsubscribe anytime).
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="form-submit-btn relative w-full group flex items-center justify-center py-3.5 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer-slide_1.5s_ease-out_infinite]" />
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500 backdrop-blur-[2px]" />

          {isSubmitting ? (
            <span className="relative z-10 font-display text-xs font-semibold tracking-widest text-[color-mix(in_srgb,var(--text-inverted)_70%,transparent)] uppercase flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="relative z-10 font-display text-xs font-semibold tracking-[0.2em] text-[var(--text-inverted)] uppercase flex items-center gap-2">
              Send Inquiry
              <svg className="w-4 h-4 text-[var(--text-inverted)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          )}
        </button>
      </form>

      {/* Success Modal Popup in Liquid Glass Style */}
      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[var(--overlay-backdrop)] backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--bg-tertiary)_95%,transparent)] backdrop-blur-2xl shadow-xl text-center animate-[scale-in_0.3s_ease-out] overflow-hidden">
            {/* Spotlight glow inside */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,200,240,0.08) 0%, transparent 60%)' }} />
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent-rose)] to-[var(--accent-warm)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,107,131,0.3)]">
              <svg className="w-8 h-8 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-3">
              Request Sent Successfully!
            </h3>

            <p className="text-sm text-[var(--text-secondary)] font-body max-w-sm mx-auto mb-8 leading-relaxed">
              Thank you. The <span className="text-[var(--accent-warm)] font-bold">Fintech24h</span> strategy team will reach out to you shortly to discuss your campaign.
            </p>

            <div className="flex flex-col gap-3 relative z-10">
              {/* Liquid glass primary CTA */}
              <a
                href="https://t.me/fintech24h"
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-connect-btn group relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl overflow-hidden font-display text-xs font-semibold tracking-[0.15em] uppercase text-white transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer-slide_1.5s_ease-out_infinite]" />
                <span className="relative z-10 flex items-center gap-2">
                  Connect instantly on Telegram
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>

              {/* Liquid glass secondary */}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    name: '',
                    email: '',
                    telegram: '',
                    linkedin: '',
                    projectName: '',
                    website: '',
                    serviceInterest: defaultService,
                    budget: '',
                    message: '',
                    companyWebsite: '',
                    marketingOptIn: false,
                  });
                }}
                className="w-full py-3 px-5 text-xs font-semibold uppercase tracking-wider bg-[var(--surface-soft)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-xl transition-all duration-300"
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
