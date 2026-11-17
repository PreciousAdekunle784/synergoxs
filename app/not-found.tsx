import Link from "next/link";
import Brand from "@/components/Brand";
import { OPTIN_PAGE, SALES_PAGE } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <div className="shell flex h-[72px] items-center">
        <Link href={OPTIN_PAGE} aria-label="SYNERGOX home">
          <Brand />
        </Link>
      </div>
      <div className="shell flex flex-1 flex-col items-start justify-center pb-24">
        <p className="eyebrow">Error 404</p>
        <h1 className="h-display mt-5 text-[2.8rem] sm:text-[4.2rem]">
          This page <span className="accent accent-green">isn't here.</span>
        </h1>
        <p className="lede mt-5 max-w-lg">
          The link may be old, or the address may have a typo. These two pages are where everything starts.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={OPTIN_PAGE} className="btn-primary">
            Get the free Growth Blueprint
          </Link>
          <Link href={SALES_PAGE} className="btn-outline">
            See the growth packages
          </Link>
        </div>
      </div>
    </main>
  );
}
