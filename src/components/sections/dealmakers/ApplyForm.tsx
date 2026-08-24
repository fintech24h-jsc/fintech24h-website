import { useEffect, useRef, useState } from 'react';
import { submitLead } from '../../../lib/leadSubmit';
import { interestOptions, weOfferOptions, weAreLookingForOptions } from '../../../data/dealmakers/ss3';

interface FormState {
  name: string;
  company: string;
  role: string;
  email: string;
  telegram: string;
  linkedin: string;
  interest: string;
  note: string;
  companyWebsite: string; // honeypot
  marketingOptIn: boolean;
}

const emptyForm: FormState = {
  name: '', company: '', role: '', email: '', telegram: '', linkedin: '',
  interest: interestOptions[0], note: '', companyWebsite: '', marketingOptIn: false,
};

function track(event: string, label?: string) {
  const dl = (window as any).dataLayer;
  if (dl) dl.push({ event: `dealmakers_ss3_${event}`, label: label || '' });
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function ApplyForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [offers, setOffers] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const startedRef = useRef(false);

  const update = (field: keyof FormState, value: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      track('form_begin');
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Listen for prefill events dispatched by Featured cards / package CTAs / directory modal.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const detail = (e as CustomEvent).detail as { interest?: string; context?: string };
      setForm((prev) => ({
        ...prev,
        interest: detail?.interest && interestOptions.includes(detail.interest) ? detail.interest : prev.interest,
        note: detail?.context
          ? `${prev.note ? prev.note + '\n' : ''}Interested in connecting with: ${detail.context}`.trim()
          : prev.note,
      }));
    };
    window.addEventListener('dm:prefill', onPrefill as EventListener);
    return () => window.removeEventListener('dm:prefill', onPrefill as EventListener);
  }, []);

  const dealSignalCount = offers.length + lookingFor.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.role || !form.email || !form.telegram) {
      setError('Please fill in all required fields (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const weOfferLine = offers.length ? `We Offer: ${offers.join(', ')}` : '';
    const lookingForLine = lookingFor.length ? `We Are Looking For: ${lookingFor.join(', ')}` : '';
    const fullNote = [weOfferLine, lookingForLine, form.note].filter(Boolean).join('\n');

    const result = await submitLead(
      // Keep `note` as the visitor's own free-text (not merged with the We
      // Offer / We Are Looking For chips) so the backend sheet can show all
      // three as clean, separate columns instead of one blended paragraph.
      { ...form, weOffer: offers.join(', '), weAreLookingFor: lookingFor.join(', '), marketingOptIn: String(form.marketingOptIn) },
      'dealmakers-ss3',
      [
        { name: 'firstname', value: form.name.split(' ')[0] || form.name },
        { name: 'lastname', value: form.name.split(' ').slice(1).join(' ') || '' },
        { name: 'email', value: form.email },
        { name: 'company', value: form.company },
        { name: 'telegram_handle', value: form.telegram },
        { name: 'linkedin', value: form.linkedin },
        { name: 'service_interest', value: form.interest },
        { name: 'message', value: fullNote },
        { name: 'marketing_opt_in', value: form.marketingOptIn ? 'true' : 'false' },
      ]
    );

    setIsSubmitting(false);
    if (result.ok) {
      track('form_submit', form.interest);
      setIsSuccess(true);
    } else {
      setError(result.error || 'Something went wrong. Please email info@fintech24h.com');
    }
  };

  return (
    <div className="dm-card p-6 sm:p-7 max-w-xl mx-auto">
      <h3 className="font-display font-semibold text-lg text-[var(--dm-text-primary)] mb-1">Apply for F-Matching Season 3</h3>
      <p className="text-xs text-[var(--dm-text-secondary)] mb-6">Fill in the basics. We’ll follow up to verify your profile and recommend the right package.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="dm-company-website">Company website</label>
          <input id="dm-company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off"
            value={form.companyWebsite} onChange={(e) => setForm((p) => ({ ...p, companyWebsite: e.target.value }))} />
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs" role="alert">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dm-name" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Full name *</label>
            <input id="dm-name" required className="dm-input" placeholder="Alex Nguyen" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-company" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Company *</label>
            <input id="dm-company" required className="dm-input" placeholder="Company name" value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dm-role" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Title / role *</label>
            <input id="dm-role" required className="dm-input" placeholder="Founder, Investor..." value={form.role} onChange={(e) => update('role', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-email" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Work email *</label>
            <input id="dm-email" type="email" required className="dm-input" placeholder="you@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dm-telegram" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Telegram *</label>
            <input id="dm-telegram" required className="dm-input" placeholder="@yourhandle" value={form.telegram} onChange={(e) => update('telegram', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-linkedin" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">LinkedIn</label>
            <input id="dm-linkedin" className="dm-input" placeholder="linkedin.com/in/..." value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="dm-interest" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">I&rsquo;m interested in *</label>
          <select id="dm-interest" className="dm-input" value={form.interest} onChange={(e) => update('interest', e.target.value)}>
            {interestOptions.map((opt) => <option key={opt} value={opt} className="bg-[#0a0908]">{opt}</option>)}
          </select>
        </div>

        {/* Collapsible deal-signal picker: closed by default, not a wall of chips */}
        <details className="dm-disclosure">
          <summary>
            <span className="dm-disclosure-trigger">
              <span>Deal signal: We Offer / We Are Looking For {dealSignalCount > 0 && <b className="text-[var(--dm-gold)]">({dealSignalCount})</b>}</span>
              <svg className="dm-disclosure-chevron w-4 h-4 text-[var(--dm-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </summary>
          <div className="dm-disclosure-panel space-y-4">
            <fieldset>
              <legend className="block text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">We Offer</legend>
              <div className="flex flex-wrap gap-2">
                {weOfferOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    aria-pressed={offers.includes(opt)}
                    className="dm-select-option text-[11px] py-1.5 px-3"
                    onClick={() => { setOffers((prev) => toggle(prev, opt)); if (!startedRef.current) { startedRef.current = true; track('form_begin'); } }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="block text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">We Are Looking For</legend>
              <div className="flex flex-wrap gap-2">
                {weAreLookingForOptions.map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    aria-pressed={lookingFor.includes(opt)}
                    className="dm-select-option text-[11px] py-1.5 px-3"
                    onClick={() => { setLookingFor((prev) => toggle(prev, opt)); if (!startedRef.current) { startedRef.current = true; track('form_begin'); } }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="dm-note" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Additional notes</label>
              <textarea id="dm-note" rows={2} className="dm-input resize-none" placeholder="Share more context, deal goals..." value={form.note} onChange={(e) => update('note', e.target.value)} />
            </div>
          </div>
        </details>

        <p className="text-[10px] text-[var(--dm-text-muted)] leading-relaxed">
          Your information is used only to review / contact you about F-Matching Season 3 and will not be made public without consent. See our <a href="/privacy/" className="underline hover:text-[var(--dm-gold)]">Privacy Policy</a>.
        </p>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={(e) => setForm((p) => ({ ...p, marketingOptIn: e.target.checked }))}
            className="mt-0.5 w-4 h-4 rounded border-[var(--dm-border)] bg-white/5 accent-[var(--dm-gold)] shrink-0"
          />
          <span className="text-[10px] text-[var(--dm-text-muted)] leading-relaxed">
            Send me updates about future DealMakers' Club seasons (optional — you can unsubscribe anytime).
          </span>
        </label>

        <button type="submit" disabled={isSubmitting} className="dm-btn-primary w-full justify-center text-xs">
          {isSubmitting ? 'Sending...' : 'Submit Application'} <span aria-hidden="true">→</span>
        </button>
      </form>

      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[rgba(6,5,4,0.8)] backdrop-blur-md">
          <div className="relative w-full max-w-md p-7 rounded-3xl border border-[var(--dm-border)] bg-[rgba(19,17,16,0.97)] backdrop-blur-2xl shadow-[0_20px_50px_rgba(217,178,106,0.15)] text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--dm-gradient-primary)' }}>
              <svg className="w-7 h-7 text-[#0a0908]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <h3 className="text-xl font-display font-semibold text-[var(--dm-text-primary)] mb-3">Application submitted!</h3>
            <p className="text-sm text-[var(--dm-text-secondary)] mb-7">The Fintech24h team will follow up to confirm next steps.</p>
            <button onClick={() => { setIsSuccess(false); setForm(emptyForm); setOffers([]); setLookingFor([]); startedRef.current = false; }} className="dm-btn-ghost w-full justify-center text-xs">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
