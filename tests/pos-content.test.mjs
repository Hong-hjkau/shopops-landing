import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { POS_CONTENT } from "../lib/pos-content.ts";
import { POS_FEATURES_CONTENT, getPosFeaturePricing } from "../lib/pos-features-content.ts";

const languages = ["en", "zh-Hant", "zh-Hans"];
const forbidden = [
  /systems already running/i,
  /used and refined daily/i,
  /forged in real use/i,
  /not demo ware/i,
  /one price, everything included/i,
  /start free trial/i,
];

test("all languages expose identical shared keys", () => {
  const expected = Object.keys(POS_CONTENT.en).sort();
  for (const lang of languages) {
    assert.deepEqual(Object.keys(POS_CONTENT[lang]).sort(), expected);
  }
});

test("English POS eyebrow uses English-only wording", () => {
  assert.equal(POS_CONTENT.en.hero.eyebrow, "Restaurant POS · English + Chinese");
});

test("POS feature content maps every priced add-on by its stable ID", () => {
  const nineIds = POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.id);
  const nineteenIds = POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.id);

  for (const lang of languages) {
    const content = POS_FEATURES_CONTENT[lang];
    assert.deepEqual(Object.keys(content.addOns).sort(), [...nineIds, ...nineteenIds].sort());
    assert.equal(content.workflow.length, 4);
    assert.match(content.delivery.cashOnly, /cash|現金|现金/i);
    assert.match(content.finance.hmrcBoundary, /HMRC/);
  }
});

test("POS feature content keeps delivery, finance, and AI boundaries in every language", () => {
  const requiredBoundaries = {
    en: [
      /does not accept online payment/i,
      /does not submit directly to HMRC/i,
      /does not automatically confirm/i,
    ],
    "zh-Hant": [
      /不接受網上付款/,
      /不會直接向 HMRC 提交/,
      /不會自動確認/,
    ],
    "zh-Hans": [
      /不接受在线付款/,
      /不会直接向 HMRC 提交/,
      /不会自动确认/,
    ],
  };
  const unsupportedAffirmativeClaims = {
    en: [
      /submits VAT Returns to HMRC/i,
      /staff-only collection/i,
      /automatically confirms/i,
    ],
    "zh-Hant": [
      /ShopOps 會直接向 HMRC 提交/,
      /AI 會自動確認/,
      /只可由員工取貨/,
    ],
    "zh-Hans": [
      /ShopOps 会直接向 HMRC 提交/,
      /AI 会自动确认/,
      /仅限员工取货/,
    ],
  };

  for (const lang of languages) {
    const text = JSON.stringify(POS_FEATURES_CONTENT[lang]);
    for (const boundary of requiredBoundaries[lang]) assert.match(text, boundary);
    for (const claim of unsupportedAffirmativeClaims[lang]) assert.doesNotMatch(text, claim);
  }
});

