import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { joinSentences, POS_CONTENT } from "../lib/pos-content.ts";
import * as posFeaturesModule from "../lib/pos-features-content.ts";
const {
  POS_FEATURES_CONTENT,
  POS_FEATURE_PRESENTATION,
  getPosFeaturePricing,
  getPosFeatureAddOn,
  getPosFeatureAddOnPriceText,
  getPosFeatureBundleExamples,
  getPremiumPosFeatureAddOns,
  getStandardPosFeatureAddOns,
} = posFeaturesModule;

const languages = ["en", "zh-Hant", "zh-Hans"];

// 由一個 entry 檔行 repo 內部嘅 import graph，回傳 repo-relative path → source。
// 只跟本地 import（`@/…` 同相對路徑），node_modules 唔理。
//
// 🔑 解析唔到嘅本地 specifier **一定要嘈**，唔可以靜靜跳過：靜靜跳過嘅話，一條
// 摸緊資產嘅 helper 只要用個收唔到嘅 import 形式，就會跌出 closure 之外，而
// 「掃過幾多個檔」呢類 floor 一樣過關 —— 個 contract 表面綠、實際冇守到。
const SOURCE_EXTENSIONS = [".ts", ".tsx"];
// 資產／樣式唔係 source，唔使再向下行。⚠️ 呢份清單同下面「唔准 import 資產」
// 嗰條 assert **要用同一份**：walker 當佢係資產而 assert 又唔理，就正正係一個
// 靜靜繞過 image map 嘅缺口。
const NON_SOURCE_SPECIFIER = /\.(webp|png|jpe?g|svg|gif|ico|css|json)$/i;

