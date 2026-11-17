"use client";

import { useEffect, useState } from "react";
import { BLUEPRINT_FILE, BLUEPRINT_FILENAME, BLUEPRINT_TITLE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { contact, flags, funnelEvent } from "@/lib/funnel/client";
import { Check, Cross, Download } from "../Icons";

/**
 * Shown on the sales page to someone who has just asked for the Blueprint:
 * confirms it's on its way and hands them the file directly. The download
 * link is the real PDF, so the guide is delivered even if the email is slow.
 */
export default function WelcomeBar() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fresh = new URLSearchParams(window.location.search).get("welcome") === "1";
    if (fresh) {
      flags.welcome.set();
      // Tidy the address so a refresh or a shared link doesn't carry the flag.
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }
    if (fresh || flags.welcome.active()) {
      setEmail(contact.read().email);
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="welcome-bar shell relative z-10 pt-[88px] md:pt-[100px]" role="status">
      <div className="flex animate-rise flex-col gap-4 border border-ink bg-paper p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-green text-ink">
            <Check size={16} />
          </span>
          <div>
            <p className="font-display text-[1.1rem] font-extrabold uppercase leading-tight text-ink" style={{ fontStretch: "86%" }}>
              Your Blueprint is on its way.
            </p>
            <p className="mt-1 text-[0.92rem] leading-relaxed text-body">
              {email ? (
                <>
                  We&apos;re sending it to <span className="font-semibold text-ink [overflow-wrap:anywhere]">{email}</span>.
                </>
              ) : (
                <>Check your inbox in a minute or two.</>
              )}{" "}
              You can also download it right now. Below is how to put it into practice.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:pl-4">
          <a
            href={BLUEPRINT_FILE}
            download={BLUEPRINT_FILENAME}
            onClick={() => {
              setSaved(true);
              funnelEvent("blueprint_downloaded", { via: "site" });
              track("blueprint_downloaded", { title: BLUEPRINT_TITLE });
            }}
            className="btn-dark min-h-[46px] flex-1 px-4 py-2 text-[0.9rem] sm:flex-none"
          >
            <Download />
            {saved ? "Downloaded" : "Download the PDF"}
          </a>
          <button
            type="button"
            onClick={() => {
              flags.welcome.clear();
              setShow(false);
            }}
            aria-label="Hide this message"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-btn border border-ink/15 text-body transition-colors hover:border-ink hover:text-ink"
          >
            <Cross />
          </button>
        </div>
      </div>
    </div>
  );
}
