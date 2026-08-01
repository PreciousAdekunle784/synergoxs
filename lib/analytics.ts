/**
 * Lightweight analytics dispatch.
 *
 * Fires to Google Tag Manager's dataLayer and to gtag if present. If neither
 * is installed yet, it no-ops safely and logs in dev — so the funnel works
 * today and starts reporting the moment you add GTM or GA4, with no code change.
 *
 * The five events the funnel needs:
 *   lead_email_submitted   → opt-in form submitted
 *   lead_book_sent         → book delivery triggered
 *   redirect_to_payment    → visitor sent to the payment step
 *   payment_page_viewed    → payment/apply page loaded
 *   purchase_completed     → call this from your checkout success page
 */

type EventName =
  | "lead_email_submitted"
  | "lead_book_sent"
  | "redirect_to_payment"
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
