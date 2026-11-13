import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/site";

/**
 * Supabase Auth over plain HTTPS. Used only on the server: the browser never
 * sees a token. Passwords are checked by Supabase, never stored by this site.
 */
export type Tokens = { access_token: string; refresh_token: string; expires_in: number };

async function call(path: string, init: RequestInit & { token?: string }) {
  const { token, ...rest } = init;
  return fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
}

function asTokens(b: unknown): Tokens | null {
  const t = b as Partial<Tokens> | null;
  if (!t || typeof t.access_token !== "string" || typeof t.refresh_token !== "string") return null;
  return {
    access_token: t.access_token,
    refresh_token: t.refresh_token,
    expires_in: typeof t.expires_in === "number" ? t.expires_in : 3600,
  };
}

export async function signInWithPassword(email: string, password: string): Promise<Tokens | null> {
  try {
    const res = await call("token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    return asTokens(await res.json());
  } catch {
    return null;
  }
}

export async function refreshSession(refreshToken: string): Promise<Tokens | null> {
  try {
    const res = await call("token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    return asTokens(await res.json());
  } catch {
    return null;
  }
}

export async function signOut(token: string) {
  try {
    await call("logout", { method: "POST", token });
  } catch {
    /* the cookies are cleared either way */
  }
}

export async function updatePassword(token: string, password: string): Promise<string | null> {
  try {
    const res = await call("user", { method: "PUT", token, body: JSON.stringify({ password }) });
    if (res.ok) return null;
    const b = (await res.json().catch(() => ({}))) as { msg?: string; message?: string };
    return b.msg ?? b.message ?? "The password could not be changed.";
  } catch {
    return "The password could not be changed. Check your connection and try again.";
  }
}
