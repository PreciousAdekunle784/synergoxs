import { ImageResponse } from "next/og";

/* The card people see when the site is shared. Generated at build time. */
export const alt = "Synergox — more customers from the traffic you already pay for";
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
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 8, borderRadius: 8, background: "#00C551" }} />
          <div style={{ fontSize: 30, fontWeight: 700, color: "#0A0C0A", letterSpacing: -0.5 }}>
            Synergox
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3.5,
              color: "#0A0C0A",
            }}
          >
            More customers from the traffic you already pay for.
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#454C45" }}>
            Funnels, ads and follow-up, done for you.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              background: "#00C551",
              color: "#0A0C0A",
              fontSize: 28,
              fontWeight: 700,
              padding: "18px 34px",
              borderRadius: 999,
            }}
          >
            Free 30-minute growth teardown
          </div>
          <div style={{ fontSize: 26, color: "#5E665E" }}>synergox.co</div>
        </div>
      </div>
    ),
    size
  );
}
