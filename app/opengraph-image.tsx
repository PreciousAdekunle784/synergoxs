import { ImageResponse } from "next/og";

/* The card people see when the site is shared. Generated at build time. */
export const alt = "SYNERGOX — The Business Growth Blueprint, a free guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "68px 78px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 6, background: "#00C551" }} />
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0A0C0A", letterSpacing: 3 }}>SYNERGOX</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#5E665E", letterSpacing: 4, textTransform: "uppercase" }}>
            Free guide · 24 pages
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#0A0C0A",
              textTransform: "uppercase",
            }}
          >
            Your business could be losing customers
          </div>
          <div style={{ marginTop: 10, fontSize: 64, fontStyle: "italic", lineHeight: 1.05, color: "#007A35" }}>
            you already paid to attract.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              background: "#00C551",
              color: "#0A0C0A",
              fontSize: 26,
              fontWeight: 800,
              padding: "18px 30px",
              borderRadius: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Get the Business Growth Blueprint
          </div>
          <div style={{ fontSize: 24, color: "#5E665E" }}>synergox.co</div>
        </div>
      </div>
    ),
    size
  );
}
