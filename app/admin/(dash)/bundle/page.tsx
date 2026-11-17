import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { cleanFunnel } from "@/lib/funnel/get";
import { SALES_PAGE } from "@/lib/site";
import { LoadError, PageHeader } from "@/components/admin/Bits";
import { BundleForm } from "@/components/admin/OfferEditors";

export const metadata: Metadata = { title: "Growth Suite bundle" };

export default async function BundlePage() {
  const admin = await requireAdmin();
  const { data, error } = await rpc<Record<string, unknown>>("admin_list_packages", {}, admin.token);
  if (error || !data) {
    return (
      <>
        <PageHeader title="Growth Suite bundle" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }
  const f = cleanFunnel(data);
  if (!f.bundle) return <LoadError message="The bundle record is missing. Re-run the 0003 migration." />;

  return (
    <>
      <PageHeader
        title="Growth Suite bundle"
        description="The all-in-one offer. You choose what's in it and what it costs; the combined value and the saving are worked out from the packages' current prices, here and on the site."
      >
        <Link href={SALES_PAGE + "#suite"} target="_blank" className="a-btn-quiet">View on the site</Link>
      </PageHeader>
      <div className="a-card">
        <BundleForm bundle={f.bundle} packages={f.packages} currency={f.currency} />
      </div>
      <p className="mt-4 max-w-3xl text-[0.86rem] leading-relaxed text-mute">
        The site only ever shows this bundle while it is a real saving. If a later price change to a package makes the
        bundle cost the same as, or more than, its parts, it is hidden automatically until you adjust it, and a warning
        appears on the Packages screen.
      </p>
    </>
  );
}
