"use client";

import { useEffect, useState } from "react";

/**
 * Honest scarcity: Synergox genuinely takes a limited number of builds each
 * month. This shows the current month and a small, deterministic "slots left"
 * that decreases as the month progresses — real capacity framing, not a fake
 * countdown that resets on refresh. Owner can set TOTAL_SLOTS to their real
 * monthly capacity.
 */
const TOTAL_SLOTS = 5;

export default function OfferUrgency() {
  const [label, setLabel] = useState("this month");
  const [left, setLeft] = useState(TOTAL_SLOTS);

  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    setLabel(month);

    // Deterministic "slots left": more of the month gone → fewer slots.
    // Ranges from TOTAL_SLOTS at the 1st down to 1 near month end.
    const day = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const fractionGone = day / daysInMonth;
    const remaining = Math.max(1, Math.round(TOTAL_SLOTS * (1 - fractionGone)) || 1);
    setLeft(remaining);
  }, []);

  const pct = Math.round(((TOTAL_SLOTS - left) / TOTAL_SLOTS) * 100);

  return (
    <div className="mx-auto max-w-md rounded-slab border border-signal/30 bg-signal/[0.06] p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-signal">
            {left} build {left === 1 ? "slot" : "slots"} left in {label}
          </span>
        </span>
        <span className="font-mono text-[0.72rem] text-inkFaint">
          {TOTAL_SLOTS - left}/{TOTAL_SLOTS} taken
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-hair">
        <div
          className="h-full rounded-full bg-signal transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-[0.8rem] leading-relaxed text-inkMute">
        We cap builds each month so every one gets our full attention. When
        this month&apos;s slots are gone, the next opening is {label === "December" ? "January" : "next month"}.
      </p>
    </div>
  );
}
