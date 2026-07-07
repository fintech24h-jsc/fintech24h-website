import React, { useState, useRef } from 'react';

interface JobApplicationFormProps {
  jobTitle: string;
  jobId: string;
}

export default function JobApplicationForm({ jobTitle, jobId }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    telegram: '',
    linkedin: '',
    coverLetter: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileError, setFileError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFile = (file: File) => {
    // Limits size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds the 10MB limit.');
      setSelectedFile(null);
      setFileBase64('');
      return;
    }

    // Accepts PDF, DOC, DOCX
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileNameLower = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileNameLower.endsWith(ext));
    
    const validMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const isValidMime = validMimeTypes.includes(file.type);

    if (!isValidExtension && !isValidMime) {
      setFileError('Only PDF, DOC, or DOCX documents are allowed.');
      setSelectedFile(null);
      setFileBase64('');
      return;
    }

    setFileError('');
    setSelectedFile(file);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = () => {
      const rawResult = reader.result as string;
      const base64Str = rawResult.split(',')[1] || '';
      setFileBase64(base64Str);
    };
    reader.onerror = () => {
      setFileError('Failed to read file contents.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileBase64('');
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.telegram || !selectedFile) {
      setError('Please fill in all required fields and upload your CV.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const envWebhook = import.meta.env.PUBLIC_CAREERS_WEBHOOK_URL;
    const webhook = (envWebhook && envWebhook.indexOf('PASTE_YOUR_DEPLOYED') === -1 && envWebhook.trim() !== '')
      ? envWebhook.trim()
      : 'https://script.google.com/macros/s/AKfycbzoleDR0LhwZZy0I2aYCFeAdTy1IYfdsqsRU5zqm0Vf2XyVEjfdOxSJt6QpPETshxvuDQ/exec';

    try {
      await fetch(webhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          telegram: formData.telegram,
          linkedin: formData.linkedin,
          coverLetter: formData.coverLetter,
          jobTitle: jobTitle,
          jobId: jobId,
          cvFileName: selectedFile.name,
          cvFileMimeType: selectedFile.type,
          cvFileBase64: fileBase64,
          submittedAt: new Date().toISOString(),
        }),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to establish telemetry link. Please try again or email info@fintech24h.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="card-featured p-8 text-center space-y-6 relative overflow-hidden backdrop-blur-md border border-[var(--accent-cyan)]/30 rounded-2xl animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-cyan)]/5 to-[var(--accent-purple)]/5 pointer-events-none" />
        <div className="w-16 h-16 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/30 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,200,240,0.15)]">
          <svg className="w-8 h-8 text-[var(--accent-cyan)] animate-[pulse-dot_2s_infinite]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-h3 font-bold text-white uppercase tracking-wider">Node Registered</h3>
          <p className="font-mono text-[9px] text-[var(--accent-cyan)] tracking-[0.2em] uppercase">Status: APPLICATION_RECEIVED_OK</p>
        </div>
        <p className="font-body text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
          Thank you for applying for the <strong>{jobTitle}</strong> position. Our recruiting core has indexed your profile. We will reach out to you via Telegram or Email shortly.
        </p>
        <div className="w-12 h-px bg-white/10 mx-auto" />
        <button
          onClick={() => {
            setIsSuccess(false);
            setFormData({ name: '', email: '', phone: '', telegram: '', linkedin: '', coverLetter: '' });
            setSelectedFile(null);
            setFileBase64('');
          }}
          className="text-[10px] font-mono text-[var(--accent-cyan)] uppercase hover:text-white transition-colors duration-300 tracking-wider"
        >
          [ Submit Another Application ]
        </button>
      </div>
    );
  }

  return (
    <div className="card-default p-6 sm:p-8 relative backdrop-blur-md rounded-2xl border border-white/5 space-y-6 shadow-2xl">
      <div className="space-y-1">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-cyan)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          Protocol // Career_Intake
        </span>
        <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Apply for this Position</h3>
        <p className="font-body text-xs text-text-secondary">
          Enter your metrics to register as a network contributor candidate.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-body backdrop-blur-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Full Name *</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.name}
              onChange={e => updateField('name', e.target.value)}
              placeholder="Vincent Nguyen"
              className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10"
            />
          </div>
          <div>
            <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Email Address *</label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={e => updateField('email', e.target.value)}
              placeholder="vincent@fintech24h.com"
              className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10"
            />
          </div>
        </div>

        {/* Telegram & Phone */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Telegram Username *</label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              value={formData.telegram}
              onChange={e => updateField('telegram', e.target.value)}
              placeholder="@username"
              className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10"
            />
          </div>
          <div>
            <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              disabled={isSubmitting}
              value={formData.phone}
              onChange={e => updateField('phone', e.target.value)}
              placeholder="+84 90 1234 567"
              className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">LinkedIn URL</label>
          <input
            type="url"
            disabled={isSubmitting}
            value={formData.linkedin}
            onChange={e => updateField('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10"
          />
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Introduction / Cover Letter</label>
          <textarea
            disabled={isSubmitting}
            value={formData.coverLetter}
            onChange={e => updateField('coverLetter', e.target.value)}
            rows={3}
            placeholder="Tell us why you are interested in this role and how you fit our ecosystem..."
            className="w-full bg-white/[0.01] border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[var(--accent-cyan)]/40 focus:bg-white/[0.03] transition-all duration-300 font-body placeholder:text-white/10 resize-y min-h-[80px]"
          />
        </div>

        {/* CV Upload Area */}
        <div>
          <label className="block text-[9px] font-semibold text-white/40 mb-1.5 font-mono uppercase tracking-wider">Upload CV (PDF, DOC, DOCX) *</label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isSubmitting}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-2 ${
              isDragOver
                ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/5 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-500/40 bg-emerald-500/2'
                : 'border-white/10 bg-white/[0.005] hover:border-white/20 hover:bg-white/[0.01]'
            }`}
          >
            {selectedFile ? (
              <div className="w-full flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white font-medium truncate font-body">{selectedFile.name}</p>
                    <p className="text-[10px] text-emerald-400/80 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB // LOADED_OK
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={isSubmitting}
                  className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all cursor-pointer"
                  title="Remove CV"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-white/60 font-body">
                    Drag and drop your CV file, or <span className="text-[var(--accent-cyan)] font-medium">browse files</span>
                  </p>
                  <p className="text-[9px] text-white/30 font-mono mt-1">PDF, DOC, DOCX UP TO 10MB</p>
                </div>
              </>
            )}
          </div>
          {fileError && <p className="text-[10px] text-red-400 mt-1.5 font-body">{fileError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full relative flex items-center justify-center gap-2 px-6 py-3 font-display font-bold text-xs uppercase tracking-widest text-[#050810] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-purple)] rounded-lg transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,200,240,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:transform-none select-none"
        >
          {isSubmitting ? (
            <>
              {/* Spinner */}
              <div className="w-3.5 h-3.5 border-2 border-[#050810] border-t-transparent rounded-full animate-spin" />
              <span>Transmitting Metrics...</span>
            </>
          ) : (
            <>
              <span>Submit Core Application</span>
              <svg className="w-3 h-3 translate-y-[-0.5px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
