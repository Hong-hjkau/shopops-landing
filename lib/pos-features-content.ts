import type { Lang } from "./i18n";
import { POS_CONTENT, type PosAddOnId, type PosAddOnItem } from "./pos-content.ts";

type ImageSemantics = {
  imageAlt: string;
  imageActionLabel: string;
};

type FeatureCard = ImageSemantics & {
  title: string;
  body: string;
};

type AddOnDescription = ImageSemantics & {
  outcome: string;
  body: string;
};

export type PosFeaturesContent = {
  hero: {
    eyebrow: string;
    title: string;
    result: string;
    body: string;
    corePriceLabel: string;
    standardAddOnPriceLabel: string;
    premiumAddOnPriceLabel: string;
  };
  // 示範截圖全部係英文畫面。呢兩句唔屬任何一個 section —— 四個有截圖嘅 section
  // （workflow / core / advanced-operations / add-ons）共用同一句，所以放頂層，
  // 唔再收喺 `workflow.` 下面扮 workflow 專用。
  demoImageCaption: string;
  demoImageBadge: string;
  workflow: {
    title: string;
    stories: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  };
  core: {
    eyebrow: string;
    title: string;
    cards: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  };
  addOns: Record<PosAddOnId, AddOnDescription>;
  imageDialogCloseLabel: string;
  premiumTitle: string;
  delivery: {
    eyebrow: string;
    body: string;
    benefits: readonly [string, string, string, string, string];
    cashOnly: string;
    onlinePaymentBoundary: string;
  };
  finance: {
    eyebrow: string;
    body: string;
    benefits: readonly [string, string, string, string, string, string];
    recipeBoundary: string;
    hmrcBoundary: string;
  };
  goodToKnowTitle: string;
  // 卡付款嗰條**刻意唔喺度**：佢係 canonical `POS_CONTENT[lang].pricing.feeNote`，
  // 由 PosFeaturesLanding 插入。功能頁曾經自己寫過第二套（"records card payments
  // only"），同 /pos 分岔並且英文讀落變成「唔記錄現金」。唔好加返落呢度。
  goodToKnow: {
    collection: string;
    delivery: string;
    invoiceVat: string;
  };
  midCta: { title: string; body: string; cta: string };
  finalCta: { title: string; body: string };
  metadata: { title: string; description: string; share: string };
};

