import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  assert.match(page, /subtitle: `\$\{pos\.trial\.steps\[3\]\.detail\}/);
  assert.match(page, /reassure: pos\.hero\.reassurance/);
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
