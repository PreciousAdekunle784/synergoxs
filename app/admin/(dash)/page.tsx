import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { FunnelOverview, Overview } from "@/lib/admin/types";
import { BUSINESS_TZ, BUSINESS_TZ_LABEL, formatDate, formatDateTime, offerSourceLabel, sourceLabel } from "@/lib/admin/constants";
import { inquiry } from "@/lib/admin/describe";
import { formatMoney } from "@/lib/money";
import { OPTIN_PAGE, SALES_PAGE } from "@/lib/site";
import { ColumnChart } from "@/components/admin/Charts";
import { Empty, LeadStatusBadge, LoadError, NotConnected, OnboardingBadge, OrderStatusBadge, PageHeader, Pills, Tile } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Overview" };

const RANGES = [7, 30, 90];
const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

export default async function OverviewPage({ searchParams }: { searchParams: { range?: string } }) {
  const admin = await requireAdmin();
  const days = RANGES.includes(Number(searchParams.range)) ? Number(searchParams.range) : 30;
  const [{ data: f, error }, { data: o }] = await Promise.all([
    rpc<FunnelOverview>("admin_funnel_overview", { p_days: days, p_tz: BUSINESS_TZ, p_optin_path: OPTIN_PAGE, p_sales_path: SALES_PAGE }, admin.token),
    rpc<Overview>("admin_overview", { p_days: days, p_tz: BUSINESS_TZ }, admin.token),
  ]);

  const header = (
    <PageHeader
      title="Overview"
      description={f ? `${formatDate(f.from)} to ${formatDate(f.to)} · days counted in ${BUSINESS_TZ_LABEL} · every number is counted from recorded visits and orders` : undefined}
    >
      <Pills label="Date range" items={RANGES.map((r) => ({ href: `/admin?range=${r}`, label: `Last ${r} days`, active: r === days }))} />
    </PageHeader>
  );

  if (error || !f) {
    return (
      <>
        {header}
        <LoadError message={error?.message ?? "No data returned."} />
        <p className="mt-4 text-[0.9rem] text-body">
          If this is the first time opening the dashboard after the funnel rebuild, run{" "}
          <code className="font-mono text-[0.84rem] text-ink">supabase/migrations/0003_sales_funnel.sql</code> in Supabase, then reload.
        </p>
      </>
    );
  }

  const tracking = !!f.tracking_since;
  const cur = f.currency;

  return (
    <>
      {header}

      {!tracking && (
        <div className="mb-5">
          <NotConnected title="Visitor counting hasn't recorded a visit yet">
            The website counts its own visits (no cookies, nothing personal). Visitor and conversion-rate figures
            appear after the first real visit to the live site. Until then they are left blank rather than estimated.
          </NotConnected>
        </div>
      )}

      {f.awaiting_onboarding > 0 && (
        <Link href="/admin/orders?onboarding=awaiting" className="mb-5 flex items-center justify-between gap-4 rounded-card border border-ink bg-paper px-5 py-4 transition-colors hover:bg-mist">
          <span className="text-[0.95rem] text-ink">
            <strong className="font-semibold">{n(f.awaiting_onboarding)} paid {f.awaiting_onboarding === 1 ? "order is" : "orders are"} waiting for a project brief.</strong>{" "}
            <span className="text-body">A nudge by email usually does it.</span>
          </span>
          <span className="shrink-0 text-[0.88rem] font-semibold text-ink underline decoration-green decoration-2 underline-offset-4">View</span>
        </Link>
      )}

      {/* Money */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile strong label="Total revenue" value={formatMoney(f.revenue_minor, cur)} sub={`${formatMoney(f.revenue_all_time_minor, cur)} all time`} href="/admin/orders?status=paid" />
        <Tile label="Average order value" value={f.aov_minor === null ? "—" : formatMoney(f.aov_minor, cur)} muted={f.aov_minor === null} sub={f.aov_minor === null ? "No paid orders in this period" : `Across ${n(f.orders_paid)} paid ${f.orders_paid === 1 ? "order" : "orders"}`} />
        <Tile label="Individual package sales" value={n(f.package_sales)} sub={`${pct(f.package_rate)} of sales-page visitors`} href="/admin/orders?status=paid" />
        <Tile label="Bundle purchases" value={n(f.bundle_sales)} sub={`${pct(f.bundle_rate)} of sales-page visitors`} href="/admin/orders?status=paid" />
      </div>

      {/* Traffic and leads */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Total visitors" value={tracking ? n(f.visitors) : "—"} muted={!tracking} sub={tracking ? `Counting since ${formatDate(f.tracking_since)}` : "Not recorded yet"} href="/admin/analytics" />
        <Tile label="Total opt-ins" value={n(f.optins)} sub={`${n(f.optins_all_time)} all time`} href="/admin/leads" />
        <Tile label="Opt-in conversion rate" value={pct(f.optin_rate)} muted={f.optin_rate === null} sub={f.optin_rate === null ? "Needs opt-in page visits" : `${n(f.optins)} of ${n(f.optin_visitors)} opt-in page visitors`} />
        <Tile label="Sales page visitors" value={tracking ? n(f.sales_visitors) : "—"} muted={!tracking} sub={`${pct(f.sales_rate)} of them bought`} />
      </div>

      {/* Exit offer and checkout */}
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Exit popup impressions" value={n(f.exit_shown)} sub={`${n(f.exit_clicks)} accepted · ${n(f.exit_dismissed)} dismissed`} href="/admin/exit-offer" />
        <Tile label="Exit popup conversion rate" value={pct(f.exit_rate)} muted={f.exit_rate === null} sub={f.exit_rate === null ? "Not shown yet in this period" : `${n(f.exit_purchases)} purchases from ${n(f.exit_shown)} impressions`} href="/admin/exit-offer" />
        <Tile label="Checkouts started" value={n(f.orders_started)} sub={`${n(f.orders_started_paid)} of them paid`} href="/admin/orders" />
        <Tile label="Checkout abandonment" value={pct(f.abandonment_rate)} muted={f.abandonment_rate === null} sub={f.abandonment_rate === null ? "No checkouts started yet" : "Started checkout, didn't pay"} href="/admin/orders?status=pending" />
      </div>

      {/* Trends */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="rev-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="rev-h" className="a-h2">Revenue per day</h2>
            <p className="text-[0.86rem] text-mute">{formatMoney(f.revenue_minor, cur)} in the last {f.days} days</p>
          </div>
          <div className="mt-3">
            <ColumnChart data={f.series.map((s) => ({ day: s.day, value: Math.round(s.revenue_minor / 100) }))} unit={[cur, cur]} height={210} emptyNote="No paid orders in this period." />
          </div>
        </section>
        <section className="a-card" aria-labelledby="opt-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="opt-h" className="a-h2">Opt-ins per day</h2>
            <p className="text-[0.86rem] text-mute">{n(f.optins)} new {f.optins === 1 ? "subscriber" : "subscribers"}</p>
          </div>
          <div className="mt-3">
            <ColumnChart data={f.series.map((s) => ({ day: s.day, value: s.optins }))} unit={["opt-in", "opt-ins"]} height={210} />
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="orders-h">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="orders-h" className="a-h2">Latest orders</h2>
            <Link href="/admin/orders" className="text-[0.86rem] font-medium text-ink underline decoration-green decoration-2 underline-offset-4">All orders</Link>
          </div>
          {f.recent_orders.length === 0 ? (
            <div className="mt-4"><Empty title="No orders yet">The moment someone starts a checkout it appears here, paid or not.</Empty></div>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {f.recent_orders.map((r) => (
                <li key={r.id}>
                  <Link href={`/admin/orders/${r.id}`} className="-mx-2 flex items-start justify-between gap-4 rounded-btn px-2 py-3 transition-colors hover:bg-mist">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-semibold text-ink">{r.name}</span>
                      <span className="block truncate text-[0.84rem] text-body">{r.item_name} · <span className="num font-mono">{formatMoney(r.amount_minor, r.currency)}</span></span>
                      <span className="mt-0.5 block text-[0.78rem] text-mute">{offerSourceLabel(r.offer_source)} · {formatDateTime(r.created_at)}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <OrderStatusBadge status={r.status} />
                      {r.status === "paid" && <OnboardingBadge status={r.onboarding_status} />}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="a-card" aria-labelledby="latest-h">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="latest-h" className="a-h2">Latest leads</h2>
            <Link href="/admin/leads" className="text-[0.86rem] font-medium text-ink underline decoration-green decoration-2 underline-offset-4">All leads</Link>
          </div>
          {!o || o.latest.length === 0 ? (
            <div className="mt-4"><Empty title="No leads yet">People who request the Blueprint, start a checkout or apply for a call appear here.</Empty></div>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {o.latest.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="-mx-2 flex items-start justify-between gap-4 rounded-btn px-2 py-3 transition-colors hover:bg-mist">
                    <span className="min-w-0">
                      <span className="block truncate text-[0.95rem] font-semibold text-ink">{l.name || l.email || "Unnamed"}</span>
                      <span className="block truncate text-[0.84rem] text-body">{inquiry(l)}</span>
                      <span className="mt-0.5 block text-[0.78rem] text-mute">{sourceLabel(l.source)} · {formatDateTime(l.created_at)}</span>
                    </span>
                    <LeadStatusBadge status={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
