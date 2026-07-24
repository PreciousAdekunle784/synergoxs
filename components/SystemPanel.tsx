"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const stages = [
  { label: "Traffic", value: 12400, rate: null },
  { label: "Landing page", value: 4712, rate: "38.0%" },
  { label: "Lead captured", value: 1131, rate: "24.0%" },
  { label: "Call booked", value: 214, rate: "18.9%" },
  { label: "Customer", value: 61, rate: "28.5%" },
];

const spark = [
  22, 26, 24, 31, 29, 36, 34, 41, 46, 43, 52, 58, 55, 64, 71, 69, 78, 84, 92,
  97,
];

export default function SystemPanel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % stages.length), 1400);
    return () => clearInterval(t);
  }, [reduce]);

  const max = stages[0].value;
  const path = spark
    .map((v, i) => {
      const x = (i / (spark.length - 1)) * 260;
      const y = 58 - (v / 100) * 50;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="glass relative rounded-slab shadow-lift p-5 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/50 to-transparent"
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Sample system view</p>
          <p className="mt-2 font-display text-[1.35rem] font-extrabold tracking-tighter2 text-ink">
            Acquisition pipeline
          </p>
        </div>
        <div className="rounded-full border border-signal/25 bg-signal/[0.08] px-3 py-1.5">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-signal">
            Live
          </span>
        </div>
      </div>

      <div className="mt-7 space-y-[14px]">
        {stages.map((s, i) => {
          const w = Math.max(9, (s.value / max) * 100);
          const isActive = active === i;
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={`text-[0.83rem] transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-inkMute"
                  }`}
                >
                  {s.label}
                </span>
                <span className="flex items-baseline gap-3">
                  {s.rate && (
                    <span className="num text-[0.7rem] text-inkFaint">
                      {s.rate}
                    </span>
                  )}
                  <span
                    className={`num text-[0.83rem] transition-colors duration-300 ${
                      isActive ? "text-signal" : "text-ink"
                    }`}
                  >
                    {s.value.toLocaleString("en-US")}
                  </span>
                </span>
              </div>
              <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-rail">
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: `${w}%` }}
                  transition={{
                    duration: 1.1,
                    delay: 0.6 + i * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`h-full rounded-full transition-colors duration-500 ${
                    isActive ? "bg-signal" : "bg-signalDim/55"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 border-t border-hair pt-6">
        <div>
          <p className="eyebrow">Cost per customer</p>
          <p className="mt-2 font-display text-[1.9rem] font-extrabold tracking-tightest text-ink">
            <span className="num">$41.80</span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-[0.7rem] text-signal">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
              <path
                d="M4.5 8V1M4.5 1 1 4.5M4.5 1 8 4.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            37% lower than month one
          </p>
        </div>
        <div>
          <p className="eyebrow">Trailing 20 days</p>
          <svg
            viewBox="0 0 260 62"
            className="mt-3 w-full"
            role="img"
            aria-label="Cost per customer trending down over twenty days"
          >
            <defs>
              <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C551" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#00C551" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${path} L260,62 L0,62 Z`} fill="url(#sparkFill)" />
            <motion.path
              d={path}
              fill="none"
              stroke="#00C551"
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.9, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </div>

      <p className="mt-5 text-[0.72rem] leading-relaxed text-inkFaint">
        Illustrative figures. Your real numbers get modelled on the call.
      </p>
    </div>
  );
}
