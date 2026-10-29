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
        canvas: "#000000",
        ink: "#050508",
        surface: {
          DEFAULT: "#0E0E12",
          primary: "#14141A",
          secondary: "#1A1A22",
          tertiary: "#24242E",
          glass: "rgba(18, 18, 24, 0.75)",
        },
        electric: "#2997FF",
        lavender: {
          DEFAULT: "#A78BFA",
          soft: "#C4B5FD",
          deep: "#8B5CF6",
        },
        rose: {
          DEFAULT: "#F43F5E",
          soft: "#FB7185",
          warm: "#FDA4AF",
        },
        apple: {
          blue: "#2997FF",
          cyan: "#38BDF8",
          green: "#34C759",
          amber: "#FF9F0A",
          red: "#FF453A",
          gray: {
            text: "#FFFFFF",
            secondary: "#A1A1A6",
            tertiary: "#6E6E73",
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
