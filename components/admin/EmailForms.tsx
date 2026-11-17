"use client";

import { runEmailsNow, sendTestEmail } from "@/lib/admin/actions";
import { ActionForm, SubmitButton } from "./Form";

export function RunEmailsForm() {
  return (
    <ActionForm action={runEmailsNow}>
      <SubmitButton className="a-btn-dark" pendingLabel="Sending…">Send due emails now</SubmitButton>
    </ActionForm>
  );
}

export function TestEmailForm({ emailKey }: { emailKey: string }) {
  return (
    <ActionForm action={sendTestEmail}>
      <input type="hidden" name="key" value={emailKey} />
      <SubmitButton className="a-btn-quiet" pendingLabel="Sending…">Send this one to me</SubmitButton>
    </ActionForm>
  );
}
