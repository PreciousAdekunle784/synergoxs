import { NextResponse } from "next/server";
import { settleOrder } from "@/lib/server/orders";
import { webhookSignatureIsValid } from "@/lib/server/paystack";
import { originOf } from "@/lib/server/request";

export const dynamic = "force-dynamic";

/**
 * Paystack calls this when a charge succeeds, whether or not the buyer's
 * browser ever makes it back to the site.
 *
 * Set it in Paystack → Settings → API Keys & Webhooks → Webhook URL:
 *     https://YOUR-SITE/api/paystack/webhook
 *
 * The body is only trusted if its signature matches the secret key, and even
 * then the transaction is looked up again with Paystack before an order is
 * marked paid.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!webhookSignatureIsValid(raw, req.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (event.event === "charge.success" && typeof reference === "string" && reference.startsWith("SYX-")) {
    const result = await settleOrder(reference, "webhook", originOf(req));
    // A 5xx asks Paystack to try again later, which is what we want if our
    // own database couldn't be reached.
    if (result.state === "unavailable") return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
