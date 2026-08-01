"use client";

import { useLang } from "@/components/LangProvider";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection, { type ContactCopy } from "@/components/ContactSection";
import CardGrid from "@/components/CardGrid";
import Faq from "@/components/Faq";
import PosHero from "@/components/PosHero";
import PosWorkflow from "@/components/PosWorkflow";
import PosBenefits from "@/components/PosBenefits";
import HardwareOptions from "@/components/HardwareOptions";
import TrialJourney from "@/components/TrialJourney";
import { POS_CONTENT } from "@/lib/pos-content";
import type { IconName } from "@/components/icons";

type Feature = { icon: IconName; title: string; desc: string };

const dict = {
  "zh-Hant": {
    nav: {
      pos: "POS",
      features: "功能",
      demo: "示範",
      rota: "Rota",
      customSoftware: "度身軟件",
      blog: "網誌",
    },
    features: {
      title: "餐廳每日要做的事，一套系統處理",
      subtitle: "先處理落單、廚房和結帳；進階功能可在示範時按你的餐廳流程了解。",
      items: [
        { icon: "ordering", title: "QR 及員工落單", desc: "客人自行掃 QR 點餐，或由員工在 POS 落堂食和外賣單。" },
        { icon: "kitchen", title: "廚房即時看板", desc: "訂單送到廚房畫面，讓團隊按進度處理。" },
        { icon: "reservation", title: "堂食、外賣及預訂", desc: "在同一個系統管理不同類型的餐廳訂單。" },
        { icon: "checkout", title: "結帳及埋數", desc: "處理結帳、折扣、退款及每日對數。" },
        { icon: "offline", title: "離線後備", desc: "網絡中斷時，為正在進行的落單提供後備。" },
        { icon: "menuControl", title: "餐牌及售罄管理", desc: "更新餐牌內容，並按需要暫停售罄菜式。" },
      ] as Feature[],
    },
    bilingual: {
      title: "同一張單，前台英文、廚房中文",
      body: "客人可用英文點餐，而廚房同事在同一張訂單上查看中文內容。每個人按自己慣用的語言工作。",
    },
    secondCta: {
      title: "看看 ShopOps 如何配合你的餐廳",
      body: "預約示範後，我們會先了解你的流程，再協助輸入餐牌和完成試用設定。",
    },
    secondary: {
      title: "其他 ShopOps 產品及服務",
      body: "POS 是目前的重點；如你有其他營運需要，也可以了解以下選項。",
      rota: { title: "Rota", body: "員工排班及打卡出席工具，幫你管理班表和工時。", cta: "了解 Rota" },
      custom: { title: "度身訂造軟件", body: "按你的流程建立內部工具、管理系統或自動化。", cta: "傾下你的需要" },
    },
    faq: {
      title: "常見問題",
      questions: {
        trial: "免費試用需要信用卡嗎？",
        afterTrial: "試用後會怎樣？",
        hardware: "需要購買新硬件嗎？",
        area: "ShopOps POS 適合甚麼類型的餐飲生意？",
        menu: "餐牌需要自己輸入嗎？",
      },
      areaAnswer: "適合市集攤位、咖啡店、小餐館及外賣店等獨立餐飲生意。我們可以在示範時了解你的營運方式。",
    },
    contact: {
      title: "預約示範及免費試用設定",
      subtitle: "告訴我們你的餐廳情況。我們會安排示範，了解流程，並在試用前協助輸入餐牌及設定。",
      nameLabel: "你嘅名 / 餐廳名",
      namePlaceholder: "例：陳生 / ABC Restaurant",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解甚麼？",
      messagePlaceholder: "例：10 枱餐廳，想了解 QR 點餐和廚房看板...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      submitErrorTooLong: "訊息太長（上限 2000 字），請縮短啲再試",
      submitErrorRateLimit: "試多咗幾次，請等幾分鐘再試，或直接 email 我哋",
      orEmail: "或直接 email：",
      note: "示範和試用設定前，我們會先確認你的餐廳流程和設備需要。",
    } satisfies Omit<ContactCopy, "reassure">,
    footer: "© 2026 ShopOps",
  },
  "zh-Hans": {
    nav: {
      pos: "POS",
      features: "功能",
      demo: "演示",
      rota: "Rota",
      customSoftware: "定制软件",
      blog: "博客",
    },
    features: {
      title: "餐厅每天要做的事，一套系统处理",
      subtitle: "先处理点餐、厨房和结账；进阶功能可在演示时按你的餐厅流程了解。",
      items: [
        { icon: "ordering", title: "扫码及员工点餐", desc: "顾客自行扫码点餐，或由员工在 POS 录入堂食和外卖订单。" },
        { icon: "kitchen", title: "厨房实时看板", desc: "订单送到厨房画面，让团队按进度处理。" },
        { icon: "reservation", title: "堂食、外卖及预订", desc: "在同一个系统管理不同类型的餐厅订单。" },
        { icon: "checkout", title: "结账及对数", desc: "处理结账、折扣、退款及每日对数。" },
        { icon: "offline", title: "离线备用", desc: "网络中断时，为正在进行的点餐提供备用。" },
        { icon: "menuControl", title: "菜单及售罄管理", desc: "更新菜单内容，并按需要暂停售罄菜品。" },
      ] as Feature[],
    },
    bilingual: {
      title: "同一张单，前厅英文、厨房中文",
      body: "顾客可用英文点餐，而厨房同事在同一张订单上查看中文内容。每个人按自己惯用的语言工作。",
    },
    secondCta: {
      title: "看看 ShopOps 如何配合你的餐厅",
      body: "预约演示后，我们会先了解你的流程，再协助录入菜单和完成试用设置。",
    },
    secondary: {
      title: "其他 ShopOps 产品及服务",
      body: "POS 是目前的重点；如你有其他营运需要，也可以了解以下选项。",
      rota: { title: "Rota", body: "员工排班及打卡考勤工具，帮你管理班表和工时。", cta: "了解 Rota" },
      custom: { title: "定制软件", body: "按你的流程建立内部工具、管理系统或自动化。", cta: "聊聊你的需要" },
    },
    faq: {
      title: "常见问题",
      questions: {
        trial: "免费试用需要信用卡吗？",
        afterTrial: "试用后会怎样？",
        hardware: "需要购买新硬件吗？",
        area: "ShopOps POS 适合什么类型的餐饮生意？",
        menu: "菜单需要自己录入吗？",
      },
      areaAnswer: "适合市集摊位、咖啡店、小餐馆及外卖店等独立餐饮生意。我们可以在演示时了解你的营运方式。",
    },
    contact: {
      title: "预约演示及免费试用设置",
      subtitle: "告诉我们你的餐厅情况。我们会安排演示，了解流程，并在试用前协助录入菜单及设置。",
      nameLabel: "你的名字 / 餐厅名",
      namePlaceholder: "例：陈先生 / ABC Restaurant",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "想了解什么？",
      messagePlaceholder: "例：10 桌餐厅，想了解扫码点餐和厨房看板...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      submitErrorTooLong: "信息太长（上限 2000 字），请缩短后再试",
      submitErrorRateLimit: "尝试次数过多，请几分钟后再试，或直接 email 我们",
      orEmail: "或直接 email：",
      note: "演示和试用设置前，我们会先确认你的餐厅流程和设备需要。",
    } satisfies Omit<ContactCopy, "reassure">,
    footer: "© 2026 ShopOps",
  },
  en: {
    nav: {
      pos: "POS",
      features: "Features",
      demo: "Demo",
      rota: "Rota",
      customSoftware: "Custom Software",
      blog: "Blog",
    },
    features: {
      title: "The restaurant essentials, in one system",
      subtitle: "Start with orders, kitchen and checkout. Explore advanced capabilities around your restaurant workflow in a demo.",
      items: [
        { icon: "ordering", title: "QR and staff ordering", desc: "Customers self-order by QR, or staff take dine-in and takeaway orders through the POS." },
        { icon: "kitchen", title: "Live kitchen display", desc: "Orders reach the kitchen screen so the team can work through them by progress." },
        { icon: "reservation", title: "Dine-in, takeaway and reservations", desc: "Manage different restaurant order types in one system." },
        { icon: "checkout", title: "Checkout and cash-up", desc: "Handle checkout, discounts, refunds and daily cash-up." },
        { icon: "offline", title: "Offline backup", desc: "A backup supports orders already in progress when the internet goes down." },
        { icon: "menuControl", title: "Menu and availability control", desc: "Update your menu and pause sold-out items when you need to." },
      ] as Feature[],
    },
    bilingual: {
      title: "One order, English on the floor and Chinese in the kitchen",
      body: "Customers can order in English while kitchen staff view the same order in Chinese. Each person works in the language they know best.",
    },
    secondCta: {
      title: "See how ShopOps would work in your restaurant",
      body: "After you book a demo, we learn your workflow, then help enter your menu and prepare your trial setup.",
    },
    secondary: {
      title: "Other ShopOps products and services",
      body: "POS is our current focus. If you have other operational needs, you can also explore these options.",
      rota: { title: "Rota", body: "Staff scheduling and clock-in attendance to help manage shifts and hours.", cta: "Explore Rota" },
      custom: { title: "Custom software", body: "Internal tools, management systems or automation built around your workflow.", cta: "Talk about your needs" },
    },
    faq: {
      title: "Frequently asked questions",
      questions: {
        trial: "Do I need a card for the free trial?",
        afterTrial: "What happens after the trial?",
        hardware: "Do I need to buy new hardware?",
        area: "What types of food businesses is ShopOps POS suitable for?",
        menu: "Do I need to enter my menu myself?",
      },
      areaAnswer: "It is suitable for independent food businesses such as market stalls, cafés, small restaurants and takeaway shops. We can learn about your setup during the demo.",
    },
    contact: {
      title: "Book a demo and free trial setup",
      subtitle: "Tell us about your restaurant. We will arrange a demo, understand your workflow and help set up your menu before the trial.",
      nameLabel: "Your name / restaurant",
      namePlaceholder: "e.g. Joy Kitchen",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What would you like to know?",
      messagePlaceholder: "e.g. We are a 10-table cafe looking at QR ordering and the kitchen display...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      submitErrorTooLong: "Message too long (2,000 characters max) — please shorten it.",
      submitErrorRateLimit: "Too many attempts — please wait a few minutes or email us directly.",
      orEmail: "Or email directly:",
      note: "Before a demo and trial setup, we will confirm your restaurant workflow and device needs.",
    } satisfies Omit<ContactCopy, "reassure">,
    footer: "© 2026 ShopOps",
  },
} as const;

