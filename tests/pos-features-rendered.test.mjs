import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { startNextDev } from "./helpers/next-server.mjs";
import {
  POS_FEATURES_CONTENT,
  getPosFeatureAddOnPriceText,
  getPremiumPosFeatureAddOns,
} from "../lib/pos-features-content.ts";
import { POS_CONTENT } from "../lib/pos-content.ts";

let server;
let baseUrl;

function visibleMain(html) {
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main, "response should contain the rendered main element");
  return main.replace(/<script\b[\s\S]*?<\/script>/g, "");
}

function visibleText(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function assertTextIncludes(text, phrase) {
  assert.ok(
    text.toLocaleLowerCase().includes(phrase.toLocaleLowerCase()),
    `expected rendered text to include: ${phrase}\n${text}`,
  );
}

function decodeAttribute(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function sectionById(main, id) {
  const section = main.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?<\\/section>`))?.[0];
  assert.ok(section, `rendered page should contain #${id}`);
  return section;
}

function articleById(main, id) {
  const article = main.match(new RegExp(`<article[^>]*id="${id}"[\\s\\S]*?<\\/article>`))?.[0];
  assert.ok(article, `rendered page should contain article #${id}`);
  return article;
}

function metaContent(html, key) {
  const tag = html.match(new RegExp(`<meta(?=[^>]*(?:property|name)="${key}")[^>]*>`))?.[0];
  assert.ok(tag, `response should contain ${key} metadata`);
  const content = tag.match(/content="([^"]*)"/)?.[1];
  assert.ok(content, `${key} metadata should have content`);
  return content;
}

function headings(main) {
  return [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => ({
    level: Number(match[1]),
    text: visibleText(match[2]),
  }));
}

// 18 張已批核截圖，按頁面出現次序。同 lib/pos-feature-images.ts 嘅 register 對應。
const EXPECTED_IMAGE_IDS = [
  "order-entry", "kitchen-order", "floor-progress", "checkout-report",
  "bilingual", "offline_backup", "menu_management", "sold_out",
  "delivery", "finance_inventory",
  "scheduling", "reservations", "reviews", "food_safety",
  "allergens", "recipe_costing", "custom_domain", "signage",
];

const IMAGE_SECTION_IDS = ["workflow", "core", "advanced-operations", "add-ons"];

function countMatches(text, pattern) {
  return (text.match(pattern) ?? []).length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function triggerById(main, id) {
  const trigger = main.match(new RegExp(`<button[^>]*data-pos-image-id="${id}"[^>]*>`))?.[0];
  assert.ok(trigger, `rendered page should contain a trigger for ${id}`);
  return trigger;
}

// 連內容嘅完整 <button>…</button>（trigger 入面冇巢狀 button）。
function triggerElementById(main, id) {
  const element = main.match(new RegExp(`<button[^>]*data-pos-image-id="${id}"[\\s\\S]*?</button>`))?.[0];
  assert.ok(element, `rendered page should contain a complete trigger element for ${id}`);
  return element;
}

// 完整 <dialog>…</dialog>。
function dialogById(main, id) {
  const dialog = main.match(new RegExp(`<dialog[^>]*data-pos-image-dialog="${id}"[\\s\\S]*?</dialog>`))?.[0];
  assert.ok(dialog, `rendered page should contain a dialog for ${id}`);
  return dialog;
}

// 搵載住某張圖嘅 <article>（article 唔會巢狀）。
function articleByImageId(main, id) {
  const article = [...main.matchAll(/<article\b[\s\S]*?<\/article>/g)]
    .map((match) => match[0])
    .find((candidate) => candidate.includes(`data-pos-image-id="${id}"`));
  assert.ok(article, `rendered page should contain the card holding ${id}`);
  return article;
}

// 卡上肉眼睇得到嘅文字。要剝走 sr-only 描述 —— 佢載住 alt，唔剝嘅話
// 「可見文案退化但 alt 仲提住」呢種 regression 會被隱藏文字救返，假綠。
function visibleCardText(article) {
  return visibleText(article.replace(/<span[^>]*class="[^"]*\bsr-only\b[^"]*"[^>]*>[\s\S]*?<\/span>/g, ""));
}

// 卡上肉眼睇得到嘅文案（story／core 卡係 title，自選加購卡係 outcome）。
// ⚠️ delivery／finance_inventory 行 PosPremiumFeature，佢**唔** render
// `addOns[id].outcome`。將來如果將呢兩個 id 加入 IMAGE_SEMANTIC_CONTRACT，
// 呢度會攞到一句頁面根本冇出嘅字 —— 但 rendered 層嗰個 required assert 會即刻
// 紅（真 output 搵唔到），所以係大聲失敗，唔會靜靜哋過。
function visibleCopy(description) {
  return [description.title ?? description.outcome, description.body].join(" ");
}

// Stable ID → 圖片語意契約，刻意擺喺 content object 外面：文案改到同張圖唔夾
// 嗰陣，呢度會紅。只填有已知走樣風險嘅 id（逐張真圖睇過），唔使 18 個都填。
const IMAGE_SEMANTIC_CONTRACT = {
  // 張圖淨係一個「Collect payment」收款視窗（Card ref、現金／信用卡掣、右邊
  // 未付款清單）。冇任何報表畫面 —— 檔名 checkout-report 係歷史命名，唔好信。
  "checkout-report": {
    required: { en: /payment/i, "zh-Hant": /收款|付款/, "zh-Hans": /收款|付款/ },
    forbidden: { en: /report/i, "zh-Hant": /報表/, "zh-Hans": /报表/ },
  },
};

// 圖片語意（alt / action label）跟 EXPECTED_IMAGE_IDS 同一次序。
function imageDescriptions(content) {
  return [
    ...content.workflow.stories,
    ...content.core.cards,
    content.addOns.delivery,
    content.addOns.finance_inventory,
    ...EXPECTED_IMAGE_IDS.slice(10).map((id) => content.addOns[id]),
  ];
}

before(async () => {
  server = await startNextDev({ readyPath: "/pos/features?lang=en" });
  baseUrl = server.baseUrl;
}, { timeout: 50_000 });

after(async () => {
  await server?.stop();
});

// 全檔共用同一個 next dev process；`path` 令入口頁（`/`、`/pos`）都可以對住真
// output 驗，唔使各自再開一個 server。
async function render(language, path = "/pos/features") {
  return visibleMain(await fetchPage(language, path));
}

async function fetchPage(language, path = "/pos/features") {
  const response = await fetch(`${baseUrl}${path}?lang=${language}`);
  assert.equal(response.status, 200, `${path}?lang=${language} should render`);
  return response.text();
}

// 「核心 POS」以前指去 #workflow，真正嘅 #core 冇入口，而且次序同頁面唔一致。
// 四個入口係上限：1024px 加到第五個，全部 label 會斷行兼同 logo 疊字。
const EXPECTED_NAV_TARGETS = ["#core", "#advanced-operations", "#add-ons", "#good-to-know"];

test("the feature page answers on its own route and keeps the requested language in its links", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const html = await fetchPage(language);
    const main = visibleMain(html);

    assert.match(main, new RegExp(`<main[^>]*lang="${language}"`),
      `${language}: the rendered main element should declare the requested language`);

    // 語言切換同聯絡 CTA 都要帶住語言走，唔可以撳完跌返做英文。
    for (const target of ["en", "zh-Hant", "zh-Hans"]) {
      assert.ok(main.includes(`href="/pos/features?lang=${target}"`),
        `${language}: the language switcher should offer ${target} without leaving the page`);
    }
    assert.ok(main.includes(`href="/pos?lang=${language}#contact"`),
      `${language}: the contact CTA should carry the reader's language back to /pos`);
  }
});