test("public POS feature copy rejects affirmative online-payment and card-delivery mutants", () => {
  const paymentRules = {
    en: {
      cash: /cash/i,
      card: /\bcards?\b/i,
      negative: /does not accept online payments?/i,
      affirmativePublicClaims: [
        /(?<!does not )\baccepts?\s+(?:online|card)\s+payments?\b/i,
        /(?<!does not )\baccepts?\s+payments?\s+(?:online|by card)\b/i,
        /(?<!does not )\baccepts?\s+cards?\b/i,
        /\b(?:online|card)\s+payments?\s+(?:are|is)\s+(?:accepted|available)\b/i,
        /\bcards?\s+(?:are|is)\s+accepted\b/i,
      ],
      cashAndCardMutant: "We accept cash and card.",
      permittedCheckoutCopy: "Staff can accept payment at checkout.",
      affirmativeMutants: [
        "We accept online payment.",
        "We accept online payments.",
        "ShopOps accepts online payment.",
        "ShopOps accepts online payments.",
        "We accept payment online.",
        "Online payments are accepted.",
        "We accept card payments for delivery.",
        "Card payment is accepted for delivery.",
      ],
    },
    "zh-Hant": {
      cash: /現金/,
      card: /信用卡/,
      negative: /不接受網上付款/,
      affirmativePublicClaims: [
        /(?<!不)接受(?:網上|信用卡)付款/,
        /(?:網上|信用卡)付款(?:可以|可|已)?(?:接受|使用|支援)/,
      ],
      cashAndCardMutant: "接受現金及信用卡付款。",
      affirmativeMutants: [
        "我們接受網上付款。",
        "本系統接受網上付款。",
        "我們接受信用卡付款送貨。",
        "信用卡付款可使用作送貨。",
      ],
    },
    "zh-Hans": {
      cash: /现金/,
      card: /信用卡/,
      negative: /不接受在线付款/,
      affirmativePublicClaims: [
        /(?<!不)接受(?:在线|信用卡)付款/,
        /(?:在线|信用卡)付款(?:可以|可|已)?(?:接受|使用|支持)/,
      ],
      cashAndCardMutant: "接受现金及信用卡付款。",
      affirmativeMutants: [
        "我们接受在线付款。",
        "本系统接受在线付款。",
        "我们接受信用卡付款配送。",
        "信用卡付款可使用作配送。",
      ],
    },
  };

  const assertPublicPaymentBoundaries = (content, rules) => {
    const { delivery } = content;
    assert.match(delivery.cashOnly, rules.cash);
    assert.doesNotMatch(delivery.cashOnly, rules.card);
    assert.match(delivery.onlinePaymentBoundary, rules.negative);
    const publicCopy = JSON.stringify(content);
    for (const affirmative of rules.affirmativePublicClaims) {
      assert.doesNotMatch(publicCopy, affirmative);
    }
  };

  for (const lang of languages) {
    const rules = paymentRules[lang];
    const content = POS_FEATURES_CONTENT[lang];
    assertPublicPaymentBoundaries(content, rules);
    if (rules.permittedCheckoutCopy) {
      assert.doesNotThrow(() => assertPublicPaymentBoundaries({
        ...content,
        hero: { ...content.hero, body: `${content.hero.body} ${rules.permittedCheckoutCopy}` },
      }, rules));
    }
    assert.throws(() => assertPublicPaymentBoundaries({
      ...content,
      delivery: { ...content.delivery, cashOnly: rules.cashAndCardMutant },
    }, rules));
    for (const affirmativeMutant of rules.affirmativeMutants) {
      assert.throws(() => assertPublicPaymentBoundaries({
        ...content,
        hero: { ...content.hero, body: `${content.hero.body} ${affirmativeMutant}` },
      }, rules));
    }
  }
});

test("POS feature pricing derives approved bundle examples from canonical pricing IDs", () => {
  for (const lang of languages) {
    const prices = getPosFeaturePricing(lang);
    assert.equal(prices.corePlusDelivery, 38);
    assert.equal(prices.corePlusFinance, 38);
    assert.equal(prices.corePlusFinanceAndRecipe, 47);
  }
});

test("POS feature pricing looks up delivery, finance, and recipe prices by their own stable IDs", () => {
  const pricing = POS_CONTENT.en.pricing;
  const originalGroups = pricing.addOnGroups;
  const [ninePoundGroup, nineteenPoundGroup] = originalGroups;
  const delivery = nineteenPoundGroup.items.find((item) => item.id === "delivery");
  const finance = nineteenPoundGroup.items.find((item) => item.id === "finance_inventory");
  assert.ok(delivery);
  assert.ok(finance);

  try {
    pricing.addOnGroups = [
      { monthlyPrice: 29, items: [finance] },
      { monthlyPrice: 13, items: ninePoundGroup.items },
      { monthlyPrice: 23, items: [delivery] },
    ];

    const prices = getPosFeaturePricing("en");
    assert.equal(prices.delivery, 23);
    assert.equal(prices.finance, 29);
    assert.equal(prices.recipe, 13);
    assert.equal(prices.corePlusDelivery, 42);
    assert.equal(prices.corePlusFinance, 48);
    assert.equal(prices.corePlusFinanceAndRecipe, 61);
  } finally {
    pricing.addOnGroups = originalGroups;
  }
});

