"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOOKING_PAGE, OPTIN_PAGE, SALES_PAGE } from "@/lib/site";
import Brand from "./Brand";
import { useContact } from "./ContactProvider";

export default function Footer() {
  const pathname = usePathname();
  const contact = useContact();
  const year = new Date().getFullYear();
  const wa = contact.whatsapp.replace(/[^0-9]/g, "");
  const social = [
    { label: "WhatsApp", href: wa ? `https://wa.me/${wa}` : "" },
    { label: "LinkedIn", href: contact.linkedin },
    { label: "Instagram", href: contact.instagram },
    { label: "X", href: contact.x },
  ].filter((s) => s.href);

  /* Everywhere but the sales page: a legal line, and nothing to wander off to. */
  if (pathname !== SALES_PAGE) {
    return (
      <footer className="border-t border-line bg-paper">
        <div className="shell flex flex-col gap-3 py-8 text-[0.84rem] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} SYNERGOX · {contact.location}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  const linkCls = "text-ash transition-colors hover:text-white";

  return (
    <footer className="on-dark bg-ink text-white">
      <div className="shell py-16 md:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Brand onDark />
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ash">
              Websites, customer acquisition and conversion optimization, built to work as one growth system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
            <nav aria-label="On this page">
              <p className="eyebrow">On this page</p>
              <ul className="mt-5 space-y-3 text-[0.93rem]">
                <li><a href="#method" className={linkCls}>How it works</a></li>
                <li><a href="#packages" className={linkCls}>Packages</a></li>
                <li><a href="#suite" className={linkCls}>The Growth Suite</a></li>
                <li><a href="#faq" className={linkCls}>Questions</a></li>
              </ul>
            </nav>

            <nav aria-label="More">
              <p className="eyebrow">More</p>
              <ul className="mt-5 space-y-3 text-[0.93rem]">
                <li><Link href={OPTIN_PAGE} className={linkCls}>The free Blueprint</Link></li>
                <li><Link href={BOOKING_PAGE} className={linkCls}>Book a free call</Link></li>
              </ul>
            </nav>

            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">Get in touch</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-5 inline-block text-[0.93rem] font-medium text-white underline decoration-green decoration-2 underline-offset-4 transition-colors hover:text-green"
              >
                {contact.email}
              </a>
              <p className="mt-4 text-[0.88rem] leading-relaxed text-ash">
                {contact.location}
                <br />
                Working with clients worldwide
              </p>
              {social.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem]">
                  {social.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                        {s.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-lineDark pt-8 text-[0.84rem] text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SYNERGOX. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
