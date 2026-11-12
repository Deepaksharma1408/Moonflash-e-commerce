import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#111827",
          slate: "#1E293B",
          linen: "#FAF8F5",
          sand: "#F3EFEA",
          gold: "#B47B36",
          terracotta: "#C08237",
          border: "#E2E8F0",
          muted: "#64748B",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "Cambria", "serif"],
        sans: ["DM Sans", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        "marquee": "marquee 22s linear infinite",
        "pulse-subtle": "pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

