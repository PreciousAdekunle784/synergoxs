import type { Lead } from "./types";

/** Plain-words labels for the answers the website's forms store with a lead. */
const KEY_LABELS: Record<string, string> = {
  source: "Came from",
  leadMagnet: "Requested",
  magnet: "Requested",
  company: "Business name",
  phone: "Phone / WhatsApp",
  website: "Website",
  currency: "Currency",
  market: "Market",
  businessModel: "What they sell",
  monthlyRevenue: "Monthly revenue",
  monthlyAdSpend: "Monthly ad spend",
  biggestBottleneck: "Biggest bottleneck",
  alreadyTried: "Already tried",
  timeline: "Timeline",
  decisionMaker: "Decision maker",
  recommendation: "Form's recommendation",
  message: "Message",
};

export function keyLabel(key: string) {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  // camelCase / snake_case → "Camel case"
  const spaced = key.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function showValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** One line saying what the person wanted, from whatever the form captured. */
export function inquiry(lead: Pick<Lead, "meta" | "source">): string {
  const m = lead.meta ?? {};
  const s = (k: string) => (typeof m[k] === "string" && (m[k] as string).trim() ? (m[k] as string) : "");
  if (s("message")) return s("message");
  if (s("biggestBottleneck")) {
    const parts = [s("biggestBottleneck"), s("businessModel"), s("monthlyRevenue")].filter(Boolean);
    return parts.join(" · ");
  }
  if (s("leadMagnet")) return `Requested the playbook: ${s("leadMagnet")}`;
  if (s("magnet")) return `Requested: ${s("magnet")}`;
  return "—";
}
