import Link from "next/link";
import { consultationStatusLabel, leadStatusLabel } from "@/lib/admin/constants";

/* Small server-safe pieces shared across dashboard pages. */

const leadTone: Record<string, string> = {
  new: "bg-green text-ink",
  contacted: "border border-ink/25 bg-paper text-ink",
  qualified: "border border-ink bg-paper text-ink",
  consultation_booked: "bg-ink text-white",
  converted: "bg-greenTint text-greenDeep",
  lost: "bg-mist text-mute",
};

const consultTone: Record<string, string> = {
  requested: "border border-ink/25 bg-paper text-ink",
  booked: "bg-ink text-white",
  completed: "bg-greenTint text-greenDeep",
  no_show: "bg-mist text-mute",
  cancelled: "bg-mist text-mute line-through",
};

const badge =
  "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[0.74rem] font-semibold leading-none";

export function LeadStatusBadge({ status }: { status: string }) {
  return <span className={`${badge} ${leadTone[status] ?? leadTone.contacted}`}>{leadStatusLabel(status)}</span>;
}

export function ConsultationBadge({ status }: { status: string }) {
  return (
    <span className={`${badge} ${consultTone[status] ?? consultTone.requested}`}>
      {consultationStatusLabel(status)}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="a-h1">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-body">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** A row of pill links where exactly one is current (date ranges, tabs, filters). */
export function Pills({
  items,
  label,
}: {
  items: { href: string; label: string; active: boolean; count?: number }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={i.active ? "page" : undefined}
          scroll={false}
          className={`inline-flex min-h-[38px] items-center gap-2 rounded-full px-4 py-1.5 text-[0.86rem] font-semibold transition-colors duration-200 ${
            i.active ? "bg-ink text-white" : "border border-line bg-paper text-body hover:border-ink hover:text-ink"
          }`}
        >
          {i.label}
          {typeof i.count === "number" && (
            <span className={`num text-[0.76rem] ${i.active ? "text-white/70" : "text-mute"}`}>{i.count}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function Empty({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper px-6 py-12 text-center">
      <p className="font-display text-[1.1rem] font-extrabold tracking-tighter2 text-ink">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-[0.92rem] leading-relaxed text-body">{children}</div>}
    </div>
  );
}

/** Shown when the database call behind a page failed. Says so plainly. */
export function LoadError({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-card border border-[#F1C9C4] bg-paper p-6">
      <p className="font-display text-[1.1rem] font-extrabold tracking-tighter2 text-ink">
        This page couldn&apos;t load its data.
      </p>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-body">
        The database answered: <span className="font-medium text-ink">{message}</span>
      </p>
      <p className="mt-2 text-[0.88rem] leading-relaxed text-mute">
        If the dashboard was only just set up, check that the migration in
        supabase/migrations has been run. Otherwise reload the page.
      </p>
    </div>
  );
}

/** Notice for a number that can't be shown because its data source isn't connected. */
export function NotConnected({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-paper p-5">
      <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist text-ink">
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 4v4.5M7.5 11v.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <p className="text-[0.95rem] font-semibold text-ink">{title}</p>
        <div className="mt-1 text-[0.9rem] leading-relaxed text-body">{children}</div>
      </div>
    </div>
  );
}
