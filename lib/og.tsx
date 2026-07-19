import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { BG_GRADIENT, COLORS } from "@/lib/brand";

/** 三張分享圖（/ 、/pos、/rota）共用嘅尺寸，Facebook／Twitter 標準 OG 大細。 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OgImageProps = {
  /** 標題上面嗰行細橙字（會轉全大楷）。 */
  eyebrow: string;
  /** 大字標題。 */
  title: string;
  /** 標題下面用「·」分隔嘅關鍵詞。 */
  tags: readonly string[];
  /** 橙掣文字（箭咀由呢度加，唔使自己打）。 */
  cta: string;
};

/**
 * 出一張 ShopOps 分享圖：左邊 logo、右邊 eyebrow / 標題 / tags / CTA 掣。
 * 版面同顏色三頁共用，各頁只入自己嘅文案。
 *
 * ⚠️ satori（next/og）唔係真瀏覽器：一個 element 有多過一個 child 就一定要
 * 明寫 display:flex，`{a} {b}` 呢類 JSX 會變兩個 child 而爆 build。
 */
export async function renderOgImage({ eyebrow, title, tags, cta }: OgImageProps) {
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
            {eyebrow}
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
            {title}
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
            {tags.flatMap((tag, i) =>
              i === 0
                ? [<span key={tag}>{tag}</span>]
                : [<span key={`dot-${tag}`}>·</span>, <span key={tag}>{tag}</span>]
            )}
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
              {`${cta} →`}
            </div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