test("POS public pricing exposes the approved core plan, add-ons, and VAT status in every language", () => {
  for (const lang of languages) {
    const pricing = POS_CONTENT[lang].pricing;
    assert.equal(pricing.core.monthlyPrice, 19);
    assert.equal(pricing.core.included.length, 3);
    assert.deepEqual(pricing.addOnGroups.map((group) => group.monthlyPrice), [9, 19]);
    assert.equal(pricing.addOnGroups[0].items.length, 8);
    assert.equal(pricing.addOnGroups[1].items.length, 2);
    assert.match(pricing.perItemLabel, /Each add-on|每項功能|每项功能/);
    assert.match(pricing.vatNote, /No VAT added|不另收 VAT/);
    assert.doesNotMatch(JSON.stringify(pricing), /call pop-up|來電彈屏|来电弹屏/i);
    assert.doesNotMatch(pricing.vatNote, /\+ VAT|excluding VAT|未包 VAT|VAT free|VAT exempt/i);
  }

  assert.deepEqual(POS_CONTENT.en.pricing.core.included, [
    "Ordering POS",
    "Front-of-house and kitchen translation",
    "Discounts",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.id), [
    "scheduling", "reservations", "reviews", "food_safety",
    "allergens", "recipe_costing", "custom_domain", "signage",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.label), [
    "Rota and clock-in", "Reservations", "Customer reviews", "Food-safety records",
    "Allergen recognition", "Recipe costing", "Custom domain", "Advertising screen",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.id), [
    "delivery", "finance_inventory",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.label), [
    "Online delivery orders", "Finance and inventory",
  ]);
  assert.equal(POS_CONTENT.en.pricing.vatNote, "No VAT added. ShopOps is not currently VAT registered, so the price shown is the total monthly subscription price.");

  assert.deepEqual(POS_CONTENT["zh-Hant"].pricing.core.included, [
    "落單 POS", "店房翻譯", "優惠折扣",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hant"].pricing.addOnGroups[0].items.map((item) => item.id), [
    "scheduling", "reservations", "reviews", "food_safety",
    "allergens", "recipe_costing", "custom_domain", "signage",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hant"].pricing.addOnGroups[0].items.map((item) => item.label), [
    "排班打卡", "訂位", "顧客評價", "食安記錄",
    "過敏原辨識", "食譜成本", "自訂網域", "廣告屏",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hant"].pricing.addOnGroups[1].items.map((item) => item.id), [
    "delivery", "finance_inventory",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hant"].pricing.addOnGroups[1].items.map((item) => item.label), [
    "外賣送貨", "財務及庫存",
  ]);
  assert.equal(POS_CONTENT["zh-Hant"].pricing.vatNote, "不另收 VAT。ShopOps 目前未登記 VAT，所示價格就是現時每月實際收費。");

  assert.deepEqual(POS_CONTENT["zh-Hans"].pricing.core.included, [
    "点餐 POS", "前厅与厨房翻译", "优惠折扣",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hans"].pricing.addOnGroups[0].items.map((item) => item.id), [
    "scheduling", "reservations", "reviews", "food_safety",
    "allergens", "recipe_costing", "custom_domain", "signage",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hans"].pricing.addOnGroups[0].items.map((item) => item.label), [
    "排班打卡", "订位", "顾客评价", "食品安全记录",
    "过敏原识别", "食谱成本", "自定义域名", "广告屏",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hans"].pricing.addOnGroups[1].items.map((item) => item.id), [
    "delivery", "finance_inventory",
  ]);
  assert.deepEqual(POS_CONTENT["zh-Hans"].pricing.addOnGroups[1].items.map((item) => item.label), [
    "外卖配送", "财务及库存",
  ]);
  assert.equal(POS_CONTENT["zh-Hans"].pricing.vatNote, "不另收 VAT。ShopOps 目前未登记 VAT，所示价格就是目前每月实际收费。");

  assert.equal(
    POS_CONTENT.en.pricing.addOnsBillingNote,
    "Choose any add-on individually. Each item is charged separately.",
  );
  assert.equal(
    POS_CONTENT["zh-Hant"].pricing.addOnsBillingNote,
    "各項獨立收費，可任選一項或多項。",
  );
  assert.equal(
    POS_CONTENT["zh-Hans"].pricing.addOnsBillingNote,
    "各项独立收费，可任选一项或多项。",
  );
});

test("POS uses its dedicated pricing section without changing the shared Rota card", () => {
  const pos = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  const rota = readFileSync(new URL("../components/RotaLanding.tsx", import.meta.url), "utf8");
  const section = readFileSync(new URL("../components/PosPricingSection.tsx", import.meta.url), "utf8");

  assert.match(pos, /import PosPricingSection from "@\/components\/PosPricingSection"/);
  assert.match(pos, /<PosPricingSection copy=\{pos\.pricing\} trial=\{pos\.trial\.title\} \/>/);
  assert.doesNotMatch(pos, /<PricingCard/);
  assert.match(rota, /import PricingCard from "@\/components\/PricingCard"/);
  assert.match(rota, /<PricingCard pricing=\{t\.pricing\} \/>/);
  assert.match(section, /id="pricing"/);
  assert.match(section, /copy\.addOnGroups\.map/);
  assert.match(section, /copy\.perItemLabel/);
  assert.match(section, /copy\.addOnsBillingNote/);
  assert.match(section, /£\{group\.monthlyPrice\}/);
  assert.match(section, /shrink-0/);
  assert.match(section, /group\.items\.map/);
  assert.match(section, /key=\{item\.id\}/);
  const addOnRow = section.match(
    /group\.items\.map\(\(item\) => \(\s*(<li[\s\S]*?<\/li>)\s*\)\)/,
  );
  assert.ok(addOnRow, "each add-on group should render a list-item template");
  assert.match(
    addOnRow[1],
    /<span className="flex min-w-0 items-start gap-3">[\s\S]*?<span>\{item\.label\}<\/span>[\s\S]*?<\/span>\s*<span className="shrink-0 font-semibold text-text">\s*£\{group\.monthlyPrice\}\s*<span className="font-medium text-text-secondary">\{copy\.monthlyUnit\}<\/span>/,
  );
  assert.match(section, /\{trial\}/);
  assert.match(section, /href="#contact"/);
});

