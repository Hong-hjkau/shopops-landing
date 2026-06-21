import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "ShopOps — Custom Software & Business Automation";
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
            Custom software · Automation
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
            Software built around how you work.
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
            <span>Automation</span>
            <span>·</span>
            <span>Custom systems</span>
            <span>·</span>
            <span>AI &amp; data</span>
            <span>·</span>
            <span>Products</span>
          </div>
          <div style={{ marginTop: "36px", display: "flex" }}>
            <div
              style={{
                background: "#f97316",
                color: "#fff",
                fontSize: "26px",
                fontWeight: 700,
                padding: "14px 32px",
                borderRadius: "12px",
              }}
            >
              Free consult →
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
