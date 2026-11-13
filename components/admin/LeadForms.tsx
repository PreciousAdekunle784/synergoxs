"use client";

import { useRef } from "react";
import { addLeadNote, setLeadStatus } from "@/lib/admin/actions";
import { LEAD_STATUSES } from "@/lib/admin/constants";
import { ActionForm, SubmitButton } from "./Form";

/** Changing the dropdown saves straight away; the button is there for keyboards and no-JS. */
export function LeadStatusForm({ id, status }: { id: string; status: string }) {
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <ActionForm action={setLeadStatus}>
      <input type="hidden" name="id" value={id} />
      <label htmlFor="lead-status" className="a-label">Status</label>
      <div className="flex gap-2">
        <select
          id="lead-status"
          name="status"
          defaultValue={status}
          onChange={() => btn.current?.click()}
          className="a-input"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <button ref={btn} type="submit" className="a-btn-dark shrink-0">Save</button>
      </div>
    </ActionForm>
  );
}

export function LeadNoteForm({ id }: { id: string }) {
  return (
    <ActionForm action={addLeadNote} resetOnSuccess>
      <input type="hidden" name="id" value={id} />
      <label htmlFor="note-body" className="a-label">Add an internal note</label>
      <textarea
        id="note-body"
        name="body"
        rows={3}
        maxLength={4000}
        placeholder="Called on Tuesday, wants a quote by Friday…"
        className="a-input resize-y"
      />
      <p className="mt-1.5 text-[0.8rem] text-mute">Only admins can see notes. They are never shown to the lead.</p>
      <div className="mt-3">
        <SubmitButton className="a-btn-dark" pendingLabel="Adding…">Add note</SubmitButton>
      </div>
    </ActionForm>
  );
}
