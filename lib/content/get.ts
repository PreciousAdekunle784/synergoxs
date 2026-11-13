import { unstable_cache } from "next/cache";
import { rpc } from "@/lib/supabase/rpc";
import {
  DEFAULT_CONTACT,
  DEFAULT_COPY,
  DEFAULT_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_TESTIMONIALS,
  type Contact,
  type Copy,
  type Project,
  type Service,
  type Testimonial,
} from "./defaults";

export const CONTENT_TAG = "site-content";

export type SiteContent = {
  copy: Copy;
  contact: Contact;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  /** false when the database couldn't be reached and built-in text is showing */
  fromDatabase: boolean;
};

type Raw = {
  copy: Record<string, unknown> | null;
  contact: Record<string, unknown> | null;
  services: unknown;
  projects: unknown;
  testimonials: unknown;
};

const str = (v: unknown) => (typeof v === "string" ? v : "");

export function mergeCopy(overrides: Record<string, unknown> | null | undefined): Copy {
  const out: Copy = { ...DEFAULT_COPY };
  for (const [k, v] of Object.entries(overrides ?? {})) {
    if (k in DEFAULT_COPY && typeof v === "string" && v.trim() !== "") out[k] = v;
  }
  return out;
}

export function mergeContact(overrides: Record<string, unknown> | null | undefined): Contact {
  const out: Contact = { ...DEFAULT_CONTACT };
  for (const k of Object.keys(DEFAULT_CONTACT) as (keyof Contact)[]) {
    const v = overrides?.[k];
    if (typeof v !== "string") continue;
    // Email and booking link can't be blank; the optional links can.
    if (v.trim() === "" && (k === "email" || k === "bookingUrl" || k === "location")) continue;
    out[k] = v.trim();
  }
  return out;
}

export function cleanServices(v: unknown): Service[] | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const out = v
    .map((s) => s as Record<string, unknown>)
    .filter((s) => s && str(s.name).trim() !== "")
    .map((s) => ({
      name: str(s.name),
      stage: str(s.stage) || "Acquire",
      line: str(s.line),
      detail: str(s.detail),
      deliverables: Array.isArray(s.deliverables) ? s.deliverables.map(str).filter(Boolean) : [],
    }));
  return out.length ? out : null;
}

export function cleanProjects(v: unknown): Project[] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => {
    const o = p as Record<string, unknown>;
    return {
      id: str(o.id),
      client: str(o.client),
      sector: str(o.sector) || null,
      headline: str(o.headline) || null,
      problem: str(o.problem) || null,
      solution: str(o.solution) || null,
      outcome: str(o.outcome) || null,
      facts: Array.isArray(o.facts) ? o.facts.map(str).filter(Boolean) : [],
      published: typeof o.published === "boolean" ? o.published : undefined,
      sort_order: typeof o.sort_order === "number" ? o.sort_order : undefined,
    };
  });
}

export function cleanTestimonials(v: unknown): Testimonial[] {
  if (!Array.isArray(v)) return [];
  return v.map((t) => {
    const o = t as Record<string, unknown>;
    return {
      id: str(o.id),
      quote: str(o.quote),
      name: str(o.name),
      role: str(o.role) || null,
      published: typeof o.published === "boolean" ? o.published : undefined,
      sort_order: typeof o.sort_order === "number" ? o.sort_order : undefined,
    };
  });
}

async function load(): Promise<SiteContent> {
  const { data, error } = await rpc<Raw>("public_content");
  if (error || !data) {
    return {
      copy: { ...DEFAULT_COPY },
      contact: { ...DEFAULT_CONTACT },
      services: DEFAULT_SERVICES,
      projects: FALLBACK_PROJECTS,
      testimonials: FALLBACK_TESTIMONIALS,
      fromDatabase: false,
    };
  }
  return {
    copy: mergeCopy(data.copy),
    contact: mergeContact(data.contact),
    services: cleanServices(data.services) ?? DEFAULT_SERVICES,
    projects: cleanProjects(data.projects),
    testimonials: cleanTestimonials(data.testimonials),
    fromDatabase: true,
  };
}

/**
 * What the public site renders. Cached, and refreshed the moment something is
 * saved in the dashboard (the save calls revalidateTag(CONTENT_TAG)); the
 * five-minute timer is only a backstop.
 */
export const getContent = unstable_cache(load, ["site-content-v1"], {
  tags: [CONTENT_TAG],
  revalidate: 300,
});
