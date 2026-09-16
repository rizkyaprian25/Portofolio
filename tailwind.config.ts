import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          canvas: "#F5F5F7",
          "canvas-dark": "#000000",
          card: "#FFFFFF",
          "card-dark": "#161617",
          "card-dark-secondary": "#1C1C1E",
          border: "#D2D2D7",
          "border-dark": "#2C2C2E",
          "border-subtle": "rgba(0, 0, 0, 0.08)",
          "border-subtle-dark": "rgba(255, 255, 255, 0.08)",
          text: "#1D1D1F",
          "text-dark": "#F5F5F7",
          secondary: "#86868B",
          "secondary-dark": "#A1A1A6",
          tertiary: "#AEAEB2",
          "tertiary-dark": "#636366",
          blue: "#0071E3",
          "blue-hover": "#0077ED",
          "blue-dark": "#2997FF",
          green: "#34C759",
          "green-dark": "#30D158",
          orange: "#FF9500",
          purple: "#AF52DE",
          indigo: "#5856D6",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        "apple-card": "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
        "apple-hover": "0 14px 34px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)",
        "apple-float": "0 20px 40px -8px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        "apple-card": "20px",
        "apple-lg": "24px",
        "apple-xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
