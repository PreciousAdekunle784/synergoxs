"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { formatMoney } from "@/lib/money";

/** A money figure that counts up to its value the first time it is seen. */
export default function CountUp({
  minor,
  currency,
  className = "",
  duration = 1.1,
  delay = 0,
}: {
  minor: number;
  currency: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  // Rendered at full value on the server, so the real figure is always in the HTML.
  const [shown, setShown] = useState(minor);
  const started = useRef(false);

  useEffect(() => {
    if (!seen || reduce || started.current) return;
    started.current = true;
    // Count in whole currency units; land exactly on the true value.
    const controls = animate(0, minor, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v / 100) * 100),
      onComplete: () => setShown(minor),
    });
    return () => controls.stop();
  }, [seen, reduce, minor, duration, delay]);

  useEffect(() => {
    if (started.current) setShown(minor);
  }, [minor]);

  return (
    <span ref={ref} className={`num ${className}`}>
      {formatMoney(shown, currency)}
    </span>
  );
}
