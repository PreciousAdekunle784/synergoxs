import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — warm-shifted blacks so the page reads as graphite, not void
        void: "#050605",
        pitch: "#0A0C0A",
        panel: "#101310",
        rail: "#171B17",
        hair: "#232722",
        // Signal — reserved for measurable movement only
        signal: "#00C551",
        signalDim: "#0A8F41",
        // Bone — the "old way" / traditional-agency chroma
        bone: "#E9E5DA",
        boneDim: "#9C978A",
        // Text
        ink: "#F2F4F1",
        inkMute: "#9AA298",
        inkFaint: "#5F665D",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter2: "-0.03em",
      },
      maxWidth: {
        shell: "1240px",
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        flow: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        sweep: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        drift: "drift 7s ease-in-out infinite",
        flow: "flow 2.6s linear infinite",
        sweep: "sweep 9s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
