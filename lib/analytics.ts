/**
 * Lightweight analytics dispatch.
 *
 * Fires to Google Tag Manager's dataLayer and to gtag if present. If neither
 * is installed yet, it no-ops safely and logs in dev — so the funnel works
 * today and starts reporting the moment you add GTM or GA4, with no code change.
 *
 * The events the funnel fires, in the order a visitor meets them:
 *   booking_page_viewed    → the booking page loaded
 *   application_submitted  → the short form before the calendar was sent
 *   call_booked            → Calendly confirmed a booking  ← the primary conversion
 *   lead_email_submitted   → playbook opt-in form submitted
 *   lead_book_sent         → playbook delivery triggered
 *   payment_page_viewed    → checkout button clicked on the paid offer
 *   purchase_completed     → Paystack payment succeeded
 */

type EventName =
  | "booking_page_viewed"
  | "application_submitted"
  | "call_booked"
  | "lead_email_submitted"
  | "lead_book_sent"
  | "payment_page_viewed"
  | "purchase_completed";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const payload = { event, ...params, ts: Date.now() };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") {
      window.gtag("event", event, params);
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, params);
    }
  } catch {
    /* never let analytics break the flow */
  }
}
