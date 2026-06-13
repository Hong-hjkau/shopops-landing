import type { Metadata } from "next";
import ComicAd from "./ComicAd";

// 獨立廣告頁 /this-is-you —— 餐廳老闆煩惱漫畫 + 繁/简/EN 切換。
// og:image 相對路徑經 layout metadataBase（SITE_URL）自動轉絕對網址。
export const metadata: Metadata = {
  title: "這是你嗎？— ShopOps 店管家",
  description:
    "外賣平台抽三成佣金、夜晚對數做報表、一堆系統各自為政、食安過敏原驚出事？一個 ShopOps 就搞掂晒。",
  alternates: { canonical: "/this-is-you" },
  openGraph: {
    title: "這是你嗎？— ShopOps 店管家",
    description:
      "外賣平台抽三成佣金、夜晚對數、系統各自為政、食安驚出事？一個 ShopOps 就搞掂晒。",
    url: "/this-is-you",
    images: ["/comic-hant.webp"],
  },
  twitter: { card: "summary_large_image", images: ["/comic-hant.webp"] },
};

export default function Page() {
  return <ComicAd />;
}