export default function CompanyHome() {
  const { lang } = useLang();
  const t = dict[lang];
  const pos = POS_CONTENT[lang];
  const contact: ContactCopy = { ...t.contact, reassure: pos.hero.reassurance };
  const faqItems = [
    { q: t.faq.questions.trial, a: pos.trial.steps[3].detail },
    { q: t.faq.questions.afterTrial, a: `${pos.trial.steps[4].detail} ${pos.trial.steps[5].detail}` },
    { q: t.faq.questions.hardware, a: `${pos.hardware.existingDeviceCopy} ${pos.hardware.readyHardwareCopy}` },
    { q: t.faq.questions.area, a: t.faq.areaAnswer },
    { q: t.faq.questions.menu, a: `${pos.trial.steps[1].detail} ${pos.trial.steps[2].detail}` },
  ];

  return (
    <main className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#top", label: t.nav.pos },
          { href: "#core-features", label: t.nav.features },
          { href: "#contact", label: t.nav.demo },
          { href: "/rota", label: t.nav.rota },
          { href: "#secondary-offerings", label: t.nav.customSoftware },
          { href: "/blog", label: t.nav.blog },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: pos.hero.cta }}
      />

      <PosHero copy={pos.hero} />
      <PosWorkflow copy={pos.workflow} lang={lang} />
      <PosBenefits copy={pos.benefits} />

      <section id="core-features" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.features.title}</h2>
            <p className="mt-4 leading-7 text-text-secondary">{t.features.subtitle}</p>
          </div>
          <CardGrid items={t.features.items} cols="2/3" />
        </div>
      </section>

      <section id="bilingual" className="bg-surface px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-bg p-8 text-center sm:p-12">
          <p className="text-sm font-semibold tracking-wide text-accent-strong">English + 中文</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.bilingual.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-text-secondary">{t.bilingual.body}</p>
        </div>
      </section>

      <HardwareOptions copy={pos.hardware} />
      <TrialJourney copy={pos.trial} />

      <section className="bg-surface px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-bg p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.secondCta.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-text-secondary">{t.secondCta.body}</p>
          <a
            href="#contact"
            className="mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-bold text-on-accent transition hover:bg-accent-hover"
          >
            {pos.hero.cta}
          </a>
        </div>
      </section>

      <section id="secondary-offerings" className="bg-bg px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{t.secondary.title}</h2>
            <p className="mt-4 leading-7 text-text-secondary">{t.secondary.body}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-xl font-bold text-text">{t.secondary.rota.title}</h3>
              <p className="mt-3 leading-7 text-text-secondary">{t.secondary.rota.body}</p>
              <a href="/rota" className="mt-5 inline-flex font-semibold text-accent-strong hover:text-accent-strong-hover">
                {t.secondary.rota.cta} →
              </a>
            </article>
            <article className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-xl font-bold text-text">{t.secondary.custom.title}</h3>
              <p className="mt-3 leading-7 text-text-secondary">{t.secondary.custom.body}</p>
              <a href="#contact" className="mt-5 inline-flex font-semibold text-accent-strong hover:text-accent-strong-hover">
                {t.secondary.custom.cta} →
              </a>
            </article>
          </div>
        </div>
      </section>

      <Faq title={t.faq.title} items={faqItems} />
      <ContactSection copy={contact} source="pos" />
      <SiteFooter text={t.footer} />
    </main>
  );
}
