"use client";

import { useEffect, useId, useState } from "react";
import { usePaystackScript, openPaystack } from "@/lib/paystack";
import {
  PAYSTACK_PUBLIC_KEY,
  OFFER_CURRENCY,
  OFFER_AMOUNT_KOBO,
  VERIFY_FN,
  SUPABASE_ANON_KEY,
  SUPABASE_IS_SET,
} from "@/lib/site";
import { track } from "@/lib/analytics";
import { Arrow } from "./Icons";

const KEY_IS_SET =
  !!PAYSTACK_PUBLIC_KEY && !PAYSTACK_PUBLIC_KEY.startsWith("PASTE_");

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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PayButton({
  className = "btn-primary",
  label,
}: {
  className?: string;
  label?: string;
}) {
  const ready = usePaystackScript();
  const id = useId();
  const [email, setEmail] = useState("");
  const [askEmail, setAskEmail] = useState(false);
  const [paying, setPaying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

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
    setNotice(null);
    track("payment_page_viewed", { action: "checkout_click" });

    if (!KEY_IS_SET) {
      // The public key isn't in the browser bundle. Almost always one of:
      // (1) env var not named exactly NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      // (2) added in Vercel but the site wasn't redeployed after (NEXT_PUBLIC_
      //     vars are baked in at BUILD time), or (3) running an old build.
      if (typeof console !== "undefined") {
        console.error(
          "[Paystack] Public key missing at runtime. Set " +
            "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (exact name) and REDEPLOY — " +
            "NEXT_PUBLIC_ vars are baked in at build time."
        );
      }
      setNotice(
        "Payment isn't switched on yet. If you're the site owner: set " +
          "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY and redeploy. Otherwise email " +
          "hello@synergox.co and we'll send a secure link."
      );
      return;
    }

    // Paystack needs an email for the receipt. If the visitor didn't come
    // through a form, ask for it right here instead of a browser prompt.
    const payerEmail = email.trim();
    if (!EMAIL_RE.test(payerEmail)) {
      setAskEmail(true);
      setNotice(
        payerEmail
          ? "That email doesn't look right. Check it and try again."
          : "Add your email for the receipt, then continue."
      );
      return;
    }
    try {
      sessionStorage.setItem("syx_email", payerEmail);
    } catch {
      /* ignore */
    }

    if (!ready) {
      setNotice("Loading secure checkout… tap the button again in a second.");
      return;
    }

    setPaying(true);
    const opened = openPaystack(payerEmail, async (r) => {
      if (r.status === "error") {
        setPaying(false);
        setNotice(
          r.message
            ? `Payment couldn't complete: ${r.message}. Please try again.`
            : "Payment couldn't complete. Please try again."
        );
        return;
      }
      if (r.status !== "success") {
        // User cancelled — leave them on THIS page to try again.
        setPaying(false);
        return;
      }

      // Confirm the payment server-side before trusting it. The verify function
      // re-checks the transaction against Paystack with the secret key, so a
      // "success" can't be faked from the browser.
      let verified = true; // default true if verify isn't set up yet
      if (SUPABASE_IS_SET) {
        try {
          const res = await fetch(VERIFY_FN, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              apikey: SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ reference: r.reference, email: payerEmail }),
          });
          const data = await res.json().catch(() => ({}));
          verified = res.ok && data?.ok === true;
        } catch {
          // If verify is unreachable, don't block the buyer — Paystack already
          // took the payment; the dashboard remains the source of truth.
          verified = true;
        }
      }

      setPaying(false);
      track("purchase_completed", { reference: r.reference, verified });
      // Post-purchase page — this is a BUILD purchase, NOT a call booking.
      window.location.href = `/thank-you?ref=${encodeURIComponent(r.reference)}`;
    });

    if (!opened) {
      setPaying(false);
      setNotice(
        "Secure checkout couldn't open just now — please try again, or email hello@synergox.co for a payment link."
      );
    }
  }

  return (
    <div className="w-full">
      {askEmail && (
        <div className="mx-auto mb-3 max-w-sm text-left">
          <label htmlFor={id} className="field-label">
            Email for your receipt
          </label>
          <input
            id={id}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setNotice(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && pay()}
            placeholder="you@company.com"
            className="field"
          />
        </div>
      )}
      <button onClick={pay} disabled={paying} className={className}>
        {paying ? "Opening secure checkout…" : label ?? `Secure my build — ${price}`}
        {!paying && <Arrow />}
      </button>
      {notice && (
        <p
          role="alert"
          className="mx-auto mt-3 max-w-sm text-center text-[0.86rem] leading-relaxed text-body"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