test("both public entry points link into the feature page without dropping the language", async () => {
  // `/pos` 食 ?lang=；首頁嘅語言喺 client provider 手上，SSR 一定係 en，所以
  // 首頁只驗得到預設語言嗰條入口。
  // ⚠️ 呢條**唔覆蓋**「讀者喺首頁撳咗中文之後，個入口連結有冇跟住變」——
  // 嗰件事只發生喺 hydration 之後，要真瀏覽器先驗到，屬 e2e 條線（SiteHeader
  // 語言切換至今未有互動測試）。唔好當呢條 test 已經守住首頁嘅語言保留。
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const pos = visibleMain(await fetchPage(language, "/pos"));
    const entries = [...pos.matchAll(/href="\/pos\/features\?lang=([^"]+)"/g)].map((match) => match[1]);
    assert.ok(entries.length >= 2,
      `/pos?lang=${language} should keep both feature-page entry links, found ${entries.length}`);
    assert.deepEqual([...new Set(entries)], [language],
      `/pos?lang=${language} should not send readers back to another language`);
  }

  const home = visibleMain(await fetchPage("en", "/"));
  assert.ok(home.includes('href="/pos/features?lang=en"'),
    "the homepage should link into the feature page");
});

test("header nav points at the sections it names, in the order the page renders them", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const nav = main.match(/<nav\b[\s\S]*?<\/nav>/)?.[0];
    assert.ok(nav, `${language}: rendered page should contain the header nav`);

    const navTargets = [...nav.matchAll(/href="(#[^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(navTargets, EXPECTED_NAV_TARGETS, `${language}: nav should point at the sections it names`);

    const sectionIds = [...main.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map((match) => `#${match[1]}`);
    for (const target of navTargets) {
      assert.ok(sectionIds.includes(target), `${language}: nav points at ${target} but no section renders that id`);
    }
    assert.deepEqual(
      navTargets,
      sectionIds.filter((id) => navTargets.includes(id)),
      `${language}: nav order should follow the order the sections actually render in`,
    );

    // F12 嘅真正 bug 唔係次序，係 label 同目標唔對口（「Core POS」指去咗 #workflow）。
    const copy = POS_FEATURES_CONTENT[language];
    const expectedLabels = {
      "#core": copy.hero.corePriceLabel,
      "#advanced-operations": copy.premiumTitle,
      "#add-ons": copy.hero.standardAddOnPriceLabel,
      "#good-to-know": copy.goodToKnowTitle,
    };
    const entries = [...nav.matchAll(/href="(#[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .map((match) => [match[1], visibleText(match[2])]);
    assert.deepEqual(
      Object.fromEntries(entries),
      expectedLabels,
      `${language}: each nav entry should carry the label of the section it links to`,
    );
  }
});

test("hero renders both add-on price bands, the demo CTA, and canonical trial terms", async () => {
  const main = await render("en");
  const hero = main.match(/<section\b[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  const text = visibleText(hero);

  assert.match(text, /ShopOps POS features/);
  assert.match(text, /Choose-your-own operations tools/);
  assert.match(text, /Advanced operations \(Delivery or finance\)/);
  assert.match(text, /\+£\s*9\s*\/month/);
  assert.match(text, /\+£\s*19\s*\/month/);
  assert.match(text, /Book a demo & free trial setup/);
  assert.match(text, /3-day free trial · No card needed for the trial · We set up your menu for you/);
});

test("each hero add-on tier prices its whole layer instead of borrowing one add-on's price", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const hero = sectionById(await render(language), "hero");
    const unit = POS_CONTENT[language].pricing.monthlyUnit;

    for (const [tier, layout] of [["standard-add-ons", "card"], ["advanced-add-ons", "premium"]]) {
      const tile = hero.match(new RegExp(`<div[^>]*data-pos-price-tier="${tier}"[\\s\\S]*?</div>`))?.[0];
      assert.ok(tile, `${language}: hero should render the ${tier} tier`);
      // visibleText 會喺 tag 之間補空格，價錢同單位本身係貼住嘅，所以剝走空白先比。
      const price = visibleText(tile.match(/<p class="mt-2[\s\S]*?<\/p>/)?.[0] ?? "").replace(/\s+/g, "");
      assert.equal(price, `${getPosFeatureAddOnPriceText(language, layout)}${unit}`.replace(/\s+/g, ""),
        `${language}: the ${tier} tile should price the whole ${layout} layer`);
    }
  }
});

test("the advanced-operations section renders one panel per premium add-on, each with its own price", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const section = sectionById(await render(language), "advanced-operations");
    const panels = [...section.matchAll(/<article\b[^>]*id="([^"]+)"[\s\S]*?<\/article>/g)];
    const premiumAddOns = getPremiumPosFeatureAddOns(language);

    assert.deepEqual(panels.map((match) => match[1]), premiumAddOns.map((item) => item.id),
      `${language}: premium panels should follow the presentation contract, in order`);

    for (const [index, panel] of panels.entries()) {
      const { label, monthlyPrice } = premiumAddOns[index];
      const text = visibleText(panel[0]);
      assertTextIncludes(text, label);
      assertTextIncludes(text.replace(/\s+/g, ""), `+£${monthlyPrice}${POS_CONTENT[language].pricing.monthlyUnit}`.replace(/\s+/g, ""));
    }
  }
});

test("every screenshot section leads with its own heading, before the caption and the cards", async () => {
  // 冇呢條嘅話，將 section 個 h2 搬到啲卡下面（讀者見到一堆冇上文嘅卡先見到標題）
  // 全部 rendered test 都照綠 —— 實測過。
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    for (const id of IMAGE_SECTION_IDS) {
      const section = sectionById(main, id);
      const positions = {
        heading: section.indexOf("<h2"),
        caption: section.indexOf("data-pos-demo-caption"),
        grid: section.indexOf("data-pos-feature-grid"),
        firstCardHeading: section.indexOf("<h3"),
      };
      for (const [name, index] of Object.entries(positions)) {
        assert.notEqual(index, -1, `${language} #${id}: should render its ${name}`);
      }
      assert.ok(positions.heading < positions.caption,
        `${language} #${id}: the section heading should come before the demo-language caption`);
      assert.ok(positions.caption < positions.grid,
        `${language} #${id}: the caption should come before the images it describes`);
      assert.ok(positions.heading < positions.firstCardHeading,
        `${language} #${id}: the section heading should come before the first card heading`);
    }
  }
});

test("workflow renders each approved screenshot beside its matching stage and step number", async () => {
  const main = await render("en");
  const workflow = sectionById(main, "workflow");
  const stories = [...workflow.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((match) => match[0]);
  assert.equal(stories.length, 4);

  const expectedPairs = [
    ["order-entry", "Staff enters the order"],
    ["kitchen-order", "Kitchen receives the order"],
    ["floor-progress", "Front of house sees progress"],
    ["checkout-report", "Collect payment and close the bill"],
  ];
  expectedPairs.forEach(([asset, title], index) => {
    assert.match(stories[index], new RegExp(asset));
    assert.match(visibleText(stories[index]), new RegExp(title));
    // 步驟序號留喺卡上（佢係流程次序），但示範語言 caption 唔再逐卡重複 ——
    // 見下面 "every screenshot section states the demo-language caption exactly once"。
    assert.match(stories[index], new RegExp(`data-pos-step="${index + 1}"`));
    assert.doesNotMatch(
      visibleText(stories[index]),
      /Demo screens are in English\. ShopOps supports English and Chinese\./,
    );
  });
});

test("workflow screenshots render accessible lazy image-dialog triggers without priority loading", async () => {
  const main = await render("en");
  const workflow = sectionById(main, "workflow");
  const expected = [
    ["order-entry", "Enlarge the order-entry demo screen", "Close enlarged image"],
    ["kitchen-order", "Enlarge the kitchen-order demo screen", "Close enlarged image"],
    ["floor-progress", "Enlarge the floor-progress demo screen", "Close enlarged image"],
    ["checkout-report", "Enlarge the collect-payment demo screen", "Close enlarged image"],
  ];

  for (const [id, actionLabel, closeLabel] of expected) {
    const trigger = triggerById(workflow, id);
    assert.match(trigger, new RegExp(`aria-label="${actionLabel}"`));

    const dialog = dialogById(workflow, id);
    assert.match(dialog, /aria-label="[^"]+"/);
    assert.match(dialog, new RegExp(`<button[^>]*aria-label="${closeLabel}"`));
    assert.match(dialog, /max-h-\[85vh\]/);
  }

  assert.equal((workflow.match(/data-pos-image-id=/g) ?? []).length, 4);
  assert.equal((workflow.match(/loading="lazy"/g) ?? []).length, 8);
  assert.doesNotMatch(workflow, /priority|fetchpriority="high"|rel="preload"/i);
});

test("all 18 feature screenshots render once in the approved section order", async () => {
  const main = await render("en");
  const renderedIds = [...main.matchAll(/data-pos-image-id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(renderedIds, EXPECTED_IMAGE_IDS);
  assert.equal(new Set(renderedIds).size, 18);

  const sectionIds = [...main.matchAll(/<section[^>]*id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sectionIds, [
    "hero", "workflow", "core", "advanced-operations", "add-ons",
    "feature-help", "good-to-know", "final-cta",
  ]);
});

test("all three languages render the same 18 unique images with exact localized dialog labels", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const content = POS_FEATURES_CONTENT[language];
    const descriptions = imageDescriptions(content);
    const renderedIds = [...main.matchAll(/data-pos-image-id="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(renderedIds, EXPECTED_IMAGE_IDS);
    assert.equal(new Set(renderedIds).size, 18);

    EXPECTED_IMAGE_IDS.forEach((id, index) => {
      const trigger = triggerById(main, id);
      const dialog = dialogById(main, id);
      assert.equal(decodeAttribute(trigger.match(/aria-label="([^"]+)"/)?.[1] ?? ""), descriptions[index].imageActionLabel);
      assert.equal(decodeAttribute(dialog.match(/aria-label="([^"]+)"/)?.[1] ?? ""), descriptions[index].imageAlt);
      assert.equal(decodeAttribute(dialog.match(/<button[^>]*aria-label="([^"]+)"/)?.[1] ?? ""), content.imageDialogCloseLabel);
    });
  }
});

test("every screenshot actually serves the asset its stable ID names", async () => {
  // Source contract 只講「唔准繞過 image map 去 import 資產」，佢睇唔到真正流入
  // <Image src> 嘅係咩：一句 hardcode 字串就可以令 18 格全部出同一張錯圖而
  // 唔違反任何 import 規則。呢條由真 output 落手 —— 每個 id 出嗰張圖，檔名一定
  // 要係佢自己。18 個資產嘅 basename 全部就係 `<id>.webp`（見 screenshot register）。
  // 縮圖同放大圖係兩個獨立 <Image>，兩個都要驗：淨係驗縮圖嘅話，撳開之後見到
  // 第二張圖係錯嘅都唔會紅。
  const main = await render("en");
  const sources = { trigger: new Map(), dialog: new Map() };
  const urls = new Set();

  for (const id of EXPECTED_IMAGE_IDS) {
    for (const [surface, element] of [
      ["trigger", triggerElementById(main, id)],
      ["dialog", dialogById(main, id)],
    ]) {
      const url = decodeAttribute(element.match(/<img[^>]*\ssrc="([^"]+)"/)?.[1] ?? "");
      const src = decodeURIComponent(url);
      assert.ok(src, `${id}: the ${surface} should render an image source`);
      assert.match(src, new RegExp(`\\b${escapeRegExp(id)}\\.[^/]*webp`),
        `${id}: the ${surface} renders ${src}, which is not the asset this ID names`);
      sources[surface].set(id, src);
      // 攞底層靜態資產，唔行 `/_next/image` optimiser：真正要答嘅問題係「張圖
      // 存唔存在」，而 36 次即場轉檔會拖到隔籬條 OG test 逾時（實撞過）。
      urls.add(new URL(url, baseUrl).searchParams.get("url") ?? url);
    }
  }

  for (const [surface, resolved] of Object.entries(sources)) {
    assert.equal(new Set(resolved.values()).size, EXPECTED_IMAGE_IDS.length,
      `two ${surface} screenshots resolved to the same file`);
  }

  // 名啱唔代表送到。每個資產都真係攞一次 —— 一組改到根目錄嘅 `/<id>.webp` 名
  // 照樣啱、18 個照樣唔同，但用家見到嘅係 18 個 404。
  assert.equal(urls.size, EXPECTED_IMAGE_IDS.length,
    "the trigger and the dialog should share one asset per screenshot");
  for (const url of urls) {
    const response = await fetch(new URL(url, baseUrl));
    assert.equal(response.status, 200, `${url} should be served`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.ok(bytes.byteLength > 1000, `${url} should not be an empty file`);
    assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), "RIFF", `${url} should be the WebP asset`);
    assert.equal(new TextDecoder().decode(bytes.slice(8, 12)), "WEBP", `${url} should be the WebP asset`);
  }
});

test("the /pos and homepage workflow serve the same four screenshots the journey names", async () => {
  // 呢兩頁行 `PosWorkflow`，唔行 feature 頁嗰套 component。Source contract 只證到
  // 「經咗 image map」，證明唔到真正流出去嘅係邊四張、乜次序 —— 而呢兩頁係
  // 換圖之後最容易靜靜留喺舊圖／錯格嘅位。由真 output 落手驗。
  const journey = ["order-entry", "kitchen-order", "floor-progress", "checkout-report"];

  for (const path of ["/pos", "/"]) {
    const workflow = sectionById(await render("en", path), "workflow");
    const sources = [...workflow.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)]
      .map((match) => decodeURIComponent(decodeAttribute(match[1])));

    assert.equal(sources.length, journey.length,
      `${path}: the workflow should render one screenshot per stage`);
    sources.forEach((src, index) => {
      assert.match(src, new RegExp(`\\b${escapeRegExp(journey[index])}\\.[^/]*webp`),
        `${path}: stage ${index + 1} renders ${src}, which is not the asset the journey names`);
    });
  }
});

test("two-column story images request half-width desktop sources", async () => {
  const main = await render("en");
  for (const id of ["workflow", "core"]) {
    const section = sectionById(main, id);
    const thumbnailSizes = [...section.matchAll(/<button[^>]*data-pos-image-id[^>]*>[\s\S]*?<img[^>]*sizes="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(thumbnailSizes.length, 4);
    assert.deepEqual(thumbnailSizes, Array(4).fill("(max-width: 768px) 100vw, 50vw"));
  }
});

test("every screenshot section states the demo-language caption exactly once, above its images", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const caption = POS_FEATURES_CONTENT[language].demoImageCaption;

    for (const id of IMAGE_SECTION_IDS) {
      const section = sectionById(main, id);
      assert.equal(
        countMatches(section, /data-pos-demo-caption/g),
        1,
        `${language} #${id} should carry the demo caption exactly once`,
      );
      assertTextIncludes(visibleText(section), caption);
      // Caption 要行先，否則手機長頁讀者見到圖之後先見到解釋。
      assert.ok(
        section.indexOf("data-pos-demo-caption") < section.indexOf("data-pos-image-id"),
        `${language} #${id} caption should precede its screenshots`,
      );
    }

    // 全頁淨係四次 —— 唔可以退化返逐張圖重複（原本 core 區重複咗 4 次）。
    assert.equal(countMatches(main, /data-pos-demo-caption/g), IMAGE_SECTION_IDS.length);
    assert.equal(
      countMatches(visibleText(main), new RegExp(escapeRegExp(caption), "g")),
      IMAGE_SECTION_IDS.length,
      `${language} caption text should appear once per screenshot section`,
    );
  }
});

test("all 18 screenshots carry a demo-language badge that screen readers do not repeat", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const badge = POS_FEATURES_CONTENT[language].demoImageBadge;

    assert.equal(countMatches(main, /data-pos-demo-badge/g), 18, `${language} should badge all 18 screenshots`);
    for (const id of EXPECTED_IMAGE_IDS) {
      const trigger = triggerElementById(main, id);
      const chip = trigger.match(/<span[^>]*data-pos-demo-badge[^>]*>([\s\S]*?)<\/span>/)?.[0];
      assert.ok(chip, `${language} ${id} should render a demo badge inside its trigger`);
      assert.equal(visibleText(chip), badge);
      // Badge 淨係視覺補強；描述已經喺 aria-describedby 講咗，唔好再讀多次。
      assert.match(chip, /aria-hidden="true"/);
    }
  }
});

test("image triggers name the action and describe the picture without swallowing the alt text", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const content = POS_FEATURES_CONTENT[language];
    const descriptions = imageDescriptions(content);
    const seenIds = new Set();

    EXPECTED_IMAGE_IDS.forEach((id, index) => {
      const trigger = triggerById(main, id);
      const describedBy = decodeAttribute(trigger.match(/aria-describedby="([^"]+)"/)?.[1] ?? "");
      assert.ok(describedBy, `${language} ${id} trigger should point at a description`);
      assert.equal(seenIds.has(describedBy), false, `${describedBy} must be unique on the page`);
      seenIds.add(describedBy);

      // Accessible name 講「做咩」，description 講「係咩」。
      assert.equal(decodeAttribute(trigger.match(/aria-label="([^"]+)"/)?.[1] ?? ""), descriptions[index].imageActionLabel);
      const target = main.match(new RegExp(`<span[^>]*id="${describedBy}"[^>]*>([\\s\\S]*?)</span>`));
      assert.ok(target, `${language} ${describedBy} should exist in the DOM`);
      assert.equal(visibleText(target[1]), descriptions[index].imageAlt);
      assert.match(target[0], /class="[^"]*\bsr-only\b/);

      // 掣入面張圖係裝飾（描述已喺 span），唔好再讀一次。
      const thumbnail = main.match(new RegExp(`<button[^>]*data-pos-image-id="${id}"[^>]*>[\\s\\S]*?<img[^>]*>`))?.[0];
      assert.ok(thumbnail, `${language} ${id} should render a thumbnail image`);
      assert.match(thumbnail.match(/<img[^>]*>$/)?.[0] ?? "", /alt=""/);

      // 放大圖仍然要有描述性 alt。
      const dialog = dialogById(main, id);
      assert.equal(decodeAttribute(dialog.match(/<img[^>]*alt="([^"]*)"/)?.[1] ?? ""), descriptions[index].imageAlt);
    });

    assert.equal(seenIds.size, 18);
  }
});

test("screenshot copy claims only what the screenshot actually shows", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const descriptions = imageDescriptions(POS_FEATURES_CONTENT[language]);

    for (const [id, contract] of Object.entries(IMAGE_SEMANTIC_CONTRACT)) {
      const index = EXPECTED_IMAGE_IDS.indexOf(id);
      assert.notEqual(index, -1, `${id} should be a known stable image ID`);

      // Required 只可以由**肉眼睇到**嘅文案滿足：靠 alt 或 action label 頂住
      // 唔算數，否則可見標題／內文可以退化到同張圖無關而測試照綠。
      const description = descriptions[index];
      assert.match(visibleCopy(description), contract.required[language], `${language} ${id} visible copy should state what the screen shows`);

      // Forbidden 就要覆蓋晒 alt 同 action label —— 錯誤聲稱唔可以收喺隱藏文字。
      const everything = JSON.stringify(description);
      assert.doesNotMatch(everything, contract.forbidden[language], `${language} ${id} copy claims something the screenshot does not show`);

      // 真 output 都要守兩邊。
      const rendered = visibleCardText(articleByImageId(main, id));
      assert.match(rendered, contract.required[language], `${language} ${id} card should render what the screen shows`);
      assert.doesNotMatch(visibleText(articleByImageId(main, id)), contract.forbidden[language], `${language} ${id} card renders a claim the screenshot does not show`);
    }
  }
});

test("feature copy never hardcodes a product price", async () => {
  // Spec 驗收 #3：價錢只從 POS_CONTENT 讀，頁面唔另寫產品價錢常量。
  // 之前 recipeBoundary 三語各自寫死咗 "+£9"，改價會靜靜哋講錯數。
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    assert.doesNotMatch(
      JSON.stringify(POS_FEATURES_CONTENT[language]),
      /£/,
      `${language} feature copy should not carry its own price figure`,
    );
  }
});

test("pricing hierarchy keeps Core first, advanced add-ons before selectable tools, and screenshot grids at two columns", async () => {
  const main = await render("en");
  const hero = sectionById(main, "hero");
  const corePrice = hero.indexOf('data-pos-price-tier="core"');
  const standardPrice = hero.indexOf('data-pos-price-tier="standard-add-ons"');
  const premiumPrice = hero.indexOf('data-pos-price-tier="advanced-add-ons"');
  assert.ok(corePrice !== -1 && corePrice < premiumPrice && premiumPrice < standardPrice);
  assert.match(hero, /data-pos-price-tier="core"[^>]*class="[^"]*col-span-full/);
  assert.match(hero, /data-pos-price-add-ons[^>]*class="[^"]*sm:grid-cols-2/);

  for (const id of ["workflow", "core", "advanced-operations", "add-ons"]) {
    const section = sectionById(main, id);
    assert.match(section, /data-pos-feature-grid[^>]*class="[^"]*md:grid-cols-2/);
    assert.doesNotMatch(section, /(?:sm|md|lg|xl):grid-cols-[34]/);
  }
});