// 只捉 import／require 嘅 specifier，唔捉字串。`src="/logo-icon.png"` 係經 public/
// 出街嘅正常寫法（closure 入面 SiteHeader 就係咁），唔應該當違規。
function localAssetImports(source) {
  return [...source.matchAll(/(?:\bfrom|\bimport|\brequire)\s*\(?\s*["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((specifier) => (specifier.startsWith("@/") || specifier.startsWith("."))
      && NON_SOURCE_SPECIFIER.test(specifier));
}

// 唯一准許踩 `public/pos-demo/` 嘅檔。
const IMAGE_MAP = "lib/pos-feature-images.ts";

// 由 source 抽一個 `const <name> = [ … ]` 入面嘅 stable id。搵唔到一定要嘈：
// 靜靜返一個空 array 嘅話，兩個檔都搵唔到都會「相等」，個對照契約就變假綠。
function idsInConst(source, name) {
  const block = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\]`))?.[1];
  assert.ok(block, `${name}: expected an array literal naming screenshot IDs`);
  const ids = [...block.matchAll(/"([\w-]+)"/g)].map((match) => match[1]);
  assert.ok(ids.length > 0, `${name}: should name at least one screenshot`);
  return ids;
}

function collectLocalImportGraph(entry) {
  const root = new URL("../", import.meta.url);

  const normalise = (specifier, fromDir) => {
    const base = specifier.startsWith("@/") ? specifier.slice(2) : `${fromDir}/${specifier}`;
    return base.split("/").reduce((parts, part) => {
      if (part === "..") parts.pop();
      else if (part !== "." && part !== "") parts.push(part);
      return parts;
    }, []).join("/");
  };

  const resolve = (specifier, fromDir) => {
    const path = normalise(specifier, fromDir);
    // `./x.js` 喺 TS 入面指住 `./x.ts`；`./x` 亦可能係一個 folder 嘅 index。
    const stems = [path, path.replace(/\.[cm]?js$/, ""), `${path}/index`];
    const candidates = [path, ...stems.flatMap((stem) => SOURCE_EXTENSIONS.map((ext) => stem + ext))];
    return candidates.find((candidate) => existsSync(new URL(candidate, root)));
  };

  const collected = new Map();
  const queue = [entry];
  while (queue.length > 0) {
    const file = queue.shift();
    if (collected.has(file)) continue;
    const source = readFileSync(new URL(file, root), "utf8");
    collected.set(file, source);
    const fromDir = file.split("/").slice(0, -1).join("/");

    // `from "x"` / `from 'x'` / `import("x")` / `require("x")` / 側效果 `import "x"`。
    for (const match of source.matchAll(/(?:\bfrom|\bimport|\brequire)\s*\(?\s*["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith("@/") && !specifier.startsWith(".")) continue;
      if (NON_SOURCE_SPECIFIER.test(specifier)) continue;
      const resolved = resolve(specifier, fromDir);
      assert.ok(resolved, `${file}: local import "${specifier}" did not resolve — the graph would silently miss it`);
      if (!collected.has(resolved)) queue.push(resolved);
    }
  }
  return collected;
}
const forbidden = [
  /systems already running/i,
  /used and refined daily/i,
  /forged in real use/i,
  /not demo ware/i,
  /one price, everything included/i,
  /start free trial/i,
];

test("verify script generates Next route types before local TypeScript checking", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

  assert.match(pkg.scripts.verify, /next typegen && tsc --noEmit/);
  assert.doesNotMatch(pkg.scripts.verify, /npx tsc/);
});

test("all languages expose identical shared keys", () => {
  const expected = Object.keys(POS_CONTENT.en).sort();
  for (const lang of languages) {
    assert.deepEqual(Object.keys(POS_CONTENT[lang]).sort(), expected);
  }
});

test("English POS eyebrow uses English-only wording", () => {
  assert.equal(POS_CONTENT.en.hero.eyebrow, "Restaurant POS · English + Chinese");
});

test("POS feature demo CTA does not promise a fixed 15-minute duration", () => {
  assert.equal(POS_FEATURES_CONTENT.en.midCta.cta, "Book a demo");
  assert.equal(POS_FEATURES_CONTENT["zh-Hant"].midCta.cta, "預約示範");
  assert.equal(POS_FEATURES_CONTENT["zh-Hans"].midCta.cta, "预约演示");
});

test("POS feature add-on price labels distinguish selectable and advanced operations in every language", () => {
  const expectedLabels = {
    en: {
      standard: "Choose-your-own operations tools",
      premium: "Advanced operations (Delivery or finance)",
    },
    "zh-Hant": {
      standard: "自選營運功能",
      premium: "進階營運功能（送貨或財務）",
    },
    "zh-Hans": {
      standard: "自选营运功能",
      premium: "进阶营运功能（配送或财务）",
    },
  };

  for (const [lang, labels] of Object.entries(expectedLabels)) {
    assert.equal(POS_FEATURES_CONTENT[lang].hero.standardAddOnPriceLabel, labels.standard);
    assert.equal(POS_FEATURES_CONTENT[lang].hero.premiumAddOnPriceLabel, labels.premium);
  }
});

test("POS feature content maps every priced add-on by its stable ID", () => {
  const nineIds = POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.id);
  const nineteenIds = POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.id);

  for (const lang of languages) {
    const content = POS_FEATURES_CONTENT[lang];
    assert.deepEqual(Object.keys(content.addOns).sort(), [...nineIds, ...nineteenIds].sort());
    assert.equal(Array.isArray(content.workflow), false);
    assert.equal(content.workflow.stories.length, 4);
    assert.match(content.premium.delivery.boundaries.cashOnly, /cash|現金|现金/i);
    assert.match(content.premium.finance_inventory.boundaries.hmrc, /HMRC/);
    for (const description of Object.values(content.addOns)) {
      assert.equal("title" in description, false, "add-on labels must come only from POS_CONTENT");
    }
    assert.equal("reassurance" in content.hero, false);
    assert.equal("reassurance" in content.midCta, false);
    assert.equal("reassurance" in content.finalCta, false);
  }
});

test("POS feature screenshots expose complete localized semantics without asset paths", () => {
  const expectedAdvancedTitles = {
    en: "Advanced operations",
    "zh-Hant": "進階營運功能",
    "zh-Hans": "进阶营运功能",
  };

  for (const lang of languages) {
    const content = POS_FEATURES_CONTENT[lang];
    const descriptions = [
      ...content.workflow.stories,
      ...content.core.cards,
      ...Object.values(content.addOns),
    ];

    assert.equal(descriptions.length, 18);
    assert.equal(content.premiumTitle, expectedAdvancedTitles[lang]);
    assert.equal(typeof content.imageDialogCloseLabel, "string");
    assert.ok(content.imageDialogCloseLabel.trim());

    for (const description of descriptions) {
      assert.equal(typeof description.imageAlt, "string");
      assert.ok(description.imageAlt.trim());
      assert.equal(typeof description.imageActionLabel, "string");
      assert.ok(description.imageActionLabel.trim());
    }

    const localizedContent = JSON.stringify(content);
    assert.doesNotMatch(localizedContent, /(?:public\/)?pos-demo\//);
    assert.doesNotMatch(localizedContent, /\.webp/i);
  }
});

test("POS feature content keeps delivery, finance, and AI boundaries in every language", () => {
  const requiredBoundaries = {
    en: [
      /does not (?:accept|take) online payment/i,
      /does not submit directly to HMRC/i,
      /Nothing is received into stock until a person confirms it/i,
    ],
    "zh-Hant": [
      /不接受網上付款/,
      /不會直接向 HMRC 提交/,
      /員工確認後才會入庫/,
    ],
    "zh-Hans": [
      /不接受在线付款/,
      /不会直接向 HMRC 提交/,
      /员工确认后才会入库/,
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
      negative: /does not (?:accept|take) online payments?/i,
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
    const { boundaries } = content.premium.delivery;
    assert.match(boundaries.cashOnly, rules.cash);
    assert.doesNotMatch(boundaries.cashOnly, rules.card);
    assert.match(boundaries.onlinePayment, rules.negative);
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
      premium: {
        ...content.premium,
        delivery: {
          ...content.premium.delivery,
          boundaries: { ...content.premium.delivery.boundaries, cashOnly: rules.cashAndCardMutant },
        },
      },
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
    // 核心 8 + 進階加購 8 = 16；再加一個標準加購 4 = 20。
    assert.equal(prices.corePlusDelivery, 16);
    assert.equal(prices.corePlusFinance, 16);
    assert.equal(prices.corePlusFinanceAndRecipe, 20);
  }
});

test("POS feature add-on helper returns canonical labels by stable ID", () => {
  assert.equal(typeof getPosFeatureAddOn, "function");
  assert.deepEqual(getPosFeatureAddOn("en", "delivery"), {
    id: "delivery", label: "Online delivery orders", originalMonthlyPrice: 19, monthlyPrice: 8,
  });
  assert.deepEqual(getPosFeatureAddOn("zh-Hant", "delivery"), {
    id: "delivery", label: "網上送貨訂單", originalMonthlyPrice: 19, monthlyPrice: 8,
  });
  assert.deepEqual(getPosFeatureAddOn("zh-Hans", "delivery"), {
    id: "delivery", label: "网上送货订单", originalMonthlyPrice: 19, monthlyPrice: 8,
  });
});

test("POS feature pricing looks up delivery, finance, and recipe prices by their own stable IDs", () => {
  const pricing = POS_CONTENT.en.pricing;
  const originalGroups = pricing.addOnGroups;
  // 用 standard / premium 而唔係用價錢做名：價錢會隨推廣改動，名唔應該跟住過時。
  const [standardGroup, premiumGroup] = originalGroups;
  const delivery = premiumGroup.items.find((item) => item.id === "delivery");
  const finance = premiumGroup.items.find((item) => item.id === "finance_inventory");
  assert.ok(delivery);
  assert.ok(finance);

  try {
    pricing.addOnGroups = [
      { monthlyPrice: 29, items: [finance] },
      { monthlyPrice: 13, items: standardGroup.items },
      { monthlyPrice: 23, items: [delivery] },
    ];

    // 加購價係上面砌嘅假數（驗「按 ID 查價」唔係位置式），core 用真價 8。
    const prices = getPosFeaturePricing("en");
    assert.equal(prices.delivery, 23);
    assert.equal(prices.finance, 29);
    assert.equal(prices.recipe, 13);
    assert.equal(prices.corePlusDelivery, 31);
    assert.equal(prices.corePlusFinance, 37);
    assert.equal(prices.corePlusFinanceAndRecipe, 50);
  } finally {
    pricing.addOnGroups = originalGroups;
  }
});

// 呢條以前叫「POS features route **renders** localized content…」，但 body 由頭到尾
// 只係 existsSync + grep source，一次都冇 render 過。真正嘅 render 行為（route 出唔出到、
// <main lang>、三語連結帶唔帶語言）搬咗去 tests/pos-features-rendered.test.mjs 對真
// output 驗；留喺呢度嘅淨係 source contract：頁面用共享層，唔自己另起一套。
test("POS features page source contract: language and pricing come from the shared layer", () => {
  const root = new URL("../", import.meta.url);
  const pagePath = new URL("app/pos/features/page.tsx", root);
  const landingPath = new URL("components/PosFeaturesLanding.tsx", root);
  const storyPath = new URL("components/PosFeatureStory.tsx", root);
  const addOnPath = new URL("components/PosAddOnCard.tsx", root);
  const premiumPath = new URL("components/PosPremiumFeature.tsx", root);

  for (const path of [pagePath, landingPath, storyPath, addOnPath, premiumPath]) {
    assert.ok(existsSync(path), `${path.pathname} should exist`);
  }

  const page = readFileSync(pagePath, "utf8");
  const landing = readFileSync(landingPath, "utf8");
  const header = readFileSync(new URL("components/SiteHeader.tsx", root), "utf8");

  assert.match(page, /generateMetadata/);
  assert.match(page, /parseQueryLang/);
  assert.match(page, /key=\{requestedLang\}/);
  assert.match(header, /languageHrefs/);
  assert.match(landing, /POS_FEATURES_CONTENT\[lang\]/);
  assert.match(landing, /getPosFeatureAddOnPriceText/);
  assert.match(landing, /getStandardPosFeatureAddOns/);
  assert.match(landing, /getPremiumPosFeatureAddOns/);
  assert.match(landing, /const trialReassurance = POS_CONTENT\[lang\]\.hero\.reassurance/);
});

test("source contract: every page showing the demo screenshots goes through the stable image map", () => {
  const landing = readFileSync(
    new URL("../components/PosFeaturesLanding.tsx", import.meta.url),
    "utf8",
  );
  const imageModule = readFileSync(
    new URL("../lib/pos-feature-images.ts", import.meta.url),
    "utf8",
  );

  assert.match(landing, /import \{ POS_FEATURE_IMAGES/);

  // 整條圖片路徑都要守，唔淨係 landing：dialog / 卡片 component 任何一個直接
  // import 一個 .webp，18 個 id、alt、dialog label 全部照樣過，但每格都會出錯圖。
  // 逐個檔列清單擋唔到「插多一個 helper module 幫手 import」呢種轉手，所以由
  // landing 行 import graph 收 closure —— 新加嘅檔會自動入網。
  // 契約唔可以淨係喺 /pos/features 成立。同一批 demo 截圖亦都出喺 /pos 同首頁
  // （`PosWorkflow`）—— 嗰兩頁自己 import 資產嘅話，換圖只會換到 feature 頁，
  // 另外兩頁靜靜留喺舊圖，而全套 test 一條都唔會紅。所以三個入口行同一條規矩。
  const graphs = new Map([
    "components/PosFeaturesLanding.tsx",
    "app/pos/page.tsx",
    "app/page.tsx",
  ].map((entry) => [entry, collectLocalImportGraph(entry)]));

  // 一個數字 floor 證明唔到「行對咗路」—— 直接點名圖片路徑上每個 component 都
  // 要喺 closure 入面，closure 塌成得返幾個檔就會即刻紅。
  const featureGraph = graphs.get("components/PosFeaturesLanding.tsx");
  for (const required of [
    "components/PosImageDialog.tsx",
    "components/PosFeatureStory.tsx",
    "components/PosAddOnCard.tsx",
    "components/PosPremiumFeature.tsx",
    IMAGE_MAP,
  ]) {
    assert.ok(featureGraph.has(required), `${required} should be inside the feature page's import graph`);
  }

  for (const [entry, pageGraph] of graphs) {
    assert.ok(pageGraph.has(IMAGE_MAP),
      `${entry}: shows demo screenshots, so the image map must be inside its import graph`);
    for (const [file, source] of pageGraph) {
      // 淨係 image map 一個檔可以踩資產；其餘全部要經佢。
      if (file === IMAGE_MAP) continue;
      assert.doesNotMatch(source, /public\/pos-demo/,
        `${file}: must not reach past the image map into the asset folder`);
      assert.deepEqual(localAssetImports(source), [],
        `${file}: bundling an asset here bypasses the image map — go through POS_FEATURE_IMAGES`);
    }
  }

  // 舊版契約係「source 要出現 18 次字面 POS_FEATURE_IMAGES["<id>"]」。咁樣寫逼住
  // 要留住一張逐 id 對照表，入面兩條死 entry 永遠讀唔到都要保留。真正嘅契約係
  // 「頁面寫死嘅每個 image id 都解析得到」—— 加購 id 由 buildDemoImage 直接查，
  // 淨低 workflow / core 八個非加購 id 要對返 map。
  const mapIds = [...imageModule.matchAll(/^\s*"([\w-]+)":\s*\w+,$/gm)].map((match) => match[1]);
  assert.equal(mapIds.length, 18);

  const hardcodedIds = [...landing.matchAll(/^const (\w+ImageIds) = \[/gm)]
    .flatMap((match) => idsInConst(landing, match[1]));
  assert.equal(hardcodedIds.length, 8, "workflow and core each pin four screenshot IDs");
  for (const id of hardcodedIds) {
    assert.ok(mapIds.includes(id), `${id}: named by the page but absent from POS_FEATURE_IMAGES`);
  }
});

// 刪走咗：「POS feature story cards sit below their workflow section heading」。
// 佢個名講標題層級，實際只係 grep 死 PosFeatureStory 入面一串 Tailwind class ——
// 改樣就紅、改壞結構反而唔紅，零行為價值。標題層級由
// tests/pos-features-rendered.test.mjs 對住真 output 驗。

test("the presentation contract covers every priced add-on exactly once", () => {
  const pricedIds = POS_CONTENT.en.pricing.addOnGroups.flatMap((group) => group.items.map((item) => item.id));

  assert.deepEqual(Object.keys(POS_FEATURE_PRESENTATION).sort(), [...pricedIds].sort());
  for (const [id, presentation] of Object.entries(POS_FEATURE_PRESENTATION)) {
    assert.ok(["card", "premium"].includes(presentation.layout), `${id}: unknown layout`);
    assert.equal("bundles" in presentation, presentation.layout === "premium",
      `${id}: only premium panels list bundle examples`);
  }

  // Runtime 版嘅對帳。Compile 期由 PosPremiumFeatureId mapped type 守住，但呢條
  // 令三語其中一語漏咗 panel 文案時，唔使等 tsc 都即刻紅。
  const premiumIds = Object.entries(POS_FEATURE_PRESENTATION)
    .filter(([, presentation]) => presentation.layout === "premium")
    .map(([id]) => id);
  for (const lang of languages) {
    assert.deepEqual(Object.keys(POS_FEATURES_CONTENT[lang].premium).sort(), [...premiumIds].sort(),
      `${lang}: every premium-layout add-on needs its own panel copy`);
  }
});

test("every language ships the same premium bullets and boundary sentences", () => {
  // 定長 tuple 已經釘死每個 panel 幾多粒 bullet，但三語各寫一份 —— 呢條由英文
  // 嗰份做基準逐語對數，令「某一語少咗一粒 / 少咗一句界線」大聲紅，唔使靠肉眼。
  const reference = POS_FEATURES_CONTENT.en.premium;

  for (const lang of languages) {
    const premium = POS_FEATURES_CONTENT[lang].premium;
    for (const [id, panel] of Object.entries(reference)) {
      assert.equal(premium[id].benefits.length, panel.benefits.length,
        `${lang}: ${id} should ship the same number of bullets as English`);
      assert.deepEqual(Object.keys(premium[id].boundaries), Object.keys(panel.boundaries),
        `${lang}: ${id} should ship the same boundary sentences, in the same order`);
      for (const [key, sentence] of Object.entries(premium[id].boundaries)) {
        assert.ok(sentence.trim(), `${lang}: ${id}.${key} should not be blank`);
      }
      for (const [index, bullet] of premium[id].benefits.entries()) {
        assert.ok(bullet.trim(), `${lang}: ${id} bullet ${index} should not be blank`);
      }
    }
  }
});

test("premium bundle examples come from canonical prices instead of a copied figure", () => {
  const [single] = getPosFeatureBundleExamples("en", "delivery");
  assert.equal(single, "Core POS + Online delivery orders: £16/month");

  assert.deepEqual(getPosFeatureBundleExamples("en", "finance_inventory"), [
    "Core POS + Finance and inventory: £16/month",
    "Core POS + Finance and inventory + Recipe costing: £20/month",
  ]);

  const pricing = POS_CONTENT.en.pricing;
  const originalGroups = pricing.addOnGroups;
  try {
    pricing.addOnGroups = [
      { monthlyPrice: 40, items: originalGroups[0].items },
      { monthlyPrice: 19, items: originalGroups[1].items },
    ];
    // 假數：標準層 40、進階層 19，core 用真價 8。
    assert.deepEqual(getPosFeatureBundleExamples("en", "finance_inventory"), [
      "Core POS + Finance and inventory: £27/month",
      "Core POS + Finance and inventory + Recipe costing: £67/month",
    ], "a recipe-costing price change must flow into the finance bundle example");
  } finally {
    pricing.addOnGroups = originalGroups;
  }
});

test("the card and premium split follows the presentation contract, not a hardcoded ID list", () => {
  const original = POS_FEATURE_PRESENTATION.signage;
  const standardBefore = getStandardPosFeatureAddOns("en").map((item) => item.id);
  const premiumBefore = getPremiumPosFeatureAddOns("en").map((item) => item.id);

  assert.ok(standardBefore.includes("signage"));
  assert.deepEqual(premiumBefore, ["delivery", "finance_inventory"]);

  try {
    POS_FEATURE_PRESENTATION.signage = { layout: "premium", bundles: [[]] };
    assert.equal(getStandardPosFeatureAddOns("en").some((item) => item.id === "signage"), false,
      "an add-on promoted to the premium layout must leave the selectable-tools list");
    assert.deepEqual(getPremiumPosFeatureAddOns("en").map((item) => item.id),
      ["signage", "delivery", "finance_inventory"],
      "an add-on promoted to the premium layout must join the advanced-operations list");
  } finally {
    POS_FEATURE_PRESENTATION.signage = original;
  }

  assert.deepEqual(getStandardPosFeatureAddOns("en").map((item) => item.id), standardBefore);
  assert.deepEqual(getPremiumPosFeatureAddOns("en").map((item) => item.id), premiumBefore);
});

test("POS feature standard add-ons keep their own prices when pricing groups are reordered", () => {
  const pricing = POS_CONTENT.en.pricing;
  const originalGroups = pricing.addOnGroups;
  const standardItems = originalGroups[0].items;
  const premiumItems = originalGroups[1].items;

  try {
    pricing.addOnGroups = [
      { monthlyPrice: 29, items: [premiumItems[1]] },
      { monthlyPrice: 13, items: [standardItems[0], standardItems[1]] },
      { monthlyPrice: 17, items: standardItems.slice(2) },
      { monthlyPrice: 23, items: [premiumItems[0]] },
    ];

    // 標準層而家橫跨兩個價，所以 hero 嗰格要出區間，唔可以借第一項嘅 13 做代表。
    assert.equal(getPosFeatureAddOnPriceText("en", "card"), "+£13–£17");
    assert.equal(getPosFeatureAddOnPriceText("en", "premium"), "+£23–£29");
    assert.deepEqual(
      getStandardPosFeatureAddOns("en").map((item) => [item.id, item.monthlyPrice]),
      [
        ["scheduling", 13], ["reservations", 13],
        ["reviews", 17], ["food_safety", 17], ["allergens", 17],
        ["recipe_costing", 17], ["custom_domain", 17], ["signage", 17],
      ],
    );
  } finally {
    pricing.addOnGroups = originalGroups;
  }
});

test("POS feature bundle totals follow the canonical recipe-costing price instead of a copied figure", () => {
  // 之前三語 recipeBoundary 各自寫死 "+£9"：改咗 canonical 價，句子照舊講 £9。
  // 呢條 test 由改價嗰邊落手 —— 衍生嘅總額要跟，文案唔可以有自己一份數字。
  const group = POS_CONTENT.en.pricing.addOnGroups.find((candidate) =>
    candidate.items.some((item) => item.id === "recipe_costing"),
  );
  assert.ok(group, "recipe costing should belong to a pricing group");
  const originalPrice = group.monthlyPrice;
  const core = POS_CONTENT.en.pricing.core.monthlyPrice;
  const finance = getPosFeatureAddOn("en", "finance_inventory").monthlyPrice;

  try {
    group.monthlyPrice = originalPrice + 7;
    assert.equal(getPosFeatureAddOn("en", "recipe_costing").monthlyPrice, originalPrice + 7);
    assert.equal(
      getPosFeaturePricing("en").corePlusFinanceAndRecipe,
      core + finance + originalPrice + 7,
    );

    for (const language of languages) {
      const copy = JSON.stringify(POS_FEATURES_CONTENT[language]);
      assert.doesNotMatch(
        copy,
        new RegExp(`£\\s*${originalPrice}\\b`),
        `${language} copy still carries the old recipe price after it changed`,
      );
    }
  } finally {
    group.monthlyPrice = originalPrice;
  }
});

test("POS homepage exposes two language-preserving links to the feature details", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  const featureGrid = readFileSync(new URL("../components/PosFeatureGrid.tsx", import.meta.url), "utf8");
  const pricing = readFileSync(new URL("../components/PosPricingSection.tsx", import.meta.url), "utf8");
  const blockStart = {
    en: "  en: {",
    "zh-Hant": '  "zh-Hant": {',
    "zh-Hans": '  "zh-Hans": {',
  };
  const languageBlock = (language, nextLanguage) => {
    const start = page.indexOf(blockStart[language]);
    const end = page.indexOf(nextLanguage ? blockStart[nextLanguage] : "\n} as const;", start);
    assert.notEqual(start, -1, `${language} copy block should exist`);
    assert.notEqual(end, -1, `${language} copy block should end before the next block`);
    return page.slice(start, end);
  };
  const languageBlocks = {
    en: languageBlock("en", "zh-Hant"),
    "zh-Hant": languageBlock("zh-Hant", "zh-Hans"),
    "zh-Hans": languageBlock("zh-Hans"),
  };

  assert.equal((languageBlocks.en.match(/viewFeatures: "View all POS features"/g) ?? []).length, 1);
  assert.equal((languageBlocks["zh-Hant"].match(/viewFeatures: "查看所有 POS 功能"/g) ?? []).length, 1);
  assert.equal((languageBlocks["zh-Hans"].match(/viewFeatures: "查看所有 POS 功能"/g) ?? []).length, 1);
  assert.equal(
    (page.match(/detailsHref=\{`\/pos\/features\?lang=\$\{lang\}`\}/g) ?? []).length,
    2,
  );
  assert.equal((page.match(/detailsLabel=\{t\.viewFeatures\}/g) ?? []).length, 2);
  assert.match(featureGrid, /detailsHref: string/);
  assert.match(featureGrid, /detailsLabel: string/);
  assert.match(featureGrid, /<a href=\{detailsHref\}[^>]*>[\s\S]*?\{detailsLabel\}[\s\S]*?<\/a>/);
  assert.match(pricing, /detailsHref: string/);
  assert.match(pricing, /detailsLabel: string/);
  assert.match(pricing, /<a href=\{detailsHref\}[^>]*>[\s\S]*?\{detailsLabel\}[\s\S]*?<\/a>/);
});

