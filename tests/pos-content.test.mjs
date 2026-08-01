import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { POS_CONTENT } from "../lib/pos-content.ts";

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

test("all languages preserve exact numeric offer facts", () => {
  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].trialDays, 3);
    assert.equal(POS_CONTENT[lang].freeActivationDays, 30);
    assert.equal(POS_CONTENT[lang].firstChargeDay, 31);
    assert.equal(POS_CONTENT[lang].trialNeedsCard, false);
    assert.equal(POS_CONTENT[lang].trialAutoCharges, false);
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
  assert.match(page, /pos\.pricing\.body/);
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
    "<PricingCard",
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
