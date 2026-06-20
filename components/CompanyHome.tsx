"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection, { type ContactCopy } from "@/components/ContactSection";

type Pillar = { icon: string; title: string; desc: string };
type Product = { icon: string; name: string; desc: string; href: string; cta: string };
type Reason = { icon: string; title: string; desc: string };

const dict = {
  "zh-Hant": {
    nav: { services: "服務", products: "產品", contact: "聯絡", blog: "網誌", cta: "免費諮詢" },
    hero: {
      title: ["度身訂造軟件 × 業務自動化", "幫你慳返重複工夫"],
      subtitle:
        "SHOPOPS 係一隊軟件團隊。數據自動化、AI 應用 —— 你話畀我哋知個痛點，我哋幫你整一套真係用得着、唔使俾佣金、唔使受制於人嘅系統。",
      ctaPrimary: "免費諮詢",
      ctaSecondary: "睇我哋嘅產品",
    },
    services: {
      title: "我哋做咩",
      items: [
        { icon: "🔄", title: "業務流程自動化", desc: "把重複手動工序自動化：報表、提醒、數據收集、定時任務、Telegram／email 通知，慳返人手、唔會漏。" },
        { icon: "🛠️", title: "度身訂造軟件 / 系統", desc: "按你需求開發 web app、內部工具、管理後台、dashboard。唔使硬塞現成軟件，啱你流程先做。" },
        { icon: "🤖", title: "AI / 數據分析", desc: "LLM 應用（摘要 / 分類 / 客服）、數據監控、市場 / 評價 / 信號掃描，幫你由數據攞到決策。" },
        { icon: "📦", title: "自家現成產品", desc: "已經做好、即裝即用嘅 SaaS，唔使從零開發。" },
      ] as Pillar[],
    },
    products: {
      title: "自家產品",
      subtitle: "已經喺真實生意度用緊嘅系統，即裝即用。",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "餐廳點餐 / POS / 廚房看板 / 離線後備，零佣金、唔鎖數據。", href: "/pos", cta: "了解更多" },
        { icon: "⭐", name: "Reviewscope", desc: "餐廳評價監察 —— 各大平台評分一個版面睇晒，差評即時知。", href: "#contact", cta: "了解更多" },
        { icon: "🗓️", name: "Rota", desc: "員工排班 + 打卡出席，定位簽到、自動計時數。", href: "#contact", cta: "了解更多" },
      ] as Product[],
    },
    why: {
      title: "點解揀 SHOPOPS",
      items: [
        { icon: "🤝", title: "直接溝通、唔外判", desc: "同實際做嘢嗰個人傾，唔使隔幾層、唔使等外判。" },
        { icon: "🍜", title: "由實戰磨出嚟", desc: "產品喺真生意日日用住改出嚟，唔係 demo ware。" },
        { icon: "🔓", title: "你嘅嘢係你嘅", desc: "零佣金、唔鎖數據、唔綁約。" },
      ] as Reason[],
    },
    contact: {
      title: "想傾個項目，或者了解多啲？",
      subtitle: "留低資料同你想解決嘅問題，我哋會聯絡你。",
      reassure: "免費諮詢 · 唔使預先付費",
      nameLabel: "你嘅名 / 公司名",
      namePlaceholder: "例：陳生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "你想做咩 / 想解決咩問題？",
      messagePlaceholder: "例：想把每日入貨報表自動化 / 想整一個訂單管理系統...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "由自動化小工具到完整系統都做，歡迎傾下。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  "zh-Hans": {
    nav: { services: "服务", products: "产品", contact: "联系", blog: "博客", cta: "免费咨询" },
    hero: {
      title: ["量身定制软件 × 业务自动化", "帮你省下重复工序"],
      subtitle:
        "SHOPOPS 是一支软件团队。数据自动化、AI 应用 —— 你告诉我们痛点，我们帮你做一套真正好用、不用付佣金、不受制于人的系统。",
      ctaPrimary: "免费咨询",
      ctaSecondary: "看看我们的产品",
    },
    services: {
      title: "我们做什么",
      items: [
        { icon: "🔄", title: "业务流程自动化", desc: "把重复手动工序自动化：报表、提醒、数据收集、定时任务、Telegram／email 通知，省人手、不漏单。" },
        { icon: "🛠️", title: "量身定制软件 / 系统", desc: "按你需求开发 web app、内部工具、管理后台、dashboard。不用硬塞现成软件，贴合你流程才做。" },
        { icon: "🤖", title: "AI / 数据分析", desc: "LLM 应用（摘要 / 分类 / 客服）、数据监控、市场 / 评价 / 信号扫描，帮你从数据得出决策。" },
        { icon: "📦", title: "自家现成产品", desc: "已经做好、即装即用的 SaaS，不用从零开发。" },
      ] as Pillar[],
    },
    products: {
      title: "自家产品",
      subtitle: "已经在真实生意里使用的系统，即装即用。",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "餐厅点餐 / POS / 厨房看板 / 离线备援，零佣金、不锁数据。", href: "/pos", cta: "了解更多" },
        { icon: "⭐", name: "Reviewscope", desc: "餐厅评价监察 —— 各大平台评分一个面板看齐，差评即时知道。", href: "#contact", cta: "了解更多" },
        { icon: "🗓️", name: "Rota", desc: "员工排班 + 打卡考勤，定位签到、自动算工时。", href: "#contact", cta: "了解更多" },
      ] as Product[],
    },
    why: {
      title: "为什么选 SHOPOPS",
      items: [
        { icon: "🤝", title: "直接沟通、不外包", desc: "跟实际做事的人聊，不用隔几层、不用等外包。" },
        { icon: "🍜", title: "实战打磨出来", desc: "产品在真实生意里天天用着改出来，不是 demo ware。" },
        { icon: "🔓", title: "你的东西是你的", desc: "零佣金、不锁数据、不绑约。" },
      ] as Reason[],
    },
    contact: {
      title: "想聊个项目，或了解更多？",
      subtitle: "留下资料和你想解决的问题，我们会联系你。",
      reassure: "免费咨询 · 不用预先付费",
      nameLabel: "你的名字 / 公司名",
      namePlaceholder: "例：陈先生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "你想做什么 / 想解决什么问题？",
      messagePlaceholder: "例：想把每日进货报表自动化 / 想做一个订单管理系统...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      orEmail: "或直接 email：",
      note: "从自动化小工具到完整系统都做，欢迎聊聊。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  en: {
    nav: { services: "Services", products: "Products", contact: "Contact", blog: "Blog", cta: "Free consult" },
    hero: {
      title: ["Custom software & automation", "that takes the busywork off your plate"],
      subtitle:
        "SHOPOPS is a software team. Data automation and AI — tell us the problem and we'll build a system that actually works, charges no commission, and keeps you in control.",
      ctaPrimary: "Free consult",
      ctaSecondary: "See our products",
    },
    services: {
      title: "What we do",
      items: [
        { icon: "🔄", title: "Business process automation", desc: "Automate repetitive manual work — reports, reminders, data collection, scheduled jobs, Telegram/email alerts. Less manual effort, nothing slips through." },
        { icon: "🛠️", title: "Custom software & systems", desc: "We build web apps, internal tools, admin panels and dashboards around your needs — not a generic product you have to bend your workflow to fit." },
        { icon: "🤖", title: "AI & data analysis", desc: "LLM apps (summarise / classify / support), data monitoring, market / review / signal scanning — turning your data into decisions." },
        { icon: "📦", title: "Ready-made products", desc: "Built-and-ready SaaS you can use right away, no building from scratch." },
      ] as Pillar[],
    },
    products: {
      title: "Our products",
      subtitle: "Systems already running in real businesses, ready to use.",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "Restaurant ordering / POS / kitchen board / offline backup. Zero commission, your data stays yours.", href: "/pos", cta: "Learn more" },
        { icon: "⭐", name: "Reviewscope", desc: "Restaurant review monitoring — every platform's ratings in one dashboard, bad reviews flagged instantly.", href: "#contact", cta: "Learn more" },
        { icon: "🗓️", name: "Rota", desc: "Staff scheduling and clock-in attendance — location check-in, automatic hours.", href: "#contact", cta: "Learn more" },
      ] as Product[],
    },
    why: {
      title: "Why SHOPOPS",
      items: [
        { icon: "🤝", title: "Talk to the maker, no outsourcing", desc: "You deal with the person actually building it — no layers, no offshore handoffs." },
        { icon: "🍜", title: "Forged in real use", desc: "Our products are used and refined daily in a real business — not demo ware." },
        { icon: "🔓", title: "What's yours stays yours", desc: "Zero commission, no data lock-in, no contracts." },
      ] as Reason[],
    },
    contact: {
      title: "Want to talk about a project, or just learn more?",
      subtitle: "Leave your details and the problem you want solved — we'll get in touch.",
      reassure: "Free consult · no upfront payment",
      nameLabel: "Your name / company",
      namePlaceholder: "e.g. ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What do you want built or solved?",
      messagePlaceholder: "e.g. Automate our daily stock report / build an order-management system...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "From small automation scripts to full systems — happy to chat.",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
} as const;

