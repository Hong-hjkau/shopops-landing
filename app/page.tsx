"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuMockup, BoardMockup, OfflineMockup, AdminMockup } from "@/components/mockups";
import SavingsCalculator from "@/components/SavingsCalculator";
import Faq from "@/components/Faq";
import type { Lang } from "@/lib/i18n";

type FormStatus = "idle" | "sending" | "sent" | "error";

const MOCKUPS = [MenuMockup, BoardMockup, OfflineMockup, AdminMockup];

// Hero 大標題 A/B：A = 純痛點、B = 痛點 + 方案。live 比完揀邊個順眼，改呢一行就切換。
const HERO_VARIANT: "A" | "B" = "B";

const dict = {
  "zh-Hant": {
    nav: { features: "功能", savings: "慳幾多", pricing: "定價", contact: "聯絡我們", cta: "預約 Demo" },
    hero: {
      titleA: "外賣平台抽走你三成生意，係時候攞返。",
      titleB: "唔使再畀三成佣金，一套 ShopOps 搞掂全店點餐。",
      subtitle:
        "Deliveroo、Uber Eats 每張單抽 25–35%。ShopOps 一個固定月費、零抽佣 —— QR 自助點餐、員工 POS、後台訂單、斷網照做，一個系統打通客人、樓面、廚房。",
      ctaPrimary: "預約 Demo",
      ctaSecondary: "睇下有咩功能",
      reassure: "免費 30 分鐘 demo · 無合約 · 免費幫你搬餐單 · 唔使信用卡",
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
      title: "為餐廳實戰而設嘅 4 大功能",
      items: [
        {
          icon: "🍽️",
          title: "三合一點餐",
          desc: "客人 scan QR 自助落單、員工 POS 一頁搞掂堂食 + 外賣、客人手機自取預訂。三個入口，同一個後台。",
        },
        {
          icon: "📊",
          title: "即時訂單看板",
          desc: "訂單按進度自動分三組顯示 — 等緊做、做緊、做完，廚房一眼睇晒邊張單到咩階段。桌況頁仲可以逐件菜打剔，樓面即時知邊枱出齊。",
        },
        {
          icon: "🔌",
          title: "斷網繼續做生意",
          desc: "就算雲端死咗、WiFi 斷咗，本機後備即時頂上，餐廳照樣落單、廚房照樣出菜。其他人雲端 POS 死晒嗰陣，你照賺。",
        },
        {
          icon: "📝",
          title: "彈性菜單管理",
          desc: "套餐選項組、午晚市時段切換、即時上落架，全部喺後台一鍵搞掂，唔需要等工程師。",
        },
      ],
    },
    pricing: {
      eyebrow: "簡單透明定價",
      title: "一個價，全部包，唔使估",
      subtitle: "對手叫你開戶先報價。我哋直接擺出嚟。",
      price: "£49",
      unit: "／間／月",
      trial: "首月免費試用",
      features: [
        "QR 點餐 + 員工 POS + 後台 + 離線後備，全部包",
        "零交易抽佣",
        "無合約，月繳隨時取消",
        "免費 setup + 幫你搬餐單",
      ],
      cta: "預約免費 Demo",
      note: "卡機過卡費由你自己嘅收單機構收取，與 ShopOps 無關。目前只服務 Edinburgh 區。",
    },
    faq: {
      title: "常見問題",
      items: [
        { q: "要綁約嗎？", a: "唔使。月繳，隨時可以取消，冇罰款。" },
        { q: "由舊系統轉過嚟麻煩嗎？", a: "我哋免費幫你搬餐單同初步設定，你基本上唔使自己搞。" },
        { q: "斷網／WiFi 死咗會點？", a: "本機後備即時頂上，照樣落單、出菜。網絡返嚟自動同步。" },
        {
          q: "同 Deliveroo、Uber Eats 有咩分別？",
          a: "佢哋抽你每張單兩三成、客係佢哋嘅；ShopOps 一個固定月費、零抽佣，客同數據都係你嘅。",
        },
        {
          q: "你哋收唔收交易佣金？",
          a: "零抽佣，你淨係俾固定月費。卡機過卡費係你自己收單機構收，同我哋無關。",
        },
        { q: "而家邊度有得用？", a: "目前只服務 Edinburgh 區嘅小型餐廳（堂食、外賣、雲廚房）。" },
      ],
    },
    contact: {
      title: "想睇 demo 或者了解多啲？",
      subtitle: "留低資料我哋會聯絡你，安排一次免費 30 分鐘 demo。",
      reassure: "無合約 · 免費幫你搬餐單 · 唔使信用卡",
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
      note: "目前只服務 Edinburgh 區小型餐廳（堂食、外賣、雲廚房）。",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  "zh-Hans": {
    nav: { features: "功能", savings: "省多少", pricing: "定价", contact: "联系我们", cta: "预约 Demo" },
    hero: {
      titleA: "外卖平台抽走你三成生意，是时候拿回来。",
      titleB: "不用再付三成佣金，一套 ShopOps 搞定全店点餐。",
      subtitle:
        "Deliveroo、Uber Eats 每张单抽 25–35%。ShopOps 一个固定月费、零抽佣 —— QR 自助点餐、员工 POS、后台订单、断网照做，一个系统打通顾客、前厅、厨房。",
      ctaPrimary: "预约 Demo",
      ctaSecondary: "看看有什么功能",
      reassure: "免费 30 分钟 demo · 无合约 · 免费帮你搬菜单 · 不用信用卡",
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
      title: "为餐厅实战而设的 4 大功能",
      items: [
        {
          icon: "🍽️",
          title: "三合一点餐",
          desc: "顾客扫 QR 自助下单、员工 POS 一页搞定堂食 + 外卖、顾客手机自取预订。三个入口，同一个后台。",
        },
        {
          icon: "📊",
          title: "实时订单看板",
          desc: "订单按进度自动分三组显示 —— 待处理、制作中、已完成，厨房一眼看清每张单到哪个阶段。桌位页还能逐道菜划单，前厅即时知道哪桌出齐。",
        },
        {
          icon: "🔌",
          title: "断网继续做生意",
          desc: "就算云端宕机、WiFi 断了，本机备援即时顶上，餐厅照样下单、厨房照样出菜。别人云端 POS 全挂的时候，你照样赚。",
        },
        {
          icon: "📝",
          title: "弹性菜单管理",
          desc: "套餐选项组、午晚市时段切换、即时上下架，全部在后台一键搞定，不用等工程师。",
        },
      ],
    },
    pricing: {
      eyebrow: "简单透明定价",
      title: "一个价，全部包，不用猜",
      subtitle: "对手让你先开户才报价。我们直接摆出来。",
      price: "£49",
      unit: "／间／月",
      trial: "首月免费试用",
      features: [
        "QR 点餐 + 员工 POS + 后台 + 离线备援，全部包",
        "零交易抽佣",
        "无合约，月付随时取消",
        "免费 setup + 帮你搬菜单",
      ],
      cta: "预约免费 Demo",
      note: "刷卡手续费由你自己的收单机构收取，与 ShopOps 无关。目前只服务 Edinburgh 区。",
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "需要签约吗？", a: "不用。月付，随时可以取消，没有罚款。" },
        { q: "从旧系统转过来麻烦吗？", a: "我们免费帮你搬菜单和初步设定，你基本上不用自己弄。" },
        { q: "断网／WiFi 挂了会怎样？", a: "本机备援即时顶上，照样下单、出菜。网络恢复后自动同步。" },
        {
          q: "跟 Deliveroo、Uber Eats 有什么分别？",
          a: "他们抽你每张单两三成、客是他们的；ShopOps 一个固定月费、零抽佣，客和数据都是你的。",
        },
        {
          q: "你们收交易佣金吗？",
          a: "零抽佣，你只付固定月费。刷卡手续费是你自己的收单机构收，跟我们无关。",
        },
        { q: "现在哪里能用？", a: "目前只服务 Edinburgh 区的小型餐厅（堂食、外卖、云厨房）。" },
      ],
    },
    contact: {
      title: "想看 demo 或了解更多？",
      subtitle: "留下资料我们会联系你，安排一次免费 30 分钟 demo。",
      reassure: "无合约 · 免费帮你搬菜单 · 不用信用卡",
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
      note: "目前只服务 Edinburgh 区小型餐厅（堂食、外卖、云厨房）。",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  en: {
    nav: { features: "Features", savings: "Savings", pricing: "Pricing", contact: "Contact", cta: "Book a Demo" },
    hero: {
      titleA: "Delivery apps take a third of your sales. Time to take it back.",
      titleB: "Stop paying a third in commission. One ShopOps runs every order.",
      subtitle:
        "Deliveroo and Uber Eats take 25–35% of every order. ShopOps is one flat monthly fee with zero commission — QR self-ordering, staff POS, back-office orders and an offline backup, connecting your customers, floor and kitchen.",
      ctaPrimary: "Book a Demo",
      ctaSecondary: "See features",
      reassure: "Free 30-min demo · No contract · Free menu migration · No credit card",
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
      title: "Four features built for real restaurant use",
      items: [
        {
          icon: "🍽️",
          title: "Three ways to order",
          desc: "Diners scan a QR to self-order, staff use one POS for dine-in + takeaway, customers pre-order on their phone. Three entry points, one dashboard.",
        },
        {
          icon: "📊",
          title: "Live order board",
          desc: "Orders flow through three stages — Pending, In Progress, Done — so the kitchen always sees what's next. The table view lets floor staff tick off each dish as it leaves the kitchen.",
        },
        {
          icon: "🔌",
          title: "Keep trading offline",
          desc: "When the cloud or WiFi goes down, a local backup keeps the restaurant running — orders in, food out. While competitors' cloud-only POS stops, you keep ringing sales.",
        },
        {
          icon: "📝",
          title: "Flexible menu control",
          desc: "Set-meal option groups, lunch/dinner sessions, instant item availability — all from the admin panel. No engineer required.",
        },
      ],
    },
    pricing: {
      eyebrow: "Simple, transparent pricing",
      title: "One price, everything included, no guessing",
      subtitle: "Competitors hide the price until you sign up. Here's ours, up front.",
      price: "£49",
      unit: "/venue/month",
      trial: "First month free",
      features: [
        "QR ordering, staff POS, back-office and offline backup — all included",
        "Zero transaction commission",
        "No contract, monthly, cancel anytime",
        "Free setup and menu migration",
      ],
      cta: "Book a free demo",
      note: "Card-processing fees are charged by your own acquirer, separate from ShopOps. Currently serving the Edinburgh area only.",
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
          q: "How is this different from Deliveroo or Uber Eats?",
          a: "They take 25–35% of every order and own your customers. ShopOps is one flat monthly fee with zero commission — the customers and the data are yours.",
        },
        {
          q: "Do you charge transaction commission?",
          a: "Zero commission — you only pay the flat monthly fee. Card-processing fees are charged by your own acquirer, nothing to do with us.",
        },
        {
          q: "Where is it available?",
          a: "Currently for small restaurants in the Edinburgh area (dine-in, takeaway, cloud kitchens).",
        },
      ],
    },
    contact: {
      title: "Want a demo or just have questions?",
      subtitle: "Leave your details and we'll arrange a free 30-minute demo.",
      reassure: "No contract · Free menu migration · No credit card",
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
      note: "Currently serving small Edinburgh restaurants (dine-in, takeaway, cloud kitchens).",
    },
    footer: "© 2026 ShopOps · Edinburgh",
  },
} as const;