test("public homepage links core feature cards to the detailed POS pricing page", () => {
  const companyHome = readFileSync(new URL("../components/CompanyHome.tsx", import.meta.url), "utf8");

  assert.match(companyHome, /View all POS features and pricing/);
  assert.match(companyHome, /查看全部 POS 功能及價格/);
  assert.match(companyHome, /查看全部 POS 功能及价格/);
  assert.match(companyHome, /href={`\/pos\/features\?lang=\${lang}`}/);

  const coreFeaturesStart = companyHome.indexOf('<section id="core-features"');
  const coreFeaturesEnd = companyHome.indexOf("</section>", coreFeaturesStart);
  const coreFeatures = companyHome.slice(coreFeaturesStart, coreFeaturesEnd);
  const cards = coreFeatures.indexOf("<CardGrid items={t.features.items}");
  const entry = coreFeatures.indexOf('href={`/pos/features?lang=${lang}`}');
  assert.ok(coreFeaturesStart !== -1 && coreFeaturesEnd !== -1);
  assert.ok(cards !== -1 && cards < entry);
  assert.match(
    coreFeatures,
    /<a\s+href={`\/pos\/features\?lang=\${lang}`}[^>]*>\s*\{t\.featuresCta\}\s*<\/a>/,
  );
});

test("homepage exposes three language-preserving POS feature and pricing entry points", () => {
  const companyHome = readFileSync(new URL("../components/CompanyHome.tsx", import.meta.url), "utf8");
  const hero = readFileSync(new URL("../components/PosHero.tsx", import.meta.url), "utf8");

  for (const label of ["Features & pricing", "功能及價格", "功能及价格"]) {
    assert.ok(companyHome.includes(label), `homepage should include the exact nav label: ${label}`);
  }
  for (const label of [
    "View all POS features and pricing",
    "查看全部 POS 功能及價格",
    "查看全部 POS 功能及价格",
  ]) {
    assert.ok(companyHome.includes(label), `homepage should include the exact CTA label: ${label}`);
  }

  assert.match(companyHome, /\{ href: "#core-features", label: t\.nav\.features \}/);
  assert.match(
    companyHome,
    /\{ href: `\/pos\/features\?lang=\$\{lang\}`, label: t\.nav\.featuresPricing \}/,
  );
  assert.match(
    companyHome,
    /<PosHero\s+copy=\{pos\.hero\}\s+featureCta=\{\{\s*href: `\/pos\/features\?lang=\$\{lang\}`,\s*label: t\.featuresCta,\s*\}\}\s*\/>/,
  );

  const coreFeaturesStart = companyHome.indexOf('<section id="core-features"');
  const coreFeaturesEnd = companyHome.indexOf("</section>", coreFeaturesStart);
  const coreFeatures = companyHome.slice(coreFeaturesStart, coreFeaturesEnd);
  assert.match(coreFeatures, /href={`\/pos\/features\?lang=\${lang}`}/);

  assert.match(hero, /featureCta\?: \{ href: string; label: string \}/);
  assert.match(hero, /href=\{featureCta\.href\}/);
  assert.match(hero, /\{featureCta\.label\}/);
});

