import { formatMoney } from "@/lib/money";
import type { Funnel, Order } from "@/lib/funnel/types";
import { BLUEPRINT_PAGES, BLUEPRINT_TITLE, BOOKING_PAGE, CALL_MINUTES, SALES_PAGE } from "@/lib/site";
import { render, type Block, type RenderedEmail } from "./render";

/**
 * Every email the funnel sends.
 *
 *   The sequence (7 emails, to people who asked for the Blueprint and are
 *   still subscribed):
 *     1  delivery          immediately
 *     2  problem awareness +1 day
 *     3  education         +2 days
 *     4  solution          +2 days
 *     5  offer             +1 day
 *     6  objections        +2 days
 *     7  follow-up         +2 days
 *
 *   Transactional (sent once, to buyers, regardless of subscription):
 *     order confirmation, and a notice to the business for each order / brief.
 *
 * Prices are never typed into these templates: email 5 reads the live
 * packages and bundle, so an email can't disagree with the sales page.
 */

export type EmailContext = {
  firstName: string;
  siteUrl: string;
  /** personal link that records the download, then serves the PDF */
  downloadUrl: string;
  unsubscribeUrl: string;
  contactEmail: string;
  location: string;
  funnel: Funnel;
};

export type SequenceEmail = {
  step: number;
  key: string;
  /** shown in the dashboard */
  name: string;
  purpose: string;
  /** days after the previous email */
  delayDays: number;
  build: (c: EmailContext) => RenderedEmail;
};

const sales = (c: EmailContext, hash = "") => `${c.siteUrl}${SALES_PAGE}?src=email${hash}`;
const booking = (c: EmailContext) => `${c.siteUrl}${BOOKING_PAGE}`;
const hi = (c: EmailContext) => `Hi ${c.firstName || "there"},`;
const SIGN = "— The SYNERGOX team";

const chrome = (c: EmailContext, preheader: string) => ({
  siteUrl: c.siteUrl,
  preheader,
  reason: `You're getting this because you asked for ${BLUEPRINT_TITLE} at ${c.siteUrl.replace(/^https?:\/\//, "")}.`,
  unsubscribeUrl: c.unsubscribeUrl,
  location: c.location,
});

