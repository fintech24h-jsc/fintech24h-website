// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],  // Headings H1-H3
        body: ['Inter', 'sans-serif'],               // Body text
        mono: ['"JetBrains Mono"', 'monospace'],     // Code
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
        'h3': ['clamp(1.2rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'grid-fade': 'grid-fade 8s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
