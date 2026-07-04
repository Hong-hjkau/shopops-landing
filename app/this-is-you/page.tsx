import type { Metadata } from "next";
import ComicAd from "./ComicAd";

// 獨立廣告頁 /this-is-you —— 餐廳老闆煩惱漫畫 + 繁/简/EN 切換。
// og:image 相對路徑經 layout metadataBase（SITE_URL）自動轉絕對網址。
export const metadata: Metadata = {
  title: "這是你嗎？— ShopOps 店管家",
  description:
    "收工後文書做不完、POS 功能唔啱用、日日重複悶到爆、資料太多做唔哂？店管家 ShopOps 為你度身訂造，營運智能化效率倍增。",
  alternates: { canonical: "/this-is-you" },
  openGraph: {
    title: "這是你嗎？— ShopOps 店管家",
    description:
      "文書做不完、POS 唔啱用、日日重複、資料太多？店管家 ShopOps 度身訂造，營運智能化效率倍增。",
    url: "/this-is-you",
    images: ["/comic-hant.webp"],
  },
  twitter: { card: "summary_large_image", images: ["/comic-hant.webp"] },
};

export default function Page() {
  return <ComicAd />;
}
