import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

/* Self-hosted at build time: no render-blocking request to Google, no layout shift. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const TITLE = "Synergox — More customers from the traffic you already pay for";
const DESCRIPTION =
  "Synergox is a growth marketing agency. We find the stage of your funnel losing the most customers and rebuild it — offer, pages, ads and follow-up — into a system with a cost per customer you can forecast. Start with a free 30-minute growth teardown.";

export const metadata: Metadata = {
  metadataBase: new URL("https://synergox.co"),
  title: {
    default: TITLE,
    template: "%s · Synergox",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description:
      "Funnels, ads and follow-up, done for you. Start with a free 30-minute growth teardown of your own numbers.",
    url: "https://synergox.co",
    siteName: "Synergox",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

/**
 * The root layout is only the document shell and fonts. The public website
 * (navigation, footer) lives in app/(site); the dashboard lives in app/admin.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
