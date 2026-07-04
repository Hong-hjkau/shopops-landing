import type { Lang } from "@/lib/i18n";
import CardGrid from "@/components/CardGrid";

// 完整功能牆 — 6 大獨家賣點以外嘅已上線模組，一格一類。
// 內容只寫「而家真係 ship 咗」嘅嘢；未上線 / 內部功能（platform console、CTI）唔擺。
// 同 6 大獨家重複嘅（食安記錄／客人評價／叫號屏廣告屏／成本毛利）唔喺呢度重覆。
const dict = {
  "zh-Hant": {
    title: "獨家嘢以外，基本功一樣做足",
    subtitle: "點餐、訂位、廚房、收銀到報表，一個月費全部喺同一個後台搞掂。",
    items: [
      {
        icon: "🍽️",
        title: "三合一點餐",
        desc: "客人 scan QR 自助落單、員工 POS 一頁搞掂堂食 + 外賣、客人手機自取預訂。三個入口，同一個後台。",
      },
      {
        icon: "📊",
        title: "即時訂單看板",
        desc: "訂單按進度自動分三組 — 等緊做、做緊、做完；桌況頁仲可以逐件菜打剔，樓面即時知邊枱出齊。",
      },
      {
        icon: "📝",
        title: "彈性菜單管理",
        desc: "套餐選項組、午晚市時段切換、即時上落架，全部喺後台一鍵搞掂，唔需要等工程師。",
      },
      {
        icon: "🏬",
        title: "多店一個後台",
        desc: "開幾多間分店都係同一個帳號管：右上角一撳切換舖頭；總店改好菜單一鍵發佈落全部分店，分店有需要仲可以自己微調。",
      },
      {
        icon: "🔌",
        title: "斷網照做生意",
        desc: "雲端死咗、WiFi 斷咗，本機後備即時頂上，照落單照出菜；裝喺 iPad 拎出去市集、pop-up 檔口收錢，返網自動同步。",
      },
      {
        icon: "🪑",
        title: "網上訂位",
        desc: "客人網上自己訂枱，後台逐個時段控制容量，訂位提醒自動發，減少 no-show。",
      },
      {
        icon: "🛵",
        title: "外賣自取 + 送貨",
        desc: "自取分時段接單，唔會迫爆廚房；送貨按 postcode 自動計運費，送貨員用取貨碼核對，唔會攞錯單。",
      },
      {
        icon: "👨‍🍳",
        title: "廚房看板",
        desc: "訂單實時彈入廚房畫面，菜名 AI 自動中英對照，唔同國籍嘅師傅都睇得明；就快逾時嘅單自動 highlight。",
      },
      {
        icon: "💷",
        title: "收銀齊全",
        desc: "打折、加收費要經理批先過到數；Happy Hour、買一送一自動計。小費、退款、每日埋更對數一頁搞掂。",
      },
      {
        icon: "📈",
        title: "銷售報表",
        desc: "日／週／月營業額、暢銷榜、時段對比，邊樣賣得好、幾點最旺一眼睇晒。",
      },
      {
        icon: "🌐",
        title: "中英雙語",
        desc: "客人餐牌、員工介面、廚房畫面全部中英隨時切換，每個員工仲可以自己揀慣用語言。",
      },
      {
        icon: "🖨️",
        title: "單據打印",
        desc: "收據、候位飛自動打；打印機喺後台自己加、自己測試，唔使等師傅上門。",
      },
    ],
  },
  "zh-Hans": {
    title: "独家功能以外，基本功一样扎实",
    subtitle: "点餐、订位、厨房、收银到报表，一个月费全部在同一个后台搞定。",
    items: [
      {
        icon: "🍽️",
        title: "三合一点餐",
        desc: "顾客扫 QR 自助下单、员工 POS 一页搞定堂食 + 外卖、顾客手机自取预订。三个入口，同一个后台。",
      },
      {
        icon: "📊",
        title: "实时订单看板",
        desc: "订单按进度自动分三组 —— 待处理、制作中、已完成；桌位页还能逐道菜划单，前厅即时知道哪桌出齐。",
      },
      {
        icon: "📝",
        title: "弹性菜单管理",
        desc: "套餐选项组、午晚市时段切换、即时上下架，全部在后台一键搞定，不用等工程师。",
      },
      {
        icon: "🏬",
        title: "多店一个后台",
        desc: "开多少家分店都是同一个账号管：右上角一点切换店铺；总店改好菜单一键发布到全部分店，分店有需要还能自己微调。",
      },
      {
        icon: "🔌",
        title: "断网照样做生意",
        desc: "云端宕机、WiFi 断了，本机备援即时顶上，照样下单出菜；装在 iPad 上带去市集、pop-up 摊位收钱，回网自动同步。",
      },
      {
        icon: "🪑",
        title: "网上订位",
        desc: "顾客网上自己订桌，后台逐个时段控制容量，订位提醒自动发，减少 no-show。",
      },
      {
        icon: "🛵",
        title: "外卖自取 + 配送",
        desc: "自取分时段接单，不会挤爆厨房；配送按 postcode 自动算运费，配送员用取货码核对，不会拿错单。",
      },
      {
        icon: "👨‍🍳",
        title: "厨房看板",
        desc: "订单实时弹进厨房画面，菜名 AI 自动中英对照，不同国籍的师傅都看得懂；快超时的单自动高亮。",
      },
      {
        icon: "💷",
        title: "收银齐全",
        desc: "打折、加收费要经理批准才过账；Happy Hour、买一送一自动计算。小费、退款、每日交班对账一页搞定。",
      },
      {
        icon: "📈",
        title: "销售报表",
        desc: "日／周／月营业额、畅销榜、时段对比，什么卖得好、几点最旺一眼看清。",
      },
      {
        icon: "🌐",
        title: "中英双语",
        desc: "顾客菜单、员工界面、厨房画面全部中英随时切换，每个员工还能自己选惯用语言。",
      },
      {
        icon: "🖨️",
        title: "单据打印",
        desc: "收据、候位小票自动打印；打印机在后台自己加、自己测试，不用等师傅上门。",
      },
    ],
  },
  en: {
    title: "Beyond the exclusives, the basics are rock solid",
    subtitle: "Ordering, reservations, kitchen, checkout and reports — one back office, one monthly fee.",
    items: [
      {
        icon: "🍽️",
        title: "Three ways to order",
        desc: "Diners scan a QR to self-order, staff use one POS for dine-in + takeaway, customers pre-order on their phone. Three entry points, one dashboard.",
      },
      {
        icon: "📊",
        title: "Live order board",
        desc: "Orders flow through three stages — Pending, In Progress, Done. The table view lets floor staff tick off each dish as it leaves the kitchen.",
      },
      {
        icon: "📝",
        title: "Flexible menu control",
        desc: "Set-meal option groups, lunch/dinner sessions, instant item availability — all from the admin panel. No engineer required.",
      },
      {
        icon: "🏬",
        title: "Multi-site, one back office",
        desc: "Run any number of branches from one account: switch shops from the header, publish HQ menu changes to every branch in one click, and let each branch fine-tune its own copy.",
      },
      {
        icon: "🔌",
        title: "Keep trading offline",
        desc: "When the cloud or WiFi goes down, a local backup keeps orders and food moving. On an iPad it doubles as a mobile till for market stalls and pop-ups, syncing once you're back online.",
      },
      {
        icon: "🪑",
        title: "Online reservations",
        desc: "Customers book tables online while you control capacity per time slot, with automatic booking reminders to cut no-shows.",
      },
      {
        icon: "🛵",
        title: "Takeaway + delivery",
        desc: "Collection orders come in by time slot so the kitchen never floods. Delivery fees are worked out by postcode, and couriers confirm handovers with a pickup code.",
      },
      {
        icon: "👨‍🍳",
        title: "Kitchen display",
        desc: "Orders appear on the kitchen screen in real time, with dish names auto-translated between English and Chinese for a mixed crew. Orders running late get highlighted.",
      },
      {
        icon: "💷",
        title: "Full checkout toolkit",
        desc: "Discounts and surcharges need manager approval; Happy Hour and buy-one-get-one apply themselves. Tips, refunds and end-of-day cash-up on one screen.",
      },
      {
        icon: "📈",
        title: "Sales reports",
        desc: "Daily, weekly and monthly takings, best-sellers and time-of-day comparisons — what sells and when you're busiest, at a glance.",
      },
      {
        icon: "🌐",
        title: "Bilingual throughout",
        desc: "Customer menus, staff screens and the kitchen display all switch between English and Chinese — and each staff member picks their own language.",
      },
      {
        icon: "🖨️",
        title: "Receipt printing",
        desc: "Receipts and waitlist tickets print automatically. Add and test printers yourself from the back office — no engineer visit needed.",
      },
    ],
  },
} as const;

export default function PosFeatureGrid({ lang }: { lang: Lang }) {
  const t = dict[lang];

  return (
    <section id="all-features" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
        <CardGrid items={t.items} cols="2/3" size="sm" />
      </div>
    </section>
  );
}
