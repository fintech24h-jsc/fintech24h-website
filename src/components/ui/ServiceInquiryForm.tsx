import { useState } from 'react';
import { submitHubSpotForm } from '../../lib/hubspot';

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

    try {
      const portalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID || '000000';
      const formId = import.meta.env.PUBLIC_HUBSPOT_FORM_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      const payload = {
        fields: [
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
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title,
        },
      };

      await submitHubSpotForm(portalId, formId, payload);

      // Submit to Google Sheets & Telegram Webhook
      const sheetsWebhook = import.meta.env.PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL;
      if (sheetsWebhook) {
        try {
          await fetch(sheetsWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              formType: 'Service Inquiry'
            }),
          });
        } catch (webhookErr) {
          console.error('Google Sheets Webhook error:', webhookErr);
        }
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please contact us directly at info@fintech24h.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff6b83] to-[#f0a278] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,107,131,0.2)]">
          <svg className="w-6 h-6 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">
          Inquiry Submitted!
        </h3>
        <p className="text-sm text-[var(--text-secondary)] font-body max-w-md mx-auto mb-6">
          Thank you. Our growth strategy team will reach out with a custom campaign proposal within <strong className="text-[#f0a278]">24 hours</strong>.
        </p>
        <a
          href="https://t.me/fintech24h"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-primary py-3 px-5 text-sm bg-gradient-to-r from-[#ff6b83] to-[#f0a278] text-[#050810] border-none shadow-[0_4px_15px_rgba(255,107,131,0.2)]"
        >
          Quick Connect via Telegram
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
      {error && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-body backdrop-blur-md">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Alex Nguyen"
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => update('email', e.target.value)}
            placeholder="alex@project.io"
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Telegram Username *</label>
          <input
            type="text"
            required
            value={formData.telegram}
            onChange={e => update('telegram', e.target.value)}
            placeholder="@alex_handle"
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Project Name</label>
          <input
            type="text"
            value={formData.projectName}
            onChange={e => update('projectName', e.target.value)}
            placeholder="My Web3 Protocol"
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Service of Interest</label>
          <select
            value={formData.serviceInterest}
            onChange={e => update('serviceInterest', e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all duration-300 font-body appearance-none shadow-inner backdrop-blur-md"
          >
            <option value="" className="bg-[#050810]">Select a service...</option>
            {servicesList.map(s => (
              <option key={s} value={s} className="bg-[#050810]">{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Estimated Monthly Budget</label>
          <select
            value={formData.budget}
            onChange={e => update('budget', e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 transition-all duration-300 font-body appearance-none shadow-inner backdrop-blur-md"
          >
            <option value="" className="bg-[#050810]">Select budget range...</option>
            {budgetRanges.map(b => (
              <option key={b} value={b} className="bg-[#050810]">{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Website / Pitchdeck URL</label>
          <input
            type="url"
            value={formData.website}
            onChange={e => update('website', e.target.value)}
            placeholder="https://myproject.io"
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">LinkedIn Profile (Optional)</label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={e => update('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-white/50 mb-1.5 font-body uppercase tracking-wider">Message / Details</label>
        <textarea
          value={formData.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Tell us about your timeline, current metrics, and specific goals..."
          rows={2}
          className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-300 font-body placeholder:text-white/20 shadow-inner backdrop-blur-md resize-none"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="relative w-full group flex items-center justify-center py-3.5 rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.01] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer-slide_1.5s_ease-out_infinite]" />
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500 backdrop-blur-[2px]" />
        
        {isSubmitting ? (
          <span className="relative z-10 font-display text-xs font-semibold tracking-widest text-white/70 uppercase flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          <span className="relative z-10 font-display text-xs font-semibold tracking-[0.2em] text-white uppercase flex items-center gap-2">
            Send Inquiry
            <svg className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}
