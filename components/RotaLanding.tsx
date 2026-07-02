"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection, { type ContactCopy } from "@/components/ContactSection";
import Faq, { type FaqItem } from "@/components/Faq";
import PricingCard from "@/components/PricingCard";
import CardGrid from "@/components/CardGrid";

type Pain = { icon: string; title: string; desc: string };
type Feature = { icon: string; title: string; desc: string };

const dict = {
  "zh-Hant": {
    nav: { features: "功能", pricing: "定價", faq: "常見問題", contact: "聯絡", blog: "網誌", company: "公司首頁", cta: "免費試用" },
    hero: {
      title: ["Rota — 排班 + 打卡", "員工一個 Telegram 搞掂"],
      subtitle:
        "唔限餐廳 —— 地盤、零售、倉、辦公室都用得。排更、出席、計工時全部喺一個地方。員工用手機 Telegram 定位打卡，老闆後台排更，月尾自動計好工時匯出畀會計。",
      ctaPrimary: "免費試用",
      ctaSecondary: "睇下點 work",
      reassure: "免費試用 · 唔使信用卡登記",
    },
    pains: {
      title: "排更同打卡，係咪仲用緊 WhatsApp + 紙？",
      items: [
        { icon: "📋", title: "排更亂晒", desc: "WhatsApp group、紙、白板，改一次更要逐個通知，邊個睇漏咗就出事。" },
        { icon: "⏰", title: "唔知邊個準時", desc: "邊個遲到、邊個冇返、邊個早走？冇記錄，月尾鬧交都冇憑據。" },
        { icon: "🧮", title: "月尾計工時好痛苦", desc: "逐個員工逐日加時數，再整 Excel 畀會計，計到頭都大，仲容易計錯。" },
      ] as Pain[],
    },
    features: {
      title: "排更、打卡、計工時，一條龍",
      items: [
        { icon: "📍", title: "Telegram 定位打卡", desc: "員工用自己手機，喺指定位置範圍內先打到卡。唔使買打卡機、唔使 QR 卡，遲到自動記低。" },
        { icon: "🗓️", title: "排更 grid + 員工提交", desc: "老闆後台拖拉排更，重疊同超時自動提醒；員工自己 Telegram 提交可返時段、confirm 或拒更。" },
        { icon: "🔁", title: "員工自助換更", desc: "員工之間 Telegram 申請換更，老闆一撳批准，唔使再 WhatsApp 嗌交。" },
        { icon: "📤", title: "自動計工時 + Excel", desc: "打卡數據自動累積工時，月尾一鍵匯出 Excel 畀會計，唔使再人手加數。" },
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
      note: "如果你用緊 ShopOps POS，可以無縫整合。",
    },
    faq: {
      title: "常見問題",
      items: [
        { q: "員工要裝 app 嗎？", a: "唔使。員工用佢自己部手機嘅 Telegram 就得，打卡、confirm 更、換更全部喺 Telegram。" },
        { q: "點防止代打卡？", a: "打卡要喺你設定嘅地點範圍內（GPS 定位）先打到，唔喺現場打唔到。" },
        { q: "計唔計埋人工？", a: "我哋計工時、匯出 Excel 畀你會計，但唔自動計人工（英國 PAYE/NIC 交畀會計處理最穩陣）。" },
        { q: "淨係餐廳用得？", a: "唔係。排班打卡任何行業都用得 —— 地盤、零售、倉、辦公室都啱。" },
      ] as FaqItem[],
    },
    contact: {
      title: "想試下 Rota 點幫你慳返排更時間？",
      subtitle: "留低資料同你盤生意類型，我哋幫你設好，免費試用。",
      reassure: "免費試用 · 唔使信用卡登記",
      nameLabel: "你嘅名 / 公司名",
      namePlaceholder: "例：陳生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解咩？",
      messagePlaceholder: "例：我哋有 8 個員工，想用嚟排更同打卡...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "適合任何要管員工班表同出席嘅老闆。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  "zh-Hans": {
    nav: { features: "功能", pricing: "定价", faq: "常见问题", contact: "联系", blog: "博客", company: "公司首页", cta: "免费试用" },
    hero: {
      title: ["Rota — 排班 + 打卡", "员工一个 Telegram 搞定"],
      subtitle:
        "不限餐厅 —— 工地、零售、仓库、办公室都用得。排班、考勤、算工时全部在一个地方。员工用手机 Telegram 定位打卡，老板后台排班，月底自动算好工时导出给会计。",
      ctaPrimary: "免费试用",
      ctaSecondary: "看看怎么运作",
      reassure: "免费试用 · 不用信用卡登记",
    },
    pains: {
      title: "排班和打卡，是不是还在用 WhatsApp + 纸？",
      items: [
        { icon: "📋", title: "排班乱成一团", desc: "WhatsApp group、纸、白板，改一次班要逐个通知，谁看漏了就出事。" },
        { icon: "⏰", title: "不知道谁准时", desc: "谁迟到、谁没来、谁早走？没记录，月底吵架都没凭据。" },
        { icon: "🧮", title: "月底算工时很痛苦", desc: "逐个员工逐日加时数，再做 Excel 给会计，算到头都大，还容易算错。" },
      ] as Pain[],
    },
    features: {
      title: "排班、打卡、算工时，一条龙",
      items: [
        { icon: "📍", title: "Telegram 定位打卡", desc: "员工用自己手机，在指定位置范围内才打得到卡。不用买打卡机、不用 QR 卡，迟到自动记录。" },
        { icon: "🗓️", title: "排班 grid + 员工提交", desc: "老板后台拖拉排班，重叠和超时自动提醒；员工自己 Telegram 提交可上班时段、confirm 或拒班。" },
        { icon: "🔁", title: "员工自助换班", desc: "员工之间 Telegram 申请换班，老板一按批准，不用再 WhatsApp 喊来喊去。" },
        { icon: "📤", title: "自动算工时 + Excel", desc: "打卡数据自动累积工时，月底一键导出 Excel 给会计，不用再人手加数。" },
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
      note: "如果你在用 ShopOps POS，可以无缝整合。",
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "员工要装 app 吗？", a: "不用。员工用他自己手机的 Telegram 就行，打卡、confirm 班、换班全部在 Telegram。" },
        { q: "怎么防止代打卡？", a: "打卡要在你设定的地点范围内（GPS 定位）才打得到，不在现场打不了。" },
        { q: "算不算工资？", a: "我们算工时、导出 Excel 给你会计，但不自动算工资（英国 PAYE/NIC 交给会计处理最稳妥）。" },
        { q: "只有餐厅能用？", a: "不是。排班打卡任何行业都用得 —— 工地、零售、仓库、办公室都合适。" },
      ] as FaqItem[],
    },
    contact: {
      title: "想试试 Rota 怎么帮你省下排班时间？",
      subtitle: "留下资料和你这盘生意类型，我们帮你设好，免费试用。",
      reassure: "免费试用 · 不用信用卡登记",
      nameLabel: "你的名字 / 公司名",
      namePlaceholder: "例：陈先生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解什么？",
      messagePlaceholder: "例：我们有 8 个员工，想用来排班和打卡...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      orEmail: "或直接 email：",
      note: "适合任何要管员工班表和考勤的老板。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  en: {
    nav: { features: "Features", pricing: "Pricing", faq: "FAQ", contact: "Contact", blog: "Blog", company: "Company", cta: "Free trial" },
    hero: {
      title: ["Rota — scheduling + clock-in", "your team runs it from Telegram"],
      subtitle:
        "Not just for restaurants — sites, retail, warehouses and offices too. Scheduling, attendance and hours in one place. Staff clock in by location from Telegram, you build the rota in the back office, and hours are tallied and exported for your accountant at month-end.",
      ctaPrimary: "Free trial",
      ctaSecondary: "See how it works",
      reassure: "Free trial · no card needed",
    },
    pains: {
      title: "Still running your rota and clock-in on WhatsApp and paper?",
      items: [
        { icon: "📋", title: "The rota is a mess", desc: "WhatsApp groups, paper, a whiteboard — every change means messaging everyone, and whoever misses it causes a problem." },
        { icon: "⏰", title: "You don't know who's on time", desc: "Who's late, who's a no-show, who left early? With no record, there's nothing to point to at month-end." },
        { icon: "🧮", title: "Tallying hours is painful", desc: "Adding up each person's hours day by day, then building an Excel for the accountant — slow, and easy to get wrong." },
      ] as Pain[],
    },
    features: {
      title: "Scheduling, clock-in and hours — end to end",
      items: [
        { icon: "📍", title: "Telegram location clock-in", desc: "Staff use their own phones and can only clock in within the location you set. No time clock, no QR cards, and lateness is logged automatically." },
        { icon: "🗓️", title: "Rota grid + staff availability", desc: "Build the rota by drag-and-drop with overlap and overtime warnings; staff submit their availability and confirm or decline shifts from Telegram." },
        { icon: "🔁", title: "Staff-led shift swaps", desc: "Staff request swaps between themselves on Telegram; you approve with one tap — no more WhatsApp back-and-forth." },
        { icon: "📤", title: "Auto hours + Excel export", desc: "Clock-in data tallies hours automatically; export an Excel for your accountant at month-end with one click." },
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
      note: "Integrates seamlessly if you use ShopOps POS.",
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Do staff need an app?", a: "No. Staff use Telegram on their own phone — clock-in, confirming shifts and swaps all happen there." },
        { q: "How do you stop buddy-punching?", a: "Clock-in only works within the location you set (GPS) — off-site, it won't register." },
        { q: "Does it calculate pay?", a: "We tally hours and export an Excel for your accountant, but don't auto-calculate pay (PAYE/NIC is safest left to your accountant)." },
        { q: "Is it only for restaurants?", a: "No. Scheduling and attendance suit any business — sites, retail, warehouses and offices included." },
      ] as FaqItem[],
    },
    contact: {
      title: "Want to see how Rota saves you rota time?",
      subtitle: "Leave your details and the kind of business you run — we'll set up a free trial.",
      reassure: "Free trial · no card needed",
      nameLabel: "Your name / company",
      namePlaceholder: "e.g. ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What would you like to know?",
      messagePlaceholder: "e.g. We have 8 staff and want to use it for scheduling and clock-in...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "For any owner who needs to manage staff rotas and attendance.",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
} as const;

export default function RotaLanding() {
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
          <CardGrid items={t.pains.items} cols="3" centered />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.features.title}</h2>
          </div>
          <CardGrid items={t.features.items} cols="2" look="panel" />
        </div>
      </section>

      {/* Pricing（共享 PricingCard） */}
      <PricingCard pricing={t.pricing} />

      {/* FAQ */}
      <Faq title={t.faq.title} items={t.faq.items} schemaItems={dict.en.faq.items} />

      <ContactSection copy={t.contact} source="rota" />
      <SiteFooter text={t.footer} />
    </main>
  );
}
