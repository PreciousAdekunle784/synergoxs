/** Shared by the dashboard UI and the server actions that validate its input. */

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "consultation_booked", label: "Consultation booked" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

export const CONSULTATION_STATUSES = [
  { value: "requested", label: "Requested" },
  { value: "booked", label: "Booked" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No-show" },
  { value: "cancelled", label: "Cancelled" },
] as const;
export type ConsultationStatus = (typeof CONSULTATION_STATUSES)[number]["value"];

export const leadStatusLabel = (v: string) =>
  LEAD_STATUSES.find((s) => s.value === v)?.label ?? v;
export const consultationStatusLabel = (v: string) =>
  CONSULTATION_STATUSES.find((s) => s.value === v)?.label ?? v;

/** Where a lead came from, in plain words. Unknown sources are shown as stored. */
const SOURCES: Record<string, string> = {
  "synergox.co/apply": "Teardown application",
  "synergox.co/optin": "Playbook opt-in",
  "synergox.co/lead-capture": "Checklist (old form)",
  unknown: "Unknown",
};
export const sourceLabel = (v?: string | null) => (v ? SOURCES[v] ?? v : "Unknown");

/** Nigeria has no daylight saving, so a fixed offset is always correct. */
export const BUSINESS_TZ = "Africa/Lagos";
export const BUSINESS_TZ_LABEL = "WAT";
export const BUSINESS_TZ_OFFSET = "+01:00";

export function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** "3 hours ago" style, for activity feeds. */
export function timeAgo(iso?: string | null, now = Date.now()) {
  if (!iso) return "";
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

/** ISO → the value a <input type="datetime-local"> expects, in business time. */
export function toLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  const hour = g("hour") === "24" ? "00" : g("hour");
  return `${g("year")}-${g("month")}-${g("day")}T${hour}:${g("minute")}`;
}

/** The reverse: a datetime-local value typed in business time → ISO. */
export function fromLocalInput(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00${BUSINESS_TZ_OFFSET}`);
  return isNaN(d.getTime()) ? null : d.toISOString();
}
