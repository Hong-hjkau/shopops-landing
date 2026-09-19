import type { Lang } from "./i18n";

type TrialStep = { title: string; detail: string };

export type PosAddOnId =
  | "scheduling"
  | "reservations"
  | "reviews"
  | "food_safety"
  | "allergens"
  | "recipe_costing"
  | "custom_domain"
  | "signage"
  | "delivery"
  | "finance_inventory";

export type PosAddOnItem = { id: PosAddOnId; label: string };

export type PosSharedContent = {
  trialDays: 30;
  trialNeedsCard: false;
  trialAutoCharges: false;
  // 正式確認啟用之後嘅免費期。刻意用「月」唔用「日」：2026-08-02 嘅措辭決定
  // （docs/superpowers/specs/2026-08-02-pos-first-payment-wording-design.md）查明
  // 用日數講「第 N 天收費」同「按月收費」永遠對唔齊（2 月得 28 日、7 月得 31 日）。
  // ⚠️ 呢度**唔可以**逐字引用被禁嗰幾句：tests/pos-content.test.mjs 個 guard 係
  // grep 成個檔案，寫喺註解一樣會中招（2026-09-19 實撞）。
  // 免費期跟月結日行，首期月費 = 啟用日 + freeMonthsAfterActivation 個月。
  freeMonthsAfterActivation: 2;
  // 推廣截止日（`YYYY-MM-DD`，UK 日期）。「限時優惠」喺英國要有真實截止日先講得，
  // 所以呢個值要出現喺對外文案，唔可以淨係寫「限時」。
  //
  // ⚠️ 型別刻意係 `string` 唔係 literal：**續期／收檔係正常操作，要改一行就得**。
  // 釘死做 literal 嘅話，改 `OFFER_TERMS.promoEndsOn` 會連爆三個 TS2322，
  // 而個錯誤訊息一個字都唔會提推廣 —— 到期閘就變成清唔走嘅永久紅，
  // 下一個人只會學識繞閘。格式由 test 驗。
  promoEndsOn: string;
  quoteValidityDays: number;
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
      // 推廣前嘅實收標價（= POS `module_prices` 推廣前嘅值），一季後回復標價要靠佢。
      // 舊值 29 係更早期嘅牌價、唔係推廣前實收價，2026-09-19 改價時一併更正。
      // ⚠️ 目前冇任何 component render 呢個值（對外只出現價）——要做劃線對比就要新做 UI。
      originalMonthlyPrice: 19;
      monthlyPrice: 8;
      included: readonly [string, string, string];
    };
    addOnsTitle: string;
    addOnsRequirement: string;
    addOnsBillingNote: string;
    addOnGroups: readonly [
      {
        originalMonthlyPrice: 9;
        monthlyPrice: 4;
        items: readonly [
          PosAddOnItem, PosAddOnItem, PosAddOnItem, PosAddOnItem,
          PosAddOnItem, PosAddOnItem, PosAddOnItem, PosAddOnItem,
        ];
      },
      {
        originalMonthlyPrice: 19;
        monthlyPrice: 8;
        items: readonly [PosAddOnItem, PosAddOnItem];
      },
    ];
    cta: string;
    vatNote: string;
    // 推廣資格同截止日。刻意同 `body`（section 開場白）分開：呢句要喺**每一個**顯示
    // 優惠價嘅地方出現（`/pos` 同 `/pos/features` 都有各自嘅入口），語意上同
    // `vatNote` 平行 —— 都係「睇住個價嗰陣必須同場睇到」嘅聲明。
    promoNote: string;
    // 短版，畀「同一頁第二、第三⋯⋯個顯示價錢嘅 section」用：佢做 `<details>` 個
    // summary，撳開喺原位見全文（唔會跳走）。全文喺一頁出三四次喺手機上好嘈，
    // 但深連結直入嗰啲人又必須摸得到條件 —— inline 展開兩樣都兼顧到。
    promoNoteShort: string;
    feeNote: string;
  };
  commission: { title: string; body: string; disclaimer: string };
};

