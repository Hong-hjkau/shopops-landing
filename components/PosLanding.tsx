"use client";

import Image from "next/image";
import {
  SafetyMockup,
  MarginMockup,
  InsightsMockup,
  AllergenMockup,
  TelegramMockup,
  WaitlistMockup,
} from "@/components/mockups";
import SavingsCalculator from "@/components/SavingsCalculator";
import PosFeatureGrid from "@/components/PosFeatureGrid";
import CardGrid from "@/components/CardGrid";
import PricingCard from "@/components/PricingCard";
import Faq from "@/components/Faq";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection from "@/components/ContactSection";
import { useLang } from "@/components/LangProvider";

const MOCKUPS = [SafetyMockup, MarginMockup, InsightsMockup, AllergenMockup, TelegramMockup, WaitlistMockup];

// Hero 大標題 A/B：A = 純痛點、B = 痛點 + 方案。live 比完揀邊個順眼，改呢一行就切換。
const HERO_VARIANT: "A" | "B" = "B";

const dict = {
  "zh-Hant": {
    nav: { features: "功能", savings: "慳幾多", pricing: "定價", blog: "網誌", contact: "聯絡我們", cta: "預約 Demo", company: "公司首頁" },
    hero: {
      titleA: "外賣平台抽走你三成生意，係時候攞返。",
      titleB: "唔使再畀三成佣金\n一套 ShopOps 搞掂全店點餐。",
      subtitle:
        "Deliveroo、Uber Eats 每張單抽 25–35%。ShopOps 一個固定月費、零抽佣 —— QR 自助點餐、員工 POS、後台訂單、斷網照做，一個系統打通客人、樓面、廚房。",
      ctaPrimary: "預約 Demo",
      ctaSecondary: "睇下有咩功能",
      reassure: "免費試用 1 天 (無合約 · 唔使信用卡登記)",
    },
    pains: {
      title: "外賣平台冇講你知嘅三件事",
      items: [
        {
          icon: "🕵️",
          title: "佢偷你嘅客",
          desc: "客人資料一直喺平台手裏，你連邊個幫襯過你都唔知。下次佢轉頭就推你隔籬間。",
        },
        {
          icon: "💸",
          title: "抽你兩三成",
          desc: "每張 £50 單抽走 £15，毛利本來就薄嘅餐廳，幾乎係做白工。",
        },
        {
          icon: "📉",
          title: "踩低你品牌",
          desc: "你喺平台同幾百間鬥價、鬥排名，自己個招牌畀平台蓋過晒。",
        },
      ],
    },
    features: {
      title: "6 大獨家功能，一般 POS 都冇",
      items: [
        {
          icon: "🧾",
          title: "食安日誌（SFBB 電子化）",
          desc: "開店收店清單、雪櫃溫度、每日簽核全部電子化，做完自動留底。食環／EHO 上嚟檢查，一撳匯出成份記錄。市面要另租食安 app 先有呢樣嘢，ShopOps 直接包喺 POS 入面。",
        },
        {
          icon: "📸",
          title: "影張發票，毛利自動計",
          desc: "供應商發票影一影，AI 自動入帳、更新食材價，每碟菜賺幾多即刻見。人哋要另買成本系統再駁 POS 先做到，我哋前後台本身一體。",
        },
        {
          icon: "🌦️",
          title: "天氣 + 客流 + 翻枱報表",
          desc: "唔止日週月營業額 — 天氣對住生意睇、客流高峰、每張枱一晚轉幾多轉，幫你決定入幾多貨、排幾多人。一般 POS 嘅報表去唔到呢一步。",
        },
        {
          icon: "⚠️",
          title: "過敏原自動標示 + 落單警示",
          desc: "英國法定 14 種過敏原逐味菜自動標示；客人申報咗過敏，落單一撞到即刻彈警示擋住，唔使靠員工死記。呢條人命攸關嘅防線，一般 POS 淨係印喺餐牌，去唔到落單嗰一刻。",
        },
        {
          icon: "📲",
          title: "Telegram 提醒 + 排班打卡",
          desc: "員工用自己手機 Telegram 打卡、睇更表、收提醒，唔使逼佢哋裝多隻 app。牌照年檢、預約跟進呢啲死線仲會自動催你，唔會漏。",
        },
        {
          icon: "🎫",
          title: "候位攞籌 + 電視叫號 + 廣告屏",
          desc: "等位即場打張候位飛、取餐電視叫號、淡市時段輪播廣告 — 一部 TV 搞掂晒。訂位平台呢啲功能每個客抽你錢，ShopOps 全部包喺月費。",
        },
      ],
    },
    pricing: {
      eyebrow: "定價",
      title: "一個價，全部包，唔使估",
      subtitle: "每間餐廳規模唔同，留低資料我哋幫你度身報價。",
      price: "請聯絡我們",
      unit: "",
      trial: "首月免費試用",
      features: [
        "QR 點餐 + 員工 POS + 後台 + 離線後備，全部包",
        "進階模組（訂位候位、食安記錄、報表成本等）按需要加",
        "零交易抽佣",
        "無合約，月繳隨時取消",
        "免費 setup + 幫你搬餐單",
      ],
      cta: "預約免費 Demo",
      note: "客人碌卡畀錢時嗰個手續費，係你嘅收款公司收，唔關 ShopOps 事。",
    },
    faq: {
      title: "常見問題",
      items: [
        { q: "要綁約嗎？", a: "唔使。月繳，隨時可以取消，冇罰款。" },
        { q: "由舊系統轉過嚟麻煩嗎？", a: "我哋免費幫你搬餐單同初步設定，你基本上唔使自己搞。" },
        { q: "斷網／WiFi 死咗會點？", a: "本機後備即時頂上，照樣落單、出菜。網絡返嚟自動同步。" },
        {
          q: "係咪淨係落單咁簡單？",
          a: "唔止。訂位候位、廚房看板、叫號屏、報表成本、食安記錄、過敏原標示都有齊，成間舖嘅日常一個後台搞掂。",
        },
        {
          q: "同 Deliveroo、Uber Eats 有咩分別？",
          a: "佢哋抽你每張單兩三成、客係佢哋嘅；ShopOps 一個固定月費、零抽佣，客同數據都係你嘅。",
        },
        {
          q: "你哋收唔收交易佣金？",
          a: "零抽佣，你淨係俾固定月費。至於客人碌卡嗰個手續費，係你嘅收款公司收，唔關我哋事。",
        },
        {
          q: "而家邊度有得用？",
          a: "適合做堂食、外賣同雲廚房嘅小型餐廳。想知你嗰區啱唔啱，直接聯絡我哋傾下。",
        },
      ],
    },
    contact: {
      title: "想睇 demo 或者了解多啲？",
      subtitle: "留低資料我哋會聯絡你，安排免費試用 1 天。",
      reassure: "無合約 · 唔使信用卡登記",
      nameLabel: "你嘅名 / 餐廳名",
      namePlaceholder: "例：陳生 / Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解咩？",
      messagePlaceholder: "例：我哋係 10 枱嘅 cafe，想睇下 POS 同 QR 點餐點 work...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "適合做堂食、外賣同雲廚房嘅小型餐廳。",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  "zh-Hans": {
    nav: { features: "功能", savings: "省多少", pricing: "定价", blog: "博客", contact: "联系我们", cta: "预约 Demo", company: "公司首页" },
    hero: {
      titleA: "外卖平台抽走你三成生意，是时候拿回来。",
      titleB: "不用再付三成佣金\n一套 ShopOps 搞定全店点餐。",
      subtitle:
        "Deliveroo、Uber Eats 每张单抽 25–35%。ShopOps 一个固定月费、零抽佣 —— QR 自助点餐、员工 POS、后台订单、断网照做，一个系统打通顾客、前厅、厨房。",
      ctaPrimary: "预约 Demo",
      ctaSecondary: "看看有什么功能",
      reassure: "免费试用 1 天 (无合约 · 不用信用卡登记)",
    },
    pains: {
      title: "外卖平台没告诉你的三件事",
      items: [
        {
          icon: "🕵️",
          title: "他偷走你的客",
          desc: "顾客资料一直在平台手里，你连谁光顾过你都不知道。下次他转头就推荐你隔壁那家。",
        },
        {
          icon: "💸",
          title: "抽你两三成",
          desc: "每张 £50 的单抽走 £15，毛利本来就薄的餐厅，几乎是白干。",
        },
        {
          icon: "📉",
          title: "压低你品牌",
          desc: "你在平台跟几百家拼价、拼排名，自己的招牌被平台盖过。",
        },
      ],
    },
    features: {
      title: "6 大独家功能，一般 POS 都没有",
      items: [
        {
          icon: "🧾",
          title: "食安日志（SFBB 电子化）",
          desc: "开店收店清单、冰箱温度、每日签核全部电子化，做完自动留底。EHO 上门检查，一键导出全部记录。市面要另租食安 app 才有这功能，ShopOps 直接包在 POS 里。",
        },
        {
          icon: "📸",
          title: "拍张发票，毛利自动算",
          desc: "供应商发票拍一拍，AI 自动入账、更新食材价，每道菜赚多少马上看到。别人要另买成本系统再对接 POS 才做得到，我们前后台本来就是一体。",
        },
        {
          icon: "🌦️",
          title: "天气 + 客流 + 翻台报表",
          desc: "不止日周月营业额 —— 天气对照生意看、客流高峰、每张桌一晚翻几轮，帮你决定进多少货、排多少人。一般 POS 的报表到不了这一步。",
        },
        {
          icon: "⚠️",
          title: "过敏原自动标示 + 下单警示",
          desc: "英国法定 14 种过敏原逐道菜自动标示；顾客申报过敏后，下单一冲突马上弹警示拦住，不靠员工死记。这条人命攸关的防线，一般 POS 只印在菜单上，到不了下单那一刻。",
        },
        {
          icon: "📲",
          title: "Telegram 提醒 + 排班打卡",
          desc: "员工用自己手机 Telegram 打卡、看班表、收提醒，不用逼他们多装一个 app。牌照年检、预约跟进这些死线还会自动催你，不会漏。",
        },
        {
          icon: "🎫",
          title: "候位取号 + 电视叫号 + 广告屏",
          desc: "等位当场打一张候位小票、取餐电视叫号、淡市时段轮播广告 —— 一台 TV 全搞定。订位平台这些功能每个客人都抽你钱，ShopOps 全部包在月费里。",
        },
      ],
    },
    pricing: {
      eyebrow: "定价",
      title: "一个价，全部包，不用猜",
      subtitle: "每间餐厅规模不同，留下资料我们帮你度身报价。",
      price: "请联系我们",
      unit: "",
      trial: "首月免费试用",
      features: [
        "QR 点餐 + 员工 POS + 后台 + 离线备援，全部包",
        "进阶模块（订位候位、食安记录、报表成本等）按需要加",
        "零交易抽佣",
        "无合约，月付随时取消",
        "免费 setup + 帮你搬菜单",
      ],
      cta: "预约免费 Demo",
      note: "顾客刷卡付款时的手续费，是你的收款公司收取，与 ShopOps 无关。",
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "需要签约吗？", a: "不用。月付，随时可以取消，没有罚款。" },
        { q: "从旧系统转过来麻烦吗？", a: "我们免费帮你搬菜单和初步设定，你基本上不用自己弄。" },
        { q: "断网／WiFi 挂了会怎样？", a: "本机备援即时顶上，照样下单、出菜。网络恢复后自动同步。" },
        {
          q: "是不是只有点餐这么简单？",
          a: "不止。订位候位、厨房看板、叫号屏、报表成本、食安记录、过敏原标示都齐全，整间店的日常一个后台搞定。",
        },
        {
          q: "跟 Deliveroo、Uber Eats 有什么分别？",
          a: "他们抽你每张单两三成、客是他们的；ShopOps 一个固定月费、零抽佣，客和数据都是你的。",
        },
        {
          q: "你们收交易佣金吗？",
          a: "零抽佣，你只付固定月费。至于顾客刷卡的那个手续费，是你的收款公司收，跟我们无关。",
        },
        {
          q: "现在哪里能用？",
          a: "适合做堂食、外卖和云厨房的小型餐厅。想知道你那区合不合适，直接联系我们聊聊。",
        },
      ],
    },
    contact: {
      title: "想看 demo 或了解更多？",
      subtitle: "留下资料我们会联系你，安排免费试用 1 天。",
      reassure: "无合约 · 不用信用卡登记",
      nameLabel: "你的名字 / 餐厅名",
      namePlaceholder: "例：陈先生 / Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解什么？",
      messagePlaceholder: "例：我们是 10 桌的 cafe，想看看 POS 和 QR 点餐怎么运作...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      orEmail: "或直接 email：",
      note: "适合做堂食、外卖和云厨房的小型餐厅。",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  en: {
    nav: { features: "Features", savings: "Savings", pricing: "Pricing", blog: "Blog", contact: "Contact", cta: "Book a Demo", company: "Company" },
    hero: {
      titleA: "Delivery apps take a third of your sales. Time to take it back.",
      titleB: "Stop paying a third in commission.\nOne ShopOps runs every order.",
      subtitle:
        "Deliveroo and Uber Eats take 25–35% of every order. ShopOps is one flat monthly fee with zero commission — QR self-ordering, staff POS, back-office orders and an offline backup, connecting your customers, floor and kitchen.",
      ctaPrimary: "Book a Demo",
      ctaSecondary: "See features",
      reassure: "Free 1-day trial (no contract · no card needed)",
    },
    pains: {
      title: "Three things delivery apps don't tell you",
      items: [
        {
          icon: "🕵️",
          title: "They own your customers",
          desc: "Customer data stays with the platform — you never even know who ordered from you. Next time, it nudges them to the place next door.",
        },
        {
          icon: "💸",
          title: "They take 25–35%",
          desc: "£15 gone from every £50 order. For restaurants on thin margins, that's working for free.",
        },
        {
          icon: "📉",
          title: "They bury your brand",
          desc: "You fight hundreds of others on price and ranking, while the platform's name outshines your own.",
        },
      ],
    },
    features: {
      title: "Six features you won't find on a typical POS",
      items: [
        {
          icon: "🧾",
          title: "Food safety diary (digital SFBB)",
          desc: "Opening and closing checklists, fridge temperatures and daily sign-off — all digital, all kept on record. When the EHO visits, export the lot as a PDF in one tap. Elsewhere this means renting a separate food-safety app; ShopOps builds it into the POS.",
        },
        {
          icon: "📸",
          title: "Snap an invoice, margins update",
          desc: "Photograph a supplier invoice and AI logs it, updates your ingredient prices and shows what every dish really earns. Others need a separate costing system wired into the POS — ours is one system front to back.",
        },
        {
          icon: "🌦️",
          title: "Weather, footfall & table-turn reports",
          desc: "More than daily takings — see sales against the weather, footfall peaks and how many times each table turns a night, so you know how much to buy and who to rota on. Typical POS reports stop well short of this.",
        },
        {
          icon: "⚠️",
          title: "Allergen labels + order-time alerts",
          desc: "All 14 UK statutory allergens labelled per dish automatically. Once a diner declares an allergy, any conflicting order triggers an instant alert before it goes through — no relying on staff memory. Most POS systems stop at the printed menu; this guards the moment of ordering.",
        },
        {
          icon: "📲",
          title: "Telegram reminders + staff clock-in",
          desc: "Staff clock in, check rotas and get reminders on Telegram — an app they already have, nothing new to install. Licence renewals and follow-ups chase you automatically, so deadlines never slip.",
        },
        {
          icon: "🎫",
          title: "Waitlist tickets, TV call board & signage",
          desc: "Print a numbered waitlist ticket on the spot, call pickups on a TV screen and loop promos in quiet hours — one telly does it all. Booking platforms charge per diner for this; ShopOps includes it in the monthly fee.",
        },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "One price, everything included, no guessing",
      subtitle: "Every venue is different — leave your details and we'll quote you.",
      price: "Contact us",
      unit: "",
      trial: "First month free",
      features: [
        "QR ordering, staff POS, back-office and offline backup — all included",
        "Add-on modules to suit (reservations, food safety, reports and more)",
        "Zero transaction commission",
        "No contract, monthly, cancel anytime",
        "Free setup and menu migration",
      ],
      cta: "Book a free demo",
      note: "When customers pay by card, that fee comes from your own card-payment provider, not ShopOps.",
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Do I have to sign a contract?", a: "No. It's monthly and you can cancel anytime, with no penalty." },
        {
          q: "Is switching from my old system a hassle?",
          a: "We migrate your menu and do the initial setup for free — you barely have to lift a finger.",
        },
        {
          q: "What happens if the internet or WiFi goes down?",
          a: "A local backup takes over instantly — orders still go in, food still goes out. It syncs back up once you're online again.",
        },
        {
          q: "Is it just for taking orders?",
          a: "Far from it. Reservations and waitlists, a kitchen display, a pickup call board, reports and food costing, food-safety records and allergen labelling are all built in — one back office runs the whole shop.",
        },
        {
          q: "How is this different from Deliveroo or Uber Eats?",
          a: "They take 25–35% of every order and own your customers. ShopOps is one flat monthly fee with zero commission — the customers and the data are yours.",
        },
        {
          q: "Do you charge transaction commission?",
          a: "Zero commission — you only pay the flat monthly fee. The fee on customers' card payments comes from your own card-payment provider, nothing to do with us.",
        },
        {
          q: "Where is it available?",
          a: "Built for small restaurants doing dine-in, takeaway and cloud-kitchen orders. Get in touch and we'll check whether it fits your area.",
        },
      ],
    },
    contact: {
      title: "Want a demo or just have questions?",
      subtitle: "Leave your details and we'll set up your free 1-day trial.",
      reassure: "No contract · No card needed",
      nameLabel: "Your name / restaurant",
      namePlaceholder: "e.g. Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What would you like to know?",
      messagePlaceholder: "e.g. We're a 10-table cafe looking to see how the POS and QR ordering works...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "Built for small restaurants doing dine-in, takeaway and cloud-kitchen orders.",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
} as const;

export default function PosLanding() {
  const { lang } = useLang();
  const t = dict[lang];
  const heroTitle = HERO_VARIANT === "A" ? t.hero.titleA : t.hero.titleB;

  return (
    <main className="flex flex-col">
      {/* Nav */}
      <SiteHeader
        navLinks={[
          { href: "#features", label: t.nav.features },
          { href: "#savings", label: t.nav.savings },
          { href: "#pricing", label: t.nav.pricing },
          { href: "#contact", label: t.nav.contact },
          { href: "/blog", label: t.nav.blog },
          { href: "/", label: t.nav.company },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: t.nav.cta }}
      />

      {/* Hero — 刻意黑底，令發光 logo 同背景融為一體（唔係 dark-mode，下面 section 維持淺色）*/}
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
            {heroTitle.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#features"
              className="px-6 py-4 border border-gray-600 text-gray-200 rounded-xl font-semibold text-base hover:bg-gray-800 transition"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-sm text-gray-400">{t.hero.reassure}</p>
        </div>
      </section>

      {/* Pain points — framing 外賣平台做共同敵人，引出下面功能做解藥 */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.pains.title}</h2>
          </div>
          <CardGrid items={t.pains.items} cols="3" centered />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.features.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.features.items.map((item, idx) => {
              const Mockup = MOCKUPS[idx];
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 hover:shadow-md transition"
                >
                  <div className="mb-5 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
                    <Mockup lang={lang} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 完整功能牆 — 6 大獨家以外嘅已上線模組 */}
      <PosFeatureGrid lang={lang} />

      {/* Savings calculator */}
      <SavingsCalculator lang={lang} />

      {/* Pricing（共享 PricingCard，POS 帶 features 清單） */}
      <PricingCard pricing={t.pricing} />

      {/* FAQ — schema 固定出英文版（本地 SEO 價值最大），畫面顯示跟當前語言 */}
      <Faq title={t.faq.title} items={t.faq.items} schemaItems={dict.en.faq.items} />

      {/* Contact */}
      <ContactSection copy={t.contact} source="pos" />

      {/* Footer */}
      <SiteFooter text={t.footer} />
    </main>
  );
}
