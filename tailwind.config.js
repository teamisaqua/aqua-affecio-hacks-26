/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "SFMono-Regular",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        canvas: "#09090B",
        surface: {
          DEFAULT: "#111114",
          primary: "#111114",
          elevated: "#18181D",
          secondary: "#18181D",
          tertiary: "#222228",
          glass: "rgba(17, 17, 20, 0.85)",
        },
        primary: "#F5F5F7",
        secondary: "#A1A1AA",
        muted: "#71717A",
        electric: "#38BDF8",
        violet: {
          DEFAULT: "#A78BFA",
          soft: "#C4B5FD",
          deep: "#8B5CF6",
        },
        coral: {
          DEFAULT: "#FB7185",
          soft: "#FDA4AF",
          deep: "#F43F5E",
        },
        success: {
          DEFAULT: "#4ADE80",
          soft: "#86EFAC",
          deep: "#22C55E",
        },
        apple: {
          blue: "#38BDF8",
          cyan: "#38BDF8",
          green: "#4ADE80",
          amber: "#FBBF24",
          red: "#FB7185",
          gray: {
            text: "#F5F5F7",
            secondary: "#A1A1AA",
            tertiary: "#71717A",
            divider: "rgba(255, 255, 255, 0.10)",
          },
        },
      },
      borderRadius: {
        'apple-sm': '10px',
        'apple-md': '14px',
        'apple-card': '18px',
        'apple-lg': '24px',
        'apple-hero': '28px',
      },
      spacing: {
        '4.5': '1.125rem',
        '18': '4.5rem',
      },
      boxShadow: {
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'apple-card': '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'apple-elevated': '0 16px 36px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      },
      transitionDuration: {
        '120': '120ms',
        '180': '180ms',
        '250': '250ms',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
