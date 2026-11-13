"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import PlaybookLink from "./PlaybookLink";
import { useContact } from "./ContactProvider";
import { FOCUS_PATHS } from "./Nav";

export default function Footer({ hasResults = true }: { hasResults?: boolean }) {
  const pathname = usePathname();
  const contact = useContact();
  const EMAIL = contact.email;
  const wa = contact.whatsapp.replace(/[^0-9]/g, "");
  const social = [
    { label: "WhatsApp", href: wa ? `https://wa.me/${wa}` : "" },
    { label: "LinkedIn", href: contact.linkedin },
    { label: "Instagram", href: contact.instagram },
    { label: "X", href: contact.x },
  ].filter((s) => s.href);
  const year = new Date().getFullYear();

  /* Conversion pages get a legal line only — nothing to click away to. */
  if (FOCUS_PATHS.includes(pathname)) {
    return (
      <footer className="border-t border-line bg-paper">
        <div className="shell flex flex-col gap-3 py-8 text-[0.84rem] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Synergox · {contact.location}</p>
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
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="" width={32} height={32} className="rounded-[9px]" />
              <span className="font-display text-[1.1rem] font-extrabold tracking-tighter2">
                Synergox
              </span>
            </div>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-ash">
              We build the system that turns your traffic into customers —
              offer, pages, ads and follow-up — and hand you the keys to it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3">
            <nav aria-label="Explore">
              <p className="eyebrow">Explore</p>
              <ul className="mt-5 space-y-3 text-[0.93rem]">
                <li><Link href="/#how" className={linkCls}>How it works</Link></li>
                {hasResults && <li><Link href="/#results" className={linkCls}>Results</Link></li>}
                <li><Link href="/#guarantee" className={linkCls}>Guarantee</Link></li>
                <li><Link href="/#faq" className={linkCls}>FAQ</Link></li>
              </ul>
            </nav>

            <nav aria-label="More">
              <p className="eyebrow">More</p>
              <ul className="mt-5 space-y-3 text-[0.93rem]">
                <li><Link href="/services" className={linkCls}>Services</Link></li>
                <li><Link href="/learn" className={linkCls}>Learn the system</Link></li>
                <li>
                  <PlaybookLink className={`${linkCls} text-left`}>
                    Free playbook
                  </PlaybookLink>
                </li>
              </ul>
            </nav>

            <div className="col-span-2 sm:col-span-1">
              <p className="eyebrow">Get in touch</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-5 inline-block text-[0.93rem] font-medium text-white underline decoration-green decoration-2 underline-offset-4 transition-colors hover:text-green"
              >
                {EMAIL}
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
          <p>© {year} Synergox. All rights reserved.</p>
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
