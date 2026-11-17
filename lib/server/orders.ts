import "server-only";
import { SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/content/get";
import { briefNotice, orderConfirmation, orderNotice } from "@/lib/email/templates";
import type { Order } from "@/lib/funnel/types";
import { env, isConfigured } from "./env";
import { svc } from "./db";
import { sendEmail } from "./email";
import { verifyTransaction } from "./paystack";

export const orderUrl = (token: string, siteUrl = SITE_URL) => `${siteUrl}/order/${token}`;

export type Settlement =
  | { state: "paid"; order: Order; justNow: boolean }
  | { state: "failed"; order: Order | null; reason: string }
  | { state: "pending"; order: Order | null; reason: string }
  | { state: "unavailable"; reason: string };

type MarkResult = { found: boolean; changed?: boolean; paid?: boolean; mismatch?: boolean; order?: Order };

/**
 * Asks Paystack what really happened to a transaction and records the answer.
 * Used by the page the buyer returns to, by the webhook, and by the dashboard's
 * "check again" button. Safe to call any number of times for the same order.
 */
export async function settleOrder(
  reference: string,
  via: "callback" | "webhook" | "admin",
  siteUrl = SITE_URL
): Promise<Settlement> {
  if (!isConfigured.database() || !isConfigured.payments()) {
    return { state: "unavailable", reason: "Payment verification is not configured on the server." };
  }
  const existing = await svc<Order | null>("svc_order", { p_reference: reference });
  if (existing.error) return { state: "unavailable", reason: existing.error.message };
  if (!existing.data) return { state: "failed", order: null, reason: "We couldn't find that order." };
  if (existing.data.status === "paid") {
    await afterPaid(existing.data, siteUrl);
    return { state: "paid", order: existing.data, justNow: false };
  }

  const tx = await verifyTransaction(reference);
  if (!tx.ok) {
    // Paystack doesn't know the reference yet, or couldn't be reached: not proof of anything.
    return { state: "pending", order: existing.data, reason: tx.message };
  }
  const t = tx.data;
  if (t.status !== "success") {
    if (t.status === "failed" || t.status === "reversed") {
      await svc("svc_mark_order_failed", { p_reference: reference, p_reason: t.gateway_response ?? "The payment was declined." });
      return { state: "failed", order: existing.data, reason: t.gateway_response ?? "The payment was declined." };
    }
    return { state: "pending", order: existing.data, reason: t.gateway_response ?? "The payment was not completed." };
  }

  const marked = await svc<MarkResult>("svc_mark_order_paid", {
    p_reference: reference,
    p_amount_minor: t.amount,
    p_currency: t.currency,
    p_gateway_id: String(t.id),
    p_channel: t.channel ?? null,
    p_paid_at: t.paid_at ?? null,
    p_via: via,
  });
  if (marked.error || !marked.data?.found || !marked.data.order) {
    return { state: "unavailable", reason: marked.error?.message ?? "The order could not be updated." };
  }
  if (!marked.data.paid) {
    return {
      state: "failed",
      order: marked.data.order,
      reason: "The amount received doesn't match this order. Nothing has been confirmed; please contact us.",
    };
  }
  await afterPaid(marked.data.order, siteUrl);
  return { state: "paid", order: marked.data.order, justNow: marked.data.changed === true };
}

/** Receipt to the buyer and a notice to the business: each exactly once per order. */
async function afterPaid(order: Order, siteUrl: string) {
  if (order.confirmation_sent_at || !isConfigured.email() || !order.token) return;
  const claim = await svc<boolean>("svc_claim_order_confirmation", { p_reference: order.reference });
  if (!claim.data) return;

  const { contact } = await getContent();
  const receipt = await sendEmail({
    to: order.email,
    key: "order_confirmation",
    replyTo: contact.email,
    email: orderConfirmation(order, {
      siteUrl,
      orderUrl: orderUrl(order.token, siteUrl),
      contactEmail: contact.email,
      location: contact.location,
    }),
  });
  if (!receipt.ok) {
    // Let the next verification (webhook retry, page reload) try again.
    await svc("svc_release_order_confirmation", { p_reference: order.reference });
    return;
  }
  await sendEmail({
    to: env.notifyEmail || contact.email,
    key: "order_notice",
    replyTo: order.email,
    email: orderNotice(order, { siteUrl, adminUrl: `${siteUrl}/admin/orders/${order.id}`, location: contact.location }),
  });
}

/** Tells the business a buyer has completed the project brief. */
export async function notifyBrief(token: string, siteUrl = SITE_URL) {
  if (!isConfigured.database() || !isConfigured.email()) return;
  const { data: order } = await svc<Order | null>("svc_order_by_token", { p_token: token });
  if (!order) return;
  const { contact } = await getContent();
  await sendEmail({
    to: env.notifyEmail || contact.email,
    key: "brief_notice",
    replyTo: order.email,
    email: briefNotice(order, { siteUrl, adminUrl: `${siteUrl}/admin/orders/${order.id}`, location: contact.location }),
  });
}
