import "server-only";
import { rpc, type RpcResult } from "@/lib/supabase/rpc";
import { env, isConfigured } from "./env";

/**
 * Calls a svc_* database function with the service-role key. This is the only
 * way an order becomes "paid" or an email is logged as sent, and it can only
 * happen from server code.
 */
export async function svc<T>(fn: string, args: Record<string, unknown> = {}): Promise<RpcResult<T>> {
  if (!isConfigured.database()) {
    return {
      data: null,
      error: { status: 0, message: "SUPABASE_SERVICE_ROLE_KEY is not set on the server." },
    };
  }
  return rpc<T>(fn, args, env.serviceKey, true);
}
