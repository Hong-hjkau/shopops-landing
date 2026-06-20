import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Reviewscope — Restaurant Review Monitoring";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0b0b0d 0%, #1a1a1f 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "440px",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ShopOps" width={440} height={248} />
        </div>

        {/* Right: Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "40px",
            flex: 1,
          }}
        >
          <div
            style={{
              color: "#fb923c",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Restaurant reputation
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "60px",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: "28px",
            }}
          >
            Know the moment a bad review lands.
          </div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "24px",
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <span>Google</span>
            <span>·</span>
            <span>TripAdvisor</span>
            <span>·</span>
            <span>AI analysis</span>
            <span>·</span>
            <span>Telegram alerts</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
