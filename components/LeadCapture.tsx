"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Primitives";
import { SUBSCRIBE_FN, SUPABASE_ANON_KEY, SUPABASE_IS_SET } from "@/lib/site";

const bullets = [
  "The nine checks that locate a leak in under an hour",
  "Why more traffic almost never fixes a conversion problem",
  "How to write an offer nobody can compare on price",
  "The six follow-up touches most businesses never send",
  "What to measure weekly — and what to ignore entirely",
];

export default function LeadCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
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
    if (!SUPABASE_IS_SET) {
      console.warn("Supabase not set — lead not saved (paste keys in lib/site.ts).");
      setState("done");
      return;
    }
    try {
      const res = await fetch(SUBSCRIBE_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          name,
          email,
          sendBook: false,
          meta: { source: "synergox.co/lead-capture", magnet: "checklist" },
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="checklist"
      className="relative border-y border-hair bg-pitch py-28 md:py-36"
    >
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:items-center">
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-signal" />
                <span className="eyebrow">Before you book</span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="h-section mt-7 max-w-2xl text-ink">
                Run the teardown yourself first.{" "}
                <span className="text-inkFaint">
                  It&apos;s free, and it takes an hour.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="body-lg mt-6 max-w-xl">
                Same nine checks we run on a paid engagement, written so you can
                do them without us. Most people find their leak on check four
                and book the call because of what they found — not because we
                asked.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <ul className="mt-9 space-y-4">
                {bullets.map((b, i) => (
                  <li key={b} className="flex items-start gap-4">
                    <span className="num mt-[3px] text-[0.7rem] text-inkFaint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-ink/85">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.14}>
            <div className="rounded-slab border border-hair bg-panel p-9 shadow-lift md:p-11">
              {state === "done" ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-signal/30 bg-signal/[0.08]">
                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" aria-hidden>
                      <path
                        d="M3.5 8l3 3 5-7"
                        stroke="#00C551"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-7 font-display text-[1.7rem] font-extrabold leading-tight tracking-tightest text-ink">
                    On its way.
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-relaxed text-inkMute">
                    Check your inbox — and promotions, if it&apos;s not there in
                    five minutes. Work through it this week and bring what you
                    find to the call.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={submit}>
                  <p className="eyebrow">Send me the checklist</p>
                  <h3 className="mt-4 font-display text-[1.7rem] font-extrabold leading-tight tracking-tightest text-ink">
                    Where should it go?
                  </h3>

                  <div className="mt-8 space-y-4">
                    <div>
                      <label htmlFor="lc-name" className="sr-only">
                        First name
                      </label>
                      <input
                        id="lc-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="First name"
                        className="w-full rounded-full border border-hair bg-void px-6 py-4 text-[0.95rem] text-ink placeholder:text-inkFaint focus:border-signal/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lc-email" className="sr-only">
                        Work email
                      </label>
                      <input
                        id="lc-email"
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
                    </div>
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="btn-signal w-full shadow-press disabled:opacity-60"
                    >
                      {state === "sending" ? "Sending…" : "Send me the checklist"}
                    </button>
                  </div>

                  <p
                    className="mt-5 text-[0.8rem] leading-relaxed text-inkFaint"
                    role={state === "error" ? "alert" : undefined}
                  >
                    {state === "error"
                      ? "That didn't send. Check the address and try again, or email hello@synergox.co and we'll send it manually."
                      : "One email with the checklist. No sequence you have to escape from, unsubscribe in one click."}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
