import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers/hydration";

// 語言切換由頭到尾冇機器驗過。rendered 層結構上驗唔到：首頁語言喺 client provider
// 手上，SSR 出嚟一定係 `en`，要撳咗掣之後先睇得出分別。

const zhButton = "header button[aria-pressed]:has-text('繁')";

test("switching language updates the page, the document language and what gets remembered", async ({ page }) => {
  await page.goto("/");
  await waitForHydration(page, page.locator(zhButton));

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(zhButton)).toHaveAttribute("aria-pressed", "false");
  const englishNav = await page.locator("header nav").first().allTextContents();

  await page.locator(zhButton).click();

  await expect(page.locator(zhButton)).toHaveAttribute("aria-pressed", "true");
  // ⚠️ 呢句係重點：畫面轉咗語言但 `<html lang>` 冇跟，screen reader 就會用英文
  // 語音讀中文字。淨係驗畫面文字係捉唔到呢個問題嘅。
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
  await expect(page.locator("header nav").first()).not.toHaveText(englishNav.join(""));

  // 揀完要記得住 —— 否則每揭一頁都要重新揀。
  await page.reload();
  await expect(page.locator(zhButton)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");
});
