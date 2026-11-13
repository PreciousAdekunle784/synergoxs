"use client";

import { Reveal, SectionHead } from "./Primitives";
import { Check, Cross } from "./Icons";

const rows = [
  {
    axis: "What you're sold",
    them: "Deliverables: posts, ads, a redesign",
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
    us: "The stage the teardown shows is leaking",
  },
  {
    axis: "Who does the work",
    them: "A junior you never met, once the pitch team leaves",
    us: "The people who were on your first call",
  },
  {
    axis: "Who owns the assets",
    them: "Their accounts, their templates, their access",
    us: "Your accounts, your code, your list. Always",
  },
  {
    axis: "The contract",
    them: "Twelve months, ninety days' notice",
    us: "Scoped build, then monthly. Leave with everything",
  },
  {
    axis: "If a stage doesn't ship",
    them: "It's billed anyway, as hours",
    us: "It isn't billed. That's written into the agreement",
  },
];

export default function Difference() {
  return (
    <section id="why" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="Why Synergox"
          title={
            <>
              Same category.{" "}
              <span className="hl">A very different deal for you.</span>
            </>
          }
          lede="If you've hired an agency before, you already know how the usual deal goes. Here's what changes."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-slab border border-line shadow-card">
            {/* Column heads (desktop) */}
            <div className="hidden grid-cols-[0.8fr_1fr_1.1fr] md:grid">
              <div className="px-8 py-5" />
              <div className="px-8 py-5">
                <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-mute">
                  Typical agency
                </span>
              </div>
              <div className="rounded-tl-card bg-ink px-8 py-5">
                <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-white">
                  Synergox
                </span>
              </div>
            </div>

            <div className="divide-y divide-line md:border-t md:border-line">
            {rows.map((r) => (
              <div
                key={r.axis}
                className="md:grid md:grid-cols-[0.8fr_1fr_1.1fr]"
              >
                <div className="px-6 pt-6 md:px-8 md:py-6">
                  <span className="text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-ink md:text-[0.92rem] md:normal-case md:tracking-normal">
                    {r.axis}
                  </span>
                </div>
                <div className="px-6 pt-3 md:px-8 md:py-6">
                  <span className="flex gap-3 text-[0.95rem] leading-relaxed text-mute">
                    <Cross className="mt-[5px]" />
                    <span>
                      <span className="sr-only">Typical agency: </span>
                      {r.them}
                    </span>
                  </span>
                </div>
                <div className="on-dark mx-4 mb-5 mt-3 rounded-2xl bg-ink px-5 py-4 md:m-0 md:rounded-none md:px-8 md:py-6">
                  <span className="flex gap-3 text-[0.95rem] font-medium leading-relaxed text-white">
                    <Check className="mt-1 text-green" />
                    <span>
                      <span className="sr-only">Synergox: </span>
                      {r.us}
                    </span>
                  </span>
                </div>
              </div>
            ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
