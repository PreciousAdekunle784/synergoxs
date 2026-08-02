import Link from "next/link";
import Image from "next/image";
import { EMAIL } from "@/lib/site";
import BookCTA from "./BookCTA";

const EXPLORE: [string, string][] = [
  ["/#teardown", "CAC teardown"],
  ["/#paths", "Two paths"],
  ["/#proof", "Case study"],
  ["/#guarantee", "Guarantee"],
];

const COMPANY: [string, string][] = [
  ["/services", "Done for you"],
  ["/learn", "Learn the system"],
  ["/#questions", "Questions"],
  ["/apply", "Book a call"],
];

export default function Footer() {
  return (
    <footer className="border-t border-hair bg-pitch">
      <div className="shell py-16 md:py-20">
        {/* CTA band — brand + tagline, with the one conversion action */}
        <div className="flex flex-col gap-8 pb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={30} height={30} className="rounded-lg" />
              <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-ink">
                Synergox
              </span>
            </div>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-inkMute">
              A revenue growth partner. We build the acquisition system your
              marketing runs on — and hand you the keys to it.
            </p>
          </div>

          <div className="shrink-0">
            <BookCTA className="btn-signal shadow-press" label="Get the free playbook" />
          </div>
        </div>

        {/* Link columns — even, grouped, no crammed button */}
        <div className="grid grid-cols-2 gap-10 border-t border-hair pt-14 sm:grid-cols-3">
          <nav aria-label="Explore">
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              {EXPLORE.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-inkMute transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <p className="eyebrow">Company</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              {COMPANY.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-inkMute transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow">Get in touch</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-5 inline-block font-mono text-[0.85rem] text-signal hover:underline"
            >
              {EMAIL}
            </a>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-inkFaint">
              Lagos, Nigeria
              <br />
              Working with clients worldwide
            </p>
          </div>
        </div>

        {/* Bottom bar — copyright + legal, where legal belongs */}
        <div className="mt-14 flex flex-col gap-4 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.74rem] text-inkFaint">
            © {new Date().getFullYear()} Synergox. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[0.8rem]">
            <Link href="/privacy" className="text-inkMute transition-colors hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="text-inkMute transition-colors hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
