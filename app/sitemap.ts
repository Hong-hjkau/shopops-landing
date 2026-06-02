import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 單頁站，只得 homepage 一條 entry。加新頁時喺度補。
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // 帶尾 slash 同 metadataBase 解析出嚟嘅 canonical 逐字對齊
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
