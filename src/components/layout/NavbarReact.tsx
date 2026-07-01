import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Menu, X } from 'lucide-react';

export default function NavbarReact() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const servicesList = [
    { label: 'kol marketing', href: '/services/kol-marketing' },
    { label: 'pr campaigns', href: '/services/pr-media' },
    { label: 'community growth', href: '/services/community-growth' },
    { label: 'event marketing', href: '/services/event-marketing' },
    { label: 'ai marketing', href: '/services/ai-marketing' },
    { label: 'business development', href: '/services/business-development' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-4 py-2 md:px-6 ${
          isScrolled ? 'md:py-2 bg-[#080C1A]/40 backdrop-blur-md border-b border-white/5 shadow-lg' : 'md:py-4 bg-transparent'
        }`}
      >
        <div className="liquid-glass rounded-full px-5 py-1.5 md:px-6 flex items-center justify-between max-w-5xl mx-auto border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] relative">
          
          {/* Left Side: Brand Logo */}
          <a href="/" className="flex items-center gap-2" aria-label="Fintech24h Home">
            <img src="https://fintech24h.com/wp-content/uploads/2026/07/Logo-Fintech24h.webp" alt="Fintech24h" width={300} height={210} loading="eager" fetchPriority="high" decoding="async" className="h-[48px] md:h-[64px] w-auto -my-[6px] md:-my-[10px] object-contain" />
          </a>
          
          {/* Centered Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-semibold tracking-wider font-mono absolute left-1/2 -translate-x-1/2">
            <a href="/" className="hover:text-[var(--accent-cyan)] transition-colors duration-300">home</a>
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button 
                type="button"
                className="hover:text-[var(--accent-cyan)] transition-colors duration-300 flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-[#080c1a]/95 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-1 z-50 text-left"
                  >
                    {servicesList.map(s => (
                      <a
                        key={s.href}
                        href={s.href}
                        className="px-4 py-2.5 rounded-xl hover:bg-white/[0.04] text-xs font-sans font-semibold text-white/70 hover:text-white transition-colors block"
                      >
                        {s.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="/blog" className="hover:text-[var(--accent-cyan)] transition-colors duration-300">blog</a>
            <a href="/contact" className="hover:text-[var(--accent-cyan)] transition-colors duration-300">contact</a>
          </div>

          {/* Right Side: CTA Button & Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center bg-[rgba(0,200,240,0.1)] border border-[rgba(0,200,240,0.35)] backdrop-blur-md text-white font-mono font-semibold uppercase tracking-wider text-[10px] py-2 px-5 rounded-full shadow-[0_8px_24px_rgba(0,200,240,0.08),inset_0_1px_2px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-[rgba(0,200,240,0.18)] hover:border-[rgba(0,200,240,0.6)] hover:shadow-[0_4px_12px_rgba(0,200,240,0.15),inset_0_1px_3px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Get Proposal</span>
            </a>

            {/* Mobile Hamburger Icon Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-[var(--accent-cyan)] transition-colors duration-300 focus:outline-none"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
        </div>
      </motion.nav>

      {/* Mobile Drawer Overlay Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-80 max-w-full bg-[#080c1a]/98 backdrop-blur-2xl border-l border-white/10 z-40 p-8 pt-24 flex flex-col gap-6 text-left shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Nav links */}
            <div className="flex flex-col gap-5 text-sm font-semibold tracking-widest font-mono text-white/80">
              <a
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--accent-cyan)] transition-colors duration-300"
              >
                home
              </a>
              
              {/* Collapsed Services List header in mobile menu */}
              <div>
                <span className="text-white/40 text-[10px] tracking-widest block mb-2 font-mono">services</span>
                <div className="flex flex-col gap-3 pl-3 border-l border-white/5">
                  {servicesList.map(s => (
                    <a
                      key={s.href}
                      href={s.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-sans text-white/60 hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <a
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--accent-cyan)] transition-colors duration-300"
              >
                blog
              </a>
              <a
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-[var(--accent-cyan)] transition-colors duration-300"
              >
                contact
              </a>
            </div>

            <div className="mt-auto border-t border-white/5 pt-6">
              <a
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center inline-flex items-center justify-center bg-[rgba(0,200,240,0.1)] border border-[rgba(0,200,240,0.35)] backdrop-blur-md text-white font-mono font-semibold uppercase tracking-wider text-[10px] py-3 rounded-full shadow-[0_8px_24px_rgba(0,200,240,0.08)] cursor-pointer"
              >
                Get Proposal
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
