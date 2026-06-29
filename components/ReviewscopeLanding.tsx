"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection, { type ContactCopy } from "@/components/ContactSection";
import Faq, { type FaqItem } from "@/components/Faq";

type Pain = { icon: string; title: string; desc: string };
type Feature = { icon: string; title: string; desc: string };

const dict = {
  "zh-Hant": {
    nav: { features: "功能", pricing: "定價", faq: "常見問題", contact: "聯絡", blog: "網誌", company: "公司首頁", cta: "免費試用" },
    hero: {
      title: ["Reviewscope", "客人講你壞話，第一時間知"],
      subtitle:
        "餐廳老闆冇時間逐個平台 check 評價。Reviewscope 幫你跨平台監察 Google、TripAdvisor 等評分，AI 即時分析情緒同主題，一有差評即刻 Telegram 通知你 —— 唔使等客走晒先發現。",
      ctaPrimary: "免費試用",
      ctaSecondary: "睇下點 work",
      reassure: "免費試用 · 唔使信用卡登記",
    },
    pains: {
      title: "評價呢樣嘢，唔睇唔得，逐個平台睇又攰",
      items: [
        { icon: "🕐", title: "冇時間逐個睇", desc: "Google、TripAdvisor、外賣平台各有各評價，日日逐個 click 入去睇，根本冇時間。" },
        { icon: "😡", title: "差評遲知就遲", desc: "一個差評擺喺度幾日先發現，個客已經走咗、其他人都睇到，補救都嚟唔切。" },
        { icon: "🤷", title: "唔知客實際嫌咩", desc: "分數跌咗，但係食物、服務、定環境出事？逐條評價自己 grep 太慢。" },
      ] as Pain[],
    },
    features: {
      title: "幫你睇住聲譽，唔使自己日日 hea check",
      items: [
        { icon: "📊", title: "跨平台一處睇", desc: "各大平台嘅評分同最新評價，集中喺一個版面，唔使逐個 app 開。" },
        { icon: "🤖", title: "AI 分析每條評價", desc: "自動標情緒（好評/中性/差評）+ 主題（食物/服務/環境/價錢/等位）+ 中文摘要，一眼睇晒客嫌咩。" },
        { icon: "🔔", title: "差評即時通知", desc: "一有低分評價，即刻 Telegram 推畀你 —— 第一時間回覆、補救，唔使等客流失。" },
        { icon: "📈", title: "趨勢同對比", desc: "過去 90 日評分趨勢圖，仲有「平台整體分 vs 你最近實際分」對比，睇住自己有冇進步。" },
      ] as Feature[],
    },
    pricing: {
      eyebrow: "簡單定價",
      title: "一個價，全部包",
      subtitle: "先免費試用，全包、無合約、隨時取消。留低資料我哋同你傾報價。",
      trial: "免費試用",
      price: "請聯絡我們",
      unit: "",
      cta: "免費試用",
      note: "適合英國細餐廳，全包。",
    },
    faq: {
      title: "常見問題",
      items: [
        { q: "而家監察邊啲平台？", a: "Google 評價先行，TripAdvisor、外賣平台等陸續加。想監察邊個平台，可以同我哋講。" },
        { q: "差評通知點收？", a: "經 Telegram 即時推送到你嘅手機，低過設定分數就即刻提你。" },
        { q: "要自己裝嘢嗎？", a: "唔使。我哋幫你接好你間舖嘅評價，你淨係睇 dashboard + 收通知。" },
        { q: "同 ShopOps POS 有咩關係？", a: "可以獨立用。如果你用緊 ShopOps，將來可以喺同一個地方睇埋評價。" },
      ] as FaqItem[],
    },
    contact: {
      title: "想睇你間舖嘅評價長成點？",
      subtitle: "留低資料同你間舖名，我哋幫你接好，免費試用。",
      reassure: "免費試用 · 唔使信用卡登記",
      nameLabel: "你嘅名 / 餐廳名",
      namePlaceholder: "例：陳生 / Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解咩？",
      messagePlaceholder: "例：想監察我哋 Google 同 TripAdvisor 嘅評價...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "適合想睇住網上聲譽嘅餐廳老闆。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  "zh-Hans": {
    nav: { features: "功能", pricing: "定价", faq: "常见问题", contact: "联系", blog: "博客", company: "公司首页", cta: "免费试用" },
    hero: {
      title: ["Reviewscope", "顾客说你坏话，第一时间知道"],
      subtitle:
        "餐厅老板没时间逐个平台 check 评价。Reviewscope 帮你跨平台监察 Google、TripAdvisor 等评分，AI 即时分析情绪和主题，一有差评立刻 Telegram 通知你 —— 不用等客人走光才发现。",
      ctaPrimary: "免费试用",
      ctaSecondary: "看看怎么运作",
      reassure: "免费试用 · 不用信用卡登记",
    },
    pains: {
      title: "评价这东西，不看不行，逐个平台看又累",
      items: [
        { icon: "🕐", title: "没时间逐个看", desc: "Google、TripAdvisor、外卖平台各有各评价，天天逐个 click 进去看，根本没时间。" },
        { icon: "😡", title: "差评晚知就晚", desc: "一个差评摆着几天才发现，那位客人已经走了、其他人也看到了，补救都来不及。" },
        { icon: "🤷", title: "不知道客人嫌什么", desc: "分数掉了，但是食物、服务、还是环境出事？逐条评价自己 grep 太慢。" },
      ] as Pain[],
    },
    features: {
      title: "帮你盯着声誉，不用自己天天逐个查",
      items: [
        { icon: "📊", title: "跨平台一处看", desc: "各大平台的评分和最新评价，集中在一个面板，不用逐个 app 开。" },
        { icon: "🤖", title: "AI 分析每条评价", desc: "自动标情绪（好评/中性/差评）+ 主题（食物/服务/环境/价格/等位）+ 中文摘要，一眼看清客人嫌什么。" },
        { icon: "🔔", title: "差评即时通知", desc: "一有低分评价，立刻 Telegram 推给你 —— 第一时间回复、补救，不用等客人流失。" },
        { icon: "📈", title: "趋势和对比", desc: "过去 90 天评分趋势图，还有「平台整体分 vs 你最近实际分」对比，看着自己有没有进步。" },
      ] as Feature[],
    },
    pricing: {
      eyebrow: "简单定价",
      title: "一个价，全部包",
      subtitle: "先免费试用，全包、无合约、随时取消。留下资料我们和你谈报价。",
      trial: "免费试用",
      price: "请联系我们",
      unit: "",
      cta: "免费试用",
      note: "适合英国小型餐厅，全包。",
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "现在监察哪些平台？", a: "Google 评价先行，TripAdvisor、外卖平台等陆续加。想监察哪个平台，可以跟我们说。" },
        { q: "差评通知怎么收？", a: "经 Telegram 即时推送到你的手机，低于设定分数就立刻提醒你。" },
        { q: "要自己装东西吗？", a: "不用。我们帮你接好你店的评价，你只看 dashboard + 收通知。" },
        { q: "和 ShopOps POS 有什么关系？", a: "可以独立用。如果你在用 ShopOps，将来可以在同一个地方看评价。" },
      ] as FaqItem[],
    },
    contact: {
      title: "想看你店的评价长什么样？",
      subtitle: "留下资料和你的店名，我们帮你接好，免费试用。",
      reassure: "免费试用 · 不用信用卡登记",
      nameLabel: "你的名字 / 餐厅名",
      namePlaceholder: "例：陈先生 / Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解什么？",
      messagePlaceholder: "例：想监察我们 Google 和 TripAdvisor 的评价...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      orEmail: "或直接 email：",
      note: "适合想盯着网上声誉的餐厅老板。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  en: {
    nav: { features: "Features", pricing: "Pricing", faq: "FAQ", contact: "Contact", blog: "Blog", company: "Company", cta: "Free trial" },
    hero: {
      title: ["Reviewscope", "Know the moment a customer leaves a bad review"],
      subtitle:
        "Restaurant owners don't have time to check every platform. Reviewscope monitors your ratings across Google, TripAdvisor and more, uses AI to analyse sentiment and topics, and pings you on Telegram the moment a bad review lands — so you can act before customers drift away.",
      ctaPrimary: "Free trial",
      ctaSecondary: "See how it works",
      reassure: "Free trial · no card needed",
    },
    pains: {
      title: "You can't ignore reviews — but checking every platform is a chore",
      items: [
        { icon: "🕐", title: "No time to check them all", desc: "Google, TripAdvisor, delivery apps — each has its own reviews. Clicking into all of them every day just isn't realistic." },
        { icon: "😡", title: "A late catch is a missed catch", desc: "A bad review sits for days before you notice — the customer's gone, everyone else has seen it, and it's too late to make it right." },
        { icon: "🤷", title: "You don't know what they disliked", desc: "Your score dropped — but was it the food, the service or the room? Reading every review yourself is slow." },
      ] as Pain[],
    },
    features: {
      title: "We watch your reputation so you don't have to refresh tabs all day",
      items: [
        { icon: "📊", title: "Every platform in one place", desc: "Ratings and the latest reviews from each platform, gathered into one dashboard — no app-hopping." },
        { icon: "🤖", title: "AI reads every review", desc: "Automatic sentiment (positive/neutral/negative) + topic (food/service/room/price/wait) + a short summary, so you see what customers care about at a glance." },
        { icon: "🔔", title: "Instant bad-review alerts", desc: "When a low rating lands, you get a Telegram ping straight away — reply and recover before the customer is lost." },
        { icon: "📈", title: "Trends and benchmarks", desc: "A 90-day rating trend, plus your recent average vs the platform's overall score, so you can see whether you're improving." },
      ] as Feature[],
    },
    pricing: {
      eyebrow: "Simple pricing",
      title: "One price, everything included",
      subtitle: "Start with a free trial — all in, no contract, cancel anytime. Leave your details and we'll quote you.",
      trial: "Free trial",
      price: "Contact us",
      unit: "",
      cta: "Start free trial",
      note: "Built for small UK restaurants, all in.",
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Which platforms do you monitor?", a: "Google reviews to start, with TripAdvisor, delivery apps and more being added. Tell us which platforms matter to you." },
        { q: "How do I get bad-review alerts?", a: "Instant Telegram push to your phone whenever a review drops below your set rating." },
        { q: "Do I need to install anything?", a: "No. We connect your venue's reviews for you — you just watch the dashboard and get the alerts." },
        { q: "How does it relate to ShopOps POS?", a: "It works on its own. If you use ShopOps, you'll be able to see your reviews in the same place down the line." },
      ] as FaqItem[],
    },
    contact: {
      title: "Want to see your restaurant's reviews?",
      subtitle: "Leave your details and venue name — we'll set it up for a free trial.",
      reassure: "Free trial · no card needed",
      nameLabel: "Your name / restaurant",
      namePlaceholder: "e.g. Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What would you like to know?",
      messagePlaceholder: "e.g. We'd like to monitor our Google and TripAdvisor reviews...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "For restaurant owners who want to keep an eye on their online reputation.",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
} as const;

export default function ReviewscopeLanding() {
  const { lang } = useLang();
  const t = dict[lang];

  return (
    <main className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#features", label: t.nav.features },
          { href: "#pricing", label: t.nav.pricing },
          { href: "#faq", label: t.nav.faq },
          { href: "#contact", label: t.nav.contact },
          { href: "/blog", label: t.nav.blog },
          { href: "/", label: t.nav.company },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: t.nav.cta }}
      />

      {/* Hero */}
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
            <a href="#features" className="px-6 py-4 border border-gray-600 text-gray-200 rounded-xl font-semibold text-base hover:bg-gray-800 transition">
              {t.hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-sm text-gray-400">{t.hero.reassure}</p>
        </div>
      </section>

      {/* Pains */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.pains.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.pains.items.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.features.items.map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4">{t.pricing.eyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.pricing.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t.pricing.subtitle}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
            <span className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide">
              {t.pricing.trial}
            </span>
            <div className="flex items-baseline justify-center gap-1 mb-8">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">{t.pricing.price}</span>
              {t.pricing.unit && (
                <span className="text-lg font-semibold text-gray-400">{t.pricing.unit}</span>
              )}
            </div>
            <a href="#contact" className="inline-flex w-full justify-center px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition">
              {t.pricing.cta}
            </a>
            <p className="mt-6 text-xs text-gray-400 leading-relaxed">{t.pricing.note}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Faq title={t.faq.title} items={t.faq.items} schemaItems={dict.en.faq.items} />

      <ContactSection copy={t.contact} source="reviewscope" />
      <SiteFooter text={t.footer} />
    </main>
  );
}
