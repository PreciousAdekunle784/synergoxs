import type { Metadata } from "next";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Your call is booked",
  description: "Next steps before your Synergox strategy call.",
  robots: { index: false, follow: false },
};

const chapters = [
  "Why 'more traffic' is almost never the answer",
  "The nine checks that locate a leak in under an hour",
  "Writing an offer people can't compare on price",
  "The six follow-up touches most businesses skip",
  "What to measure weekly, and what to ignore entirely",
];

export default function GuidePage() {
  return (
    <section className="pb-28 pt-[140px] md:pb-32 md:pt-[170px]">
      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-signal/30 bg-signal/[0.07] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-signal">
              Call confirmed
            </span>
          </span>
          <h1 className="h-display mt-8 text-[2.6rem] text-ink sm:text-[3.4rem]">
            You&apos;re booked.{" "}
            <span className="text-signal">Here&apos;s the head start.</span>
          </h1>
          <p className="body-lg mx-auto mt-7 max-w-xl">
            Read this before we speak and the call gets twice as useful — you&apos;ll
            already know which stage we&apos;re going to spend the time on.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl border border-hair bg-panel">
          <div className="border-b border-hair p-8 md:p-12">
            <p className="eyebrow">The guide</p>
            <h2 className="mt-4 font-display text-[2rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[2.4rem]">
              Where Your Leads Are Going
            </h2>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-inkMute">
              A short, practical field guide to finding the stage in your
              business that quietly loses the most customers — and fixing it
              without spending another naira on traffic.
            </p>
          </div>

          <ul className="divide-y divide-hair">
            {chapters.map((c, i) => (
              <li key={c} className="flex items-start gap-5 p-8 md:px-12">
                <span className="num mt-0.5 text-[0.72rem] text-inkFaint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[1rem] leading-relaxed text-ink">{c}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-hair p-8 md:p-12">
            {/* Replace href with your hosted PDF once the guide is finalised. */}
            <a href="/guide.pdf" className="btn-signal w-full sm:w-auto" download>
              Download the guide (PDF)
            </a>
            <p className="mt-4 text-[0.8rem] text-inkFaint">
              Also sent to the email address you booked with.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="btn-ghost">
            Back to the site
          </Link>
          <p className="mt-6 text-[0.85rem] text-inkFaint">
            Need to move the call?{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:underline"
            >
              Reschedule here
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
