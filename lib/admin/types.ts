export type Lead = {
  id: string;
  created_at: string;
  name: string | null;
  email: string | null;
  status: string;
  status_updated_at: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  source: string | null;
  /** customer = has a paid order · checkout_started = began one · none */
  purchase?: "customer" | "checkout_started" | "none";
  paid_minor?: number;
  subscription?: "subscribed" | "unsubscribed" | null;
  meta: Record<string, unknown>;
  record: Record<string, unknown>;
};

/** admin_funnel_overview: the whole funnel, counted from recorded visits, events and orders. */
export type FunnelOverview = {
  days: number;
  from: string;
  to: string;
  tracking_since: string | null;
  currency: string;
  visitors: number;
  optin_visitors: number;
  optins: number;
  optins_all_time: number;
  optin_rate: number | null;
  sales_visitors: number;
  checkout_visitors: number;
  orders_started: number;
  orders_started_paid: number;
  abandonment_rate: number | null;
  orders_paid: number;
  package_sales: number;
  bundle_sales: number;
  revenue_minor: number;
  revenue_all_time_minor: number;
  orders_paid_all_time: number;
  aov_minor: number | null;
  sales_rate: number | null;
  package_rate: number | null;
  bundle_rate: number | null;
  exit_shown: number;
  exit_clicks: number;
  exit_dismissed: number;
  exit_purchases: number;
  exit_revenue_minor: number;
  exit_click_rate: number | null;
  exit_rate: number | null;
  awaiting_onboarding: number;
  by_item: { slug: string; name: string; kind: "package" | "bundle"; clicks: number; checkouts: number; sales: number; revenue_minor: number }[];
  series: { day: string; visitors: number; optins: number; sales: number; revenue_minor: number }[];
  top_pages: { path: string; n: number }[];
  by_source: { source: string; n: number }[];
  recent_orders: import("@/lib/funnel/types").Order[];
};

export type EmailStats = {
  subscribers: number;
  subscribed: number;
  unsubscribed: number;
  due_now: number;
  stalled: number;
  by_step: Record<string, number>;
  by_key: Record<string, { sent: number; failed: number; last: string | null }>;
  recent: { created_at: string; email: string; email_key: string; status: "sent" | "failed"; error: string | null }[];
};

export type LeadNote = {
  id: string;
  kind: "note" | "status";
  body: string;
  author_email: string | null;
  created_at: string;
};

export type Consultation = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  answers: Record<string, unknown>;
  status: string;
  booked_at: string | null;
  scheduled_at: string | null;
  calendly_event_uri: string | null;
  admin_notes: string | null;
  lead_id: string | null;
};

export type Overview = {
  days: number;
  from: string;
  to: string;
  tracking_since: string | null;
  visitors: number;
  page_views: number;
  visitors_all_time: number;
  leads: number;
  leads_all_time: number;
  new_inquiries: number;
  consultation_requests: number;
  bookings: number;
  bookings_all_time: number;
  upcoming: number;
  conversion_rate: number | null;
  series: { day: string; leads: number; visitors: number; bookings: number }[];
  by_status: Record<string, number>;
  by_source: { source: string; n: number }[];
  top_pages: { path: string; n: number }[];
  latest: Lead[];
  activity: { type: string; at: string; who: string; detail: string | null; lead_id: string | null }[];
};

export type ActionState = { ok: boolean; message: string } | null;
