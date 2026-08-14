import { expect, test } from "@playwright/test";

test("orange add-on badges use a prominent strike through the old price", async ({ page }) => {
  await page.goto("/pos/features?lang=zh-Hant#add-ons");

  const oldPrice = page.locator("#allergens [data-pos-sale-original]");
  await expect(oldPrice).toBeVisible();

  const style = await oldPrice.evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      fontWeight: computed.fontWeight,
      textDecorationThickness: computed.textDecorationThickness,
    };
  });

  expect(style).toEqual({
    fontWeight: "400",
    textDecorationThickness: "2px",
  });
});
