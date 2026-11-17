"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatMoney, percentOff } from "@/lib/money";
import { track } from "@/lib/analytics";
import { flags, funnelEvent } from "@/lib/funnel/client";
import type { Bundle, ExitOffer } from "@/lib/funnel/types";
import { ArrowTile, Cross, Included } from "../Icons";

/**
 * The exit offer: the complete Growth Suite, shown once to someone who is
 * about to leave the sales page without buying.
 *
 * WHEN IT MAY APPEAR
 *   • never before the visitor has spent `min_seconds` on the page AND
 *     scrolled `min_scroll_percent` of it (both set in the dashboard);
 *   • never to someone who has bought, has already seen it this visit, or
 *     dismissed it within the last `suppress_days`;
 *   • never on top of another dialog or while a form field is in use;
 *   • only on the sales page — it is not mounted in checkout at all.
 *
 * WHAT COUNTS AS LEAVING
 *   Desktop: the pointer moves up and out through the top edge of the page,
 *            toward the tabs and the address bar.
 *   Touch:   the back button (one history entry is added, so the first
 *            "back" shows the offer and the second leaves as normal), and/or
 *            a fast scroll back up from deep in the page.
 *
 * It can always be closed: the ×, the "no thanks" line, Escape, or a tap
 * outside. Shown, accepted and dismissed are each recorded for the dashboard.
 */
