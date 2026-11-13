import type { Config } from "tailwindcss";

/**
 * SYNERGOX design tokens — white, black, green.
 *
 * White is the page (≈70%). Black is type, the footer and a small number of
 * emphasis slabs (≈20%). Green is the accent: primary buttons, highlights,
 * icons and focus (≈10%).
 *
 * Two greens on purpose:
 *   green      — fills (buttons, bars, dots). Always carries BLACK text.
 *   greenDeep  — green TEXT on white. `green` on white fails contrast (2.3:1);
 *                greenDeep passes AA (5.5:1).
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // White surfaces
        paper: "#FFFFFF",
        mist: "#F5F6F4",
        line: "#E3E6E1",
        // Black
        ink: "#0A0C0A",
        body: "#454C45",
        mute: "#5E665E",
        // Green
        green: "#00C551",
        greenBright: "#19DB68",
        greenDeep: "#007A35",
        greenTint: "#E9F9EF",
        // Inside black sections
        coal: "#141714",
        lineDark: "#262B26",
        ash: "#A7AFA7",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        tighter2: "-0.03em",
      },
      maxWidth: {
        shell: "1200px",
      },
      borderRadius: {
        card: "20px",
        slab: "28px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,12,10,0.04), 0 12px 32px -18px rgba(10,12,10,0.14)",
        lift: "0 2px 4px rgba(10,12,10,0.04), 0 28px 56px -24px rgba(10,12,10,0.22)",
        cta: "0 10px 24px -12px rgba(0,197,81,0.65)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        mark: {
          from: { backgroundSize: "0% 0.2em" },
          to: { backgroundSize: "100% 0.2em" },
        },
        grow: {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        // CSS-only entrances for above-the-fold content: they run before
        // hydration, so the headline is never held back by JavaScript.
        rise: "rise 0.8s cubic-bezier(0.16,1,0.3,1) both",
        mark: "mark 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s both",
        grow: "grow 1s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
