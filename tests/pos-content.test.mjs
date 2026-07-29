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
