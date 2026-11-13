"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/admin/types";

type Action = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * A form wired to a server action, with the result shown underneath:
 * green tick when it saved, a plain sentence when it didn't.
 */
export function ActionForm({
  action,
  children,
  className = "",
  resetOnSuccess = false,
  messageClassName = "",
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  messageClassName?: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={className} noValidate>
      {children}
      <FormMessage state={state} className={messageClassName} />
    </form>
  );
}

export function FormMessage({ state, className = "" }: { state: ActionState; className?: string }) {
  if (!state) return <p aria-live="polite" className="sr-only" />;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      aria-live="polite"
      className={`mt-3 flex items-start gap-2 text-[0.88rem] font-medium ${
        state.ok ? "text-greenDeep" : "text-[#B42318]"
      } ${className}`}
    >
      <span aria-hidden className="mt-[3px]">
        {state.ok ? (
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 8l3 3 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 4v4.5M7.5 11v.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {state.message}
    </p>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  className = "a-btn-primary",
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className} name={name} value={value}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/**
 * A delete button that asks once before doing anything. `action` is a plain
 * server action; hidden fields are passed as `fields`.
 */
export function ConfirmDelete({
  action,
  fields,
  label = "Delete",
  confirmLabel = "Yes, delete",
  question = "Delete this permanently?",
  align = "left",
}: {
  /** which edge of the button the confirmation lines up with */
  align?: "left" | "right";
  action: (fd: FormData) => Promise<void>;
  fields: Record<string, string>;
  label?: string;
  confirmLabel?: string;
  question?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={ref} className="group relative inline-block">
      <summary className="a-btn-danger cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div
        className={`absolute z-20 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-2xl border border-line bg-paper p-4 shadow-lift ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        <p className="text-[0.9rem] font-medium text-ink">{question}</p>
        <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
          {Object.entries(fields).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          <SubmitButton className="a-btn-danger" pendingLabel="Deleting…">
            {confirmLabel}
          </SubmitButton>
          <button
            type="button"
            className="a-btn-quiet"
            onClick={() => ref.current?.removeAttribute("open")}
          >
            Cancel
          </button>
        </form>
      </div>
    </details>
  );
}