test("homepage Hero keeps the demo CTA primary while feature pricing stacks on mobile", () => {
  const hero = readFileSync(new URL("../components/PosHero.tsx", import.meta.url), "utf8");

  assert.match(hero, /href="#contact"[\s\S]*?\{copy\.cta\}/);
  assert.match(hero, /flex-col[\s\S]*?sm:flex-row/);
  assert.match(hero, /w-full[\s\S]*?sm:w-auto/);
  assert.match(hero, /border[^\n"]*border-hero/);
});

test("shared POS Hero preserves its original single-CTA layout when no feature CTA is supplied", () => {
  const hero = readFileSync(new URL("../components/PosHero.tsx", import.meta.url), "utf8");

  assert.match(hero, /featureCta \? \([\s\S]*?\) : \(\s*<a\s+href="#contact"/);
  assert.match(
    hero,
    /className="glow-accent mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-bold text-on-accent/,
  );
});

test("POS feature details page is included in the public sitemap", () => {
  const sitemap = readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8");

  assert.match(sitemap, /url: `\$\{SITE_URL\}\/pos\/features`/);
});

test("POS card-payment wording keeps the restaurant terminal fee boundary in every language", () => {
  const expected = {
    en: "ShopOps can record card payments. Take payment on your own card terminal; your terminal provider's fees remain separate.",
    "zh-Hant": "ShopOps 可記錄信用卡付款；實際收款使用餐廳自己的卡機，卡機供應商費用另計。",
    "zh-Hans": "ShopOps 可记录银行卡付款；实际收款使用餐厅自己的刷卡机，刷卡机供应商费用另计。",
  };

  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].pricing.feeNote, expected[lang]);
    assert.equal(POS_CONTENT[lang].commission.disclaimer, expected[lang]);
  }
});

