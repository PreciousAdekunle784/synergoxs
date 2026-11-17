"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitBrief } from "@/lib/funnel/actions";
import type { BriefField } from "@/lib/funnel/brief";
import { track } from "@/lib/analytics";
import { ArrowTile } from "../Icons";

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary btn-lg w-full justify-between sm:w-auto">
      <span>{pending ? "Sending…" : editing ? "Update my brief" : "Send my project brief"}</span>
      <ArrowTile />
    </button>
  );
}

/** The project brief. Fields come from lib/funnel/brief.ts, chosen for what was bought. */
export default function OnboardingForm({
  token,
  fields,
  saved,
}: {
  token: string;
  /** `only` (a RegExp) is dropped by the server before passing fields down */
  fields: Omit<BriefField, "only">[];
  saved: Record<string, string> | null;
}) {
  const [state, action] = useFormState(submitBrief, null);
  const tracked = useRef(false);

  useEffect(() => {
    if (state?.ok && !tracked.current) {
      tracked.current = true;
      track("onboarding_submitted");
    }
    if (state && !state.ok && state.field) document.getElementById(`brief-${state.field}`)?.focus();
  }, [state]);

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="token" value={token} />
      {fields.map((f) => {
        const id = `brief-${f.key}`;
        const bad = state && !state.ok && state.field === f.key;
        const common = {
          id,
          name: f.key,
          maxLength: f.max,
          required: f.required,
          defaultValue: saved?.[f.label] ?? "",
          placeholder: f.placeholder,
          "aria-invalid": bad || undefined,
          "aria-describedby": f.help ? `${id}-help` : undefined,
          className: "field",
        };
        return (
          <div key={f.key}>
            <label htmlFor={id} className="field-label">
              {f.label} {!f.required && <span className="font-normal text-mute">(optional)</span>}
            </label>
            {f.help && (
              <p id={`${id}-help`} className="-mt-1 mb-2 text-[0.86rem] leading-relaxed text-mute">
                {f.help}
              </p>
            )}
            {f.type === "textarea" ? <textarea {...common} rows={4} /> : <input {...common} type="text" />}
          </div>
        );
      })}

      {state && !state.ok && (
        <p role="alert" className="border border-[#F1C9C4] bg-[#FEF6F5] p-4 text-[0.92rem] font-medium text-[#8A1C12]">
          {state.message}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="border border-green bg-greenTint p-4 text-[0.92rem] font-medium text-greenDeep">
          Saved. We have your brief.
        </p>
      )}

      <Submit editing={!!saved} />
    </form>
  );
}
