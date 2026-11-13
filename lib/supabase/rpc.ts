import { SUPABASE_ANON_KEY, SUPABASE_IS_SET, SUPABASE_URL } from "@/lib/site";

/**
 * The website talks to the database only through database functions
 * (see supabase/migrations/0002_admin_dashboard.sql). This is the one place
 * that makes those calls.
 *
 * `token` is the signed-in admin's access token. Without it the call is made
 * with the public key, which can only reach the four public functions.
 * The database, not this file, decides what a caller is allowed to do.
 */
export type RpcError = { status: number; message: string; code?: string };
export type RpcResult<T> = { data: T; error: null } | { data: null; error: RpcError };

export async function rpc<T>(
  fn: string,
  args: Record<string, unknown> = {},
  token?: string
): Promise<RpcResult<T>> {
  if (!SUPABASE_IS_SET) {
    return { data: null, error: { status: 0, message: "Supabase is not configured." } };
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token ?? SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    if (!res.ok) {
      const b = (body ?? {}) as { message?: string; code?: string };
      return {
        data: null,
        error: {
          status: res.status,
          code: b.code,
          message: typeof b.message === "string" ? b.message : `Request failed (${res.status})`,
        },
      };
    }
    return { data: body as T, error: null };
  } catch (e) {
    return {
      data: null,
      error: { status: 0, message: e instanceof Error ? e.message : "Network error" },
    };
  }
}

/** True when the database hasn't had the dashboard migration run yet. */
export function isMissingFunction(error: RpcError | null) {
  return !!error && (error.status === 404 || error.code === "PGRST202" || error.code === "42883");
}
