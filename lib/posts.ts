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
  /** 內容語言，畀 <article lang> + hreflang + JSON-LD inLanguage 用 */
  lang: "en" | "zh-Hant" | "zh-Hans";
  /** 翻譯群組 id：同一篇文嘅唔同語言版共用同一個 group，畀 hreflang 互相連結 */
  group: string;
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
    group: "delivery-commission",
  },
  {
    slug: "deliveroo-uber-eats-just-eat-commission-uk-2026-zh-hant",
    title: "Deliveroo、Uber Eats、Just Eat 佣金拆解（2026 英國餐廳指南）",
    description:
      "Deliveroo、Uber Eats、Just Eat 在英國每張訂單實際抽走多少 —— 連同隱藏的 VAT 與各項費用、一個 £10 菜式的實算例子，以及如何減少對外賣平台的依賴。",
    date: "2026-06-06",
    readingMinutes: 9,
    lang: "zh-Hant",
    group: "delivery-commission",
  },
];

// 最新喺前
export const postsByDate = (): Post[] =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string): Post | undefined =>
  POSTS.find((p) => p.slug === slug);

// 同一 group 嘅所有語言版本（包括自己）
export const getTranslations = (slug: string): Post[] => {
  const p = getPost(slug);
  if (!p) return [];
  return POSTS.filter((x) => x.group === p.group);
};

// 畀 Next metadata `alternates.languages` 用：BCP-47 lang code → URL path。
// 額外加 x-default 指返英文版（搜尋引擎搵唔到合適語言時 fallback）。
export const languageAlternates = (slug: string): Record<string, string> => {
  const group = getTranslations(slug);
  const langs: Record<string, string> = {};
  for (const p of group) langs[p.lang] = `/blog/${p.slug}`;
  const en = group.find((p) => p.lang === "en");
  if (en) langs["x-default"] = `/blog/${en.slug}`;
  return langs;
};

// index 卡片語言標籤
export const langLabel = (lang: Post["lang"]): string =>
  lang === "en" ? "EN" : lang === "zh-Hant" ? "繁" : "簡";
