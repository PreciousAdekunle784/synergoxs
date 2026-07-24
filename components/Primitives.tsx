"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Reveal — the single scroll-entrance used site-wide.                  */
/* One consistent motion language beats scattered effects.              */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter — numbers count only when they represent measured movement.  */
/* ------------------------------------------------------------------ */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1500,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(to * eased);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className="num">
      {prefix}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* SectionHead — eyebrow + hairline + display heading.                  */
/* The eyebrow states the objection the section removes.                */
/* ------------------------------------------------------------------ */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : ""}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-signal" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="h-section mt-6 max-w-4xl text-ink">{title}</h2>
      </Reveal>
      {lede && (
        <Reveal delay={0.12}>
          <p
            className={`body-lg mt-6 max-w-2xl ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {lede}
          </p>
        </Reveal>
      )}
    </div>
  );
}
