import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function NavbarReact() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-0 left-0 z-50 px-6 py-6 w-full"
    >
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        
        {/* Left Side: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-white font-semibold text-lg font-display tracking-wide">Fintech24h</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-white/80 text-sm font-medium">
            <a href="/services" className="hover:text-white transition-colors duration-300">Services</a>
            <a href="/case-studies" className="hover:text-white transition-colors duration-300">Case Studies</a>
            <a href="/about" className="hover:text-white transition-colors duration-300">About</a>
          </div>
        </div>

        {/* Right Side: CTA Buttons */}
        <div className="flex items-center gap-4">
          <a href="/contact" className="text-white hover:text-white/80 transition-colors text-sm font-medium cursor-pointer hidden sm:block">
            Contact
          </a>
          <a href="#get-proposal" className="glass-pill px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer">
            Get Proposal
          </a>
        </div>
        
      </div>
    </motion.nav>
  );
}
