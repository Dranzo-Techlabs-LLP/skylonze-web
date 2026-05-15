import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#06030F",
          800: "#0B0618",
          700: "#120A26",
          600: "#1A0F38",
        },
        ink: {
          50: "#F5F0FF",
          200: "#CDBEEF",
          400: "#9885C7",
          500: "#7B6AAE",
          600: "#5B4D8A",
        },
        violet: {
          100: "#EADBFF",
          300: "#C5A6FF",
          400: "#A87BFF",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#4C1D95",
          900: "#2E1065",
        },
        neon: {
          purple: "#B57BFF",
          pink: "#FF7BD5",
          cyan: "#7BEAFF",
          lime: "#C5FF7B",
        },
        success: "#34D399",
        danger: "#F87171",
        warn: "#FBBF24",
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(168, 123, 255, 0.45)",
        "glow-lg": "0 0 60px rgba(168, 123, 255, 0.55)",
        "glow-pink": "0 0 32px rgba(255, 123, 213, 0.45)",
        "glow-cyan": "0 0 32px rgba(123, 234, 255, 0.45)",
        "inner-glow": "inset 0 0 20px rgba(168,123,255,0.25)",
      },
      backgroundImage: {
        "violet-radial":
          "radial-gradient(120% 80% at 50% 0%, rgba(124,58,237,0.45) 0%, rgba(6,3,15,0.0) 60%)",
        "grid-violet":
          "linear-gradient(rgba(168,123,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,123,255,0.07) 1px, transparent 1px)",
        "shimmer":
          "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-fast": "float 5s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3.5s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        "shimmer": "shimmer 2.4s linear infinite",
        "marquee": "marquee 35s linear infinite",
        "glow-breathe": "glowBreathe 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowBreathe: {
          "0%,100%": { boxShadow: "0 0 16px rgba(168,123,255,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(168,123,255,0.75)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
