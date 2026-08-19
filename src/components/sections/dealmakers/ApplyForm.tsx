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
  website: string;
  interest: string;
  note: string;
  companyWebsite: string; // honeypot
}

const emptyForm: FormState = {
  name: '', company: '', role: '', email: '', telegram: '', linkedin: '', website: '',
  interest: interestOptions[0], note: '', companyWebsite: '',
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
          ? `${prev.note ? prev.note + '\n' : ''}Quan tâm kết nối với: ${detail.context}`.trim()
          : prev.note,
      }));
    };
    window.addEventListener('dm:prefill', onPrefill as EventListener);
    return () => window.removeEventListener('dm:prefill', onPrefill as EventListener);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.role || !form.email || !form.telegram) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc (*).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const weOfferLine = offers.length ? `We Offer: ${offers.join(', ')}` : '';
    const lookingForLine = lookingFor.length ? `We Are Looking For: ${lookingFor.join(', ')}` : '';
    const fullNote = [weOfferLine, lookingForLine, form.note].filter(Boolean).join('\n');

    const result = await submitLead(
      { ...form, note: fullNote, weOffer: offers.join(', '), weAreLookingFor: lookingFor.join(', ') },
      'dealmakers-ss3',
      [
        { name: 'firstname', value: form.name.split(' ')[0] || form.name },
        { name: 'lastname', value: form.name.split(' ').slice(1).join(' ') || '' },
        { name: 'email', value: form.email },
        { name: 'company', value: form.company },
        { name: 'website', value: form.website },
        { name: 'telegram_handle', value: form.telegram },
        { name: 'linkedin', value: form.linkedin },
        { name: 'service_interest', value: form.interest },
        { name: 'message', value: fullNote },
      ]
    );

    setIsSubmitting(false);
    if (result.ok) {
      track('form_submit', form.interest);
      setIsSuccess(true);
    } else {
      setError(result.error || 'Đã có lỗi xảy ra. Vui lòng email info@fintech24h.com');
    }
  };

  return (
    <div className="form-card card-default p-6 sm:p-7 max-w-xl mx-auto">
      <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-1">Đăng ký F-Matching Season 3</h3>
      <p className="text-xs text-[var(--text-secondary)] mb-6">Điền thông tin cơ bản. Chúng tôi sẽ liên hệ để xác minh và tư vấn gói phù hợp.</p>

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
            <label htmlFor="dm-name" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Họ và tên *</label>
            <input id="dm-name" required className="input-field" placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-company" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Công ty / tổ chức *</label>
            <input id="dm-company" required className="input-field" placeholder="Tên công ty" value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dm-role" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Chức danh / role *</label>
            <input id="dm-role" required className="input-field" placeholder="Founder, Investor..." value={form.role} onChange={(e) => update('role', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-email" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Email công việc *</label>
            <input id="dm-email" type="email" required className="input-field" placeholder="you@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dm-telegram" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Telegram *</label>
            <input id="dm-telegram" required className="input-field" placeholder="@yourhandle" value={form.telegram} onChange={(e) => update('telegram', e.target.value)} />
          </div>
          <div>
            <label htmlFor="dm-linkedin" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">LinkedIn (khuyến khích)</label>
            <input id="dm-linkedin" className="input-field" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
            <p className="text-[10px] text-[var(--text-muted)] mt-1">LinkedIn giúp đội ngũ xác minh nhanh hơn.</p>
          </div>
        </div>

        <div>
          <label htmlFor="dm-website" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Website / company URL</label>
          <input id="dm-website" type="url" className="input-field" placeholder="https://yourproject.io" value={form.website} onChange={(e) => update('website', e.target.value)} />
        </div>

        <div>
          <label htmlFor="dm-interest" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Bạn quan tâm đến *</label>
          <select id="dm-interest" className="input-field" value={form.interest} onChange={(e) => update('interest', e.target.value)}>
            {interestOptions.map((opt) => <option key={opt} value={opt} className="bg-[#050810]">{opt}</option>)}
          </select>
        </div>

        <fieldset>
          <legend className="block text-[10px] font-semibold text-white/50 mb-2 uppercase tracking-wider">We Offer</legend>
          <div className="flex flex-wrap gap-2">
            {weOfferOptions.map((opt) => (
              <button
                type="button"
                key={opt}
                aria-pressed={offers.includes(opt)}
                className="select-option text-[11px] py-1.5 px-3"
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
                className="select-option text-[11px] py-1.5 px-3"
                onClick={() => { setLookingFor((prev) => toggle(prev, opt)); if (!startedRef.current) { startedRef.current = true; track('form_begin'); } }}
              >
                {opt}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="dm-note" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Ghi chú thêm</label>
          <textarea id="dm-note" rows={3} className="input-field resize-none" placeholder="Chia sẻ thêm bối cảnh, mục tiêu deal..." value={form.note} onChange={(e) => update('note', e.target.value)} />
        </div>

        <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
          Thông tin chỉ được dùng để xét duyệt / liên hệ về F-Matching Season 3 và sẽ không được công khai nếu chưa có sự đồng ý. Xem <a href="/privacy/" className="underline hover:text-[var(--accent-cyan)]">Chính sách bảo mật</a>.
        </p>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center text-xs">
          {isSubmitting ? 'Đang gửi...' : 'Gửi đăng ký'} <span aria-hidden="true">→</span>
        </button>
      </form>

      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#080C1A]/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-7 rounded-3xl border border-white/10 bg-[#0c1226]/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,200,240,0.15)] text-center">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-3">Đã gửi đăng ký thành công!</h3>
            <p className="text-sm text-white/70 mb-7">Đội ngũ Fintech24h sẽ liên hệ để xác nhận bước tiếp theo.</p>
            <button onClick={() => { setIsSuccess(false); setForm(emptyForm); setOffers([]); setLookingFor([]); startedRef.current = false; }} className="btn-ghost w-full justify-center text-xs border border-[var(--border-default)]">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
