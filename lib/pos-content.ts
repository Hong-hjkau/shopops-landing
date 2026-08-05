import type { Lang } from "./i18n";

type TrialStep = { title: string; detail: string };

export type PosSharedContent = {
  trialDays: 3;
  trialNeedsCard: false;
  trialAutoCharges: false;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    situationCta: string;
    situationHref: string;
    reassurance: string;
  };
  workflow: {
    title: string;
    steps: readonly [string, string, string, string];
  };
  benefits: readonly [string, string, string, string];
  hardware: {
    title: string;
    existingDeviceCopy: string;
    readyHardwareCopy: string;
  };
  trial: {
    title: string;
    steps: readonly TrialStep[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    body: string;
    monthlyUnit: string;
    includedLabel: string;
    perItemLabel: string;
    core: {
      name: string;
      monthlyPrice: 19;
      included: readonly [string, string, string];
    };
    addOnsTitle: string;
    addOnsRequirement: string;
    addOnGroups: readonly [
      {
        monthlyPrice: 9;
        items: readonly [string, string, string, string, string, string, string, string];
      },
      {
        monthlyPrice: 19;
        items: readonly [string, string];
      },
    ];
    cta: string;
    vatNote: string;
    feeNote: string;
  };
  commission: { title: string; body: string; disclaimer: string };
};

const OFFER_TERMS = {
  trialDays: 3,
  trialNeedsCard: false,
  trialAutoCharges: false,
} as const;

