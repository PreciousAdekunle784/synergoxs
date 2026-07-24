"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "/#teardown", label: "Teardown" },
  { href: "/#paths", label: "Two paths" },
  { href: "/services", label: "Done for you" },
  { href: "/learn", label: "Learn it" },
  { href: "/#guarantee", label: "Guarantee" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-hair bg-void/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[68px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Synergox home">
          <Image
            src="/logo.png"
            alt=""
            width={34}
            height={34}
            className="rounded-[9px]"
            priority
          />
          <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-ink">
            Synergox
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.9rem] text-inkMute transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/apply"
            className="hidden rounded-full bg-signal px-5 py-2.5 text-[0.875rem] font-semibold text-void transition-colors hover:bg-[#12E062] sm:inline-flex"
          >
            Book a strategy call
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-hair lg:hidden"
          >
            <span className="relative block h-[9px] w-[18px]">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-ink transition-transform duration-300 ${
                  open ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300 ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-hair bg-void/95 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="shell flex flex-col py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-hair py-4 font-display text-xl font-semibold tracking-tighter2 text-ink last:border-0"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/apply"
                onClick={() => setOpen(false)}
                className="btn-signal mt-5 w-full"
              >
                Book a strategy call
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
