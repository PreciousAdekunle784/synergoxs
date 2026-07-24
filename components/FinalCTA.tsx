"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Primitives";
import { BOOKING_URL, FORM_ENDPOINT } from "@/lib/site";

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
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "synergox.co/final-cta" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

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
                className="btn-signal px-9 py-5 text-[1rem]"
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
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-hair md:grid-cols-3">
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

        {/* Email capture */}
        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-hair bg-pitch p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
              <div>
                <p className="eyebrow">Not ready to talk yet</p>
                <h3 className="mt-4 font-display text-[1.6rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[1.9rem]">
                  Get the teardown checklist instead.
                </h3>
                <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-inkMute">
                  The same nine checks we run on a paid engagement, written so
                  you can run them yourself this week. One email, no sequence you
                  have to escape from.
                </p>
              </div>

              {state === "done" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-signal/30 bg-signal/[0.06] p-6"
                >
                  <p className="font-display text-[1.1rem] font-semibold tracking-tighter2 text-ink">
                    Check your inbox.
                  </p>
                  <p className="mt-2 text-[0.9rem] text-inkMute">
                    The checklist is on its way. If it hasn&apos;t arrived in
                    five minutes, look in promotions.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="w-full">
                  <label htmlFor="cta-email" className="sr-only">
                    Work email
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      id="cta-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="you@company.com"
                      className="w-full rounded-full border border-hair bg-void px-6 py-4 text-[0.95rem] text-ink placeholder:text-inkFaint focus:border-signal/50"
                    />
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="btn-signal shrink-0 disabled:opacity-60"
                    >
                      {state === "sending" ? "Sending…" : "Send it to me"}
                    </button>
                  </div>
                  <p
                    className="mt-3 text-[0.78rem] text-inkFaint"
                    role={state === "error" ? "alert" : undefined}
                  >
                    {state === "error"
                      ? "That didn't send. Check the address and try again, or email hello@synergox.co."
                      : "One email. Unsubscribe in one click."}
                  </p>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
