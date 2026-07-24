"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Counter, Reveal, SectionHead } from "./Primitives";

/* ------------------------------------------------------------------ *
 * EDIT ME — replace with your verified figures before launch.
 * Every number here should be one you can show a screenshot for.
 * ------------------------------------------------------------------ */
const caseStudy = {
  client: "Kings Food Mart",
  sector: "Grocery & foodstuff retail · Abuja, Nigeria",
  url: "https://kingsfoodstoreabuja.com.ng",
  headline: "A storefront with no path from 'interested' to 'ordered'.",
  tabs: [
    {
      k: "Problem",
      body: "Demand existed and was arriving through WhatsApp and word of mouth, but there was nowhere to send it. Enquiries were answered one at a time, orders were assembled by hand, and the brand looked like every other neighbourhood store online — which meant it competed on price it didn't need to compete on.",
    },
    {
      k: "Strategy",
      body: "Position the store as a premium grocery brand rather than a cheaper one, then give that position somewhere to live. A single conversion path: land, browse by intent, add, order — with the ordering step designed around how customers already buy, not around a generic e-commerce template.",
    },
    {
      k: "Execution",
      body: "A full storefront built and shipped: category architecture, product presentation, a persuasive brand narrative on the homepage, mobile-first ordering flow, and page performance tuned so it stays fast on Nigerian mobile data. Written, designed and engineered in one pass rather than handed between three vendors.",
    },
    {
      k: "Result",
      body: "The store went live at kingsfoodstoreabuja.com.ng with a customer-facing path that runs without manual intervention on every enquiry. The brand now presents at the level it was already delivering at, which is the precondition for charging what it's worth.",
    },
  ],
  metrics: [
    { v: 100, suffix: "%", l: "Mobile-first build", note: "Ordering flow designed for phone-first traffic" },
    { v: 1, suffix: "", l: "Vendor, not three", note: "Copy, design and engineering in one pass" },
    { v: 9, suffix: "", l: "Funnel steps live", note: "From first visit through to repeat order" },
  ],
  quote:
    "It blew her mind — the brand finally looked like what she'd built.",
  quoteAttr: "Owner reaction on delivery",
};

export default function Proof() {
  const [tab, setTab] = useState(0);

  return (
    <section
      id="proof"
      className="relative border-y border-hair bg-pitch py-28 md:py-36"
    >
      <div className="shell">
        <SectionHead
          eyebrow="Objection: has this worked for anyone?"
          title={
            <>
              What a finished system looks like{" "}
              <span className="text-inkFaint">when it ships.</span>
            </>
          }
          lede="We'd rather show one build in full than list ten logos with nothing underneath them."
        />

        <Reveal delay={0.1}>
          <article className="mt-14 overflow-hidden rounded-2xl border border-hair bg-panel">
            <header className="flex flex-col gap-6 border-b border-hair p-8 md:flex-row md:items-end md:justify-between md:p-12">
              <div>
                <p className="eyebrow">{caseStudy.sector}</p>
                <h3 className="mt-4 font-display text-[2rem] font-extrabold leading-none tracking-tightest text-ink sm:text-[2.6rem]">
                  {caseStudy.client}
                </h3>
                <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-inkMute">
                  {caseStudy.headline}
                </p>
              </div>
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost shrink-0"
              >
                Visit the live site
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M3.5 9.5 9.5 3.5M9.5 3.5H4.7M9.5 3.5v4.8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </header>

            <div className="grid md:grid-cols-[0.42fr_0.58fr]">
              {/* Tabs */}
              <div className="border-b border-hair md:border-b-0 md:border-r">
                {caseStudy.tabs.map((t, i) => (
                  <button
                    key={t.k}
                    onClick={() => setTab(i)}
                    aria-expanded={tab === i}
                    className={`relative flex w-full items-center gap-4 border-b border-hair px-8 py-6 text-left transition-colors last:border-b-0 md:px-12 ${
                      tab === i ? "bg-void" : "hover:bg-void/50"
                    }`}
                  >
                    <span className="num text-[0.68rem] text-inkFaint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[1.15rem] font-extrabold tracking-tighter2 transition-colors ${
                        tab === i ? "text-signal" : "text-inkMute"
                      }`}
                    >
                      {t.k}
                    </span>
                    {tab === i && (
                      <motion.span
                        layoutId="case-bar"
                        className="absolute inset-y-0 left-0 w-[2px] bg-signal"
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="body-lg text-ink/85"
                  >
                    {caseStudy.tabs[tab].body}
                  </motion.p>
                </AnimatePresence>

                <blockquote className="mt-10 border-l-2 border-signal pl-6">
                  <p className="font-display text-[1.35rem] font-semibold leading-snug tracking-tighter2 text-ink">
                    &ldquo;{caseStudy.quote}&rdquo;
                  </p>
                  <footer className="eyebrow mt-4">{caseStudy.quoteAttr}</footer>
                </blockquote>
              </div>
            </div>

            <div className="grid gap-px border-t border-hair bg-hair sm:grid-cols-3">
              {caseStudy.metrics.map((m) => (
                <div key={m.l} className="bg-panel p-8 md:p-10">
                  <p className="font-display text-[2.4rem] font-extrabold leading-none tracking-tightest text-signal">
                    <Counter to={m.v} suffix={m.suffix} />
                  </p>
                  <p className="mt-3 text-[0.95rem] font-medium text-ink">
                    {m.l}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-inkFaint">
                    {m.note}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-8 max-w-2xl text-[0.9rem] leading-relaxed text-inkFaint">
            Live campaign performance data from current engagements is shared on
            the call, under NDA where clients require it. We don&apos;t publish
            numbers we can&apos;t attach a screenshot to.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
