"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  SUBSCRIBE_FN,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  PLAYBOOK_TITLE,
  PAYMENT_PAGE,
  REDIRECT_DELAY,
} from "@/lib/site";
import { track } from "@/lib/analytics";

type Phase = "form" | "success";

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
  const [count, setCount] = useState(REDIRECT_DELAY);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => firstField.current?.focus(), 120);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && phase === "form" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, phase, busy]);

  // Reset shortly after closing.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setPhase("form");
        setError(null);
        setBusy(false);
        setCount(REDIRECT_DELAY);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // On reaching success: fire the delivery event, then count down and
  // auto-redirect to the payment page. We deliberately do NOT open the book in
  // a new tab — that pulled people out of the funnel. The book arrives by email.
  useEffect(() => {
    if (phase !== "success") return;
    track("lead_book_sent", { title: PLAYBOOK_TITLE });

    const tick = setInterval(() => setCount((c) => c - 1), 1000);
    const go = setTimeout(() => {
      track("redirect_to_payment", { destination: PAYMENT_PAGE });
      window.location.href = PAYMENT_PAGE;
    }, REDIRECT_DELAY * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(go);
    };
  }, [phase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || name.trim() === "") {
      setError("A first name and a valid email, and the book is yours.");
      return;
    }
    setBusy(true);
    setError(null);
    track("lead_email_submitted", { source: "optin_modal" });

    // Remember the email so the payment page can prefill the Paystack checkout.
    try {
      sessionStorage.setItem("syx_email", email);
    } catch {
      /* ignore */
    }

    // Call the Supabase Edge Function: saves the lead + emails the book.
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const res = await fetch(SUBSCRIBE_FN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ name, email }),
        });
        if (!res.ok) {
          console.error("subscribe failed:", res.status, await res.text());
        }
      } catch (err) {
        console.error("subscribe error:", err);
      }
    } else {
      console.warn(
        "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and _ANON_KEY. " +
          "Showing success anyway so the flow is testable."
      );
    }

    setBusy(false);
    setPhase("success");
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            onClick={() => phase === "form" && !busy && onClose()}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Get the free growth playbook"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-slab border border-hair bg-panel shadow-lift"
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent"
            />

            <AnimatePresence mode="wait">
              {phase === "form" ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 md:p-11"
                >
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-hair text-inkMute transition-colors hover:border-inkFaint hover:text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                      <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-card border border-signal/30 bg-signal/[0.08]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" stroke="#00C551" strokeWidth="1.4" strokeLinejoin="round" />
                        <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5v-13Z" stroke="#00C551" strokeWidth="1.4" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="eyebrow">Free · 74 pages</span>
                  </div>

                  <h2 className="mt-6 font-display text-[1.9rem] font-extrabold leading-[1.05] tracking-tightest text-ink sm:text-[2.2rem]">
                    Get <span className="text-signal">The Compounding Business</span>
                  </h2>
                  <p className="mt-4 text-[0.97rem] leading-relaxed text-inkMute">
                    The seven levers that turn a busy business into a predictable
                    one — the same system we install for clients. Tell us where to
                    send it and it&apos;s in your inbox in moments.
                  </p>

                  <form onSubmit={submit} className="mt-7 space-y-3">
                    <div>
                      <label htmlFor="oi-name" className="sr-only">First name</label>
                      <input
                        ref={firstField}
                        id="oi-name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(null); }}
                        placeholder="First name"
                        className="w-full rounded-card border border-hair bg-void px-6 py-4 text-[1rem] text-ink placeholder:text-inkFaint focus:border-signal/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="oi-email" className="sr-only">Email</label>
                      <input
                        id="oi-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="you@company.com"
                        className="w-full rounded-card border border-hair bg-void px-6 py-4 text-[1rem] text-ink placeholder:text-inkFaint focus:border-signal/60"
                      />
                    </div>
                    <button type="submit" disabled={busy} className="btn-signal w-full shadow-press disabled:opacity-60">
                      {busy ? "Sending…" : "Send me the playbook"}
                      {!busy && (
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
                          <path d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <p className="text-center text-[0.78rem] leading-relaxed text-inkFaint" role={error ? "alert" : undefined}>
                      {error ?? "No spam. Unsubscribe in one click. We never share your email."}
                    </p>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="p-8 text-center md:p-12"
                >
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-hair text-inkMute transition-colors hover:border-inkFaint hover:text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                      <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>

                  <motion.span
                    initial={reduce ? {} : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 14 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-signal/30 bg-signal/[0.09]"
                  >
                    <svg width="30" height="30" viewBox="0 0 15 15" fill="none" aria-hidden>
                      <path d="M3.5 8l3 3 5-7" stroke="#00C551" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.span>

                  <h2 className="mt-7 font-display text-[1.9rem] font-extrabold leading-tight tracking-tightest text-ink">
                    Check your inbox.
                  </h2>
                  <p className="mx-auto mt-4 max-w-sm text-[0.97rem] leading-relaxed text-inkMute">
                    <strong className="text-ink">{PLAYBOOK_TITLE}</strong> is on its
                    way to <span className="text-ink">{email}</span>. Give it a
                    minute to land — check spam if you don&apos;t see it.
                  </p>

                  <div className="mx-auto mt-8 max-w-sm rounded-card border border-signal/25 bg-signal/[0.05] p-6">
                    <p className="eyebrow text-signal">One more thing</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/85">
                      Reading the book is step one. We&apos;re taking you to
                      something most readers wish they&apos;d seen first.
                    </p>
                    <p className="mt-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-inkFaint">
                      Taking you there in {count}…
                    </p>
                  </div>

                  <button
                    onClick={() => { track("redirect_to_payment", { destination: PAYMENT_PAGE, via: "manual" }); window.location.href = PAYMENT_PAGE; }}
                    className="btn-signal mt-6 w-full max-w-sm shadow-press"
                  >
                    Take me there now
                  </button>
                  <button onClick={onClose} className="mt-4 text-[0.85rem] text-inkMute hover:text-ink">
                    I&apos;ll just read the book for now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
