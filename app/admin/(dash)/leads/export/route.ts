import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { Lead } from "@/lib/admin/types";
import { LEAD_STATUSES, PURCHASE_STATUSES, leadStatusLabel, purchaseLabel, sourceLabel } from "@/lib/admin/constants";

export const dynamic = "force-dynamic";

/** Values that a spreadsheet would run as a formula are neutralised. */
const cell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

/**
 * Lead export as CSV, using the same filters as the leads screen.
 * Admins only: checked here and again by the database function.
 */
export async function GET(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorised" }, { status: 401 });

  const q = new URL(req.url).searchParams;
  const status = LEAD_STATUSES.some((s) => s.value === q.get("status")) ? q.get("status") : null;
  const purchase = PURCHASE_STATUSES.some((s) => s.value === q.get("purchase")) ? q.get("purchase") : null;

  const { data, error } = await rpc<{ rows: Lead[] }>(
    "admin_list_leads",
    {
      p_search: (q.get("q") ?? "").trim().slice(0, 100) || null,
      p_status: status,
      p_source: (q.get("source") ?? "").slice(0, 120) || null,
      p_sort: "newest",
      p_limit: 5000,
      p_offset: 0,
      p_purchase: purchase,
    },
    admin.token
  );
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Export failed" }, { status: 500 });

  const m = (l: Lead, k: string) => (typeof l.meta?.[k] === "string" ? (l.meta[k] as string) : "");
  const head = ["Opt-in date (UTC)", "Name", "Email", "Phone", "Business", "Lead source", "Referring site", "Campaign source", "Campaign", "Lead status", "Purchase status", "Total paid", "Email subscription"];
  const rows = data.rows.map((l) =>
    [
      l.created_at,
      l.name,
      l.email,
      l.phone,
      l.company,
      sourceLabel(l.source),
      m(l, "referrer"),
      m(l, "utm_source"),
      m(l, "utm_campaign"),
      leadStatusLabel(l.status),
      purchaseLabel(l.purchase ?? "none"),
      ((l.paid_minor ?? 0) / 100).toFixed(2),
      l.subscription ?? "",
    ]
      .map(cell)
      .join(",")
  );
  const csv = "﻿" + [head.map(cell).join(","), ...rows].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="synergox-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
