"use client";

import { Reveal, SectionHead } from "./Primitives";
import { Check } from "./Icons";
import { CASE_STUDY_URL } from "@/lib/site";

/* ------------------------------------------------------------------ *
 * CASE STUDY — EDIT ME
 * Everything here is real and checkable. Keep it that way: add a number
 * only if you can show a screenshot for it.
 * ------------------------------------------------------------------ */
const caseStudy = {
  client: "Kings Food Mart",
  sector: "Grocery & foodstuff retail · Abuja, Nigeria",
  url: CASE_STUDY_URL,
  headline:
    "Fifteen years of reputation, and nowhere online to send a customer who'd heard about it.",
  story: [
    {
      k: "The problem",
      body: "Demand was arriving through WhatsApp and word of mouth, with nowhere to send it. Every enquiry was answered by hand, every order assembled one at a time, and online the brand looked like any other neighbourhood store.",
    },
    {
      k: "What we built",
      body: "A full storefront: category structure, product presentation, a brand story on the homepage and a mobile-first ordering flow designed around how their customers already buy. Tuned to stay fast on Nigerian mobile data.",
    },
    {
      k: "The outcome",
      body: "The store is live, with an ordering path that runs without someone answering every enquiry manually. The brand now presents at the level it was already delivering at.",
    },
  ],
  facts: [
    "Mobile-first ordering flow",
    "Copy, design and engineering by one team",
    "Live and open for you to click through",
  ],
};

export default function Proof() {
  return (
    <section id="results" className="section">
      <div className="shell">
        <SectionHead
          eyebrow="Results"
          title={
            <>
              One build you can click through.{" "}
              <span className="text-mute">Not ten logos you can&apos;t check.</span>
            </>
          }
          lede="A logo wall is unverifiable by design. This project opens in a new tab, and you can walk through every part of it before you decide whether we could do the same for you."
        />

        <Reveal delay={0.1}>
          <article className="mt-12 overflow-hidden rounded-slab border border-line shadow-card">
            <header className="flex flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between md:p-10">
              <div>
                <p className="eyebrow">Case study · {caseStudy.sector}</p>
                <h3 className="mt-3 font-display text-[2rem] font-extrabold leading-none tracking-tightest text-ink sm:text-[2.5rem]">
                  {caseStudy.client}
                </h3>
                <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-body">
                  {caseStudy.headline}
                </p>
              </div>
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark shrink-0"
              >
                Visit the live site
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M3.5 9.5 9.5 3.5M9.5 3.5H4.7M9.5 3.5v4.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </header>

            <div className="grid border-t border-line md:grid-cols-3">
              {caseStudy.story.map((s, i) => (
                <div
                  key={s.k}
                  className={`p-7 md:p-9 ${
                    i > 0 ? "border-t border-line md:border-l md:border-t-0" : ""
                  }`}
                >
                  <p className="flex items-center gap-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-greenDeep">
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    {s.k}
                  </p>
                  <p className="mt-4 text-[0.97rem] leading-relaxed text-body">{s.body}</p>
                </div>
              ))}
            </div>

            <ul className="on-dark grid gap-x-8 gap-y-3 bg-ink px-7 py-6 text-white md:grid-cols-3 md:px-10">
              {caseStudy.facts.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[0.95rem] font-medium text-white">
                  <Check className="mt-1 text-green" />
                  {f}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-[0.9rem] leading-relaxed text-mute">
            Performance data from current engagements is shared on the call,
            under NDA where clients require it. We don&apos;t publish numbers we
            can&apos;t back with a screenshot.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
