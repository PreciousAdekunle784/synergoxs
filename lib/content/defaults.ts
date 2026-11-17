import { BOOKING_URL, EMAIL } from "@/lib/site";

/**
 * The funnel's built-in text. The dashboard stores only what you change;
 * anything you haven't edited (or reset) falls back to what is written here.
 */

/* ───────────────────────── Headlines and copy ───────────────────────── */
export type CopyField = {
  key: string;
  group: string;
  label: string;
  max: number;
  multiline?: boolean;
  default: string;
};

export const COPY_FIELDS: CopyField[] = [
  { key: "optin.eyebrow", group: "Opt-in page · Hero", label: "Line above the headline", max: 90, default: "Free guide for business owners" },
  { key: "optin.headline", group: "Opt-in page · Hero", label: "Headline", max: 90, default: "Your business could be losing customers" },
  { key: "optin.accent", group: "Opt-in page · Hero", label: "Headline, italic part", max: 70, default: "you already paid to attract." },
  { key: "optin.sub", group: "Opt-in page · Hero", label: "Paragraph under the headline", max: 400, multiline: true, default: "The Business Growth Blueprint shows you where they're slipping away: the hidden marketing and conversion problems between the click and the sale. Then it shows you how to build a system that turns more of the opportunities you already have into revenue." },
  { key: "optin.cta", group: "Opt-in page · Hero", label: "Button text", max: 40, default: "Get my free Growth Blueprint" },

  { key: "discover.title", group: "Opt-in page · What they'll discover", label: "Headline", max: 90, default: "Six things you'll see clearly" },
  { key: "discover.accent", group: "Opt-in page · What they'll discover", label: "Headline, italic part", max: 60, default: "by the last page." },

  { key: "who.title", group: "Opt-in page · Who it's for", label: "Headline", max: 90, default: "Written for people who run the business," },
  { key: "who.accent", group: "Opt-in page · Who it's for", label: "Headline, italic part", max: 60, default: "not the marketing department." },

  { key: "optinFinal.title", group: "Opt-in page · Final call to action", label: "Headline", max: 90, default: "Find the leak before you pay for" },
  { key: "optinFinal.accent", group: "Opt-in page · Final call to action", label: "Headline, italic part", max: 60, default: "another visitor." },
  { key: "optinFinal.sub", group: "Opt-in page · Final call to action", label: "Paragraph", max: 400, multiline: true, default: "The Blueprint is free, it takes about twenty minutes, and it ends with a scorecard that tells you exactly where to start." },

  { key: "sales.eyebrow", group: "Sales page · Hero", label: "Line above the headline", max: 90, default: "The SYNERGOX Growth System" },
  { key: "sales.headline", group: "Sales page · Hero", label: "Headline", max: 90, default: "Stop patching your marketing." },
  { key: "sales.accent", group: "Sales page · Hero", label: "Headline, italic part", max: 60, default: "Start building a system" },
  { key: "sales.headline2", group: "Sales page · Hero", label: "Headline, last part", max: 60, default: "that grows your business." },
  { key: "sales.sub", group: "Sales page · Hero", label: "Paragraph under the headline", max: 400, multiline: true, default: "From high-converting websites to customer acquisition and conversion optimization, SYNERGOX helps businesses connect every part of their marketing into one coordinated growth system." },
  { key: "sales.cta", group: "Sales page · Hero", label: "Main button text", max: 40, default: "Explore your growth options" },
  { key: "sales.cta2", group: "Sales page · Hero", label: "Second button text", max: 40, default: "See what's included" },

  { key: "problem.title", group: "Sales page · The problem", label: "Headline", max: 90, default: "Busy marketing." },
  { key: "problem.accent", group: "Sales page · The problem", label: "Headline, italic part", max: 60, default: "Quiet phone." },
  { key: "problem.lede", group: "Sales page · The problem", label: "Intro paragraph", max: 400, multiline: true, default: "You're doing what you were told would work. There's a website. There are adverts. There's activity every week. What's missing is the part where it turns into customers. If any of these sound like your month, keep reading." },

  { key: "method.title", group: "Sales page · The method", label: "Headline", max: 90, default: "The answer isn't more marketing." },
  { key: "method.accent", group: "Sales page · The method", label: "Headline, italic part", max: 60, default: "It's a connected system." },
  { key: "method.lede", group: "Sales page · The method", label: "Intro paragraph", max: 400, multiline: true, default: "Spending more on services that don't talk to each other buys you more of the same result. What changes the result is building the parts as one thing, in the right order. This is the order we work in, on every project." },

  { key: "packages.title", group: "Sales page · Packages", label: "Headline", max: 90, default: "Start with the part" },
  { key: "packages.accent", group: "Sales page · Packages", label: "Headline, italic part", max: 60, default: "your business needs now." },
  { key: "packages.lede", group: "Sales page · Packages", label: "Intro paragraph", max: 400, multiline: true, default: "Three packages, each a fixed scope for a one-time price. Buy the one that fits where you are today. Nothing here is a retainer, and every package spells out what is and isn't included before you pay." },

  { key: "results.title", group: "Sales page · Case study", label: "Headline", max: 90, default: "Built for a real business," },
  { key: "results.accent", group: "Sales page · Case study", label: "Headline, italic part", max: 70, default: "shown in full." },

  { key: "faq.title", group: "Sales page · Questions", label: "Headline", max: 90, default: "Questions people ask" },
  { key: "faq.accent", group: "Sales page · Questions", label: "Headline, italic part", max: 60, default: "before they buy." },

  { key: "final.title", group: "Sales page · Final call to action", label: "Headline", max: 60, default: "Every month without a system" },
  { key: "final.accent", group: "Sales page · Final call to action", label: "Headline, italic part", max: 60, default: "is a month of paying for the leak." },
  { key: "final.sub", group: "Sales page · Final call to action", label: "Paragraph", max: 400, multiline: true, default: "Choose the package that fits where you are, or take the whole system in one payment. If you'd rather talk it through first, book a free call and we'll tell you which part we'd fix first." },
];

