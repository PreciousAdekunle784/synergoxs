import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase/rpc";

/**
 * Called by the booking page when Calendly confirms a time.
 *
 * Marks the visitor's own consultation request as booked. If a Calendly
 * personal access token is set (CALENDLY_API_TOKEN, server-side only), it also
 * looks up the chosen time so the dashboard can show upcoming calls without
 * anyone typing them in. Without the token the booking is still recorded;
 * only the time is missing.
 */
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Only ever fetch Calendly's own API, and only a scheduled-event resource.
const EVENT_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]{6,80}$/;
const INVITEE_URI = /^https:\/\/api\.calendly\.com\/scheduled_events\/[A-Za-z0-9-]{6,80}\/invitees\/[A-Za-z0-9-]{6,80}$/;

async function calendlyStartTime(eventUri: string): Promise<string | null> {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(eventUri, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { resource?: { start_time?: string } };
    const start = body.resource?.start_time;
    return start && !isNaN(new Date(start).getTime()) ? new Date(start).toISOString() : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: { token?: unknown; eventUri?: unknown; inviteeUri?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const token = typeof body.token === "string" ? body.token : "";
  if (!UUID.test(token)) return NextResponse.json({ ok: false }, { status: 400 });

  const eventUri = typeof body.eventUri === "string" && EVENT_URI.test(body.eventUri) ? body.eventUri : null;
  const inviteeUri =
    typeof body.inviteeUri === "string" && INVITEE_URI.test(body.inviteeUri) ? body.inviteeUri : null;
  const scheduledAt = eventUri ? await calendlyStartTime(eventUri) : null;

  const { data, error } = await rpc<boolean>("confirm_consultation", {
    p_token: token,
    p_event_uri: eventUri,
    p_invitee_uri: inviteeUri,
    p_scheduled_at: scheduledAt,
  });
  if (error) return NextResponse.json({ ok: false }, { status: 502 });
  return NextResponse.json({ ok: data === true, timeRecorded: !!scheduledAt });
}
