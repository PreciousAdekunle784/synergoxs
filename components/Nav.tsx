"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OPTIN_PAGE, SALES_PAGE } from "@/lib/site";
import Brand from "./Brand";
import { useContact } from "./ContactProvider";
import { Arrow } from "./Icons";

/**
 * The header changes with the job of the page.
 *
 *   Opt-in page       logo only. The one thing to do is the form.
 *   Sales page        the sections a buyer jumps between, and the packages button.
 *   Everything else   logo and a contact address: checkout, order, booking, legal.
 */
const salesLinks = [
  { href: "#method", label: "How it works" },
  { href: "#packages", label: "Packages" },
  { href: "#suite", label: "Growth Suite" },
  { href: "#faq", label: "Questions" },
];

export default function Nav() {
  const pathname = usePathname();
  const email = useContact().email;
  const mode = pathname === OPTIN_PAGE ? "optin" : pathname === SALES_PAGE ? "sales" : "focus";
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        solid || open
          ? "border-b border-line bg-paper/95 shadow-[0_8px_24px_-20px_rgba(10,12,10,0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-paper/0"
      }`}
    >
      <div
        className={`shell flex items-center justify-between gap-6 transition-[height] duration-300 ease-out ${
          solid ? "h-[60px]" : "h-[72px]"
        }`}
      >
        <Link href={mode === "sales" ? SALES_PAGE : OPTIN_PAGE} aria-label="SYNERGOX home">
          <Brand priority />
        </Link>

        {mode === "optin" && (
          <p className="eyebrow hidden sm:block">Free guide · No card needed</p>
        )}

        {mode === "focus" && (
          <a href={`mailto:${email}`} className="text-[0.88rem] text-mute transition-colors hover:text-ink">
            <span className="hidden sm:inline">Questions? </span>
            {email}
          </a>
        )}

        {mode === "sales" && (
          <>
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              {salesLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group relative py-2 text-[0.92rem] font-medium text-body transition-colors hover:text-ink"
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-green transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <a href="#packages" className="btn-primary hidden min-h-[44px] px-4 py-2 text-[0.88rem] sm:inline-flex">
                See the packages
                <Arrow />
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="flex h-11 w-11 items-center justify-center rounded-btn border border-ink/15 bg-paper transition-colors hover:border-ink lg:hidden"
              >
                <span className="relative block h-[10px] w-[18px]">
                  <span
                    className={`absolute left-0 top-0 h-[2px] w-full bg-ink transition-transform duration-300 ${
                      open ? "translate-y-[4px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full bg-ink transition-transform duration-300 ${
                      open ? "-translate-y-[4px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {open && mode === "sales" && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
            aria-label="Mobile"
          >
            <div className="shell flex flex-col pb-6 pt-2">
              {salesLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.06 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-[1.3rem] font-extrabold uppercase text-ink transition-colors active:text-greenDeep"
                    style={{ fontStretch: "84%" }}
                  >
                    {l.label}
                    <Arrow className="text-mute" />
                  </a>
                </motion.div>
              ))}
              <a href="#packages" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">
                See the packages
                <Arrow />
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
