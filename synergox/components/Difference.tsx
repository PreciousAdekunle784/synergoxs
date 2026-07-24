"use client";

import { Reveal, SectionHead } from "./Primitives";

const rows = [
  {
    axis: "What you're sold",
    them: "Deliverables. Posts, ads, a redesign",
    us: "A system with a cost per customer you can name",
  },
  {
    axis: "What gets reported",
    them: "Impressions, reach, engagement",
    us: "Cost per booked call, close rate, revenue",
  },
  {
    axis: "Where work starts",
    them: "The channel they happen to specialise in",
    us: "The stage the teardown says is leaking",
  },
  {
    axis: "Who owns the assets",
    them: "Their accounts, their templates, their access",
    us: "Your accounts, your code, your list. Always",
  },
  {
    axis: "Who does the work",
    them: "A junior you never met, once the pitch team leaves",
    us: "The people who were on your first call",
  },
  {
    axis: "Contract shape",
    them: "12 months, cancel with 90 days' notice",
    us: "Scoped build, then monthly. Leave with everything",
  },
  {
    axis: "If a stage doesn't ship",
    them: "It's billed anyway, as hours",
    us: "It isn't billed. Written into the agreement",
  },
];

const process = [
  {
    n: "Discovery",
    t: "Week 1",
    d: "Your numbers, your offer, and an honest look at the last twelve months. Nobody writes a proposal before this happens.",
  },
  {
    n: "Research",
    t: "Week 1–2",
    d: "Customer language, competitor positioning, and where your current traffic actually leaves.",
  },
  {
    n: "Strategy",
    t: "Week 2",
    d: "A written plan naming the stage we fix first, the target number, and what it's worth if we hit it.",
  },
  {
    n: "Execution",
    t: "Week 3–6",
    d: "Offer, funnel, pages, sequences and campaigns built and shipped. Reviewed weekly, not monthly.",
  },
  {
    n: "Optimisation",
    t: "Ongoing",
    d: "One target metric per cycle with a prioritised test queue behind it. Wins get documented.",
  },
  {
    n: "Scaling",
    t: "Ongoing",
    d: "Budget moves toward what returns, the second channel opens, and volume is tested against a ceiling.",
  },
  {
    n: "Reporting",
    t: "Automated",
    d: "One dashboard, always current, showing cost per customer by channel. No monthly slide deck theatre.",
  },
];

export default function Difference() {
  return (
    <section id="difference" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHead
          eyebrow="Objection: aren't you just another agency?"
          title={
            <>
              Same category.{" "}
              <span className="text-inkFaint">
                Completely different deal for you.
              </span>
            </>
          }
        />

        {/* Comparison */}
        <Reveal delay={0.1}>
          <div className="mt-14 overflow-hidden rounded-slab border border-hair shadow-lift">
            <div className="grid grid-cols-[1fr_1fr] border-b border-hair bg-panel md:grid-cols-[0.9fr_1.05fr_1.05fr]">
              <div className="hidden px-8 py-6 md:block">
                <span className="eyebrow">Axis</span>
              </div>
              <div className="px-6 py-6 md:px-8">
                <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-boneDim">
                  Traditional agency
                </span>
              </div>
              <div className="border-l border-hair bg-signal/[0.05] px-6 py-6 md:px-8">
                <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-signal">
                  Synergox
                </span>
              </div>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.axis}
                className={`grid grid-cols-[1fr_1fr] md:grid-cols-[0.9fr_1.05fr_1.05fr] ${
                  i !== rows.length - 1 ? "border-b border-hair" : ""
                }`}
              >
                <div className="col-span-2 px-6 pb-1 pt-6 md:col-span-1 md:px-8 md:py-7">
                  <span className="eyebrow">{r.axis}</span>
                </div>
                <div className="px-6 py-5 md:px-8 md:py-7">
                  <span className="flex gap-3 text-[0.92rem] leading-relaxed text-boneDim">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="mt-[3px] shrink-0"
                      aria-hidden
                    >
                      <path
                        d="M4 4l7 7M11 4l-7 7"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    {r.them}
                  </span>
                </div>
                <div className="border-l border-hair bg-signal/[0.035] px-6 py-5 md:px-8 md:py-7">
                  <span className="flex gap-3 text-[0.92rem] leading-relaxed text-ink">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="mt-[3px] shrink-0 text-signal"
                      aria-hidden
                    >
                      <path
                        d="M3.5 8l3 3 5-7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {r.us}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Process */}
        <div className="mt-28 md:mt-32">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-signal" />
              <span className="eyebrow">
                Objection: so what happens after I book?
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h3 className="h-section mt-6 max-w-3xl text-ink">
              Seven stages.{" "}
              <span className="text-inkFaint">
                Six weeks to the first thing that ships.
              </span>
            </h3>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.n} delay={Math.min(i * 0.05, 0.3)}>
                <div className="group h-full bg-pitch p-8 transition-colors duration-500 hover:bg-panel">
                  <div className="flex items-baseline justify-between">
                    <span className="num text-[0.68rem] text-inkFaint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-signal">
                      {p.t}
                    </span>
                  </div>
                  <h4 className="mt-5 font-display text-[1.3rem] font-extrabold tracking-tightest text-ink">
                    {p.n}
                  </h4>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-inkMute">
                    {p.d}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="hidden bg-pitch lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
