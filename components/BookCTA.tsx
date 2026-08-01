"use client";

import { useOptIn } from "./OptInProvider";

/**
 * The single site-wide conversion button. Every "get the book" CTA is this,
 * so the copy and destination stay identical everywhere. Opens the opt-in
 * modal, which delivers the book and redirects to the payment step.
 *
 * Usable inside Server Components too — it's a client island.
 */
export default function BookCTA({
  className = "btn-signal shadow-press",
  label = "Get the free growth playbook",
  arrow = true,
  full = false,
}: {
  className?: string;
  label?: string;
  arrow?: boolean;
  full?: boolean;
}) {
  const { openOptIn } = useOptIn();
  return (
    <button
      onClick={openOptIn}
      className={`${className}${full ? " w-full" : ""}`}
    >
      {label}
      {arrow && (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <path
            d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
