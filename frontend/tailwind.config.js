/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#0B0F19",
          card: "#111827",
          panel: "#161F30",
          border: "#1F293D",
        },
        cyber: {
          cyan: "#06B6D4",
          cyanGlow: "#22D3EE",
          purple: "#8B5CF6",
          blue: "#3B82F6",
        },
        trust: {
          safe: "#10B981",
          safeGlow: "#34D399",
          warning: "#F59E0B",
          danger: "#EF4444",
          dangerGlow: "#F87171",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
