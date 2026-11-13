import { requireAdmin } from "@/lib/admin/session";
import Shell from "@/components/admin/Shell";

/** Every page under here renders only for a verified admin. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <Shell email={admin.email}>{children}</Shell>;
}
