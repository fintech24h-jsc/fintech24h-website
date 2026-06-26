import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function HeroReact() {
  const [isEmailState, setIsEmailState] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState('');

  // Typewriter effect for placeholder
  useEffect(() => {
    if (isEmailState && !isSubmitted) {
      const fullText = "Enter Your Email Here For Early Access";
      let currentIndex = 0;
      setPlaceholder('');
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setPlaceholder(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    } else if (isSubmitted) {
      const fullText = "You Will Receive Notifications By Email";
      let currentIndex = 0;
      setPlaceholder('');
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setPlaceholder(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    } else {
      setPlaceholder('');
    }
  }, [isEmailState, isSubmitted]);

  // Reset after submit
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsEmailState(false);
        setIsSubmitted(false);
        setEmail('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Actual email capture logic would go here
    }
  };

  return (
    <section className="relative flex-1 flex flex-col items-center justify-center px-6 min-h-[calc(100vh-100px)]">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        
        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
        >
          BUILD A WEB3 GROWTH ENGINE IN MINUTES
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          A new way to think and scale<br className="hidden md:block" /> with AI and Blockchain
        </motion.h1>

        {/* Interactive CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="min-h-[50px] mt-2 flex justify-center w-full"
        >
          <AnimatePresence mode="wait">
            {!isEmailState ? (
              <motion.button
                key="button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsEmailState(true)}
                className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
              >
                Get early access
              </motion.button>
            ) : (
              <motion.form
                key="form"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  disabled={isSubmitted}
                  className="bg-transparent text-white placeholder-white/45 outline-none w-full font-body disabled:opacity-50"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitted || !email}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {isSubmitted ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Play Video link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a href="#demo" className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide">
            Play Video Demo
          </a>
        </motion.div>

      </div>
    </section>
  );
}
