"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FaqItem = { q: string; a: string };

/** One question open at a time. Answers are in the HTML either way, for search engines. */
export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="border-t-2 border-ink">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-ink/15">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
              >
                <span className="font-display text-[1.2rem] font-extrabold leading-tight text-ink transition-colors group-hover:text-greenDeep sm:text-[1.4rem]" style={{ fontStretch: "88%", letterSpacing: "-0.012em" }}>
                  {item.q}
                </span>
                <span aria-hidden className={`relative flex h-9 w-9 shrink-0 items-center justify-center border transition-colors duration-300 ${isOpen ? "border-ink bg-ink text-green" : "border-ink/20 text-ink group-hover:border-ink"}`}>
                  <span className="absolute h-[2px] w-3.5 bg-current" />
                  <span className={`absolute h-3.5 w-[2px] bg-current transition-transform duration-300 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${i}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-[1rem] leading-relaxed text-body sm:pb-7">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
