"use client";

import { changePassword } from "@/lib/admin/actions";
import { ActionForm, SubmitButton } from "./Form";

export default function PasswordForm({ email }: { email: string }) {
  return (
    <ActionForm action={changePassword} resetOnSuccess>
      {/* Lets password managers attach the new password to the right account */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <div className="space-y-4">
        <div>
          <label htmlFor="pw-current" className="a-label">Current password</label>
          <input id="pw-current" name="current" type="password" autoComplete="current-password" className="a-input" />
        </div>
        <div>
          <label htmlFor="pw-next" className="a-label">New password</label>
          <input id="pw-next" name="next" type="password" autoComplete="new-password" minLength={10} className="a-input" />
          <p className="mt-1.5 text-[0.8rem] text-mute">At least 10 characters, with a letter and a number.</p>
        </div>
        <div>
          <label htmlFor="pw-confirm" className="a-label">New password, again</label>
          <input id="pw-confirm" name="confirm" type="password" autoComplete="new-password" className="a-input" />
        </div>
      </div>
      <div className="mt-5">
        <SubmitButton className="a-btn-dark" pendingLabel="Changing…">Change password</SubmitButton>
      </div>
    </ActionForm>
  );
}
