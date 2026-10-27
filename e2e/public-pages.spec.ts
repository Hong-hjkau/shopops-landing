import { expect, test } from "@playwright/test";
import { waitForHydration } from "./helpers/hydration";

// `/pos`、`/rota`、`/this-is-you` 三條公開 route 一直冇互動測試 —— 每頁揀一個最
// 有價值、唔同其他 spec 重複嘅互動驗。

test("/pos savings calculator recalculates when you move the slider", async ({ page }) => {
  await page.goto("/pos?lang=en");
  const slider = page.locator("input[type='range']").first();
  await waitForHydration(page, slider);

  const panel = page.locator("section", { has: slider }).last();
  const before = await panel.innerText();

  await slider.fill(await slider.getAttribute("max") ?? "100");

  await expect(panel).not.toHaveText(before);
});

test("/rota FAQ answers open and close, and say so to screen readers", async ({ page }) => {
  await page.goto("/rota?lang=en");
  // ⚠️ 排走 header 個漢堡掣 —— 佢都係 `button[aria-expanded]`，而且喺 DOM 行先。
  // 桌面闊度佢係收起嘅，唔排走就會等一個永遠唔會出現嘅元素等到 timeout。
  const question = page
    .locator('button[aria-expanded]:not([aria-controls="site-mobile-navigation"])')
    .first();
  await waitForHydration(page, question);

  // 📌 `components/Faq.tsx` 個掣有 `aria-expanded` 但**冇 `aria-controls`**，答案段落
  // 亦冇 id —— 即係 screen reader 知個掣開咗，但唔知佢開緊邊嚿嘢。呢個係真嘅 a11y
  // 缺口，但唔屬今次改動範圍，所以呢度只係對住現有結構驗，冇順手改個 component。
  const answer = question.locator("xpath=following-sibling::p");
  const startedOpen = (await question.getAttribute("aria-expanded")) === "true";

  // 唔假設初始開定閂（第一條而家係預設展開）—— 驗嘅係「撳一下就反轉，而且
  // `aria-expanded` 同答案真係出唔出得嚟一致」。
  await expect(answer).toHaveCount(startedOpen ? 1 : 0);

  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", String(!startedOpen));
  await expect(answer).toHaveCount(startedOpen ? 0 : 1);

  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", String(startedOpen));
  await expect(answer).toHaveCount(startedOpen ? 1 : 0);
});

test("/this-is-you keeps the document language and the call to action on the language you picked", async ({ page }) => {
  await page.goto("/this-is-you?lang=zh-Hant");
  const englishButton = page.locator("button[aria-pressed]", { hasText: "EN" });
  await waitForHydration(page, englishButton);

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant");

  await englishButton.click();

  await expect(englishButton).toHaveAttribute("aria-pressed", "true");
  // 呢頁本來揸住自己一份語言 state，同 root provider 各行各路：畫面轉咗英文，
  // `<html lang>` 仲係中文，而個 CTA 一路指住冇語言嘅 `/pos#contact`，撳落去
  // 語言就跌返做預設。兩樣而家都釘住。
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  // 驗成條 href，唔淨係驗有冇 `lang=` —— 只驗 query 嘅話，CTA 俾人改去第二條 route
  // 都會照綠。
  await expect(page.getByRole("link", { name: /Book a Demo/i })).toHaveAttribute(
    "href",
    "/pos?lang=en#contact",
  );
});
