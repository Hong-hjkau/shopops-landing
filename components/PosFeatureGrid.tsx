import type { Lang } from "@/lib/i18n";
import CardGrid from "@/components/CardGrid";

// 完整功能牆 — 4 大主賣點以外嘅已上線模組，一格一類。
// 內容只寫「而家真係 ship 咗」嘅嘢；未上線 / 內部功能（platform console、CTI）唔擺。
const dict = {
  "zh-Hant": {
    title: "唔止點餐，成間舖嘅日常都包埋",
    subtitle: "由訂位、廚房到埋數同食安記錄，一個月費全部喺同一個後台搞掂。",
    items: [
      {
        icon: "🪑",
        title: "訂位 + 候位",
        desc: "客人網上自己訂枱，後台逐個時段控制容量。行入嚟等位就攞籌，仲可以即場打張候位飛畀客人。",
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
        icon: "📺",
        title: "叫號屏 + 廣告屏",
        desc: "整部電視做取餐叫號，客人唔使圍住櫃枱等；淡市時段輪播廣告圖片／影片，餐牌板跟沽清即時更新。",
      },
      {
        icon: "💷",
        title: "收銀齊全",
        desc: "打折、加收費要經理批先過到數；Happy Hour、買一送一自動計。小費、退款、每日埋更對數一頁搞掂。",
      },
      {
        icon: "📊",
        title: "報表 + 成本",
        desc: "日／週／月銷售報表、暢銷榜；連埋食譜成本計到每碟毛利，支出入貨盤點都記到，賺蝕一眼睇晒。",
      },
      {
        icon: "🧾",
        title: "食安記錄",
        desc: "SFBB 開店收店清單、雪櫃溫度記錄、每日簽核，全部電子化。食環／EHO 上嚟檢查，即刻攞得出。",
      },
      {
        icon: "⚠️",
        title: "過敏原標示",
        desc: "英國法定 14 種過敏原逐味菜自動標示；客人申報咗過敏，落單撞到即刻警示，唔會靠員工死記。",
      },
      {
        icon: "⭐",
        title: "客人評價",
        desc: "食完掃碼留評分：滿意嘅客引導去 Google 留好評，唔滿意嘅私下收起跟進，唔會公開見光。",
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
      {
        icon: "📱",
        title: "市集 / Pop-up 擺檔",
        desc: "裝喺 iPad 就係一部流動收銀機：戶外冇網照落單收錢，返到有網自動上雲，市集擺檔都用到。",
      },
    ],
    rotaNote: "員工排班 + 定位打卡由我哋另一產品 Rota 提供，同 POS 同一個後台無縫整合。",
    rotaLink: "了解 Rota →",
  },
  "zh-Hans": {
    title: "不止点餐，整间店的日常都包",
    subtitle: "从订位、厨房到对账和食安记录，一个月费全部在同一个后台搞定。",
    items: [
      {
        icon: "🪑",
        title: "订位 + 排队候位",
        desc: "顾客网上自己订桌，后台逐个时段控制容量。walk-in 等位就取号，还能当场打一张候位小票给顾客。",
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
        icon: "📺",
        title: "叫号屏 + 广告屏",
        desc: "一台电视做取餐叫号，顾客不用围着柜台等；淡市时段轮播广告图片／视频，菜单板跟着售罄即时更新。",
      },
      {
        icon: "💷",
        title: "收银齐全",
        desc: "打折、加收费要经理批准才过账；Happy Hour、买一送一自动计算。小费、退款、每日交班对账一页搞定。",
      },
      {
        icon: "📊",
        title: "报表 + 成本",
        desc: "日／周／月销售报表、畅销榜；连同菜谱成本算出每道菜毛利，支出进货盘点都能记，盈亏一眼看清。",
      },
      {
        icon: "🧾",
        title: "食安记录",
        desc: "SFBB 开店收店清单、冰箱温度记录、每日签核，全部电子化。EHO 上门检查，马上拿得出来。",
      },
      {
        icon: "⚠️",
        title: "过敏原标示",
        desc: "英国法定 14 种过敏原逐道菜自动标示；顾客申报过敏后，下单一冲突马上警示，不靠员工死记。",
      },
      {
        icon: "⭐",
        title: "顾客评价",
        desc: "吃完扫码留评分：满意的顾客引导去 Google 留好评，不满意的私下收起跟进，不会公开见光。",
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
      {
        icon: "📱",
        title: "市集 / Pop-up 摆摊",
        desc: "装在 iPad 上就是一台移动收银机：户外没网照样下单收钱，回到有网自动上云，市集摆摊也能用。",
      },
    ],
    rotaNote: "员工排班 + 定位打卡由我们另一产品 Rota 提供，和 POS 同一个后台无缝整合。",
    rotaLink: "了解 Rota →",
  },
  en: {
    title: "More than ordering — it runs the whole shop",
    subtitle: "Reservations, kitchen, cash-up and food-safety records — all in one back office, one monthly fee.",
    items: [
      {
        icon: "🪑",
        title: "Reservations + waitlist",
        desc: "Customers book tables online while you control capacity per time slot. Walk-ins join a numbered queue — print them a waitlist ticket on the spot.",
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
        icon: "📺",
        title: "Pickup call board + signage",
        desc: "Turn any TV into a pickup call board so customers stop crowding the counter. In quiet hours it loops promo images or video, and the menu board updates the moment something sells out.",
      },
      {
        icon: "💷",
        title: "Full checkout toolkit",
        desc: "Discounts and surcharges need manager approval; Happy Hour and buy-one-get-one apply themselves. Tips, refunds and end-of-day cash-up on one screen.",
      },
      {
        icon: "📊",
        title: "Reports + food cost",
        desc: "Daily, weekly and monthly sales reports with best-sellers. Recipe costing shows margin per dish, and expenses, purchases and stocktakes keep profit or loss in plain sight.",
      },
      {
        icon: "🧾",
        title: "Food safety diary",
        desc: "SFBB opening and closing checklists, fridge temperature logs and daily sign-off, all digital. When the EHO visits, the records are one tap away.",
      },
      {
        icon: "⚠️",
        title: "Allergen labelling",
        desc: "All 14 UK statutory allergens labelled automatically per dish. When a customer declares an allergy, any conflicting order is flagged instantly — no relying on memory.",
      },
      {
        icon: "⭐",
        title: "Customer feedback",
        desc: "Diners scan a QR to rate their meal: happy customers get nudged to leave a Google review, unhappy ones are caught privately so you can fix it off-stage.",
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
      {
        icon: "📱",
        title: "Markets / pop-ups",
        desc: "Installed on an iPad it becomes a mobile till: take orders and payments with no signal at all, and everything syncs to the cloud once you're back online.",
      },
    ],
    rotaNote: "Staff rotas + GPS clock-in come from Rota, our scheduling product — seamlessly integrated with the same back office.",
    rotaLink: "See Rota →",
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
        <p className="mt-8 text-center text-sm text-gray-500">
          {t.rotaNote}{" "}
          <a href="/rota" className="text-orange-600 font-semibold hover:underline">
            {t.rotaLink}
          </a>
        </p>
      </div>
    </section>
  );
}