export default function CompanyHome() {
  const { lang } = useLang();
  const t = dict[lang];

  return (
    <main className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#services", label: t.nav.services },
          { href: "#products", label: t.nav.products },
          { href: "#contact", label: t.nav.contact },
          { href: "/blog", label: t.nav.blog },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: t.nav.cta }}
      />

      {/* Hero — 黑底 + logo + 橙 CTA */}
      <section id="top" className="bg-black px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/logo.png"
            alt="ShopOps"
            width={288}
            height={162}
            priority
            className="mx-auto mb-6 sm:mb-8 w-56 sm:w-72 h-auto"
          />
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
            {t.hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact" className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition">
              {t.hero.ctaPrimary}
            </a>
            <a href="#products" className="px-6 py-4 border border-gray-600 text-gray-200 rounded-xl font-semibold text-base hover:bg-gray-800 transition">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* 服務四柱 */}
      <section id="services" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.services.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.services.items.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 自家產品 showcase */}
      <section id="products" className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.products.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t.products.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.products.items.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1">{p.desc}</p>
                <a href={p.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition">
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 點解揀 SHOPOPS */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.why.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.why.items.map((r) => (
              <div key={r.title} className="text-center px-4">
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection copy={t.contact} />
      <SiteFooter text={t.footer} />
    </main>
  );
}
