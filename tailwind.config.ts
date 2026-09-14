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
        apple: {
          canvas: "#F5F5F7",
          card: "#FFFFFF",
          border: "#D2D2D7",
          "border-subtle": "rgba(0, 0, 0, 0.08)",
          text: "#1D1D1F",
          secondary: "#86868B",
          tertiary: "#AEAEB2",
          blue: "#0071E3",
          "blue-hover": "#0077ED",
          green: "#34C759",
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
