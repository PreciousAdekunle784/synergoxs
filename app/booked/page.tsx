import type { Metadata } from "next";
import Link from "next/link";
import {
  BOOKING_PAGE,
  CALL_MINUTES,
  EMAIL,
  PLAYBOOK_PAGES,
  PLAYBOOK_TITLE,
  PLAYBOOK_URL,
} from "@/lib/site";
import { Check, Tick } from "@/components/Icons";

export const metadata: Metadata = {
  title: "You're booked",
  description: "Your growth teardown is confirmed. Here's what happens next.",
  robots: { index: false, follow: false },
};

const steps = [
  {
    t: "Accept the calendar invite",
    d: "It's in your inbox now, with the video link inside. If you can't see it within a few minutes, check spam or promotions.",
  },
  {
    t: "Have your rough numbers to hand",
    d: "Monthly ad spend, leads, sales and what an average customer is worth. Estimates are fine. If some of it doesn't exist yet, that's a finding, not a blocker.",
  },
  {
    t: "We do our homework first",
    d: "Before the call we go through your answers and model your funnel, so the conversation opens with what we found rather than twenty minutes of questions.",
  },
];

const chapters = [
  "Why more traffic is almost never the answer",
  "How to find the stage losing you the most buyers",
  "Writing an offer people can't compare on price",
  "The follow-up most businesses never send",
];

export default function BookedPage() {
  return (
    <>
      <section className="pb-14 pt-[112px] md:pt-[148px]">
        <div className="shell max-w-3xl text-center">
          <span className="mx-auto flex h-16 w-16 animate-rise items-center justify-center rounded-full bg-green text-ink">
            <Check size={30} />
          </span>
          <p className="eyebrow mt-7">Call confirmed</p>
          <h1 className="h-display mt-4 text-[2.4rem] sm:text-[3.2rem]">
            You&apos;re booked. <span className="hl">Good call.</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-xl">
            Most owners guess where they&apos;re losing customers. In{" "}
            {CALL_MINUTES} minutes you&apos;ll know, with a number on it. Here&apos;s
            how to get the most from the time.
          </p>
        </div>
      </section>

      <section className="pb-16">
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
        </div>
      </section>

      {/* Head start: keeps them engaged between booking and the call */}
      <section className="pb-20">
        <div className="shell max-w-3xl">
          <div className="on-dark rounded-slab bg-ink p-8 text-white md:p-11">
            <p className="eyebrow">A head start while you wait</p>
            <h2 className="mt-4 font-display text-[1.8rem] font-extrabold leading-[1.08] tracking-tightest sm:text-[2.2rem]">
              Read the playbook before we speak.
            </h2>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ash">
              {PLAYBOOK_TITLE} is the system we install for clients, written
              down. Skim it first and you&apos;ll already know which stage
              we&apos;ll be spending the call on.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {chapters.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[0.95rem] leading-snug text-white">
                  <Tick className="mt-0.5" />
                  {c}
                </li>
              ))}
            </ul>
            <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 w-full sm:w-auto">
              Open the playbook (PDF, {PLAYBOOK_PAGES} pages)
            </a>
          </div>

          <p className="mt-8 text-center text-[0.92rem] leading-relaxed text-mute">
            Need to move the call? Use the reschedule link in your invite, or
            email{" "}
            <a href={`mailto:${EMAIL}`} className="link">
              {EMAIL}
            </a>
            . Haven&apos;t actually picked a time yet?{" "}
            <Link href={BOOKING_PAGE} className="link">
              Book it here
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
