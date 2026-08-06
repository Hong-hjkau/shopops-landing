import type { Lang } from "./i18n";
import { POS_CONTENT, type PosAddOnId, type PosAddOnItem } from "./pos-content.ts";

type FeatureCard = {
  title: string;
  body: string;
};

type AddOnDescription = FeatureCard & {
  outcome: string;
};

export type PosFeaturesContent = {
  hero: {
    eyebrow: string;
    title: string;
    result: string;
    body: string;
    corePriceLabel: string;
    addOnPriceLabel: string;
  };
  workflow: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  core: {
    eyebrow: string;
    title: string;
    cards: readonly [FeatureCard, FeatureCard, FeatureCard, FeatureCard];
  };
  addOns: Record<PosAddOnId, AddOnDescription>;
  delivery: {
    eyebrow: string;
    title: string;
    body: string;
    cashOnly: string;
    cardBoundary: string;
    onlinePaymentBoundary: string;
    staffApproval: string;
  };
  finance: {
    eyebrow: string;
    title: string;
    body: string;
    vatPaidOnPurchases: string;
    profitAndLoss: string;
    excelExport: string;
    hmrcBoundary: string;
  };
  recipe: {
    eyebrow: string;
    title: string;
    body: string;
    straightLineEstimate: string;
    aiDraftBoundary: string;
  };
  goodToKnow: readonly [string, string, string, string];
  midCta: { title: string; body: string; cta: string; reassurance: string };
  finalCta: { title: string; body: string; cta: string; reassurance: string };
  metadata: { title: string; description: string; share: string };
};

