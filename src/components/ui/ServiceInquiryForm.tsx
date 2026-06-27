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
      <div className="text-center py-10 px-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#ff6b83] to-[#f0a278] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(255,107,131,0.2)]">
          <svg className="w-8 h-8 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-3">
          Inquiry Submitted!
        </h3>
        <p className="text-sm text-[var(--text-secondary)] font-body max-w-md mx-auto mb-8">
          Thank you. Our growth strategy team will reach out with a custom campaign proposal within <strong className="text-[#f0a278]">24 hours</strong>.
        </p>
        <a
          href="https://t.me/fintech24h"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-primary py-3.5 px-6 bg-gradient-to-r from-[#ff6b83] to-[#f0a278] text-[#050810] border-none shadow-[0_4px_15px_rgba(255,107,131,0.2)]"
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-body">
          {error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Alex Nguyen"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Telegram Username *</label>
          <input
            type="text"
            required
            value={formData.telegram}
            onChange={e => update('telegram', e.target.value)}
            placeholder="@alex_handle"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Email Address *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => update('email', e.target.value)}
            placeholder="alex@project.io"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Project Name</label>
          <input
            type="text"
            value={formData.projectName}
            onChange={e => update('projectName', e.target.value)}
            placeholder="My Web3 Protocol"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Service of Interest</label>
          <select
            value={formData.serviceInterest}
            onChange={e => update('serviceInterest', e.target.value)}
            className="input-field bg-[#0c1221]"
          >
            <option value="">Select a service...</option>
            {servicesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Estimated Monthly Budget</label>
          <select
            value={formData.budget}
            onChange={e => update('budget', e.target.value)}
            className="input-field bg-[#0c1221]"
          >
            <option value="">Select budget range...</option>
            {budgetRanges.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Website / Pitchdeck URL</label>
        <input
          type="url"
          value={formData.website}
          onChange={e => update('website', e.target.value)}
          placeholder="https://myproject.io"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 font-body">Message / Custom Requirements</label>
        <textarea
          value={formData.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Tell us about your project, timelines, or growth goals..."
          rows={3}
          className="input-field resize-none py-3"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full text-center justify-center font-display text-sm flex items-center gap-2 py-4 bg-gradient-to-r from-[#ff6b83] to-[#f0a278] text-[#050810] border-none shadow-[0_4px_20px_rgba(255,107,131,0.15)] hover:shadow-[0_4px_30px_rgba(255,107,131,0.25)] disabled:opacity-50"
      >
        {isSubmitting ? (
          <span>Submitting Inquiry...</span>
        ) : (
          <>
            <span>Request Campaign Proposal</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
