import { useState } from 'react';
import { submitLead } from '../../../lib/leadSubmit';
import { fundingStatusOptions, telegramGroupUrl, telegramGroupName } from '../../../data/dealmakers/ss3';

interface FormState {
  name: string;
  company: string;
  email: string;
  linkedin: string;
  telegram: string;
  fundingStatus: string;
  note: string;
  companyWebsite: string; // honeypot
}

const emptyForm: FormState = {
  name: '', company: '', email: '', linkedin: '', telegram: '',
  fundingStatus: fundingStatusOptions[0], note: '', companyWebsite: '',
};

function track(event: string) {
  const dl = (window as any).dataLayer;
  if (dl) dl.push({ event: `dealmakers_ss3_${event}` });
}

export default function TelegramJoinForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.email || !form.telegram || !form.fundingStatus) {
      setError('Please fill in all required fields (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await submitLead(form as unknown as Record<string, string>, 'dealmakers-ss3-telegram-join');

    setIsSubmitting(false);
    if (result.ok) {
      track('telegram_join_submit');
      setIsSuccess(true);
    } else {
      setError(result.error || 'Something went wrong. Please email info@fintech24h.com');
    }
  };

  if (isSuccess) {
    return (
      <div className="dm-card p-7 sm:p-9 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--dm-gradient-primary)' }}>
          <svg className="w-7 h-7 text-[#0a0908]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <h2 className="text-xl font-display font-semibold text-[var(--dm-text-primary)] mb-3">Your request is under review</h2>
        <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed mb-7">
          Tap the button below to join {telegramGroupName} on Telegram, then sit tight. Our team is reviewing your information and will send you a warm welcome once you’re approved.
        </p>
        <a
          href={telegramGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dm-btn-primary w-full justify-center text-xs py-3.5"
          onClick={() => track('telegram_join_open_group')}
        >
          Join {telegramGroupName} on Telegram
        </a>
      </div>
    );
  }

  return (
    <div className="dm-card p-6 sm:p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-display font-semibold text-[var(--dm-text-primary)] mb-1">Request to Join</h2>
      <p className="text-xs text-[var(--dm-text-secondary)] mb-6">
        {telegramGroupName} is a vetted Telegram community. Share a few details so our team can review and approve your membership.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="tg-company-website">Company website</label>
          <input id="tg-company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off"
            value={form.companyWebsite} onChange={(e) => setForm((p) => ({ ...p, companyWebsite: e.target.value }))} />
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs" role="alert">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg-name" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Full name *</label>
            <input id="tg-name" required className="dm-input" placeholder="Alex Nguyen" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="tg-company" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Company *</label>
            <input id="tg-company" required className="dm-input" placeholder="Company name" value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg-email" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email *</label>
            <input id="tg-email" type="email" required className="dm-input" placeholder="you@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label htmlFor="tg-linkedin" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">LinkedIn</label>
            <input id="tg-linkedin" className="dm-input" placeholder="linkedin.com/in/..." value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="tg-telegram" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Telegram username *</label>
          <input id="tg-telegram" required className="dm-input" placeholder="@yourhandle" value={form.telegram} onChange={(e) => update('telegram', e.target.value)} />
          <p className="text-[10px] text-[var(--dm-text-muted)] mt-1">Must be your own, main Telegram account. This is how our team verifies you for approval.</p>
        </div>

        <div>
          <label htmlFor="tg-funding" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Funding status *</label>
          <select id="tg-funding" className="dm-input" value={form.fundingStatus} onChange={(e) => update('fundingStatus', e.target.value)}>
            {fundingStatusOptions.map((opt) => <option key={opt} value={opt} className="bg-[#0a0908]">{opt}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="tg-note" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Tell us more</label>
          <textarea id="tg-note" rows={3} className="dm-input resize-none" placeholder="What are you building, or what are you looking to invest in?" value={form.note} onChange={(e) => update('note', e.target.value)} />
        </div>

        <p className="text-[10px] text-[var(--dm-text-muted)] leading-relaxed">
          Your information is used only to review your membership request and will not be made public without consent. See our <a href="/privacy/" className="underline hover:text-[var(--dm-gold)]">Privacy Policy</a>.
        </p>

        <button type="submit" disabled={isSubmitting} className="dm-btn-primary w-full justify-center text-xs">
          {isSubmitting ? 'Sending...' : 'Submit Request'} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