export const SEQUENCE: SequenceEmail[] = [
  {
    step: 1,
    key: "seq_1_delivery",
    name: "Freebie delivery",
    purpose: "Delivers the Blueprint and says how to use it.",
    delayDays: 0,
    build: (c) =>
      render(
        "Your Business Growth Blueprint is here",
        [
          { p: hi(c) },
          { p: `Here is **${BLUEPRINT_TITLE}**, as promised. ${BLUEPRINT_PAGES} pages, no fluff.` },
          { button: { label: "Download the Blueprint", url: c.downloadUrl } },
          { p: "You don't need to read it cover to cover. Twenty minutes is enough if you do it in this order:" },
          {
            steps: [
              "**Start with the scorecard at the back** (pages 20–21). Twelve statements. It tells you which of the four parts of your growth system is the weakest.",
              "**Read the chapter for that part first.** Each one ends with what to fix this week.",
              "**Then read chapter 5**, on how the parts work together. That is where most of the money is.",
            ],
          },
          {
            p: "Over the next week and a half I'll send a few short emails that go deeper on the ideas in the guide: where businesses lose customers they have already paid for, and what a connected system looks like in practice.",
          },
          { p: "If you'd rather not get them, there's a one-click unsubscribe at the bottom of every email." },
          { p: "And if you get stuck on any page, reply to this email. A person reads the replies." },
          { sign: SIGN },
        ],
        chrome(c, "Your copy is inside, plus the 20-minute way to read it.")
      ),
  },
  {
    step: 2,
    key: "seq_2_problem",
    name: "Problem awareness",
    purpose: "Helps the reader recognise where they are losing customers.",
    delayDays: 1,
    build: (c) =>
      render(
        "The customers you paid for and never got",
        [
          { p: hi(c) },
          {
            p: "Most business owners who tell us their marketing isn't working are wrong about which part. They say they need more traffic. Usually the traffic is fine. What's missing is everything that should happen after the click.",
          },
          { p: "See if any of these sound familiar:" },
          {
            list: [
              "**You're paying for visitors who look and leave.** The ads report clicks. The business doesn't feel them.",
              "**Your website gets compliments, not enquiries.** It describes the company well and never asks for anything.",
              "**Leads come in and go quiet.** Someone asked a question on Tuesday. Nobody followed up after Wednesday.",
              "**Every channel is run by someone different.** The designer, the ads person and the page were never in the same conversation.",
              "**You can't say what a customer costs you.** So every marketing decision is a guess with a budget attached.",
            ],
          },
          {
            p: "None of these is a traffic problem. They are all leaks, and a leak has a useful property: you have already paid for the water. Fixing one doesn't need a bigger budget. It makes the budget you have go further.",
          },
          { h: "A two-minute check" },
          {
            p: "Write down three numbers for last month: visitors, enquiries and sales. Divide each by the one before it. The smallest percentage is your biggest leak, and it is almost never the first one.",
          },
          { p: "Chapter 1 of the Blueprint (page 6) shows how to read the result and which chapter to go to next." },
          { link: { label: "Open the Blueprint again", url: c.downloadUrl } },
          {
            p: "Next time: why hiring good people for each piece of your marketing can still leave you with a system that doesn't work.",
          },
          { sign: SIGN },
        ],
        chrome(c, "It's rarely a traffic problem. Here's how to tell which part it is.")
      ),
  },
  {
    step: 3,
    key: "seq_3_education",
    name: "Education",
    purpose: "Explains why disconnected marketing services fail to produce consistent results.",
    delayDays: 2,
    build: (c) =>
      render(
        "Why “more marketing” keeps producing the same result",
        [
          { p: hi(c) },
          { p: "Here is how most growing businesses end up buying marketing." },
          {
            p: "A designer builds the website. Months later, a freelancer is hired to run ads. The ads send people to the homepage, because that's the page that exists. When results are thin, someone suggests a new landing page, written by a third person who has never seen the ads.",
          },
          {
            p: "Each of those people may be good at their job. The result still underperforms, for a reason that has nothing to do with skill: **nobody owns the handoffs.**",
          },
          { h: "Where the customers actually fall out" },
          {
            list: [
              "**Between the ad and the page.** The ad promises one thing; the page opens with another. The visitor decides they're in the wrong place in about three seconds.",
              "**Between the page and the enquiry.** The page explains everything and asks for nothing clear. Interested people leave meaning to come back.",
              "**Between the enquiry and the sale.** There's no follow-up after the first reply, so the lead goes to whoever answered faster.",
            ],
          },
          {
            p: "Notice that none of those gaps sits inside anyone's job description. The designer delivered a website. The ads person delivered clicks. Everyone did what they were paid for, and the customer still fell through the space between them.",
          },
          {
            p: "This is why spending more rarely fixes it. More budget through a system with gaps in it just means paying to lose more people at the same points.",
          },
          {
            note: "The useful question isn't “which service do I need next?” It's “who is responsible for the whole path a customer walks?”",
          },
          { p: "Next email: the five steps we use to build that path as one thing." },
          { sign: SIGN },
        ],
        chrome(c, "Good freelancers, disappointing results. The reason is in the gaps between them.")
      ),
  },
  {
    step: 4,
    key: "seq_4_solution",
    name: "Solution",
    purpose: "Introduces the SYNERGOX Growth System.",
    delayDays: 2,
    build: (c) =>
      render(
        "The five steps we run for every client",
        [
          { p: hi(c) },
          {
            p: "Last time I said the real problem is that nobody owns the whole path. This is how we own it. We call it the SYNERGOX Growth System, and it is five steps, always in this order.",
          },
          {
            steps: [
              "**Discover.** We look at your numbers, your current pages and how customers find you now, and locate the stage losing the most people. No building happens until we know what's broken.",
              "**Strategize.** One written plan: who you're talking to, what you're offering them, and which page and channel carry that offer. Everything built later answers to this document.",
              "**Build.** The website or landing page, written and designed around a single action. Built to load fast on a phone, because that's where most of your visitors are.",
              "**Acquire.** Campaigns on Meta and Google that send the right people to the page that was built for them, with tracking in place from the first click.",
              "**Optimize.** We read what the data says, fix the weakest stage, and test the next improvement. This step is what turns a launch into something that keeps getting better.",
            ],
          },
          {
            p: "The order matters more than any single step. Running ads before the page is ready wastes the budget. Optimizing before there's traffic gives you nothing to measure. Most of the disappointing marketing we're asked to look at is good work done in the wrong sequence.",
          },
          {
            p: "You don't have to take all five at once. Some businesses need the foundation first. Some already have traffic and need the conversion work. Tomorrow I'll show you exactly how it's packaged and what each part costs.",
          },
          { link: { label: "Or see the full system now", url: sales(c, "#method") } },
          { sign: SIGN },
        ],
        chrome(c, "Discover, Strategize, Build, Acquire, Optimize. And why the order matters most.")
      ),
  },
  {
    step: 5,
    key: "seq_5_offer",
    name: "Offer",
    purpose: "Presents the packages and the complete Growth Suite, with live prices.",
    delayDays: 1,
    build: (c) => {
      const f = c.funnel;
      const cur = f.currency;
      const buyable = f.live ? f.packages.filter((p) => p.checkout_enabled) : [];
      const bundle = f.live && f.bundle?.valid ? f.bundle : null;
      const blocks: Block[] = [
        { p: hi(c) },
        {
          p: "Over the last week I've described the problem (customers lost between the click and the sale) and how we approach it. Today is the practical part: how to have it done for you.",
        },
        {
          p: "There are separate packages, because businesses don't all start in the same place. Each one is a fixed scope for a one-time price.",
        },
      ];
      for (const p of buyable) {
        blocks.push({ h: `${p.name} — ${formatMoney(p.price_minor, cur)}` });
        if (p.audience) blocks.push({ p: p.audience });
        blocks.push({ list: p.deliverables });
      }
      if (buyable.length === 0) {
        blocks.push({ p: "The current packages, what each includes and what each costs are on the page below." });
      }
      if (bundle) {
        blocks.push(
          { h: `Or all of it: ${bundle.name}` },
          {
            p: `If you need more than one of these, buying them together costs less and works better, because the website, the campaigns and the optimization are planned as one project from the first day.`,
          },
          {
            ledger: [
              ...bundle.packages.map((p) => ({ label: p.name, value: formatMoney(p.price_minor, cur) })),
              { label: "Bought separately", value: formatMoney(bundle.total_minor, cur), struck: true },
              { label: `${bundle.name}, one payment`, value: formatMoney(bundle.price_minor, cur), strong: true },
              { label: "You save", value: formatMoney(bundle.savings_minor, cur), strong: true },
            ],
          }
        );
        if (bundle.extras.length) blocks.push({ p: `It also includes: ${bundle.extras.join(", ").toLowerCase()}.` });
      }
      blocks.push(
        { button: { label: "See the packages", url: sales(c, "#packages") } },
        {
          p: "Every package page lists exactly what's included and what isn't, so you know what you're buying before you pay. Payment is one-time; there's no retainer attached to any of them.",
        },
        { p: "Tomorrow: straight answers to the questions people ask before they buy." },
        { sign: SIGN }
      );
      return render(
        bundle ? "Three ways to work with us (and one way to get all three)" : "How to work with us, and what it costs",
        blocks,
        chrome(c, "What each package includes, what each one costs, and how to get all of them for less.")
      );
    },
  },
  {
    step: 6,
    key: "seq_6_objections",
    name: "Objection handling",
    purpose: "Answers the common questions about investment, implementation and fit.",
    delayDays: 2,
    build: (c) =>
      render(
        "“Is this right for my business?” — straight answers",
        [
          { p: hi(c) },
          { p: "These are the questions we're asked most before someone buys. Short answers, no spin." },
          { h: "“Is it worth the money?”" },
          {
            p: "It depends on one number: what a new customer is worth to you. If a single extra customer a month covers the package within a few months, the maths is easy. If it wouldn't, tell us, and we'll say so too. We would rather lose the sale than take money for work that can't pay for itself.",
          },
          { h: "“How much of my time will this take?”" },
          {
            p: "A short onboarding form after you pay, a kickoff conversation, and reviews at set points. We write, design and build. You approve, and answer the questions only you can answer. The most common cause of a slow project is feedback that sits, so we agree review dates up front.",
          },
          { h: "“Will it work in my industry?”" },
          {
            p: "The mechanics are the same whether you sell groceries, legal services or software: someone has to find you, understand the offer and take a step. What changes is the offer and the objections. If we look at your business and don't think we can help, we'll tell you before any work starts.",
          },
          { h: "“Do I have to pay for ads on top?”" },
          {
            p: "Yes, if you choose a package with campaigns. Ad spend goes from you directly to Meta and Google and isn't part of our fee. The accounts are opened in your name, so you can always see what was spent and you keep them if we stop working together.",
          },
          { h: "“Can you guarantee results?”" },
          {
            p: "Not a revenue figure, and be careful with anyone who does: they don't control your pricing, your delivery or your market. What we commit to is scope. Each package lists what you get, and you get all of it.",
          },
          { h: "“Which one should I start with?”" },
          {
            list: [
              "No website, or one you're embarrassed to send people to: **start with the foundation.**",
              "A decent site but not enough of the right people seeing it: **acquisition.**",
              "Traffic and leads, but too few of them buy: **conversion optimization.**",
              ...(c.funnel.live && c.funnel.bundle?.valid
                ? ["More than one of those: **the complete suite** covers all of them in one payment, for less than buying them one by one."]
                : []),
            ],
          },
          { button: { label: "Compare the packages", url: sales(c, "#packages") } },
          { p: "Still not sure? Reply with a line about your business and where you're stuck. We'll tell you which one we'd pick, or that none of them fit." },
          { sign: SIGN },
        ],
        chrome(c, "Cost, time, fit, ad spend and guarantees. The honest version.")
      ),
  },
  {
    step: 7,
    key: "seq_7_followup",
    name: "Follow-up",
    purpose: "Asks the reader to choose a package or book a discussion.",
    delayDays: 2,
    build: (c) =>
      render(
        "Where would you start?",
        [
          { p: hi(c) },
          {
            p: "This is the last email in this series. You've had the Blueprint, the reasoning behind it and the details of how we work. All that's left is the decision, and there are three reasonable ones.",
          },
          { h: "1. You know which part you need" },
          { p: "Pick the package, pay once, and fill in the short project brief that follows. Work starts from there." },
          { button: { label: "Choose your package", url: sales(c, "#packages") } },
          { h: "2. You'd rather talk it through first" },
          {
            p: `Book a free ${CALL_MINUTES}-minute call. We'll look at your numbers together and tell you which part is costing you the most. You keep the findings whether or not you buy anything.`,
          },
          { link: { label: "Book a free call", url: booking(c) } },
          { h: "3. You want to do it yourself" },
          {
            p: "Then the Blueprint is your plan. Work through the scorecard, fix the weakest part first, and re-measure in thirty days. It works; it just takes longer.",
          },
          { link: { label: "Download the Blueprint again", url: c.downloadUrl } },
          {
            p: "The only option that costs you money is the fourth one: leaving it as it is, and paying for visitors who don't become customers for another quarter.",
          },
          { p: "Whichever you choose, thank you for reading. If there's something these emails didn't answer, reply and ask." },
          { sign: SIGN },
        ],
        chrome(c, "Three sensible next steps, and the one that keeps costing you.")
      ),
  },
];

