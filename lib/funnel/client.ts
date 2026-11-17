"use client";

import { SUPABASE_ANON_KEY, SUPABASE_IS_SET, SUPABASE_URL } from "@/lib/site";

/**
 * Browser-side helpers for the funnel: the per-visit id, first-party event
 * recording for the dashboard, and the handful of things remembered between
 * pages (who opted in, whether they bought, whether they dismissed the offer).
 *
 * Storage can be unavailable (private windows, blocked site data), so every
 * read and write is guarded and the funnel works without it.
 */

const get = (store: "local" | "session", key: string) => {
  try {
    return (store === "local" ? localStorage : sessionStorage).getItem(key);
  } catch {
    return null;
  }
};
const set = (store: "local" | "session", key: string, value: string) => {
  try {
    (store === "local" ? localStorage : sessionStorage).setItem(key, value);
  } catch {
    /* ignore */
  }
};

/** A random id that lasts one browser session. Shared with TrackPageView. */
export function sessionId(): string | null {
  try {
    let id = sessionStorage.getItem("syx_sid");
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 40);
      sessionStorage.setItem("syx_sid", id);
    }
    return id;
  } catch {
    return null;
  }
}

export type FunnelEvent =
  | "package_cta_click"
  | "bundle_cta_click"
  | "exit_popup_shown"
  | "exit_popup_click"
  | "exit_popup_dismissed"
  | "blueprint_downloaded"
  | "checkout_view"
  | "booking_cta_click";

const countable = () =>
  SUPABASE_IS_SET &&
  typeof navigator !== "undefined" &&
  navigator.doNotTrack !== "1" &&
  !/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent);

/** Records something a visitor did, for the dashboard. Never blocks the page. */
export function funnelEvent(event: FunnelEvent, props: Record<string, string | number | boolean> = {}) {
  if (!countable()) return;
  const sid = sessionId();
  if (!sid) return;
  fetch(`${SUPABASE_URL}/rest/v1/rpc/track_funnel_event`, {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ p_event: event, p_session: sid, p_props: props }),
  }).catch(() => {
    /* counting must never affect the page */
  });
}

/** Where this visit came from: kept from the first page so it survives navigation. */
export function attribution() {
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
  let utm: Record<string, string> = {};
  let referrer = "";
  try {
    const saved = get("session", "syx_attr");
    if (saved) return JSON.parse(saved) as { utm: Record<string, string>; referrer: string };
    const q = new URLSearchParams(location.search);
    utm = Object.fromEntries(keys.map((k) => [k, (q.get(k) ?? "").slice(0, 120)]).filter(([, v]) => v));
    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== location.hostname) referrer = host;
    }
    set("session", "syx_attr", JSON.stringify({ utm, referrer }));
  } catch {
    /* ignore */
  }
  return { utm, referrer };
}

/** Name and email typed earlier in this visit, to prefill the next form. */
export const contact = {
  save(name: string, email: string) {
    if (name) set("session", "syx_name", name);
    if (email) set("session", "syx_email", email);
  },
  read: () => ({ name: get("session", "syx_name") ?? "", email: get("session", "syx_email") ?? "" }),
};

export const flags = {
  markOptedIn: () => set("local", "syx_optin", String(Date.now())),
  hasOptedIn: () => get("local", "syx_optin") !== null,
  markPurchased: () => set("local", "syx_purchased", String(Date.now())),
  hasPurchased: () => get("local", "syx_purchased") !== null,
  /** The exit offer was closed: remember when, and for this visit. */
  markExitSeen: (dismissed: boolean) => {
    set("session", "syx_exit_seen", "1");
    if (dismissed) set("local", "syx_exit_dismissed", String(Date.now()));
  },
  exitSeenThisVisit: () => get("session", "syx_exit_seen") !== null,
  exitDismissedAt: () => Number(get("local", "syx_exit_dismissed") ?? 0) || 0,
  welcome: {
    set: () => set("session", "syx_welcome", "1"),
    clear: () => set("session", "syx_welcome", "0"),
    active: () => get("session", "syx_welcome") === "1",
  },
};
