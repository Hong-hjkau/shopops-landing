"use client";

import CardGrid from "@/components/CardGrid";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";
import HardwareOptions from "@/components/HardwareOptions";
import PosFeatureGrid from "@/components/PosFeatureGrid";
import PosHero from "@/components/PosHero";
import PosWorkflow from "@/components/PosWorkflow";
import PricingCard from "@/components/PricingCard";
import SavingsCalculator from "@/components/SavingsCalculator";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import TrialJourney from "@/components/TrialJourney";
import { useLang } from "@/components/LangProvider";
import { POS_CONTENT } from "@/lib/pos-content";

const dict = {
  en: {
    nav: { workflow: "How it works", features: "Features", savings: "Savings", pricing: "Pricing", contact: "Contact", blog: "Blog", company: "Company", cta: "Book a demo" },
    journey: {
      title: "One clear order journey",
      items: [
        { icon: "ordering", title: "Take the order", desc: "Accept customer QR orders or let staff enter an order at the POS." },
        { icon: "kitchen", title: "Send it to the kitchen", desc: "The kitchen screen gives the kitchen the order to work from." },
        { icon: "orderBoard", title: "Keep the floor informed", desc: "Front-of-house can follow the order's progress." },
        { icon: "checkout", title: "Finish at checkout", desc: "Bring the order through checkout and reporting." },
      ],
    },
    scenarios: { title: "For the ways your restaurant takes orders", body: "Use ShopOps for dine-in, takeaway, delivery and pre-orders, including multi-site setups, with the configuration discussed around your restaurant's own workflow." },
    bilingual: { title: "English and Chinese, where each team needs it", body: "A customer can order in English while floor and kitchen staff view the same order in Chinese, with each person using the language that suits them." },
    optional: { title: "Optional modules can be discussed around your restaurant", body: "The monthly POS plan focuses on ordering, kitchen and checkout. We will confirm what is included in your quote before you begin a trial." },
    pricing: { eyebrow: "Pricing", price: "Contact us", unit: "", cta: "Book a demo & free trial setup", feature: "Monthly POS plan for ordering, kitchen and checkout" },
    faq: {
      title: "FAQ",
      hardwareQ: "Do I need to buy new hardware?",
      trialQ: "What happens during the trial and activation?",
      offlineQ: "What happens if the internet goes down?",
      availabilityQ: "Where is ShopOps available?",
      commissionQ: "What fees apply to direct orders?",
      hardwareA: "No. ShopOps works on iPad, Android tablets, computers and mobile phones. We can also provide separately sold, pre-configured till hardware and receipt printers; we will confirm compatibility for your existing peripherals separately.",
      offlineA: "ShopOps has offline backup for order-taking when the internet goes down. We will confirm the suitable setup and operating limits for your restaurant.",
      availabilityA: "ShopOps POS serves restaurants across the United Kingdom. ShopOps is based in Edinburgh.",
      providerFeesA: "Delivery-platform and other provider fees remain subject to your own contracts.",
    },
    contact: { title: "Book a demo and free trial setup", nameLabel: "Your name / restaurant", namePlaceholder: "e.g. Joy Kitchen", emailLabel: "Email", emailPlaceholder: "you@example.com", messageLabel: "Tell us about your restaurant", messagePlaceholder: "e.g. We are a 10-table cafe and would like to see the POS and QR ordering...", submitIdle: "Send enquiry", submitSending: "Sending...", submitSent: "Got it! We'll be in touch shortly.", submitError: "Send failed. Please email us directly or try again.", submitErrorTooLong: "Message too long (2,000 characters max) — please shorten it.", submitErrorRateLimit: "Too many attempts — please wait a few minutes or email us directly.", orEmail: "Or email directly:", note: "We will discuss your restaurant workflow before setting up the trial." },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  "zh-Hant": {
    nav: { workflow: "運作流程", features: "功能", savings: "慳幾多", pricing: "收費", contact: "聯絡我們", blog: "網誌", company: "公司首頁", cta: "預約示範" },
    journey: {
      title: "由落單到結帳，一條清晰流程",
      items: [
        { icon: "ordering", title: "接收訂單", desc: "客人可用 QR 點餐，或由員工在 POS 輸入訂單。" },
        { icon: "kitchen", title: "送到廚房", desc: "廚房畫面顯示要處理的訂單。" },
        { icon: "orderBoard", title: "樓面跟進", desc: "樓面可查看訂單進度。" },
        { icon: "checkout", title: "結帳完成", desc: "在 POS 完成結帳及查看報表。" },
      ],
    },
    scenarios: { title: "配合餐廳不同的落單方式", body: "ShopOps 可處理堂食、外賣、送貨及預訂，亦支援多分店設定；設定前會先了解你的餐廳流程。" },
    bilingual: { title: "英文與中文，配合不同崗位", body: "客人可以用英文落單，而樓面及廚房員工以中文查看同一張訂單，讓每個人使用合適的語言。" },
    optional: { title: "可按餐廳需要討論其他功能組", body: "月費 POS 計劃聚焦落單、廚房及結帳。開始試用前，我們會清楚確認報價所包含的功能。" },
    pricing: { eyebrow: "收費", price: "請聯絡我們", unit: "", cta: "預約示範及免費試用設定", feature: "月費 POS 計劃：落單、廚房及結帳" },
    faq: {
      title: "常見問題",
      hardwareQ: "是否需要購買新硬件？",
      trialQ: "試用及啟用流程是怎樣？",
      offlineQ: "網絡中斷時會怎樣？",
      availabilityQ: "ShopOps 在哪裡提供服務？",
      commissionQ: "直接訂單有甚麼費用？",
      hardwareA: "不需要。ShopOps 可在 iPad、Android 平板、電腦及手機上使用。我們亦可另外提供預先設定的收銀硬件及收據打印機；現有周邊設備的兼容性會逐項確認。",
      offlineA: "網絡中斷時，ShopOps 有供落單使用的離線後備。我們會按你的餐廳確認合適設定及運作範圍。",
      availabilityA: "ShopOps POS 為全英國餐廳提供服務；ShopOps 公司位於 Edinburgh。",
      providerFeesA: "外賣平台及其他供應商費用仍按你的各自合約計算。",
    },
    contact: { title: "預約示範及免費試用設定", nameLabel: "你的名字 / 餐廳名", namePlaceholder: "例：Joy Kitchen", emailLabel: "Email", emailPlaceholder: "you@example.com", messageLabel: "介紹你的餐廳需要", messagePlaceholder: "例：我們有 10 張枱，想看看 POS 及 QR 點餐如何運作...", submitIdle: "發送查詢", submitSending: "發送中...", submitSent: "已收到！我們會盡快聯絡你。", submitError: "發送失敗，請直接 email 或稍後再試。", submitErrorTooLong: "訊息太長（上限 2,000 字），請縮短後再試。", submitErrorRateLimit: "嘗試次數過多，請等幾分鐘或直接 email 我們。", orEmail: "或直接 email：", note: "設定試用前，我們會先了解你的餐廳流程。" },
    footer: "© 2026 ShopOps · Edinburgh",
  },
  "zh-Hans": {
    nav: { workflow: "运作流程", features: "功能", savings: "省多少", pricing: "收费", contact: "联系我们", blog: "博客", company: "公司首页", cta: "预约演示" },
    journey: {
      title: "从点餐到结账，一条清晰流程",
      items: [
        { icon: "ordering", title: "接收订单", desc: "顾客可用扫码点餐，或由员工在 POS 输入订单。" },
        { icon: "kitchen", title: "送到厨房", desc: "厨房画面显示要处理的订单。" },
        { icon: "orderBoard", title: "前厅跟进", desc: "前厅可查看订单进度。" },
        { icon: "checkout", title: "结账完成", desc: "在 POS 完成结账及查看报表。" },
      ],
    },
    scenarios: { title: "配合餐厅不同的下单方式", body: "ShopOps 可处理堂食、外卖、配送及预订，也支持多门店设置；设置前会先了解你的餐厅流程。" },
    bilingual: { title: "英文与中文，配合不同岗位", body: "顾客可以用英文下单，而前厅及厨房员工以中文查看同一张订单，让每个人使用合适的语言。" },
    optional: { title: "可按餐厅需要讨论其他功能组", body: "月费 POS 计划聚焦点餐、厨房及结账。开始试用前，我们会清楚确认报价所包含的功能。" },
    pricing: { eyebrow: "收费", price: "请联系我们", unit: "", cta: "预约演示及免费试用设置", feature: "月费 POS 计划：点餐、厨房及结账" },
    faq: {
      title: "常见问题",
      hardwareQ: "是否需要购买新硬件？",
      trialQ: "试用及启用流程是怎样？",
      offlineQ: "网络中断时会怎样？",
      availabilityQ: "ShopOps 在哪里提供服务？",
      commissionQ: "直接订单有什么费用？",
      hardwareA: "不需要。ShopOps 可在 iPad、Android 平板、电脑及手机上使用。我们亦可另外提供预先设置的收银硬件及小票打印机；现有外围设备的兼容性会逐项确认。",
      offlineA: "网络中断时，ShopOps 有供下单使用的离线备用。我们会按你的餐厅确认合适设置及运作范围。",
      availabilityA: "ShopOps POS 为全英国餐厅提供服务；ShopOps 公司位于 Edinburgh。",
      providerFeesA: "外卖平台及其他供应商费用仍按你的各自合约计算。",
    },
    contact: { title: "预约演示及免费试用设置", nameLabel: "你的名字 / 餐厅名", namePlaceholder: "例：Joy Kitchen", emailLabel: "Email", emailPlaceholder: "you@example.com", messageLabel: "介绍你的餐厅需要", messagePlaceholder: "例：我们有 10 桌，想看看 POS 及扫码点餐如何运作...", submitIdle: "发送咨询", submitSending: "发送中...", submitSent: "已收到！我们会尽快联系你。", submitError: "发送失败，请直接 email 或稍后再试。", submitErrorTooLong: "信息太长（上限 2,000 字），请缩短后再试。", submitErrorRateLimit: "尝试次数过多，请等几分钟或直接 email 我们。", orEmail: "或直接 email：", note: "设置试用前，我们会先了解你的餐厅流程。" },
    footer: "© 2026 ShopOps · Edinburgh",
  },
} as const;

export default function PosLanding() {
  const { lang } = useLang();
  const t = dict[lang];
  const pos = POS_CONTENT[lang];
  const pricing = {
    eyebrow: t.pricing.eyebrow,
    title: pos.pricing.title,
    subtitle: pos.pricing.body,
    trial: pos.trial.title,
    price: t.pricing.price,
    unit: t.pricing.unit,
    cta: t.pricing.cta,
    note: pos.commission.disclaimer,
    features: [t.pricing.feature],
  };
  const trialAnswer = pos.trial.steps.map((step) => step.detail).join(" ");
  const englishTrialAnswer = POS_CONTENT.en.trial.steps.map((step) => step.detail).join(" ");
  const faqItems = [
    { q: t.faq.hardwareQ, a: `${t.faq.hardwareA} ${pos.hardware.readyHardwareCopy}` },
    { q: t.faq.trialQ, a: trialAnswer },
    { q: t.faq.offlineQ, a: t.faq.offlineA },
    { q: t.faq.availabilityQ, a: t.faq.availabilityA },
    { q: t.faq.commissionQ, a: `${pos.commission.body} ${pos.commission.disclaimer} ${t.faq.providerFeesA}` },
  ];
  const schemaItems = [
    { q: dict.en.faq.hardwareQ, a: `${dict.en.faq.hardwareA} ${POS_CONTENT.en.hardware.readyHardwareCopy}` },
    { q: dict.en.faq.trialQ, a: englishTrialAnswer },
    { q: dict.en.faq.offlineQ, a: dict.en.faq.offlineA },
    { q: dict.en.faq.availabilityQ, a: dict.en.faq.availabilityA },
    { q: dict.en.faq.commissionQ, a: `${POS_CONTENT.en.commission.body} ${POS_CONTENT.en.commission.disclaimer} ${dict.en.faq.providerFeesA}` },
  ];
  const contact = {
    ...t.contact,
    subtitle: `${pos.trial.steps[1].detail} ${pos.trial.steps[2].detail} ${pos.trial.steps[3].detail}`,
    reassure: pos.hero.reassurance,
  };

  return (
    <main className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#workflow", label: t.nav.workflow },
          { href: "#core-features", label: t.nav.features },
          { href: "#savings", label: t.nav.savings },
          { href: "#pricing", label: t.nav.pricing },
          { href: "#contact", label: t.nav.contact },
          { href: "/blog", label: t.nav.blog },
          { href: "/", label: t.nav.company },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: t.nav.cta }}
      />
      <PosHero copy={pos.hero} />
      <PosWorkflow copy={pos.workflow} lang={lang} />
      <section id="order-journey" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.journey.title}</h2>
          <div className="mt-10"><CardGrid items={t.journey.items} cols="2/3" size="sm" /></div>
        </div>
      </section>
      <section id="restaurant-scenarios" className="border-y border-border bg-surface px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.scenarios.title}</h2>
          <p className="mt-5 leading-8 text-text-secondary">{t.scenarios.body}</p>
        </div>
      </section>
      <PosFeatureGrid lang={lang} id="core-features" />
      <section id="bilingual" className="bg-surface px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.bilingual.title}</h2>
          <p className="mt-5 leading-8 text-text-secondary">{t.bilingual.body}</p>
        </div>
      </section>
      <HardwareOptions copy={pos.hardware} />
      <section id="optional-modules" className="border-y border-border bg-surface px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.optional.title}</h2>
          <p className="mt-5 leading-8 text-text-secondary">{t.optional.body}</p>
        </div>
      </section>
      <SavingsCalculator lang={lang} />
      <TrialJourney copy={pos.trial} />
      <PricingCard pricing={pricing} />
      <Faq title={t.faq.title} items={faqItems} schemaItems={schemaItems} />
      <ContactSection copy={contact} source="pos" />
      <SiteFooter text={t.footer} />
    </main>
  );
}
