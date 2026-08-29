/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020817',
          900: '#0a1628',
          800: '#0f2040',
          700: '#152b58',
          600: '#1e3a6e',
        },
        risk: {
          safe: '#22c55e',
          moderate: '#eab308',
          high: '#f97316',
          critical: '#ef4444',
        },
        accent: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'scaleX(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'scaleX(1)', opacity: 0 },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.3)',
        'glow-red': '0 0 20px rgba(239,68,68,0.4)',
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
        card: '0 4px 24px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
