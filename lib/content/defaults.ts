import { BOOKING_URL, EMAIL } from "@/lib/site";
import { services as defaultServices } from "@/lib/services";

/**
 * The website's built-in text. The dashboard stores only what you change;
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
  { key: "hero.eyebrow", group: "Hero", label: "Line above the headline", max: 90, default: "Growth marketing agency · Funnels, ads & follow-up" },
  { key: "hero.headline", group: "Hero", label: "Headline", max: 90, default: "Get more customers from the traffic you're" },
  { key: "hero.highlight", group: "Hero", label: "Headline, underlined part", max: 60, default: "already paying for." },
  { key: "hero.sub", group: "Hero", label: "Paragraph under the headline", max: 400, multiline: true, default: "You probably don't have a traffic problem. You have a leak: one stage of your funnel where buyers quietly drop out. We find it, rebuild it, and hand you a system with a cost per customer you can plan around." },
  { key: "hero.cta", group: "Hero", label: "Main button text (used site-wide)", max: 40, default: "Book my free growth teardown" },

  { key: "problem.title", group: "The problem", label: "Headline", max: 90, default: "You've already paid for customers" },
  { key: "problem.accent", group: "The problem", label: "Headline, second part", max: 60, default: "you never got." },
  { key: "problem.lede", group: "The problem", label: "Intro paragraph", max: 400, multiline: true, default: "The clicks arrived. The enquiries came in. Then, somewhere between the first visit and the paid invoice, most of them slipped away. It usually shows up as one of these." },

  { key: "teardown.title", group: "Calculator", label: "Headline", max: 90, default: "What is your biggest leak" },
  { key: "teardown.accent", group: "Calculator", label: "Headline, underlined part", max: 60, default: "costing you every month?" },
  { key: "teardown.lede", group: "Calculator", label: "Intro paragraph", max: 400, multiline: true, default: "Move the sliders until they roughly match your business. The model finds your weakest stage and shows what fixing that one stage would be worth, on the traffic and budget you already have." },

  { key: "system.title", group: "What we build", label: "Headline", max: 90, default: "One connected system." },
  { key: "system.accent", group: "What we build", label: "Headline, second part", max: 60, default: "Not five disconnected services." },
  { key: "system.lede", group: "What we build", label: "Intro paragraph", max: 400, multiline: true, default: "Most agencies sell you a channel. We build the whole path a stranger walks, from first click to paid invoice, starting with the stage that's costing you the most." },

  { key: "process.title", group: "How it works", label: "Headline", max: 90, default: "From first call to live system" },
  { key: "process.accent", group: "How it works", label: "Headline, underlined part", max: 60, default: "in about six weeks." },

  { key: "results.title", group: "Case studies", label: "Headline", max: 90, default: "One build, shown in full." },
  { key: "results.accent", group: "Case studies", label: "Headline, second part", max: 70, default: "Not ten logos with nothing behind them." },
  { key: "results.lede", group: "Case studies", label: "Intro paragraph", max: 400, multiline: true, default: "A wall of logos tells you nothing. Here is one project from start to finish: the problem, what we built, and how it turned out." },

  { key: "testimonials.title", group: "Testimonials", label: "Headline", max: 90, default: "What clients say," },
  { key: "testimonials.accent", group: "Testimonials", label: "Headline, second part", max: 60, default: "in their own words." },

  { key: "why.title", group: "Why Synergox", label: "Headline", max: 90, default: "Same category." },
  { key: "why.accent", group: "Why Synergox", label: "Headline, underlined part", max: 60, default: "A very different deal for you." },
  { key: "why.lede", group: "Why Synergox", label: "Intro paragraph", max: 400, multiline: true, default: "If you've hired an agency before, you already know how the usual deal goes. Here's what changes." },

  { key: "guarantee.title", group: "Guarantee", label: "Headline", max: 90, default: "If we don't ship it," },
  { key: "guarantee.accent", group: "Guarantee", label: "Headline, underlined part", max: 60, default: "you don't pay for it." },
  { key: "guarantee.lede", group: "Guarantee", label: "Intro paragraph", max: 400, multiline: true, default: "Most agency guarantees are a line on a website that never makes it into the contract. These four are clauses. You'll read them in the agreement before you sign anything." },

  { key: "faq.title", group: "Questions", label: "Headline", max: 90, default: "What people ask" },
  { key: "faq.accent", group: "Questions", label: "Headline, second part", max: 60, default: "right before they book." },

  { key: "final.title", group: "Final call to action", label: "Headline", max: 60, default: "Find your leak." },
  { key: "final.accent", group: "Final call to action", label: "Headline, green part", max: 60, default: "Then decide." },
  { key: "final.sub", group: "Final call to action", label: "Paragraph", max: 400, multiline: true, default: "Book a free 30-minute growth teardown. You'll leave knowing where your funnel is losing customers and what fixing it is worth, whether or not you ever hire us." },
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

/* ───────────────────────── Services ───────────────────────── */
export const SERVICE_STAGES = ["Acquire", "Convert", "Automate", "Optimize"] as const;
export type Service = {
  name: string;
  stage: string;
  line: string;
  detail: string;
  deliverables: string[];
};
export const DEFAULT_SERVICES: Service[] = defaultServices.map((s) => ({ ...s }));

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
