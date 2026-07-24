"use client";

import Link from "next/link";
import { Reveal } from "./Primitives";
import { BOOKING_URL } from "@/lib/site";

const reversals = [
  {
    t: "Don't ship it, don't bill it",
    d: "Every stage of the build is scoped and priced separately. If a stage doesn't get delivered, it doesn't appear on an invoice. Written into the agreement, not promised on a call.",
  },
  {
    t: "Fee tied to the number",
    d: "Where the maths supports it, part of our fee moves with the metric we agreed to improve. We'd rather carry some of the risk than argue about it in month four.",
  },
  {
    t: "You own it from day one",
    d: "Accounts, code, list, creative — all in your name from the start. Leaving costs you nothing but the notice period.",
  },
];

export default function FinalCTA() {
  return (
    <section id="book" className="relative overflow-hidden py-28 md:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(820px 460px at 50% 108%, rgba(0,197,81,0.16), transparent 70%)",
        }}
      />

      <div className="shell">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-signal" />
              <span className="eyebrow">Next step</span>
              <span className="h-px w-8 bg-signal" />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="h-display mt-7 text-[2.7rem] text-ink sm:text-[3.6rem] lg:text-[4.2rem]">
              Find the leak.{" "}
              <span className="text-signal">Then decide.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="body-lg mx-auto mt-7 max-w-xl">
              Thirty minutes. We map your acquisition system, name the stage
              costing you the most, and put a number on what closing it is
              worth. You keep the map either way — there is no version of this
              call where you leave with nothing.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-signal shadow-press px-9 py-5 text-[1rem]"
              >
                Book your strategy call
                <svg width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden>
                  <path
                    d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <p className="font-mono text-[0.74rem] uppercase tracking-[0.16em] text-inkFaint">
                We take on three builds a month · No pitch deck · No pressure
              </p>
            </div>
          </Reveal>
        </div>

        {/* Risk reversal */}
        <div className="mt-20 grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift md:grid-cols-3">
          {reversals.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.06}>
              <div className="h-full bg-panel p-8 md:p-10">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-signal/30 bg-signal/[0.07]">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                    <path
                      d="M7.5 1.5 2.5 3.6v4c0 3 2.1 5 5 5.9 2.9-.9 5-2.9 5-5.9v-4L7.5 1.5Z"
                      stroke="#00C551"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.6 7.4 7 8.8l2.6-3"
                      stroke="#00C551"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-6 font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">
                  {r.t}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-inkMute">
                  {r.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Two doors, restated at the close */}
        <Reveal delay={0.1}>
          <div className="mt-8 grid gap-px overflow-hidden rounded-slab bg-hair shadow-lift md:grid-cols-2">
            <div className="bg-pitch p-9 md:p-11">
              <p className="eyebrow">Door one</p>
              <h3 className="mt-4 font-display text-[1.6rem] font-extrabold leading-tight tracking-tightest text-ink">
                We build it for you.
              </h3>
              <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-inkMute">
                Six weeks to first ship. You approve the direction; we do
                everything else and report against cost per customer.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-signal mt-7 w-full shadow-press sm:w-auto"
              >
                Let&apos;s scale your business
              </a>
            </div>
            <div className="bg-pitch p-9 md:p-11">
              <p className="eyebrow">Door two</p>
              <h3 className="mt-4 font-display text-[1.6rem] font-extrabold leading-tight tracking-tightest text-ink">
                You learn to build it.
              </h3>
              <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-inkMute">
                The same teardown methodology, frameworks and templates, taught
                in the open — so the capability stays with you.
              </p>
              <Link href="/learn" className="btn-ghost mt-7 w-full sm:w-auto">
                Start learning
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
