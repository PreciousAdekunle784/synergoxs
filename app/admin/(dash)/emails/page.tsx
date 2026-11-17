import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import type { EmailStats } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/admin/constants";
import { SEQUENCE } from "@/lib/email/templates";
import { emailContext } from "@/lib/server/sequence";
import { integrationStatus } from "@/lib/server/env";
import { LoadError, NotConnected, PageHeader, Tile } from "@/components/admin/Bits";
import { RunEmailsForm, TestEmailForm } from "@/components/admin/EmailForms";

export const metadata: Metadata = { title: "Emails" };

const n = (v: number) => v.toLocaleString("en-GB");
const KEY_NAMES: Record<string, string> = {
  blueprint_redelivery: "Blueprint sent again",
  order_confirmation: "Order receipt",
  order_notice: "New-order notice (to you)",
  brief_notice: "Brief-received notice (to you)",
  test: "Test send",
};

export default async function EmailsPage({ searchParams }: { searchParams: { preview?: string } }) {
  const admin = await requireAdmin();
  const { data: s, error } = await rpc<EmailStats>("admin_email_stats", {}, admin.token);
  const io = integrationStatus();
  const ready = io.resend && io.serviceKey;

  // Rendered exactly as a subscriber would get it, with today's packages and prices.
  const ctx = await emailContext({ token: "00000000-0000-4000-8000-000000000000", first_name: "Ada" });
  const previewing = SEQUENCE.find((e) => e.key === searchParams.preview) ?? null;
  const rendered = previewing?.build(ctx) ?? null;
  let day = 0;

  return (
    <>
      <PageHeader
        title="Emails"
        description="The seven emails sent to people who ask for the Blueprint, and the receipts sent to buyers. Marketing emails only go to subscribers who are still subscribed; buyers stop receiving the sales sequence."
      />

      {!ready && (
        <div className="mb-5">
          <NotConnected title="Email sending isn't connected yet">
            {!io.resend && <>Set <code className="font-mono text-[0.84rem]">RESEND_API_KEY</code> and <code className="font-mono text-[0.84rem]">EMAIL_FROM</code> in Vercel. </>}
            {!io.serviceKey && <>Set <code className="font-mono text-[0.84rem]">SUPABASE_SERVICE_ROLE_KEY</code> in Vercel. </>}
            Then redeploy. Until then, opt-ins are still saved and everyone gets the Blueprint as a direct download;
            their emails start from email 1 as soon as sending is connected.
          </NotConnected>
        </div>
      )}
      {ready && !io.cron && (
        <div className="mb-5">
          <NotConnected title="The daily send isn't scheduled yet">
            Email 1 goes out the moment someone opts in. Emails 2 to 7 are sent by a daily run, which needs{" "}
            <code className="font-mono text-[0.84rem]">CRON_SECRET</code> set in Vercel. Until then, use “Send due emails now”.
          </NotConnected>
        </div>
      )}

      {error || !s ? (
        <LoadError message={error?.message ?? "No data returned."} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Tile label="Subscribers" value={n(s.subscribed)} sub={`${n(s.subscribers)} ever opted in`} />
            <Tile label="Unsubscribed" value={n(s.unsubscribed)} sub="Receive nothing further" />
            <Tile label="Due to send now" value={n(s.due_now)} sub="Picked up by the next run" />
            <Tile label="Stalled" value={n(s.stalled)} muted={s.stalled === 0} sub="Stopped after 5 failed attempts" />
          </div>

          <section className="mt-5 overflow-hidden rounded-card border border-line bg-paper" aria-labelledby="seq-h">
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6">
              <div>
                <h2 id="seq-h" className="a-h2">The sequence</h2>
                <p className="mt-1 text-[0.84rem] text-mute">Sent in this order, to each subscriber, on their own timeline.</p>
              </div>
              <RunEmailsForm />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead className="border-y border-line bg-mist/60">
                  <tr>
                    <th scope="col" className="a-th">#</th>
                    <th scope="col" className="a-th">Email</th>
                    <th scope="col" className="a-th">Sent on</th>
                    <th scope="col" className="a-th text-right">Sent</th>
                    <th scope="col" className="a-th text-right">Failed</th>
                    <th scope="col" className="a-th text-right">Waiting here</th>
                    <th scope="col" className="a-th" />
                  </tr>
                </thead>
                <tbody>
                  {SEQUENCE.map((e) => {
                    day += e.delayDays;
                    const k = s.by_key[e.key];
                    return (
                      <tr key={e.key} className="border-t border-line first:border-t-0">
                        <td className="a-td font-mono text-[0.82rem] text-mute">{e.step}</td>
                        <td className="a-td">
                          <span className="font-semibold text-ink">{e.name}</span>
                          <span className="block max-w-[340px] text-[0.84rem] text-body">“{e.build(ctx).subject}”</span>
                        </td>
                        <td className="a-td whitespace-nowrap text-[0.88rem] text-body">{day === 0 ? "Immediately" : `Day ${day}`}</td>
                        <td className="a-td num text-right font-mono">{n(k?.sent ?? 0)}</td>
                        <td className="a-td num text-right font-mono">{n(k?.failed ?? 0)}</td>
                        <td className="a-td num text-right font-mono text-body">{n(s.by_step[String(e.step - 1)] ?? 0)}</td>
                        <td className="a-td text-right">
                          <Link href={`/admin/emails?preview=${e.key}#preview`} scroll={false} className="text-[0.86rem] font-semibold text-ink underline decoration-green decoration-2 underline-offset-4">
                            Preview
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-line px-5 py-3 text-[0.82rem] text-mute sm:px-6">
              “Waiting here” is the number of subscribers whose next email is this one. {n(s.by_step["7"] ?? 0)} have received all seven.
            </p>
          </section>

          {rendered && previewing && (
            <section id="preview" className="a-card mt-5 scroll-mt-6" aria-labelledby="prev-h">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="prev-h" className="a-h2">Preview: {previewing.name}</h2>
                  <p className="mt-1 text-[0.88rem] text-body">Subject: <span className="font-semibold text-ink">{rendered.subject}</span></p>
                  <p className="mt-0.5 text-[0.82rem] text-mute">{previewing.purpose} Shown with a sample first name and today&apos;s live prices.</p>
                </div>
                <div className="flex items-start gap-2">
                  <TestEmailForm emailKey={previewing.key} />
                  <Link href="/admin/emails" scroll={false} className="a-btn-quiet">Close</Link>
                </div>
              </div>
              <iframe
                title={`Preview of ${previewing.name}`}
                srcDoc={rendered.html}
                sandbox=""
                className="mt-4 h-[640px] w-full rounded-btn border border-line bg-mist"
              />
            </section>
          )}

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
            <section className="a-card" aria-labelledby="other-h">
              <h2 id="other-h" className="a-h2">Other emails</h2>
              <p className="mt-1 text-[0.84rem] text-mute">Sent when something happens, not on a schedule.</p>
              <ul className="mt-3 divide-y divide-line">
                {Object.keys(KEY_NAMES).map((key) => (
                  <li key={key} className="flex items-baseline justify-between gap-4 py-3 text-[0.92rem]">
                    <span className="text-ink">{KEY_NAMES[key]}</span>
                    <span className="num font-mono text-body">
                      {n(s.by_key[key]?.sent ?? 0)} sent{(s.by_key[key]?.failed ?? 0) > 0 ? ` · ${n(s.by_key[key].failed)} failed` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="a-card" aria-labelledby="log-h">
              <h2 id="log-h" className="a-h2">Recent sends</h2>
              {s.recent.length === 0 ? (
                <p className="mt-4 text-[0.9rem] text-mute">Nothing has been sent yet.</p>
              ) : (
                <ul className="mt-3 divide-y divide-line">
                  {s.recent.map((r, i) => (
                    <li key={i} className="flex items-start justify-between gap-4 py-2.5 text-[0.88rem]">
                      <span className="min-w-0">
                        <span className="block truncate text-ink">{r.email}</span>
                        <span className="block text-[0.8rem] text-mute">
                          {SEQUENCE.find((e) => e.key === r.email_key)?.name ?? KEY_NAMES[r.email_key] ?? r.email_key} · {formatDateTime(r.created_at)}
                        </span>
                        {r.error && <span className="block text-[0.8rem] text-[#B42318]">{r.error}</span>}
                      </span>
                      <span className={`shrink-0 rounded-[3px] px-2 py-1 text-[0.72rem] font-semibold ${r.status === "sent" ? "bg-greenTint text-greenDeep" : "bg-[#FEF6F5] text-[#B42318]"}`}>
                        {r.status === "sent" ? "Sent" : "Failed"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
