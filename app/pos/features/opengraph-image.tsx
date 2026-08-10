import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

// 分享圖文案一律英文 —— 同 `/`、`/pos`、`/rota` 一致，對外主要客群係英國餐廳。
// 呢條 route 係 file-based metadata convention，攞唔到 `?lang=` searchParams，
// 所以技術上都做唔到三語圖；三語只影響 title／description（見 page.tsx）。
//
// ⚠️ 唔好喺呢度寫死價錢。價錢單一來源係 lib/pos-content.ts，硬編入圖會多一個
// 改價時漂移唔到嘅位（同 recipeBoundary 曾經犯過嘅錯一樣）。
export const runtime = "nodejs";
export const alt = "ShopOps POS features — Core POS plus the tools you choose";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Restaurant POS features",
    title: "Core POS, plus the tools you choose.",
    tags: ["Core POS", "Optional add-ons", "English + Chinese", "Clear monthly price"],
    cta: "Book a demo",
  });
}
