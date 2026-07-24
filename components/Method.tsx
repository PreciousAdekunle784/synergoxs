"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionHead } from "./Primitives";

type Stage = {
  key: string;
  name: string;
  question: string;
  body: string;
  outputs: string[];
  diagram: React.ReactNode;
};

const S = "#00C551";
const line = { stroke: "#2E332D", strokeWidth: 1.2 };

const stages: Stage[] = [
  {
    key: "acquire",
    name: "Acquire",
    question: "Where do qualified strangers come from, on demand?",
    body: "We pick the two channels your buyers already sit in and build a repeatable intake for them — audiences, creative angles, and a spend floor that produces enough data to learn from instead of enough to guess with.",
    outputs: ["Channel selection", "Creative angles", "Audience map", "Spend model"],
    diagram: (
      <svg viewBox="0 0 240 150" className="w-full" aria-hidden>
        {[24, 60, 96, 132, 168, 204].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={22}
            r="4"
            fill={S}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2, delay: i * 0.18, repeat: Infinity }}
          />
        ))}
        {[24, 60, 96, 132, 168, 204].map((x) => (
          <path key={x} d={`M${x},30 C${x},70 120,74 120,110`} fill="none" {...line} />
        ))}
        <circle cx="120" cy="120" r="12" fill="none" stroke={S} strokeWidth="1.6" />
        <circle cx="120" cy="120" r="4" fill={S} />
      </svg>
    ),
  },
  {
    key: "convert",
    name: "Convert",
    question: "What happens in the 40 seconds after they land?",
    body: "The offer gets rewritten before the page gets rebuilt. Then message, page and form are set up as one argument, with the friction removed at the exact points where people currently leave.",
    outputs: ["Offer rewrite", "Landing system", "Objection order", "Form friction audit"],
    diagram: (
      <svg viewBox="0 0 240 150" className="w-full" aria-hidden>
        <rect x="30" y="24" width="76" height="102" rx="6" {...line} fill="none" />
        <rect x="134" y="24" width="76" height="102" rx="6" fill="none" stroke={S} strokeWidth="1.6" />
        {[38, 52, 66, 80].map((y, i) => (
          <rect key={y} x="42" y={y} width={i === 3 ? 30 : 52} height="4" rx="2" fill="#2E332D" />
        ))}
        {[38, 52, 66].map((y, i) => (
          <rect key={y} x="146" y={y} width={i === 2 ? 34 : 52} height="4" rx="2" fill="#3E463C" />
        ))}
        <motion.rect
          x="146" y="92" width="52" height="18" rx="9" fill={S}
          initial={{ opacity: 0.55 }}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <rect x="42" y="100" width="34" height="10" rx="5" fill="#2E332D" />
      </svg>
    ),
  },
  {
    key: "scale",
    name: "Scale",
    question: "What can safely take more money?",
    body: "Only the parts that already return get more budget. We widen the winning angle, add the second channel, and hold the losing half flat instead of averaging everything together and calling it growth.",
    outputs: ["Winner isolation", "Budget rules", "Channel two", "Volume ceiling test"],
    diagram: (
      <svg viewBox="0 0 240 150" className="w-full" aria-hidden>
        <line x1="24" y1="126" x2="216" y2="126" {...line} />
        {[
          [40, 34], [76, 52], [112, 74], [148, 96], [184, 118],
        ].map(([x, h], i) => (
          <motion.rect
            key={x}
            x={x} width="26" rx="3"
            fill={i > 2 ? S : "#2E332D"}
            initial={{ height: 0, y: 126 }}
            whileInView={{ height: h, y: 126 - h }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
    ),
  },
  {
    key: "automate",
    name: "Automate",
    question: "What still needs a human on a Tuesday?",
    body: "Every step that a person repeats becomes a sequence: lead routing, reminders, nurture, reactivation, reporting. The team keeps the conversations and hands the mechanics to the system.",
    outputs: ["Lead routing", "Email sequences", "Booking reminders", "Reporting"],
    diagram: (
      <svg viewBox="0 0 240 150" className="w-full" aria-hidden>
        <circle cx="120" cy="75" r="48" fill="none" {...line} strokeDasharray="4 6" />
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const r = (deg * Math.PI) / 180;
          const x = 120 + Math.cos(r) * 48;
          const y = 75 + Math.sin(r) * 48;
          return (
            <motion.circle
              key={deg} cx={x} cy={y} r="7" fill="#0A0C0A" stroke={S} strokeWidth="1.5"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.4, delay: i * 0.45, repeat: Infinity }}
            />
          );
        })}
        <circle cx="120" cy="75" r="14" fill="none" stroke={S} strokeWidth="1.6" />
        <path d="M114,75l4,4 8-9" fill="none" stroke={S} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "optimize",
    name: "Optimize",
    question: "What gets better this month, and by how much?",
    body: "One number is targeted at a time — cost per booked call, close rate, order value — with a test queue behind it. Wins get written into the system so they hold after the test ends.",
    outputs: ["Test queue", "Single target metric", "Win documentation", "Monthly review"],
    diagram: (
      <svg viewBox="0 0 240 150" className="w-full" aria-hidden>
        <line x1="24" y1="126" x2="216" y2="126" {...line} />
        <path d="M24,96 L72,104 L120,84 L168,58 L216,30" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {[[24,96],[72,104],[120,84],[168,58],[216,30]].map(([x,y],i)=>(
          <motion.circle key={i} cx={x} cy={y} r="4" fill="#050605" stroke={S} strokeWidth="1.6"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.5 }} />
        ))}
        <path d="M24,96 L72,104 L120,110 L168,112 L216,116" fill="none" stroke="#2E332D" strokeWidth="1.4" strokeDasharray="3 5" />
      </svg>
    ),
  },
];

