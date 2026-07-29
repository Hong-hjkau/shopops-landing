import test from "node:test";
import assert from "node:assert/strict";
import {
  isLang,
  parseQueryLang,
  resolveInitialLang,
} from "../lib/language.ts";

test("accepts only the three supported language tags", () => {
  assert.equal(isLang("en"), true);
  assert.equal(isLang("zh-Hant"), true);
  assert.equal(isLang("zh-Hans"), true);
  assert.equal(isLang("fr"), false);
  assert.equal(isLang(undefined), false);
});

test("query parser rejects arrays and unknown values", () => {
  assert.equal(parseQueryLang("zh-Hant"), "zh-Hant");
  assert.equal(parseQueryLang(["en", "zh-Hant"]), undefined);
  assert.equal(parseQueryLang("unknown"), undefined);
  assert.equal(parseQueryLang(undefined), undefined);
});

test("valid query overrides storage and invalid query follows storage", () => {
  assert.equal(resolveInitialLang("en", "zh-Hant"), "en");
  assert.equal(resolveInitialLang("zh-Hans", "en"), "zh-Hans");
  assert.equal(resolveInitialLang(undefined, "zh-Hant"), "zh-Hant");
  assert.equal(resolveInitialLang(undefined, "unknown"), "en");
  assert.equal(resolveInitialLang(undefined, null), "en");
});
