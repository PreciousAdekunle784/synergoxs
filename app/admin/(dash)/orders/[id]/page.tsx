import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { formatDateTime, offerSourceLabel } from "@/lib/admin/constants";
import { formatMoney } from "@/lib/money";
import type { Order } from "@/lib/funnel/types";
import { LoadError, OnboardingBadge, OrderStatusBadge, PageHeader } from "@/components/admin/Bits";
import { OrderProgressForm, RecheckForm } from "@/components/admin/OrderForms";

export const metadata: Metadata = { title: "Order" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9.5rem_1fr] gap-3 border-t border-line py-3 text-[0.92rem] first:border-t-0">
      <dt className="text-mute">{k}</dt>
      <dd className="min-w-0 text-ink [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!UUID.test(params.id)) notFound();
  const { data: o, error } = await rpc<Order | null>("admin_get_order", { p_id: params.id }, admin.token);
  if (error) {
    return (
      <>
        <PageHeader title="Order" />
        <LoadError message={error.message} />
      </>
    );
  }
  if (!o) notFound();

  const cur = o.currency;
  const brief = Object.entries(o.onboarding ?? {});

  return (
    <>
      <p className="mb-3 text-[0.88rem]">
        <Link href="/admin/orders" className="text-mute underline-offset-4 hover:text-ink hover:underline">← All orders</Link>
      </p>
      <PageHeader title={o.item_name} description={`${o.name} · ${o.reference}`}>
        <OrderStatusBadge status={o.status} />
        {o.status === "paid" && <OnboardingBadge status={o.onboarding_status} />}
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <div className="space-y-5">
          <section className="a-card" aria-labelledby="pay-h">
            <h2 id="pay-h" className="a-h2">Payment</h2>
            <dl className="mt-3">
              <Row k="Status"><OrderStatusBadge status={o.status} /></Row>
              <Row k="Amount charged"><span className="num font-mono">{formatMoney(o.amount_minor, cur)}</span></Row>
              {o.status === "paid" && <Row k="Amount received"><span className="num font-mono font-medium">{formatMoney(o.amount_paid_minor, cur)}</span></Row>}
              {o.list_minor > o.amount_minor && <Row k="Individual value"><span className="num font-mono text-body">{formatMoney(o.list_minor, cur)}</span> <span className="text-mute">(saved {formatMoney(o.list_minor - o.amount_minor, cur)})</span></Row>}
              <Row k="Transaction reference"><span className="font-mono text-[0.86rem]">{o.reference}</span></Row>
              {o.gateway_id && <Row k="Paystack ID"><span className="font-mono text-[0.86rem]">{o.gateway_id}</span></Row>}
              {o.channel && <Row k="Paid by">{o.channel.replace(/_/g, " ")}</Row>}
              {o.verified_via && <Row k="Confirmed by">{{ callback: "Paystack verification when the buyer returned", webhook: "Paystack webhook", admin: "Manual re-check from this dashboard" }[o.verified_via] ?? o.verified_via}</Row>}
              <Row k="Checkout started">{formatDateTime(o.created_at)}</Row>
              {o.paid_at && <Row k="Paid">{formatDateTime(o.paid_at)}</Row>}
              <Row k="Came from">{offerSourceLabel(o.offer_source)}</Row>
              {o.failure_reason && <Row k="Reason">{o.failure_reason}</Row>}
              {o.status === "paid" && <Row k="Receipt email">{o.confirmation_sent_at ? `Sent ${formatDateTime(o.confirmation_sent_at)}` : "Not sent (email isn't connected, or the send failed)"}</Row>}
            </dl>
            {o.status !== "paid" && (
              <div className="mt-4 border-t border-line pt-4">
                <p className="mb-3 text-[0.88rem] leading-relaxed text-body">
                  If the customer says they paid, ask Paystack directly. The order is only marked paid if Paystack
                  confirms a successful charge for the full amount.
                </p>
                <RecheckForm id={o.id} />
              </div>
            )}
          </section>

          <section className="a-card" aria-labelledby="items-h">
            <h2 id="items-h" className="a-h2">What they bought</h2>
            <ul className="mt-3 divide-y divide-line">
              {o.items.map((it) => (
                <li key={it.slug} className="py-4 first:pt-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold text-ink">{it.name}</p>
                    <p className="num font-mono text-[0.88rem] text-body">{formatMoney(it.price_minor, cur)}</p>
                  </div>
                  <ul className="mt-2 grid gap-x-6 gap-y-1 text-[0.88rem] text-body sm:grid-cols-2">
                    {it.deliverables.map((d) => <li key={d}>– {d}</li>)}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.8rem] text-mute">Recorded as it was at the time of purchase. Later edits to the package don&apos;t change this.</p>
          </section>

          <section className="a-card" aria-labelledby="brief-h">
            <h2 id="brief-h" className="a-h2">Project brief</h2>
            {brief.length === 0 ? (
              <p className="mt-3 text-[0.92rem] leading-relaxed text-body">
                {o.status === "paid"
                  ? "Not received yet. The customer was sent a link to the brief with their receipt."
                  : "The brief is only requested once the order is paid."}
              </p>
            ) : (
              <>
                <p className="mt-1 text-[0.84rem] text-mute">Received {formatDateTime(o.onboarding_submitted_at)}</p>
                <dl className="mt-3">
                  {brief.map(([k, v]) => (
                    <div key={k} className="border-t border-line py-3 first:border-t-0">
                      <dt className="text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-mute">{k}</dt>
                      <dd className="mt-1 whitespace-pre-wrap text-[0.94rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className="a-card" aria-labelledby="cust-h">
            <h2 id="cust-h" className="a-h2">Customer</h2>
            <dl className="mt-3">
              <Row k="Name">{o.name}</Row>
              <Row k="Email"><a href={`mailto:${o.email}?subject=Your SYNERGOX order ${o.reference}`} className="underline decoration-green decoration-2 underline-offset-4">{o.email}</a></Row>
              <Row k="Phone">{o.phone ?? <span className="text-mute">Not given</span>}</Row>
            </dl>
            {o.lead_id && (
              <Link href={`/admin/leads/${o.lead_id}`} className="a-btn-quiet mt-3">Open their lead record</Link>
            )}
          </section>

          {o.status === "paid" && (
            <section className="a-card" aria-labelledby="prog-h">
              <h2 id="prog-h" className="a-h2">Track onboarding</h2>
              <div className="mt-4">
                <OrderProgressForm id={o.id} status={o.onboarding_status} notes={o.admin_notes} />
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
