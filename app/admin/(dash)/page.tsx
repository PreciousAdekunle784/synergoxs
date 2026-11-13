import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { Overview } from "@/lib/admin/types";
import {
  BUSINESS_TZ,
  BUSINESS_TZ_LABEL,
  LEAD_STATUSES,
  leadStatusLabel,
  formatDate,
  formatDateTime,
  sourceLabel,
  timeAgo,
} from "@/lib/admin/constants";
import { inquiry } from "@/lib/admin/describe";
import { BarList, ColumnChart } from "@/components/admin/Charts";
import { Empty, LeadStatusBadge, LoadError, NotConnected, PageHeader, Pills } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Overview" };

const RANGES = [7, 30, 90];

const activityText: Record<string, (who: string, detail: string | null) => string> = {
  lead: (who, d) => `${who} became a lead${d ? ` (${sourceLabel(d).toLowerCase()})` : ""}`,
  consultation_requested: (who, d) => `${who}${d ? ` from ${d}` : ""} applied for a teardown call`,
  call_booked: (who, d) => `${who}${d ? ` from ${d}` : ""} booked a call`,
  status_changed: (who, d) =>
    `${who} moved ${d ? d.split(" → ").map(leadStatusLabel).join(" → ") : "to a new status"}`,
  note_added: (who) => `Note added on ${who}`,
};

function Tile({
  label,
  value,
  sub,
  href,
  muted = false,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  href?: string;
  muted?: boolean;
}) {
  const body = (
    <>
      <p className="text-[0.84rem] font-medium text-body">{label}</p>
      <p className={`mt-2 font-sans text-[2rem] font-semibold leading-none tracking-tight ${muted ? "text-mute" : "text-ink"}`}>
        {value}
      </p>
      <p className="mt-2 text-[0.8rem] leading-snug text-mute">{sub}</p>
    </>
  );
  return href ? (
    <Link href={href} className="a-card block transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-card">
      {body}
    </Link>
  ) : (
    <div className="a-card">{body}</div>
  );
}

