"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BOOKING_PAGE, CALL_MINUTES } from "@/lib/site";

/**
 * Mobile-only sticky bar. Appears once the hero has been passed and hides
 * again over the final CTA so it never sits on top of the real close.
 */
export default function StickyCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.85;
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
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 shadow-[0_-12px_32px_-20px_rgba(10,12,10,0.35)] backdrop-blur-md lg:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[0.98rem] font-extrabold tracking-tighter2 text-ink">
                Free growth teardown
              </p>
              <p className="truncate text-[0.78rem] text-mute">
                {CALL_MINUTES} min · on your numbers
              </p>
            </div>
            <Link
              href={BOOKING_PAGE}
              className="btn-primary min-h-[46px] shrink-0 px-5 py-2.5 text-[0.92rem]"
            >
              Book my call
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
