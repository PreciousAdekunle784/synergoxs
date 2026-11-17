import { NextResponse } from "next/server";
import { env, isConfigured } from "@/lib/server/env";
import { runDueSequence } from "@/lib/server/sequence";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Sends every sequence email that is due. Run once a day by Vercel Cron
 * (see vercel.json), which sends `Authorization: Bearer $CRON_SECRET`.
 * Refuses to run without that secret, so nobody else can trigger sends.
 */
export async function GET(req: Request) {
  if (!isConfigured.cron()) {
    return NextResponse.json({ ok: false, error: "CRON_SECRET is not set." }, { status: 503 });
  }
  if (req.headers.get("authorization") !== `Bearer ${env.cronSecret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const summary = await runDueSequence(80);
  return NextResponse.json({ ok: summary.errors.length === 0, ...summary });
}
