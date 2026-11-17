"use client";

import { useFormState, useFormStatus } from "react-dom";
import { setSubscription } from "@/lib/funnel/actions";

function Button({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "One moment…" : children}
    </button>
  );
}

/** Unsubscribing takes one deliberate click (so a mail scanner opening the link can't do it by accident). */
export default function UnsubscribeForm({ token, status, hint }: { token: string; status: "subscribed" | "unsubscribed"; hint: string }) {
  const [state, action] = useFormState(setSubscription, null);
  const current = state?.ok ? (state.message as "subscribed" | "unsubscribed") : status;
  const changed = !!state?.ok;

  return (
    <div>
      {current === "subscribed" ? (
        <>
          <h1 className="h-display text-[2.4rem] sm:text-[3.2rem]">
            {changed ? <>You&apos;re back <span className="accent accent-green">on the list.</span></> : <>Stop the <span className="accent accent-green">emails?</span></>}
          </h1>
          <p className="lede mt-5">
            {changed
              ? `We'll carry on sending the growth series to ${hint}.`
              : `Emails from SYNERGOX are going to ${hint}. One click and they stop: no questions, no “are you sure” page after this one.`}
          </p>
          <form action={action} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="subscribe" value="0" />
            <Button className={changed ? "btn-outline" : "btn-dark"}>Unsubscribe me</Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="h-display text-[2.4rem] sm:text-[3.2rem]">
            You&apos;re <span className="accent accent-green">unsubscribed.</span>
          </h1>
          <p className="lede mt-5">
            We won&apos;t send any more marketing emails to {hint}. If you buy from us in future you&apos;ll still get your
            receipt, and nothing else.
          </p>
          <form action={action} className="mt-8">
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="subscribe" value="1" />
            <Button className="btn-outline">That was a mistake — resubscribe me</Button>
          </form>
        </>
      )}
      {state && !state.ok && (
        <p role="alert" className="mt-4 text-[0.92rem] font-medium text-[#B42318]">
          {state.message}
        </p>
      )}
    </div>
  );
}
