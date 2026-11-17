"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { rpc } from "@/lib/supabase/rpc";
import { SITE_URL } from "@/lib/site";
import { notifyBrief } from "@/lib/server/orders";
import { UUID_RE } from "@/lib/server/request";
import { briefFieldsFor } from "./brief";
import type { PublicOrder } from "./types";

export type FormState = { ok: boolean; message: string; field?: string } | null;

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return SITE_URL;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
}

/**
 * Saves the project brief for a paid order. The order is identified by its
 * private token (the link in the buyer's receipt); the database refuses a
 * brief for an order that hasn't been paid.
 */
export async function submitBrief(_prev: FormState, fd: FormData): Promise<FormState> {
  const token = String(fd.get("token") ?? "");
  if (!UUID_RE.test(token)) return { ok: false, message: "This order link isn't valid." };

  const { data: order } = await rpc<PublicOrder | null>("order_public", { p_token: token });
  if (!order) return { ok: false, message: "We couldn't find this order." };
  if (order.status !== "paid") return { ok: false, message: "This order hasn't been paid yet, so there's nothing to brief." };

  const answers: Record<string, string> = {};
  for (const f of briefFieldsFor(order.items)) {
    const v = String(fd.get(f.key) ?? "").trim();
    if (f.required && v === "") return { ok: false, field: f.key, message: `Please fill in “${f.label}”.` };
    if (v.length > f.max) return { ok: false, field: f.key, message: `“${f.label}” is limited to ${f.max.toLocaleString()} characters.` };
    if (v !== "") answers[f.label] = v;
  }

  const { data, error } = await rpc<boolean>("submit_onboarding", { p_token: token, p_data: answers });
  if (error || !data) {
    return { ok: false, message: "Your brief couldn't be saved just now. Nothing was lost on this page: please try again." };
  }
  await notifyBrief(token, origin()).catch(() => null);
  revalidatePath(`/order/${token}`);
  return { ok: true, message: "Brief received." };
}

/** Unsubscribe or resubscribe, from the link in an email. */
export async function setSubscription(_prev: FormState, fd: FormData): Promise<FormState> {
  const token = String(fd.get("token") ?? "");
  const subscribe = fd.get("subscribe") === "1";
  if (!UUID_RE.test(token)) return { ok: false, message: "This link isn't valid." };
  const { data, error } = await rpc<{ status: string } | null>("subscription_set", { p_token: token, p_subscribed: subscribe });
  if (error) return { ok: false, message: "That didn't go through. Please try again in a moment." };
  if (!data) return { ok: false, message: "We couldn't find this subscription. It may already have been removed." };
  revalidatePath("/unsubscribe");
  return { ok: true, message: data.status };
}
