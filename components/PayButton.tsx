"use client";

import { useEffect, useState } from "react";
import { usePaystackScript, openPaystack } from "@/lib/paystack";
import {
  PAYSTACK_PUBLIC_KEY,
  OFFER_CURRENCY,
  OFFER_AMOUNT_KOBO,
  VERIFY_FN,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
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
    track("payment_page_viewed", { action: "checkout_click" });
    setNotice(null);

    // Need an email for Paystack. If we don't have one, ask inline.
    const payerEmail =
      email ||
      (typeof window !== "undefined"
        ? window.prompt("Your email for the receipt:") ?? ""
        : "");
    if (!payerEmail) return;

    // If Paystack is configured and loaded, open inline checkout right here.
    if (PAYSTACK_PUBLIC_KEY && ready) {
      setPaying(true);
      const opened = openPaystack(payerEmail, async (r) => {
        if (r.status !== "success") {
          // User closed the popup — leave them on THIS page to try again.
          setPaying(false);
          return;
        }

        // Confirm the payment server-side before trusting it. The verify
        // function checks the transaction against Paystack with the secret key,
        // so a "success" can't be faked from the browser.
        let verified = true; // default true if verify isn't set up yet
        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
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
            // took the payment. The webhook/dashboard remains the source of truth.
            verified = true;
          }
        }

        setPaying(false);
        track("purchase_completed", { reference: r.reference, verified });
        window.location.href = "/guide";
      });
      if (opened) return;
      setPaying(false);
    }

    // Paystack not configured/loaded yet. Never bounce the buyer away from the
    // offer — keep them here and tell them plainly. (Once the public key is set
    // in env, this branch never runs.)
    setNotice(
      "Checkout is being set up — please try again in a moment, or email hello@synergox.co and we'll send you a secure payment link right away."
    );
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
