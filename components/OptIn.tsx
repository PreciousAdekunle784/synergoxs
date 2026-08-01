"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FORM_ENDPOINT,
  PLAYBOOK_URL,
  PLAYBOOK_TITLE,
  PAYMENT_URL,
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

  // Focus + lock scroll while open
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => firstField.current?.focus(), 120);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && phase === "form" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, phase]);

  // Reset when closed
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

  // Success countdown → redirect to payment
  useEffect(() => {
    if (phase !== "success") return;

    track("lead_book_sent", { title: PLAYBOOK_TITLE });

    // Trigger the download/open of the book in a new tab
    const a = document.createElement("a");
    a.href = PLAYBOOK_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.click();

    const tick = setInterval(() => setCount((c) => c - 1), 1000);
    const go = setTimeout(() => {
      track("redirect_to_payment", { destination: PAYMENT_URL });
      window.location.href = PAYMENT_URL;
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

    try {
      await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          source: "synergox.co/optin",
          leadMagnet: PLAYBOOK_TITLE,
        }),
      });
      // We advance regardless — the visitor still gets the book and the next
      // step, and the lead is retried client-side below if the POST failed.
    } catch {
      /* swallow — see note above */
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
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-void/85 backdrop-blur-sm"
            onClick={() => phase === "form" && onClose()}
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
            {/* top signal line */}
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
                    way to <span className="text-ink">{email}</span>. It should also
                    have opened in a new tab — if not,{" "}
                    <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-signal hover:underline">
                      grab it here
                    </a>
                    .
                  </p>

                  <div className="mx-auto mt-8 max-w-sm rounded-card border border-signal/25 bg-signal/[0.05] p-6">
                    <p className="eyebrow text-signal">While the email lands</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/85">
                      Reading the book is step one. If you&apos;d rather we build the
                      system with you, we&apos;re taking you to the next step now.
                    </p>
                    <p className="mt-4 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-inkFaint">
                      Continuing in {count}…
                    </p>
                  </div>

                  <a href={PAYMENT_URL} className="mt-6 inline-block text-[0.85rem] text-inkMute hover:text-ink">
                    Take me there now →
                  </a>
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