const OFFER_TERMS = {
  trialDays: 30,
  trialNeedsCard: false,
  trialAutoCharges: false,
  freeMonthsAfterActivation: 2,
  promoEndsOn: "2026-12-31",
  // 報價有效期（日）。對外一定要寫明呢個數 —— 「報價有效期內啟用一樣適用」
  // 呢句存在嘅唯一目的就係答「我夠唔夠資格」，唔講幾多日等於冇答。
  // 同 POS `platform_settings.quote_validity_days`（prod 實際值 30）對齊；
  // 嗰邊改咗呢度要跟，兩個系統唔可以各講一個數。
  quoteValidityDays: 30,
} as const;

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

/**
 * 推廣截止日嘅對外寫法。
 *
 * 由 `OFFER_TERMS.promoEndsOn` 即場計，**唔喺三語各寫一份日期** —— 呢個數字
 * 決定客人夠唔夠資格攞優惠價，三語寫三份就一定有日會分岔。
 * ISO 格式（`2026-12-31`）對英國餐廳老闆嚟講唔係慣用寫法，所以對外唔出 ISO。
 */
/**
 * 首期付款嘅例子月份。由 `freeMonthsAfterActivation` 計 —— 之前月數係內插
 * 但例子寫死「3 月 1 日 → 5 月 1 日」，改成 3 個月就會出
 * 「3 個月後……3 月 1 日啟用，5 月 1 日繳付」自相矛盾。
 */
const EXAMPLE_START_MONTH = 3;
const EXAMPLE_DUE_MONTH = EXAMPLE_START_MONTH + OFFER_TERMS.freeMonthsAfterActivation;
if (EXAMPLE_DUE_MONTH > 12) {
  // 唔 wrap 落下一年：wrap 咗個例子會變「3 月 1 日啟用，1 月 1 日繳付」，
  // 冇講明係第二年，比出 `undefined` 更誤導。同 `formatPromoEnd` 一致，
  // config 打錯就喺 build 大聲炸，唔好靜靜出一句錯嘅例子。
  throw new Error(
    `首期付款例子跨咗年（${EXAMPLE_START_MONTH} 月 + ${OFFER_TERMS.freeMonthsAfterActivation} 個月）。` +
      "改細 EXAMPLE_START_MONTH，或者改寫三語例子講明年份。",
  );
}

