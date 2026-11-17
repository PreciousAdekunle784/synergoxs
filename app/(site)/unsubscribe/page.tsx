import type { Metadata } from "next";
import Link from "next/link";
import { rpc } from "@/lib/supabase/rpc";
import { getContent } from "@/lib/content/get";
import { BLUEPRINT_FILE, OPTIN_PAGE } from "@/lib/site";
import { UUID_RE } from "@/lib/server/request";
import UnsubscribeForm from "@/components/funnel/UnsubscribeForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Email preferences",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: { t?: string } }) {
  const token = searchParams.t ?? "";
  const { contact } = await getContent();
  const sub = UUID_RE.test(token)
    ? (await rpc<{ status: "subscribed" | "unsubscribed"; email_hint: string } | null>("subscription_status", { p_token: token })).data
    : null;

  return (
    <section className="pb-24 pt-[130px] md:pb-28 md:pt-[170px]">
      <div className="shell max-w-2xl">
        <p className="eyebrow">Email preferences</p>
        <div className="mt-5">
          {sub ? (
            <UnsubscribeForm token={token} status={sub.status} hint={sub.email_hint} />
          ) : (
            <>
              <h1 className="h-display text-[2.4rem] sm:text-[3.2rem]">
                This link <span className="accent accent-green">has expired.</span>
              </h1>
              <p className="lede mt-5">
                We couldn&apos;t match it to a subscription. Use the unsubscribe link at the bottom of the most recent
                email from us, or write to{" "}
                <a href={`mailto:${contact.email}?subject=Unsubscribe`} className="link">
                  {contact.email}
                </a>{" "}
                and we&apos;ll remove you by hand.
              </p>
            </>
          )}
        </div>
        <p className="mt-12 border-t border-ink/15 pt-6 text-[0.9rem] text-mute">
          Looking for the guide?{" "}
          <a href={BLUEPRINT_FILE} className="underline underline-offset-2 hover:text-ink">
            Download the Blueprint
          </a>{" "}
          ·{" "}
          <Link href={OPTIN_PAGE} className="underline underline-offset-2 hover:text-ink">
            Back to the site
          </Link>
        </p>
      </div>
    </section>
  );
}