test("all languages preserve the approved trial and first-payment offer", () => {
  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].trialDays, 3);
    assert.equal(POS_CONTENT[lang].trialNeedsCard, false);
    assert.equal(POS_CONTENT[lang].trialAutoCharges, false);
  }

  const source = readFileSync(new URL("../lib/pos-content.ts", import.meta.url), "utf8");
  assert.match(source, /first monthly payment is charged on the day you activate/i);
  assert.match(source, /single payment covers your first two months/i);
  assert.match(source, /正式啟用當日收取首期月費/);
  assert.match(source, /首期只收 1 個月費用，即可使用首 2 個月/);
  assert.match(source, /正式启用当日收取首期月费/);
  assert.match(source, /首期只收 1 个月费用，即可使用前 2 个月/);
  assert.doesNotMatch(
    source,
    /first 30 days are free|day 31|首 30 天免費|第 31 天|首 30 天免费/i,
  );
});

test("shared offer copy is built from one canonical term set", () => {
  const source = readFileSync(new URL("../lib/pos-content.ts", import.meta.url), "utf8");
  assert.match(source, /const OFFER_TERMS = \{/);
  assert.equal((source.match(/\.\.\.OFFER_TERMS/g) ?? []).length, 3);
});

test("all languages state the separately sold preconfigured receipt-printer setup", () => {
  assert.match(POS_CONTENT.en.hardware.readyHardwareCopy, /Receipt printers/i);
  assert.match(POS_CONTENT["zh-Hant"].hardware.readyHardwareCopy, /收據打印機/);
  assert.match(POS_CONTENT["zh-Hans"].hardware.readyHardwareCopy, /小票打印机/);
  for (const lang of languages) {
    const hardware = POS_CONTENT[lang].hardware.readyHardwareCopy;
    assert.match(hardware, /separately|另外|另行/);
    assert.match(hardware, /configur|設定|设置/);
    assert.match(hardware, /Wi-Fi/);
  }
});

test("shared copy contains no prohibited claim", () => {
  const text = JSON.stringify(POS_CONTENT);
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern);
});

test("POS FAQ uses the shared pricing and direct-order commission facts", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  assert.match(page, /<PosPricingSection copy=\{pos\.pricing\} trial=\{pos\.trial\.title\} \/>/);
  assert.match(page, /pos\.commission\.body/);
  assert.doesNotMatch(page, /ShopOps is one flat monthly fee with zero commission/);
});

test("POS contact has no shadow offer copy outside the shared content", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  for (const pattern of [
    /free 3-day trial/i,
    /first 30 days are free/i,
    /免費試用 3 天/,
    /首 30 天免費/,
    /免费试用 3 天/,
    /首 30 天免费/,
  ]) {
    assert.doesNotMatch(page, pattern);
  }
  assert.match(page, /pos\.trial\.steps\[3\]\.detail/);
  assert.match(page, /reassure: pos\.hero\.reassurance/);
});

test("POS page follows the approved factual product journey", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  const requiredOrder = [
    "<PosHero",
    "<PosWorkflow",
    'id="order-journey"',
    'id="restaurant-scenarios"',
    '<PosFeatureGrid lang={lang} id="core-features"',
    'id="bilingual"',
    "<HardwareOptions",
    'id="optional-modules"',
    "<SavingsCalculator",
    "<TrialJourney",
    "<PosPricingSection",
    "<Faq",
    "<ContactSection",
  ];

  let previousIndex = -1;
  for (const token of requiredOrder) {
    const index = page.indexOf(token);
    assert.ok(index >= 0, `POS page should include ${token}`);
    assert.ok(index > previousIndex, `${token} should follow the previous POS section`);
    previousIndex = index;
  }
});

test("POS FAQ and FAQ schema retain the complete six-step trial timeline", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  assert.match(page, /const trialAnswer = pos\.trial\.steps\.map\(\(step\) => step\.detail\)\.join\(" "\);/);
  assert.match(page, /const englishTrialAnswer = POS_CONTENT\.en\.trial\.steps\.map\(\(step\) => step\.detail\)\.join\(" "\);/);
  assert.match(page, /a: trialAnswer/);
  assert.match(page, /a: englishTrialAnswer/);
});

