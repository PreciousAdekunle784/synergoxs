import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { Lead } from "@/lib/admin/types";
import { LEAD_STATUSES, formatDateTime, sourceLabel } from "@/lib/admin/constants";
import { inquiry } from "@/lib/admin/describe";
import { Empty, LeadStatusBadge, LoadError, PageHeader } from "@/components/admin/Bits";

export const metadata: Metadata = { title: "Leads" };

const PER_PAGE = 25;
const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "status", label: "By status" },
];

type Params = { q?: string; status?: string; source?: string; sort?: string; page?: string; deleted?: string };

export default async function LeadsPage({ searchParams }: { searchParams: Params }) {
  const admin = await requireAdmin();
  const q = (searchParams.q ?? "").trim().slice(0, 100);
  const status = LEAD_STATUSES.some((s) => s.value === searchParams.status) ? searchParams.status! : "";
  const source = (searchParams.source ?? "").slice(0, 120);
  const sort = SORTS.some((s) => s.value === searchParams.sort) ? searchParams.sort! : "newest";
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);

  const { data, error } = await rpc<{ total: number; rows: Lead[]; sources: string[] }>(
    "admin_list_leads",
    { p_search: q || null, p_status: status || null, p_source: source || null, p_sort: sort, p_limit: PER_PAGE, p_offset: (page - 1) * PER_PAGE },
    admin.token
  );

  if (error || !data) {
    return (
      <>
        <PageHeader title="Leads" />
        <LoadError message={error?.message ?? "No data returned."} />
      </>
    );
  }

  const pages = Math.max(1, Math.ceil(data.total / PER_PAGE));
  const filtered = !!(q || status || source);
  const link = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status) sp.set("status", status);
    if (source) sp.set("source", source);
    if (sort !== "newest") sp.set("sort", sort);
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return `/admin/leads${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Everyone who has filled in a form on the website. Open a lead to change its status or add a note."
      />

      {searchParams.deleted && (
        <p role="status" className="mb-4 rounded-xl bg-greenTint px-4 py-3 text-[0.9rem] font-medium text-greenDeep">
          Lead deleted.
        </p>
      )}

      {/* Filters — an ordinary GET form, so a filtered view can be bookmarked or shared */}
      <form method="get" className="a-card mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="q" className="a-label">Search</label>
          <input id="q" name="q" type="search" defaultValue={q} placeholder="Name, email, business, phone…" className="a-input" />
        </div>
        <div>
          <label htmlFor="status" className="a-label">Status</label>
          <select id="status" name="status" defaultValue={status} className="a-input">
            <option value="">Any status</option>
            {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="source" className="a-label">Came from</label>
          <select id="source" name="source" defaultValue={source} className="a-input">
            <option value="">Anywhere</option>
            {data.sources.map((s) => <option key={s} value={s}>{sourceLabel(s)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="a-label">Sort</label>
          <select id="sort" name="sort" defaultValue={sort} className="a-input">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="a-btn-dark">Apply</button>
          {filtered && <Link href="/admin/leads" className="a-btn-quiet">Clear</Link>}
        </div>
      </form>

      <p className="mb-3 text-[0.88rem] text-mute" aria-live="polite">
        {data.total.toLocaleString("en-GB")} {data.total === 1 ? "lead" : "leads"}
        {filtered ? " match these filters" : ""}
      </p>

      {data.rows.length === 0 ? (
        <Empty title={filtered ? "No leads match those filters" : "No leads yet"}>
          {filtered ? "Try a shorter search or clear the filters." : "When someone requests the playbook or applies for a call, they appear here."}
        </Empty>
      ) : (
        <>
          {/* Table from tablet up */}
          <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
            <table className="w-full min-w-[860px] border-collapse">
              <thead className="border-b border-line bg-mist/60">
                <tr>
                  <th scope="col" className="a-th">Name</th>
                  <th scope="col" className="a-th">Business</th>
                  <th scope="col" className="a-th">Phone</th>
                  <th scope="col" className="a-th">Inquiry</th>
                  <th scope="col" className="a-th">Received</th>
                  <th scope="col" className="a-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((l) => (
                  <tr key={l.id} className="border-t border-line transition-colors first:border-t-0 hover:bg-mist/60">
                    <td className="a-td">
                      <Link href={`/admin/leads/${l.id}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                        {l.name || "Unnamed"}
                      </Link>
                      <span className="block max-w-[220px] truncate text-[0.84rem] text-body">{l.email}</span>
                    </td>
                    <td className="a-td max-w-[160px] truncate">{l.company ?? <span className="text-mute">—</span>}</td>
                    <td className="a-td whitespace-nowrap">{l.phone ?? <span className="text-mute">—</span>}</td>
                    <td className="a-td">
                      <span className="line-clamp-2 max-w-[280px] text-[0.88rem] text-body">{inquiry(l)}</span>
                      <span className="mt-0.5 block text-[0.78rem] text-mute">{sourceLabel(l.source)}</span>
                    </td>
                    <td className="a-td whitespace-nowrap text-[0.86rem] text-body">{formatDateTime(l.created_at)}</td>
                    <td className="a-td"><LeadStatusBadge status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on phones */}
          <ul className="space-y-3 md:hidden">
            {data.rows.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`} className="a-card block">
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{l.name || "Unnamed"}</span>
                      <span className="block truncate text-[0.86rem] text-body">{l.email}</span>
                    </span>
                    <LeadStatusBadge status={l.status} />
                  </span>
                  {(l.company || l.phone) && (
                    <span className="mt-2 block text-[0.86rem] text-body">{[l.company, l.phone].filter(Boolean).join(" · ")}</span>
                  )}
                  <span className="mt-2 line-clamp-2 block text-[0.88rem] text-body">{inquiry(l)}</span>
                  <span className="mt-2 block text-[0.78rem] text-mute">{sourceLabel(l.source)} · {formatDateTime(l.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>

          {pages > 1 && (
            <nav aria-label="Pages" className="mt-5 flex items-center justify-between gap-3">
              {page > 1 ? <Link href={link(page - 1)} className="a-btn-quiet">← Newer</Link> : <span />}
              <span className="text-[0.86rem] text-mute">Page {page} of {pages}</span>
              {page < pages ? <Link href={link(page + 1)} className="a-btn-quiet">Older →</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </>
  );
}
