import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* Self-hosted at build time: no render-blocking request to Google, no layout shift. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  // Variable weight + width: the condensed poster headlines and the regular
  // section heads are one file.
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});
const body = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-serif",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const TITLE = "SYNERGOX — The Business Growth Blueprint (free guide)";
const DESCRIPTION =
  "Your business could be losing customers you already paid to attract. Get the free Business Growth Blueprint from SYNERGOX and find the marketing and conversion problems costing you revenue.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · SYNERGOX",
  },
  description: DESCRIPTION,
  applicationName: "SYNERGOX",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "SYNERGOX",
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
 * The root layout is only the document shell and fonts. The public funnel
 * lives in app/(site); the dashboard lives in app/admin.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
