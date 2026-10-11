import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4F0",
        ink: "#1A1A1A",
        electric: "#4229E8",
        stickerYellow: "#FFD02C",
        // CV
        cvCyan: "#98EBE9",
        cvPurple: "#7978E3",
        cvBack: "#4229E8",
        // Portfolio
        pfPink: "#E9A0D9",
        pfCoral: "#F06B76",
        pfBack: "#D8455C",
        // Demo
        dmLavender: "#BCAAF5",
        dmBlue: "#4229E8",
        dmBack: "#2E1CA8",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
