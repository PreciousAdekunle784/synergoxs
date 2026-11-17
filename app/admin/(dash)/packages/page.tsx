import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { cleanFunnel } from "@/lib/funnel/get";
import { formatMoney } from "@/lib/money";
import { SALES_PAGE } from "@/lib/site";
import { LoadError, PageHeader } from "@/components/admin/Bits";
import { CurrencyForm, PackageDelete, PackageForm } from "@/components/admin/OfferEditors";

export const metadata: Metadata = { title: "Packages" };

export default async function PackagesPage() {
  const admin = await requireAdmin();
  const { data, error } = await rpc<Record<string, unknown>>("admin_list_packages", {}, admin.token);
  if (error || !data) {
    return (
      <>
        <PageHeader title="Packages" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }
  const f = cleanFunnel(data);
  const bundle = f.bundle;

  return (
    <>
      <PageHeader
        title="Packages"
        description="What you sell, one at a time. Each package has its own price and its own checkout. Changes go live on the sales page as soon as you save."
      >
        <Link href={SALES_PAGE + "#packages"} target="_blank" className="a-btn-quiet">View on the site</Link>
      </PageHeader>

      {bundle && bundle.active && !bundle.valid && (
        <div role="alert" className="mb-5 rounded-card border border-[#F1C9C4] bg-[#FEF6F5] p-5 text-[0.92rem] leading-relaxed text-[#8A1C12]">
          <p className="font-semibold">The Growth Suite bundle is hidden from the site right now.</p>
          <p className="mt-1">
            At current prices the packages in it total {formatMoney(bundle.total_minor, f.currency)} and the bundle costs{" "}
            {formatMoney(bundle.price_minor, f.currency)}, so it would no longer be a saving.{" "}
            <Link href="/admin/bundle" className="font-semibold underline underline-offset-2">Adjust the bundle</Link>.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {f.packages.map((p, i) => (
          <details key={p.id} className="group rounded-card border border-line bg-paper open:border-ink" id={p.slug}>
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 [&::-webkit-details-marker]:hidden sm:px-6">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mute">Plan {String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 font-display text-[1.15rem] font-extrabold tracking-tighter2 text-ink">{p.name}</span>
              <span className="flex items-center gap-2">
                {!p.active && <span className="rounded-[3px] bg-mist px-2 py-1 text-[0.72rem] font-semibold text-mute">Hidden</span>}
                {p.active && !p.checkout_enabled && <span className="rounded-[3px] border border-ink/25 px-2 py-1 text-[0.72rem] font-semibold text-ink">Checkout off</span>}
                {p.active && p.checkout_enabled && <span className="rounded-[3px] bg-green px-2 py-1 text-[0.72rem] font-semibold text-ink">Live</span>}
              </span>
              <span className="num font-mono text-[1rem] text-ink">{formatMoney(p.price_minor, f.currency)}</span>
              <span className="text-[0.84rem] font-semibold text-ink underline decoration-green decoration-2 underline-offset-4 group-open:hidden">Edit</span>
              <span className="hidden text-[0.84rem] font-semibold text-mute group-open:inline">Close</span>
            </summary>
            <div className="border-t border-line px-5 py-5 sm:px-6">
              <PackageForm pkg={p} currency={f.currency} index={i} />
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-[0.82rem] text-mute">
                  Checkout address: <span className="font-mono text-ink">/checkout/{p.slug}</span>
                </p>
                <PackageDelete id={p.id} name={p.name} />
              </div>
            </div>
          </details>
        ))}
        {f.packages.length === 0 && (
          <p className="rounded-card border border-dashed border-line bg-paper px-6 py-10 text-center text-[0.95rem] text-body">
            No packages yet. Add the first one below.
          </p>
        )}
      </div>

      <section className="a-card mt-6" aria-labelledby="new-h">
        <h2 id="new-h" className="a-h2">Add a package</h2>
        <p className="mt-1 text-[0.88rem] text-body">A new package appears on the sales page straight away if it&apos;s marked “Show on the sales page”.</p>
        <div className="mt-5">
          <PackageForm pkg={null} currency={f.currency} index={f.packages.length} />
        </div>
      </section>

      <section className="a-card mt-6" aria-labelledby="cur-h">
        <h2 id="cur-h" className="a-h2">Currency</h2>
        <p className="mt-1 max-w-2xl text-[0.88rem] leading-relaxed text-body">
          All prices are shown and charged in this currency. Changing it does not convert the numbers: update each
          price afterwards. Your Paystack account must be enabled for the currency you choose.
        </p>
        <div className="mt-4">
          <CurrencyForm currency={f.currency} />
        </div>
      </section>
    </>
  );
}
