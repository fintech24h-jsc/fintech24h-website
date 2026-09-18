import { useState } from 'react';
import { submitLead } from '../../../lib/leadSubmit';
import { getSS3Content, type DealmakersLocale } from '../../../data/dealmakers/content';

interface FormState {
  name: string;
  company: string;
  email: string;
  linkedin: string;
  telegram: string;
  fundingStatus: string;
  note: string;
  companyWebsite: string; // honeypot
  marketingOptIn: boolean;
}

const emptyFormBase = {
  name: '', company: '', email: '', linkedin: '', telegram: '',
  note: '', companyWebsite: '', marketingOptIn: false,
};

function track(event: string) {
  const dl = (window as any).dataLayer;
  if (dl) dl.push({ event: `dealmakers_ss3_${event}` });
}

interface Props {
  locale?: DealmakersLocale;
}

export default function TelegramJoinForm({ locale = 'en' }: Props) {
  const { fundingStatusOptions, telegramGroupUrl, telegramGroupName } = getSS3Content(locale);
  const emptyForm: FormState = { ...emptyFormBase, fundingStatus: fundingStatusOptions[0] };
  const copy = locale === 'ar' ? {
    requiredError: 'يرجى تعبئة جميع الحقول المطلوبة (*).',
    genericError: 'حدث خطأ ما. يرجى مراسلتنا عبر info@fintech24h.com',
    underReviewTitle: 'طلبك قيد المراجعة',
    underReviewBody: (name: string) => `اضغط على الزر أدناه للانضمام إلى ${name} على تيليجرام، ثم انتظر قليلًا. يقوم فريقنا بمراجعة بياناتك وسيرسل لك ترحيبًا حارًا فور الموافقة.`,
    joinOnTelegram: (name: string) => `الانضمام إلى ${name} على تيليجرام`,
    pleaseNote: 'يرجى الملاحظة:',
    reservedNote: (name: string) => `${name} مخصّص للتنفيذيين من الدرجة الأولى (C-level) والمؤسسين وكبار قادة الأعمال، لذا فإن الموافقة هنا انتقائية عمدًا. إذا كنت محترفًا، أو مستقلًا، أو خبيرًا في المجال، فستحصل على الموافقة بشكل أسرع بكثير في مجتمعنا العام بدلًا من ذلك، وهو فضاء مُصمّم للمحترفين والمستقلين والبنّائين للتواصل والتعاون وتبادل الفرص.`,
    joinVietnamCommunity: 'الانضمام إلى مجتمع Fintech24h فيتنام',
    requestToJoin: 'طلب الانضمام',
    vettedIntro: (name: string) => `${name} مجتمع تيليجرام مدقّق. شارك بعض التفاصيل ليتمكّن فريقنا من مراجعة عضويتك والموافقة عليها.`,
    companyWebsiteLabel: 'موقع الشركة الإلكتروني',
    fullName: 'الاسم الكامل *',
    fullNamePlaceholder: 'أحمد الفارس',
    company: 'الشركة *',
    companyPlaceholder: 'اسم الشركة',
    email: 'البريد الإلكتروني *',
    emailPlaceholder: 'you@company.com',
    linkedin: 'لينكدإن',
    linkedinPlaceholder: 'linkedin.com/in/...',
    telegramUsername: 'اسم مستخدم تيليجرام *',
    telegramPlaceholder: '@yourhandle',
    telegramHint: 'يجب أن يكون حساب تيليجرام الرئيسي الخاص بك. هذه هي الطريقة التي يتحقق بها فريقنا منك للموافقة.',
    fundingStatus: 'حالة التمويل *',
    tellUsMore: 'أخبرنا المزيد',
    tellUsMorePlaceholder: 'ما الذي تبنيه، أو ما الذي تتطلع للاستثمار فيه؟',
    privacyNote: 'تُستخدم بياناتك فقط لمراجعة طلب عضويتك ولن تُنشر علنًا دون موافقتك. راجع',
    privacyPolicy: 'سياسة الخصوصية',
    marketingOptIn: 'أرسلوا لي تحديثات حول مواسم DealMakers’ Club القادمة (اختياري، يمكنك إلغاء الاشتراك في أي وقت).',
    sending: 'جارٍ الإرسال...',
    submit: 'إرسال الطلب',
  } : locale === 'zh' ? {
    requiredError: '请填写所有必填字段（*）。',
    genericError: '出现了一些问题。请发送邮件至 info@fintech24h.com',
    underReviewTitle: '你的申请正在审核中',
    underReviewBody: (name: string) => `点击下方按钮在 Telegram 上加入 ${name}，然后耐心等待。我们的团队正在审核你的信息，一经批准将立即向你发送热情的欢迎。`,
    joinOnTelegram: (name: string) => `在 Telegram 上加入 ${name}`,
    pleaseNote: '请注意：',
    reservedNote: (name: string) => `${name} 专为 C 级高管、创始人及资深商业领袖保留，因此这里的审核标准刻意从严。如果你是专业人士、自由职业者或行业专家，在我们的大众社区中会更快获得批准——那是一个专为专业人士、自由职业者和建设者打造的空间，用于建立联系、协作和交流机会。`,
    joinVietnamCommunity: '加入 Fintech24h 越南社区',
    requestToJoin: '申请加入',
    vettedIntro: (name: string) => `${name} 是一个经过审核的 Telegram 社区。请分享一些信息，以便我们的团队审核并批准你的会员资格。`,
    companyWebsiteLabel: '公司网站',
    fullName: '姓名 *',
    fullNamePlaceholder: '张伟',
    company: '公司 *',
    companyPlaceholder: '公司名称',
    email: '邮箱 *',
    emailPlaceholder: 'you@company.com',
    linkedin: 'LinkedIn',
    linkedinPlaceholder: 'linkedin.com/in/...',
    telegramUsername: 'Telegram 用户名 *',
    telegramPlaceholder: '@yourhandle',
    telegramHint: '必须是你本人的主要 Telegram 账号。这是我们团队核实身份以完成审核的方式。',
    fundingStatus: '融资状态 *',
    tellUsMore: '告诉我们更多',
    tellUsMorePlaceholder: '你正在构建什么，或者你正在考虑投资什么？',
    privacyNote: '你的信息仅用于审核你的会员申请，未经同意不会公开。参见我们的',
    privacyPolicy: '隐私政策',
    marketingOptIn: '向我发送有关 DealMakers’ Club 未来赛季的更新（可选，可随时取消订阅）。',
    sending: '发送中……',
    submit: '提交申请',
  } : {
    requiredError: 'Please fill in all required fields (*).',
    genericError: 'Something went wrong. Please email info@fintech24h.com',
    underReviewTitle: 'Your request is under review',
    underReviewBody: (name: string) => `Tap the button below to join ${name} on Telegram, then sit tight. Our team is reviewing your information and will send you a warm welcome once you’re approved.`,
    joinOnTelegram: (name: string) => `Join ${name} on Telegram`,
    pleaseNote: 'Please note:',
    reservedNote: (name: string) => `${name} is reserved for C-level executives, founders, and senior business leaders, so approval here is deliberately selective. If you're a professional, freelancer, or industry expert, you'll be approved far faster in our general community instead, a space built for professionals, freelancers, and builders to connect, collaborate, and exchange opportunities.`,
    joinVietnamCommunity: 'Join the Fintech24h Vietnam Community',
    requestToJoin: 'Request to Join',
    vettedIntro: (name: string) => `${name} is a vetted Telegram community. Share a few details so our team can review and approve your membership.`,
    companyWebsiteLabel: 'Company website',
    fullName: 'Full name *',
    fullNamePlaceholder: 'Alex Nguyen',
    company: 'Company *',
    companyPlaceholder: 'Company name',
    email: 'Email *',
    emailPlaceholder: 'you@company.com',
    linkedin: 'LinkedIn',
    linkedinPlaceholder: 'linkedin.com/in/...',
    telegramUsername: 'Telegram username *',
    telegramPlaceholder: '@yourhandle',
    telegramHint: 'Must be your own, main Telegram account. This is how our team verifies you for approval.',
    fundingStatus: 'Funding status *',
    tellUsMore: 'Tell us more',
    tellUsMorePlaceholder: 'What are you building, or what are you looking to invest in?',
    privacyNote: 'Your information is used only to review your membership request and will not be made public without consent. See our',
    privacyPolicy: 'Privacy Policy',
    marketingOptIn: 'Send me updates about future DealMakers\' Club seasons (optional, you can unsubscribe anytime).',
    sending: 'Sending...',
    submit: 'Submit Request',
  };
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
      setError(copy.requiredError);
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
      setError(result.error || copy.genericError);
    }
  };

  if (isSuccess) {
    return (
      <div className="dm-card p-7 sm:p-9 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--dm-gradient-primary)' }}>
          <svg className="w-7 h-7 text-[#0a0908]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
        </div>
        <h2 className="text-xl font-display font-semibold text-[var(--dm-text-primary)] mb-3">{copy.underReviewTitle}</h2>
        <p className="text-sm text-[var(--dm-text-secondary)] leading-relaxed mb-7">
          {copy.underReviewBody(telegramGroupName)}
        </p>
        <a
          href={telegramGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dm-btn-primary w-full justify-center text-xs py-3.5"
          onClick={() => track('telegram_join_open_group')}
        >
          {copy.joinOnTelegram(telegramGroupName)}
        </a>

        <div className="mt-6 pt-6 border-t border-[var(--dm-border)] text-start">
          <p className="text-[11px] text-[var(--dm-text-muted)] leading-relaxed mb-3">
            <strong className="text-[var(--dm-text-secondary)]">{copy.pleaseNote}</strong> {copy.reservedNote(telegramGroupName)}
          </p>
          <a
            href="https://t.me/Fintech24h_Vietnam_Official"
            target="_blank"
            rel="noopener noreferrer"
            className="dm-btn-ghost w-full justify-center text-xs py-3"
            onClick={() => track('telegram_join_alt_community')}
          >
            {copy.joinVietnamCommunity}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-card p-6 sm:p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-display font-semibold text-[var(--dm-text-primary)] mb-1">{copy.requestToJoin}</h2>
      <p className="text-xs text-[var(--dm-text-secondary)] mb-6">
        {copy.vettedIntro(telegramGroupName)}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="tg-company-website">{copy.companyWebsiteLabel}</label>
          <input id="tg-company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off"
            value={form.companyWebsite} onChange={(e) => setForm((p) => ({ ...p, companyWebsite: e.target.value }))} />
        </div>

        {error && (
          <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs" role="alert">{error}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg-name" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.fullName}</label>
            <input id="tg-name" required className="dm-input" placeholder={copy.fullNamePlaceholder} value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label htmlFor="tg-company" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.company}</label>
            <input id="tg-company" required className="dm-input" placeholder={copy.companyPlaceholder} value={form.company} onChange={(e) => update('company', e.target.value)} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tg-email" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.email}</label>
            <input id="tg-email" type="email" required className="dm-input" placeholder={copy.emailPlaceholder} value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label htmlFor="tg-linkedin" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.linkedin}</label>
            <input id="tg-linkedin" className="dm-input" placeholder={copy.linkedinPlaceholder} value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="tg-telegram" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.telegramUsername}</label>
          <input id="tg-telegram" required className="dm-input" placeholder={copy.telegramPlaceholder} value={form.telegram} onChange={(e) => update('telegram', e.target.value)} />
          <p className="text-[10px] text-[var(--dm-text-muted)] mt-1">{copy.telegramHint}</p>
        </div>

        <div>
          <label htmlFor="tg-funding" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.fundingStatus}</label>
          <select id="tg-funding" className="dm-input" value={form.fundingStatus} onChange={(e) => update('fundingStatus', e.target.value)}>
            {fundingStatusOptions.map((opt) => <option key={opt} value={opt} className="bg-[#0a0908]">{opt}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="tg-note" className="block text-[10px] font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{copy.tellUsMore}</label>
          <textarea id="tg-note" rows={3} className="dm-input resize-none" placeholder={copy.tellUsMorePlaceholder} value={form.note} onChange={(e) => update('note', e.target.value)} />
        </div>

        <p className="text-[10px] text-[var(--dm-text-muted)] leading-relaxed">
          {copy.privacyNote} <a href="/privacy/" className="underline hover:text-[var(--dm-gold)]">{copy.privacyPolicy}</a>.
        </p>

        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={(e) => setForm((p) => ({ ...p, marketingOptIn: e.target.checked }))}
            className="mt-0.5 w-4 h-4 rounded border-[var(--dm-border)] bg-white/5 accent-[var(--dm-gold)] shrink-0"
          />
          <span className="text-[10px] text-[var(--dm-text-muted)] leading-relaxed">
            {copy.marketingOptIn}
          </span>
        </label>

        <button type="submit" disabled={isSubmitting} className="dm-btn-primary w-full justify-center text-xs">
          {isSubmitting ? copy.sending : copy.submit} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
