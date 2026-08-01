"use client";

import { useEffect, useState } from "react";
import {
  PAYSTACK_PUBLIC_KEY,
  OFFER_AMOUNT_KOBO,
  OFFER_CURRENCY,
  OFFER_LABEL,
} from "@/lib/site";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: PaystackOptions) => { openIframe: () => void };
    };
  }
}

type PaystackOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  metadata?: Record<string, unknown>;
  callback: (res: { reference: string }) => void;
  onClose: () => void;
};

const SRC = "https://js.paystack.co/v1/inline.js";

/** Loads the Paystack inline script once and reports when it's ready. */
export function usePaystackScript() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.PaystackPop) {
      setReady(true);
      return;
    }
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    const onLoad = () => setReady(true);
    script.addEventListener("load", onLoad);
    return () => script?.removeEventListener("load", onLoad);
  }, []);

  return ready;
}

export type PayResult =
  | { status: "success"; reference: string }
  | { status: "closed" };

/**
 * Opens the Paystack popup for the given email. Resolves when the popup
 * closes or a payment succeeds. Returns false immediately if Paystack isn't
 * configured, so the caller can fall back gracefully.
 */
export function openPaystack(
  email: string,
  onResult: (r: PayResult) => void,
): boolean {
  if (typeof window === "undefined" || !window.PaystackPop) return false;
  if (!PAYSTACK_PUBLIC_KEY) return false;

  const handler = window.PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(OFFER_AMOUNT_KOBO), // must be an integer (kobo)
    currency: OFFER_CURRENCY,
    ref: `syx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    // custom_fields is what makes the info visible on the Paystack dashboard.
    metadata: {
      custom_fields: [
        {
          display_name: "Offer",
          variable_name: "offer",
          value: OFFER_LABEL,
        },
        {
          display_name: "Source",
          variable_name: "source",
          value: "synergox.co/offer",
        },
      ],
    },
    callback: (res) => onResult({ status: "success", reference: res.reference }),
    onClose: () => onResult({ status: "closed" }),
  });
  handler.openIframe();
  return true;
}
