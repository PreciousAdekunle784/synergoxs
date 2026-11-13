"use client";

import BookCall, { CallFacts } from "./CTA";
import { Reveal, SectionHead } from "./Primitives";
import { CALL_MINUTES } from "@/lib/site";

const steps = [
  {
    when: `Day 1 · ${CALL_MINUTES} min`,
    t: "Free teardown call",
    d: "We model your funnel on your real numbers and name the stage losing you the most customers. Nobody writes a proposal before this happens.",
  },
  {
    when: "By week 2",
    t: "A written plan",
    d: "The stage we fix first, the number we're aiming at, and what it's worth if we hit it. You decide with the facts in front of you.",
  },
  {
    when: "Weeks 3–6",
    t: "We build and launch",
    d: "Offer, pages, campaigns and follow-up, built and shipped by the same people who were on your first call. Reviewed with you every week.",
  },
  {
    when: "Monthly · 30-day exit",
    t: "Optimise and scale",
    d: "One target number per cycle. What works gets more budget. You can leave in any month, and you take everything with you.",
  },
];

export default function Process() {
  return (
    <section id="how" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="How it works"
          title={
            <>
              From first call to live system{" "}
              <span className="hl">in about six weeks.</span>
            </>
          }
        />

        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t}>
              <Reveal delay={i * 0.06}>
                {/* Rail: numbered node + connecting line */}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green font-display text-[1rem] font-extrabold text-ink">
                    {i + 1}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </div>
                <p className="mt-5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-greenDeep">
                  {s.when}
                </p>
                <h3 className="mt-2 font-display text-[1.35rem] font-extrabold leading-tight tracking-tighter2 text-ink">
                  {s.t}
                </h3>
                <p className="mt-3 text-[0.96rem] leading-relaxed text-body">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-8 rounded-slab border border-line p-7 md:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="eyebrow">What it takes from you</p>
              <p className="mt-3 font-display text-[1.4rem] font-extrabold leading-snug tracking-tighter2 text-ink sm:text-[1.6rem]">
                About four hours in the first two weeks. Then one 45-minute
                call a week.
              </p>
              <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-body">
                We write, design, build and run it. You approve the direction
                and answer the questions only you can answer. The six weeks
                assumes approvals come back within a few days.
              </p>
            </div>
            <div className="lg:text-right">
              <BookCall label="Start with the free teardown" className="w-full sm:w-auto" />
              <CallFacts className="mt-3" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
