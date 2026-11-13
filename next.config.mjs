/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // /guide was the old post-booking page; /booked replaces it. Kept as a
      // redirect in case Calendly or an old email still points there.
      { source: "/guide", destination: "/booked", permanent: false },
      // /payment was an unfinished pricing page with placeholder checkout links.
      { source: "/payment", destination: "/offer", permanent: false },
    ];
  },
};
export default nextConfig;
