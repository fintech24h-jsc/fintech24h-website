/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Theo design-system.md section 3.2
        display: ['"Space Grotesk"', 'sans-serif'],  // H1-H3, buttons, CTA, stat numbers
        body:    ['Inter', 'sans-serif'],             // Body text, captions, tags
        mono:    ['"JetBrains Mono"', 'monospace'],  // Eyebrow labels — điểm nhận diện đặc trưng
      },
      colors: {
        background: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary:  'var(--bg-tertiary)',
          glass:     'var(--bg-glass)',
        },
        accent: {
          cyan:   'var(--accent-cyan)',
          purple: 'var(--accent-purple)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
        border: {
          default: 'var(--border-default)',
          hover:   'var(--border-hover)',
          accent:  'var(--border-accent)',
          subtle:  'var(--border-subtle)',
        },
        color: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger:  'var(--color-danger)',
        },
      },
      fontSize: {
        // Theo design-system.md
        'hero': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'h1':   ['clamp(2.2rem, 4.5vw, 3.75rem)', { lineHeight: '1.1',  letterSpacing: '-0.025em' }],
        'h2':   ['clamp(1.6rem, 3vw, 2.5rem)',    { lineHeight: '1.2',  letterSpacing: '-0.02em' }],
        'h3':   ['clamp(1.2rem, 2vw, 1.5rem)',    { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'body': ['1rem',       { lineHeight: '1.75' }],
        'small':['0.875rem',   { lineHeight: '1.6' }],
        'xs':   ['0.75rem',    { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      animation: {
        'orb-pulse':  'orb-pulse 8s ease-in-out infinite',
        'orb-drift':  'orb-drift 12s ease-in-out infinite',
        'glow-pulse': 'border-glow 4s ease-in-out infinite',
        'marquee':    'marquee-scroll 35s linear infinite',
        'fade-up':    'fade-up 0.75s ease forwards',
        'scale-in':   'scale-in 0.65s ease forwards',
        'shimmer':    'shimmer 1.5s ease-in-out infinite',
        'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
