import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase/rpc";
import { BLUEPRINT_FILE, CONSENT_TEXT, SALES_PAGE, SOURCE_BLUEPRINT } from "@/lib/site";
import { EMAIL_RE, originOf, sameOrigin, str } from "@/lib/server/request";
import { deliverBlueprint } from "@/lib/server/sequence";

export const dynamic = "force-dynamic";

/**
 * The Blueprint opt-in.
 *   1. validate   2. save the lead, its source and the time   3. record consent
 *   4. send the delivery email   5. tell the page where to go next
 *
 * The lead is saved before any email is attempted, and the response always
 * carries a working download link, so nobody who asked for the guide leaves
 * without it — even if the email provider is down.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "That didn't come through. Please try again." }, { status: 400 });
  }

  const next = { download: BLUEPRINT_FILE, redirect: `${SALES_PAGE}?welcome=1` };

  // A field people never see. Only scripts fill it in; they get a polite nothing.
  if (str(body.company, 200) !== "") return NextResponse.json({ ok: true, emailed: false, ...next });

  const name = str(body.name, 120);
  const email = str(body.email, 320).toLowerCase();
  if (name === "") {
    return NextResponse.json({ ok: false, field: "name", error: "Add your first name so we know who to send it to." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, field: "email", error: "That email doesn't look right. Check it and try again." }, { status: 400 });
  }

  const utm = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>;
  const { error } = await rpc("funnel_optin", {
    p_name: name,
    p_email: email,
    p_consent_text: CONSENT_TEXT,
    p_session: str(body.session, 64) || null,
    p_referrer: str(body.referrer, 200) || null,
    p_utm: Object.fromEntries(
      ["utm_source", "utm_medium", "utm_campaign", "utm_content"].map((k) => [k, str(utm[k], 120)]).filter(([, v]) => v)
    ),
    p_source: SOURCE_BLUEPRINT,
  });
  if (error) {
    const busy = error.code === "53400";
    return NextResponse.json(
      {
        ok: false,
        error: busy
          ? "We're getting a lot of requests right now. Give it a minute and try again."
          : "We couldn't save your details just now. Please try again in a moment.",
      },
      { status: busy ? 429 : 503 }
    );
  }

  // Send email 1 now. Give it a few seconds, then stop waiting: if it hasn't
  // gone by then the scheduled run picks it up, and the page has the download.
  const emailed = await Promise.race([
    deliverBlueprint(email, originOf(req)).catch(() => false),
    new Promise<boolean>((r) => setTimeout(() => r(false), 6000)),
  ]);

  return NextResponse.json({ ok: true, emailed, ...next });
}
