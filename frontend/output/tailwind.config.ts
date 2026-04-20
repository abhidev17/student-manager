import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "sans-serif"],
      },
      colors: {
        zinc: {
          950: "#09090b",
        },
      },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-up":    "fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":    "fadeIn 0.3s ease both",
        "spin-slow":  "spin 2s linear infinite",
        shimmer:      "shimmer 1.8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)"    },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },
      boxShadow: {
        glow:      "0 0 28px rgba(99,102,241,0.35)",
        "glow-lg": "0 0 48px rgba(99,102,241,0.45)",
        card:      "0 4px 24px rgba(0,0,0,0.4)",
        "card-lg": "0 16px 60px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":   "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config;