export default async function OverviewPage({ searchParams }: { searchParams: { range?: string } }) {
  const admin = await requireAdmin();
  const days = RANGES.includes(Number(searchParams.range)) ? Number(searchParams.range) : 30;
  const { data: o, error } = await rpc<Overview>("admin_overview", { p_days: days, p_tz: BUSINESS_TZ }, admin.token);

  const header = (
    <PageHeader title="Overview" description={o ? `${formatDate(o.from)} to ${formatDate(o.to)} · days counted in ${BUSINESS_TZ_LABEL}` : undefined}>
      <Pills
        label="Date range"
        items={RANGES.map((r) => ({ href: `/admin?range=${r}`, label: `Last ${r} days`, active: r === days }))}
      />
    </PageHeader>
  );

  if (error || !o) {
    return (
      <>
        {header}
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }

  const tracking = !!o.tracking_since;
  const n = (v: number) => v.toLocaleString("en-GB");

  return (
    <>
      {header}

      {!tracking && (
        <div className="mb-5">
          <NotConnected title="Visitor counting hasn't recorded a visit yet">
            The website counts its own visits (no cookies, nothing personal) and sends them here.
            Numbers will appear after the first real visit to the live site. Until then, visitor
            and conversion figures are left blank rather than estimated.
          </NotConnected>
        </div>
      )}

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tile
          label="Website visitors"
          value={tracking ? n(o.visitors) : "—"}
          muted={!tracking}
          sub={tracking ? `${n(o.page_views)} page views · counting since ${formatDate(o.tracking_since)}` : "Not recorded yet"}
        />
        <Tile label="Leads" value={n(o.leads)} sub={`${n(o.leads_all_time)} all time`} href="/admin/leads" />
        <Tile
          label="Consultation bookings"
          value={n(o.bookings)}
          sub={`${n(o.consultation_requests)} applied · ${n(o.upcoming)} upcoming`}
          href="/admin/consultations"
        />
        <Tile
          label="New inquiries"
          value={n(o.new_inquiries)}
          sub="Leads still marked New"
          href="/admin/leads?status=new"
        />
        <Tile
          label="Conversion rate"
          value={o.conversion_rate === null ? "—" : `${o.conversion_rate}%`}
          muted={o.conversion_rate === null}
          sub={o.conversion_rate === null ? "Needs visitor data" : "Visitors who became leads"}
        />
      </div>

      {/* Trend */}
      <section className="a-card mt-5" aria-labelledby="trend-h">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="trend-h" className="a-h2">Leads per day</h2>
          <p className="text-[0.86rem] text-mute">{n(o.leads)} in the last {o.days} days</p>
        </div>
        <div className="mt-3">
          <ColumnChart data={o.series.map((s) => ({ day: s.day, value: s.leads }))} unit={["lead", "leads"]} height={240} />
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="visits-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="visits-h" className="a-h2">Visitors per day</h2>
            <p className="text-[0.86rem] text-mute">{tracking ? `${n(o.visitors)} ${o.visitors === 1 ? "visitor" : "visitors"}` : "Not recorded yet"}</p>
          </div>
          <div className="mt-3">
            <ColumnChart
              data={o.series.map((s) => ({ day: s.day, value: s.visitors }))}
              unit={["visitor", "visitors"]}
              height={190}
              emptyNote={tracking ? undefined : "Waiting for the first recorded visit."}
            />
          </div>
        </section>
        <section className="a-card" aria-labelledby="book-h">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="book-h" className="a-h2">Calls booked per day</h2>
            <p className="text-[0.86rem] text-mute">{n(o.bookings)} booked</p>
          </div>
          <div className="mt-3">
            <ColumnChart data={o.series.map((s) => ({ day: s.day, value: s.bookings }))} unit={["booking", "bookings"]} height={190} />
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="a-card" aria-labelledby="pipe-h">
          <h2 id="pipe-h" className="a-h2">Pipeline</h2>
          <p className="mt-1 text-[0.84rem] text-mute">All leads, by status</p>
          <div className="mt-5">
            <BarList
              rows={LEAD_STATUSES.map((s) => ({
                label: s.label,
                value: o.by_status[s.value] ?? 0,
                href: `/admin/leads?status=${s.value}`,
              }))}
              emptyNote="No leads yet."
            />
          </div>
        </section>
        <section className="a-card" aria-labelledby="src-h">
          <h2 id="src-h" className="a-h2">Where leads came from</h2>
          <p className="mt-1 text-[0.84rem] text-mute">Last {o.days} days</p>
          <div className="mt-5">
            <BarList
              rows={o.by_source.map((s) => ({ label: sourceLabel(s.source), value: s.n }))}
              emptyNote="No leads in this period."
            />
          </div>
        </section>
        <section className="a-card" aria-labelledby="pages-h">
          <h2 id="pages-h" className="a-h2">Most visited pages</h2>
          <p className="mt-1 text-[0.84rem] text-mute">Visitors, last {o.days} days</p>
          <div className="mt-5">
            <BarList
              rows={o.top_pages.map((p) => ({ label: p.path, value: p.n }))}
              emptyNote={tracking ? "No visits in this period." : "Waiting for the first recorded visit."}
            />
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="a-card" aria-labelledby="latest-h">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="latest-h" className="a-h2">Latest form submissions</h2>
            <Link href="/admin/leads" className="text-[0.86rem] font-medium text-ink underline decoration-green decoration-2 underline-offset-4">
              All leads
            </Link>
          </div>
          {o.latest.length === 0 ? (
            <div className="mt-4"><Empty title="No submissions yet">New leads from the website appear here the moment they come in.</Empty></div>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {o.latest.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="-mx-2 flex items-start justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-mist">
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

        <section className="a-card" aria-labelledby="act-h">
          <h2 id="act-h" className="a-h2">Recent activity</h2>
          {o.activity.length === 0 ? (
            <p className="mt-4 text-[0.9rem] text-mute">Nothing has happened yet.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {o.activity.map((a, i) => {
                const text = (activityText[a.type] ?? ((w: string) => w))(a.who, a.detail);
                return (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${a.type === "call_booked" || a.type === "lead" ? "bg-green" : "bg-ink/25"}`} />
                    <span className="min-w-0">
                      <span className="block text-[0.9rem] leading-snug text-ink">
                        {a.lead_id ? <Link href={`/admin/leads/${a.lead_id}`} className="underline-offset-4 hover:underline">{text}</Link> : text}
                      </span>
                      <span className="block text-[0.78rem] text-mute">{timeAgo(a.at)}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
