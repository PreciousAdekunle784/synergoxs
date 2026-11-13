"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SUPABASE_ANON_KEY, SUPABASE_IS_SET, SUPABASE_URL } from "@/lib/site";

/**
 * First-party visit counting for the dashboard.
 *
 * Sends the page path, the referring site's host name and a random id that
 * lasts one browser session. No cookies, no IP address, nothing personal.
 * Skipped for bots and for anyone whose browser sends "Do Not Track".
 */
function sessionId() {
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

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SUPABASE_IS_SET || !pathname || pathname.startsWith("/admin")) return;
    if (navigator.doNotTrack === "1") return;
    if (/bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent)) return;
    const sid = sessionId();
    if (!sid) return;

    let referrer: string | null = null;
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname;
        if (host && host !== location.hostname) referrer = host;
      }
    } catch {
      /* ignore */
    }

    fetch(`${SUPABASE_URL}/rest/v1/rpc/track_page_view`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ p_path: pathname, p_referrer: referrer, p_session: sid }),
    }).catch(() => {
      /* counting visits must never affect the page */
    });
  }, [pathname]);

  return null;
}
