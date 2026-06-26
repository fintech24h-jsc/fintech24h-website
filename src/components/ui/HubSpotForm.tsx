import { useState } from 'react';
import { submitHubSpotForm } from '../../lib/hubspot';

export default function HubSpotForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');

    try {
      const portalId = import.meta.env.PUBLIC_HUBSPOT_PORTAL_ID || '000000';
      const formId = import.meta.env.PUBLIC_HUBSPOT_FORM_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      const payload = {
        fields: [
          { name: 'email', value: email }
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      };

      await submitHubSpotForm(portalId, formId, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to subscribe. Please email us directly at info@fintech24h.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-sm text-cyan-400 font-body py-2">
        ✓ Thank you for subscribing! Check your inbox soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
      <div className="flex-grow">
        <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-sm text-[#f0f4ff] font-body placeholder-[#475569] focus:outline-none focus:border-cyan-400/50 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary font-display font-semibold text-xs py-3 px-6 rounded-lg whitespace-nowrap disabled:opacity-50"
      >
        {isSubmitting ? 'Joining...' : 'Subscribe'}
      </button>
      {error && <p className="text-red-400 text-xs mt-2 w-full font-body">{error}</p>}
    </form>
  );
}
