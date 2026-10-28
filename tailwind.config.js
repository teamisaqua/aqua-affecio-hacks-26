/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070f",
        lab: {
          dark: "#030712",
          surface: "rgba(15, 23, 42, 0.65)",
          glass: "rgba(255, 255, 255, 0.04)",
          border: "rgba(255, 255, 255, 0.09)",
          cyan: "#00f0ff",
          pink: "#ff2a85",
          purple: "#9d4edd",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        'glass-sm': '0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-md': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 2px 0 rgba(255, 255, 255, 0.15)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.7), inset 0 1px 2px 0 rgba(255, 255, 255, 0.2)',
        'glow-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.45)',
        'glow-pink': '0 0 25px -4px rgba(255, 42, 133, 0.45)',
        'glow-purple': '0 0 30px -4px rgba(157, 78, 221, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'bubble': 'bubble 3s ease-in infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(100%) scale(0.6)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(0%) scale(1.1)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
