"use client";

import { useState } from "react";
import { Reveal, SectionHead } from "@/components/Primitives";

type Cur = "USD" | "NGN";
const CUR: Record<Cur, { sym: string; mult: number; locale: string }> = {
  USD: { sym: "$", mult: 1, locale: "en-US" },
  NGN: { sym: "₦", mult: 1500, locale: "en-NG" },
};

const plans = [
  {
    id: "dfy",
    name: "Done For You",
    description: "We build and run the entire acquisition system for you.",
    basePrice: 5000,
    period: " / month",
    popular: true,
    features: [
      "Growth strategy & offer architecture",
      "Funnel design and engineering",
      "Paid acquisition, managed end to end",
      "Conversion optimisation, monthly",
      "Direct-response copywriting",
    ],
    // TODO: Replace with actual Paystack payment links
    checkoutUrl: "https://paystack.com/pay/YOUR_DFY_LINK_HERE",
    cta: "Start Done For You",
  },
  {
    id: "diy",
    name: "Learn The System",
    description: "Master the frameworks and build it yourself with our guidance.",
    basePrice: 997,
    period: " one-time",
    popular: false,
    features: [
      "The full teardown methodology",
      "Offer and positioning frameworks",
      "Funnel templates you can clone",
      "Live workshops and teardowns",
      "Private community of operators",
    ],
    // TODO: Replace with actual Paystack payment links
    checkoutUrl: "https://paystack.com/pay/YOUR_DIY_LINK_HERE",
    cta: "Start Learning",
  },
];

export default function PaymentPage() {
  const [cur, setCur] = useState<Cur>("USD");
  const m = CUR[cur].mult;

  const formatMoney = (n: number) =>
    `${CUR[cur].sym}${Math.round(n * m).toLocaleString(CUR[cur].locale)}`;

  return (
    <main className="min-h-screen bg-void pb-24 pt-32 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(1000px 600px at 50% 0%, rgba(0,197,81,0.06), transparent 100%)",
        }}
      />

      <div className="shell relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHead
            eyebrow="Next Steps"
            title={
              <>
                Ready to <span className="text-signal">scale?</span>
              </>
            }
            lede="Your playbook is on the way. Choose how you want to work with us to implement the system and start growing."
          />

          <div className="mt-8 flex justify-center">
            <div className="flex rounded-full border border-hair bg-panel p-1 shadow-lift">
              {(["USD", "NGN"] as Cur[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCur(c)}
                  className={`rounded-full px-5 py-2 font-mono text-[0.8rem] transition-colors ${
                    cur === c
                      ? "bg-signal text-void"
                      : "text-inkFaint hover:text-inkMute"
                  }`}
                  aria-pressed={cur === c}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-10">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-slab border p-8 md:p-10 ${
                  plan.popular
                    ? "border-signal/50 bg-panel/80 shadow-[0_0_40px_rgba(0,197,81,0.1)]"
                    : "border-hair bg-panel/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-signal px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-void">
                    Most Popular
                  </div>
                )}

                <h3 className="font-display text-[1.8rem] font-bold tracking-tightest text-ink">
                  {plan.name}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-inkMute">
                  {plan.description}
                </p>

                <div className="mt-8 flex items-baseline gap-1">
                  <span className="font-display text-[2.8rem] font-bold text-ink">
                    {formatMoney(plan.basePrice)}
                  </span>
                  <span className="text-[1rem] text-inkMute">{plan.period}</span>
                </div>

                <div className="mt-8 flex-1 border-t border-hair pt-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[0.92rem] text-ink/90"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 15 15"
                          fill="none"
                          className="mt-1 shrink-0 text-signal"
                          aria-hidden
                        >
                          <path
                            d="M3.5 8l3 3 5-7"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.checkoutUrl}
                  className={`mt-10 block text-center transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                    plan.popular
                      ? "btn-signal shadow-press"
                      : "rounded-card bg-pitch py-4 text-[1rem] font-semibold text-ink shadow-sm ring-1 ring-inset ring-hair hover:bg-pitch/80"
                  }`}
                >
                  {plan.cta}
                </a>

                <p className="mt-4 flex items-center justify-center gap-2 text-center font-mono text-[0.7rem] text-inkFaint">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                    <rect
                      x="2.5"
                      y="5.5"
                      width="10"
                      height="7"
                      rx="1.5"
                      stroke="currentColor"
                    />
                    <path d="M5.5 5.5v-2a2 2 0 1 1 4 0v2" stroke="currentColor" />
                  </svg>
                  Secure payment via Paystack
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