export const POS_FEATURES_CONTENT: Record<Lang, PosFeaturesContent> = {
  en: {
    hero: {
      eyebrow: "Restaurant POS that fits the way you work",
      title: "ShopOps POS features",
      result: "One place for your floor, kitchen and checkout — in English and Chinese.",
      body: "Start with the Core POS, then add only the tools that help your restaurant today. Every add-on needs Core POS and is charged separately.",
      corePriceLabel: "Core POS",
      standardAddOnPriceLabel: "Choose-your-own operations tools",
      premiumAddOnPriceLabel: "Advanced operations (Delivery or finance)",
    },
    demoImageCaption: "Demo screens are in English. ShopOps supports English and Chinese.",
    demoImageBadge: "EN demo",
    workflow: {
      title: "From order to checkout",
      stories: [
        { title: "Staff enters the order", body: "Staff enter dine-in or collection orders in the POS. Dine-in guests can also scan a table QR code, with optional staff confirmation before the order reaches the kitchen.", imageAlt: "English demo POS screen showing staff entering a dine-in order and its items.", imageActionLabel: "Enlarge the order-entry demo screen" },
        { title: "Kitchen receives the order", body: "The kitchen sees the order and updates its preparation status.", imageAlt: "English demo kitchen screen showing an incoming order ready for preparation.", imageActionLabel: "Enlarge the kitchen-order demo screen" },
        { title: "Front of house sees progress", body: "The floor team follows each order's progress and knows when food is ready.", imageAlt: "English demo floor screen showing order progress and ready status.", imageActionLabel: "Enlarge the floor-progress demo screen" },
        { title: "Checkout and reporting", body: "Staff record cash or card, apply discounts and complete checkout with the daily report in view.", imageAlt: "English demo checkout screen showing payment recording and the daily report.", imageActionLabel: "Enlarge the checkout and reporting demo screen" },
      ],
    },
    core: {
      eyebrow: "Included with Core POS",
      title: "The everyday tools your service needs",
      cards: [
        { title: "English and Chinese side by side", body: "Use a bilingual screen for the floor and kitchen. If a translation is missing or unavailable, the original wording stays visible.", imageAlt: "English demo menu screen showing English and Chinese item names side by side.", imageActionLabel: "Enlarge the bilingual-menu demo screen" },
        { title: "Keep taking orders during an outage", body: "Offline backup helps your team keep working when the internet drops, then reconnect when it is available again.", imageAlt: "English demo POS screen showing an order safely queued while offline.", imageActionLabel: "Enlarge the offline-backup demo screen" },
        { title: "Menus that match the way you sell", body: "Manage menu sections, set meals, choices and options so staff can take the order the customer asked for.", imageAlt: "English demo menu-management screen showing sections, set meals and choices.", imageActionLabel: "Enlarge the menu-management demo screen" },
        { title: "Mark items sold out yourself", body: "Hide an item from the menu when staff mark it sold out, and check availability again when the order is placed.", imageAlt: "English demo kitchen screen showing an item marked sold out and unavailable.", imageActionLabel: "Enlarge the sold-out control demo screen" },
      ],
    },
    addOns: {
      scheduling: { outcome: "Spend less time chasing staff rotas.", body: "Plan shifts, collect staff availability, manage shift swaps and use Telegram location clock-in.", imageAlt: "English demo rota screen showing fictional staff shifts and availability.", imageActionLabel: "Enlarge the scheduling and clock-in demo screen" },
      reservations: { outcome: "Reduce the calls needed to confirm tables.", body: "Let guests book online. Staff can handle walk-ins, assign tables, follow the table timeline and send reminders.", imageAlt: "English demo reservations screen showing fictional bookings and a table timeline.", imageActionLabel: "Enlarge the reservations demo screen" },
      reviews: { outcome: "Spot guest feedback sooner and follow it up.", body: "Send invitations after completed orders or reservations, then keep ratings, comments and staff notifications together.", imageAlt: "English demo reviews screen showing fictional ratings and feedback summaries.", imageActionLabel: "Enlarge the guest-reviews demo screen" },
      food_safety: { outcome: "Keep daily food-safety work together instead of on paper.", body: "Record daily checks, temperatures, corrective actions and sign-off.", imageAlt: "English demo food-safety screen showing checks, temperatures and sign-off.", imageActionLabel: "Enlarge the food-safety records demo screen" },
      allergens: { outcome: "Give staff a safer starting point for allergen questions.", body: "A photo scan suggests possible allergens. Staff confirm the result, and every order asks again about the guest's needs.", imageAlt: "English demo allergen screen showing suggested matches awaiting staff confirmation.", imageActionLabel: "Enlarge the allergen-suggestions demo screen" },
      recipe_costing: { outcome: "See a clearer estimate of each dish's cost.", body: "Manage recipes, portions and steps, then estimate the cost per portion. Usage and ingredient cost units must match.", imageAlt: "English demo recipe screen showing fictional ingredients, units and estimated portion cost.", imageActionLabel: "Enlarge the recipe-costing demo screen" },
      custom_domain: { outcome: "Give customers the restaurant's own web address.", body: "Use that address after setup; the demo and activation process explains the technical steps.", imageAlt: "English demo domain screen showing the fictional address demo.example.com.", imageActionLabel: "Enlarge the custom-domain demo screen" },
      signage: { outcome: "Use an existing screen for menus and promotions.", body: "Rotate images, videos, dishes or linked content on the screen.", imageAlt: "English demo signage screen showing a fictional digital menu playlist.", imageActionLabel: "Enlarge the digital-signage demo screen" },
      delivery: { outcome: "Take direct delivery orders alongside restaurant orders.", body: "Customers submit delivery orders through the restaurant's own web page.", imageAlt: "English demo delivery screen showing fictional delivery settings and driver workflow.", imageActionLabel: "Enlarge the delivery-operations demo screen" },
      finance_inventory: { outcome: "Bring actual stock and finance figures together.", body: "Use purchases, receiving, stocktakes and usage to understand actual costs.", imageAlt: "English demo finance and inventory screen showing fictional invoice and stocktake figures.", imageActionLabel: "Enlarge the finance and inventory demo screen" },
    },
    imageDialogCloseLabel: "Close enlarged image",
    premiumTitle: "Advanced operations",
    delivery: {
      eyebrow: "For direct delivery orders",
      body: "Customers submit delivery orders through the restaurant's own ShopOps web page. Staff manage the order and the driver journey in one flow.",
      benefits: [
        "Set postcode areas, delivery slots, minimum order values and delivery fees.",
        "Give each order a collection code and each driver a dedicated driver view.",
        "The driver flow covers collect, confirm collection, deliver or cancel, then return for cash reconciliation.",
        "Set driver pay per order and per mile or kilometre.",
        "Use actual driving distance when available; otherwise estimate with straight-line distance.",
      ],
      cashOnly: "Delivery orders are cash-only.",
      onlinePaymentBoundary: "ShopOps does not take online payments for delivery orders.",
    },
    finance: {
      eyebrow: "For actual stock and finance figures",
      body: "Record suppliers, purchases, receiving and stock intake, then use confirmed information to understand actual stock movement and costs.",
      benefits: [
        "AI scans invoice photos or PDFs to create a draft for staff to check. Nothing is received into stock until a person confirms it.",
        "Classify each invoice line as company stock or excluded private use.",
        "Scan VAT paid on purchases and leave uncertain values for staff confirmation.",
        "Convert purchasing and stock units, for example 1 pack = 500 g.",
        "Run stocktakes and stock valuations, then compare actual usage, cost, expenses, labour and Profit and loss.",
        "Export the confirmed figures to Excel for your accountant or other checks.",
      ],
      recipeBoundary: "Finance and inventory uses purchases, stocktakes and usage to calculate actual cost and Profit and loss. +£9 Recipe costing is a separate estimate per dish or portion and needs recipe setup with matching units.",
      hmrcBoundary: "ShopOps can record sales and purchase VAT and export the figures. It does not submit directly to HMRC or file VAT Returns; use compatible accounting software or an accountant.",
    },
    goodToKnowTitle: "Good to know",
    goodToKnow: {
      collection: "Staff can enter collection orders in the POS.",
      delivery: "Delivery orders are cash-only. ShopOps does not take online payments.",
      invoiceVat: "AI invoice and VAT details stay as a draft until staff confirm them. ShopOps does not submit directly to HMRC.",
    },
    midCta: { title: "Not sure which tools you need?", body: "We can talk through your current service and show only the tools that fit it.", cta: "Book a demo" },
    finalCta: { title: "Build the combination your restaurant needs", body: "Start with Core POS, then add each tool individually." },
    metadata: { title: "Restaurant POS features | ShopOps", description: "See the ShopOps restaurant POS, optional tools and their practical boundaries.", share: "A bilingual restaurant POS for orders, kitchen and checkout." },
  },
  "zh-Hant": {
    hero: {
      eyebrow: "配合餐廳日常的 POS",
      title: "ShopOps POS 功能",
      result: "樓面、廚房和結帳集中一處，中英文都看得明。",
      body: "先用核心 POS，再按餐廳現時需要加選工具。每項加購都需要核心 POS，並逐項收費。",
      corePriceLabel: "核心 POS",
      standardAddOnPriceLabel: "自選營運功能",
      premiumAddOnPriceLabel: "進階營運功能（送貨或財務）",
    },
    demoImageCaption: "示範畫面為英文，系統支援英文及中文。",
    demoImageBadge: "英文示範",
    workflow: {
      title: "由落單到結帳",
      stories: [
        { title: "員工輸入訂單", body: "員工在 POS 輸入堂食或外賣自取訂單。堂食客人亦可掃枱上 QR code 點餐，餐廳可設定先由員工確認再送到廚房。", imageAlt: "英文示範 POS 畫面，顯示員工輸入堂食訂單及菜式。", imageActionLabel: "放大落單示範畫面" },
        { title: "廚房收到訂單", body: "廚房看到訂單，並更新準備狀態。", imageAlt: "英文示範廚房畫面，顯示等候準備的新訂單。", imageActionLabel: "放大廚房訂單示範畫面" },
        { title: "樓面查看進度", body: "樓面團隊跟進每張訂單，知道食物何時完成。", imageAlt: "英文示範樓面畫面，顯示訂單進度及完成狀態。", imageActionLabel: "放大樓面進度示範畫面" },
        { title: "結帳及報表", body: "員工記錄現金或信用卡、套用折扣，並在查看當日報表時完成結帳。", imageAlt: "英文示範結帳畫面，顯示付款記錄及當日報表。", imageActionLabel: "放大結帳及報表示範畫面" },
      ],
    },
    core: {
      eyebrow: "核心 POS 已包括",
      title: "每天開工會用到的工具",
      cards: [
        { title: "中英文並排顯示", body: "樓面和廚房可用雙語畫面。若未有翻譯或翻譯服務暫時不可用，會保留原文。", imageAlt: "英文示範餐牌畫面，顯示菜式的英文及中文名稱並排。", imageActionLabel: "放大雙語餐牌示範畫面" },
        { title: "斷網時仍可繼續落單", body: "網絡中斷時有離線後備，網絡回復後再重新連接。", imageAlt: "英文示範 POS 畫面，顯示斷網時安全排隊等候同步的訂單。", imageActionLabel: "放大離線後備示範畫面" },
        { title: "餐牌和選項跟足餐廳做法", body: "管理餐牌分類、套餐和選項，員工可按客人要求落單。", imageAlt: "英文示範餐牌管理畫面，顯示分類、套餐及選項。", imageActionLabel: "放大餐牌管理示範畫面" },
        { title: "手動標示售罄", body: "員工標示售罄後，菜式會從餐牌隱藏；落單時亦會再次檢查供應狀態。", imageAlt: "英文示範廚房畫面，顯示菜式已標示售罄及暫停供應。", imageActionLabel: "放大售罄控制示範畫面" },
      ],
    },
    addOns: {
      scheduling: { outcome: "少花時間追員工更表。", body: "安排更次、收集員工可上班時間、處理換更，並以 Telegram 定位打卡。", imageAlt: "英文示範更表畫面，顯示虛構員工更次及可上班時間。", imageActionLabel: "放大排班及打卡示範畫面" },
      reservations: { outcome: "減少電話來回確認。", body: "客人可網上訂位；店員處理 walk-in、編枱、枱位時間線及提醒。", imageAlt: "英文示範訂位畫面，顯示虛構訂位及枱位時間線。", imageActionLabel: "放大訂位示範畫面" },
      reviews: { outcome: "更快發現客人意見並跟進。", body: "完成訂單或訂位後發出邀請，集中評分、留言及店方通知。", imageAlt: "英文示範評價畫面，顯示虛構評分及意見摘要。", imageActionLabel: "放大顧客評價示範畫面" },
      food_safety: { outcome: "把紙本食安工作集中管理。", body: "記錄每日檢查、溫度、異常處理及簽核。", imageAlt: "英文示範食安畫面，顯示檢查、溫度及簽核記錄。", imageActionLabel: "放大食安記錄示範畫面" },
      allergens: { outcome: "讓員工有較安全的過敏原資料起點。", body: "相片掃描只提出可能的過敏原建議，再由員工確認；每張訂單都會重新確認客人需要。", imageAlt: "英文示範過敏原畫面，顯示等待員工確認的建議結果。", imageActionLabel: "放大過敏原建議示範畫面" },
      recipe_costing: { outcome: "更清楚每道菜的預計成本。", body: "管理食譜、份量和步驟，估算每份成本；使用量單位須與食材成本單位一致。", imageAlt: "英文示範食譜畫面，顯示虛構食材、單位及每份預計成本。", imageActionLabel: "放大食譜成本示範畫面" },
      custom_domain: { outcome: "讓客人使用餐廳自己的網址。", body: "完成設定後即可使用；技術步驟會在示範及啟用流程交代。", imageAlt: "英文示範網域畫面，顯示虛構網址 demo.example.com。", imageActionLabel: "放大自訂網域示範畫面" },
      signage: { outcome: "用現有屏幕展示餐牌及宣傳內容。", body: "輪播圖片、影片、菜式或連結內容。", imageAlt: "英文示範廣告屏畫面，顯示虛構電子餐牌播放清單。", imageActionLabel: "放大廣告屏示範畫面" },
      delivery: { outcome: "直接送貨訂單可和店內訂單一起處理。", body: "客人從餐廳自己的網頁提交送貨訂單。", imageAlt: "英文示範送貨畫面，顯示虛構送貨設定及司機流程。", imageActionLabel: "放大送貨營運示範畫面" },
      finance_inventory: { outcome: "把實際庫存及財務數字集中查看。", body: "用採購、收貨、盤點及耗用了解實際成本。", imageAlt: "英文示範財務及庫存畫面，顯示虛構 Invoice 及盤點數字。", imageActionLabel: "放大財務及庫存示範畫面" },
    },
    imageDialogCloseLabel: "關閉放大圖片",
    premiumTitle: "進階營運功能",
    delivery: {
      eyebrow: "直接送貨訂單",
      body: "客人從餐廳自己的 ShopOps 網頁提交送貨訂單，員工在同一流程管理訂單及司機進度。",
      benefits: [
        "設定 postcode 區域、送貨時段、最低消費及運費。",
        "每張訂單提供取貨碼，司機使用專用版面。",
        "司機流程包括取貨、確認取貨、送達或取消，最後回店做現金對帳。",
        "按每單及每英里或公里設定司機薪酬。",
        "能取得實際行車距離時使用該距離，否則以直線距離估算。",
      ],
      cashOnly: "送貨訂單只收現金。",
      onlinePaymentBoundary: "ShopOps 送貨訂單不接受網上付款。",
    },
    finance: {
      eyebrow: "實際庫存及財務數字",
      body: "記錄供應商、採購、收貨及入庫，再用確認後的資料了解實際庫存變動及成本。",
      benefits: [
        "AI 掃描 Invoice 相片或 PDF，先建立草稿讓員工檢查；員工確認後才會入庫。",
        "把每行 Invoice 分類為公司庫存，或因私人用途而排除。",
        "掃描採購時支付的 VAT；不肯定的數值保留待員工確認。",
        "轉換採購及庫存單位，例如 1 pack = 500 g。",
        "進行盤點及存貨估值，再比較實際耗用、成本、開支、人工及損益。",
        "把確認後的數字匯出到 Excel，交給會計師或另行核對。",
      ],
      recipeBoundary: "財務及庫存按採購、盤點及耗用計算實際成本和損益。+£9 食譜成本是每道菜或每份的獨立估算，需要先設定食譜，並使用一致單位。",
      hmrcBoundary: "ShopOps 可記錄銷售及採購 VAT 並匯出資料，但不會直接向 HMRC 提交 VAT Return；請使用相容會計軟件或交由會計師處理。",
    },
    goodToKnowTitle: "需要知道",
    goodToKnow: {
      collection: "店員可在 POS 輸入外賣自取訂單。",
      delivery: "送貨訂單只收現金，ShopOps 不接受網上付款。",
      invoiceVat: "AI Invoice 及 VAT 資料會先保留為草稿，經員工確認後才使用；ShopOps 不會直接向 HMRC 提交。",
    },
    midCta: { title: "不確定需要哪些功能？", body: "我們可先了解你的日常流程，只示範合適的工具。", cta: "預約示範" },
    finalCta: { title: "組合餐廳真正需要的功能", body: "先用核心 POS，再逐項加入所需工具。" },
    metadata: { title: "餐廳 POS 功能 | ShopOps", description: "查看 ShopOps 餐廳 POS、加購工具和各項實際功能界線。", share: "中英雙語餐廳 POS，處理落單、廚房和結帳。" },
  },
  "zh-Hans": {
    hero: {
      eyebrow: "配合餐厅日常的 POS",
      title: "ShopOps POS 功能",
      result: "前厅、厨房和结账集中一处，中英文都看得懂。",
      body: "先用核心 POS，再按餐厅目前需要加选工具。每项加购都需要核心 POS，并逐项收费。",
      corePriceLabel: "核心 POS",
      standardAddOnPriceLabel: "自选营运功能",
      premiumAddOnPriceLabel: "进阶营运功能（配送或财务）",
    },
    demoImageCaption: "演示画面为英文，系统支持英文及中文。",
    demoImageBadge: "英文演示",
    workflow: {
      title: "从点餐到结账",
      stories: [
        { title: "员工输入订单", body: "员工在 POS 输入堂食或外卖自取订单。堂食顾客也可扫桌上 QR code 点餐，餐厅可设置先由员工确认再送到厨房。", imageAlt: "英文演示 POS 画面，显示员工输入堂食订单及菜品。", imageActionLabel: "放大点餐演示画面" },
        { title: "厨房收到订单", body: "厨房看到订单，并更新准备状态。", imageAlt: "英文演示厨房画面，显示等待准备的新订单。", imageActionLabel: "放大厨房订单演示画面" },
        { title: "前厅查看进度", body: "前厅团队跟进每张订单，知道菜品什么时候完成。", imageAlt: "英文演示前厅画面，显示订单进度及完成状态。", imageActionLabel: "放大前厅进度演示画面" },
        { title: "结账及报表", body: "员工记录现金或银行卡、应用折扣，并在查看当天报表时完成结账。", imageAlt: "英文演示结账画面，显示付款记录及当天报表。", imageActionLabel: "放大结账及报表演示画面" },
      ],
    },
    core: {
      eyebrow: "核心 POS 已包括",
      title: "每天开工会用到的工具",
      cards: [
        { title: "中英文并排显示", body: "前厅和厨房可用双语画面。如没有翻译或翻译服务暂时不可用，会保留原文。", imageAlt: "英文演示菜单画面，显示菜品的英文及中文名称并排。", imageActionLabel: "放大双语菜单演示画面" },
        { title: "断网时仍可继续点餐", body: "网络中断时有离线备用，网络恢复后再重新连接。", imageAlt: "英文演示 POS 画面，显示断网时安全排队等待同步的订单。", imageActionLabel: "放大离线备用演示画面" },
        { title: "菜单和选项跟足餐厅做法", body: "管理菜单分类、套餐和选项，员工可按顾客要求点餐。", imageAlt: "英文演示菜单管理画面，显示分类、套餐及选项。", imageActionLabel: "放大菜单管理演示画面" },
        { title: "手动标示售罄", body: "员工标示售罄后，菜品会从菜单隐藏；点餐时也会再次检查供应状态。", imageAlt: "英文演示厨房画面，显示菜品已标示售罄及暂停供应。", imageActionLabel: "放大售罄控制演示画面" },
      ],
    },
    addOns: {
      scheduling: { outcome: "少花时间追员工班表。", body: "安排班次、收集员工可上班时间、处理换班，并以 Telegram 定位打卡。", imageAlt: "英文演示班表画面，显示虚构员工班次及可上班时间。", imageActionLabel: "放大排班及打卡演示画面" },
      reservations: { outcome: "减少电话来回确认。", body: "顾客可在线订位；店员处理 walk-in、分桌、桌位时间线及提醒。", imageAlt: "英文演示订位画面，显示虚构订位及桌位时间线。", imageActionLabel: "放大订位演示画面" },
      reviews: { outcome: "更快发现顾客意见并跟进。", body: "完成订单或订位后发出邀请，集中评分、留言及店方通知。", imageAlt: "英文演示评价画面，显示虚构评分及意见摘要。", imageActionLabel: "放大顾客评价演示画面" },
      food_safety: { outcome: "把纸本食品安全工作集中管理。", body: "记录每日检查、温度、异常处理及签核。", imageAlt: "英文演示食品安全画面，显示检查、温度及签核记录。", imageActionLabel: "放大食品安全记录演示画面" },
      allergens: { outcome: "让员工有较安全的过敏原资料起点。", body: "照片扫描只提出可能的过敏原建议，再由员工确认；每张订单都会重新确认顾客需要。", imageAlt: "英文演示过敏原画面，显示等待员工确认的建议结果。", imageActionLabel: "放大过敏原建议演示画面" },
      recipe_costing: { outcome: "更清楚每道菜的预计成本。", body: "管理食谱、份量和步骤，估算每份成本；使用量单位须与食材成本单位一致。", imageAlt: "英文演示食谱画面，显示虚构食材、单位及每份预计成本。", imageActionLabel: "放大食谱成本演示画面" },
      custom_domain: { outcome: "让顾客使用餐厅自己的网址。", body: "完成设置后即可使用；技术步骤会在演示及启用流程交代。", imageAlt: "英文演示域名画面，显示虚构网址 demo.example.com。", imageActionLabel: "放大自定义域名演示画面" },
      signage: { outcome: "用现有屏幕展示菜单及宣传内容。", body: "轮播图片、视频、菜品或链接内容。", imageAlt: "英文演示广告屏画面，显示虚构电子菜单播放列表。", imageActionLabel: "放大广告屏演示画面" },
      delivery: { outcome: "直接送货订单可和店内订单一起处理。", body: "顾客从餐厅自己的网页提交送货订单。", imageAlt: "英文演示送货画面，显示虚构送货设置及司机流程。", imageActionLabel: "放大送货运营演示画面" },
      finance_inventory: { outcome: "把实际库存及财务数字集中查看。", body: "用采购、收货、盘点及耗用了解实际成本。", imageAlt: "英文演示财务及库存画面，显示虚构 Invoice 及盘点数字。", imageActionLabel: "放大财务及库存演示画面" },
    },
    imageDialogCloseLabel: "关闭放大图片",
    premiumTitle: "进阶营运功能",
    delivery: {
      eyebrow: "直接送货订单",
      body: "顾客从餐厅自己的 ShopOps 网页提交送货订单，员工在同一流程管理订单及司机进度。",
      benefits: [
        "设置 postcode 区域、送货时段、最低消费及运费。",
        "每张订单提供取货码，司机使用专用页面。",
        "司机流程包括取货、确认取货、送达或取消，最后回店做现金对账。",
        "按每单及每英里或公里设置司机薪酬。",
        "能取得实际行车距离时使用该距离，否则以直线距离估算。",
      ],
      cashOnly: "送货订单只收现金。",
      onlinePaymentBoundary: "ShopOps 送货订单不接受在线付款。",
    },
    finance: {
      eyebrow: "实际库存及财务数字",
      body: "记录供应商、采购、收货及入库，再用确认后的资料了解实际库存变动及成本。",
      benefits: [
        "AI 扫描 Invoice 照片或 PDF，先建立草稿让员工检查；员工确认后才会入库。",
        "把每行 Invoice 分类为公司库存，或因私人用途而排除。",
        "扫描采购时支付的 VAT；不确定的数值保留待员工确认。",
        "转换采购及库存单位，例如 1 pack = 500 g。",
        "进行盘点及库存估值，再比较实际耗用、成本、开支、人工及损益。",
        "把确认后的数字导出到 Excel，交给会计师或另外核对。",
      ],
      recipeBoundary: "财务及库存按采购、盘点及耗用计算实际成本和损益。+£9 食谱成本是每道菜或每份的独立估算，需要先设置食谱，并使用一致单位。",
      hmrcBoundary: "ShopOps 可记录销售及采购 VAT 并导出资料，但不会直接向 HMRC 提交 VAT Return；请使用兼容会计软件或交由会计师处理。",
    },
    goodToKnowTitle: "需要知道",
    goodToKnow: {
      collection: "店员可在 POS 输入外卖自取订单。",
      delivery: "送货订单只收现金，ShopOps 不接受在线付款。",
      invoiceVat: "AI Invoice 及 VAT 资料会先保留为草稿，经员工确认后才使用；ShopOps 不会直接向 HMRC 提交。",
    },
    midCta: { title: "不确定需要哪些功能？", body: "我们可先了解你的日常流程，只演示合适的工具。", cta: "预约演示" },
    finalCta: { title: "组合餐厅真正需要的功能", body: "先用核心 POS，再逐项加入所需工具。" },
    metadata: { title: "餐厅 POS 功能 | ShopOps", description: "查看 ShopOps 餐厅 POS、加购工具和各项实际功能界线。", share: "中英双语餐厅 POS，处理点餐、厨房和结账。" },
  },
};