test("POS public pricing exposes the approved core plan, add-ons, and VAT status in every language", () => {
  for (const lang of languages) {
    const pricing = POS_CONTENT[lang].pricing;
    // 2026-09-19 推廣價：核心 8、標準加購 4、進階加購 8；original 係推廣前實收價。
    assert.equal(pricing.core.originalMonthlyPrice, 19);
    assert.equal(pricing.core.monthlyPrice, 8);
    assert.equal(pricing.core.included.length, 3);
    assert.deepEqual(pricing.addOnGroups.map((group) => group.originalMonthlyPrice), [9, 19]);
    assert.deepEqual(pricing.addOnGroups.map((group) => group.monthlyPrice), [4, 8]);
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
    "網上送貨訂單", "財務及庫存",
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
    "网上送货订单", "财务及库存",
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
  assert.match(pos, /<PosPricingSection copy=\{pos\.pricing\} trial=\{pos\.trial\.title\} detailsHref=\{`\/pos\/features\?lang=\$\{lang\}`\} detailsLabel=\{t\.viewFeatures\} \/>/);
  assert.doesNotMatch(pos, /<PricingCard/);
  assert.match(rota, /import PricingCard from "@\/components\/PricingCard"/);
  assert.match(rota, /<PricingCard pricing=\{t\.pricing\} \/>/);
  assert.match(section, /id="pricing"/);
  assert.match(section, /copy\.addOnGroups\.map/);
  assert.match(section, /copy\.perItemLabel/);
  assert.match(section, /copy\.addOnsBillingNote/);
  assert.match(section, /currentPrice=\{`\+£\$\{group\.monthlyPrice\}`\}/);
  assert.match(section, /shrink-0/);
  assert.match(section, /group\.items\.map/);
  assert.match(section, /key=\{item\.id\}/);
  const addOnRow = section.match(
    /group\.items\.map\(\(item\) => \(\s*(<li[\s\S]*?<\/li>)\s*\)\)/,
  );
  assert.ok(addOnRow, "each add-on group should render a list-item template");
  assert.match(
    addOnRow[1],
    /<span className="flex min-w-0 items-start gap-3">[\s\S]*?<span>\{item\.label\}<\/span>[\s\S]*?<\/span>\s*<span className="shrink-0 font-semibold text-text">\s*<PosCurrentPrice[\s\S]*?currentPrice=\{`\+£\$\{group\.monthlyPrice\}`\}/,
  );
  assert.match(section, /\{trial\}/);
  assert.match(section, /href="#contact"/);
});

// 中文排版：中文字（含全形標點）之間唔應該有半形空格。
// 🩸 第一版個 class 只寫 `[\u4e00-\u9fff]`（漢字），唔包全形標點 ——
//    而最顯眼嗰個 case 正正就係句號後面：「…付款資料。 新餐廳正式啟用時…」
//    （FAQ 答案由幾句 `join(" ")` 駁成，仲會入 FAQPage JSON-LD 畀 Google 顯示）。
//    即係第一版對佢完全冇效。而家包埋 CJK 標點（U+3000–303F）同全形字（U+FF00–FFEF）。
// ⚠️ 半形空格嘅規矩係「中文遇到英文／數字」先加（`我有 3 台 iPhone`），
//    所以呢條只捉「中文 空格 中文」，唔會誤殺 `2026 年 12 月 31 日` 嗰啲。
const CJK = "[\\u4e00-\\u9fff\\u3000-\\u303f\\uff00-\\uffef]";
// 🩸 第一版要求空格**兩邊都係 CJK**，所以「。 ShopOps」（全形標點 + 空格 + 拉丁字）
//    完全捉唔到 —— 而 `/pos/features` 嗰四處真實 bug 正正就係呢個 shape。
//    全形標點自己已經含住視覺留白，後面唔應該再有半形空格，接乜都一樣。
// ⚠️ 刻意唔包破折號 `—`：「首期月費…繳付 —— 例如 3 月 1 日啟用」呢種前後留白
//    係合理中文排版，擋咗就係誤擋。包嘅係「後面唔應該再有空白」嗰批收句標點。
const FULLWIDTH_PUNCT = "[。、，；：！？」』）】》〉…]";
function assertNoStrayCjkSpace(text, where) {
  const hit =
    new RegExp(`${FULLWIDTH_PUNCT} `).exec(text) ?? new RegExp(`${CJK} ${CJK}`).exec(text);
  assert.equal(
    hit,
    null,
    `${where}: 兩個中文字／全形標點之間唔應該有半形空格${hit ? `（「…${text.slice(Math.max(0, hit.index - 8), hit.index + 10)}…」）` : ""}`,
  );
}

test("all languages preserve the approved trial and first-payment offer", () => {
  // 三語係 spread 同一個 `OFFER_TERMS`（另有一條 test 驗 `...OFFER_TERMS` 恰好
  // 出現 3 次，literal type 亦拒絕逐語覆寫），所以逐語 assert 同一個值係**假覆蓋** ——
  // 睇落驗咗三次，實際上永遠唔可能有其中一語唔同。驗一次就夠。
  assert.equal(POS_CONTENT.en.trialDays, 30);
  assert.equal(POS_CONTENT.en.trialNeedsCard, false);
  assert.equal(POS_CONTENT.en.trialAutoCharges, false);
  assert.equal(POS_CONTENT.en.freeMonthsAfterActivation, 2);
  // 唔釘死日期本身 —— 續期係正常操作。只驗格式，值由到期閘守。
  assert.match(POS_CONTENT.en.promoEndsOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(POS_CONTENT.en.quoteValidityDays > 0);

  // 首期付款講法固定喺流程最後一步。步數改咗要重新拍板文案，所以釘死長度同位置，
  // 唔用 `.at(-1)`（加多一步就會靜靜哋驗咗第二段字）。
  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].trial.steps.length, 6, `${lang}: 試用流程步數`);
  }

  // 兩個 boolean 旗標只係資料，客人睇嘅係文字。之前淨係驗旗標 —— 三語改成
  // 「試用須信用卡、期滿自動收費」都照樣綠（Codex 2026-09-19 實測過）。
  const trialTerms = Object.fromEntries(
    languages.map((lang) => [lang, POS_CONTENT[lang].trial.steps[3].detail]),
  );
  assert.match(trialTerms.en, /needs no card/i);
  assert.match(trialTerms.en, /no automatic charge/i);
  assert.match(trialTerms["zh-Hant"], /毋須信用卡/);
  assert.match(trialTerms["zh-Hant"], /不會自動收費/);
  assert.match(trialTerms["zh-Hans"], /无需信用卡/);
  assert.match(trialTerms["zh-Hans"], /不会自动收费/);

  // 免費期一定要用「月結日」表達（同一日 + 月尾 fallback），唔准退回日數講法。
  // 呢條規矩嚟自 docs/superpowers/specs/2026-08-02-pos-first-payment-wording-design.md：
  // 「第 N 天收費」同「按月收費」永遠對唔齊（2 月 28 日、7 月 31 日各自講錯數）。
  const firstPayment = Object.fromEntries(
    languages.map((lang) => [lang, POS_CONTENT[lang].trial.steps[5].detail]),
  );
  assert.match(firstPayment.en, /same date 2 months after you activate/i);
  assert.match(firstPayment.en, /last day of that month/i);
  assert.match(firstPayment["zh-Hant"], /起 2 個月後的同一日/);
  assert.match(firstPayment["zh-Hant"], /該月最後一日/);
  assert.match(firstPayment["zh-Hans"], /起 2 个月后的同一日/);
  assert.match(firstPayment["zh-Hans"], /该月最后一日/);

  // 「限時優惠」喺英國要有真實截止日先講得，所以三語都要寫明；仲要講埋
  // 「推廣期內取得報價、喺報價有效期內啟用一樣計」，否則 12 月尾攞報價嘅客人
  // 會以為過咗年就冇咗優惠（同已確認嘅商業安排矛盾）。
  // 四個語意都要齊：邊個合資格、幾時截、用咩界定、跨期點算。
  // 淨係驗日期唔夠 —— 縮成「報價優惠截至 2026-12-31。」會照樣過（Codex 2026-09-19 實測）。
  const [endYear, endMonth, endDay] = POS_CONTENT.en.promoEndsOn.split("-").map(Number);
  const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const expectedEnd = {
    en: `${endDay} ${MONTHS_EN[endMonth - 1]} ${endYear}`,
    "zh-Hant": `${endYear} 年 ${endMonth} 月 ${endDay} 日`,
    "zh-Hans": `${endYear} 年 ${endMonth} 月 ${endDay} 日`,
  };
  for (const lang of languages) {
    const promoNote = POS_CONTENT[lang].pricing.promoNote;
    // 日期由 promoEndsOn 計出嚟，唔可以三語各寫一份（改期就會分岔）。
    // 亦唔出 ISO：`2026-12-31` 唔係英國餐廳老闆慣用嘅寫法，而呢個數字
    // 正正決定佢夠唔夠資格。
    assert.match(promoNote, new RegExp(expectedEnd[lang]), `${lang}: 推廣截止日要用當地寫法`);
    assert.doesNotMatch(promoNote, /\d{4}-\d{2}-\d{2}/, `${lang}: 對外唔好出 ISO 日期`);
    if (lang !== "en") assertNoStrayCjkSpace(promoNote, `${lang}: promoNote`);
    // ⚠️ 聲明要講齊**兩樣**優惠。之前淨係講「優惠價」，而首頁根本冇顯示價 ——
    // 訪客見到「首 2 個月免費」跟住一段講佢未見過嘅折扣價，等於冇講過條件。
    assert.match(
      promoNote,
      /free months|個月免費|个月免费/,
      `${lang}: 要講埋免費期，唔可以淨係講優惠價`,
    );
    assert.match(promoNote, /new restaurants|新餐廳|新餐厅/, `${lang}: 限新餐廳`);
    assert.match(promoNote, /activate|啟用|启用/, `${lang}: 用「啟用」界定資格`);
    assert.match(promoNote, /quote|報價|报价/, `${lang}: 報價有效期內仍然適用`);
    assert.match(promoNote, /validity|有效期/, `${lang}: 講明係報價嘅有效期`);
    // 試行一季，唔係永久價。英文本來寫 `you keep this pricing`，讀落似鎖死價錢，
    // 同中文「同樣適用」分岔，亦同 spec 講嘅「一季後檢討」唔夾。
    assert.match(
      promoNote,
      /standard pricing applies|按標準價|按标准价/,
      `${lang}: 要講明推廣完之後回復標準價`,
    );
  }

  // 兩個頁面都各自係獨立入口，兩邊都要貼住個價講推廣資格。呢度只驗接線，
  // 真 render 由 tests/pos-features-rendered.test.mjs 驗。
  // 四個檔各自係一個「講咗優惠價／免費期」嘅獨立出口：
  //   兩個 pricing section（/pos 同 /pos/features 都入得）、
  //   TrialJourney（首頁同 /pos 共用，就係講免費期嗰段）、
  //   兩頁嘅 FAQ 答案（仲會入 JSON-LD，Google 直接顯示）。
  // ⚠️ 要搵「用咗」唔係「提過」：`TrialJourney.tsx` 個 props 定義本身就有一行
  // `promoNote: string`，所以淨係 grep 個字，拆走 JSX 入面嗰個 `{promoNote}`
  // 照樣綠（2026-09-19 mutation 實撞）。所以一定要 match 到花括號入面。
  for (const file of [
    "../components/PosPricingSection.tsx",
    "../components/PosFeaturesLanding.tsx",
    "../components/TrialJourney.tsx",
    "../components/CompanyHome.tsx",
    "../components/PosLanding.tsx",
  ]) {
    const page = readFileSync(new URL(file, import.meta.url), "utf8");
    // JSX 直接出（`{pricing.promoNote}`）或者經 joinSentences 駁入 FAQ 答案，兩種都算用到。
    assert.match(
      page,
      /\{[^{}]*promoNote[^{}]*\}|joinSentences\([\s\S]{0,160}promoNote/,
      `${file} 要真係用到推廣資格，唔淨係宣告`,
    );
  }

  // `TrialJourney` 要再嚴一級：佢個 props 解構本身就係 `{ copy, promoNote, }`，
  // 滿足咗上面條 regex —— 拆走 JSX 入面嗰個 `{promoNote}` 照樣綠（mutation 實撞兩次）。
  // 所以要求 marker 同個值出現喺同一段，證明真係 render 咗出嚟。
  // 首頁 FAQ 嘅「試用之後點」答案會入 FAQPage JSON-LD 畀 Google 直接顯示。
  // ⚠️ 上面條 grep 已經被同一個檔 291 行嘅 `promoNote={pos.pricing.promoNote}`
  // 滿足咗，所以拆走 FAQ 答案入面嗰個內插照樣綠 —— 要逐句釘死。
  const companyHome = readFileSync(new URL("../components/CompanyHome.tsx", import.meta.url), "utf8");
  assert.match(
    companyHome,
    /a: joinSentences\(lang, \[pos\.trial\.steps\[4\]\.detail, pos\.trial\.steps\[5\]\.detail, pos\.pricing\.promoNote\]\)/,
    "首頁 FAQ「試用之後點」嘅答案要帶埋推廣條件（呢句會入 JSON-LD），而且要經 joinSentences 駁",
  );

  const trialJourney = readFileSync(new URL("../components/TrialJourney.tsx", import.meta.url), "utf8");
  assert.match(
    trialJourney,
    /data-pos-promo-note[\s\S]{0,300}\{promoNote\}/,
    "TrialJourney 個 marker 同推廣資格要喺同一個元素",
  );

  // 禁語**刻意分兩層**。單層寫法（成個檔 grep 一份嚴格清單）試過會盪去誤擋：
  // `/day \d+/i` 冇字界，連 `Friday 1 May 2026` 同 `day 1 of service` 都中
  // （Codex 2026-09-19 實測）。一個會誤殺正常文案嘅 guard，下一個人只會繞過佢。
  //
  //   層 1（offer 欄位）：只係試用／付款／推廣三段文字，唔會出現星期名或者日期散文，
  //                       所以可以用最嚴格嘅 pattern。
  //   層 2（成個檔）：只擋「無論寫喺邊都一定錯」嘅句式，唔會誤中其他產品文案。
  const CN_NUM = "[0-9一二三四五六七八九十兩两廿卅]+";
  const offerText = languages
    .flatMap((lang) => [
      ...POS_CONTENT[lang].trial.steps.map((step) => `${step.title} ${step.detail}`),
      POS_CONTENT[lang].hero.reassurance,
      POS_CONTENT[lang].pricing.promoNote,
    ])
    .join("\n");
  // 要用**收費語境**分，唔可以齋睇句式：`from day 61`（收費日）同
  // `from day 1 of service`（正常散文）句式一模一樣，淨擋 `day \d+` 會誤殺後者。
  const MONEY = "free|charge|charged|pay|pays|paid|payment|billing|bill";
  // ⚠️ 層 1 掃嘅係 **resolve 咗嘅實際值**，所以要包埋下面層 2 嗰批 pattern。
  // 層 2 grep 源碼，而呢個檔全部用 `${OFFER_TERMS.trialDays}` 內插 ——
  // 寫成 `Your first ${OFFER_TERMS.trialDays} days are free` 源碼度冇數字，
  // 層 2 一定唔中。要防嗰句用 repo 現行寫法寫出嚟就會全綠（2026-09-19 實撞）。
  const DAY_COUNT_FREE = [
    /\d+\s*days?\s+(are\s+|is\s+)?free/i,
    new RegExp(`首\\s*${CN_NUM}\\s*[天日]\\s*免費`),
    new RegExp(`首\\s*${CN_NUM}\\s*[天日]\\s*免费`),
    new RegExp(`前\\s*${CN_NUM}\\s*[天日]\\s*免費`),
    new RegExp(`前\\s*${CN_NUM}\\s*[天日]\\s*免费`),
  ];
  for (const strictWording of [
    new RegExp(`\\bday \\d+\\b[^.]*\\b(${MONEY})\\b`, "i"),
    new RegExp(`\\b(${MONEY})\\b[^.]*\\bday \\d+\\b`, "i"),
    new RegExp(`第\\s*${CN_NUM}\\s*[天日][^。]*(免費|免费|收費|收费|繳付|缴付|月費|月费)`),
    new RegExp(`(免費|免费|收費|收费|繳付|缴付|月費|月费)[^。]*第\\s*${CN_NUM}\\s*[天日]`),
    ...DAY_COUNT_FREE,
  ]) {
    assert.doesNotMatch(offerText, strictWording, "offer 文案唔可以用日數講免費期／收費日");
  }

  const source = readFileSync(new URL("../lib/pos-content.ts", import.meta.url), "utf8");
  for (const dayCountWording of [
    // 空白可有可無、單複數都要、「日」同「天」都要 —— `首三十日免費` 試過漏網。
    /\d+\s*days?\s+(are\s+|is\s+)?free/i,
    new RegExp(`首\\s*${CN_NUM}\\s*[天日]\\s*免費`),
    new RegExp(`首\\s*${CN_NUM}\\s*[天日]\\s*免费`),
    new RegExp(`前\\s*${CN_NUM}\\s*[天日]\\s*免費`),
    new RegExp(`前\\s*${CN_NUM}\\s*[天日]\\s*免费`),
    // 2026-09-19 之前嘅 offer：啟用當日收首期。而家啟用時免費，
    // 講返舊嗰句就等於向客人收一筆唔應該收嘅錢。
    /charged on the day you activate/i,
    /正式啟用當日收取首期月費/, /正式启用当日收取首期月费/,
    /首期只收 1 個月費用/, /首期只收 1 个月费用/,
  ]) {
    assert.doesNotMatch(source, dayCountWording);
  }
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
  assert.match(page, /<PosPricingSection copy=\{pos\.pricing\} trial=\{pos\.trial\.title\} detailsHref=\{`\/pos\/features\?lang=\$\{lang\}`\} detailsLabel=\{t\.viewFeatures\} \/>/);
  assert.match(page, /pos\.commission\.body/);
  assert.doesNotMatch(page, /ShopOps is one flat monthly fee with zero commission/);
});

