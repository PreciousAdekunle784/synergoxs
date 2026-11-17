import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase/rpc";
import { BLUEPRINT_FILE } from "@/lib/site";
import { UUID_RE, originOf } from "@/lib/server/request";

export const dynamic = "force-dynamic";

/**
 * The download link inside the emails. Notes that the guide was opened, then
 * hands over the PDF itself. With or without a valid token the file is served:
 * a broken link in someone's inbox is worse than an uncounted download.
 */
export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t") ?? "";
  if (UUID_RE.test(t)) {
    await rpc("track_funnel_event", {
      p_event: "blueprint_downloaded",
      p_session: t,
      p_props: { via: "email" },
    }).catch(() => null);
  }
  return NextResponse.redirect(`${originOf(req)}${BLUEPRINT_FILE}`, 302);
}
