import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/session";
import { rpc } from "@/lib/supabase/rpc";
import { cleanProjects, cleanServices, cleanTestimonials, mergeContact, mergeCopy } from "@/lib/content/get";
import { DEFAULT_SERVICES } from "@/lib/content/defaults";
import { LoadError, PageHeader, Pills } from "@/components/admin/Bits";
import {
  ContactEditor,
  CopyEditor,
  ProjectsEditor,
  ServicesEditor,
  TestimonialsEditor,
} from "@/components/admin/ContentEditors";

export const metadata: Metadata = { title: "Website content" };

const TABS = [
  { key: "copy", label: "Headlines and copy" },
  { key: "services", label: "Services" },
  { key: "projects", label: "Case studies" },
  { key: "testimonials", label: "Testimonials" },
  { key: "contact", label: "Contact and links" },
];

type Raw = {
  copy: Record<string, unknown> | null;
  contact: Record<string, unknown> | null;
  services: unknown;
  projects: unknown;
  testimonials: unknown;
};

export default async function ContentPage({ searchParams }: { searchParams: { tab?: string } }) {
  const admin = await requireAdmin();
  const tab = TABS.some((t) => t.key === searchParams.tab) ? searchParams.tab! : "copy";
  const { data, error } = await rpc<Raw>("admin_get_content", {}, admin.token);

  return (
    <>
      <PageHeader
        title="Website content"
        description="Changes go live on the website as soon as you save. No code, no redeploy."
      />
      <div className="mb-6">
        <Pills
          label="Content sections"
          items={TABS.map((t) => ({ href: `/admin/content?tab=${t.key}`, label: t.label, active: t.key === tab }))}
        />
      </div>

      {error || !data ? (
        <LoadError message={error?.message ?? "No data returned."} />
      ) : tab === "copy" ? (
        <CopyEditor copy={mergeCopy(data.copy)} />
      ) : tab === "services" ? (
        <ServicesEditor
          services={cleanServices(data.services) ?? DEFAULT_SERVICES}
          customised={!!cleanServices(data.services)}
        />
      ) : tab === "projects" ? (
        <ProjectsEditor projects={cleanProjects(data.projects)} />
      ) : tab === "testimonials" ? (
        <TestimonialsEditor testimonials={cleanTestimonials(data.testimonials)} />
      ) : (
        <ContactEditor contact={mergeContact(data.contact)} />
      )}
    </>
  );
}
