"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SUBSCRIBE_FN,
  SUPABASE_ANON_KEY,
  SUPABASE_IS_SET,
  PLAYBOOK_TITLE,
  PLAYBOOK_PAGES,
  BOOKING_PAGE,
  CALL_MINUTES,
} from "@/lib/site";
import { track } from "@/lib/analytics";
import { Arrow, Check, Cross, Tick } from "./Icons";

type Phase = "form" | "success";

const inside = [
  "The seven levers that make customer flow predictable",
  "How to find the stage losing you the most buyers",
  "The follow-up most businesses never send",
];

/**
 * The playbook opt-in — the fallback conversion for visitors who aren't ready
 * to book a call. Two fields, then a success screen whose one next step is the
 * primary conversion: the free teardown call.
 */
export default function OptIn({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => firstField.current?.focus(), 120);
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
      // Keep Tab inside the dialog.
      if (e.key === "Tab" && dialog.current) {
        const els = dialog.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled])'
        );
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose, busy]);

  // Reset shortly after closing.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase("form");
        setError(null);
        setBusy(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (phase === "success") track("lead_book_sent", { title: PLAYBOOK_TITLE });
  }, [phase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanName = name.trim();
    if (cleanName === "") {
      setError("Add your first name so we know who we're sending it to.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("That email doesn't look right. Check it and try again.");
      return;
    }
    setBusy(true);
    setError(null);
    track("lead_email_submitted", { source: "optin_modal" });

    // Remembered so the booking form and the checkout can prefill.
    try {
      sessionStorage.setItem("syx_email", cleanEmail);
      sessionStorage.setItem("syx_name", cleanName);
    } catch {
      /* ignore */
    }

    // Supabase Edge Function: saves the lead + emails the book via Resend.
    // We advance to success even if this fails so the visitor is never blocked.
    if (SUPABASE_IS_SET) {
      try {
        const res = await fetch(SUBSCRIBE_FN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            meta: { source: "synergox.co/optin", leadMagnet: PLAYBOOK_TITLE },
          }),
        });
        if (!res.ok) {
          console.error("subscribe failed:", res.status, await res.text());
        }
      } catch (err) {
        console.error("subscribe error:", err);
      }
    } else {
      console.warn(
        "Supabase not set — paste SUPABASE_URL + SUPABASE_ANON_KEY in lib/site.ts. " +
          "Showing success anyway so the flow is testable."
      );
    }

    setBusy(false);
    setPhase("success");
  }

  if (!mounted) return null;

  const closeBtn = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-body transition-colors hover:border-ink hover:text-ink"
    >
      <Cross />
    </button>
  );

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="fixed inset-0 bg-ink/60"
            onClick={() => !busy && onClose()}
            aria-hidden
          />

          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="optin-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-t-slab bg-paper shadow-lift sm:rounded-slab"
          >
            <span aria-hidden className="block h-1.5 w-full bg-green" />

            {phase === "form" ? (
              <div className="p-7 sm:p-10">
                {closeBtn}
                <p className="eyebrow">
                  Free playbook · {PLAYBOOK_PAGES} pages
                </p>
                <h2
                  id="optin-title"
                  className="mt-4 pr-8 font-display text-[1.75rem] font-extrabold leading-[1.05] tracking-tightest text-ink sm:text-[2.1rem]"
                >
                  The system we install for clients, written down.
                </h2>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-body">
                  <strong className="font-semibold text-ink">{PLAYBOOK_TITLE}</strong>{" "}
                  walks you through it step by step. Tell us where to send it.
                </p>

                <ul className="mt-5 space-y-2.5">
                  {inside.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[0.93rem] leading-snug text-body">
                      <Tick className="mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>

                <form onSubmit={submit} noValidate className="mt-7 space-y-4">
                  <div>
                    <label htmlFor="oi-name" className="field-label">First name</label>
                    <input
                      ref={firstField}
                      id="oi-name"
                      type="text"
                      autoComplete="given-name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(null); }}
                      placeholder="Ada"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="oi-email" className="field-label">Email</label>
                    <input
                      id="oi-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(null); }}
                      placeholder="you@company.com"
                      className="field"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-[0.88rem] font-medium text-[#B42318]">
                      {error}
                    </p>
                  )}
                  <button type="submit" disabled={busy} className="btn-primary w-full">
                    {busy ? "Sending…" : "Email me the playbook"}
                    {!busy && <Arrow />}
                  </button>
                  <p className="text-center text-[0.8rem] leading-relaxed text-mute">
                    It arrives in a minute or two. No spam, and you can
                    unsubscribe in one click.
                  </p>
                </form>
              </div>
            ) : (
              <div className="p-7 text-center sm:p-10">
                {closeBtn}
                <motion.span
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 15 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green text-ink"
                >
                  <Check size={26} />
                </motion.span>

                <h2
                  id="optin-title"
                  className="mt-6 font-display text-[1.75rem] font-extrabold leading-tight tracking-tightest text-ink sm:text-[2rem]"
                >
                  Check your inbox.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-[0.98rem] leading-relaxed text-body">
                  {PLAYBOOK_TITLE} is on its way to{" "}
                  <span className="font-semibold text-ink [overflow-wrap:anywhere]">{email.trim()}</span>.
                  Give it a minute, and check spam if it hasn&apos;t landed.
                </p>

                <div className="mt-7 rounded-card bg-mist p-6 text-left">
                  <p className="eyebrow">While you wait</p>
                  <p className="mt-3 font-display text-[1.2rem] font-extrabold leading-snug tracking-tighter2 text-ink">
                    The book shows you the system. A teardown shows you where
                    yours is leaking.
                  </p>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-body">
                    {CALL_MINUTES} minutes on your own numbers, free. You keep
                    the findings whether or not we ever work together.
                  </p>
                  <Link href={BOOKING_PAGE} onClick={onClose} className="btn-primary mt-5 w-full">
                    Book my free growth teardown
                    <Arrow />
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 text-[0.9rem] text-mute underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  I&apos;ll read the book first
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
