import Link from "next/link";
import type { Post } from "@/lib/posts";

// 文末轉化區（漏斗出口）。Step 1 唔整獨立 gated PDF，先 reuse 首頁既有
// savings calculator + demo 聯絡表做 conversion，已係完整漏斗。
// 將來 Step 2 換成「留 email 攞免費佣金計算表 PDF」再改呢個 component。
//
// 食文章 lang，令中文文章嘅 CTA 都係中文（同 article 一致）。
const copy = {
  en: {
    eyebrow: "Work out your own numbers",
    title: "See how much delivery commission is really costing you",
    body: "ShopOps is an all-in-one ordering system for small UK restaurants — QR self-ordering, staff POS and your own takeaway site, so repeat customers order direct and you keep what the apps would have taken. Use the free savings calculator to see the gap, or book a quick demo.",
    calc: "Try the savings calculator",
    demo: "Book a free demo",
  },
  "zh-Hant": {
    eyebrow: "計下你自己盤數",
    title: "睇下外賣平台佣金實際食緊你幾多",
    body: "ShopOps 係專為英國小餐廳而設嘅一站式落單系統 —— QR 自助點餐、員工 POS、加你自己嘅外賣網，令熟客直接幫襯你，平台本來抽走嗰筆你自己袋返。用免費計算機睇下個差距，或者預約一個快速 demo。",
    calc: "試下慳錢計算機",
    demo: "預約免費 demo",
  },
  "zh-Hans": {
    eyebrow: "算算你自己的账",
    title: "看看外卖平台佣金实际吃掉你多少",
    body: "ShopOps 是专为英国小餐厅而设的一站式下单系统 —— QR 自助点餐、员工 POS，加你自己的外卖网，让熟客直接光顾你，平台本来抽走的那笔你自己留下。用免费计算器看看差距，或预约一次快速 demo。",
    calc: "试试省钱计算器",
    demo: "预约免费 demo",
  },
} as const;

export default function LeadMagnet({ lang = "en" }: { lang?: Post["lang"] }) {
  const t = copy[lang];
  return (
    <aside className="my-10 rounded-2xl border border-accent-soft-border bg-accent-soft-bg p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
        {t.eyebrow}
      </p>
      <h3 className="mt-2 text-xl sm:text-2xl font-bold text-text">{t.title}</h3>
      <p className="mt-3 text-text leading-relaxed">{t.body}</p>
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Link
          href="/#savings"
          className="inline-flex justify-center px-5 py-3 bg-accent text-on-accent rounded-xl font-bold text-sm hover:bg-accent-hover transition"
        >
          {t.calc}
        </Link>
        <Link
          href="/#contact"
          className="inline-flex justify-center px-5 py-3 border border-border text-text rounded-xl font-semibold text-sm hover:bg-surface transition"
        >
          {t.demo}
        </Link>
      </div>
    </aside>
  );
}
