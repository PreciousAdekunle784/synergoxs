import type { Metadata } from "next";
import Link from "next/link";
import { PLAYBOOK_TITLE } from "@/lib/site";
import { getContent } from "@/lib/content/get";
import { Check } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Payment received",
  description: "Your growth system build is confirmed. Here's what happens next.",
  robots: { index: false, follow: false },
};

const steps = [
  {
    t: "Check your email",
    d: "A receipt and a short onboarding form are on their way to the address you paid with. The form is how we learn your business, your offer and your numbers.",
  },
  {
    t: "We map your system",
    d: "Within two business days we review what you send and come back with the build plan: the order we'll work in and the first leak we're closing.",
  },
  {
    t: "We build, you approve",
    d: "You approve the direction and we do the rest: offer, funnel, ads, follow-up and tracking. We report against cost per customer as it goes live.",
  },
];

export default async function ThankYouPage() {
  const EMAIL = (await getContent()).contact.email;
  return (
    <>
      <section className="pb-14 pt-[112px] md:pt-[148px]">
        <div className="shell max-w-3xl text-center">
          <span className="mx-auto flex h-16 w-16 animate-rise items-center justify-center rounded-full bg-green text-ink">
            <Check size={30} />
          </span>
          <p className="eyebrow mt-7">Payment received</p>
          <h1 className="h-display mt-4 text-[2.4rem] sm:text-[3.2rem]">
            You&apos;re in. <span className="hl">Let&apos;s build it.</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-xl">
            Your payment is confirmed and your build is booked. This is the
            system laid out in{" "}
            <span className="font-semibold text-ink">{PLAYBOOK_TITLE}</span>,
            except now our team installs it for you. Here&apos;s exactly what
            happens from here.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="shell max-w-3xl">
          <h2 className="eyebrow">What happens next</h2>
          <ol className="mt-5 space-y-3">
            {steps.map((s, i) => (
              <li key={s.t} className="card flex items-start gap-5 p-6 sm:p-7">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-[0.9rem] font-extrabold text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                    {s.t}
                  </h3>
                  <p className="mt-1.5 text-[0.97rem] leading-relaxed text-body">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-card bg-mist p-7 text-center">
            <p className="text-[0.97rem] leading-relaxed text-ink">
              Didn&apos;t get the email within a few minutes? Check spam, then
              reach us at{" "}
              <a href={`mailto:${EMAIL}`} className="link">
                {EMAIL}
              </a>{" "}
              with your payment reference and we&apos;ll sort it straight away.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="btn-outline">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
