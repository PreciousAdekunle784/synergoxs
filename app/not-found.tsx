import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import BookCall from "@/components/CTA";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="flex min-h-[72vh] items-center pt-[100px]">
        <div className="shell text-center">
          <p className="eyebrow">404</p>
          <h1 className="h-display mt-5 text-[2.6rem] sm:text-[3.4rem]">
            This page leaked out of the funnel.
          </h1>
          <p className="lede mx-auto mt-5 max-w-md">
            The link is broken or the page has moved. Everything worth reading is
            one click away.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookCall />
            <Link href="/" className="btn-outline">
              Back to the home page
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
