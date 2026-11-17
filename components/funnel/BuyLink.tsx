"use client";

import Link from "next/link";
import { track } from "@/lib/analytics";
import { funnelEvent } from "@/lib/funnel/client";

/**
 * A link into checkout. Records which item was chosen, and from where on the
 * page, before moving on. The price is never passed along: checkout looks it
 * up again on the server.
 */
export default function BuyLink({
  slug,
  kind,
  placement,
  className,
  children,
  onNavigate,
}: {
  slug: string;
  kind: "package" | "bundle";
  placement: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={`/checkout/${slug}`}
      className={className}
      onClick={() => {
        funnelEvent(kind === "bundle" ? "bundle_cta_click" : "package_cta_click", { slug, placement });
        track(kind === "bundle" ? "bundle_selected" : "package_selected", { slug, placement });
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}