export default function ExitIntent({ offer, bundle, currency }: { offer: ExitOffer; bundle: Bundle; currency: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const accept = useRef<HTMLButtonElement>(null);
  const fired = useRef(false);
  const preview = useRef(false);

  useEffect(() => {
    setMounted(true);
    // "Preview the popup" in the dashboard opens the sales page with this flag:
    // show it straight away, record nothing, and leave no trace on this device.
    if (new URLSearchParams(window.location.search).get("exit_preview") === "1" && bundle.valid) {
      fired.current = true;
      preview.current = true;
      setOpen(true);
    }
  }, [bundle.valid]);

  /* ── deciding when to show it ── */
  useEffect(() => {
    if (!offer.enabled || !bundle.valid) return;
    if (flags.hasPurchased() || flags.exitSeenThisVisit()) return;
    const dismissedAt = flags.exitDismissedAt();
    if (dismissedAt && offer.suppress_days > 0 && Date.now() - dismissedAt < offer.suppress_days * 86_400_000) return;

    const started = Date.now();
    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    let armed = false;
    let deepest = 0; // furthest scroll position reached, in px
    let pushedHistory = false;

    const scrolledPercent = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max <= 0 ? 100 : (deepest / max) * 100;
    };

    const busy = () => {
      const el = document.activeElement;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return true;
      return !!document.querySelector('[role="dialog"][aria-modal="true"], #mobile-menu');
    };

    const fire = (trigger: string) => {
      if (!armed || fired.current || busy()) return;
      fired.current = true;
      flags.markExitSeen(false);
      funnelEvent("exit_popup_shown", { trigger, slug: bundle.slug });
      track("exit_offer_shown", { trigger });
      setOpen(true);
    };

    const arm = () => {
      if (armed) return;
      if (Date.now() - started < offer.min_seconds * 1000) return;
      if (scrolledPercent() < offer.min_scroll_percent) return;
      armed = true;
      // Touch devices: give "back" one extra step, so leaving shows the offer first.
      if (touch && (offer.mobile_trigger === "back" || offer.mobile_trigger === "back_and_scroll")) {
        try {
          history.replaceState({ ...(history.state ?? {}), syxExitBase: true }, "");
          history.pushState({ ...(history.state ?? {}), syxExitBase: false, syxExitTop: true }, "");
          pushedHistory = true;
        } catch {
          /* history unavailable: the scroll trigger still works */
        }
      }
    };

    // Scroll: track depth, arm, and (touch) watch for a fast flick back up.
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      if (y > deepest) deepest = y;
      arm();
      if (touch && armed && (offer.mobile_trigger === "scroll_up" || offer.mobile_trigger === "back_and_scroll")) {
        const dt = Math.max(t - lastT, 1);
        const speed = (lastY - y) / dt; // px per ms, positive = scrolling up
        if (speed > 2.2 && deepest - y > 700 && scrolledPercent() >= 45) fire("scroll_up");
      }
      lastY = y;
      lastT = t;
    };

    // Desktop: the pointer leaves through the top of the viewport.
    const onMouseOut = (e: MouseEvent) => {
      if (touch || !offer.desktop_trigger) return;
      if (e.relatedTarget) return; // moved to another element, not out of the page
      if (e.clientY > 0) return; // left through a side or the bottom
      fire("mouse_exit");
    };

    const onPopState = (e: PopStateEvent) => {
      if (!pushedHistory) return;
      if ((e.state as { syxExitBase?: boolean } | null)?.syxExitBase === true) fire("back");
    };

    const tick = window.setInterval(arm, 1000);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseout", onMouseOut);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("popstate", onPopState);
    };
  }, [offer, bundle.valid, bundle.slug]);

  const dismiss = useCallback(
    (how: string) => {
      setOpen(false);
      if (preview.current) return;
      flags.markExitSeen(true);
      funnelEvent("exit_popup_dismissed", { how, slug: bundle.slug });
      track("exit_offer_dismissed", { how });
    },
    [bundle.slug]
  );

  const take = () => {
    if (preview.current) {
      setOpen(false);
      router.push(`/checkout/${bundle.slug}?offer=exit`);
      return;
    }
    flags.markExitSeen(false);
    funnelEvent("exit_popup_click", { slug: bundle.slug });
    track("exit_offer_accepted", { slug: bundle.slug });
    setOpen(false);
    router.push(`/checkout/${bundle.slug}?offer=exit`);
  };

  /* ── while open: lock scroll, trap focus, Escape closes ── */
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // Focus moves into the dialog without scrolling it: the headline and the
    // close button stay in view when it opens.
    const t = setTimeout(() => accept.current?.focus({ preventScroll: true }), 150);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("escape");
      if (e.key === "Tab" && dialog.current) {
        const els = dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
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
      previous?.focus?.();
    };
  }, [open, dismiss]);

  if (!mounted) return null;

  const pct = percentOff(bundle.total_minor, offer.price_minor);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="fixed inset-0 bg-ink/75 backdrop-blur-[3px]" onClick={() => dismiss("backdrop")} aria-hidden />

          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            aria-describedby="exit-body"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="on-dark relative max-h-[100dvh] w-full max-w-[1040px] overflow-y-auto bg-ink text-white shadow-[0_60px_120px_-40px_rgba(0,0,0,0.7)] sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-slab"
          >
            {/* Pinned to the top of the dialog while its contents scroll, so the
                way out is always on screen. */}
            <div className="sticky top-0 z-20 h-0">
              <span aria-hidden className="block h-1.5 w-full bg-green" />
              <button
                type="button"
                onClick={() => dismiss("close_button")}
                aria-label="Close this offer"
                className="absolute right-3 top-4 flex h-11 w-11 items-center justify-center rounded-btn border border-white/25 bg-ink text-white shadow-[0_6px_20px_rgba(0,0,0,0.5)] transition-colors hover:border-white sm:right-5 sm:top-5"
              >
                <Cross />
              </button>
            </div>
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
            <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(0,197,81,0.3),transparent)] blur-2xl" />

            <div className="relative grid gap-7 px-5 pb-7 pt-9 sm:px-10 sm:pb-10 sm:pt-11 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-10 lg:gap-y-8">
              {/* the case */}
              <div>
                <p id="exit-title" className="h-display pr-14 text-[2.3rem] text-green sm:text-[3.4rem]">
                  {offer.headline}
                </p>
                <h2 className="h-display mt-4 text-[1.55rem] leading-[0.98] sm:text-[2.1rem]">{offer.subheadline}</h2>
                <p id="exit-body" className="mt-5 max-w-xl text-[1rem] leading-relaxed text-ash">
                  {offer.body}
                </p>
              </div>

              {/* everything in it: after the price on a phone, under the headline on desktop */}
              <div className="order-3 lg:order-none lg:col-start-1">
                <p className="eyebrow">Everything included</p>
                <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {bundle.packages.map((p, i) => (
                    <div key={p.id}>
                      <p className="flex items-baseline gap-2">
                        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-green">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-display text-[1.05rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "84%" }}>
                          {p.name}
                        </span>
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {p.deliverables.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-[0.86rem] leading-snug text-ash">
                            <Included className="!mt-[2px] !h-[14px] !w-[14px]" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {bundle.extras.length > 0 && (
                    <div>
                      <p className="flex items-baseline gap-2">
                        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-green">+</span>
                        <span className="font-display text-[1.05rem] font-extrabold uppercase leading-none text-white" style={{ fontStretch: "84%" }}>
                          Working as one
                        </span>
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {bundle.extras.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-[0.86rem] leading-snug text-ash">
                            <Included className="!mt-[2px] !h-[14px] !w-[14px]" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* the price */}
              <div className="is-in order-2 flex flex-col self-start bg-paper p-5 text-ink sm:p-7 lg:sticky lg:top-16 lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-12">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-mute">{bundle.name}</p>
                <dl className="mt-4">
                  {bundle.packages.map((p) => (
                    <div key={p.id} className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/20 py-2.5">
                      <dt className="text-[0.92rem] text-body">{p.name}</dt>
                      <dd className="num font-mono text-[0.95rem] text-ink">{formatMoney(p.price_minor, currency)}</dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-3">
                    <dt className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-mute">Combined individual value</dt>
                    <dd className="strike num font-mono text-[1.1rem] font-medium text-mute">{formatMoney(bundle.total_minor, currency)}</dd>
                  </div>
                </dl>

                <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink">
                  {offer.is_special ? "Your price, this offer only" : "Everything, one payment"}
                </p>
                <p className="num mt-1 font-mono text-[2.7rem] font-medium leading-none tracking-tight text-ink sm:text-[3.6rem]">
                  {formatMoney(offer.price_minor, currency)}
                </p>
                <p className="mt-3 inline-flex items-center gap-2 self-start bg-green px-3 py-2 font-mono text-[0.82rem] font-medium uppercase tracking-[0.04em] text-ink">
                  You save {formatMoney(offer.savings_minor, currency)}
                  {pct > 0 && <span className="opacity-70">· {pct}%</span>}
                </p>
                <p className="mt-3 text-[0.82rem] text-mute">One-time payment. No retainer, no subscription.</p>

                <button ref={accept} type="button" onClick={take} className="btn-primary btn-lg mt-6 w-full justify-between">
                  <span className="text-left">{offer.cta_label}</span>
                  <ArrowTile />
                </button>
                <button
                  type="button"
                  onClick={() => dismiss("no_thanks")}
                  className="mt-4 text-center text-[0.86rem] leading-snug text-mute underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink"
                >
                  {offer.dismiss_label}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
