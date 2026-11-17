import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { cleanFunnel } from "@/lib/funnel/get";
import type { FunnelOverview } from "@/lib/admin/types";
import { BUSINESS_TZ } from "@/lib/admin/constants";
import { formatMoney } from "@/lib/money";
import { OPTIN_PAGE, SALES_PAGE } from "@/lib/site";
import { LoadError, PageHeader, Pills, Tile } from "@/components/admin/Bits";
import { ExitOfferForm } from "@/components/admin/OfferEditors";

export const metadata: Metadata = { title: "Exit-intent offer" };

const RANGES = [7, 30, 90];
const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number | null) => (v === null ? "—" : `${v}%`);

export default async function ExitOfferPage({ searchParams }: { searchParams: { range?: string } }) {
  const admin = await requireAdmin();
  const days = RANGES.includes(Number(searchParams.range)) ? Number(searchParams.range) : 30;
  const [{ data, error }, { data: stats }] = await Promise.all([
    rpc<Record<string, unknown>>("admin_list_packages", {}, admin.token),
    rpc<FunnelOverview>("admin_funnel_overview", { p_days: days, p_tz: BUSINESS_TZ, p_optin_path: OPTIN_PAGE, p_sales_path: SALES_PAGE }, admin.token),
  ]);
  if (error || !data) {
    return (
      <>
        <PageHeader title="Exit-intent offer" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }
  const f = cleanFunnel(data);
  if (!f.bundle || !f.exit) return <LoadError message="The offer records are missing. Re-run the 0003 migration." />;

  return (
    <>
      <PageHeader
        title="Exit-intent offer"
        description="The popup shown once to someone about to leave the sales page without buying. It offers the complete Growth Suite."
      >
        <Link href={`${SALES_PAGE}?exit_preview=1`} target="_blank" className="a-btn-quiet">Preview the popup</Link>
      </PageHeader>

      {!f.bundle.valid && (
        <div role="alert" className="mb-5 rounded-card border border-[#F1C9C4] bg-[#FEF6F5] p-5 text-[0.92rem] leading-relaxed text-[#8A1C12]">
          <p className="font-semibold">The popup can&apos;t appear at the moment.</p>
          <p className="mt-1">
            It sells the Growth Suite bundle, and the bundle is {f.bundle.active ? "not currently a saving over its packages" : "switched off"}.{" "}
            <Link href="/admin/bundle" className="font-semibold underline underline-offset-2">Fix the bundle</Link> and the popup returns.
          </p>
        </div>
      )}

      <section aria-labelledby="stats-h" className="mb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="stats-h" className="a-h2">How it&apos;s performing</h2>
          <Pills label="Date range" items={RANGES.map((r) => ({ href: `/admin/exit-offer?range=${r}`, label: `${r} days`, active: r === days }))} />
        </div>
        {stats ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Tile label="Impressions" value={n(stats.exit_shown)} sub="Times the popup was shown" />
            <Tile label="Clicks" value={n(stats.exit_clicks)} sub={`${pct(stats.exit_click_rate)} of impressions`} />
            <Tile label="Dismissals" value={n(stats.exit_dismissed)} sub="Closed without accepting" />
            <Tile label="Purchases" value={n(stats.exit_purchases)} sub={formatMoney(stats.exit_revenue_minor, stats.currency)} />
            <Tile strong label="Conversion rate" value={pct(stats.exit_rate)} sub="Purchases ÷ impressions" />
          </div>
        ) : (
          <p className="text-[0.9rem] text-mute">Statistics couldn&apos;t be loaded.</p>
        )}
      </section>

      <div className="a-card">
        <ExitOfferForm offer={f.exit} bundle={f.bundle} currency={f.currency} />
      </div>
    </>
  );
}
