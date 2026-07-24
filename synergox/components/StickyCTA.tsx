"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BOOKING_URL } from "@/lib/site";

/**
 * Mobile-only sticky bar. Appears once the hero has been passed and hides
 * again over the final CTA so it never sits on top of the real close.
 */
export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const close = document.getElementById("book");
      const atClose = close
        ? close.getBoundingClientRect().top < window.innerHeight * 0.85
        : false;
      setShow(past && !atClose);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-hair bg-void/90 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[0.95rem] font-extrabold tracking-tighter2 text-ink">
                Find your leak
              </p>
              <p className="truncate font-mono text-[0.66rem] uppercase tracking-[0.14em] text-inkFaint">
                30 min · No pitch
              </p>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-signal px-5 py-3 text-[0.88rem] font-semibold text-void shadow-press"
            >
              Book a call
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
