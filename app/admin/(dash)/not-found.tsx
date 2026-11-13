import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="rounded-card border border-line bg-paper px-6 py-14 text-center">
      <h1 className="a-h1">That record doesn&apos;t exist</h1>
      <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-body">
        It may have been deleted, or the link is wrong.
      </p>
      <Link href="/admin/leads" className="a-btn-dark mt-6">
        Back to leads
      </Link>
    </div>
  );
}
