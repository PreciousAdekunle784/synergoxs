import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { ONBOARDING_STATUSES, ORDER_STATUSES, formatDateTime, offerSourceLabel } from "@/lib/admin/constants";
import { formatMoney } from "@/lib/money";
import type { Order } from "@/lib/funnel/types";
import { Empty, LoadError, OnboardingBadge, OrderStatusBadge, PageHeader, Pills } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Orders" };

const PER_PAGE = 25;
type Params = { q?: string; status?: string; onboarding?: string; page?: string };

export default async function OrdersPage({ searchParams }: { searchParams: Params }) {
  const admin = await requireAdmin();
  const q = (searchParams.q ?? "").trim().slice(0, 100);
  const status = ORDER_STATUSES.some((s) => s.value === searchParams.status) ? searchParams.status! : "";
  const onboarding = ONBOARDING_STATUSES.some((s) => s.value === searchParams.onboarding) ? searchParams.onboarding! : "";
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);

  const { data, error } = await rpc<{ total: number; counts: Record<string, number>; rows: Order[] }>(
    "admin_list_orders",
    { p_search: q || null, p_status: status || null, p_onboarding: onboarding || null, p_limit: PER_PAGE, p_offset: (page - 1) * PER_PAGE },
    admin.token
  );

  if (error || !data) {
    return (
      <>
        <PageHeader title="Orders" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }

  const pages = Math.max(1, Math.ceil(data.total / PER_PAGE));
  const all = Object.values(data.counts).reduce((a, b) => a + b, 0);
  const link = (o: { status?: string; page?: number }) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    const st = o.status ?? status;
    if (st) sp.set("status", st);
    if (onboarding && o.status === undefined) sp.set("onboarding", onboarding);
    if (o.page && o.page > 1) sp.set("page", String(o.page));
    const s = sp.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every checkout that was started. An order is Paid only after Paystack itself has confirmed the money arrived."
      />

      <div className="mb-4">
        <Pills
          label="Payment status"
          items={[
            { href: link({ status: "" }), label: "All", active: !status && !onboarding, count: all },
            ...ORDER_STATUSES.map((s) => ({ href: link({ status: s.value }), label: s.label, active: status === s.value && !onboarding, count: data.counts[s.value] ?? 0 })),
          ]}
        />
      </div>

      <form method="get" className="a-card mb-5 grid gap-3 sm:grid-cols-[1.6fr_1fr_auto] sm:items-end">
        {status && <input type="hidden" name="status" value={status} />}
        <div>
          <label htmlFor="q" className="a-label">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Name, email, reference or package…" className="a-input" />
        </div>
        <div>
          <label htmlFor="onboarding" className="a-label">Onboarding</label>
          <select id="onboarding" name="onboarding" defaultValue={onboarding} className="a-input">
            <option value="">Any stage</option>
            {ONBOARDING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="a-btn-dark">Apply</button>
          {(q || onboarding) && <Link href={link({ status })} className="a-btn-quiet">Clear</Link>}
        </div>
      </form>

      <p className="mb-3 text-[0.88rem] text-mute" aria-live="polite">
        {data.total.toLocaleString("en-GB")} {data.total === 1 ? "order" : "orders"}
      </p>

      {data.rows.length === 0 ? (
        <Empty title={all === 0 ? "No orders yet" : "No orders match"}>
          {all === 0 ? "When someone starts a checkout on the site, it appears here whether or not they complete the payment." : "Try a different search or filter."}
        </Empty>
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="border-b border-line bg-mist/60">
                <tr>
                  <th scope="col" className="a-th">Customer</th>
                  <th scope="col" className="a-th">Package</th>
                  <th scope="col" className="a-th text-right">Amount</th>
                  <th scope="col" className="a-th">Payment</th>
                  <th scope="col" className="a-th">Onboarding</th>
                  <th scope="col" className="a-th">Reference</th>
                  <th scope="col" className="a-th">Started</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((o) => (
                  <tr key={o.id} className="border-t border-line transition-colors first:border-t-0 hover:bg-mist/60">
                    <td className="a-td">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-ink underline-offset-4 hover:underline">{o.name}</Link>
                      <span className="block max-w-[220px] truncate text-[0.84rem] text-body">{o.email}</span>
                    </td>
                    <td className="a-td">
                      <span className="block max-w-[220px] truncate">{o.item_name}</span>
                      <span className="block text-[0.78rem] text-mute">{o.item_type === "bundle" ? "Bundle" : "Package"} · {offerSourceLabel(o.offer_source)}</span>
                    </td>
                    <td className="a-td num whitespace-nowrap text-right font-mono">{formatMoney(o.amount_paid_minor ?? o.amount_minor, o.currency)}</td>
                    <td className="a-td"><OrderStatusBadge status={o.status} /></td>
                    <td className="a-td">{o.status === "paid" ? <OnboardingBadge status={o.onboarding_status} /> : <span className="text-mute">—</span>}</td>
                    <td className="a-td whitespace-nowrap font-mono text-[0.8rem] text-body">{o.reference}</td>
                    <td className="a-td whitespace-nowrap text-[0.86rem] text-body">{formatDateTime(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {data.rows.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="a-card block">
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{o.name}</span>
                      <span className="block truncate text-[0.86rem] text-body">{o.item_name}</span>
                    </span>
                    <OrderStatusBadge status={o.status} />
                  </span>
                  <span className="mt-2 flex items-center justify-between gap-3">
                    <span className="num font-mono text-[0.95rem] text-ink">{formatMoney(o.amount_paid_minor ?? o.amount_minor, o.currency)}</span>
                    {o.status === "paid" && <OnboardingBadge status={o.onboarding_status} />}
                  </span>
                  <span className="mt-2 block text-[0.78rem] text-mute">{o.reference} · {formatDateTime(o.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-5 flex items-center justify-between gap-3">
              {page > 1 ? <Link href={link({ page: page - 1 })} className="a-btn-quiet">← Newer</Link> : <span />}
              <span className="text-[0.86rem] text-mute">Page {page} of {pages}</span>
              {page < pages ? <Link href={link({ page: page + 1 })} className="a-btn-quiet">Older →</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </>
  );
}
