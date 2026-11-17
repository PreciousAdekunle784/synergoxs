import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { FunnelOverview } from "@/lib/admin/types";
import { BUSINESS_TZ, BUSINESS_TZ_LABEL, formatDate } from "@/lib/admin/constants";
import { formatMoney } from "@/lib/money";
import { OPTIN_PAGE, SALES_PAGE } from "@/lib/site";
import { BarList, ColumnChart } from "@/components/admin/Charts";
import { LoadError, NotConnected, PageHeader, Pills, Tile } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Funnel analytics" };

const RANGES = [7, 30, 90];
const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number | null) => (v === null ? "—" : `${v}%`);
const rate = (a: number, b: number) => (b > 0 ? Math.min(100, Math.round((a / b) * 1000) / 10) : null);

export default async function AnalyticsPage({ searchParams }: { searchParams: { range?: string } }) {
  const admin = await requireAdmin();
  const days = RANGES.includes(Number(searchParams.range)) ? Number(searchParams.range) : 30;
  const { data: f, error } = await rpc<FunnelOverview>(
    "admin_funnel_overview",
    { p_days: days, p_tz: BUSINESS_TZ, p_optin_path: OPTIN_PAGE, p_sales_path: SALES_PAGE },
    admin.token
  );

  const header = (
    <PageHeader
      title="Funnel analytics"
      description={f ? `${formatDate(f.from)} to ${formatDate(f.to)} · ${BUSINESS_TZ_LABEL}. Where visitors go, and where they stop.` : undefined}
    >
      <Pills label="Date range" items={RANGES.map((r) => ({ href: `/admin/analytics?range=${r}`, label: `Last ${r} days`, active: r === days }))} />
    </PageHeader>
  );
  if (error || !f) {
    return (
      <>
        {header}
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }

  const cur = f.currency;
  const tracking = !!f.tracking_since;

  /* The journey, top to bottom. Each stage is counted independently from what
     was recorded, so a later stage can occasionally exceed an earlier one
     (someone can reach the sales page from an email without visiting the
     opt-in page in this period). Percentages are of the stage above. */
  const stages = [
    { label: "Visited the opt-in page", value: f.optin_visitors, note: "Unique visits to the Blueprint page" },
    { label: "Requested the Blueprint", value: f.optins, note: "New email subscribers" },
    { label: "Visited the sales page", value: f.sales_visitors, note: "Unique visits to the Growth System page" },
    { label: "Opened a checkout", value: f.checkout_visitors, note: "Unique visits to any checkout page" },
    { label: "Started payment", value: f.orders_started, note: "Submitted their details and went to Paystack" },
    { label: "Paid", value: f.orders_started_paid, note: "Of the checkouts started in this period" },
  ];
  const top = Math.max(1, ...stages.map((s) => s.value));

  return (
    <>
      {header}

      {!tracking && (
        <div className="mb-5">
          <NotConnected title="No visits recorded yet">
            Page visits are counted by the site itself, starting with the first real visit after this version goes
            live. Rates that depend on visits show “—” until then.
          </NotConnected>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tile label="Opt-in conversion rate" value={pct(f.optin_rate)} muted={f.optin_rate === null} sub="Opt-in page visitors who subscribed" />
        <Tile label="Sales page conversion rate" value={pct(f.sales_rate)} muted={f.sales_rate === null} sub="Sales-page visitors who bought anything" />
        <Tile label="Individual package conversion" value={pct(f.package_rate)} muted={f.package_rate === null} sub={`${n(f.package_sales)} package ${f.package_sales === 1 ? "sale" : "sales"}`} />
        <Tile label="Bundle conversion rate" value={pct(f.bundle_rate)} muted={f.bundle_rate === null} sub={`${n(f.bundle_sales)} Growth Suite ${f.bundle_sales === 1 ? "sale" : "sales"}`} />
        <Tile label="Exit popup conversion rate" value={pct(f.exit_rate)} muted={f.exit_rate === null} sub={`${n(f.exit_purchases)} of ${n(f.exit_shown)} impressions bought`} />
      </div>

      {/* The funnel */}
      <section className="a-card mt-5" aria-labelledby="funnel-h">
        <h2 id="funnel-h" className="a-h2">The journey</h2>
        <p className="mt-1 text-[0.84rem] text-mute">Each bar is a count of real visits or orders. The percentage is of the stage above it.</p>
        <ol className="mt-6 space-y-4">
          {stages.map((s, i) => {
            const prev = i > 0 ? stages[i - 1].value : null;
            const r = prev === null ? null : rate(s.value, prev);
            return (
              <li key={s.label} className="grid gap-x-5 gap-y-1.5 sm:grid-cols-[15rem_1fr_7.5rem] sm:items-center">
                <div>
                  <p className="text-[0.92rem] font-semibold text-ink">{s.label}</p>
                  <p className="text-[0.78rem] text-mute">{s.note}</p>
                </div>
                <div className="h-7 bg-mist" aria-hidden>
                  <div className={`h-full ${i === stages.length - 1 ? "bg-green" : "bg-ink"}`} style={{ width: `${Math.max(s.value > 0 ? 1 : 0, (s.value / top) * 100)}%` }} />
                </div>
                <p className="num flex items-baseline gap-2 font-mono text-[1rem] text-ink sm:justify-end">
                  {n(s.value)}
                  {r !== null && <span className="text-[0.76rem] text-mute">{r}%</span>}
                </p>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 border-t border-line pt-4 text-[0.88rem] text-body">
          <strong className="font-semibold text-ink">Checkout abandonment: {pct(f.abandonment_rate)}.</strong>{" "}
          {f.orders_started === 0
            ? "No checkouts were started in this period."
            : `${n(f.orders_started - f.orders_started_paid)} of ${n(f.orders_started)} people who went to pay didn't complete it. They are listed under Orders → Not completed, with their email addresses.`}
        </p>
      </section>

      {/* Per package */}
      <section className="mt-5 overflow-hidden rounded-card border border-line bg-paper" aria-labelledby="items-h">
        <div className="px-5 pt-5 sm:px-6">
          <h2 id="items-h" className="a-h2">By package</h2>
          <p className="mt-1 text-[0.84rem] text-mute">Button clicks, checkouts started, and paid orders for each thing you sell.</p>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="border-y border-line bg-mist/60">
              <tr>
                <th scope="col" className="a-th">Item</th>
                <th scope="col" className="a-th text-right">Buy-button clicks</th>
                <th scope="col" className="a-th text-right">Checkouts started</th>
                <th scope="col" className="a-th text-right">Sales</th>
                <th scope="col" className="a-th text-right">Checkout → paid</th>
                <th scope="col" className="a-th text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {f.by_item.map((it) => (
                <tr key={it.slug} className="border-t border-line first:border-t-0">
                  <td className="a-td">
                    <span className="font-semibold">{it.name}</span>
                    {it.kind === "bundle" && <span className="ml-2 rounded-[3px] bg-ink px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-green">Bundle</span>}
                  </td>
                  <td className="a-td num text-right font-mono">{n(it.clicks)}</td>
                  <td className="a-td num text-right font-mono">{n(it.checkouts)}</td>
                  <td className="a-td num text-right font-mono">{n(it.sales)}</td>
                  <td className="a-td num text-right font-mono text-body">{pct(rate(it.sales, it.checkouts))}</td>
                  <td className="a-td num text-right font-mono">{formatMoney(it.revenue_minor, cur)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="exit-h">
          <h2 id="exit-h" className="a-h2">Exit-intent offer</h2>
          <p className="mt-1 text-[0.84rem] text-mute">What happened each time the offer was shown.</p>
          <div className="mt-5">
            <BarList
              rows={[
                { label: "Shown", value: f.exit_shown },
                { label: "Accepted (went to checkout)", value: f.exit_clicks },
                { label: "Dismissed", value: f.exit_dismissed },
                { label: "Purchased", value: f.exit_purchases },
              ]}
              emptyNote="The exit offer hasn't been shown in this period."
            />
          </div>
          <p className="mt-5 border-t border-line pt-4 text-[0.88rem] text-body">
            Click rate {pct(f.exit_click_rate)} · purchase rate {pct(f.exit_rate)} · revenue from the exit offer{" "}
            <span className="num font-mono text-ink">{formatMoney(f.exit_revenue_minor, cur)}</span>
          </p>
        </section>

        <section className="a-card" aria-labelledby="visits-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="visits-h" className="a-h2">Visitors per day</h2>
            <p className="text-[0.86rem] text-mute">{tracking ? `${n(f.visitors)} in total` : "Not recorded yet"}</p>
          </div>
          <div className="mt-3">
            <ColumnChart data={f.series.map((s) => ({ day: s.day, value: s.visitors }))} unit={["visitor", "visitors"]} height={220} emptyNote={tracking ? undefined : "Waiting for the first recorded visit."} />
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="pages-h">
          <h2 id="pages-h" className="a-h2">Page visits</h2>
          <p className="mt-1 text-[0.84rem] text-mute">Unique visitors per page, last {f.days} days</p>
          <div className="mt-5">
            <BarList rows={f.top_pages.map((p) => ({ label: p.path, value: p.n }))} emptyNote={tracking ? "No visits in this period." : "Waiting for the first recorded visit."} />
          </div>
        </section>
        <section className="a-card" aria-labelledby="src-h">
          <h2 id="src-h" className="a-h2">Where leads came from</h2>
          <p className="mt-1 text-[0.84rem] text-mute">Campaign source if the link carried one, otherwise the referring site</p>
          <div className="mt-5">
            <BarList rows={f.by_source.map((s) => ({ label: s.source, value: s.n }))} emptyNote="No leads in this period." />
          </div>
        </section>
      </div>
    </>
  );
}
