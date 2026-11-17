import "server-only";
import { SITE_URL } from "@/lib/site";

/** The address this request came in on, so links work on preview deployments too. */
export function originOf(req: Request) {
  try {
    const h = req.headers;
    const host = h.get("x-forwarded-host") ?? h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
      return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
    }
    return new URL(req.url).origin;
  } catch {
    return SITE_URL;
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Only requests sent by this site's own pages may post to the form endpoints. */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients send none; the database still validates everything
  try {
    return new URL(origin).host === new URL(originOf(req)).host;
  } catch {
    return false;
  }
}