function formatPromoEnd(lang: Lang): string {
  const [year, month, day] = OFFER_TERMS.promoEndsOn.split("-").map(Number);
  // ⚠️ 一定要喺呢度驗，唔可以留返畀 test：兩邊嘅 test 都係抄同一份計法去砌
  // expected，所以一個打錯咗嘅日期（`2027-13-31` → 英文出「31 undefined 2027」）
  // 兩邊會夾得返、`verify` 全綠 —— 即係「驗嗰陣攞自己做證據」。
  // 續期打錯數係真會發生嘅事，所以寧願喺 build 就大聲炸。
  const parsed = new Date(`${OFFER_TERMS.promoEndsOn}T00:00:00Z`);
  const roundTrips =
    !Number.isNaN(parsed.getTime()) &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() + 1 === month &&
    parsed.getUTCDate() === day;
  if (!roundTrips) {
    throw new Error(
      `OFFER_TERMS.promoEndsOn 唔係一個真實日期：${OFFER_TERMS.promoEndsOn}（要 YYYY-MM-DD）`,
    );
  }
  return lang === "en"
    ? `${day} ${MONTHS_EN[month - 1]} ${year}`
    : `${year} 年 ${month} 月 ${day} 日`;
}

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
        { title: `Your first ${OFFER_TERMS.freeMonthsAfterActivation} months are free`, detail: `New restaurants pay nothing on activation. Your first monthly payment falls on the same date ${OFFER_TERMS.freeMonthsAfterActivation} months after you activate — activate on 1 ${MONTHS_EN[EXAMPLE_START_MONTH - 1]} and your first payment is due on 1 ${MONTHS_EN[EXAMPLE_DUE_MONTH - 1]}. Where that date does not exist in a month, payment falls on the last day of that month and returns to your usual date afterwards. Billing then continues monthly.` },
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
        originalMonthlyPrice: 19,
        monthlyPrice: 8,
        included: ["Ordering POS", "Front-of-house and kitchen translation", "Discounts"],
      },
      addOnsTitle: "Optional add-ons",
      addOnsRequirement: "All add-ons require the Core POS plan.",
      addOnsBillingNote: "Choose any add-on individually. Each item is charged separately.",
      addOnGroups: [
        {
          originalMonthlyPrice: 9,
          monthlyPrice: 4,
          items: [
            { id: "scheduling", label: "Rota and clock-in" },
            { id: "reservations", label: "Reservations" },
            { id: "reviews", label: "Customer reviews" },
            { id: "food_safety", label: "Food-safety records" },
            { id: "allergens", label: "Allergen recognition" },
            { id: "recipe_costing", label: "Recipe costing" },
            { id: "custom_domain", label: "Custom domain" },
            { id: "signage", label: "Advertising screen" },
          ],
        },
        {
          originalMonthlyPrice: 19,
          monthlyPrice: 8,
          items: [
            { id: "delivery", label: "Online delivery orders" },
            { id: "finance_inventory", label: "Finance and inventory" },
          ],
        },
      ],
      cta: "Book a demo & free trial setup",
      vatNote: "No VAT added. ShopOps is not currently VAT registered, so the price shown is the total monthly subscription price.",
      promoNoteShort: "Promotional pricing — who qualifies and when it ends",
      promoNote: `This promotional pricing and the first ${OFFER_TERMS.freeMonthsAfterActivation} free months are for new restaurants that activate on or before ${formatPromoEnd("en")}. Get a quote during the promotion and it still applies when you activate within the quote's ${OFFER_TERMS.quoteValidityDays}-day validity period. After the promotion, standard pricing applies to new restaurants.`,
      feeNote: "ShopOps can record card payments. Take payment on your own card terminal; your terminal provider's fees remain separate.",
    },
    commission: {
      title: "Direct orders without ShopOps commission",
      body: "No ShopOps commission applies to orders placed through your own ShopOps ordering channels.",
      disclaimer: "ShopOps can record card payments. Take payment on your own card terminal; your terminal provider's fees remain separate.",
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
        { title: `首 ${OFFER_TERMS.freeMonthsAfterActivation} 個月免費`, detail: `新餐廳正式啟用時毋須付款。首期月費於啟用日起 ${OFFER_TERMS.freeMonthsAfterActivation} 個月後的同一日繳付 —— 例如 ${EXAMPLE_START_MONTH} 月 1 日啟用，首期月費於 ${EXAMPLE_DUE_MONTH} 月 1 日繳付。若該月份沒有相同日期，則以該月最後一日為準，其後恢復原本月結日。之後按月收費。` },
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
        originalMonthlyPrice: 19,
        monthlyPrice: 8,
        included: ["落單 POS", "店房翻譯", "優惠折扣"],
      },
      addOnsTitle: "加購功能",
      addOnsRequirement: "所有加購功能均須配合核心 POS 套餐使用。",
      addOnsBillingNote: "各項獨立收費，可任選一項或多項。",
      addOnGroups: [
        {
          originalMonthlyPrice: 9,
          monthlyPrice: 4,
          items: [
            { id: "scheduling", label: "排班打卡" },
            { id: "reservations", label: "訂位" },
            { id: "reviews", label: "顧客評價" },
            { id: "food_safety", label: "食安記錄" },
            { id: "allergens", label: "過敏原辨識" },
            { id: "recipe_costing", label: "食譜成本" },
            { id: "custom_domain", label: "自訂網域" },
            { id: "signage", label: "廣告屏" },
          ],
        },
        {
          originalMonthlyPrice: 19,
          monthlyPrice: 8,
          items: [
            { id: "delivery", label: "網上送貨訂單" },
            { id: "finance_inventory", label: "財務及庫存" },
          ],
        },
      ],
      cta: "預約示範及免費試用設定",
      vatNote: "不另收 VAT。ShopOps 目前未登記 VAT，所示價格就是現時每月實際收費。",
      promoNoteShort: "優惠價 —— 適用資格及截止日",
      promoNote: `優惠價及首 ${OFFER_TERMS.freeMonthsAfterActivation} 個月免費，適用於 ${formatPromoEnd("zh-Hant")} 或之前正式啟用的新餐廳；在推廣期內取得報價的話，只要在報價有效期（${OFFER_TERMS.quoteValidityDays} 天）內啟用，同樣適用。推廣期結束後，新餐廳按標準價收費。`,
      feeNote: "ShopOps 可記錄信用卡付款；實際收款使用餐廳自己的卡機，卡機供應商費用另計。",
    },
    commission: {
      title: "直接訂單不收 ShopOps 佣金",
      body: "透過你的 ShopOps 點餐渠道落單，ShopOps 不會收取佣金。",
      disclaimer: "ShopOps 可記錄信用卡付款；實際收款使用餐廳自己的卡機，卡機供應商費用另計。",
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
        { title: `前 ${OFFER_TERMS.freeMonthsAfterActivation} 个月免费`, detail: `新餐厅正式启用时无需付款。首期月费于启用日起 ${OFFER_TERMS.freeMonthsAfterActivation} 个月后的同一日缴付 —— 例如 ${EXAMPLE_START_MONTH} 月 1 日启用，首期月费于 ${EXAMPLE_DUE_MONTH} 月 1 日缴付。若该月份没有相同日期，则以该月最后一日为准，之后恢复原本月结日。之后按月收费。` },
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
        originalMonthlyPrice: 19,
        monthlyPrice: 8,
        included: ["点餐 POS", "前厅与厨房翻译", "优惠折扣"],
      },
      addOnsTitle: "加购功能",
      addOnsRequirement: "所有加购功能均须配合核心 POS 套餐使用。",
      addOnsBillingNote: "各项独立收费，可任选一项或多项。",
      addOnGroups: [
        {
          originalMonthlyPrice: 9,
          monthlyPrice: 4,
          items: [
            { id: "scheduling", label: "排班打卡" },
            { id: "reservations", label: "订位" },
            { id: "reviews", label: "顾客评价" },
            { id: "food_safety", label: "食品安全记录" },
            { id: "allergens", label: "过敏原识别" },
            { id: "recipe_costing", label: "食谱成本" },
            { id: "custom_domain", label: "自定义域名" },
            { id: "signage", label: "广告屏" },
          ],
        },
        {
          originalMonthlyPrice: 19,
          monthlyPrice: 8,
          items: [
            { id: "delivery", label: "网上送货订单" },
            { id: "finance_inventory", label: "财务及库存" },
          ],
        },
      ],
      cta: "预约演示及免费试用设置",
      vatNote: "不另收 VAT。ShopOps 目前未登记 VAT，所示价格就是目前每月实际收费。",
      promoNoteShort: "优惠价 —— 适用资格及截止日",
      promoNote: `优惠价及前 ${OFFER_TERMS.freeMonthsAfterActivation} 个月免费，适用于 ${formatPromoEnd("zh-Hans")} 或之前正式启用的新餐厅；在推广期内取得报价的话，只要在报价有效期（${OFFER_TERMS.quoteValidityDays} 天）内启用，同样适用。推广期结束后，新餐厅按标准价收费。`,
      feeNote: "ShopOps 可记录银行卡付款；实际收款使用餐厅自己的刷卡机，刷卡机供应商费用另计。",
    },
    commission: {
      title: "直接订单不收 ShopOps 佣金",
      body: "通过你的 ShopOps 点餐渠道下单，ShopOps 不会收取佣金。",
      disclaimer: "ShopOps 可记录银行卡付款；实际收款使用餐厅自己的刷卡机，刷卡机供应商费用另计。",
    },
  },
};
