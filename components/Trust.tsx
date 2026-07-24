"use client";

import { Reveal, SectionHead } from "./Primitives";

/* ------------------------------------------------------------------ *
 * TESTIMONIALS — EDIT ME
 *
 * Only the first entry is real. The other two are structured placeholders
 * so the layout is ready the moment you have permission to publish.
 *
 * Do not launch with invented quotes. A prospect who checks one and finds
 * nothing behind it will not book, and in Nigeria and the EU a fabricated
 * endorsement is an advertising-standards problem, not just a taste one.
 * Replace or delete — the grid handles one, two or three.
 * ------------------------------------------------------------------ */
const testimonials = [
  {
    real: true,
    quote:
      "It blew her mind — the brand finally looked like what she'd built.",
    context:
      "On delivery of the Kings Food Mart storefront, after fifteen years of the business outrunning how it presented online.",
    name: "Owner, Kings Food Mart",
    role: "Grocery retail · Abuja",
  },
  {
    real: false,
    quote: "PLACEHOLDER — paste a real client quote here.",
    context:
      "PLACEHOLDER — one sentence of situation so the quote has something to push against.",
    name: "Name, Company",
    role: "Sector · City",
  },
  {
    real: false,
    quote: "PLACEHOLDER — paste a real client quote here.",
    context:
      "PLACEHOLDER — one sentence of situation so the quote has something to push against.",
    name: "Name, Company",
    role: "Sector · City",
  },
];

/* These are all true today. Don't add one you can't defend on a call. */
const indicators = [
  {
    t: "Weekly reviews, not monthly",
    d: "You see the numbers while there's still time to act on them, not in a deck four weeks later.",
  },
  {
    t: "The teardown comes first",
    d: "Nobody gets quoted before we've found the leak. We don't price work we can't point at.",
  },
  {
    t: "No junior handoff",
    d: "The people on your first call are the people who build it. There is no B team.",
  },
  {
    t: "We'll turn work down",
    d: "If the numbers say a retainer would cost you more than it returns, we say so and don't quote.",
  },
  {
    t: "NDA on request",
    d: "Client numbers stay private unless they've told us in writing we can publish them.",
  },
  {
    t: "Any market, any currency",
    d: "Remote by default, campaigns run in the market you sell in, calls in your hours.",
  },
];

export default function Trust() {
  const live = testimonials.filter((t) => t.real);

  return (
    <section id="trust" className="relative py-32 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Objection: why should I trust you?"
          title={
            <>
              Trust is a set of terms.{" "}
              <span className="text-inkFaint">Not a set of adjectives.</span>
            </>
          }
          lede="Anyone can call themselves a partner. These are the things you could hold us to in a document, which is the only kind of trust worth anything before we've worked together."
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map((ind, i) => (
            <Reveal key={ind.t} delay={Math.min(i * 0.05, 0.28)}>
              <div className="group h-full bg-panel p-9 transition-colors duration-500 hover:bg-rail">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-signal/25 bg-signal/[0.07]">
                  <svg width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M3.5 8l3 3 5-7"
                      stroke="#00C551"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                  {ind.t}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-inkMute">
                  {ind.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {live.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <p className="eyebrow">In their words</p>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {live.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.08}>
                  <figure className="h-full rounded-slab border border-hair bg-panel p-9 shadow-lift md:p-11">
                    <svg
                      width="26"
                      height="20"
                      viewBox="0 0 26 20"
                      fill="none"
                      className="text-signal/40"
                      aria-hidden
                    >
                      <path
                        d="M0 20V11.6C0 5.2 3.4 1.3 10.1 0l1 2.7C7 4 5 6 5 8.6h4.6V20H0Zm15 0v-8.4C15 5.2 18.4 1.3 25.1 0l1 2.7C22 4 20 6 20 8.6h4.6V20H15Z"
                        fill="currentColor"
                      />
                    </svg>
                    <blockquote className="mt-6 font-display text-[1.5rem] font-semibold leading-snug tracking-tighter2 text-ink sm:text-[1.7rem]">
                      {t.quote}
                    </blockquote>
                    <p className="mt-5 text-[0.95rem] leading-relaxed text-inkMute">
                      {t.context}
                    </p>
                    <figcaption className="mt-7 border-t border-hair pt-5">
                      <span className="block text-[0.95rem] font-medium text-ink">
                        {t.name}
                      </span>
                      <span className="eyebrow mt-1 block">{t.role}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
