"use client";

import Link from "next/link";
import { Reveal } from "./Primitives";

const reminders = [
  "Ship it or it's free",
  "Fee tied to the number",
  "You own it from day one",
  "Thirty days' notice",
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
              <Link
                href="/apply"
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
              </Link>
              <p className="font-mono text-[0.74rem] uppercase tracking-[0.16em] text-inkFaint">
                We take on three builds a month · No pitch deck · No pressure
              </p>
            </div>
          </Reveal>
        </div>

        {/* Risk reversal — the full terms live in the guarantee section */}
        <Reveal delay={0.08}>
          <div className="mt-16 rounded-slab border border-hair bg-panel p-7 shadow-lift md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
                {reminders.map((r) => (
                  <li
                    key={r}
                    className="flex items-center gap-2.5 text-[0.92rem] text-ink/85"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="shrink-0 text-signal"
                      aria-hidden
                    >
                      <path
                        d="M3.5 8l3 3 5-7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>
              <a
                href="#guarantee"
                className="shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-signal hover:underline"
              >
                Read the full terms ↑
              </a>
            </div>
          </div>
        </Reveal>

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
              <Link
                href="/apply"
                className="btn-signal mt-7 w-full shadow-press sm:w-auto"
              >
                Let&apos;s scale your business
              </Link>
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
