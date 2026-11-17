import { NextResponse } from "next/server";
import { rpc } from "@/lib/supabase/rpc";
import { isConfigured } from "@/lib/server/env";
import { svc } from "@/lib/server/db";
import { initializeTransaction } from "@/lib/server/paystack";
import { EMAIL_RE, originOf, sameOrigin, str } from "@/lib/server/request";

export const dynamic = "force-dynamic";

type Created = { token: string; reference: string; amount_minor: number; currency: string; item_name: string; email: string };

/**
 * Starts a payment.
 *
 * The browser sends WHICH item and WHO is buying — never a price. The database
 * works out the amount from the packages table, and Paystack is told that
 * amount from here, with the secret key. The buyer is then sent to Paystack's
 * own checkout and comes back to /order/[token], where the payment is verified.
 */
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "That didn't come through. Please try again." }, { status: 400 });
  }

  const slug = str(body.slug, 60);
  const name = str(body.name, 200);
  const email = str(body.email, 320).toLowerCase();
  const phone = str(body.phone, 60);
  const offer = str(body.offer, 20);

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "That package doesn't exist." }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ ok: false, field: "name", error: "Enter your full name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, field: "email", error: "Enter a valid email. Your receipt goes there." }, { status: 400 });
  }
  if (phone && !/^\+?[0-9 ()-]{7,20}$/.test(phone)) {
    return NextResponse.json({ ok: false, field: "phone", error: "That phone number doesn't look right." }, { status: 400 });
  }

  if (!isConfigured.payments() || !isConfigured.database()) {
    return NextResponse.json(
      { ok: false, code: "payments_off", error: "Online payment isn't switched on yet, so nothing has been charged." },
      { status: 503 }
    );
  }

  const created = await rpc<Created>("funnel_create_order", {
    p_slug: slug,
    p_email: email,
    p_name: name,
    p_phone: phone || null,
    p_offer: ["sales_page", "exit_popup", "email", "direct"].includes(offer) ? offer : "sales_page",
    p_session: str(body.session, 64) || null,
  });
  if (created.error || !created.data) {
    const e = created.error;
    const known = e && ["22023", "P0002", "53400"].includes(e.code ?? "");
    return NextResponse.json(
      { ok: false, error: known ? e!.message : "We couldn't start your order just now. Please try again in a moment." },
      { status: e?.code === "53400" ? 429 : known ? 400 : 503 }
    );
  }

  const order = created.data;
  const origin = originOf(req);
  const tx = await initializeTransaction({
    reference: order.reference,
    email: order.email,
    amountMinor: order.amount_minor,
    currency: order.currency,
    callbackUrl: `${origin}/order/${order.token}`,
    metadata: {
      order_reference: order.reference,
      item: order.item_name,
      custom_fields: [
        { display_name: "Item", variable_name: "item", value: order.item_name },
        { display_name: "Customer", variable_name: "customer", value: name },
      ],
    },
  });
  if (!tx.ok) {
    await svc("svc_mark_order_failed", { p_reference: order.reference, p_reason: `Could not start payment: ${tx.message}` });
    return NextResponse.json(
      { ok: false, error: "The payment page couldn't be opened, so nothing has been charged. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, url: tx.data.authorization_url, order: order.token });
}
