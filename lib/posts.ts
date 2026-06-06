// Blog 文章登記表 —— blog index 同 sitemap 共用嘅 single source of truth。
// 加新文章：① 喺 app/blog/<slug>/page.mdx 寫文 ② 喺下面 POSTS 加一條 entry。
// slug 必須同資料夾名一致（route = /blog/<slug>）。
export type Post = {
  slug: string;
  title: string;
  description: string;
  /** 發佈日期 ISO（YYYY-MM-DD），用嚟排序 + JSON-LD datePublished */
  date: string;
  /** 閱讀時間（分鐘），index 卡片顯示 */
  readingMinutes: number;
  /** 內容語言，畀 <article lang> + hreflang 用；目前 blog 英文行先 */
  lang: "en" | "zh-Hant";
};

export const POSTS: Post[] = [
  {
    slug: "deliveroo-uber-eats-just-eat-commission-uk-2026",
    title:
      "Deliveroo, Uber Eats & Just Eat Commission Explained (2026 UK Guide)",
    description:
      "Exactly how much Deliveroo, Uber Eats and Just Eat take from each order in the UK — with the hidden VAT and fees, a worked £10-dish example, and how to cut your reliance on them.",
    date: "2026-06-06",
    readingMinutes: 9,
    lang: "en",
  },
];

// 最新喺前
export const postsByDate = (): Post[] =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);
