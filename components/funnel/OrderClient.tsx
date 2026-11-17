"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";
import { flags } from "@/lib/funnel/client";

/**
 * Runs once on a confirmed order: remembers on this device that the visitor
 * has bought (so the exit offer never shows to them again) and reports the
 * purchase to analytics. The order itself was confirmed on the server.
 */
export function PurchaseConfirmed({ reference, value, currency, item }: { reference: string; value: number; currency: string; item: string }) {
  useEffect(() => {
    flags.markPurchased();
    try {
      const key = `syx_tracked_${reference}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* report it anyway */
    }
    track("purchase_completed", { transaction_id: reference, value, currency, item });
  }, [reference, value, currency, item]);
  return null;
}

/**
 * While a payment is still being confirmed (bank transfers can take a few
 * minutes), ask the server again every few seconds, then stop and say so.
 */
export function CheckAgain({ every = 7000, times = 12 }: { every?: number; times?: number }) {
  const router = useRouter();
  const count = useRef(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      count.current += 1;
      if (count.current > times) {
        clearInterval(t);
        setDone(true);
        return;
      }
      router.refresh();
    }, every);
    return () => clearInterval(t);
  }, [router, every, times]);

  return (
    <p className="mt-4 flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mute" aria-live="polite">
      {!done && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-green" />
          <span className="relative h-2 w-2 rounded-full bg-green" />
        </span>
      )}
      {done ? "Stopped checking. Use the button to check again." : "Checking with Paystack every few seconds…"}
    </p>
  );
}
