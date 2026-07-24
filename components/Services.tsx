"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, SectionHead } from "./Primitives";
import { services } from "@/lib/services";



export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="services"
      className="relative border-y border-hair bg-pitch py-28 md:py-36"
    >
      <div className="shell">
        <SectionHead
          eyebrow="Objection: what am I actually buying?"
          title={
            <>
              Eight capabilities.{" "}
              <span className="text-inkFaint">One system they plug into.</span>
            </>
          }
          lede="We rarely sell these individually. The teardown decides which ones your business needs first — the rest wait until they'd actually change a number."
        />

        <div className="mt-14 border-t border-hair">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={s.name} delay={Math.min(i * 0.04, 0.24)}>
                <div className="border-b border-hair">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-5 py-7 text-left md:items-center md:gap-8"
                  >
                    <span className="num mt-1 w-8 shrink-0 text-[0.72rem] text-inkFaint md:mt-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-5">
                        <span
                          className={`font-display text-[1.5rem] font-extrabold leading-tight tracking-tightest transition-colors duration-300 sm:text-[1.85rem] ${
                            isOpen
                              ? "text-signal"
                              : "text-ink group-hover:text-signal"
                          }`}
                        >
                          {s.name}
                        </span>
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-inkFaint">
                          {s.stage}
                        </span>
                      </span>
                      <span className="mt-2 block max-w-2xl text-[0.95rem] leading-relaxed text-inkMute">
                        {s.line}
                      </span>
                    </span>
                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hair transition-all duration-300 md:mt-0 ${
                        isOpen ? "rotate-45 border-signal text-signal" : "text-inkMute"
                      }`}
                      aria-hidden
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M6 1v10M1 6h10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="grid gap-8 pb-9 md:grid-cols-[1fr_0.7fr] md:pl-[3.25rem]">
                          <p className="max-w-xl text-[1rem] leading-relaxed text-ink/80">
                            {s.detail}
                          </p>
                          <div>
                            <p className="eyebrow">Deliverables</p>
                            <ul className="mt-3 space-y-2">
                              {s.deliverables.map((d) => (
                                <li
                                  key={d}
                                  className="flex items-center gap-3 text-[0.88rem] text-inkMute"
                                >
                                  <span className="h-1 w-1 rounded-full bg-signal" />
                                  {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
