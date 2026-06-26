import { useState } from 'react';

export default function CalendlyEmbed() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom styled query variables match our brand styling:
  const calendlyUrl = 'https://calendly.com/fintech24h/discovery-call?hide_event_details=1&hide_gdpr_banner=1&background_color=050810&text_color=f0f4ff&primary_color=00d4ff';

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