test("Core title precedes its ordinary supporting copy in every language", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const core = sectionById(await render(language), "core");
    const content = POS_FEATURES_CONTENT[language];
    const title = core.match(new RegExp(`<h2[^>]*>${content.core.title}</h2>`));
    const supportingCopy = core.match(new RegExp(`<p class="([^"]*)">${content.core.eyebrow}</p>`));

    assert.ok(title, `${language} Core title should render`);
    assert.ok(supportingCopy, `${language} Core inclusion copy should render as a paragraph`);
    assert.ok(core.indexOf(title[0]) < core.indexOf(supportingCopy[0]), `${language} Core title should come before its supporting copy`);
    assert.match(supportingCopy[1], /text-text-secondary/);
    assert.doesNotMatch(supportingCopy[1], /(?:\buppercase\b|\btracking-(?:wide|tight)\b|font-semibold|text-accent)/);
  }
});

test("the feature-help CTA follows all eight standard add-ons", async () => {
  const main = await render("en");
  const addOns = sectionById(main, "add-ons");
  const help = sectionById(main, "feature-help");
  assert.equal((addOns.match(/<article\b/g) ?? []).length, 8);
  assert.ok(main.indexOf(addOns) < main.indexOf(help));
});

test("rendered £9 cards include every approved capability and the allergen safety steps", async () => {
  const main = await render("en");
  assert.equal(sectionById(main, "add-ons").match(/<article\b/g)?.length, 8);
  const expectedById = {
    scheduling: ["Rota and clock-in", "collect staff availability", "shift swaps", "Telegram location clock-in"],
    reservations: ["Reservations", "walk-ins", "table timeline", "reminders"],
    reviews: ["Customer reviews", "completed orders or reservations", "ratings, comments and staff notifications"],
    food_safety: ["Food-safety records", "temperatures, corrective actions and sign-off"],
    allergens: ["Allergen recognition", "photo scan suggests possible allergens", "staff confirm the result", "every order asks again"],
    recipe_costing: ["Recipe costing", "portions and steps", "Usage and ingredient cost units must match"],
    custom_domain: ["Custom domain", "restaurant's own web address", "technical steps"],
    signage: ["Advertising screen", "images, videos, dishes or linked content"],
  };

  for (const [id, phrases] of Object.entries(expectedById)) {
    const text = visibleText(articleById(main, id));
    for (const phrase of phrases) assertTextIncludes(text, phrase);
  }
});