test("POS core features and commission FAQ keep the approved capability and fee boundaries", () => {
  const features = readFileSync(new URL("../components/PosFeatureGrid.tsx", import.meta.url), "utf8");
  for (const token of [
    'title: "QR and staff ordering"',
    'title: "Kitchen screen"',
    'title: "Dine-in, takeaway and pre-orders"',
    'title: "Checkout controls"',
    'title: "Offline backup"',
    'title: "Menu and availability"',
  ]) assert.ok(features.includes(token), `core features should include ${token}`);

  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  assert.match(page, /providerFeesA/);
  assert.match(page, /pos\.commission\.body\} \$\{pos\.commission\.disclaimer\} \$\{t\.faq\.providerFeesA\}/);
  assert.match(page, /the same order in Chinese/);
  assert.match(page, /同一張訂單/);
  assert.match(page, /同一张订单/);
});

test("POS surface avoids unproven, absolute, and competitor-specific claims", () => {
  const files = [
    "../components/PosLanding.tsx",
    "../components/PosFeatureGrid.tsx",
    "../components/SavingsCalculator.tsx",
    "../components/PricingCard.tsx",
  ];
  const prohibited = [
    /every order/i,
    /one price, everything included/i,
    /all in, no contract/i,
    /typical POS/i,
    /most POS/i,
    /automatically sync/i,
    /Deliveroo.*25–35%/i,
    /Uber Eats.*25–35%/i,
    /Just Eat.*14–17%/i,
  ];

  for (const file of files) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    for (const pattern of prohibited) assert.doesNotMatch(source, pattern, file);
  }

  const calculator = readFileSync(new URL("../components/SavingsCalculator.tsx", import.meta.url), "utf8");
  assert.match(calculator, /actual platform fees depend on each contract/i);
  assert.match(calculator, /Card-processing fees remain separate/i);
});

test("all languages keep the approved workflow, trial, and existing-device scope", () => {
  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].workflow.steps.length, 4);
    assert.equal(POS_CONTENT[lang].trial.steps.length, 6);

    const existingDevices = POS_CONTENT[lang].hardware.existingDeviceCopy;
    const supportedDevices = {
      en: ["iPad", "Android", "computer", "phone"],
      "zh-Hant": ["iPad", "Android", "電腦", "手機"],
      "zh-Hans": ["iPad", "Android", "电脑", "手机"],
    }[lang];
    for (const device of supportedDevices) assert.match(existingDevices, new RegExp(device, "i"));
  }
});

