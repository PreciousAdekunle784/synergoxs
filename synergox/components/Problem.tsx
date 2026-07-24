"use client";

import { Reveal, SectionHead } from "./Primitives";

const symptoms = [
  {
    t: "Leads arrive in waves, never in a line",
    d: "Two good weeks, then silence. You can't hire, forecast or commit to anything on that rhythm.",
  },
  {
    t: "Nobody can name what actually worked",
    d: "Revenue moved last quarter. The reason lives in someone's head, so it can't be repeated on purpose.",
  },
  {
    t: "Traffic goes to a page that was never built to sell",
    d: "Ad spend is judged on click cost while the page it lands on quietly loses 96 out of every 100 visitors.",
  },
  {
    t: "Cost per customer climbs every quarter",
    d: "The same offer, the same creative, a rising bill. Nothing downstream improved, so the auction takes the difference.",
  },
  {
    t: "The follow-up ends after one email",
    d: "Most people who were going to buy needed six more touches. They didn't get them, so they bought elsewhere.",
  },
  {
    t: "You sound like the four competitors beside you",
    d: "When positioning is generic, price becomes the only variable a buyer can compare you on.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="relative py-28 md:py-36">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              eyebrow="Objection: why isn't it working?"
              title={
                <>
                  Most businesses don&apos;t have a marketing problem.{" "}
                  <span className="text-inkFaint">
                    They have an unfinished system.
                  </span>
                </>
              }
              lede={
                <>
                  There is usually no shortage of activity — posts, ads, a
                  redesign, someone&apos;s cousin running Meta. What&apos;s
                  missing is the connective tissue between those parts: a path a
                  stranger can walk from first impression to paying customer
                  without falling through a gap.
                </>
              }
            />
            <Reveal delay={0.2}>
              <p className="mt-8 border-l-2 border-signal pl-5 font-display text-[1.25rem] font-semibold leading-snug tracking-tighter2 text-ink">
                Every one of these is a leak with a location. Leaks can be
                found, priced and closed.
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