export const sequenceByStep = (step: number) => SEQUENCE.find((e) => e.step === step) ?? null;

/* ───────────────────────── Transactional ───────────────────────── */

const paidOn = (iso: string | null | undefined) => {
  const d = iso ? new Date(iso) : new Date();
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
};

export function orderConfirmation(o: Order, opts: { siteUrl: string; orderUrl: string; contactEmail: string; location: string }) {
  const cur = o.currency;
  const first = o.name.trim().split(/\s+/)[0] || "there";
  const paid = o.amount_paid_minor ?? o.amount_minor;
  const included = o.items.flatMap((i) => (o.items.length > 1 ? [`**${i.name}**`] : i.deliverables));
  const blocks: Block[] = [
    { p: `Hi ${first},` },
    { p: `Your payment has been confirmed. Thank you for choosing SYNERGOX. This email is your receipt.` },
    {
      ledger: [
        { label: "Order", value: o.reference },
        { label: "Purchased", value: o.item_name },
        ...(o.list_minor > paid
          ? [{ label: "Individual value", value: formatMoney(o.list_minor, cur), struck: true }]
          : []),
        { label: "Paid (one-time)", value: formatMoney(paid, cur), strong: true },
        { label: "Date", value: `${paidOn(o.paid_at)} WAT` },
      ],
    },
    { h: "What's included" },
    { list: included },
    { h: "What happens next" },
    {
      steps: [
        "**Send us your project brief.** A short form about your business, your goals and what you already have. It takes about five minutes and it's what lets us start.",
        "**We review it and confirm your kickoff** by email within two working days.",
        "**Work begins.** You'll have one point of contact and agreed review dates from the start.",
      ],
    },
    { button: { label: "Complete your project brief", url: opts.orderUrl } },
    { p: `Keep this email: the button above is your private link to your order. If anything looks wrong, reply here or write to ${opts.contactEmail}.` },
    { sign: SIGN },
  ];
  return render(`Payment confirmed: ${o.item_name} (${o.reference})`, blocks, {
    siteUrl: opts.siteUrl,
    preheader: "Your receipt, and the one thing we need from you to get started.",
    reason: `You're getting this because you bought ${o.item_name} from SYNERGOX.`,
    location: opts.location,
  });
}