test("FAQ 答案駁句子唔可以留低半形空格（會入 JSON-LD 畀 Google 顯示）", () => {
  // 🩸 `${a} ${b}` 駁中文句子 → 每個「。」後面一個多餘半形空格。
  //    呢段字出喺首頁同 /pos 嘅 FAQ，仲會入 FAQPage JSON-LD。
  //    英文相反：句號之後**要**有空格，所以用 joinSentences(lang, …) 按語言決定。
  for (const lang of languages) {
    const parts = [
      POS_CONTENT[lang].trial.steps[4].detail,
      POS_CONTENT[lang].trial.steps[5].detail,
      POS_CONTENT[lang].pricing.promoNote,
    ];
    const joined = joinSentences(lang, parts);
    if (lang !== "en") assertNoStrayCjkSpace(joined, `${lang}: FAQ 答案`);
  }

  // 🩸 英文分支本來寫 `assert.match(joined, /\. [A-Z]/)` —— **假綠**：
  //    把 joinSentences 改成永遠 `join("")`（英文冇咗空格）照樣全綠，
  //    因為原文入面本來就有其他「句號 + 大寫」。要直接驗接縫先守得住。
  assert.equal(joinSentences("en", ["A.", "B."]), "A. B.", "英文句子之間要有一個空格");
  assert.equal(joinSentences("zh-Hant", ["甲。", "乙。"]), "甲。乙。", "中文句子之間唔可以有空格");
  assert.equal(joinSentences("zh-Hans", ["甲。", "乙。"]), "甲。乙。", "中文句子之間唔可以有空格");
  assert.equal(joinSentences("en", ["A.", "", "B."]), "A. B.", "空字串唔應該駁出多餘空格");

  // 🩸 只重砌一兩組答案守唔住：喺 `commission.body` 尾加個空格，
  //    joinSentences 照駁出「。 直接」而全套 test 仍然綠。
  //    所以直接掃晒 POS_CONTENT 每一個字串值。
  for (const lang of languages) {
    if (lang === "en") continue;
    const walk = (node, path) => {
      if (typeof node === "string") return assertNoStrayCjkSpace(node, `${lang}: ${path}`);
      if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`));
      if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
      }
    };
    walk(POS_CONTENT[lang], "");
  }

  // 三個 component 都要用 helper，唔准自己 `join(" ")` 或者 `${a} ${b}`。
  for (const file of [
    "../components/CompanyHome.tsx",
    "../components/PosLanding.tsx",
    "../components/PosFeaturesLanding.tsx",
  ]) {
    const page = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.match(page, /joinSentences\(/, `${file} 駁 FAQ 句子要用 joinSentences()`);
    assert.doesNotMatch(
      page,
      /trial\.steps[\s\S]{0,80}\.join\(" "\)/,
      `${file} 唔准用 join(" ") 駁 trial steps —— 中文會留低多餘空格`,
    );
    // 🩸 真正嘅 bug 形狀係 `${a} ${b}` 模板內插，唔係 `.join(" ")`。
    //    第一版個閘只擋 join，所以七處現役違規（硬件 FAQ、佣金 FAQ、contact
    //    subtitle…）全部過骨 —— 其中首頁硬件 FAQ 仲直接入咗 JSON-LD。
    //    擋「兩個內插之間夾一個空格」就覆蓋得到，而且以後加新 FAQ 一樣擋得住。
    // ⚠️ 只擋「第二個內插係**文案來源**」嗰種，唔可以全檔封殺 `} ${` ——
    //    `className={`mt-4 ${a} ${b}`}` 係好平常嘅寫法，擋咗就係誤擋，
    //    而錯誤訊息仲會講「中文之間會留低半形空格」，誤導下一個人。
    assert.doesNotMatch(
      page,
      /\} \$\{(pos\.|t\.faq|dict\.en|POS_CONTENT\.|copy\.|pricing\.)/,
      `${file} 唔准用 \`\${a} \${b}\` 駁兩段文案 —— 中文之間會留低半形空格，要用 joinSentences()`,
    );
  }
});

