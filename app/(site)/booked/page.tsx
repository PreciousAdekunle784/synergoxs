import type { Metadata } from "next";
import Link from "next/link";
import { BLUEPRINT_FILE, BLUEPRINT_FILENAME, BLUEPRINT_PAGES, BLUEPRINT_TITLE, BOOKING_PAGE, CALL_MINUTES, SALES_PAGE } from "@/lib/site";
import { Arrow, Check, Download, Included } from "@/components/Icons";
import { getContent } from "@/lib/content/get";

export const metadata: Metadata = {
  title: "You're booked",
  description: "Your call is confirmed. Here's what happens next.",
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
    d: "Before the call we go through your answers, so the conversation opens with what we found rather than twenty minutes of questions.",
  },
];

const chapters = [
  "How to find the stage losing you the most buyers",
  "The five-second test your page has to pass",
  "The four parts of an offer people act on",
  "A 12-point scorecard for your whole system",
];

export default async function BookedPage() {
  const EMAIL = (await getContent()).contact.email;
  return (
    <>
      <section className="pb-14 pt-[112px] md:pt-[148px]">
        <div className="shell max-w-3xl">
          <span className="flex h-12 w-12 animate-rise items-center justify-center bg-green text-ink">
            <Check size={24} />
          </span>
          <p className="eyebrow mt-7">Call confirmed</p>
          <h1 className="h-display mt-4 text-[2.6rem] sm:text-[3.6rem]">
            You&apos;re booked. <span className="accent accent-green">Good call.</span>
          </h1>
          <p className="lede mt-5 max-w-xl">
            Most owners guess where they&apos;re losing customers. In {CALL_MINUTES} minutes you&apos;ll know which part
            of your system to fix first. Here&apos;s how to get the most from the time.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="shell max-w-3xl">
          <h2 className="eyebrow">What happens next</h2>
          <ol className="mt-5 border-t-2 border-ink">
            {steps.map((s, i) => (
              <li key={s.t} className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-ink/15 py-6">
                <span className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-mute sm:pt-1">Step {i + 1}</span>
                <div>
                  <h3 className="font-display text-[1.3rem] font-extrabold leading-tight text-ink" style={{ fontStretch: "86%" }}>
                    {s.t}
                  </h3>
                  <p className="mt-1.5 text-[0.97rem] leading-relaxed text-body">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* A head start: keeps them engaged between booking and the call */}
      <section className="pb-20">
        <div className="shell max-w-3xl">
          <div className="on-dark rounded-slab bg-ink p-8 text-white md:p-11">
            <p className="eyebrow">A head start while you wait</p>
            <h2 className="h-section mt-4 !text-[2rem] sm:!text-[2.5rem]">
              Read the Blueprint <span className="accent accent-green">before we speak.</span>
            </h2>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ash">
              {BLUEPRINT_TITLE} is {BLUEPRINT_PAGES} pages on where businesses lose customers they&apos;ve already paid
              for. Do the scorecard first and you&apos;ll already know which part we&apos;ll spend the call on.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {chapters.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[0.95rem] leading-snug text-white">
                  <Included />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={BLUEPRINT_FILE} download={BLUEPRINT_FILENAME} className="btn-primary">
                <Download /> Download the Blueprint (PDF)
              </a>
              <Link href={SALES_PAGE} className="btn-outline">
                See the growth packages <Arrow />
              </Link>
            </div>
          </div>

          <p className="mt-8 text-[0.92rem] leading-relaxed text-mute">
            Need to move the call? Use the reschedule link in your invite, or email{" "}
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
