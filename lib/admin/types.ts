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
  meta: Record<string, unknown>;
  record: Record<string, unknown>;
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