test("rendered premium panels expose complete delivery and finance workflows", async () => {
  const main = await render("en");
  const delivery = visibleText(main.match(/<article[^>]*id="delivery"[\s\S]*?<\/article>/)?.[0] ?? "");
  const finance = visibleText(main.match(/<article[^>]*id="finance_inventory"[\s\S]*?<\/article>/)?.[0] ?? "");

  for (const phrase of [
    "postcode areas",
    "delivery slots",
    "minimum order values",
    "delivery fees",
    "driver collection code",
    "driver view",
    "confirm collection",
    "deliver or cancel",
    "cash reconciliation",
    "driver pay per order and per mile",
    "actual driving distance",
    "straight-line distance",
    "cash-only",
    "does not take online payments",
  ]) assert.match(delivery, new RegExp(phrase, "i"));
  // 同一頁另一處用 "collection orders" 指外賣自取，所以送貨嗰個碼要講明係司機用嘅，
  // 唔可以退返做冇修飾嘅 "collection code"。
  assert.doesNotMatch(delivery, /(?<!driver )collection code/i);

  for (const phrase of [
    "suppliers, purchases, receiving and stock intake",
    "invoice photos or PDFs",
    "draft for staff to check",
    "person confirms it",
    "company stock or excluded private use",
    "VAT paid on purchases",
    "1 pack = 500 g",
    "stocktakes and stock valuations",
    "actual usage, cost, expenses, labour and profit and loss",
    "actual cost and profit and loss",
    "Recipe costing is a separate estimate",
    "does not submit directly to HMRC",
  ]) assert.match(finance, new RegExp(phrase, "i"));
  assert.doesNotMatch(finance, /Profit and loss[^.]*straight-line estimate/i);
  // 句中嘅 "profit and loss" 係普通名詞，唔係文件名，所以唔可以大寫返轉頭。
  // 呢條要 case-sensitive —— 上面嗰批 assert 全部帶 `i`，捉唔到大小寫倒退。
  assert.doesNotMatch(finance, /[a-z,] Profit and loss/);
});

