import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { POS_FEATURES_CONTENT } from "../lib/pos-features-content.ts";
import { POS_CONTENT } from "../lib/pos-content.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
let nextProcess;
let baseUrl;
let serverOutput = "";

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.notEqual(typeof address, "string");
  const port = address.port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

async function waitForPage(url) {
  const deadline = Date.now() + 45_000;
  while (Date.now() < deadline) {
    if (nextProcess.exitCode !== null) {
      throw new Error(`Next dev exited before rendering the page.\n${serverOutput}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The local server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for rendered page.\n${serverOutput}`);
}

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
  const port = await reservePort();
  baseUrl = `http://127.0.0.1:${port}`;
  nextProcess = spawn("node_modules/.bin/next", ["dev", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const collectOutput = (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-20_000);
  };
  nextProcess.stdout.on("data", collectOutput);
  nextProcess.stderr.on("data", collectOutput);
  await waitForPage(`${baseUrl}/pos/features?lang=en`);
}, { timeout: 50_000 });

after(async () => {
  if (!nextProcess || nextProcess.exitCode !== null) return;
  nextProcess.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => nextProcess.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (nextProcess.exitCode === null) nextProcess.kill("SIGKILL");
});

async function render(language) {
  return visibleMain(await fetchPage(language));
}

async function fetchPage(language) {
  const response = await fetch(`${baseUrl}/pos/features?lang=${language}`);
  assert.equal(response.status, 200);
  return response.text();
}

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

test("workflow renders each approved screenshot beside its matching stage and step number", async () => {
  const main = await render("en");
  const workflow = sectionById(main, "workflow");
  const stories = [...workflow.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((match) => match[0]);
  assert.equal(stories.length, 4);

  const expectedPairs = [
    ["order-entry", "Staff enters the order"],
    ["kitchen-order", "Kitchen receives the order"],
    ["floor-progress", "Front of house sees progress"],
    ["checkout-report", "Checkout and reporting"],
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
    ["checkout-report", "Enlarge the checkout and reporting demo screen", "Close enlarged image"],
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
  const finance = visibleText(main.match(/<article[^>]*id="finance"[\s\S]*?<\/article>/)?.[0] ?? "");

  for (const phrase of [
    "postcode areas",
    "delivery slots",
    "minimum order values",
    "delivery fees",
    "collection code",
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

  for (const phrase of [
    "suppliers, purchases, receiving and stock intake",
    "invoice photos or PDFs",
    "draft for staff to check",
    "person confirms it",
    "company stock or excluded private use",
    "VAT paid on purchases",
    "1 pack = 500 g",
    "stocktakes and stock valuations",
    "actual usage, cost, expenses, labour and Profit and loss",
    "actual cost and Profit and loss",
    "Recipe costing is a separate estimate",
    "does not submit directly to HMRC",
  ]) assert.match(finance, new RegExp(phrase, "i"));
  assert.doesNotMatch(finance, /Profit and loss[^.]*straight-line estimate/i);
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
      finance: ["財務及庫存", "Invoice 相片或 PDF", "草稿讓員工檢查", "確認後才會入庫", "公司庫存", "私人用途", "VAT", "1 pack = 500 g", "盤點", "實際耗用", "損益", "+£9 食譜成本", "不會直接向 HMRC"],
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
      finance: ["财务及库存", "Invoice 照片或 PDF", "草稿让员工检查", "确认后才会入库", "公司库存", "私人用途", "VAT", "1 pack = 500 g", "盘点", "实际耗用", "损益", "+£9 食谱成本", "不会直接向 HMRC"],
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
    for (const phrase of checks.finance) assertTextIncludes(visibleText(articleById(main, "finance")), phrase);
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