test("workflow renders the four approved POS demo screenshots in journey order", () => {
  const workflow = readFileSync(
    new URL("../components/PosWorkflow.tsx", import.meta.url),
    "utf8",
  );

  const approvedAssets = [
    ["orderEntry", "order-entry.webp"],
    ["kitchenOrder", "kitchen-order.webp"],
    ["floorProgress", "floor-progress.webp"],
    ["checkoutReport", "checkout-report.webp"],
  ];

  for (const [name, file] of approvedAssets) {
    assert.match(
      workflow,
      new RegExp(`import ${name} from "@/public/pos-demo/${file}";`),
    );
  }

  assert.match(workflow, /const WORKFLOW_IMAGES = \[orderEntry, kitchenOrder, floorProgress, checkoutReport\] as const;/);
  assert.match(workflow, /copy\.steps\.map\(\(step, index\) => \(\s*[\s\S]*?src=\{WORKFLOW_IMAGES\[index\]\}/);
  assert.match(workflow, /id="workflow"/);

  const register = readFileSync(
    new URL("../docs/pos-demo-screenshot-register.md", import.meta.url),
    "utf8",
  );
  for (const file of [
    "order-entry.webp",
    "kitchen-order.webp",
    "floor-progress.webp",
    "checkout-report.webp",
  ]) {
    assert.match(register, new RegExp(`\\| \`${file}\` [^\\n]*\\| EN \\|`));
  }
  assert.match(register, /4 source stages = 4 English assets, zero gap/i);
});

test("homepage assembles the POS journey before secondary offerings and contact", () => {
  const home = readFileSync(
    new URL("../components/CompanyHome.tsx", import.meta.url),
    "utf8",
  );
  const requiredOrder = [
    "<PosHero",
    "<PosWorkflow",
    "<PosBenefits",
    'id="core-features"',
    'id="bilingual"',
    "<HardwareOptions",
    "<TrialJourney",
    'id="secondary-offerings"',
    "<ContactSection",
  ];

  let previousIndex = -1;
  for (const token of requiredOrder) {
    const index = home.indexOf(token);
    assert.ok(index >= 0, `homepage should include ${token}`);
    assert.ok(index > previousIndex, `${token} should follow the previous homepage section`);
    previousIndex = index;
  }
});

test("shared POS hero uses one seamless responsive artwork with live copy", () => {
  const hero = readFileSync(
    new URL("../components/PosHero.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(
    existsSync(new URL("../public/pos-hero-wide.png", import.meta.url)),
    true,
  );
  assert.match(hero, /src="\/pos-hero-wide\.png"/);
  assert.match(hero, /alt=""/);
  assert.match(hero, /aria-hidden="true"/);
  assert.match(hero, /lg:absolute/);
  assert.match(hero, /lg:grid-cols-2/);
  assert.match(hero, /2xl:object-contain/);
  assert.match(hero, /2xl:object-left/);
  assert.match(hero, /copy\.eyebrow/);
  assert.match(hero, /copy\.title/);
  assert.match(hero, /copy\.subtitle/);
  assert.match(hero, /copy\.cta/);
  assert.match(hero, /copy\.reassurance/);
  assert.doesNotMatch(hero, /src="\/logo\.png"/);
});

test("shared POS hero links all three languages to the owner-situation comic below the main CTA", () => {
  assert.equal(
    POS_CONTENT["zh-Hant"].hero.situationCta,
    "這是你嗎？看看小店老闆每天遇到的情況 →",
  );
  assert.equal(
    POS_CONTENT["zh-Hans"].hero.situationCta,
    "这是你吗？看看小店老板每天遇到的情况 →",
  );
  assert.equal(
    POS_CONTENT.en.hero.situationCta,
    "Is this you? See the daily challenges small restaurant owners face →",
  );
  assert.equal(POS_CONTENT["zh-Hant"].hero.situationHref, "/this-is-you?lang=zh-Hant");
  assert.equal(POS_CONTENT["zh-Hans"].hero.situationHref, "/this-is-you?lang=zh-Hans");
  assert.equal(POS_CONTENT.en.hero.situationHref, "/this-is-you?lang=en");

  const hero = readFileSync(
    new URL("../components/PosHero.tsx", import.meta.url),
    "utf8",
  );
  assert.match(hero, /href=\{copy\.situationHref\}/);

  const mainCtaIndex = hero.indexOf("copy.cta");
  const situationCtaIndex = hero.indexOf("copy.situationCta");
  const reassuranceIndex = hero.indexOf("copy.reassurance");
  assert.ok(mainCtaIndex >= 0);
  assert.ok(situationCtaIndex > mainCtaIndex);
  assert.ok(reassuranceIndex > situationCtaIndex);
});

test("this-is-you opens in the language carried from the homepage", () => {
  const page = readFileSync(
    new URL("../app/this-is-you/page.tsx", import.meta.url),
    "utf8",
  );
  const comic = readFileSync(
    new URL("../app/this-is-you/ComicAd.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /parseQueryLang\(lang\)/);
  assert.match(page, /<ComicAd initialLang=\{initialLang\} \/>/);
  assert.match(comic, /initialLang: Lang/);
  assert.match(comic, /useState<Lang>\(initialLang\)/);
});

test("homepage keeps POS demo enquiries distinct and delays the full nav until wide screens", () => {
  const home = readFileSync(
    new URL("../components/CompanyHome.tsx", import.meta.url),
    "utf8",
  );
  const header = readFileSync(
    new URL("../components/SiteHeader.tsx", import.meta.url),
    "utf8",
  );

  assert.match(home, /<ContactSection copy=\{contact\} source="pos" \/>/);
  assert.match(header, /hidden lg:flex items-center gap-6/);
});

test("homepage preserves the approved dark header palette", () => {
  const header = readFileSync(
    new URL("../components/SiteHeader.tsx", import.meta.url),
    "utf8",
  );

  for (const token of [
    "bg-hero-bg/95",
    "border-hero-border",
    "text-hero-text",
    "text-hero-text-secondary",
    "bg-white/10",
    "focus:ring-accent",
    "focus:ring-offset-hero-bg",
  ]) {
    assert.ok(header.includes(token), `header should use ${token}`);
  }
  assert.doesNotMatch(header, /bg-bg\/80/);
});

test("POS metadata and sharing position the product across the UK", () => {
  const page = readFileSync(new URL("../app/pos/page.tsx", import.meta.url), "utf8");
  const ogImage = readFileSync(
    new URL("../app/pos/opengraph-image.tsx", import.meta.url),
    "utf8",
  );
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

  assert.ok(
    page.includes(
      'const TITLE = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";',
    ),
  );
  assert.ok(
    page.includes(
      '"ShopOps is a bilingual restaurant POS for UK restaurants, with QR ordering, staff POS, a live kitchen screen and offline backup.";',
    ),
  );
  assert.match(page, /const OG_TITLE_EN = TITLE;/);
  assert.match(page, /const OG_DESC_EN = DESCRIPTION;/);
  assert.match(page, /export const metadata: Metadata = \{\s*title: TITLE,\s*description: DESCRIPTION,/);
  assert.match(page, /openGraph: \{\s*title: OG_TITLE_EN,\s*description: OG_DESC_EN,/);
  assert.match(page, /twitter: \{\s*card: "summary_large_image",\s*title: OG_TITLE_EN,\s*description: OG_DESC_EN,/);
  for (const phrase of [
    "bilingual restaurant POS",
    "QR ordering",
    "staff POS",
    "kitchen screen",
    "offline backup",
  ]) {
    assert.match(page, new RegExp(phrase, "i"));
  }
  assert.match(page, /alternates: \{ canonical: "\/pos" \}/);
  assert.ok(
    page.includes(
      'areaServed: { "@type": "Country", name: "United Kingdom" }',
    ),
  );
  assert.ok(
    page.includes('JSON.stringify(jsonLd).replace(/</g, "\\\\u003c")'),
  );
  assert.doesNotMatch(page, /Edinburgh/i);

  assert.match(ogImage, /renderOgImage/);
  assert.ok(
    ogImage.includes(
      'export const alt = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";',
    ),
  );
  assert.match(ogImage, /UK restaurants/i);
  for (const phrase of [
    "Bilingual POS",
    "QR ordering",
    "Staff POS",
    "Kitchen screen",
    "Offline backup",
  ]) {
    assert.match(ogImage, new RegExp(phrase, "i"));
  }
  assert.doesNotMatch(ogImage, /Edinburgh/i);

  assert.match(readme, /across the (?:UK|United Kingdom)|UK-wide/i);
  assert.match(readme, /based in Edinburgh|基地位於 Edinburgh/i);
  assert.match(readme, /npm run test:content/);
  assert.match(readme, /npm run verify/);
});

test("homepage places the approved three-language FAQ before contact", () => {
  const home = readFileSync(
    new URL("../components/CompanyHome.tsx", import.meta.url),
    "utf8",
  );
  const secondaryIndex = home.indexOf('id="secondary-offerings"');
  const faqIndex = home.indexOf("<Faq");
  const contactIndex = home.indexOf("<ContactSection");

  assert.ok(secondaryIndex >= 0 && faqIndex > secondaryIndex && contactIndex > faqIndex);
  assert.equal((home.match(/faq: \{/g) ?? []).length, 3);
  assert.match(home, /<Faq title=\{t\.faq\.title\} items=\{faqItems\} \/>/);
  assert.doesNotMatch(home, /schemaItems=\{dict\.en\.faq\.items\}/);
  for (const token of [
    "a: pos.trial.steps[3].detail",
    "pos.trial.steps[4].detail",
    "pos.trial.steps[5].detail",
    "pos.hardware.existingDeviceCopy",
    "pos.hardware.readyHardwareCopy",
    "pos.trial.steps[1].detail",
    "pos.trial.steps[2].detail",
  ]) {
    assert.ok(home.includes(token), `FAQ should use the shared POS fact ${token}`);
  }
});

test("Rota pricing avoids unsupported bundle and trial CTA claims", () => {
  const rota = readFileSync(
    new URL("../components/RotaLanding.tsx", import.meta.url),
    "utf8",
  );
  const pricingBlocks = [...rota.matchAll(/pricing: \{([\s\S]*?)\n    \},\n    faq:/g)];
  assert.equal(pricingBlocks.length, 3);
  const pricingCopy = pricingBlocks.map((match) => match[1]).join("\n");

  const approvedByLanguage = [
    [
      'title: "清晰月費方案"',
      'subtitle: "留下資料，我們會按你的業務需要說明方案及報價。"',
      'cta: "查詢 Rota"',
    ],
    [
      'title: "清晰月费方案"',
      'subtitle: "留下资料，我们会按你的业务需要说明方案及报价。"',
      'cta: "咨询 Rota"',
    ],
    [
      'title: "Straightforward monthly pricing"',
      'subtitle: "Leave your details and we\'ll explain the plan and quote for your business."',
      'cta: "Ask about Rota"',
    ],
  ];
  for (const [index, approvedCopy] of approvedByLanguage.entries()) {
    for (const approved of approvedCopy) {
      assert.ok(
        pricingBlocks[index][1].includes(approved),
        `Rota pricing block ${index + 1} should include ${approved}`,
      );
    }
  }

  for (const unsupported of [
    /title: "One price, everything included"/i,
    /cta: "Start free trial"/i,
    /title: "一個價，全部包"/,
    /cta: "免費試用"/,
    /title: "一个价，全部包"/,
    /cta: "免费试用"/,
    /全包/,
    /無合約/,
    /无合约/,
    /隨時取消/,
    /随时取消/,
    /all in/i,
    /no contract/i,
    /cancel anytime/i,
  ]) {
    assert.doesNotMatch(pricingCopy, unsupported);
  }
});

test("homepage sharing positions the POS across the UK", () => {
  const ogImage = readFileSync(
    new URL("../app/opengraph-image.tsx", import.meta.url),
    "utf8",
  );

  assert.match(ogImage, /return renderOgImage\(\{/);
  assert.match(ogImage, /title: POS_CONTENT\.en\.hero\.title/);
  assert.ok(
    ogImage.includes(
      'eyebrow: "POS FOR UK RESTAURANTS · ENGLISH + 中文"',
    ),
  );
  assert.doesNotMatch(ogImage, /Edinburgh/i);
});

test("this-is-you metadata and comic use neutral shared claims", () => {
  const page = readFileSync(
    new URL("../app/this-is-you/page.tsx", import.meta.url),
    "utf8",
  );
  const comic = readFileSync(
    new URL("../app/this-is-you/ComicAd.tsx", import.meta.url),
    "utf8",
  );

  assert.equal((page.match(/減少重複工作，令營運更清晰/g) ?? []).length, 2);
  assert.doesNotMatch(page, /效率倍增/);
  for (const wiring of [
    'sub: POS_CONTENT["zh-Hant"].hero.reassurance',
    'sub: POS_CONTENT["zh-Hans"].hero.reassurance',
    'sub: POS_CONTENT.en.hero.reassurance',
  ]) {
    assert.ok(comic.includes(wiring), `comic should use ${wiring}`);
  }
  for (const alt of [
    'alt: "小店老闆面對文書、點餐系統、重複工作同資料整理嘅日常情況"',
    'alt: "小店老板面对文书、点餐系统、重复工作和资料整理的日常情况"',
    'alt: "A small business owner dealing with paperwork, ordering systems, repetitive work and scattered information"',
  ]) {
    assert.ok(comic.includes(alt), `comic should include ${alt}`);
  }
  assert.match(comic, /alt=\{t\.alt\}/);
});

test("all public app and component sources avoid exact unsupported claims", () => {
  const collectSourceFiles = (directory) =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const target = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
      if (entry.isDirectory()) return collectSourceFiles(target);
      return entry.isFile() && /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [target] : [];
    });
  const publicFiles = ["../app/", "../components/"].flatMap((directory) =>
    collectSourceFiles(new URL(directory, import.meta.url)),
  );
  const unsupportedNoCommission = /No commission/i;
  const unsupported = [
    /效率倍增/,
    /零抽佣/,
    unsupportedNoCommission,
    /無合約/,
    /无合约/,
    /No contract/i,
  ];
  assert.doesNotMatch(
    "No ShopOps commission for direct orders",
    unsupportedNoCommission,
  );

  for (const file of publicFiles) {
    const source = readFileSync(file, "utf8");
    for (const pattern of unsupported) {
      assert.doesNotMatch(source, pattern, file.pathname);
    }
  }
});

test("homepage FAQ explains suitable food businesses without Edinburgh", () => {
  const home = readFileSync(
    new URL("../components/CompanyHome.tsx", import.meta.url),
    "utf8",
  );

  const approved = [
    [
      'area: "What types of food businesses is ShopOps POS suitable for?"',
      'areaAnswer: "It is suitable for independent food businesses such as market stalls, cafés, small restaurants and takeaway shops. We can learn about your setup during the demo."',
    ],
    [
      'area: "ShopOps POS 適合甚麼類型的餐飲生意？"',
      'areaAnswer: "適合市集攤位、咖啡店、小餐館及外賣店等獨立餐飲生意。我們可以在示範時了解你的營運方式。"',
    ],
    [
      'area: "ShopOps POS 适合什么类型的餐饮生意？"',
      'areaAnswer: "适合市集摊位、咖啡店、小餐馆及外卖店等独立餐饮生意。我们可以在演示时了解你的营运方式。"',
    ],
  ];

  for (const pair of approved) {
    for (const copy of pair) assert.ok(home.includes(copy), copy);
  }
  assert.doesNotMatch(home, /Edinburgh 以外的餐廳可以使用嗎|Edinburgh 以外的餐厅可以使用吗|Can restaurants outside Edinburgh use it/i);
  assert.doesNotMatch(home, /ShopOps POS 為英國獨立餐廳而設。ShopOps 以 Edinburgh 為基地。|ShopOps POS 为英国独立餐厅而设。ShopOps 以 Edinburgh 为基地。|ShopOps POS is for independent UK restaurants. ShopOps is based in Edinburgh./i);
});