test("Good to know renders the four operational boundaries instead of pricing reminders", async () => {
  const text = visibleText(sectionById(await render("en"), "good-to-know"));
  for (const phrase of [
    "Staff can enter collection orders in the POS",
    "Delivery orders are cash-only",
    "does not take online payments",
    "ShopOps can record card payments",
    "your own card terminal",
    "your terminal provider's fees remain separate",
    "AI invoice and VAT details stay as a draft",
    "staff confirm them",
    "does not submit directly to HMRC",
  ]) assert.match(text, new RegExp(phrase, "i"));
});

test("rendered outline and final CTA keep premium sections independent and pricing canonical", async () => {
  const main = await render("en");
  const outline = headings(main);
  assert.equal(outline.filter(({ level }) => level === 1).length, 1);
  assert.deepEqual(
    outline.filter(({ text }) => [
      "Advanced operations",
      "Online delivery orders",
      "Finance and inventory",
      "Good to know",
    ].includes(text)),
    [
      { level: 2, text: "Advanced operations" },
      { level: 3, text: "Online delivery orders" },
      { level: 3, text: "Finance and inventory" },
      { level: 2, text: "Good to know" },
    ],
  );

  const renderedSections = [...main.matchAll(/<section\b[\s\S]*?<\/section>/g)].map((match) => match[0]);
  const finalSection = renderedSections.at(-1);
  assert.ok(finalSection, "rendered page should end with the final CTA section");
  const finalText = visibleText(finalSection);
  assert.match(finalText, /Start with Core POS, then add each tool individually/);
  assert.match(finalText, /Core POS \+ Online delivery orders\s*:\s*£\s*38\s*\/month/);
  assert.match(finalText, /Core POS \+ Finance and inventory \+ Recipe costing\s*:\s*£\s*47\s*\/month/);
  assert.match(finalText, /3-day free trial · No card needed for the trial · We set up your menu for you/);
});

