"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./Primitives";
import BookCTA from "./BookCTA";

/* ------------------------------------------------------------------ *
 * Every clause here is one Ukong confirmed Synergox can actually honour.
 * If you add a fifth, the test is: could a client hold you to it in a
 * document? If not, it belongs in the copy somewhere else, not here.
 * ------------------------------------------------------------------ */
const clauses = [
  {
    t: "Ship it, or it's free.",
    d: "Every stage of the build is scoped, priced and invoiced separately. A stage that doesn't get delivered never reaches an invoice. This isn't a goodwill gesture we'd decide on later — it's a numbered clause in the agreement you sign.",
  },
  {
    t: "Our fee moves with your number.",
    d: "Where the maths supports it, part of what we charge is tied to the one metric we agreed to improve. If that number doesn't move, neither does that portion of the fee. We'd rather carry some of the risk than argue about it in month four.",
  },
  {
    t: "You own everything from day one.",
    d: "Ad accounts, code repositories, email list, CRM, creative files — all in your name from the first week, not transferred at the end if things go well. There is no version of leaving us that involves rebuilding anything.",
  },
  {
    t: "Thirty days' notice. No exit fee.",
    d: "Month-to-month once the build ships. No twelve-month lock-in, no ninety-day notice period, no clawback on work already delivered. If we stop earning the retainer, you should be able to end it that month.",
  },
];

/* Stating the limits makes the promise credible. Don't delete this block. */
const exclusions = [
  {
    t: "A revenue figure",
    d: "We don't control your delivery, your close rate, your pricing or your market. Anyone guaranteeing you a revenue number is either ignoring those or hoping you will.",
  },
  {
    t: "A timeline you delay",
    d: "Six weeks assumes approvals come back inside a few days. If feedback sits for three weeks, the build takes nine. That one's on the calendar, not the contract.",
  },
  {
    t: "Money spent on ad platforms",
    d: "Your media budget goes to Meta and Google, not to us. We can't refund what we never received, and we'd be lying if we implied otherwise.",
  },
];

export default function Guarantee() {
  const reduce = useReducedMotion();

  return (
    <section id="guarantee" className="relative overflow-hidden py-32 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(840px 480px at 22% 12%, rgba(0,197,81,0.085), transparent 68%)",
        }}
      />

      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          {/* Seal + heading */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-signal" />
                <span className="eyebrow">
                  Objection: what if it doesn&apos;t work?
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <motion.div
                animate={reduce ? undefined : { rotate: [0, 360] }}
                transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
                className="mt-10 h-28 w-28"
              >
                <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
                  <defs>
                    <path
                      id="sealArc"
                      d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                    />
                  </defs>
                  <circle
                    cx="60"
                    cy="60"
                    r="56"
                    fill="none"
                    stroke="#232722"
                    strokeWidth="1"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="36"
                    fill="none"
                    stroke="#00C551"
                    strokeWidth="1"
                    strokeDasharray="2 5"
                  />
                  <text
                    className="font-mono"
                    fill="#5F665D"
                    fontSize="8.4"
                    letterSpacing="3.1"
                  >
                    <textPath href="#sealArc" startOffset="0%">
                      SYNERGOX · SHIP IT OR IT&apos;S FREE ·
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="h-section mt-9 text-ink">
                The Ship-It{" "}
                <span className="text-signal">Guarantee.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="body-lg mt-6 max-w-md">
                Most agency guarantees are a sentence on a website that appears
                nowhere in the contract. These four are clauses. You&apos;ll see
                them in the agreement before you sign it, and you can hold us to
                every one.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-8 border-l-2 border-signal pl-5 font-display text-[1.15rem] font-semibold leading-snug tracking-tighter2 text-ink">
                We can offer this because the teardown happens before the quote.
                We only price work we&apos;ve already found the evidence for.
              </p>
            </Reveal>
          </div>

          {/* Clauses */}
          <div>
            <ol className="overflow-hidden rounded-slab border border-hair bg-panel shadow-lift">
              {clauses.map((c, i) => (
                <li
                  key={c.t}
                  className={`group relative p-8 transition-colors duration-500 hover:bg-rail md:p-11 ${
                    i !== clauses.length - 1 ? "border-b border-hair" : ""
                  }`}
                >
                  <Reveal delay={Math.min(i * 0.06, 0.3)}>
                    <div className="flex items-start gap-6">
                      <span className="num mt-1.5 shrink-0 text-[0.72rem] text-signal">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.4rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[1.6rem]">
                          {c.t}
                        </h3>
                        <p className="mt-3 max-w-xl text-[0.97rem] leading-relaxed text-inkMute">
                          {c.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-[2px] w-0 bg-signal transition-all duration-700 group-hover:w-full"
                  />
                </li>
              ))}
            </ol>

            {/* What it doesn't cover — bone, because the palette already means loss */}
            <Reveal delay={0.12}>
              <div className="mt-6 rounded-slab border border-hair bg-pitch p-8 md:p-11">
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-boneDim" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-boneDim">
                    What it does not cover
                  </span>
                </div>
                <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-inkMute">
                  A guarantee with no limits is a marketing line, not a promise.
                  Here is exactly where ours stops — so nothing in it can be
                  quietly walked back later.
                </p>
                <div className="mt-8 grid gap-px overflow-hidden rounded-card bg-hair sm:grid-cols-3">
                  {exclusions.map((e) => (
                    <div key={e.t} className="bg-panel p-6">
                      <div className="flex items-center gap-2.5">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 15 15"
                          fill="none"
                          className="shrink-0 text-boneDim"
                          aria-hidden
                        >
                          <path
                            d="M4 4l7 7M11 4l-7 7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <h4 className="font-display text-[1rem] font-extrabold tracking-tighter2 text-bone">
                          {e.t}
                        </h4>
                      </div>
                      <p className="mt-3 text-[0.85rem] leading-relaxed text-inkFaint">
                        {e.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <BookCTA
                  className="btn-signal shadow-press"
                  label="Get the free growth playbook"
                />
                <p className="max-w-xs text-[0.85rem] leading-relaxed text-inkFaint">
                  The playbook lays the terms out in full. You&apos;ll see the
                  agreement before you commit to anything, not after.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