// 聯絡 email；可由 NEXT_PUBLIC_CONTACT_EMAIL 覆寫，未設就用真實預設地址
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@shopops.co.uk";

export default function Home() {
  const [lang, setLang] = useState<Lang>("zh-Hant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const t = dict[lang];
  const heroTitle = HERO_VARIANT === "A" ? t.hero.titleA : t.hero.titleB;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
      setStatus("error");
    }
  }

  // 用戶喺送出失敗 / 成功後再改任何欄位，清走舊狀態 banner（紅色錯誤 / 綠色成功）
  function handleFieldChange(setter: (v: string) => void, value: string) {
    setter(value);
    if (status === "error" || status === "sent") setStatus("idle");
  }

  return (
    <main className="flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt=""
              width={512}
              height={496}
              className="h-8 w-auto"
            />
            <span className="font-bold text-gray-900 text-lg tracking-tight">ShopOps</span>
          </a>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition">
              {t.nav.features}
            </a>
            <a href="#savings" className="hover:text-gray-900 transition">
              {t.nav.savings}
            </a>
            <a href="#pricing" className="hover:text-gray-900 transition">
              {t.nav.pricing}
            </a>
            <a href="#contact" className="hover:text-gray-900 transition">
              {t.nav.contact}
            </a>
            <a href="/blog" className="hover:text-gray-900 transition">
              Blog
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-medium">
              <button
                onClick={() => setLang("zh-Hant")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "zh-Hant" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === "zh-Hant"}
              >
                繁
              </button>
              <button
                onClick={() => setLang("zh-Hans")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "zh-Hans" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === "zh-Hans"}
              >
                简
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full transition ${
                  lang === "en" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === "en"}
              >
                EN
              </button>
            </div>
            <a
              href="#contact"
              className="hidden sm:inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      </header>

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
            {heroTitle}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.pains.items.map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

      {/* Savings calculator */}
      <SavingsCalculator lang={lang} />

      {/* Pricing — 公開透明定價，反對手黑箱做差異化 */}
      <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4">
              {t.pricing.eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.pricing.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t.pricing.subtitle}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="text-center">
              <span className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide">
                {t.pricing.trial}
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold text-gray-900">{t.pricing.price}</span>
                <span className="text-lg font-semibold text-gray-400">{t.pricing.unit}</span>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {t.pricing.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-gray-700">
                  <span className="shrink-0 mt-0.5 text-green-600 font-bold" aria-hidden>
                    ✓
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <a
                href="#contact"
                className="inline-flex w-full justify-center px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition"
              >
                {t.pricing.cta}
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">{t.pricing.note}</p>
          </div>
        </div>
      </section>

      {/* FAQ — schema 固定出英文版（本地 SEO 價值最大），畫面顯示跟當前語言 */}
      <Faq title={t.faq.title} items={t.faq.items} schemaItems={dict.en.faq.items} />

      {/* Contact */}
      <section id="contact" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.contact.title}</h2>
            <p className="mt-4 text-gray-600">{t.contact.subtitle}</p>
            <p className="mt-2 text-sm font-medium text-orange-600">{t.contact.reassure}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleFieldChange(setName, e.target.value)}
                placeholder={t.contact.namePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.emailLabel}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleFieldChange(setEmail, e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {t.contact.messageLabel}
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => handleFieldChange(setMessage, e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition disabled:opacity-60"
            >
              {status === "sending" ? t.contact.submitSending : t.contact.submitIdle}
            </button>

            {status === "sent" && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                {t.contact.submitSent}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                {t.contact.submitError}
              </p>
            )}

            <p className="text-xs text-gray-500 text-center pt-2">
              {t.contact.orEmail}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  lang === "en"
                    ? "ShopOps Demo Enquiry"
                    : lang === "zh-Hans"
                      ? "ShopOps Demo 咨询"
                      : "ShopOps Demo 查詢"
                )}`}
                className="font-semibold text-gray-700 hover:text-gray-900 underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>

          <p className="mt-8 text-sm text-gray-500 text-center">{t.contact.note}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
        {t.footer}
      </footer>
    </main>
  );
}
