// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-flicker': 'flicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '25%': { opacity: 0.8, transform: 'translateY(-2px) scale(0.98)' },
          '50%': { opacity: 1, transform: 'translateY(-1px) scale(1.02)' },
          '75%': { opacity: 0.9, transform: 'translateY(1px) scale(0.99)' },
        }
      }
    },
  },
  plugins: [],
}