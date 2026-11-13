import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { Lead, LeadNote } from "@/lib/admin/types";
import { formatDateTime, leadStatusLabel, sourceLabel } from "@/lib/admin/constants";
import { keyLabel, showValue } from "@/lib/admin/describe";
import { deleteLead, deleteLeadNote } from "@/lib/admin/actions";
import { ConsultationBadge, LeadStatusBadge, LoadError } from "@/components/admin/Bits";
import { ConfirmDelete } from "@/components/admin/Form";
import { LeadNoteForm, LeadStatusForm } from "@/components/admin/LeadForms";

export const metadata: Metadata = { title: "Lead" };

type Detail = {
  lead: Lead;
  notes: LeadNote[];
  consultations: { id: string; status: string; created_at: string; booked_at: string | null; scheduled_at: string | null }[];
};

/* Shown in the contact card already, so not repeated under "What they told us". */
const SHOWN_ELSEWHERE = new Set(["phone", "company", "website", "source"]);
const RECORD_HIDDEN = new Set(["id", "created_at", "name", "email", "lead_status", "lead_status_updated_at"]);

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
      <dt className="text-[0.84rem] font-medium text-mute">{label}</dt>
      <dd className="min-w-0 break-words text-[0.95rem] text-ink">{children}</dd>
    </div>
  );
}

export default async function LeadPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  const id = decodeURIComponent(params.id).slice(0, 64);
  const { data, error } = await rpc<Detail | null>("admin_get_lead", { p_id: id }, admin.token);
  if (error) return <LoadError message={error.message} />;
  if (!data) notFound();

  const { lead, notes, consultations } = data;
  const answers = Object.entries(lead.meta ?? {}).filter(([k, v]) => !SHOWN_ELSEWHERE.has(k) && v !== "" && v !== null);
  const extra = Object.entries(lead.record ?? {}).filter(([k, v]) => !RECORD_HIDDEN.has(k) && v !== null && v !== "");
  const wa = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : "";
  const site = lead.website ? (/^https?:\/\//i.test(lead.website) ? lead.website : `https://${lead.website}`) : null;

  return (
    <>
      <Link href="/admin/leads" className="text-[0.88rem] font-medium text-body underline-offset-4 hover:text-ink hover:underline">
        ← All leads
      </Link>
      <div className="mb-7 mt-3 flex flex-wrap items-center gap-3">
        <h1 className="a-h1">{lead.name || lead.email || "Unnamed lead"}</h1>
        <LeadStatusBadge status={lead.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="a-card" aria-labelledby="contact-h">
            <h2 id="contact-h" className="a-h2">Contact</h2>
            <dl className="mt-2 divide-y divide-line">
              <Row label="Name">{lead.name || "—"}</Row>
              <Row label="Email">
                {lead.email ? <a href={`mailto:${lead.email}`} className="link">{lead.email}</a> : "—"}
              </Row>
              <Row label="Phone / WhatsApp">
                {lead.phone ? (
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`} className="link">{lead.phone}</a>
                    {wa.length >= 7 && (
                      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-[0.86rem] text-body underline-offset-4 hover:text-ink hover:underline">
                        Open in WhatsApp
                      </a>
                    )}
                  </span>
                ) : (
                  <span className="text-mute">Not given</span>
                )}
              </Row>
              <Row label="Business name">{lead.company ?? <span className="text-mute">Not given</span>}</Row>
              <Row label="Website">
                {site ? <a href={site} target="_blank" rel="noopener noreferrer nofollow" className="link">{lead.website}</a> : <span className="text-mute">Not given</span>}
              </Row>
              <Row label="Came from">{sourceLabel(lead.source)}</Row>
              <Row label="Received">{formatDateTime(lead.created_at)} WAT</Row>
            </dl>
          </section>

          <section className="a-card" aria-labelledby="answers-h">
            <h2 id="answers-h" className="a-h2">What they told us</h2>
            {answers.length === 0 ? (
              <p className="mt-3 text-[0.92rem] text-mute">This form didn&apos;t ask any questions beyond contact details.</p>
            ) : (
              <dl className="mt-2 divide-y divide-line">
                {answers.map(([k, v]) => (
                  <Row key={k} label={keyLabel(k)}>{showValue(v)}</Row>
                ))}
              </dl>
            )}
            {extra.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-[0.86rem] font-medium text-body hover:text-ink">Other stored fields</summary>
                <dl className="mt-1 divide-y divide-line">
                  {extra.map(([k, v]) => (
                    <Row key={k} label={keyLabel(k)}>{showValue(v)}</Row>
                  ))}
                </dl>
              </details>
            )}
          </section>

          {consultations.length > 0 && (
            <section className="a-card" aria-labelledby="consult-h">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="consult-h" className="a-h2">Consultations</h2>
                <Link href="/admin/consultations" className="text-[0.86rem] font-medium text-ink underline decoration-green decoration-2 underline-offset-4">
                  Manage
                </Link>
              </div>
              <ul className="mt-3 divide-y divide-line">
                {consultations.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-[0.92rem]">
                    <span className="text-body">
                      Applied {formatDateTime(c.created_at)}
                      {c.scheduled_at ? ` · call on ${formatDateTime(c.scheduled_at)} WAT` : c.booked_at ? " · booked, time not set" : ""}
                    </span>
                    <ConsultationBadge status={c.status} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <section className="a-card">
            <LeadStatusForm id={lead.id} status={lead.status} />
            {lead.status_updated_at && (
              <p className="mt-3 text-[0.8rem] text-mute">Last changed {formatDateTime(lead.status_updated_at)} WAT</p>
            )}
          </section>

          <section className="a-card" aria-labelledby="notes-h">
            <h2 id="notes-h" className="a-h2">Notes and history</h2>
            <div className="mt-4">
              <LeadNoteForm id={lead.id} />
            </div>
            {notes.length === 0 ? (
              <p className="mt-5 border-t border-line pt-4 text-[0.9rem] text-mute">No notes yet.</p>
            ) : (
              <ol className="mt-5 space-y-4 border-t border-line pt-4">
                {notes.map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <span aria-hidden className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${n.kind === "note" ? "bg-green" : "bg-ink/25"}`} />
                    <div className="min-w-0 flex-1">
                      {n.kind === "status" ? (
                        <p className="text-[0.9rem] text-body">
                          Status changed: {n.body.split(" → ").map(leadStatusLabel).join(" → ")}
                        </p>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-[0.93rem] leading-relaxed text-ink">{n.body}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[0.78rem] text-mute">
                        <span>{formatDateTime(n.created_at)}{n.author_email ? ` · ${n.author_email}` : ""}</span>
                        {n.kind === "note" && (
                          <form action={deleteLeadNote} className="inline">
                            <input type="hidden" name="note_id" value={n.id} />
                            <input type="hidden" name="id" value={lead.id} />
                            <button type="submit" className="underline-offset-4 hover:text-[#B42318] hover:underline">Remove</button>
                          </form>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <section className="a-card">
            <h2 className="a-h2">Delete this lead</h2>
            <p className="mt-1.5 text-[0.88rem] leading-relaxed text-body">
              Removes the lead and its notes for good. Use this for spam, or when someone asks for their details to be erased.
            </p>
            <div className="mt-4">
              <ConfirmDelete action={deleteLead} fields={{ id: lead.id }} label="Delete lead" question="Delete this lead and all its notes? This can't be undone." />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
