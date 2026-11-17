"use client";

import { useEffect, useState } from "react";
import {
  deleteProject,
  deleteTestimonial,
  saveContact,
  saveCopy,
  saveProject,
  saveTestimonial,
  unpublishTestimonial,
} from "@/lib/admin/actions";
import {
  COPY_FIELDS,
  type Contact,
  type Copy,
  type Project,
  type Testimonial,
} from "@/lib/content/defaults";
import { ActionForm, ConfirmDelete, SubmitButton } from "./Form";

const hint = "mt-1.5 text-[0.8rem] leading-relaxed text-mute";

/* ───────────────────────── Headlines and copy ───────────────────────── */
export function CopyEditor({ copy }: { copy: Copy }) {
  const groups = Array.from(new Set(COPY_FIELDS.map((f) => f.group)));
  return (
    <ActionForm action={saveCopy} messageClassName="sticky bottom-3 rounded-btn bg-paper px-4 py-3 shadow-card">
      <p className="mb-5 max-w-2xl text-[0.92rem] leading-relaxed text-body">
        Edit any line and save. To put a line back to how it was written, empty the box and save.
      </p>
      <div className="space-y-5">
        {groups.map((g) => (
          <fieldset key={g} className="a-card">
            <legend className="a-h2 float-left mb-4 w-full">{g}</legend>
            <div className="clear-both space-y-4">
              {COPY_FIELDS.filter((f) => f.group === g).map((f) => {
                const changed = copy[f.key] !== f.default;
                return (
                  <div key={f.key}>
                    <label htmlFor={f.key} className="a-label">
                      {f.label}
                      {changed && <span className="ml-2 rounded-[3px] bg-greenTint px-2 py-0.5 text-[0.7rem] font-semibold text-greenDeep">Edited</span>}
                    </label>
                    {f.multiline ? (
                      <textarea id={f.key} name={f.key} rows={3} maxLength={f.max} defaultValue={copy[f.key]} placeholder={f.default} className="a-input resize-y" />
                    ) : (
                      <input id={f.key} name={f.key} type="text" maxLength={f.max} defaultValue={copy[f.key]} placeholder={f.default} className="a-input" />
                    )}
                    {changed && <p className={hint}>Originally: “{f.default}”</p>}
                  </div>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <div className="mt-5">
        <SubmitButton>Save headlines and copy</SubmitButton>
      </div>
    </ActionForm>
  );
}

/* ───────────────────────── Contact and links ───────────────────────── */
export function ContactEditor({ contact }: { contact: Contact }) {
  const field = (name: keyof Contact, label: string, type = "text", placeholder = "", note?: string) => (
    <div>
      <label htmlFor={`c-${name}`} className="a-label">{label}</label>
      <input id={`c-${name}`} name={name} type={type} defaultValue={contact[name]} placeholder={placeholder} className="a-input" />
      {note && <p className={hint}>{note}</p>}
    </div>
  );
  return (
    <ActionForm action={saveContact}>
      <div className="grid gap-5 lg:grid-cols-2">
        <fieldset className="a-card space-y-4">
          <legend className="a-h2 float-left mb-4 w-full">Contact details</legend>
          <div className="clear-both space-y-4">
            {field("email", "Contact email", "email", "hello@synergox.co", "Shown in the footer, the FAQ and on the booking pages.")}
            {field("location", "Location line", "text", "Lagos, Nigeria")}
          </div>
        </fieldset>
        <fieldset className="a-card space-y-4">
          <legend className="a-h2 float-left mb-4 w-full">Important links</legend>
          <div className="clear-both space-y-4">
            {field("bookingUrl", "Calendly booking link", "url", "https://calendly.com/you/30min", "The calendar shown after the booking form. Must be a Calendly link.")}
            {field("whatsapp", "WhatsApp number (optional)", "tel", "+2348012345678", "With country code. Adds a WhatsApp link to the footer.")}
            {field("linkedin", "LinkedIn (optional)", "url", "https://www.linkedin.com/company/…")}
            {field("instagram", "Instagram (optional)", "url", "https://www.instagram.com/…")}
            {field("x", "X / Twitter (optional)", "url", "https://x.com/…")}
          </div>
        </fieldset>
      </div>
      <div className="mt-5">
        <SubmitButton>Save contact details and links</SubmitButton>
      </div>
    </ActionForm>
  );
}

/* ───────────────────────── Testimonials ───────────────────────── */
function TestimonialForm({ t }: { t?: Testimonial }) {
  const [publish, setPublish] = useState(!!t?.published);
  useEffect(() => setPublish(!!t?.published), [t?.published]);
  const k = t?.id ?? "new";
  return (
    <ActionForm action={saveTestimonial} resetOnSuccess={!t}>
      {t && <input type="hidden" name="id" value={t.id} />}
      <div>
        <label className="a-label" htmlFor={`${k}-quote`}>What they said</label>
        <textarea id={`${k}-quote`} name="quote" rows={4} maxLength={1500} defaultValue={t?.quote} className="a-input resize-y" />
        <p className={hint}>Their own words, as they gave them. Don&apos;t add quotation marks; the site does that.</p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="a-label" htmlFor={`${k}-name`}>Who said it</label>
          <input id={`${k}-name`} name="name" maxLength={120} defaultValue={t?.name} placeholder="Ada Obi" className="a-input" />
        </div>
        <div>
          <label className="a-label" htmlFor={`${k}-role`}>Role and business</label>
          <input id={`${k}-role`} name="role" maxLength={160} defaultValue={t?.role ?? ""} placeholder="Founder, Ada Store · Lagos" className="a-input" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-start">
        <div>
          <label className="a-label" htmlFor={`${k}-sort`}>Order</label>
          <input id={`${k}-sort`} name="sort_order" type="number" defaultValue={t?.sort_order ?? 0} className="a-input" />
          <p className={hint}>Lowest first.</p>
        </div>
        <div className="space-y-3 sm:pt-7">
          <label className="flex items-start gap-3 text-[0.93rem] text-ink">
            <input type="checkbox" name="published" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="mt-1 h-4 w-4 accent-[#00C551]" />
            <span>
              <span className="font-semibold">Show on the website</span>
              <span className="block text-[0.84rem] text-body">Unticked, it stays here as a draft.</span>
            </span>
          </label>
          {publish && (
            <label className="flex items-start gap-3 rounded-btn bg-mist p-3 text-[0.9rem] text-ink">
              <input type="checkbox" name="confirm_real" className="mt-1 h-4 w-4 accent-[#00C551]" />
              <span>
                I confirm these are a real client&apos;s own words, and they agreed to them being shown with this name.
              </span>
            </label>
          )}
        </div>
      </div>
      <div className="mt-5">
        <SubmitButton>{t ? "Save testimonial" : "Add testimonial"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function TestimonialsEditor({ testimonials }: { testimonials: Testimonial[] }) {
  const live = testimonials.filter((t) => t.published).length;
  return (
    <div>
      <p className="mb-5 max-w-2xl text-[0.92rem] leading-relaxed text-body">
        {live === 0
          ? "No testimonials are published, so the testimonials section is hidden on the website. It appears as soon as you publish one."
          : `${live} ${live === 1 ? "testimonial is" : "testimonials are"} showing on the website.`}
      </p>

      <ul className="space-y-4">
        {testimonials.map((t) => (
          <li key={t.id} className="a-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[0.98rem] leading-relaxed text-ink">“{t.quote}”</p>
                <p className="mt-2 text-[0.86rem] text-body">
                  <span className="font-semibold text-ink">{t.name}</span>
                  {t.role ? ` · ${t.role}` : ""}
                </p>
              </div>
              <span className={`inline-flex items-center rounded-[3px] px-2.5 py-1 text-[0.74rem] font-semibold ${t.published ? "bg-green text-ink" : "bg-mist text-mute"}`}>
                {t.published ? "On the website" : "Draft"}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
              {t.published && (
                <form action={unpublishTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="hidden" name="quote" value={t.quote} />
                  <input type="hidden" name="name" value={t.name} />
                  <input type="hidden" name="role" value={t.role ?? ""} />
                  <input type="hidden" name="sort_order" value={t.sort_order ?? 0} />
                  <SubmitButton className="a-btn-quiet" pendingLabel="Unpublishing…">Unpublish</SubmitButton>
                </form>
              )}
              <ConfirmDelete action={deleteTestimonial} fields={{ id: t.id }} question="Delete this testimonial for good?" />
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-[0.9rem] font-semibold text-ink underline decoration-green decoration-2 underline-offset-4">
                {t.published ? "Edit" : "Edit or publish"}
              </summary>
              <div className="mt-4">
                <TestimonialForm t={t} />
              </div>
            </details>
          </li>
        ))}
      </ul>

      <section className="a-card mt-6" aria-labelledby="new-t">
        <h2 id="new-t" className="a-h2">Add a testimonial</h2>
        <div className="mt-4">
          <TestimonialForm />
        </div>
      </section>
    </div>
  );
}

/* ───────────────────────── Case studies ───────────────────────── */
function ProjectForm({ p }: { p?: Project }) {
  const k = p?.id ?? "newp";
  const area = (name: string, label: string, value: string | null | undefined, rows = 3, max = 1500, note?: string) => (
    <div>
      <label className="a-label" htmlFor={`${k}-${name}`}>{label}</label>
      <textarea id={`${k}-${name}`} name={name} rows={rows} maxLength={max} defaultValue={value ?? ""} className="a-input resize-y" />
      {note && <p className={hint}>{note}</p>}
    </div>
  );
  return (
    <ActionForm action={saveProject} resetOnSuccess={!p}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="a-label" htmlFor={`${k}-client`}>Project or client name</label>
          <input id={`${k}-client`} name="client" maxLength={120} defaultValue={p?.client} className="a-input" />
        </div>
        <div>
          <label className="a-label" htmlFor={`${k}-sector`}>Sector and location</label>
          <input id={`${k}-sector`} name="sector" maxLength={160} defaultValue={p?.sector ?? ""} placeholder="Grocery retail · Abuja, Nigeria" className="a-input" />
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {area("headline", "One-sentence summary", p?.headline, 2, 300)}
        {area("problem", "The problem", p?.problem)}
        {area("solution", "What we built", p?.solution)}
        {area("outcome", "The outcome", p?.outcome, 3, 1500, "Only include a number if you can show a screenshot for it.")}
        {area("facts", "Key facts", p?.facts?.join("\n"), 3, 600, "One per line, up to six.")}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[120px_1fr] sm:items-start">
        <div>
          <label className="a-label" htmlFor={`${k}-sort`}>Order</label>
          <input id={`${k}-sort`} name="sort_order" type="number" defaultValue={p?.sort_order ?? 0} className="a-input" />
          <p className={hint}>Lowest first.</p>
        </div>
        <label className="flex items-start gap-3 text-[0.93rem] text-ink sm:pt-8">
          <input type="checkbox" name="published" defaultChecked={!!p?.published} className="mt-1 h-4 w-4 accent-[#00C551]" />
          <span>
            <span className="font-semibold">Show on the website</span>
            <span className="block text-[0.84rem] text-body">Unticked, it stays here as a draft.</span>
          </span>
        </label>
      </div>
      <div className="mt-5">
        <SubmitButton>{p ? "Save case study" : "Add case study"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function ProjectsEditor({ projects }: { projects: Project[] }) {
  const live = projects.filter((p) => p.published).length;
  return (
    <div>
      <p className="mb-5 max-w-2xl text-[0.92rem] leading-relaxed text-body">
        {live === 0
          ? "No case studies are published, so the case study section is hidden on the website."
          : `${live} ${live === 1 ? "case study is" : "case studies are"} showing on the website. The first one is featured in full; any others follow as cards.`}
      </p>
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="a-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-[1.2rem] font-extrabold tracking-tighter2 text-ink">{p.client}</p>
                {p.sector && <p className="mt-0.5 text-[0.86rem] text-body">{p.sector}</p>}
              </div>
              <span className={`inline-flex items-center rounded-[3px] px-2.5 py-1 text-[0.74rem] font-semibold ${p.published ? "bg-green text-ink" : "bg-mist text-mute"}`}>
                {p.published ? "On the website" : "Draft"}
              </span>
            </div>
            {p.headline && <p className="mt-3 text-[0.94rem] leading-relaxed text-body">{p.headline}</p>}
            <details className="mt-4 border-t border-line pt-4">
              <summary className="cursor-pointer text-[0.9rem] font-semibold text-ink underline decoration-green decoration-2 underline-offset-4">
                Edit
              </summary>
              <div className="mt-4">
                <ProjectForm p={p} />
              </div>
            </details>
            <div className="mt-4 flex justify-end">
              <ConfirmDelete action={deleteProject} fields={{ id: p.id }} question="Delete this case study for good?" align="right" />
            </div>
          </li>
        ))}
      </ul>
      <section className="a-card mt-6" aria-labelledby="new-p">
        <h2 id="new-p" className="a-h2">Add a case study</h2>
        <div className="mt-4">
          <ProjectForm />
        </div>
      </section>
    </div>
  );
}