export default function Method() {
  const [active, setActive] = useState(0);
  const s = stages[active];

  return (
    <section id="method" className="relative border-y border-hair bg-pitch py-28 md:py-36">
      <div className="shell">
        <SectionHead
          eyebrow="Objection: what exactly do you do?"
          title={
            <>
              The Synergox Method.{" "}
              <span className="text-inkFaint">Five stages, in order.</span>
            </>
          }
          lede="Each stage answers one question and produces something you can hold. Nothing moves forward until the stage before it is honest."
        />

        {/* Stage rail */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="The Synergox Method stages"
            className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-hair sm:grid-cols-3 lg:grid-cols-5"
          >
            {stages.map((st, i) => {
              const on = i === active;
              return (
                <button
                  key={st.key}
                  role="tab"
                  aria-selected={on}
                  aria-controls="method-panel"
                  onClick={() => setActive(i)}
                  className={`relative px-5 py-6 text-left transition-colors duration-300 ${
                    on ? "bg-panel" : "bg-pitch hover:bg-panel/60"
                  }`}
                >
                  <span className="num text-[0.68rem] text-inkFaint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mt-2 block font-display text-[1.15rem] font-extrabold tracking-tighter2 transition-colors ${
                      on ? "text-ink" : "text-inkMute"
                    }`}
                  >
                    {st.name}
                  </span>
                  {on && (
                    <motion.span
                      layoutId="stage-underline"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-signal"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.14}>
          <div
            id="method-panel"
            role="tabpanel"
            className="mt-px grid gap-10 rounded-xl border border-hair bg-panel p-8 md:grid-cols-[1.25fr_0.75fr] md:p-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[0.78rem] text-signal">
                  {s.question}
                </p>
                <p className="body-lg mt-5 max-w-xl text-ink/85">{s.body}</p>
                <div className="mt-8">
                  <p className="eyebrow">What you get out of this stage</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.outputs.map((o) => (
                      <li
                        key={o}
                        className="rounded-full border border-hair px-4 py-2 text-[0.82rem] text-inkMute"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${s.key}-d`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center rounded-lg border border-hair bg-pitch p-6"
              >
                {s.diagram}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
