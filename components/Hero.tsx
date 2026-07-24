"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SystemPanel from "./SystemPanel";

const lines = [
  [{ t: "Your competitors aren't", g: false }],
  [{ t: "outspending you.", g: false }],
  [
    { t: "They're ", g: false },
    { t: "out-converting", g: true },
    { t: " you.", g: false },
  ],
];

export default function Hero() {
  const reduce = useReducedMotion();

  const rise = (i: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: { y: "0%" },
    transition: {
      duration: 1,
      delay: 0.15 + i * 0.07,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  });

  return (
    <section className="relative overflow-hidden pb-24 pt-[124px] md:pb-32 md:pt-[150px]">
      {/* Ambient field — one drifting light source, nothing else */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(760px 420px at 78% 12%, rgba(0,197,81,0.11), transparent 68%), radial-gradient(640px 500px at 8% 88%, rgba(0,197,81,0.05), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #232722 1px, transparent 1px), linear-gradient(to bottom, #232722 1px, transparent 1px)",
          backgroundSize: "78px 78px",
          maskImage:
            "radial-gradient(900px 560px at 50% 22%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(900px 560px at 50% 22%, black, transparent 80%)",
        }}
      />

      <div className="shell grid items-center gap-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="eyebrow">Revenue architects · Not an ad agency</span>
          </motion.div>

          <h1 className="h-display mt-7 text-[2.75rem] text-ink sm:text-[3.6rem] lg:text-[4.15rem]">
            {lines.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.07em]">
                <motion.span className="block" {...rise(li)}>
                  {line.map((part, i) => (
                    <span key={i} className={part.g ? "text-signal" : ""}>
                      {part.t}
                    </span>
                  ))}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="body-lg mt-8 max-w-xl"
          >
            Ninety-six out of every hundred people who reach your site leave
            without buying. We find the one stage where most of them go, close
            it, and hand you an acquisition system with a cost per customer you
            can forecast. Same traffic. Same budget.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.58 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/apply" className="btn-signal shadow-press">
              Book a strategy call
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                <path
                  d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a href="#teardown" className="btn-ghost">
              Find your leak first
            </a>
          </motion.div>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.72 }}
            className="mt-5 max-w-md text-[0.85rem] leading-relaxed text-inkFaint"
          >
            30 minutes, no pitch deck. You leave with the map of your acquisition
            system whether or not we work together.
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <SystemPanel />
        </motion.div>
      </div>

      {/* Capability strip — what we build on, stated plainly */}
      <div className="shell mt-24 md:mt-28">
        <div className="hair-rule" />
        <div className="flex flex-wrap items-center gap-x-10 gap-y-5 py-7">
          <span className="eyebrow shrink-0">Systems we build on</span>
          {[
            "Meta Ads",
            "Google Ads",
            "Shopify",
            "Klaviyo",
            "GA4",
            "Next.js",
            "HubSpot",
          ].map((p) => (
            <span
              key={p}
              className="font-mono text-[0.78rem] tracking-wide text-inkFaint transition-colors hover:text-inkMute"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="hair-rule" />
      </div>
    </section>
  );
}
