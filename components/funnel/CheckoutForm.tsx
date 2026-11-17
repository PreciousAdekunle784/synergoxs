"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/money";
import { track } from "@/lib/analytics";
import { contact, funnelEvent, sessionId } from "@/lib/funnel/client";
import { useContact } from "../ContactProvider";
import { ArrowTile, Lock } from "../Icons";

type Field = "name" | "email" | "phone";

/**
 * Checkout details. Only what's needed to take the payment and send the
 * receipt: the project questions come after, on the order page.
 *
 * Submitting creates the order on the server (which works out the amount
 * itself) and sends the buyer to Paystack's own payment page.
 */
export default function CheckoutForm({
  slug,
  offer,
  amountMinor,
  currency,
}: {
  slug: string;
  offer: "sales_page" | "exit_popup" | "email";
  amountMinor: number;
  currency: string;
}) {
  const support = useContact().email;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ field?: Field; message: string; off?: boolean } | null>(null);

  useEffect(() => {
    // Carry over what they typed when they asked for the Blueprint.
    const saved = contact.read();
    if (saved.email) setEmail(saved.email);
    funnelEvent("checkout_view", { slug });
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const n = name.trim();
    const em = email.trim();
    if (n.length < 2) return setError({ field: "name", message: "Enter your full name." });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setError({ field: "email", message: "Enter a valid email. Your receipt goes there." });

    setBusy(true);
    setError(null);
    contact.save("", em);
    track("begin_checkout", { slug, offer, value: amountMinor / 100, currency });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: n, email: em, phone: phone.trim(), offer, session: sessionId() }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        url?: string;
        error?: string;
        field?: Field;
        code?: string;
      } | null;
      if (!res.ok || !data?.ok || !data.url) {
        setBusy(false);
        setError({
          field: data?.field,
          off: data?.code === "payments_off",
          message: data?.error ?? "We couldn't start your payment. Nothing has been charged. Please try again.",
        });
        return;
      }
      window.location.assign(data.url); // Paystack's secure checkout
    } catch {
      setBusy(false);
      setError({ message: "We couldn't reach the server. Nothing has been charged. Check your connection and try again." });
    }
  }

  const invalid = (f: Field) => (error?.field === f ? { "aria-invalid": true, "aria-describedby": "checkout-error" } : {});

  return (
    <form onSubmit={submit} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor="co-name" className="field-label">Full name</label>
          <input id="co-name" name="name" type="text" autoComplete="name" value={name} maxLength={200}
            onChange={(e) => { setName(e.target.value); setError(null); }} className="field" placeholder="Ada Okafor" {...invalid("name")} />
        </div>
        <div>
          <label htmlFor="co-email" className="field-label">Email address</label>
          <input id="co-email" name="email" type="email" inputMode="email" autoComplete="email" value={email} maxLength={320}
            onChange={(e) => { setEmail(e.target.value); setError(null); }} className="field" placeholder="you@company.com" {...invalid("email")} />
          <p className="mt-1.5 text-[0.82rem] text-mute">Your receipt and your project link are sent here.</p>
        </div>
        <div>
          <label htmlFor="co-phone" className="field-label">
            Phone or WhatsApp <span className="font-normal text-mute">(optional)</span>
          </label>
          <input id="co-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} maxLength={20}
            onChange={(e) => { setPhone(e.target.value); setError(null); }} className="field" placeholder="+234 801 234 5678" {...invalid("phone")} />
        </div>
      </div>

      {error && (
        <div id="checkout-error" role="alert" className="mt-5 border border-[#F1C9C4] bg-[#FEF6F5] p-4 text-[0.92rem] leading-relaxed text-[#8A1C12]">
          <p className="font-semibold">{error.message}</p>
          {error.off && (
            <p className="mt-1.5">
              To pay another way, write to{" "}
              <a href={`mailto:${support}`} className="underline underline-offset-2">{support}</a> and we&apos;ll send you a payment link.
            </p>
          )}
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary btn-lg mt-6 w-full justify-between">
        <span className="text-left">{busy ? "Opening secure payment…" : `Pay ${formatMoney(amountMinor, currency)} securely`}</span>
        <ArrowTile />
      </button>

      <p className="mt-4 flex items-start gap-2 text-[0.82rem] leading-relaxed text-mute">
        <Lock className="mt-[3px]" />
        <span>
          You&apos;ll complete payment on Paystack&apos;s secure page. We never see or store your card details. One-time
          payment: nothing recurring is set up.
        </span>
      </p>
    </form>
  );
}
