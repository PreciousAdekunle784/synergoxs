"use client";

import { useFormState } from "react-dom";
import { login } from "@/lib/admin/actions";
import { FormMessage, SubmitButton } from "./Form";

export default function LoginForm() {
  const [state, action] = useFormState(login, null);
  return (
    <form action={action} noValidate className="mt-7 space-y-4">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" inputMode="email" required autoFocus className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <SubmitButton className="btn-primary w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
      <FormMessage state={state} />
    </form>
  );
}
