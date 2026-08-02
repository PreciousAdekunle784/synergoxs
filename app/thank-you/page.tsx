import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL, PLAYBOOK_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment received — Synergox",
  description: "Your growth system build is confirmed. Here's what happens next.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  const steps = [
    {
      n: "01",
      t: "Check your email",
      d: "A receipt and a short onboarding form are on their way to the address you paid with. The form is how we learn your business, your offer, and your numbers.",
    },
    {
      n: "02",
      t: "We map your system",
      d: "Within two business days we review what you send and come back with the build plan — the exact order we'll work in and the first leak we're closing.",
    },
    {
      n: "03",
      t: "We build, you approve",
      d: "You approve the direction; we do the rest — offer, funnel, ads, follow-up, tracking — and report against cost per customer as it goes live.",
    },
  ];

  return (
    <div className="bg-void">
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(800px 460px at 50% -5%, rgba(0,197,81,0.14), transparent 65%)",
          }}
        />
        <div className="shell max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-signal/30 bg-signal/[0.09]">
            <svg width="30" height="30" viewBox="0 0 15 15" fill="none" aria-hidden>
              <path d="M3.5 8l3 3 5-7" stroke="#00C551" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <p className="mt-8 eyebrow text-signal">Payment received</p>
          <h1 className="mt-5 font-display text-[2.4rem] font-extrabold leading-[1.04] tracking-tightest text-ink md:text-[3.2rem]">
            You&apos;re in. Let&apos;s build your growth system.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-inkMute">
            Your payment is confirmed and your build is booked. This is the same
            system laid out in <span className="text-ink">{PLAYBOOK_TITLE}</span> —
            except now our team installs it for you. Here&apos;s exactly what
            happens from here.
          </p>
        </div>
      </section>

      <section className="border-t border-hair pb-24">
        <div className="shell max-w-2xl">
          <div className="mt-14 space-y-4">
            {steps.map((s) => (
              <div
                key={s.n}
                className="flex items-start gap-5 rounded-slab border border-hair bg-panel p-7 shadow-lift"
              >
                <span className="font-display text-[1.4rem] font-extrabold tracking-tightest text-signal">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                    {s.t}
                  </h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-inkMute">
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-slab border border-signal/25 bg-signal/[0.05] p-8 text-center">
            <p className="text-[0.97rem] leading-relaxed text-ink/85">
              Didn&apos;t get the email within a few minutes? Check spam, then
              reach us at{" "}
              <a href={`mailto:${EMAIL}`} className="text-signal hover:underline">
                {EMAIL}
              </a>{" "}
              with your payment reference and we&apos;ll sort it immediately.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link href="/" className="btn-ghost">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
