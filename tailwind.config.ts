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
        obsidian: {
          DEFAULT: "#171717",
          50: "#2a2a2a",
          100: "#1f1f1f",
          900: "#0f0f0f",
        },
        ivory: {
          DEFAULT: "#F7F4EE",
          warm: "#F5F2EB",
          light: "#FAF8F5",
        },
        sand: {
          DEFAULT: "#D8C8B5",
          light: "#EAE0D5",
          dark: "#B8A38E",
        },
        olive: {
          DEFAULT: "#666B50",
          light: "#7D8365",
          dark: "#4E523D",
        },
        terracotta: {
          DEFAULT: "#C85A32",
          light: "#DB6D45",
          dark: "#A94723",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(23, 23, 23, 0.05), 0 1px 4px -1px rgba(23, 23, 23, 0.03)",
        elevated: "0 10px 30px -5px rgba(23, 23, 23, 0.08), 0 4px 12px -2px rgba(23, 23, 23, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