test("the promotion has not silently expired", () => {
  // 冇呢條閘，2027-01-01 之後個站會照出推廣價同「喺 X 或之前啟用」，而
  // `npm run verify` 一樣全綠 —— 冇任何嘢會提你推廣完咗。
  // 呢個唔可以靠人記得：到期就要紅，逼人返嚟決定「回復標價定續期」。
  //
  // 紅咗之後點清：改 `OFFER_TERMS.promoEndsOn`（續期），或者按
  // docs/superpowers/specs/2026-09-19-promo-pricing-and-free-months-design.md
  // 嘅「舊價」回復標價、移除 promoNote 同呢條 test。兩條路都行得通 ——
  // 呢個 guard 綁住嘅係「推廣仲有效」呢個可以改變嘅事實，唔係一件改唔到嘅歷史。
  // ⛔ **唔加報價有效期做緩衝**（一度加過，係錯嘅）：嗰 `quoteValidityDays` 日
  // 只對「推廣期內已經攞過報價」嗰批人成立，但個價錢牌係向**所有新訪客**出 £8。
  // 緩衝期內個站等於一邊話「優惠到 X 為止」一邊照出優惠價畀唔合資格嘅人。
  // 已報價客人由 sales 跟進，唔靠網站文案兜。截止日一到就要收檔。
  const endsOn = POS_CONTENT.en.promoEndsOn;
  const today = new Date().toISOString().slice(0, 10);
  assert.ok(
    today <= endsOn,
    `推廣期 ${endsOn} 已經過咗（今日 ${today}），但個站仲向新訪客出緊推廣價。` +
      `續期：改 OFFER_TERMS.promoEndsOn 一行（已驗過三語文案同 test 會自動跟）。` +
      `收檔：按 design doc 嘅舊價回復標價、移除 promoNote／promoNoteShort 同呢條 test。`,
  );
});

