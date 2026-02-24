/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Glassmorphism - Blue-tinted glass
        glass: {
          50: 'rgba(59, 130, 246, 0.02)',
          100: 'rgba(59, 130, 246, 0.04)',
          200: 'rgba(59, 130, 246, 0.08)',
          300: 'rgba(59, 130, 246, 0.12)',
          400: 'rgba(59, 130, 246, 0.15)',
        },
        // Deep Blue-Black backgrounds (matching CoFounder Dashboard)
        dark: {
          900: '#050a14',
          800: '#081020',
          700: '#0c1529',
          600: '#132040',
        },
        // Gold for premium/luxury elements only
        gold: {
          400: '#E8C97A',
          500: '#D4A853',
          600: '#B8902E',
        },
        // Accent colors - Electric Blue primary
        accent: {
          primary: '#3b82f6',
          hover: '#2563eb',
          glow: 'rgba(59, 130, 246, 0.3)',
          secondary: '#60a5fa',
          purple: '#8b5cf6',
          // Gold accents - Luxury/Premium only
          gold: '#D4A853',
          goldLight: '#E8C97A',
          goldDark: '#B8902E',
          goldGlow: 'rgba(212, 168, 83, 0.25)',
        },
        // Status colors (matching CoFounder Dashboard)
        status: {
          success: '#22c55e',
          working: '#3b82f6',
          warning: '#f59e0b',
          error: '#ef4444',
          idle: 'rgba(255, 255, 255, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '60px',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(37, 99, 235, 0.25), 0 0 80px rgba(29, 78, 216, 0.15)',
        'neon-gold': '0 0 20px rgba(212, 168, 83, 0.25), 0 0 40px rgba(212, 168, 83, 0.15)',
        'neon-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.12)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.04), inset 0 1px 0 rgba(59, 130, 246, 0.06)',
        'deep': '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 60px rgba(59, 130, 246, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-pulse-blue': 'glow-pulse-blue 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-ring': 'pulse-ring 1.5s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        'glow-pulse-blue': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
          },
          '50%': {
            opacity: '0.7',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.3)'
          },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.7' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #2563eb 100%)',
        'neon-gradient': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #1d4ed8 100%)',
        'blue-mesh': 'radial-gradient(at 20% 30%, rgba(59, 130, 246, 0.12) 0%, transparent 50%), radial-gradient(at 80% 70%, rgba(29, 78, 216, 0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
