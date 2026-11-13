"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { rpc, type RpcResult } from "@/lib/supabase/rpc";
import { signInWithPassword, signOut, updatePassword } from "@/lib/supabase/auth";
import { CONTENT_TAG } from "@/lib/content/get";
import { COPY_FIELDS, SERVICE_STAGES } from "@/lib/content/defaults";
import { clearSession, accessToken, requireAdmin, setSession } from "./session";
import { LOGIN_PATH } from "./cookies";
import { CONSULTATION_STATUSES, LEAD_STATUSES, fromLocalInput } from "./constants";
import type { ActionState } from "./types";

/**
 * Every admin action. Each one:
 *   1. proves the caller is a signed-in admin (requireAdmin),
 *   2. validates what was submitted,
 *   3. calls a database function that checks admin rights again.
 * Next.js rejects server-action requests that don't come from this site, which
 * covers cross-site request forgery.
 */

const ok = (message: string): ActionState => ({ ok: true, message });
const fail = (message: string): ActionState => ({ ok: false, message });

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/** A database call as the signed-in admin. An expired or revoked session ends here. */
async function adminRpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<RpcResult<T>> {
  const admin = await requireAdmin();
  const result = await rpc<T>(fn, args, admin.token);
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    clearSession();
    redirect(LOGIN_PATH);
  }
  return result;
}

const dbError = (e: { message: string }) =>
  fail(`That didn't save. ${e.message.replace(/\.$/, "")}.`);

/* ─────────────────────────── Signing in and out ─────────────────────────── */

export async function login(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  // One message for every failure, so the form never reveals which part was wrong
  // or whether an email belongs to an admin.
  const denied = fail("That email and password don't match an admin account.");

  if (!EMAIL.test(email) || password.length < 1 || password.length > 200) return denied;

  const tokens = await signInWithPassword(email, password);
  if (!tokens) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return denied;
  }
  const who = await rpc<{ user_id: string } | null>("admin_whoami", {}, tokens.access_token);
  if (who.error && who.error.status !== 401 && who.error.status !== 403) {
    await signOut(tokens.access_token);
    return fail(
      "Signed in, but the dashboard isn't set up in the database yet. Run the migration in supabase/migrations first."
    );
  }
  if (!who.data?.user_id) {
    await signOut(tokens.access_token);
    return denied;
  }
  setSession(tokens);
  redirect("/admin");
}

export async function logout() {
  const token = accessToken();
  if (token) await signOut(token);
  clearSession();
  redirect(LOGIN_PATH);
}

export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");

  if (next.length < 10) return fail("Use at least 10 characters for the new password.");
  if (next.length > 200) return fail("That password is too long.");
  if (!/[a-zA-Z]/.test(next) || !/[0-9]/.test(next))
    return fail("Include at least one letter and one number.");
  if (next !== confirm) return fail("The two new passwords don't match.");
  if (next === current) return fail("The new password is the same as the current one.");

  // Re-enter the current password: a session left open on a shared computer
  // isn't enough to take over the account.
  const fresh = await signInWithPassword(admin.email, current);
  if (!fresh) return fail("Your current password isn't right.");

  const error = await updatePassword(fresh.access_token, next);
  if (error) return fail(error);
  setSession(fresh);
  return ok("Password changed.");
}

/* ─────────────────────────── Leads ─────────────────────────── */

export async function setLeadStatus(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id");
  const status = text(fd, "status");
  if (!id || id.length > 64) return fail("Unknown lead.");
  if (!LEAD_STATUSES.some((s) => s.value === status)) return fail("Pick a status from the list.");
  const { error } = await adminRpc("admin_update_lead_status", { p_id: id, p_status: status });
  if (error) return dbError(error);
  revalidatePath("/admin", "layout");
  return ok("Status updated.");
}

export async function addLeadNote(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id");
  const body = text(fd, "body");
  if (!id || id.length > 64) return fail("Unknown lead.");
  if (!body) return fail("Write something first.");
  if (body.length > 4000) return fail("Notes are limited to 4,000 characters.");
  const { error } = await adminRpc("admin_add_lead_note", { p_id: id, p_body: body });
  if (error) return dbError(error);
  revalidatePath(`/admin/leads/${id}`);
  return ok("Note added.");
}