export const POS_FEATURES_CONTENT: Record<Lang, PosFeaturesContent> = {
  en: {
    hero: {
      eyebrow: "Restaurant POS that fits the way you work",
      title: "Take orders clearly. Keep service moving.",
      result: "One place for your floor, kitchen and checkout — in English and Chinese.",
      body: "Start with the Core POS, then add only the tools that help your restaurant today.",
      corePriceLabel: "Core POS",
      addOnPriceLabel: "Optional add-ons",
    },
    workflow: [
      { title: "Order at the table", body: "Guests scan a table QR code to order, or your team takes the order for them." },
      { title: "Choose the right control", body: "You can set table QR ordering to wait for optional staff approval before it reaches the kitchen." },
      { title: "Keep the kitchen in step", body: "Orders and changes appear on the kitchen screen, so the team can work from the same list." },
      { title: "Finish with confidence", body: "Your front-of-house team can see progress, take payment and review the day without chasing paper tickets." },
    ],
    core: {
      eyebrow: "Included with Core POS",
      title: "The everyday tools your service needs",
      cards: [
        { title: "English and Chinese side by side", body: "Use a bilingual screen for the floor and kitchen. If a translation is missing, the original wording stays visible instead of hiding the item." },
        { title: "Keep taking orders during an outage", body: "Offline backup helps your team keep working when the internet drops, then reconnect when it is available again." },
        { title: "Menus that match the way you sell", body: "Build menu sections, choices and options so staff can take the order the customer actually asked for." },
        { title: "Mark items sold out yourself", body: "Turn an item off manually when it is unavailable, so it no longer appears as something customers can order." },
      ],
    },
    addOns: {
      scheduling: { outcome: "See staff availability before you build the rota.", title: "Rota and clock-in", body: "Plan shifts and let the team record their working time." },
      reservations: { outcome: "Know who is arriving before the table is needed.", title: "Reservations", body: "Keep bookings, notes and table plans together." },
      reviews: { outcome: "Spot what guests are saying without hunting through every site.", title: "Customer reviews", body: "Bring review feedback into one place for your team to read." },
      food_safety: { outcome: "Make daily food-safety checks easier to follow.", title: "Food-safety records", body: "Keep routine checks and records in the system." },
      allergens: { outcome: "Give staff a clearer starting point for allergen questions.", title: "Allergen recognition", body: "Show the allergen information recorded against your menu items." },
      recipe_costing: { outcome: "See a clearer estimate of what each dish costs.", title: "Recipe costing", body: "Build recipes from ingredients and use them to understand menu costs." },
      custom_domain: { outcome: "Give direct customers an own web address to remember.", title: "Custom domain", body: "Use your own web address for your ShopOps ordering page." },
      signage: { outcome: "Keep advertising content visible where customers are waiting.", title: "Advertising screen", body: "Show your chosen advertising content on a restaurant screen." },
      delivery: { outcome: "Take direct delivery orders alongside your restaurant orders.", title: "Online delivery orders", body: "Receive delivery orders in the same working flow as your in-house orders." },
      finance_inventory: { outcome: "See stock and money information in one clearer view.", title: "Finance and inventory", body: "Keep purchase, stock and restaurant figures together for staff to review." },
    },
    delivery: {
      eyebrow: "For direct delivery orders",
      title: "A simple way to collect delivery orders",
      body: "Let customers place direct delivery orders through your own ShopOps page, alongside the orders your staff take in the restaurant.",
      cashOnly: "Delivery orders are for cash collection. ShopOps does not accept online payment.",
      cardBoundary: "Card processing is separate from ShopOps and is not included in this delivery flow.",
      onlinePaymentBoundary: "ShopOps does not accept online payment or collect card details for these orders.",
      staffApproval: "Your team can review an order before preparing it when that suits your service.",
    },
    finance: {
      eyebrow: "For a clearer back office",
      title: "Keep the numbers and stock closer together",
      body: "Record purchases and stock movements, then give your team a clearer place to look before making decisions.",
      vatPaidOnPurchases: "Record VAT paid on purchases as part of your own records.",
      profitAndLoss: "Use a Profit and loss view as a straight-line estimate to discuss with your accountant.",
      excelExport: "Export the figures to Excel when you need to share or check them elsewhere.",
      hmrcBoundary: "ShopOps does not submit directly to HMRC or file VAT Returns for you.",
    },
    recipe: {
      eyebrow: "For recipe costs",
      title: "Turn ingredient prices into a useful estimate",
      body: "Add ingredients and quantities to see a straight-line estimate of a dish cost. It is a working guide, not an accountant’s final figure.",
      straightLineEstimate: "Prices and waste can change, so check the estimate against your real purchases.",
      aiDraftBoundary: "AI can make a draft for staff to check; it does not automatically confirm a recipe, allergen detail or cost update.",
    },
    goodToKnow: [
      "Every add-on needs the Core POS plan.",
      "Add-ons are charged per item, so choose only what you need.",
      "No VAT is added while ShopOps is not VAT registered.",
      "Your free trial needs no card and has no automatic charge.",
    ],
    midCta: { title: "Not sure which tools you need?", body: "We can talk through your current service and set up a trial around it.", cta: "Book a demo", reassurance: "No card needed for the free trial" },
    finalCta: { title: "See ShopOps with your own menu", body: "Book a demo and we will help you set up a free trial.", cta: "Book a demo & free trial setup", reassurance: "3-day free trial · no automatic charge" },
    metadata: { title: "Restaurant POS features | ShopOps", description: "See the ShopOps restaurant POS, optional tools and their practical boundaries.", share: "A bilingual restaurant POS for orders, kitchen and checkout." },
  },
  "zh-Hant": {
    hero: {
      eyebrow: "配合餐廳日常的 POS",
      title: "清楚落單，服務更順暢。",
      result: "樓面、廚房和結帳集中一處，中英文都看得明。",
      body: "先用核心 POS，再按餐廳現時需要加選工具。",
      corePriceLabel: "核心 POS",
      addOnPriceLabel: "加購功能",
    },
    workflow: [
      { title: "餐桌落單", body: "客人可掃枱上 QR code 點餐，亦可由員工代為落單。" },
      { title: "按服務需要設定", body: "枱上 QR 點餐可設定為先由員工選擇是否批准，再送到廚房。" },
      { title: "廚房同步處理", body: "訂單和更改會顯示在廚房看板，大家跟同一張清單工作。" },
      { title: "安心完成結帳", body: "樓面可看到進度、收款及查看當日情況，毋須四處找紙單。" },
    ],
    core: {
      eyebrow: "核心 POS 已包括",
      title: "每天開工會用到的工具",
      cards: [
        { title: "中英文並排顯示", body: "樓面和廚房可用雙語畫面。若未有翻譯，會保留原文，不會把菜式名稱隱藏。" },
        { title: "斷網時仍可繼續落單", body: "網絡中斷時有離線後備，網絡回復後再重新連接。" },
        { title: "餐牌和選項跟足餐廳做法", body: "建立餐牌分類、選項和要求，員工可按客人真正想要的方式落單。" },
        { title: "手動標示售罄", body: "食材沒有時可手動關閉菜式，不會繼續顯示為可供客人點選。" },
      ],
    },
    addOns: {
      scheduling: { outcome: "排更前先看清員工可上班時間。", title: "排班打卡", body: "安排更表，並讓團隊記錄工作時間。" },
      reservations: { outcome: "餐桌未要用之前，已知道誰人會到。", title: "訂位", body: "把訂位、備註和枱位安排放在一起。" },
      reviews: { outcome: "不用逐個網站找，也能知道客人怎樣說。", title: "顧客評價", body: "把評價意見集中讓團隊查看。" },
      food_safety: { outcome: "每日食安檢查更容易跟。", title: "食安記錄", body: "保存日常檢查和記錄。" },
      allergens: { outcome: "員工回答過敏原問題時有更清楚的起點。", title: "過敏原辨識", body: "顯示已記錄在餐牌項目的過敏原資料。" },
      recipe_costing: { outcome: "更清楚估算每道菜的成本。", title: "食譜成本", body: "由食材建立食譜，了解餐牌成本。" },
      custom_domain: { outcome: "直接客人可記住自己的網頁地址。", title: "自訂網域", body: "用自己的網頁地址開設 ShopOps 點餐頁。" },
      signage: { outcome: "讓等候中的客人看到廣告內容。", title: "廣告屏", body: "在店內螢幕顯示你選擇的廣告內容。" },
      delivery: { outcome: "外賣送貨訂單可和店內訂單一起處理。", title: "外賣送貨", body: "在同一個工作流程收取直接送貨訂單。" },
      finance_inventory: { outcome: "以較清楚方式查看庫存和金錢資料。", title: "財務及庫存", body: "把採購、庫存和餐廳數字放在一起讓員工查看。" },
    },
    delivery: {
      eyebrow: "給直接外賣送貨訂單",
      title: "簡單收取送貨訂單",
      body: "客人可經你的 ShopOps 網頁直接下送貨訂單，和店內員工接的訂單一起處理。",
      cashOnly: "送貨訂單只收現金。ShopOps 不接受網上付款。",
      cardBoundary: "信用卡處理由 ShopOps 以外安排，這個送貨流程不包括在內。",
      onlinePaymentBoundary: "ShopOps 不接受網上付款，亦不會為這些訂單收集信用卡資料。",
      staffApproval: "如合乎你的服務流程，員工可先查看訂單再開始準備。",
    },
    finance: {
      eyebrow: "較清楚的後台資料",
      title: "把數字和庫存放近一點",
      body: "記錄採購和庫存變動，讓團隊在作決定前有一處可查看。",
      vatPaidOnPurchases: "把採購時已付的 VAT 記錄在自己的資料內。",
      profitAndLoss: "用 Profit and loss 畫面作直線估算，再和會計師討論。",
      excelExport: "需要分享或另行核對時，可匯出到 Excel。",
      hmrcBoundary: "ShopOps 不會直接向 HMRC 提交資料，亦不會代你遞交 VAT Returns。",
    },
    recipe: {
      eyebrow: "食譜成本",
      title: "把食材價錢變成實用估算",
      body: "輸入食材和份量，即可看到一道菜的直線估算成本。這是工作參考，不是會計師的最後數字。",
      straightLineEstimate: "價錢和損耗會變，請用實際採購資料再核對。",
      aiDraftBoundary: "AI 可先做草稿讓員工檢查，不會自動確認食譜、過敏原資料或成本更新。",
    },
    goodToKnow: [
      "每項加購功能都需要核心 POS。",
      "加購功能按每項收費，只選需要的即可。",
      "ShopOps 未登記 VAT 時，不會另收 VAT。",
      "免費試用毋須信用卡，亦不會自動收費。",
    ],
    midCta: { title: "未肯定需要哪些工具？", body: "我們可先了解你的日常流程，再安排合適的試用設定。", cta: "預約示範", reassurance: "免費試用毋須信用卡" },
    finalCta: { title: "用自己的餐牌看看 ShopOps", body: "預約示範，我們會幫你設定免費試用。", cta: "預約示範及免費試用設定", reassurance: "免費試用 3 天 · 不會自動收費" },
    metadata: { title: "餐廳 POS 功能 | ShopOps", description: "查看 ShopOps 餐廳 POS、加購工具和各項實際功能界線。", share: "中英雙語餐廳 POS，處理落單、廚房和結帳。" },
  },
  "zh-Hans": {
    hero: {
      eyebrow: "配合餐厅日常的 POS",
      title: "清楚点餐，服务更顺畅。",
      result: "前厅、厨房和结账集中一处，中英文都看得懂。",
      body: "先用核心 POS，再按餐厅目前需要加选工具。",
      corePriceLabel: "核心 POS",
      addOnPriceLabel: "加购功能",
    },
    workflow: [
      { title: "餐桌点餐", body: "顾客可扫桌上 QR code 点餐，也可由员工代为点餐。" },
      { title: "按服务需要设置", body: "桌上 QR 点餐可设置为先由员工选择是否批准，再送到厨房。" },
      { title: "厨房同步处理", body: "订单和更改会显示在厨房看板，大家按同一张清单工作。" },
      { title: "安心完成结账", body: "前厅可看到进度、收款及查看当天情况，不用到处找纸单。" },
    ],
    core: {
      eyebrow: "核心 POS 已包括",
      title: "每天开工会用到的工具",
      cards: [
        { title: "中英文并排显示", body: "前厅和厨房可用双语画面。如未有翻译，会保留原文，不会把菜名隐藏。" },
        { title: "断网时仍可继续点餐", body: "网络中断时有离线备用，网络恢复后再重新连接。" },
        { title: "菜单和选项跟足餐厅做法", body: "建立菜单分类、选项和要求，员工可按顾客真正想要的方式点餐。" },
        { title: "手动标示售罄", body: "食材没有时可手动关闭菜品，不会继续显示为可供顾客点选。" },
      ],
    },
    addOns: {
      scheduling: { outcome: "排班前先看清员工可上班时间。", title: "排班打卡", body: "安排班表，并让团队记录工作时间。" },
      reservations: { outcome: "餐桌未要用之前，已知道谁会到。", title: "订位", body: "把订位、备注和桌位安排放在一起。" },
      reviews: { outcome: "不用逐个网站找，也能知道顾客怎么说。", title: "顾客评价", body: "把评价意见集中让团队查看。" },
      food_safety: { outcome: "每日食品安全检查更容易跟。", title: "食品安全记录", body: "保存日常检查和记录。" },
      allergens: { outcome: "员工回答过敏原问题时有更清楚的起点。", title: "过敏原识别", body: "显示已记录在菜单项目的过敏原资料。" },
      recipe_costing: { outcome: "更清楚估算每道菜的成本。", title: "食谱成本", body: "由食材建立食谱，了解菜单成本。" },
      custom_domain: { outcome: "直接顾客可记住自己的网页地址。", title: "自定义域名", body: "用自己的网页地址开设 ShopOps 点餐页。" },
      signage: { outcome: "让等候中的顾客看到广告内容。", title: "广告屏", body: "在店内屏幕显示你选择的广告内容。" },
      delivery: { outcome: "外卖配送订单可和店内订单一起处理。", title: "外卖配送", body: "在同一个工作流程收取直接配送订单。" },
      finance_inventory: { outcome: "以较清楚方式查看库存和金钱资料。", title: "财务及库存", body: "把采购、库存和餐厅数字放在一起让员工查看。" },
    },
    delivery: {
      eyebrow: "给直接外卖配送订单",
      title: "简单收取配送订单",
      body: "顾客可通过你的 ShopOps 网页直接下配送订单，和店内员工接的订单一起处理。",
      cashOnly: "配送订单只收现金。ShopOps 不接受在线付款。",
      cardBoundary: "信用卡处理由 ShopOps 以外安排，这个配送流程不包括在内。",
      onlinePaymentBoundary: "ShopOps 不接受在线付款，也不会为这些订单收集信用卡资料。",
      staffApproval: "如符合你的服务流程，员工可先查看订单再开始准备。",
    },
    finance: {
      eyebrow: "较清楚的后台资料",
      title: "把数字和库存放近一点",
      body: "记录采购和库存变动，让团队在作决定前有一处可查看。",
      vatPaidOnPurchases: "把采购时已付的 VAT 记录在自己的资料内。",
      profitAndLoss: "用 Profit and loss 画面作直线估算，再和会计师讨论。",
      excelExport: "需要分享或另外核对时，可导出到 Excel。",
      hmrcBoundary: "ShopOps 不会直接向 HMRC 提交资料，也不会代你递交 VAT Returns。",
    },
    recipe: {
      eyebrow: "食谱成本",
      title: "把食材价钱变成实用估算",
      body: "输入食材和份量，即可看到一道菜的直线估算成本。这是工作参考，不是会计师的最终数字。",
      straightLineEstimate: "价钱和损耗会变，请用实际采购资料再核对。",
      aiDraftBoundary: "AI 可先做草稿让员工检查，不会自动确认食谱、过敏原资料或成本更新。",
    },
    goodToKnow: [
      "每项加购功能都需要核心 POS。",
      "加购功能按每项收费，只选需要的即可。",
      "ShopOps 未登记 VAT 时，不会另收 VAT。",
      "免费试用无需信用卡，也不会自动收费。",
    ],
    midCta: { title: "还不确定需要哪些工具？", body: "我们可先了解你的日常流程，再安排合适的试用设置。", cta: "预约演示", reassurance: "免费试用无需信用卡" },
    finalCta: { title: "用自己的菜单看看 ShopOps", body: "预约演示，我们会帮你设置免费试用。", cta: "预约演示及免费试用设置", reassurance: "免费试用 3 天 · 不会自动收费" },
    metadata: { title: "餐厅 POS 功能 | ShopOps", description: "查看 ShopOps 餐厅 POS、加购工具和各项实际功能界线。", share: "中英双语餐厅 POS，处理点餐、厨房和结账。" },
  },
};

function getAddOnPrice(lang: Lang, id: PosAddOnId) {
  for (const group of POS_CONTENT[lang].pricing.addOnGroups) {
    if (group.items.some((item) => item.id === id)) return group.monthlyPrice;
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
  return getAddOnPrice(lang, "scheduling");
}

export function getPosFeaturePricing(lang: Lang) {
  const core = POS_CONTENT[lang].pricing.core.monthlyPrice;
  const delivery = getAddOnPrice(lang, "delivery");
  const finance = getAddOnPrice(lang, "finance_inventory");
  const recipe = getAddOnPrice(lang, "recipe_costing");

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
