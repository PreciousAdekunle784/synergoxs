"use client";

import Link from "next/link";
import { BOOKING_PAGE, CALL_MINUTES } from "@/lib/site";
import { useCtaLabel } from "./ContactProvider";
import { Arrow } from "./Icons";

/**
 * THE primary call to action. Every green button on the site is this, so the
 * wording and the destination stay identical everywhere: the booking page.
 * The default wording is editable in the dashboard (Website content → Hero).
 *
 * For the secondary "free playbook" action, see PlaybookLink.
 */
export default function BookCall({
  label,
  size = "md",
  full = false,
  className = "",
}: {
  label?: string;
  size?: "md" | "lg";
  full?: boolean;
  className?: string;
}) {
  const fallback = useCtaLabel();
  return (
    <Link
      href={BOOKING_PAGE}
      className={`btn-primary ${size === "lg" ? "btn-lg" : ""} ${
        full ? "w-full" : ""
      } ${className}`}
    >
      {label ?? fallback}
      <Arrow />
    </Link>
  );
}

/** The one-line reassurance that sits under the primary button. */
export function CallFacts({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[0.86rem] leading-relaxed text-mute ${className}`}>
      Free · {CALL_MINUTES} minutes · You keep the findings either way
    </p>
  );
}
