"use client";

import Link from "next/link";
import { deleteConsultation, saveConsultation } from "@/lib/admin/actions";
import { CONSULTATION_STATUSES } from "@/lib/admin/constants";
import type { Consultation } from "@/lib/admin/types";
import { ActionForm, ConfirmDelete, SubmitButton } from "./Form";

/**
 * One consultation: who, what they said, and the three things an admin
 * changes — status, the call time, and notes. Times are West Africa Time.
 */
export default function ConsultationCard({
  c,
  badge,
  applied,
  when,
  localValue,
  answers,
}: {
  c: Consultation;
  badge: React.ReactNode;
  applied: string;
  when: string | null;
  localValue: string;
  answers: { label: string; value: string }[];
}) {
  const wa = c.phone ? c.phone.replace(/[^0-9]/g, "") : "";
  return (
    <article className="a-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.15rem] font-extrabold tracking-tighter2 text-ink">
            {c.name}
            {c.company ? <span className="font-sans text-[0.95rem] font-medium text-body"> · {c.company}</span> : null}
          </h3>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.88rem] text-body">
            <a href={`mailto:${c.email}`} className="underline-offset-4 hover:text-ink hover:underline">{c.email}</a>
            {c.phone && (
              <a href={wa.length >= 7 ? `https://wa.me/${wa}` : `tel:${c.phone}`} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-ink hover:underline">
                {c.phone}
              </a>
            )}
            {c.website && <span>{c.website}</span>}
          </p>
        </div>
        {badge}
      </div>

      <p className="mt-3 text-[0.92rem] font-medium text-ink">
        {when ? <>Call: {when} WAT</> : c.status === "booked" ? "Booked. Call time not recorded yet." : `Applied ${applied}`}
      </p>
      {when && <p className="text-[0.8rem] text-mute">Applied {applied}</p>}

      {answers.length > 0 && (
        <dl className="mt-4 grid gap-x-6 gap-y-2 rounded-xl bg-mist px-4 py-3 sm:grid-cols-2">
          {answers.map((a) => (
            <div key={a.label} className="min-w-0">
              <dt className="text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-mute">{a.label}</dt>
              <dd className="break-words text-[0.9rem] text-ink">{a.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <ActionForm action={saveConsultation} className="mt-5 border-t border-line pt-5">
        <input type="hidden" name="id" value={c.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`st-${c.id}`} className="a-label">Status</label>
            <select id={`st-${c.id}`} name="status" defaultValue={c.status} className="a-input">
              {CONSULTATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`at-${c.id}`} className="a-label">Call date and time (WAT)</label>
            <input id={`at-${c.id}`} name="scheduled_at" type="datetime-local" defaultValue={localValue} className="a-input" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor={`nt-${c.id}`} className="a-label">Notes</label>
          <textarea id={`nt-${c.id}`} name="admin_notes" rows={2} maxLength={4000} defaultValue={c.admin_notes ?? ""} placeholder="Prep notes, what was agreed, next step…" className="a-input resize-y" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SubmitButton className="a-btn-dark">Save</SubmitButton>
          {c.lead_id && (
            <Link href={`/admin/leads/${c.lead_id}`} className="a-btn-quiet">Open lead</Link>
          )}
        </div>
      </ActionForm>
      <div className="mt-3 flex justify-end">
        <ConfirmDelete action={deleteConsultation} fields={{ id: c.id }} label="Delete record" question="Delete this consultation record? The lead itself is kept." align="right" />
      </div>
    </article>
  );
}
