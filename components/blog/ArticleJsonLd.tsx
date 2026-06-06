import { SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/posts";

// 每篇文章嘅 BlogPosting 結構化資料，畀 Google 富摘要（標題 / 日期 / 出版機構）。
// 由 post metadata 自動產生，唔使逐篇手寫。
export default function ArticleJsonLd({ post }: { post: Post }) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "ShopOps", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "ShopOps",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
