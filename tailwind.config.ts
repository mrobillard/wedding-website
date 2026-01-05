import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        accent: "var(--accent)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        wide: "0.14em",
      },
      boxShadow: {
        "soft-xl": "0 25px 80px rgba(44, 34, 27, 0.12)",
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(120deg, rgba(17, 11, 7, 0.65) 0%, rgba(30, 24, 18, 0.35) 38%, rgba(248, 244, 236, 0.75) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