export type Copy = Record<string, string>;
export const DEFAULT_COPY: Copy = Object.fromEntries(COPY_FIELDS.map((f) => [f.key, f.default]));

/* ───────────────────────── Contact details and links ───────────────────────── */
export type Contact = {
  email: string;
  location: string;
  bookingUrl: string;
  whatsapp: string;
  linkedin: string;
  instagram: string;
  x: string;
};

export const DEFAULT_CONTACT: Contact = {
  email: EMAIL,
  location: "Lagos, Nigeria",
  bookingUrl: BOOKING_URL,
  whatsapp: "",
  linkedin: "",
  instagram: "",
  x: "",
};

/* ───────────────────────── Case studies and testimonials ───────────────────────── */
export type Project = {
  id: string;
  client: string;
  sector: string | null;
  headline: string | null;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  facts: string[];
  published?: boolean;
  sort_order?: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  published?: boolean;
  sort_order?: number;
};

/**
 * Shown ONLY when the database can't be reached (for example before the
 * dashboard migration has been run). Once the database answers, it is the
 * single source of truth: an empty list there means nothing is shown.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "kings-food-mart",
    client: "Kings Food Mart",
    sector: "Grocery & foodstuff retail · Abuja, Nigeria",
    headline:
      "Fifteen years of reputation, and nowhere online to send a customer who'd heard about it.",
    problem:
      "Demand was arriving through WhatsApp and word of mouth, with nowhere to send it. Every enquiry was answered by hand, every order assembled one at a time, and online the brand looked like any other neighbourhood store.",
    solution:
      "A full storefront: category structure, product presentation, a brand story on the homepage and a mobile-first ordering flow designed around how their customers already buy. Tuned to stay fast on Nigerian mobile data.",
    outcome:
      "The store is live, with an ordering path that runs without someone answering every enquiry manually. The brand now presents at the level it was already delivering at.",
    facts: [
      "Mobile-first ordering flow",
      "Copy, design and engineering by one team",
      "Built to stay fast on mobile data",
    ],
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "kings-food-mart",
    quote: "It blew her mind — the brand finally looked like what she'd built.",
    name: "Owner, Kings Food Mart",
    role: "Grocery retail · Abuja",
  },
];
