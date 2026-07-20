import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Is this you? — ShopOps";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// 文字全英文：satori 預設字型 render 唔到中文（漫畫頁本身係三語，但分享卡淨係英文）。
export default async function OpengraphImage() {
  return renderOgImage({
    eyebrow: "A comic for shop owners",
    title: "Is this you after closing time?",
    tags: ["Endless paperwork", "POS that fights you", "Same grind daily"],
    cta: "See the comic",
  });
}
