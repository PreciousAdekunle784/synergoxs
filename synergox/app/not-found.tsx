import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-[100px]">
      <div className="shell text-center">
        <p className="eyebrow">404</p>
        <h1 className="h-display mt-6 text-[2.8rem] text-ink sm:text-[3.6rem]">
          This page leaked out of the funnel.
        </h1>
        <p className="body-lg mx-auto mt-6 max-w-md">
          The link is broken or the page has moved. Everything worth reading is
          one click away.
        </p>
        <Link href="/" className="btn-signal mt-9">
          Back to the start
        </Link>
      </div>
    </section>
  );
}
