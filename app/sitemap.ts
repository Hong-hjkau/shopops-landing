import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { postsByDate } from "@/lib/posts";

// Homepage + /blog index + 每篇文章。新文章加入 lib/posts.ts 後自動出現喺 sitemap。
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = postsByDate();
  return [
    {
      // 帶尾 slash 同 metadataBase 解析出嚟嘅 canonical 逐字對齊
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
