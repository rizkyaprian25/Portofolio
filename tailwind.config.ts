import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAF9F6",
          subtle: "#F5F5F4",
          card: "#FFFFFF",
          border: "#E7E5E4",
        },
        ink: {
          DEFAULT: "#18181B",
          secondary: "#52525B",
          muted: "#71717A",
          subtle: "#A1A1AA",
        },
        sun: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        botanical: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        sky: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      boxShadow: {
        sunlit: "0 8px 24px -4px rgba(24, 24, 27, 0.04), 0 2px 6px -1px rgba(24, 24, 27, 0.02)",
        "sunlit-hover": "0 16px 32px -6px rgba(24, 24, 27, 0.06), 0 4px 12px -2px rgba(24, 24, 27, 0.03)",
        "sunlit-lg": "0 24px 48px -12px rgba(24, 24, 27, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
