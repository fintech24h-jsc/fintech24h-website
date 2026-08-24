import { useState } from 'react';

export default function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // hide_gdpr_banner is deliberately NOT set — Calendly's own consent
  // notice should still show once the visitor opts in below, rather
  // than being suppressed on their behalf.
  const calendlyUrl = 'https://calendly.com/fintech24h/discovery-call?hide_event_details=1&background_color=050810&text_color=f0f4ff&primary_color=00d4ff';

  if (!loaded) {
    return (
      <div className="w-full min-h-[320px] rounded-xl border border-white/5 bg-[#0a0f1e]/50 flex flex-col items-center justify-center text-center px-6 py-12">
        <p className="text-sm text-[#94a3b8] font-body max-w-md mb-5">
          This loads Calendly's booking calendar in an embedded frame. Calendly will set its own cookies
          once loaded — see their <a href="https://calendly.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">privacy policy</a>.
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="font-display font-semibold text-sm px-6 py-3 rounded-lg text-[#050810] bg-gradient-to-r from-cyan-400 to-purple-400 transition-transform duration-200 hover:-translate-y-0.5"
        >
          Load booking calendar
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] sm:h-[650px] rounded-xl overflow-hidden border border-white/5 bg-[#0a0f1e]/50">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050810]/80 z-10">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-[#94a3b8] font-body">Loading booking dashboard...</p>
        </div>
      )}
      <iframe
        src={calendlyUrl}
        width="100%"
        height="100%"
        onLoad={() => setIsLoading(false)}
        title="Schedule a call with Fintech24h"
        className="relative z-0 w-full h-full"
      ></iframe>
    </div>
  );
}
