import { unstable_cache } from "next/cache";
import { rpc } from "@/lib/supabase/rpc";
import type { Bundle, ExitOffer, Funnel, Package } from "./types";

export const FUNNEL_TAG = "funnel";

const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];

function cleanPackage(p: Record<string, unknown>): Package {
  return {
    id: String(p.id ?? ""),
    slug: String(p.slug ?? ""),
    name: String(p.name ?? ""),
    audience: (p.audience as string) || null,
    description: (p.description as string) || null,
    deliverables: list(p.deliverables),
    scope: list(p.scope),
    delivery_time: (p.delivery_time as string) || null,
    price_minor: Number(p.price_minor ?? 0),
    checkout_enabled: p.checkout_enabled !== false,
    active: typeof p.active === "boolean" ? p.active : undefined,
    sort_order: typeof p.sort_order === "number" ? p.sort_order : undefined,
  };
}

export function cleanFunnel(raw: Record<string, unknown>): Funnel {
  const b = raw.bundle as Record<string, unknown> | null;
  const x = raw.exit as Record<string, unknown> | null;
  const bundle: Bundle | null = b
    ? {
        slug: String(b.slug ?? "growth-suite"),
        name: String(b.name ?? ""),
        headline: (b.headline as string) || null,
        description: (b.description as string) || null,
        price_minor: Number(b.price_minor ?? 0),
        total_minor: Number(b.total_minor ?? 0),
        savings_minor: Number(b.savings_minor ?? 0),
        package_ids: list(b.package_ids),
        packages: (Array.isArray(b.packages) ? b.packages : []).map((p) => {
          const o = p as Record<string, unknown>;
          return {
            id: String(o.id ?? ""),
            slug: String(o.slug ?? ""),
            name: String(o.name ?? ""),
            price_minor: Number(o.price_minor ?? 0),
            deliverables: list(o.deliverables),
            delivery_time: (o.delivery_time as string) || null,
          };
        }),
        extras: list(b.extras),
        scope: list(b.scope),
        active: b.active === true,
        valid: b.valid === true,
      }
    : null;
  const exit: ExitOffer | null = x
    ? {
        enabled: x.enabled === true,
        headline: String(x.headline ?? ""),
        subheadline: String(x.subheadline ?? ""),
        body: String(x.body ?? ""),
        cta_label: String(x.cta_label ?? ""),
        dismiss_label: String(x.dismiss_label ?? ""),
        special_price_minor: x.special_price_minor == null ? null : Number(x.special_price_minor),
        price_minor: Number(x.price_minor ?? 0),
        is_special: x.is_special === true,
        savings_minor: Number(x.savings_minor ?? 0),
        min_seconds: Number(x.min_seconds ?? 20),
        min_scroll_percent: Number(x.min_scroll_percent ?? 25),
        desktop_trigger: x.desktop_trigger !== false,
        mobile_trigger: (x.mobile_trigger as ExitOffer["mobile_trigger"]) ?? "back_and_scroll",
        suppress_days: Number(x.suppress_days ?? 7),
      }
    : null;
  return {
    currency: String(raw.currency ?? "NGN"),
    packages: (Array.isArray(raw.packages) ? raw.packages : []).map((p) =>
      cleanPackage(p as Record<string, unknown>)
    ),
    bundle,
    exit,
    live: true,
  };
}

/** Straight from the database, uncached. Throws if it can't be reached. */
export async function loadFunnel(): Promise<Funnel> {
  const { data, error } = await rpc<Record<string, unknown>>("public_funnel");
  if (error || !data) throw new Error(error?.message ?? "No offer data returned");
  return cleanFunnel(data);
}

const cached = unstable_cache(loadFunnel, ["funnel-v1"], { tags: [FUNNEL_TAG], revalidate: 300 });

const OFFLINE: Funnel = { currency: "NGN", packages: [], bundle: null, exit: null, live: false };

/**
 * The offer the public pages render. Cached, and refreshed the moment a
 * package, the bundle or the exit offer is saved in the dashboard.
 *
 * If the database can't be reached the pages still render, with prices and
 * checkout withheld — a failure is never cached and never replaced by
 * made-up prices.
 */
export async function getFunnel(): Promise<Funnel> {
  try {
    return await cached();
  } catch {
    return OFFLINE;
  }
}

/** The bundle, only when it is a genuine saving and can be bought. */
export const sellableBundle = (f: Funnel) => (f.live && f.bundle?.valid ? f.bundle : null);