export const POS_CONTENT: Record<Lang, PosSharedContent> = {
  en: {
    ...OFFER_TERMS,
    hero: {
      eyebrow: "Restaurant POS · English + Chinese",
      title: "One POS for orders, kitchen and checkout.",
      subtitle:
        "A bilingual restaurant POS for independent UK restaurants — QR ordering, staff ordering, live kitchen screens and offline backup in one system.",
      cta: "Book a demo & free trial setup",
      situationCta: "Is this you? See the daily challenges small restaurant owners face →",
      situationHref: "/this-is-you?lang=en",
      reassurance:
        `${OFFER_TERMS.trialDays}-day free trial · No card needed for the trial · We set up your menu for you`,
    },
    workflow: {
      title: "From order to checkout",
      steps: [
        "Customer QR or staff order",
        "Kitchen receives the order",
        "Front of house tracks progress",
        "Checkout and reporting",
      ],
    },
    benefits: [
      "English and Chinese throughout",
      "No ShopOps commission on direct orders",
      "Offline backup when the internet goes down",
      "Use existing devices or choose ready-to-use hardware",
    ],
    hardware: {
      title: "Use what you already have — or choose a ready-to-use setup",
      existingDeviceCopy:
        "Run ShopOps on your existing iPad, Android tablet, computer or phone. You don’t need to buy new hardware to get started.",
      readyHardwareCopy:
        "Need a complete till setup? Receipt printers and till hardware are also available separately. We configure everything before delivery — simply connect to Wi-Fi when it arrives and start using it.",
    },
    trial: {
      title: "A guided demo, trial and activation",
      steps: [
        { title: "Book a demo", detail: "Choose a time to see how ShopOps could fit your restaurant." },
        { title: "We understand your workflow", detail: "ShopOps first learns how your restaurant takes and manages orders." },
        { title: "We set up your menu", detail: "ShopOps enters your menu and configures the system with you." },
        { title: `Try it for ${OFFER_TERMS.trialDays} days`, detail: "The free trial needs no card and has no automatic charge." },
        { title: "Choose whether to continue", detail: "Only then do you provide full restaurant, contact and payment details." },
        { title: "One monthly payment covers your first two months", detail: "Your first monthly payment is charged on the day you activate; this single payment covers your first two months, after which billing continues monthly." },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "A clear monthly POS plan, with optional add-ons",
      body: "Start with the core POS plan, then add only the extra tools your restaurant needs.",
      monthlyUnit: "/month",
      includedLabel: "Included",
      perItemLabel: "Each add-on",
      core: {
        name: "Core POS",
        monthlyPrice: 19,
        included: ["Ordering POS", "Front-of-house and kitchen translation", "Discounts"],
      },
      addOnsTitle: "Optional add-ons",
      addOnsRequirement: "All add-ons require the Core POS plan.",
      addOnGroups: [
        {
          monthlyPrice: 9,
          items: ["Rota and clock-in", "Reservations", "Customer reviews", "Food-safety records", "Allergen recognition", "Recipe costing", "Custom domain", "Advertising screen"],
        },
        { monthlyPrice: 19, items: ["Takeaway delivery", "Finance and inventory"] },
      ],
      cta: "Book a demo & free trial setup",
      vatNote: "No VAT added. ShopOps is not currently VAT registered, so the price shown is the total monthly subscription price.",
      feeNote: "Card-processing fees remain separate.",
    },
    commission: {
      title: "Direct orders without ShopOps commission",
      body: "No ShopOps commission applies to orders placed through your own ShopOps ordering channels.",
      disclaimer: "Card-processing fees remain separate.",
    },
  },
  "zh-Hant": {
    ...OFFER_TERMS,
    hero: {
      eyebrow: "餐廳 POS · English + 中文",
      title: "落單、廚房、結帳，一套 POS 全部處理。",
      subtitle:
        "為英國獨立餐廳而設的中英雙語 POS，整合 QR 點餐、員工落單、廚房看板及離線後備。",
      cta: "預約示範及免費試用設定",
      situationCta: "這是你嗎？看看小店老闆每天遇到的情況 →",
      situationHref: "/this-is-you?lang=zh-Hant",
      reassurance: `免費試用 ${OFFER_TERMS.trialDays} 天 · 試用毋須信用卡 · 我們會為你輸入餐牌`,
    },
    workflow: {
      title: "由落單到結帳",
      steps: ["客人 QR 或員工落單", "廚房收到訂單", "樓面追蹤進度", "結帳及報表"],
    },
    benefits: [
      "全程支援英文及中文",
      "直接訂單不收 ShopOps 佣金",
      "網絡中斷時有離線後備",
      "可用現有設備，或選擇即用硬件",
    ],
    hardware: {
      title: "用現有設備即可開始，亦可選購設定完成的硬件",
      existingDeviceCopy:
        "ShopOps 可在現有的 iPad、Android 平板、電腦或手機上使用，開始試用毋須購買新硬件。",
      readyHardwareCopy:
        "如果需要完整收銀設備，我們亦可另外提供收銀機及收據打印機。所有設定會在寄出前完成，收到後連接 Wi-Fi 即可使用。",
    },
    trial: {
      title: "由示範到啟用，我們會一步步陪你設定",
      steps: [
        { title: "預約示範", detail: "揀一個時間，看看 ShopOps 如何配合你的餐廳。" },
        { title: "了解餐廳流程", detail: "ShopOps 先了解你的餐廳怎樣處理和管理訂單。" },
        { title: "輸入餐牌及設定", detail: "ShopOps 為你輸入餐牌，並一同完成系統設定。" },
        { title: `免費試用 ${OFFER_TERMS.trialDays} 天`, detail: "試用毋須信用卡，亦不會自動收費。" },
        { title: "決定是否繼續", detail: "只有決定正式使用時，才提交完整餐廳、聯絡及付款資料。" },
        { title: "首期只收 1 個月費用，可使用首 2 個月", detail: "正式啟用當日收取首期月費；首期只收 1 個月費用，即可使用首 2 個月，其後按月收費。" },
      ],
    },
    pricing: {
      eyebrow: "收費",
      title: "清晰 POS 月費，可按需要加購功能",
      body: "先選用核心 POS 套餐，再按餐廳需要加入其他工具。",
      monthlyUnit: "／月",
      includedLabel: "已包括",
      perItemLabel: "每項功能",
      core: {
        name: "核心 POS",
        monthlyPrice: 19,
        included: ["落單 POS", "店房翻譯", "優惠折扣"],
      },
      addOnsTitle: "加購功能",
      addOnsRequirement: "所有加購功能均須配合核心 POS 套餐使用。",
      addOnGroups: [
        {
          monthlyPrice: 9,
          items: ["排班打卡", "訂位", "顧客評價", "食安記錄", "過敏原辨識", "食譜成本", "自訂網域", "廣告屏"],
        },
        { monthlyPrice: 19, items: ["外賣送貨", "財務在庫"] },
      ],
      cta: "預約示範及免費試用設定",
      vatNote: "不另收 VAT。ShopOps 目前未登記 VAT，所示價格就是現時每月實際收費。",
      feeNote: "信用卡付款處理費另計。",
    },
    commission: {
      title: "直接訂單不收 ShopOps 佣金",
      body: "透過你的 ShopOps 點餐渠道落單，ShopOps 不會收取佣金。",
      disclaimer: "信用卡付款處理費另計。",
    },
  },
  "zh-Hans": {
    ...OFFER_TERMS,
    hero: {
      eyebrow: "餐饮 POS · English + 中文",
      title: "点餐、厨房、结账，一套餐饮 POS 全部处理。",
      subtitle:
        "为英国独立餐厅而设的中英双语 POS，整合扫码点餐、员工点餐、厨房看板及离线备用。",
      cta: "预约演示及免费试用设置",
      situationCta: "这是你吗？看看小店老板每天遇到的情况 →",
      situationHref: "/this-is-you?lang=zh-Hans",
      reassurance: `免费试用 ${OFFER_TERMS.trialDays} 天 · 试用无需信用卡 · 我们会为你录入菜单`,
    },
    workflow: {
      title: "从点餐到结账",
      steps: ["顾客扫码或员工点餐", "厨房收到订单", "前厅跟进进度", "结账及报表"],
    },
    benefits: [
      "全程支持英文和中文",
      "直接订单不收 ShopOps 佣金",
      "网络中断时有离线备用",
      "可用现有设备，或选择即用硬件",
    ],
    hardware: {
      title: "可用现有设备开始，也可选购预先设置好的硬件",
      existingDeviceCopy:
        "ShopOps 可在现有的 iPad、Android 平板、电脑或手机上使用，开始试用无需购买新硬件。",
      readyHardwareCopy:
        "如需要完整收银设备，我们亦可另外提供收银机及小票打印机。所有设置会在寄出前完成，收到后连接 Wi-Fi 即可使用。",
    },
    trial: {
      title: "从演示到启用，我们会一步步陪你设置",
      steps: [
        { title: "预约演示", detail: "选择时间，看看 ShopOps 如何配合你的餐厅。" },
        { title: "了解餐厅流程", detail: "ShopOps 先了解你的餐厅怎样处理和管理订单。" },
        { title: "录入菜单及设置", detail: "ShopOps 为你录入菜单，并一同完成系统设置。" },
        { title: `免费试用 ${OFFER_TERMS.trialDays} 天`, detail: "试用无需信用卡，也不会自动收费。" },
        { title: "决定是否继续", detail: "只有决定正式使用时，才提交完整餐厅、联系及付款资料。" },
        { title: "首期只收 1 个月费用，可使用前 2 个月", detail: "正式启用当日收取首期月费；首期只收 1 个月费用，即可使用前 2 个月，之后按月收费。" },
      ],
    },
    pricing: {
      eyebrow: "收费",
      title: "清晰 POS 月费，可按需要加购功能",
      body: "先选用核心 POS 套餐，再按餐厅需要加入其他工具。",
      monthlyUnit: "／月",
      includedLabel: "已包括",
      perItemLabel: "每项功能",
      core: {
        name: "核心 POS",
        monthlyPrice: 19,
        included: ["点餐 POS", "前厅与厨房翻译", "优惠折扣"],
      },
      addOnsTitle: "加购功能",
      addOnsRequirement: "所有加购功能均须配合核心 POS 套餐使用。",
      addOnGroups: [
        {
          monthlyPrice: 9,
          items: ["排班打卡", "订位", "顾客评价", "食品安全记录", "过敏原识别", "食谱成本", "自定义域名", "广告屏"],
        },
        { monthlyPrice: 19, items: ["外卖配送", "财务与库存"] },
      ],
      cta: "预约演示及免费试用设置",
      vatNote: "不另收 VAT。ShopOps 目前未登记 VAT，所示价格就是目前每月实际收费。",
      feeNote: "信用卡付款处理费另计。",
    },
    commission: {
      title: "直接订单不收 ShopOps 佣金",
      body: "通过你的 ShopOps 点餐渠道下单，ShopOps 不会收取佣金。",
      disclaimer: "信用卡付款处理费另计。",
    },
  },
};
