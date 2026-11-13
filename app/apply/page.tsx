import type { Metadata } from "next";
import Apply from "@/components/Apply";

export const metadata: Metadata = {
  title: "Book your free growth teardown",
  description:
    "Five quick questions, then pick a time. A free 30-minute call where we model your funnel on your real numbers and show you where it's losing customers.",
  robots: { index: false, follow: true },
};

export default function ApplyPage() {
  return <Apply />;
}
