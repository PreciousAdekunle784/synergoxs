import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { logout } from "@/lib/admin/actions";
import { BUSINESS_TZ_LABEL, formatDate } from "@/lib/admin/constants";
import { PAYSTACK_PUBLIC_KEY, SUPABASE_URL } from "@/lib/site";
import { getContent } from "@/lib/content/get";
import { LoadError, PageHeader } from "@/components/admin/Bits";
import PasswordForm from "@/components/admin/PasswordForm";

export const metadata: Metadata = { title: "Settings" };

type Status = {
  admins: string[];
  leads: number;
  consultations: number;
  page_views: number;
  tracking_since: string | null;
  testimonials: number;
  projects: number;
};

function Source({ name, state, children }: { name: string; state: "on" | "waiting" | "off"; children: React.ReactNode }) {
  const tone = { on: "bg-green text-ink", waiting: "bg-mist text-ink", off: "border border-line bg-paper text-mute" }[state];
  const word = { on: "Connected", waiting: "Waiting for data", off: "Not connected" }[state];
  return (
    <li className="flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <p className="text-[0.95rem] font-semibold text-ink">{name}</p>
        <p className="mt-1 text-[0.88rem] leading-relaxed text-body">{children}</p>
      </div>
      <span className={`inline-flex shrink-0 items-center self-start rounded-full px-2.5 py-1 text-[0.74rem] font-semibold ${tone}`}>{word}</span>
    </li>
  );
}

export default async function SettingsPage() {
  const admin = await requireAdmin();
  const [{ data: s, error }, content] = await Promise.all([
    rpc<Status>("admin_status", {}, admin.token),
    getContent(),
  ]);
  const calendly = !!process.env.CALENDLY_API_TOKEN;
  const host = (() => {
    try {
      return new URL(SUPABASE_URL).host;
    } catch {
      return SUPABASE_URL;
    }
  })();

  return (
    <>
      <PageHeader title="Settings" description="Your account, who can sign in, and what the dashboard is connected to." />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="a-card" aria-labelledby="acct-h">
          <h2 id="acct-h" className="a-h2">Your account</h2>
          <p className="mt-2 text-[0.92rem] text-body">
            Signed in as <span className="font-semibold text-ink">{admin.email}</span>
          </p>
          <p className="mt-1 text-[0.84rem] leading-relaxed text-mute">
            You stay signed in on this device for seven days after your last visit. Dashboard times are shown in West Africa Time ({BUSINESS_TZ_LABEL}).
          </p>
          <form action={logout} className="mt-4">
            <button type="submit" className="a-btn-quiet">Sign out</button>
          </form>
        </section>

        <section className="a-card" aria-labelledby="pw-h">
          <h2 id="pw-h" className="a-h2">Change password</h2>
          <div className="mt-4">
            <PasswordForm email={admin.email} />
          </div>
        </section>

        <section className="a-card" aria-labelledby="admins-h">
          <h2 id="admins-h" className="a-h2">Who can sign in</h2>
          {error || !s ? (
            <div className="mt-4"><LoadError message={error?.message ?? "No data returned."} /></div>
          ) : (
            <>
              <ul className="mt-3 divide-y divide-line">
                {s.admins.map((a) => (
                  <li key={a} className="flex items-center justify-between gap-3 py-3 text-[0.93rem]">
                    <span className="truncate text-ink">{a}</span>
                    {a === admin.email && <span className="shrink-0 text-[0.8rem] text-mute">You</span>}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.84rem] leading-relaxed text-mute">
                Admins are added and removed in Supabase, on purpose: nobody can give themselves access
                from this website. Steps are in ADMIN_SETUP.txt.
              </p>
            </>
          )}
        </section>

        <section className="a-card" aria-labelledby="src-h">
          <h2 id="src-h" className="a-h2">Data sources</h2>
          <ul className="mt-1 divide-y divide-line">
            <Source name="Database (Supabase)" state={s ? "on" : "off"}>
              {s ? `${host} · ${s.leads.toLocaleString("en-GB")} leads, ${s.consultations.toLocaleString("en-GB")} consultation records.` : "The dashboard can't reach its database functions."}
            </Source>
            <Source name="Website content" state={content.fromDatabase ? "on" : "off"}>
              {content.fromDatabase
                ? "The live site reads its editable text, case studies and testimonials from the database."
                : "The live site is showing its built-in text because it couldn't read from the database."}
            </Source>
            <Source name="Visitor counting" state={s?.tracking_since ? "on" : "waiting"}>
              {s?.tracking_since
                ? `Counting since ${formatDate(s.tracking_since)} · ${s.page_views.toLocaleString("en-GB")} page views recorded. First-party, no cookies.`
                : "Built into the website. It starts the first time someone visits the live site after this version is deployed."}
            </Source>
            <Source name="Calendly call times" state={calendly ? "on" : "off"}>
              {calendly
                ? "A Calendly token is set, so the chosen call time is filled in when someone books."
                : "Bookings are recorded, but the call time has to be typed in. To automate it, add a Calendly personal access token as CALENDLY_API_TOKEN in Vercel and redeploy."}
            </Source>
            <Source name="Payments (Paystack)" state={PAYSTACK_PUBLIC_KEY && !PAYSTACK_PUBLIC_KEY.startsWith("PASTE_") ? "on" : "off"}>
              Checkout on the offer page. Payments themselves are managed in your Paystack dashboard, not here.
            </Source>
            <Source name="Google Analytics / Tag Manager" state="off">
              Not installed. The dashboard doesn&apos;t need it: visits are counted by the site itself.
            </Source>
          </ul>
        </section>
      </div>
    </>
  );
}
