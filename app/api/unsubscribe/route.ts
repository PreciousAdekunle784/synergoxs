import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase/rpc";
import { UUID_RE, originOf } from "@/lib/server/request";

export const dynamic = "force-dynamic";

/**
 * One-click unsubscribe, for the button mail apps show next to the sender
 * (the List-Unsubscribe-Post header on every sequence email points here).
 */
export async function POST(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  if (!UUID_RE.test(t)) return NextResponse.json({ ok: false }, { status: 400 });
  const { data, error } = await rpc<{ status: string } | null>("subscription_set", { p_token: t, p_subscribed: false });
  if (error) return NextResponse.json({ ok: false }, { status: 503 });
  return NextResponse.json({ ok: !!data });
}

/** A person following the link lands on the page, where they confirm. */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  return NextResponse.redirect(`${originOf(req)}/unsubscribe?t=${encodeURIComponent(t)}`, 302);
}
