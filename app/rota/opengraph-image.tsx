import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { BG_GRADIENT, COLORS } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "Rota — Staff Scheduling & Clock-in";
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
          background: BG_GRADIENT,
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
              color: COLORS.accentHover,
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Scheduling &amp; attendance
          </div>
          <div
            style={{
              color: COLORS.text,
              fontSize: "60px",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: "28px",
            }}
          >
            Rotas and clock-in, run from Telegram.
          </div>
          <div
            style={{
              color: COLORS.textSecondary,
              fontSize: "24px",
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <span>Rota grid</span>
            <span>·</span>
            <span>Location clock-in</span>
            <span>·</span>
            <span>Shift swaps</span>
            <span>·</span>
            <span>Hours export</span>
          </div>
          <div style={{ marginTop: "36px", display: "flex" }}>
            <div
              style={{
                background: COLORS.accent,
                color: COLORS.onAccent,
                fontSize: "26px",
                fontWeight: 700,
                padding: "14px 32px",
                borderRadius: "12px",
              }}
            >
              Free trial →
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
