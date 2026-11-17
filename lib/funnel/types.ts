/** The offer, as the database publishes it (public_funnel). Prices are in minor units. */
export type Package = {
  id: string;
  slug: string;
  name: string;
  audience: string | null;
  description: string | null;
  deliverables: string[];
  scope: string[];
  delivery_time: string | null;
  price_minor: number;
  checkout_enabled: boolean;
  active?: boolean;
  sort_order?: number;
};

export type BundlePackage = {
  id: string;
  slug: string;
  name: string;
  price_minor: number;
  deliverables: string[];
  delivery_time: string | null;
};

export type Bundle = {
  slug: string;
  name: string;
  headline: string | null;
  description: string | null;
  price_minor: number;
  /** sum of the included, active packages bought one by one */
  total_minor: number;
  /** total_minor − price_minor, never negative */
  savings_minor: number;
  package_ids: string[];
  packages: BundlePackage[];
  extras: string[];
  scope: string[];
  active: boolean;
  /** false whenever the bundle would not be a real saving; never shown or sold then */
  valid: boolean;
};

export type MobileTrigger = "off" | "back" | "scroll_up" | "back_and_scroll";

export type ExitOffer = {
  enabled: boolean;
  headline: string;
  subheadline: string;
  body: string;
  cta_label: string;
  dismiss_label: string;
  special_price_minor: number | null;
  /** what the exit offer actually charges */
  price_minor: number;
  is_special: boolean;
  savings_minor: number;
  min_seconds: number;
  min_scroll_percent: number;
  desktop_trigger: boolean;
  mobile_trigger: MobileTrigger;
  suppress_days: number;
};

export type Funnel = {
  currency: string;
  packages: Package[];
  bundle: Bundle | null;
  exit: ExitOffer | null;
  /** false when the database couldn't be reached: prices and checkout are withheld */
  live: boolean;
};

export type OrderStatus = "pending" | "paid" | "failed";
export type OnboardingStatus = "awaiting" | "submitted" | "in_progress" | "complete";

export type OrderItem = {
  slug: string;
  name: string;
  price_minor: number;
  deliverables: string[];
  delivery_time?: string | null;
};

/** An order as its buyer sees it (order_public). */
export type PublicOrder = {
  reference: string;
  status: OrderStatus;
  created_at: string;
  paid_at: string | null;
  name: string;
  email: string;
  item_type: "package" | "bundle";
  item_slug: string;
  item_name: string;
  items: OrderItem[];
  list_minor: number;
  amount_minor: number;
  currency: string;
  offer_source: string;
  failure_reason: string | null;
  onboarding_status: OnboardingStatus;
  onboarding: Record<string, string> | null;
};

/** The full row, for the server and the dashboard. */
export type Order = PublicOrder & {
  id: string;
  token?: string;
  updated_at: string;
  phone: string | null;
  amount_paid_minor: number | null;
  gateway_id: string | null;
  channel: string | null;
  verified_via: string | null;
  session_id: string | null;
  onboarding_submitted_at: string | null;
  confirmation_sent_at: string | null;
  admin_notes: string | null;
  lead_id?: string | null;
};
