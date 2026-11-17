"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/admin/actions";
import Brand from "@/components/Brand";

type NavItem = { href: string; label: string; icon: string };

/* Grouped the way the work is: watch the funnel, handle people, change the offer, set up. */
const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Funnel",
    items: [
      { href: "/admin", label: "Overview", icon: "M3 12.5 12 4l9 8.5M5.5 10.5V20h13v-9.5" },
      { href: "/admin/analytics", label: "Funnel analytics", icon: "M4 20V10m5.5 10V4M15 20v-7m5.5 7V8" },
    ],
  },
  {
    label: "People",
    items: [
      { href: "/admin/leads", label: "Leads", icon: "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 10.5a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM20 19v-1.5a3.5 3.5 0 0 0-2.5-3.35M15 4.2a3.25 3.25 0 0 1 0 6.1" },
      { href: "/admin/orders", label: "Orders", icon: "M5 4h14v16l-2.5-1.6L14 20l-2-1.6L10 20l-2.5-1.6L5 20V4ZM8.5 9h7M8.5 12.5h7" },
      { href: "/admin/consultations", label: "Consultations", icon: "M7 3v3M17 3v3M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" },
    ],
  },
  {
    label: "Offer",
    items: [
      { href: "/admin/packages", label: "Packages", icon: "M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4 8-4M12 11v10" },
      { href: "/admin/bundle", label: "Growth Suite bundle", icon: "M4 8h16v12H4V8ZM4 12h16M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8" },
      { href: "/admin/exit-offer", label: "Exit-intent offer", icon: "M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 8l-4 4 4 4M6 12h9" },
      { href: "/admin/emails", label: "Emails", icon: "M4 6.5h16v11H4v-11ZM4 7l8 6 8-6" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/content", label: "Website content", icon: "M5 4h10l4 4v12H5V4ZM14 4v5h5M8.5 13h7M8.5 16.5h7" },
      { href: "/admin/settings", label: "Settings", icon: "M4 7h9m4 0h3M4 17h3m4 0h9M15 4.5v5M9 14.5v5" },
    ],
  },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path d={d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Shell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const links = (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.label}>
          <p className="mb-1.5 px-3 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-mute">{g.label}</p>
          <ul className="space-y-0.5">
            {g.items.map((n) => {
              const active = isActive(n.href);
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-btn px-3 py-2 text-[0.9rem] font-medium transition-colors duration-200 ${
                      active ? "bg-ink text-white" : "text-body hover:bg-mist hover:text-ink"
                    }`}
                  >
                    <Icon d={n.icon} />
                    {n.label}
                    {active && <span aria-hidden className="ml-auto h-1.5 w-1.5 bg-green" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  const account = (
    <div className="border-t border-line pt-4">
      <p className="truncate px-1 text-[0.8rem] text-mute" title={email}>
        Signed in as
        <span className="block truncate font-medium text-ink">{email}</span>
      </p>
      <div className="mt-3 flex gap-2">
        <Link href="/" target="_blank" className="a-btn-quiet flex-1 px-3 text-[0.84rem]">
          View site
        </Link>
        <form action={logout} className="flex-1">
          <button type="submit" className="a-btn-quiet w-full px-3 text-[0.84rem]">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" aria-label="Dashboard home">
      <Brand size={30} tag="Admin" />
    </Link>
  );

  return (
    <div className="min-h-screen bg-mist/60">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col overflow-y-auto border-r border-line bg-paper p-5 lg:flex">
        {brand}
        <nav aria-label="Dashboard" className="mt-7 flex-1 pb-5">
          {links}
        </nav>
        {account}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-line bg-paper px-4 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-btn border border-line"
        >
          <span className="relative block h-[10px] w-[18px]">
            <span className={`absolute left-0 top-0 h-[2px] w-full rounded-full bg-ink transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-ink transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </span>
        </button>
      </header>
      {open && (
        <div id="admin-menu" className="fixed inset-x-0 top-[60px] z-20 max-h-[calc(100dvh-60px)] overflow-y-auto border-b border-line bg-paper p-4 shadow-lift lg:hidden">
          <nav aria-label="Dashboard">{links}</nav>
          <div className="mt-4">{account}</div>
        </div>
      )}

      <main className="lg:pl-[248px]">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-7 sm:px-7 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