export async function deleteLeadNote(fd: FormData) {
  const id = text(fd, "note_id");
  const leadId = text(fd, "id");
  if (!UUID.test(id)) return;
  await adminRpc("admin_delete_lead_note", { p_note_id: id });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(fd: FormData) {
  const id = text(fd, "id");
  if (!id || id.length > 64) return;
  await adminRpc("admin_delete_lead", { p_id: id });
  revalidatePath("/admin", "layout");
  redirect("/admin/leads?deleted=1");
}

/* ─────────────────────────── Consultations ─────────────────────────── */

export async function saveConsultation(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id");
  const status = text(fd, "status");
  const when = text(fd, "scheduled_at");
  const notes = String(fd.get("admin_notes") ?? "");
  if (!UUID.test(id)) return fail("Unknown consultation.");
  if (!CONSULTATION_STATUSES.some((s) => s.value === status))
    return fail("Pick a status from the list.");
  if (notes.length > 4000) return fail("Notes are limited to 4,000 characters.");
  const iso = when ? fromLocalInput(when) : null;
  if (when && !iso) return fail("That date and time isn't valid.");

  const { data, error } = await adminRpc<boolean>("admin_update_consultation", {
    p_id: id,
    p_status: status,
    p_scheduled_at: iso,
    p_clear_time: !when,
    p_notes: notes,
  });
  if (error) return dbError(error);
  if (!data) return fail("That consultation no longer exists.");
  revalidatePath("/admin", "layout");
  return ok("Saved.");
}

export async function deleteConsultation(fd: FormData) {
  const id = text(fd, "id");
  if (!UUID.test(id)) return;
  await adminRpc("admin_delete_consultation", { p_id: id });
  revalidatePath("/admin", "layout");
}

/* ─────────────────────────── Website content ─────────────────────────── */

function published() {
  // The live site picks the change up on its next request.
  revalidateTag(CONTENT_TAG);
  revalidatePath("/admin/content");
}

export async function saveCopy(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const overrides: Record<string, string> = {};
  for (const f of COPY_FIELDS) {
    const v = text(fd, f.key);
    if (v.length > f.max) return fail(`"${f.group} — ${f.label}" is limited to ${f.max} characters.`);
    // Store only what differs from the built-in text.
    if (v !== "" && v !== f.default) overrides[f.key] = v;
  }
  const { error } = await adminRpc("admin_set_content", {
    p_key: "copy",
    p_value: Object.keys(overrides).length ? overrides : null,
  });
  if (error) return dbError(error);
  published();
  return ok("Saved. The website is updated.");
}

const httpsUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "https:";
  } catch {
    return false;
  }
};

export async function saveContact(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = text(fd, "email");
  const location = text(fd, "location");
  const bookingUrl = text(fd, "bookingUrl");
  const whatsapp = text(fd, "whatsapp").replace(/[\s()-]/g, "");
  const linkedin = text(fd, "linkedin");
  const instagram = text(fd, "instagram");
  const x = text(fd, "x");

  if (!EMAIL.test(email) || email.length > 200) return fail("Enter a valid contact email.");
  if (!location || location.length > 120) return fail("Enter a location (up to 120 characters).");
  if (!/^https:\/\/calendly\.com\/[^\s]+$/.test(bookingUrl) || bookingUrl.length > 300)
    return fail("The booking link must be a Calendly link, starting with https://calendly.com/");
  if (whatsapp && !/^\+?[0-9]{7,15}$/.test(whatsapp))
    return fail("WhatsApp should be a phone number with country code, like +2348012345678.");
  for (const [label, v] of [["LinkedIn", linkedin], ["Instagram", instagram], ["X", x]] as const) {
    if (v && (!httpsUrl(v) || v.length > 300)) return fail(`${label} must be a full https:// link.`);
  }

  const { error } = await adminRpc("admin_set_content", {
    p_key: "contact",
    p_value: { email, location, bookingUrl, whatsapp, linkedin, instagram, x },
  });
  if (error) return dbError(error);
  published();
  return ok("Saved. The website is updated.");
}

export async function saveServices(_prev: ActionState, fd: FormData): Promise<ActionState> {
  if (text(fd, "reset") === "1") {
    const { error } = await adminRpc("admin_set_content", { p_key: "services", p_value: null });
    if (error) return dbError(error);
    published();
    return ok("Services reset to the built-in list.");
  }
  let raw: unknown;
  try {
    raw = JSON.parse(String(fd.get("payload") ?? "[]"));
  } catch {
    return fail("The services list couldn't be read. Reload the page and try again.");
  }
  if (!Array.isArray(raw) || raw.length === 0) return fail("Keep at least one service.");
  if (raw.length > 24) return fail("That's more services than the page is designed for (24).");

  const clean = [];
  for (const item of raw as Record<string, unknown>[]) {
    const name = String(item?.name ?? "").trim();
    const stage = String(item?.stage ?? "").trim();
    const line = String(item?.line ?? "").trim();
    const detail = String(item?.detail ?? "").trim();
    const deliverables = Array.isArray(item?.deliverables)
      ? item.deliverables.map((d) => String(d).trim()).filter(Boolean).slice(0, 8)
      : [];
    if (!name) return fail("Every service needs a name.");
    if (name.length > 80) return fail(`"${name.slice(0, 30)}…" — names are limited to 80 characters.`);
    if (!(SERVICE_STAGES as readonly string[]).includes(stage))
      return fail(`"${name}" needs a stage from the list.`);
    if (line.length > 300 || detail.length > 800)
      return fail(`"${name}" — the descriptions are too long.`);
    if (deliverables.some((d) => d.length > 60))
      return fail(`"${name}" — each deliverable is limited to 60 characters.`);
    clean.push({ name, stage, line, detail, deliverables });
  }
  const { error } = await adminRpc("admin_set_content", { p_key: "services", p_value: clean });
  if (error) return dbError(error);
  revalidatePath("/services");
  published();
  return ok("Saved. The services page is updated.");
}

