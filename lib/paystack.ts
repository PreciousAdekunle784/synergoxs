"use client";

import { useEffect, useState } from "react";
import {
  PAYSTACK_PUBLIC_KEY,
  OFFER_AMOUNT_KOBO,
  OFFER_CURRENCY,
  OFFER_LABEL,
} from "@/lib/site";

/**
 * Paystack Popup v2 (@paystack/inline-js via js.paystack.co/v2/inline.js).
 *
 * The whole payment flow starts and finishes ON THIS PAGE — the checkout
 * appears over the offer page and returns control to it on success, with no
 * redirect away. (Paystack always renders its card form in a secure iframe
 * overlay; that's required for PCI compliance — you never handle raw card data.
 * v2 is the closest to "in-page": the user never leaves synergox.co/offer.)
 */

type NewTxnOptions = {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  reference?: string;
  metadata?: Record<string, unknown>;
  onSuccess?: (res: { reference: string }) => void;
  onLoad?: (res: unknown) => void;
  onCancel?: () => void;
  onError?: (err: { message?: string }) => void;
};

type PaystackPopV2 = {
  newTransaction: (opts: NewTxnOptions) => unknown;
};

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopV2;
  }
}

const SRC = "https://js.paystack.co/v2/inline.js";

/** Loads the Paystack v2 script once and reports when it's ready. */
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
    // If the script was already in the DOM and loaded, mark ready.
    if ((script as HTMLScriptElement & { dataset: DOMStringMap }).dataset.loaded) {
      setReady(true);
    }
    script.addEventListener("load", () => (script!.dataset.loaded = "1"));
    return () => script?.removeEventListener("load", onLoad);
  }, []);

  return ready;
}

export type PayResult =
  | { status: "success"; reference: string }
  | { status: "closed" }
  | { status: "error"; message?: string };

/**
 * Opens the Paystack v2 checkout for the given email. Calls onResult when the
 * transaction succeeds, is cancelled, or errors. Returns false immediately if
 * Paystack isn't configured, so the caller can handle that case.
 */
export function openPaystack(
  email: string,
  onResult: (r: PayResult) => void,
): boolean {
  if (typeof window === "undefined" || !window.PaystackPop) return false;
  if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.startsWith("PASTE_")) return false;

  const popup = new window.PaystackPop();
  popup.newTransaction({
    key: PAYSTACK_PUBLIC_KEY,
    email,
    amount: Math.round(OFFER_AMOUNT_KOBO), // integer, kobo
    currency: OFFER_CURRENCY,
    reference: `syx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    metadata: {
      custom_fields: [
        { display_name: "Offer", variable_name: "offer", value: OFFER_LABEL },
        { display_name: "Source", variable_name: "source", value: "synergox.co/offer" },
      ],
    },
    onSuccess: (res) => onResult({ status: "success", reference: res.reference }),
    onCancel: () => onResult({ status: "closed" }),
    onError: (err) => onResult({ status: "error", message: err?.message }),
  });
  return true;
}
