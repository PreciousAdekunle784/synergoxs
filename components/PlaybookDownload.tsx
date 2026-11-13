"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PAYMENT_PAGE, PLAYBOOK_PAGES, PLAYBOOK_URL } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Arrow, Check } from "./Icons";

/** How long the "downloading" state shows before moving on. */
const MOVE_ON_AFTER_MS = 1800;

/**
 * The playbook button on the "you're booked" page.
 *
 * Clicking it saves the PDF to the visitor's device WITHOUT leaving the site
 * (the `download` attribute tells the browser to save the file rather than
 * open it), then takes them to the sales page a moment later. If the automatic
 * move doesn't happen for any reason, the "Continue" link does the same thing.
 */
export default function PlaybookDownload() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    router.prefetch(PAYMENT_PAGE);
    return () => clearTimeout(timer.current);
  }, [router]);

  function onClick() {
    // No preventDefault: the browser handles the download itself.
    track("playbook_downloaded", { from: "booked" });
    setStarted(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => router.push(PAYMENT_PAGE), MOVE_ON_AFTER_MS);
  }

  return (
    <div className="mt-8">
      <a
        href={PLAYBOOK_URL}
        download="The-Compounding-Business.pdf"
        onClick={onClick}
        className="btn-primary w-full sm:w-auto"
      >
        {started ? (
          <>
            <Check size={15} />
            Downloading…
          </>
        ) : (
          <>Download the playbook (PDF, {PLAYBOOK_PAGES} pages)</>
        )}
      </a>

      <p className="mt-3 min-h-[1.5rem] text-[0.88rem] leading-relaxed text-ash" aria-live="polite">
        {started ? (
          <>
            Saved to your downloads. Taking you to the next step…{" "}
            <Link href={PAYMENT_PAGE} className="link inline-flex items-center gap-1.5">
              Continue
              <Arrow className="!h-3.5 !w-3.5" />
            </Link>
          </>
        ) : (
          "It saves to your device. Then we'll show you how we'd build the whole system for you."
        )}
      </p>
    </div>
  );
}
