"use client";

import { Reveal, SectionHead } from "./Primitives";

const symptoms = [
  {
    t: "Two good weeks. Then the phone stops.",
    d: "You can't hire on that rhythm, can't forecast on it, and can't sleep on it. Feast and famine isn't a season your business goes through. It's a symptom.",
  },
  {
    t: "Your best month is a mystery.",
    d: "Revenue jumped and nobody can say why. Ask five people, get five answers. What you can't explain, you can't repeat — so you're sat waiting for another accident.",
  },
  {
    t: "You're buying clicks for a page that can't close.",
    d: "Spend gets judged on cost per click while the page it lands on quietly loses 96 of every 100 visitors. You're paying the full price and collecting four percent of it.",
  },
  {
    t: "Every customer costs more than the last one.",
    d: "Same offer, same creative, a bigger bill each quarter. Nothing downstream improved, so the auction takes the difference — and that gap compounds while you wait.",
  },
  {
    t: "You quit on buyers who were nearly ready.",
    d: "Most people who would have bought needed six more touches. They got one. So they bought from whoever was still in front of them in week three.",
  },
  {
    t: "A buyer can't tell you apart from the four beside you.",
    d: "When positioning is generic, price becomes the only thing left to compare. You end up defending a number instead of making a case.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-28 md:py-36">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              eyebrow="Objection: so why isn't it working?"
              title={
                <>
                  You already paid for the customers{" "}
                  <span className="text-inkFaint">you never got.</span>
                </>
              }
              lede={
                <>
                  Most of them are still sitting in your funnel. There was
                  never a shortage of activity — posts, ads, a redesign,
                  someone&apos;s cousin running Meta. What&apos;s missing is the
                  connective tissue: a path a stranger can walk from first
                  impression to paid invoice without falling through a gap.
                  Read the six below slowly. You&apos;ll recognise at least
                  three.
                </>
              }
            />
            <Reveal delay={0.2}>
              <p className="mt-8 border-l-2 border-signal pl-5 font-display text-[1.25rem] font-semibold leading-snug tracking-tighter2 text-ink">
                None of this is bad luck. Every one of them is a leak with a
                street address — findable, priceable, and closable in weeks.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift sm:grid-cols-2">
            {symptoms.map((s, i) => (
              <li key={s.t} className="bg-pitch">
                <Reveal delay={i * 0.05}>
                  <div className="group h-full p-7 transition-colors duration-500 hover:bg-panel">
                    <span className="num text-[0.7rem] text-inkFaint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 font-display text-[1.12rem] font-semibold leading-snug tracking-tighter2 text-ink">
                      {s.t}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-inkMute">
                      {s.d}
                    </p>
                    <span className="mt-5 block h-px w-0 bg-signal transition-all duration-500 group-hover:w-12" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
