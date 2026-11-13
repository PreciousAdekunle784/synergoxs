"use client";

import { useOptIn } from "./OptInProvider";

/**
 * The SECONDARY action: opens the free-playbook opt-in. Deliberately styled as
 * a text link (or a quiet outline button), never as a green button, so it can't
 * compete with booking the call.
 */
export default function PlaybookLink({
  children,
  className = "link",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openOptIn } = useOptIn();
  return (
    <button type="button" onClick={openOptIn} className={className}>
      {children}
    </button>
  );
}
