import type { Metadata } from "next";
import ComicAd from "./ComicAd";

// 獨立廣告頁 /this-is-you —— 餐廳老闆煩惱漫畫 + 繁/简/EN 切換。
// og:image / twitter:image 由同目錄 opengraph-image.tsx（file convention）供圖，
// 1200×630 標準尺寸，唔會好似之前張直幅漫畫圖咁被社交平台裁爛。
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
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return <ComicAd />;
}
