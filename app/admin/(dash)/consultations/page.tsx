import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { Consultation } from "@/lib/admin/types";
import { CONSULTATION_STATUSES, formatDateTime, toLocalInput } from "@/lib/admin/constants";
import { keyLabel, showValue } from "@/lib/admin/describe";
import { ConsultationBadge, Empty, LoadError, NotConnected, PageHeader, Pills } from "@/components/admin/Bits";
import ConsultationCard from "@/components/admin/ConsultationCard";

export const metadata: Metadata = { title: "Consultations" };

const ANSWER_KEYS = ["businessModel", "monthlyRevenue", "monthlyAdSpend", "biggestBottleneck"];

export default async function ConsultationsPage({ searchParams }: { searchParams: { status?: string } }) {
  const admin = await requireAdmin();
  const { data, error } = await rpc<Consultation[]>("admin_list_consultations", { p_status: null }, admin.token);

  if (error || !data) {
    return (
      <>
        <PageHeader title="Consultations" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }

  const filter = CONSULTATION_STATUSES.some((s) => s.value === searchParams.status) ? searchParams.status! : "";
  const now = Date.now();
  const count = (s: string) => data.filter((c) => c.status === s).length;

  const card = (c: Consultation) => (
    <ConsultationCard
      key={c.id}
      c={c}
      badge={<ConsultationBadge status={c.status} />}
      applied={formatDateTime(c.created_at)}
      when={c.scheduled_at ? formatDateTime(c.scheduled_at) : null}
      localValue={toLocalInput(c.scheduled_at)}
      answers={ANSWER_KEYS.filter((k) => c.answers?.[k]).map((k) => ({ label: keyLabel(k), value: showValue(c.answers[k]) }))}
    />
  );

  // Groups, in the order they need attention.
  const isUpcoming = (c: Consultation) => c.status === "booked" && !!c.scheduled_at && new Date(c.scheduled_at).getTime() >= now;
  const needsTime = (c: Consultation) => c.status === "booked" && !c.scheduled_at;
  const overdue = (c: Consultation) => c.status === "booked" && !!c.scheduled_at && new Date(c.scheduled_at).getTime() < now;
  const groups = [
    {
      title: "Upcoming calls",
      note: "Soonest first.",
      rows: data.filter(isUpcoming).sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime()),
    },
    { title: "Booked, call time not recorded", note: "Add the time from your Calendly invite so it shows under Upcoming.", rows: data.filter(needsTime) },
    { title: "Call time has passed", note: "Mark each one Completed or No-show.", rows: data.filter(overdue) },
    { title: "Applied, hasn't picked a time", note: "They filled in the form but didn't finish booking. Worth a follow-up.", rows: data.filter((c) => c.status === "requested") },
    { title: "Closed", note: "Completed, no-show and cancelled.", rows: data.filter((c) => ["completed", "no_show", "cancelled"].includes(c.status)) },
  ];

  const calendlyConnected = !!process.env.CALENDLY_API_TOKEN;

  return (
    <>
      <PageHeader
        title="Consultations"
        description="Every teardown-call application from the booking page, and what happened to it."
      />

      {!calendlyConnected && (
        <div className="mb-5">
          <NotConnected title="Call times aren't filled in automatically yet">
            The website knows when someone books, but Calendly only shares the chosen time through
            its API. Until a Calendly token is added (see Settings), enter each call time here from
            your Calendly invite.
          </NotConnected>
        </div>
      )}

      <div className="mb-6">
        <Pills
          label="Filter by status"
          items={[
            { href: "/admin/consultations", label: "All", active: !filter, count: data.length },
            ...CONSULTATION_STATUSES.map((s) => ({
              href: `/admin/consultations?status=${s.value}`,
              label: s.label,
              active: filter === s.value,
              count: count(s.value),
            })),
          ]}
        />
      </div>

      {data.length === 0 ? (
        <Empty title="No consultation requests yet">
          When someone completes the booking form on the website, their request appears here, and
          moves to Booked when Calendly confirms a time.
        </Empty>
      ) : filter && data.filter((c) => c.status === filter).length === 0 ? (
        <Empty title="Nothing with that status" />
      ) : (
        /* One list for every group. Cards are keyed by id, so when saving moves a
           card to another group it keeps its place in React and its "Saved" message. */
        <div className="grid gap-4 xl:grid-cols-2">
          {filter
            ? data.filter((c) => c.status === filter).map(card)
            : groups
                .filter((g) => g.rows.length > 0)
                .flatMap((g, gi) => [
                  <div key={`h-${g.title}`} className={`xl:col-span-2 ${gi > 0 ? "mt-6" : ""}`}>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h2 className="a-h2">{g.title}</h2>
                      <span className="num text-[0.86rem] text-mute">{g.rows.length}</span>
                    </div>
                    <p className="mt-1 text-[0.88rem] text-body">{g.note}</p>
                  </div>,
                  ...g.rows.map(card),
                ])}
        </div>
      )}
    </>
  );
}
