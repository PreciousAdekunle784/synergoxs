"use client";

import { recheckOrder, updateOrder } from "@/lib/admin/actions";
import { ONBOARDING_STATUSES } from "@/lib/admin/constants";
import { ActionForm, SubmitButton } from "./Form";

export function OrderProgressForm({ id, status, notes }: { id: string; status: string; notes: string | null }) {
  return (
    <ActionForm action={updateOrder} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="onboarding_status" className="a-label">Onboarding status</label>
        <select id="onboarding_status" name="onboarding_status" defaultValue={status} className="a-input">
          {ONBOARDING_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="admin_notes" className="a-label">Internal notes</label>
        <textarea id="admin_notes" name="admin_notes" rows={5} maxLength={4000} defaultValue={notes ?? ""} className="a-input" placeholder="Kickoff date, who is leading it, anything agreed with the client…" />
        <p className="mt-1.5 text-[0.8rem] text-mute">Only visible here. The customer never sees these.</p>
      </div>
      <SubmitButton>Save</SubmitButton>
    </ActionForm>
  );
}

export function RecheckForm({ id }: { id: string }) {
  return (
    <ActionForm action={recheckOrder}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="a-btn-dark" pendingLabel="Asking Paystack…">Check with Paystack again</SubmitButton>
    </ActionForm>
  );
}
