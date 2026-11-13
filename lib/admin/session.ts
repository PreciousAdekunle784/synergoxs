import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { rpc } from "@/lib/supabase/rpc";
import type { Tokens } from "@/lib/supabase/auth";
import { ACCESS_COOKIE, LOGIN_PATH, REFRESH_COOKIE, cookieBase, sessionCookies } from "./cookies";

/**
 * Admin sessions.
 *
 * The access and refresh tokens live in httpOnly cookies scoped to /admin, so
 * page scripts can't read them and they are never sent with requests to the
 * public site. Every admin page and every admin action calls requireAdmin(),
 * which asks the database "is this token a current admin?" — a missing, forged
 * or expired token, or a signed-in user who isn't an admin, all get the same
 * answer: back to the sign-in page.
 */
export function setSession(t: Tokens) {
  const jar = cookies();
  for (const c of sessionCookies(t)) jar.set(c);
}

export function clearSession() {
  const jar = cookies();
  jar.set({ name: ACCESS_COOKIE, value: "", ...cookieBase, maxAge: 0 });
  jar.set({ name: REFRESH_COOKIE, value: "", ...cookieBase, maxAge: 0 });
}

export function accessToken() {
  return cookies().get(ACCESS_COOKIE)?.value ?? null;
}

export type Admin = { email: string; user_id: string; token: string };

/** The current admin, or null. One database round-trip per request. */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const token = accessToken();
  if (!token) return null;
  const { data } = await rpc<{ email: string; user_id: string } | null>("admin_whoami", {}, token);
  if (!data || !data.user_id) return null;
  return { email: data.email, user_id: data.user_id, token };
});

/** Use at the top of every admin page and action. Never returns for a non-admin. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
}
