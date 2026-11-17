import type { OrderItem } from "./types";

/**
 * The project brief a buyer fills in after paying. Asked AFTER payment on
 * purpose: nobody should have to describe their business to see a price.
 *
 * A few questions only appear for the package they matter to.
 */
export type BriefField = {
  key: string;
  /** also the label the answer is stored and shown under */
  label: string;
  type: "text" | "url" | "textarea";
  required?: boolean;
  max: number;
  help?: string;
  placeholder?: string;
  /** shown only when one of the purchased items matches */
  only?: RegExp;
};

export const BRIEF_FIELDS: BriefField[] = [
  { key: "business", label: "Business name", type: "text", required: true, max: 160, placeholder: "Okafor & Sons Ltd" },
  { key: "website", label: "Current website", type: "text", max: 300, placeholder: "yourbusiness.com — or leave blank if there isn't one" },
  { key: "industry", label: "Industry", type: "text", required: true, max: 160, placeholder: "e.g. grocery retail, legal services, fashion e-commerce" },
  {
    key: "goals",
    label: "Business goals",
    type: "textarea",
    required: true,
    max: 2000,
    help: "What should be different in three months if this project goes well?",
  },
  {
    key: "audience",
    label: "Target audience",
    type: "textarea",
    required: true,
    max: 2000,
    help: "Who buys from you, where are they, and what are they usually trying to solve?",
  },
  {
    key: "assets",
    label: "Existing marketing assets",
    type: "textarea",
    max: 2000,
    help: "Logo and brand files, social pages, ad accounts, analytics, email list, anything already in place.",
  },
  {
    key: "pages",
    label: "Pages you expect the website to have",
    type: "textarea",
    max: 1500,
    help: "A rough list is fine: Home, About, Services, Contact… plus any site you like the look of.",
    only: /website|foundation/i,
  },
  {
    key: "budget",
    label: "Planned monthly ad budget",
    type: "text",
    max: 160,
    help: "Paid by you directly to Meta and Google. A range is fine; it helps us plan the campaigns.",
    only: /acquisition|ads|campaign/i,
  },
  {
    key: "funnel",
    label: "Page or funnel to optimize",
    type: "text",
    max: 300,
    help: "The link people land on today, and roughly how many visit it in a month.",
    only: /conversion|optimi/i,
  },
  {
    key: "requirements",
    label: "Project requirements",
    type: "textarea",
    max: 3000,
    help: "Deadlines, must-haves, things to avoid, who signs off. Anything we should know before we start.",
  },
  { key: "contact", label: "Best way to reach you", type: "text", max: 200, placeholder: "WhatsApp number, phone or email, and good times to call" },
];

export function briefFieldsFor(items: Pick<OrderItem, "slug" | "name">[]) {
  const text = items.map((i) => `${i.slug} ${i.name}`).join(" ");
  return BRIEF_FIELDS.filter((f) => !f.only || f.only.test(text));
}
