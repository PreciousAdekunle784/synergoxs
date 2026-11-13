import type { Tokens } from "@/lib/supabase/auth";

/** Cookie definitions shared by the middleware and the server-side session code. */
export const ACCESS_COOKIE = "syx_at";
export const REFRESH_COOKIE = "syx_rt";
export const LOGIN_PATH = "/admin/login";

export const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/admin",
};

/** Seven days: how long you stay signed in on a device without using it. */
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

export function sessionCookies(t: Tokens) {
  return [
    { name: ACCESS_COOKIE, value: t.access_token, ...cookieBase, maxAge: t.expires_in },
    { name: REFRESH_COOKIE, value: t.refresh_token, ...cookieBase, maxAge: REFRESH_MAX_AGE },
  ];
}

/** Seconds until a token expires (negative if it already has). Not a signature check. */
export function secondsLeft(jwt: string) {
  try {
    const part = jwt.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const exp = (JSON.parse(json) as { exp?: number }).exp;
    return typeof exp === "number" ? exp - Math.floor(Date.now() / 1000) : -1;
  } catch {
    return -1;
  }
}
