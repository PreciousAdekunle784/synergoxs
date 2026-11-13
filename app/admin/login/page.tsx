import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-mist/60 px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="rounded-slab border border-line bg-paper p-7 shadow-card sm:p-9">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={34} height={34} className="rounded-[10px]" priority />
            <span className="font-display text-[1.1rem] font-extrabold tracking-tighter2 text-ink">Synergox</span>
          </div>
          <h1 className="mt-7 font-display text-[1.8rem] font-extrabold leading-tight tracking-tighter2 text-ink">
            Sign in to the dashboard
          </h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-body">
            For Synergox administrators only.
          </p>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-[0.86rem] text-mute">
          <Link href="/" className="underline-offset-4 hover:text-ink hover:underline">
            ← Back to the website
          </Link>
        </p>
      </div>
    </div>
  );
}