export function getPosFeatureAddOn(
  lang: Lang,
  id: PosAddOnId,
): PosAddOnItem & { monthlyPrice: number } {
  for (const group of POS_CONTENT[lang].pricing.addOnGroups) {
    const item = group.items.find((candidate) => candidate.id === id);
    if (item) return { ...item, monthlyPrice: group.monthlyPrice };
  }
  throw new Error(`Missing POS add-on pricing ID: ${id}`);
}

export function getStandardPosFeatureAddOns(lang: Lang): Array<PosAddOnItem & { monthlyPrice: number }> {
  return POS_CONTENT[lang].pricing.addOnGroups.flatMap((group) =>
    group.items
      .filter((item) => item.id !== "delivery" && item.id !== "finance_inventory")
      .map((item) => ({ ...item, monthlyPrice: group.monthlyPrice })),
  );
}

export function getStandardPosFeatureAddOnPrice(lang: Lang) {
  return getPosFeatureAddOn(lang, "scheduling").monthlyPrice;
}

export function getPosFeaturePricing(lang: Lang) {
  const core = POS_CONTENT[lang].pricing.core.monthlyPrice;
  const delivery = getPosFeatureAddOn(lang, "delivery").monthlyPrice;
  const finance = getPosFeatureAddOn(lang, "finance_inventory").monthlyPrice;
  const recipe = getPosFeatureAddOn(lang, "recipe_costing").monthlyPrice;

  return {
    core,
    delivery,
    finance,
    recipe,
    corePlusDelivery: core + delivery,
    corePlusFinance: core + finance,
    corePlusFinanceAndRecipe: core + finance + recipe,
  };
}
