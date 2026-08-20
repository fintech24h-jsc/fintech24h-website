import { useState, useRef } from 'react';
import { submitLead } from '../../lib/leadSubmit';

interface JobApplicationFormProps {
  jobTitle?: string;
}

export default function JobApplicationForm({ jobTitle = 'General Application' }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telegram: '',
    linkedin: '',
    portfolio: '',
    message: '',
    companyWebsite: '',
  });

  const [resume, setResume] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume file size must be less than 5MB.');
        return;
      }
      setResume(file);
      setResumeFileName(file.name);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setResumeBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.telegram || !resumeBase64) {
      setError('Please fill in all required fields (*) and upload your resume.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const fields = [
      { name: 'firstname', value: formData.name.split(' ')[0] || formData.name },
      { name: 'lastname', value: formData.name.split(' ').slice(1).join(' ') || '' },
      { name: 'email', value: formData.email },
      { name: 'telegram_handle', value: formData.telegram },
      { name: 'linkedin', value: formData.linkedin },
      { name: 'portfolio_url', value: formData.portfolio },
      { name: 'message', value: formData.message },
      { name: 'job_title', value: jobTitle },
    ];

    const attachment = {
      name: resumeFileName,
      content: resumeBase64,
    };

    const result = await submitLead(formData, `Job Application: ${jobTitle}`, fields, attachment);

    setIsSubmitting(false);

    if (result.ok) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'An error occurred. Please email careers@fintech24h.com');
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
            <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">LinkedIn Profile URL</label>
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
          <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Portfolio / GitHub / Website</label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={e => update('portfolio', e.target.value)}
            placeholder="https://mywork.com"
            className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Upload Resume (PDF only, max 5MB) *</label>
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={triggerFileSelect}
            className="relative group/upload border border-dashed border-[var(--border-default)] rounded-xl p-6 bg-[var(--surface-faint)] hover:bg-[var(--surface-soft)] hover:border-[var(--border-accent)] transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <svg
              className="w-8 h-8 text-[var(--text-muted)] group-hover/upload:text-[var(--accent-cyan)] transition-colors duration-300 mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <span className="text-xs font-semibold text-[var(--text-primary)] mb-1 font-body">
              {resumeFileName ? (
                <span className="text-[var(--accent-cyan)]">{resumeFileName}</span>
              ) : (
                'Select Resume PDF'
              )}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] opacity-70 font-body">
              Drag and drop or click to browse
            </span>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-[var(--text-secondary)] opacity-70 mb-1.5 font-body uppercase tracking-wider">Short Bio / Cover Letter</label>
          <textarea
            value={formData.message}
            onChange={e => update('message', e.target.value)}
            placeholder="Tell us why you want to join Fintech24h and what impact you can make..."
            rows={3}
            className="w-full bg-[var(--surface-soft)] border border-[var(--border-default)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-accent)] focus:bg-[var(--surface-hover)] transition-all duration-300 font-body placeholder:text-[var(--text-muted)] shadow-inner backdrop-blur-md resize-none"
          ></textarea>
        </div>

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
              Submitting Application...
            </span>
          ) : (
            <span className="relative z-10 font-display text-xs font-semibold tracking-[0.2em] text-[var(--text-inverted)] uppercase flex items-center gap-2">
              Submit Application
              <svg className="w-4 h-4 text-[var(--text-inverted)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
          )}
        </button>
      </form>

      {/* Success Modal Popup */}
      {isSuccess && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[var(--overlay-backdrop)] backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--bg-tertiary)_95%,transparent)] backdrop-blur-2xl shadow-xl text-center animate-[scale-in_0.3s_ease-out] overflow-hidden">
            {/* Spotlight glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,92,252,0.08) 0%, transparent 60%)' }} />
            
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-cyan)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(124,92,252,0.3)]">
              <svg className="w-8 h-8 text-[#050810]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-3">
              Application Received!
            </h3>

            <p className="text-sm text-[var(--text-secondary)] font-body max-w-sm mx-auto mb-8 leading-relaxed">
              Thank you for applying. Our talent acquisition team has received your profile and will review your resume shortly.
            </p>

            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  telegram: '',
                  linkedin: '',
                  portfolio: '',
                  message: '',
                  companyWebsite: '',
                });
                setResume(null);
                setResumeFileName('');
                setResumeBase64('');
              }}
              className="w-full py-3 px-5 text-xs font-semibold uppercase tracking-wider bg-[var(--surface-soft)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-xl transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
