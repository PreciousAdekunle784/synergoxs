import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env, isConfigured } from "./env";

/**
 * Paystack, server side. The secret key never leaves this file.
 *
 * A payment is only ever treated as real after `verifyTransaction` (or a
 * correctly signed webhook) says so — never because the browser came back
 * to a success page.
 */
export type PaystackResult<T> = { ok: true; data: T } | { ok: false; message: string };

async function call<T>(path: string, init?: RequestInit): Promise<PaystackResult<T>> {
  if (!isConfigured.payments()) return { ok: false, message: "PAYSTACK_SECRET_KEY is not set on the server." };
  try {
    const res = await fetch(`${env.paystackBase}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${env.paystackSecret}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const body = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
    if (!res.ok || !body?.status || !body.data) {
      return { ok: false, message: body?.message ?? `Paystack answered ${res.status}` };
    }
    return { ok: true, data: body.data };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not reach Paystack" };
  }
}

export function initializeTransaction(input: {
  reference: string;
  email: string;
  amountMinor: number;
  currency: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}) {
  return call<{ authorization_url: string; access_code: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      reference: input.reference,
      email: input.email,
      amount: String(input.amountMinor),
      currency: input.currency,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
}

export type VerifiedTransaction = {
  id: number | string;
  status: string; // "success" | "failed" | "abandoned" | "ongoing" | "pending" | …
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
  gateway_response?: string;
};

export function verifyTransaction(reference: string) {
  return call<VerifiedTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Paystack signs each webhook body with HMAC-SHA512 of the secret key. */
export function webhookSignatureIsValid(rawBody: string, signature: string | null) {
  if (!isConfigured.payments() || !signature) return false;
  const expected = createHmac("sha512", env.paystackSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
