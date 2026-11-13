"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BOOKING_PAGE } from "@/lib/site";
import { useContact } from "./ContactProvider";
import { Arrow } from "./Icons";

/**
 * Four links, each answering a question a buyer asks before booking.
 * Anything that isn't on that path lives in the footer.
 */
const allLinks = [
  { href: "/#how", label: "How it works" },
  { href: "/#results", label: "Results" },
  { href: "/#guarantee", label: "Guarantee" },
  { href: "/#faq", label: "FAQ" },
];

/** Conversion pages: no navigation at all, so the only way forward is the task. */
export const FOCUS_PATHS = ["/apply", "/booked", "/offer", "/thank-you"];

export default function Nav({ hasResults = true }: { hasResults?: boolean }) {
  const pathname = usePathname();
  const EMAIL = useContact().email;
  const links = allLinks.filter((l) => hasResults || l.href !== "/#results");
  const focus = FOCUS_PATHS.includes(pathname);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation, and on Escape.
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
          solid ? "h-[60px]" : "h-[68px]"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="Synergox home">
          <Image
            src="/logo.png"
            alt=""
            width={34}
            height={34}
            className="rounded-[10px]"
            priority
          />
          <span className="font-display text-[1.1rem] font-extrabold tracking-tighter2 text-ink">
            Synergox
          </span>
        </Link>

        {focus ? (
          <a
            href={`mailto:${EMAIL}`}
            className="text-[0.88rem] text-mute transition-colors hover:text-ink"
          >
            <span className="hidden sm:inline">Questions? </span>
            {EMAIL}
          </a>
        ) : (
          <>
            <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group relative py-2 text-[0.93rem] font-medium text-body transition-colors hover:text-ink"
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-green transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href={BOOKING_PAGE}
                className="btn-primary hidden min-h-[44px] px-5 py-2.5 text-[0.9rem] sm:inline-flex"
              >
                Book a free teardown
                <Arrow />
              </Link>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper transition-colors hover:border-ink lg:hidden"
              >
                <span className="relative block h-[10px] w-[18px]">
                  <span
                    className={`absolute left-0 top-0 h-[2px] w-full rounded-full bg-ink transition-transform duration-300 ${
                      open ? "translate-y-[4px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-ink transition-transform duration-300 ${
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
        {open && !focus && (
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
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.06 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-line py-4 font-display text-[1.25rem] font-semibold tracking-tighter2 text-ink transition-colors active:text-greenDeep"
                  >
                    {l.label}
                    <Arrow className="text-mute" />
                  </Link>
                </motion.div>
              ))}
              <Link
                href={BOOKING_PAGE}
                onClick={() => setOpen(false)}
                className="btn-primary mt-6 w-full"
              >
                Book my free growth teardown
                <Arrow />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
