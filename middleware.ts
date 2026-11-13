import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/auth";
import {
  ACCESS_COOKIE,
  LOGIN_PATH,
  REFRESH_COOKIE,
  cookieBase,
  secondsLeft,
  sessionCookies,
} from "@/lib/admin/cookies";

/**
 * Guards everything under /admin.
 *
 *  • No session cookie → straight to the sign-in page, before any dashboard
 *    code runs.
 *  • Access token about to expire → swap it for a fresh one using the refresh
 *    token, so a long working session isn't interrupted.
 *
 * This is the outer door. The lock is in the database: every page and action
 * still proves the token belongs to a current admin (lib/admin/session.ts).
 */
export const config = { matcher: ["/admin/:path*"] };

function harden(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "same-origin");
  return res;
}

function toLogin(req: NextRequest, clear = false) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  const res = NextResponse.redirect(url);
  if (clear) {
    res.cookies.set({ name: ACCESS_COOKIE, value: "", ...cookieBase, maxAge: 0 });
    res.cookies.set({ name: REFRESH_COOKIE, value: "", ...cookieBase, maxAge: 0 });
  }
  return harden(res);
}

export async function middleware(req: NextRequest) {
  const isLogin = req.nextUrl.pathname === LOGIN_PATH;
  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = req.cookies.get(REFRESH_COOKIE)?.value;

  // Fresh enough: carry on.
  if (access && secondsLeft(access) > 60) return harden(NextResponse.next());

  // Expired or missing access token, but we can renew it.
  if (refresh) {
    const tokens = await refreshSession(refresh);
    if (tokens) {
      // Hand the new token to this request as well as to the browser.
      const headers = new Headers(req.headers);
      const jar = req.cookies
        .getAll()
        .filter((c) => c.name !== ACCESS_COOKIE && c.name !== REFRESH_COOKIE)
        .map((c) => `${c.name}=${c.value}`);
      jar.push(`${ACCESS_COOKIE}=${tokens.access_token}`, `${REFRESH_COOKIE}=${tokens.refresh_token}`);
      headers.set("cookie", jar.join("; "));
      const res = NextResponse.next({ request: { headers } });
      for (const c of sessionCookies(tokens)) res.cookies.set(c);
      return harden(res);
    }
    return isLogin ? harden(NextResponse.next()) : toLogin(req, true);
  }

  return isLogin ? harden(NextResponse.next()) : toLogin(req);
}