export function orderNotice(o: Order, opts: { siteUrl: string; adminUrl: string; location: string }) {
  const cur = o.currency;
  return render(
    `New order: ${o.item_name} — ${formatMoney(o.amount_paid_minor ?? o.amount_minor, cur)}`,
    [
      { p: `**${o.name}** just paid for **${o.item_name}**.` },
      {
        ledger: [
          { label: "Reference", value: o.reference },
          { label: "Amount paid", value: formatMoney(o.amount_paid_minor ?? o.amount_minor, cur), strong: true },
          { label: "Email", value: o.email },
          { label: "Phone", value: o.phone || "not given" },
          { label: "Came from", value: o.offer_source === "exit_popup" ? "Exit offer" : o.offer_source === "email" ? "Email sequence" : "Sales page" },
          { label: "Confirmed by", value: o.verified_via === "webhook" ? "Paystack webhook" : "Paystack verification" },
        ],
      },
      { p: "The buyer has been sent their receipt and asked to complete the project brief." },
      { button: { label: "Open the order", url: opts.adminUrl } },
    ],
    {
      siteUrl: opts.siteUrl,
      preheader: `${o.name} · ${o.reference}`,
      reason: "Sent to the SYNERGOX team for every confirmed order.",
      location: opts.location,
    }
  );
}

export function briefNotice(o: Order, opts: { siteUrl: string; adminUrl: string; location: string }) {
  const answers = Object.entries(o.onboarding ?? {}).filter(([, v]) => String(v).trim() !== "");
  return render(
    `Project brief received: ${o.name} (${o.item_name})`,
    [
      { p: `**${o.name}** has sent the project brief for **${o.item_name}** (${o.reference}).` },
      ...answers.flatMap(([k, v]): Block[] => [{ h: k }, { p: String(v) }]),
      { button: { label: "Open the order", url: opts.adminUrl } },
    ],
    {
      siteUrl: opts.siteUrl,
      preheader: "Ready for kickoff.",
      reason: "Sent to the SYNERGOX team when a buyer completes onboarding.",
      location: opts.location,
    }
  );
}
