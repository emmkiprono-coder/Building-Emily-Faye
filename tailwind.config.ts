import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: "#0F1B2C",
          mid: "#14253A",
          light: "#1A2A40",
        },
        brass: {
          DEFAULT: "#C49A50",
          light: "#D4AB60",
          dark: "#8B6F3A",
        },
        parchment: "#F4ECD8",
        sand: "#A89878",
        seafoam: "#5DBB97",
        coral: "#E5685B",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