test("Traditional and Simplified pages render their fixed canonical names and English-screen caption", async () => {
  const expected = {
    "zh-Hant": {
      caption: "示範畫面為英文，系統支援英文及中文。",
      cards: {
        scheduling: ["排班打卡", "員工可上班時間", "Telegram"],
        reservations: ["訂位", "walk-in", "提醒"],
        reviews: ["顧客評價", "評分", "留言"],
        food_safety: ["食安記錄", "溫度", "異常處理", "簽核"],
        allergens: ["過敏原辨識", "相片掃描", "員工確認", "每張訂單"],
        recipe_costing: ["食譜成本", "份量", "步驟", "單位"],
        custom_domain: ["自訂網域", "自己的網址", "設定"],
        signage: ["廣告屏", "圖片", "影片", "連結"],
      },
      delivery: ["網上送貨訂單", "postcode", "送貨時段", "最低消費", "運費", "取貨碼", "司機", "現金對帳", "每單", "實際行車距離", "直線距離", "只收現金", "不接受網上付款"],
      finance: ["財務及庫存", "Invoice 相片或 PDF", "草稿讓員工檢查", "確認後才會入庫", "公司庫存", "私人用途", "VAT", "1 pack = 500 g", "盤點", "實際耗用", "損益", "食譜成本", "不會直接向 HMRC"],
      good: ["外賣自取", "只收現金", "不接受網上付款", "可記錄信用卡付款", "自己的卡機", "供應商費用另計", "草稿", "員工確認", "不會直接向 HMRC"],
    },
    "zh-Hans": {
      caption: "演示画面为英文，系统支持英文及中文。",
      cards: {
        scheduling: ["排班打卡", "员工可上班时间", "Telegram"],
        reservations: ["订位", "walk-in", "提醒"],
        reviews: ["顾客评价", "评分", "留言"],
        food_safety: ["食品安全记录", "温度", "异常处理", "签核"],
        allergens: ["过敏原识别", "照片扫描", "员工确认", "每张订单"],
        recipe_costing: ["食谱成本", "份量", "步骤", "单位"],
        custom_domain: ["自定义域名", "自己的网址", "设置"],
        signage: ["广告屏", "图片", "视频", "链接"],
      },
      delivery: ["网上送货订单", "postcode", "送货时段", "最低消费", "运费", "取货码", "司机", "现金对账", "每单", "实际行车距离", "直线距离", "只收现金", "不接受在线付款"],
      finance: ["财务及库存", "Invoice 照片或 PDF", "草稿让员工检查", "确认后才会入库", "公司库存", "私人用途", "VAT", "1 pack = 500 g", "盘点", "实际耗用", "损益", "食谱成本", "不会直接向 HMRC"],
      good: ["外卖自取", "只收现金", "不接受在线付款", "可记录银行卡付款", "自己的刷卡机", "供应商费用另计", "草稿", "员工确认", "不会直接向 HMRC"],
    },
  };

  for (const [language, checks] of Object.entries(expected)) {
    const main = await render(language);
    assertTextIncludes(visibleText(sectionById(main, "workflow")), checks.caption);
    assert.equal(sectionById(main, "add-ons").match(/<article\b/g)?.length, 8);
    for (const [id, phrases] of Object.entries(checks.cards)) {
      const text = visibleText(articleById(main, id));
      for (const phrase of phrases) assertTextIncludes(text, phrase);
    }
    for (const phrase of checks.delivery) assertTextIncludes(visibleText(articleById(main, "delivery")), phrase);
    for (const phrase of checks.finance) assertTextIncludes(visibleText(articleById(main, "finance_inventory")), phrase);
    for (const phrase of checks.good) assertTextIncludes(visibleText(sectionById(main, "good-to-know")), phrase);
  }
});