test("the comic ad may show the trial but never the promotional price or free months", () => {
  // `/this-is-you` 個漫畫廣告引用 `hero.reassurance`（免費試用 N 天、毋須信用卡、
  // 不會自動收費）。呢句唔涉及金錢承諾，所以唔要求佢同場講推廣條款 —— 塞一大段
  // 條款落漫畫度亦都冇人讀。
  //
  // 但呢個豁免有前提：佢**唔可以**講優惠價或者免費月數。一旦講咗，就同其他出口
  // 一樣要同場講資格同截止日。喺度釘死個前提，唔係靠下一個人記得。
  // ⚠️ 要 grep 嘅係**佢實際出嗰段字**，唔係個 component 檔。
  // ComicAd.tsx 本身一個錢字都冇 —— 佢全部 offer 文字由 `hero.reassurance` 嚟。
  // 淨係掃個 component 檔，人哋喺 reassurance 加「首 2 個月免費」照樣綠，
  // 而 `/this-is-you` 就會喺冇資格冇截止日之下講免費期。
  const ad = readFileSync(new URL("../app/this-is-you/ComicAd.tsx", import.meta.url), "utf8");
  assert.match(
    ad,
    /POS_CONTENT\[[^\]]+\]\.hero\.reassurance|POS_CONTENT\.\w+\.hero\.reassurance/,
    "漫畫廣告嘅 offer 文字要嚟自 hero.reassurance（呢條 test 就係掃嗰段字）",
  );
  assert.doesNotMatch(ad, /pricing\.|promoNote|£/, "漫畫廣告唔可以自己攞價錢欄位");

  for (const lang of languages) {
    const shown = POS_CONTENT[lang].hero.reassurance;
    for (const moneyClaim of [
      /£/,
      /個月免費/, /个月免费/, /months are free/i,
      /\d+\s*months?\s+free/i,
      /free for \d+ months?/i,
    ]) {
      assert.doesNotMatch(
        shown,
        moneyClaim,
        `${lang}: hero.reassurance 會喺 /this-is-you 冇條件咁出現，唔可以講價錢或者免費月數`,
      );
    }
  }
});

test("POS contact has no shadow offer copy outside the shared content", () => {
  const page = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  // 寫死任何試用日數／免費月數都擋，唔淨係擋當時嗰個數 —— 舊版寫死 `3` 同 `30`，
  // 一改推廣期就會漏網。數字用 \d+ 捉，改幾多次都擋得住。
  for (const pattern of [
    // 兩種語序都要擋：`free 30-day trial` 同網站本身用緊嘅 `30-day free trial`。
    // 只擋前者嘅話，抄一句現行文案入嚟寫死反而唔會紅（Codex 2026-09-19 實測）。
    /free \d+-day trial/i,
    /\d+-day free trial/i,
    /\d+ days (are )?free/i,
    /\d+ months are free/i,
    /免費試用 \d+ 天/,
    /免费试用 \d+ 天/,
    // 中文數字：\d+ 捉唔到「免費試用三十天」。「日」同「天」都要，空白可有可無。
    /免費試用\s*[0-9一二三四五六七八九十兩两廿卅]+\s*[天日]/,
    /免费试用\s*[0-9一二三四五六七八九十兩两廿卅]+\s*[天日]/,
    /首 \d+ 天免費/,
    /首 \d+ 天免费/,
    // 四種組合（首／前 × 繁／簡）加中文數字版都要擋 —— 之前只寫咗其中兩種。
    /[首前]\s*[0-9一二三四五六七八九十兩两]+\s*個月免費/,
    /[首前]\s*[0-9一二三四五六七八九十兩两]+\s*个月免费/,
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
  // 仍然釘死「六步全部 join」（原本嘅保障），另外要求答案帶埋推廣資格 ——
  // 呢個答案會入 JSON-LD 由 Google 直接顯示，講咗免費期就要同場講條件。
  // 仍然釘死「六步全部 map 入去」＋「帶埋推廣資格」，只係駁法由 `join(" ")`
  // 改成 `joinSentences(lang, …)` —— 中文句號後面唔應該有半形空格（會入 JSON-LD）。
  assert.match(
    page,
    /const trialAnswer = joinSentences\(lang, \[\.\.\.pos\.trial\.steps\.map\(\(step\) => step\.detail\), pos\.pricing\.promoNote\]\);/,
  );
  assert.match(
    page,
    /const englishTrialAnswer = joinSentences\("en", \[\.\.\.POS_CONTENT\.en\.trial\.steps\.map\(\(step\) => step\.detail\), POS_CONTENT\.en\.pricing\.promoNote\]\);/,
  );
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
  assert.match(page, /joinSentences\(lang, \[pos\.commission\.body, pos\.commission\.disclaimer, t\.faq\.providerFeesA\]\)/);
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

test("source contract: the workflow pins the four approved screenshots in journey order", () => {
  const workflow = readFileSync(
    new URL("../components/PosWorkflow.tsx", import.meta.url),
    "utf8",
  );
  const landing = readFileSync(
    new URL("../components/PosFeaturesLanding.tsx", import.meta.url),
    "utf8",
  );

  const approvedIds = ["order-entry", "kitchen-order", "floor-progress", "checkout-report"];

  assert.match(workflow, /import \{ POS_FEATURE_IMAGES/);
  const workflowIds = idsInConst(workflow, "WORKFLOW_IMAGE_IDS");
  assert.deepEqual(workflowIds, approvedIds,
    "the workflow must show the four approved screenshots in journey order");
  assert.match(workflow, /copy\.steps\.map\(\(step, index\) => \(\s*[\s\S]*?src=\{POS_FEATURE_IMAGES\[WORKFLOW_IMAGE_IDS\[index\]\]\}/);
  assert.match(workflow, /id="workflow"/);

  // 兩個檔各自釘一次同一組 id：`/pos` 同首頁行 `PosWorkflow`，`/pos/features` 行
  // 自己嗰個 `workflowImageIds`。經同一個 image map 只保證「攞到嘅係 map 入面
  // 嗰張」，保證唔到「兩邊講緊同一個故事」—— 一邊重排／換 id，兩頁就會各講各。
  assert.deepEqual(workflowIds, idsInConst(landing, "workflowImageIds"),
    "the /pos workflow and the feature page must name the same screenshots in the same order");

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
