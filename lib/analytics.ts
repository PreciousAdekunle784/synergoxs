/**
 * Marketing analytics dispatch.
 *
 * Fires to Google Tag Manager's dataLayer and to gtag if present. If neither
 * is installed it does nothing, so the funnel works today and starts
 * reporting the moment GTM or GA4 is added, with no code change.
 *
 * (The dashboard's own numbers don't come from here: they are recorded
 * first-party by TrackPageView and lib/funnel/client.ts.)
 *
 * Events, in the order a visitor meets them:
 *   lead_email_submitted   → Blueprint opt-in form sent
 *   lead_blueprint_sent    → opt-in saved; visitor moved to the sales page
 *   blueprint_downloaded   → the PDF was downloaded on-site
 *   package_selected       → a package's buy button was clicked
 *   bundle_selected        → the Growth Suite's buy button was clicked
 *   exit_offer_shown / exit_offer_accepted / exit_offer_dismissed
 *   begin_checkout         → checkout form submitted, going to Paystack
 *   purchase_completed     → payment verified by the server
 *   onboarding_submitted   → project brief sent
 *   booking_page_viewed / application_submitted / call_booked → the free-call route
 */

type EventName =
  | "lead_email_submitted"
  | "lead_blueprint_sent"
  | "blueprint_downloaded"
  | "package_selected"
  | "bundle_selected"
  | "exit_offer_shown"
  | "exit_offer_accepted"
  | "exit_offer_dismissed"
  | "begin_checkout"
  | "purchase_completed"
  | "onboarding_submitted"
  | "booking_page_viewed"
  | "application_submitted"
  | "call_booked";

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
  } catch {
    /* never let analytics break the flow */
  }
}