test("Open Graph and Twitter use the approved localized share copy", async () => {
  const expected = {
    en: "A bilingual restaurant POS for orders, kitchen and checkout.",
    "zh-Hant": "中英雙語餐廳 POS，處理落單、廚房和結帳。",
    "zh-Hans": "中英双语餐厅 POS，处理点餐、厨房和结账。",
  };

  for (const [language, share] of Object.entries(expected)) {
    const html = await fetchPage(language);
    assert.equal(metaContent(html, "og:description"), share);
    assert.equal(metaContent(html, "twitter:description"), share);
  }
});

test("every language declares a real Open Graph image that the route actually serves", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const html = await fetchPage(language);

    assert.equal(metaContent(html, "twitter:card"), "summary_large_image");
    const ogImage = metaContent(html, "og:image");
    assert.equal(metaContent(html, "twitter:image"), ogImage);
    assert.match(ogImage, /\/pos\/features\/opengraph-image/);
    assert.equal(metaContent(html, "og:image:type"), "image/png");
    assert.equal(metaContent(html, "og:image:width"), "1200");
    assert.equal(metaContent(html, "og:image:height"), "630");

    // metadataBase resolves the tag to the production origin; fetch the same path locally.
    const declared = new URL(ogImage);
    const response = await fetch(`${baseUrl}${declared.pathname}${declared.search}`);
    assert.equal(response.status, 200, `${language} opengraph-image should be served`);
    assert.equal(response.headers.get("content-type"), "image/png");
    // 唔靠 content-length（dev server streaming 唔一定送）；直接驗真身係 PNG。
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.ok(bytes.byteLength > 1000, `${language} opengraph-image should not be empty`);
    assert.deepEqual([...bytes.slice(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  }
});

test("hero states the canonical VAT position next to the price tiers in every language", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const hero = sectionById(await render(language), "hero");
    const text = visibleText(hero);

    assertTextIncludes(text, POS_CONTENT[language].pricing.vatNote);
    // VAT note 要夾喺「全部價錢格之後」同「CTA 之前」。逐個 tier marker 都要
    // 比對，唔可以只靠 grid 開頭嘅 data-pos-price-add-ons —— 否則 VAT note
    // 誤跌入 grid、排喺兩張加購價錢卡之前，次序一樣成立而測試照綠。
    const markers = {
      core: hero.indexOf('data-pos-price-tier="core"'),
      advanced: hero.indexOf('data-pos-price-tier="advanced-add-ons"'),
      standard: hero.indexOf('data-pos-price-tier="standard-add-ons"'),
      vatNote: hero.indexOf("data-pos-vat-note"),
      cta: hero.indexOf("data-pos-hero-cta"),
    };
    for (const [name, index] of Object.entries(markers)) {
      assert.notEqual(index, -1, `${language} hero should render ${name}`);
    }
    for (const tier of ["core", "advanced", "standard"]) {
      assert.ok(
        markers[tier] < markers.vatNote,
        `${language} VAT note should follow the ${tier} price tier`,
      );
    }
    assert.ok(markers.vatNote < markers.cta, `${language} VAT note should precede the CTA`);
    // The page must not invent a second VAT wording alongside the canonical one.
    assert.doesNotMatch(
      JSON.stringify(POS_FEATURES_CONTENT[language]),
      /No VAT added|不另收 VAT/,
    );
  }
});

test("Good to know reuses the canonical card-payment note instead of a second wording", async () => {
  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const section = sectionById(await render(language), "good-to-know");
    const items = [...section.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((match) => visibleText(match[1]));
    const copy = POS_FEATURES_CONTENT[language].goodToKnow;

    // 逐格對位,唔淨係「文字曾經出現過」—— 否則漏一格、次序調轉都會假綠。
    assert.deepEqual(items, [
      copy.collection,
      copy.delivery,
      POS_CONTENT[language].pricing.feeNote,
      copy.invoiceVat,
    ]);
  }

  const rejected = {
    en: /records card payments only/i,
    "zh-Hant": /只記錄信用卡付款/,
    "zh-Hans": /只记录银行卡付款/,
  };
  for (const [language, pattern] of Object.entries(rejected)) {
    const text = visibleText(sectionById(await render(language), "good-to-know"));
    assert.doesNotMatch(text, pattern, `${language} should not restate the card boundary`);
    assert.doesNotMatch(JSON.stringify(POS_FEATURES_CONTENT[language]), pattern);
  }
});
