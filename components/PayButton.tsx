"use client";

import { useEffect, useState } from "react";
import { usePaystackScript, openPaystack } from "@/lib/paystack";
import {
  PAYSTACK_PUBLIC_KEY,
  PAYMENT_FALLBACK_URL,
  OFFER_CURRENCY,
  OFFER_AMOUNT_KOBO,
} from "@/lib/site";
import { track } from "@/lib/analytics";

function formatPrice(kobo: number, currency: string) {
  const major = kobo / 100;
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: major % 1 === 0 ? 0 : 2,
    }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString()}`;
  }
}

export default function PayButton({
  className = "btn-signal shadow-press",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const ready = usePaystackScript();
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);

  // Prefill the email captured at opt-in, if we have it.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("syx_email");
      if (saved) setEmail(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const price = formatPrice(OFFER_AMOUNT_KOBO, OFFER_CURRENCY);

  function pay() {
    track("payment_page_viewed", { action: "checkout_click" });

    // Need an email for Paystack. If we don't have one, ask inline.
    const payerEmail =
      email || (typeof window !== "undefined" ? window.prompt("Your email for the receipt:") ?? "" : "");
    if (!payerEmail) return;

    if (PAYSTACK_PUBLIC_KEY && ready) {
      setPaying(true);
      const opened = openPaystack(payerEmail, (r) => {
        setPaying(false);
        if (r.status === "success") {
          track("purchase_completed", { reference: r.reference });
          window.location.href = "/guide";
        }
        // On close we simply leave them on the page to try again.
      });
      if (opened) return;
      setPaying(false);
    }

    // Paystack not configured yet → don't dead-end.
    track("redirect_to_payment", { destination: PAYMENT_FALLBACK_URL, reason: "paystack_unset" });
    window.location.href = PAYMENT_FALLBACK_URL;
  }

  return (
    <button onClick={pay} disabled={paying} className={`${className} disabled:opacity-60`}>
      {paying ? "Opening secure checkout…" : label ?? `Secure my build — ${price}`}
      {!paying && (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
