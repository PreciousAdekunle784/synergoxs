import Link from "next/link";
import Image from "next/image";
import { EMAIL } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-hair bg-pitch">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={30}
                height={30}
                className="rounded-lg"
              />
              <span className="font-display text-[1.05rem] font-extrabold tracking-tighter2 text-ink">
                Synergox
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-inkMute">
              A revenue growth partner. We build the acquisition system your
              marketing runs on — and hand you the keys to it.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-6 inline-block font-mono text-[0.82rem] text-signal hover:underline"
            >
              {EMAIL}
            </a>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 space-y-3 text-[0.92rem]">
              {[
                ["/#teardown", "CAC teardown"],
                ["/#paths", "Two paths"],
                ["/services", "Done for you"],
                ["/learn", "Learn the system"],
                ["/#proof", "Case study"],
                ["/#questions", "Questions"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-inkMute transition-colors hover:text-ink"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Start</p>
            <Link href="/apply" className="btn-signal mt-5 w-full sm:w-auto">
              Book a strategy call
            </Link>
            <ul className="mt-8 space-y-3 text-[0.92rem]">
              <li>
                <Link
                  href="/privacy"
                  className="text-inkMute transition-colors hover:text-ink"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-inkMute transition-colors hover:text-ink"
                >
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hair pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.74rem] text-inkFaint">
            © {new Date().getFullYear()} Synergox. All rights reserved.
          </p>
          <p className="font-mono text-[0.74rem] text-inkFaint">
            Lagos, Nigeria · Working worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