export async function saveTestimonial(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id");
  const quote = text(fd, "quote");
  const name = text(fd, "name");
  const role = text(fd, "role");
  const sort = Number.parseInt(text(fd, "sort_order") || "0", 10);
  if (id && !UUID.test(id)) return fail("Unknown testimonial.");
  if (!quote) return fail("Add the quote.");
  if (quote.length > 1500) return fail("Quotes are limited to 1,500 characters.");
  if (!name) return fail("Add who said it.");
  if (name.length > 120 || role.length > 160) return fail("The name or role is too long.");
  if (!Number.isFinite(sort) || Math.abs(sort) > 9999) return fail("Order must be a whole number.");
  if (fd.get("published") === "on" && fd.get("confirm_real") !== "on")
    return fail(
      "To publish, confirm this is a real client's own words and that they agreed to it being shown."
    );

  const { error } = await adminRpc("admin_save_testimonial", {
    p_id: id || null,
    p_quote: quote,
    p_name: name,
    p_role: role,
    p_published: fd.get("published") === "on",
    p_sort: sort,
  });
  if (error) return dbError(error);
  published();
  return ok(id ? "Testimonial saved." : "Testimonial added.");
}

/** Taking a testimonial off the site is one click. Putting one on goes through the form. */
export async function unpublishTestimonial(fd: FormData) {
  const id = text(fd, "id");
  if (!UUID.test(id)) return;
  await adminRpc("admin_save_testimonial", {
    p_id: id,
    p_quote: text(fd, "quote"),
    p_name: text(fd, "name"),
    p_role: text(fd, "role"),
    p_published: false,
    p_sort: Number.parseInt(text(fd, "sort_order") || "0", 10) || 0,
  });
  published();
}

export async function deleteTestimonial(fd: FormData) {
  const id = text(fd, "id");
  if (!UUID.test(id)) return;
  await adminRpc("admin_delete_testimonial", { p_id: id });
  published();
}

export async function saveProject(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const id = text(fd, "id");
  const client = text(fd, "client");
  const sort = Number.parseInt(text(fd, "sort_order") || "0", 10);
  if (id && !UUID.test(id)) return fail("Unknown project.");
  if (!client) return fail("Add the project or client name.");
  if (client.length > 120) return fail("The name is limited to 120 characters.");
  const fields = {
    sector: [text(fd, "sector"), 160],
    headline: [text(fd, "headline"), 300],
    problem: [text(fd, "problem"), 1500],
    solution: [text(fd, "solution"), 1500],
    outcome: [text(fd, "outcome"), 1500],
  } as const;
  for (const [k, [v, max]] of Object.entries(fields)) {
    if (v.length > max) return fail(`"${k}" is limited to ${max} characters.`);
  }
  const facts = String(fd.get("facts") ?? "")
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
  if (facts.length > 6) return fail("Keep the key facts to six or fewer.");
  if (facts.some((f) => f.length > 90)) return fail("Each key fact is limited to 90 characters.");
  if (!Number.isFinite(sort) || Math.abs(sort) > 9999) return fail("Order must be a whole number.");

  const { error } = await adminRpc("admin_save_project", {
    p_id: id || null,
    p_client: client,
    p_sector: fields.sector[0],
    p_headline: fields.headline[0],
    p_problem: fields.problem[0],
    p_solution: fields.solution[0],
    p_outcome: fields.outcome[0],
    p_facts: facts,
    p_published: fd.get("published") === "on",
    p_sort: sort,
  });
  if (error) return dbError(error);
  published();
  return ok(id ? "Case study saved." : "Case study added.");
}

export async function deleteProject(fd: FormData) {
  const id = text(fd, "id");
  if (!UUID.test(id)) return;
  await adminRpc("admin_delete_project", { p_id: id });
  published();
}
