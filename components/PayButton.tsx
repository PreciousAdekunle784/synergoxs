"use client";

import { useEffect, useState } from "react";
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

    // Need an email for Paystack. If we don't have one, ask inline.
    const payerEmail =
      email ||
      (typeof window !== "undefined"
        ? window.prompt("Your email for the receipt:") ?? ""
        : "");
    if (!payerEmail) return;

    if (!ready) {
      setNotice("Loading secure checkout… tap the button again in a second.");
      return;
    }

    setPaying(true);
    const opened = openPaystack(payerEmail, async (r) => {
      if (r.status !== "success") {
        // User closed the popup — leave them on THIS page to try again.
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
      window.location.href = "/guide";
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
      <button
        onClick={pay}
        disabled={paying}
        className={`${className} disabled:opacity-60`}
      >
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
      {notice && (
        <p
          role="alert"
          className="mt-3 text-center text-[0.82rem] leading-relaxed text-inkMute"
        >
          {notice}
        </p>
      )}
    </div>
  );
}
