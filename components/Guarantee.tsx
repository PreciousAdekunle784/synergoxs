"use client";

import BookCall, { CallFacts } from "./CTA";
import { Mark, Reveal, Stagger, StaggerItem, type HeadCopy } from "./Primitives";
import Eyebrow from "./Eyebrow";
import { Cross } from "./Icons";

/* ------------------------------------------------------------------ *
 * Every clause here is one Synergox has confirmed it can honour.
 * If you add a fifth, the test is: could a client hold you to it in a
 * document? If not, it belongs in the copy somewhere else, not here.
 * ------------------------------------------------------------------ */
const clauses = [
  {
    t: "Ship it, or it's free.",
    d: "Every stage of the build is scoped, priced and invoiced separately. A stage that doesn't get delivered never reaches an invoice.",
  },
  {
    t: "Our fee moves with your number.",
    d: "Where the maths supports it, part of what we charge is tied to the one metric we agreed to improve. If that number doesn't move, neither does that part of the fee.",
  },
  {
    t: "You own everything from day one.",
    d: "Ad accounts, code, email list, CRM, creative files. All in your name from the first week, not handed over at the end if things go well.",
  },
  {
    t: "Thirty days' notice. No exit fee.",
    d: "Month-to-month once the build ships. No twelve-month lock-in and no clawback on work already delivered.",
  },
];

/* Stating the limits makes the promise credible. Don't delete this block. */
const exclusions = [
  {
    t: "A revenue figure",
    d: "We don't control your delivery, your pricing or your market. Be careful with anyone who promises you a number.",
  },
  {
    t: "A timeline you delay",
    d: "Six weeks assumes approvals come back within a few days. If feedback sits for three weeks, the build takes nine.",
  },
  {
    t: "Money spent on ad platforms",
    d: "Your media budget goes to Meta and Google, not to us. We can't refund what we never received.",
  },
];

export default function Guarantee({ copy }: { copy: HeadCopy }) {
  return (
    <section id="guarantee" className="section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <Eyebrow>The Ship-It Guarantee</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h-section mt-5">
                {copy.title} <Mark>{copy.accent}</Mark>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-5 max-w-md">{copy.lede}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-md border-l-[3px] border-green pl-5 text-[1rem] font-medium leading-relaxed text-ink">
                We can offer this because the teardown comes before the quote.
                We only price work we&apos;ve already found the evidence for.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 hidden lg:block">
                <BookCall />
                <CallFacts className="mt-3" />
              </div>
            </Reveal>
          </div>

          <div>
            <Stagger as="ol" className="grid gap-4 sm:grid-cols-2">
              {clauses.map((c, i) => (
                <StaggerItem as="li" key={c.t}>
                  <div className="card card-hover card-accent h-full p-7">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green font-display text-[0.9rem] font-extrabold text-ink">
                      {i + 1}
                    </span>
                    <h3 className="mt-5 font-display text-[1.3rem] font-extrabold leading-tight tracking-tighter2 text-ink">
                      {c.t}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-body">{c.d}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.1}>
              <div className="mt-4 rounded-card bg-mist p-7">
                <p className="eyebrow">What it doesn&apos;t cover</p>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-body">
                  A guarantee with no limits is a marketing line. Here is
                  exactly where ours stops, so nothing in it can be quietly
                  walked back later.
                </p>
                <ul className="mt-6 grid gap-6 sm:grid-cols-3">
                  {exclusions.map((e) => (
                    <li key={e.t}>
                      <p className="flex items-start gap-2 text-[0.95rem] font-semibold text-ink">
                        <Cross className="mt-[5px] text-mute" />
                        {e.t}
                      </p>
                      <p className="mt-2 text-[0.86rem] leading-relaxed text-mute">{e.d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* On phones the ask comes after the clauses, not before them */}
            <div className="mt-8 lg:hidden">
              <BookCall className="w-full sm:w-auto" />
              <CallFacts className="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
