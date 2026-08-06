import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { POS_FEATURES_CONTENT } from "../lib/pos-features-content.ts";

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
  assert.match(text, /Individual add-ons/);
  assert.match(text, /Delivery or finance add-on/);
  assert.match(text, /\+£\s*9\s*\/month/);
  assert.match(text, /\+£\s*19\s*\/month/);
  assert.match(text, /Book a demo & free trial setup/);
  assert.match(text, /3-day free trial · No card needed for the trial · We set up your menu for you/);
});

test("workflow renders each approved screenshot beside its matching stage and language caption", async () => {
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
    assert.match(visibleText(stories[index]), /Demo screens are in English\. ShopOps supports English and Chinese\./);
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
    const trigger = workflow.match(new RegExp(`<button[^>]*data-pos-image-id="${id}"[^>]*>`))?.[0];
    assert.ok(trigger, `${id} should render as a native button trigger`);
    assert.match(trigger, new RegExp(`aria-label="${actionLabel}"`));

    const dialog = workflow.match(new RegExp(`<dialog[^>]*data-pos-image-dialog="${id}"[\\s\\S]*?<\\/dialog>`))?.[0];
    assert.ok(dialog, `${id} should render a native dialog`);
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
  const expectedIds = [
    "order-entry", "kitchen-order", "floor-progress", "checkout-report",
    "bilingual", "offline_backup", "menu_management", "sold_out",
    "delivery", "finance_inventory",
    "scheduling", "reservations", "reviews", "food_safety",
    "allergens", "recipe_costing", "custom_domain", "signage",
  ];
  const renderedIds = [...main.matchAll(/data-pos-image-id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(renderedIds, expectedIds);
  assert.equal(new Set(renderedIds).size, 18);

  const sectionIds = [...main.matchAll(/<section[^>]*id="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(sectionIds, [
    "hero", "workflow", "core", "advanced-operations", "add-ons",
    "feature-help", "good-to-know", "final-cta",
  ]);
});

test("all three languages render the same 18 unique images with exact localized dialog labels", async () => {
  const expectedIds = [
    "order-entry", "kitchen-order", "floor-progress", "checkout-report",
    "bilingual", "offline_backup", "menu_management", "sold_out",
    "delivery", "finance_inventory",
    "scheduling", "reservations", "reviews", "food_safety",
    "allergens", "recipe_costing", "custom_domain", "signage",
  ];

  for (const language of ["en", "zh-Hant", "zh-Hans"]) {
    const main = await render(language);
    const content = POS_FEATURES_CONTENT[language];
    const descriptions = [
      ...content.workflow.stories,
      ...content.core.cards,
      content.addOns.delivery,
      content.addOns.finance_inventory,
      ...expectedIds.slice(10).map((id) => content.addOns[id]),
    ];
    const renderedIds = [...main.matchAll(/data-pos-image-id="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(renderedIds, expectedIds);
    assert.equal(new Set(renderedIds).size, 18);

    expectedIds.forEach((id, index) => {
      const trigger = main.match(new RegExp(`<button[^>]*data-pos-image-id="${id}"[^>]*>`))?.[0];
      const dialog = main.match(new RegExp(`<dialog[^>]*data-pos-image-dialog="${id}"[\\s\\S]*?<\\/dialog>`))?.[0];
      assert.ok(trigger, `${language} ${id} should render a trigger`);
      assert.ok(dialog, `${language} ${id} should render a dialog`);
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

test("pricing hierarchy and screenshot grids keep Core first and use at most two columns", async () => {
  const main = await render("en");
  const hero = sectionById(main, "hero");
  const corePrice = hero.indexOf('data-pos-price-tier="core"');
  const standardPrice = hero.indexOf('data-pos-price-tier="standard-add-ons"');
  const premiumPrice = hero.indexOf('data-pos-price-tier="advanced-add-ons"');
  assert.ok(corePrice !== -1 && corePrice < standardPrice && standardPrice < premiumPrice);
  assert.match(hero, /data-pos-price-tier="core"[^>]*class="[^"]*col-span-full/);
  assert.match(hero, /data-pos-price-add-ons[^>]*class="[^"]*sm:grid-cols-2/);

  for (const id of ["workflow", "core", "advanced-operations", "add-ons"]) {
    const section = sectionById(main, id);
    assert.match(section, /data-pos-feature-grid[^>]*class="[^"]*md:grid-cols-2/);
    assert.doesNotMatch(section, /(?:sm|md|lg|xl):grid-cols-[34]/);
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
    "ShopOps records card payments only",
    "your own card terminal",
    "terminal provider fees are separate",
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
      good: ["外賣自取", "只收現金", "不接受網上付款", "只記錄信用卡付款", "自己的卡機", "供應商費用另計", "草稿", "員工確認", "不會直接向 HMRC"],
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
      good: ["外卖自取", "只收现金", "不接受在线付款", "只记录银行卡付款", "自己的刷卡机", "供应商费用另计", "草稿", "员工确认", "不会直接向 HMRC"],
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
