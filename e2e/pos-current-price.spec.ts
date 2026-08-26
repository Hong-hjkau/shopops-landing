import { expect, test } from "@playwright/test";

test("orange add-on badges show only the current price", async ({ page }) => {
  await page.goto("/pos/features?lang=zh-Hant#add-ons");

  const price = page.locator("#allergens [data-pos-current-price]");
  await expect(price).toHaveText("+£9／月");
  await expect(price.locator("del")).toHaveCount(0);
});
