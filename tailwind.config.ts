import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B4513',
          dark: '#654321',
          light: '#A0522D',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FDF9E8',
          100: '#FBF3D1',
          200: '#F7E7A3',
          300: '#F3DB75',
          400: '#EFCF47',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#9C7A17',
          800: '#80600F',
          900: '#644607',
          light: '#F4E4BC',
          dark: '#B8941F',
          glow: 'rgba(212, 175, 55, 0.3)',
        },
        black: {
          DEFAULT: '#000000',
          soft: '#0A0A0A',
          warm: '#1A1A1A',
          50: '#1A1A1A',
          100: '#141414',
          200: '#0F0F0F',
          300: '#0A0A0A',
          400: '#050505',
          500: '#000000',
        },
      },
      fontFamily: {
        arabic: ['Arial', 'Tahoma', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'syrian-pattern': `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(212, 175, 55, 0.03) 10px,
            rgba(212, 175, 55, 0.03) 20px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(212, 175, 55, 0.03) 10px,
            rgba(212, 175, 55, 0.03) 20px
          )
        `,
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)',
        'gold-gradient-vertical': 'linear-gradient(180deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%)',
        'dark-gradient': 'linear-gradient(180deg, #000000 0%, #0A0A0A 100%)',
      },
      boxShadow: {
        'gold-sm': '0 2px 8px rgba(212, 175, 55, 0.2)',
        'gold-md': '0 4px 16px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 8px 32px rgba(212, 175, 55, 0.4)',
        'gold-xl': '0 16px 64px rgba(212, 175, 55, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config

