/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Pages from earlier versions of the site. Old links, emails and adverts
      // may still point at them, so each one lands somewhere sensible.
      { source: "/offer", destination: "/growth-system", permanent: false },
      { source: "/payment", destination: "/growth-system", permanent: false },
      { source: "/services", destination: "/growth-system", permanent: false },
      { source: "/learn", destination: "/", permanent: false },
      { source: "/guide", destination: "/booked", permanent: false },
      { source: "/thank-you", destination: "/growth-system", permanent: false },
      { source: "/blueprint", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      // Private, per-person pages: never cached, never indexed.
      {
        source: "/(order|checkout|unsubscribe)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};
export default nextConfig;
