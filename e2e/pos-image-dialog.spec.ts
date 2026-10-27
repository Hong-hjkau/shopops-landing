import { expect, test, type Locator, type Page } from "@playwright/test";
import { POS_FEATURES_CONTENT } from "../lib/pos-features-content";
import { waitForHydration } from "./helpers/hydration";

// 規格驗收第 9 條（docs/superpowers/specs/2026-08-06-pos-feature-screenshots-and-layout-design.md）：
//   「圖片可用 click、Enter／Space 開啟；Escape、關閉按鈕及 focus return 正常。」
// 呢六項一直冇機器驗過 —— 舊 harness 淨係 fetch HTML 用 regex 睇，冇 DOM 冇 JS。
// jsdom 到今日都仲未實作 HTMLDialogElement.showModal()（jsdom#3294，2021 年開到而家），
// 所以呢個 component 冇得靠 jsdom，要真瀏覽器。

const EN = POS_FEATURES_CONTENT.en;

// 攞第一張圖做代表行全套互動驗證，另外有一條掃晒頁面上每一張驗接線。
const FIRST = {
  id: "order-entry",
  actionLabel: EN.workflow.stories[0].imageActionLabel,
  alt: EN.workflow.stories[0].imageAlt,
};


// 每個 workflow story、核心功能卡、加購項目各配一張已批核截圖。
const EXPECTED_SCREENSHOT_COUNT =
  EN.workflow.stories.length + EN.core.cards.length + Object.keys(EN.addOns).length;

function trigger(page: Page, id: string): Locator {
  return page.locator(`button[data-pos-image-id="${id}"]`);
}

function dialog(page: Page, id: string): Locator {
  return page.locator(`dialog[data-pos-image-dialog="${id}"]`);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/pos/features?lang=en");
  await waitForHydration(page, trigger(page, FIRST.id));
});

test("a pointer click opens the dialog and the close button returns focus to the trigger", async ({ page }) => {
  const button = trigger(page, FIRST.id);
  const modal = dialog(page, FIRST.id);

  await expect(modal).toBeHidden();
  await button.click();
  await expect(modal).toBeVisible();

  await page.getByRole("button", { name: EN.imageDialogCloseLabel }).click();
  await expect(modal).toBeHidden();
  await expect(button).toBeFocused();
});

test("Enter opens the dialog and Escape returns focus to the trigger", async ({ page }) => {
  const button = trigger(page, FIRST.id);
  const modal = dialog(page, FIRST.id);

  await expect(modal).toBeHidden();
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(modal).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(modal).toBeHidden();
  await expect(button).toBeFocused();
});

test("Space opens the dialog and clicking the backdrop returns focus to the trigger", async ({ page }) => {
  const button = trigger(page, FIRST.id);
  const modal = dialog(page, FIRST.id);

  await expect(modal).toBeHidden();
  await button.focus();
  await page.keyboard.press("Space");
  await expect(modal).toBeVisible();

  // 撳 dialog 個盒**以外**嘅暗區（::backdrop）要關閉。瀏覽器會將 backdrop 上面
  // 嘅 click 派去 <dialog> 自己，所以 handler 靠 target === currentTarget 分得出
  // 「撳背景」定「撳張圖」。⚠️ 唔可以用 modal.click({position}) —— 嗰個座標係
  // 相對 dialog 個盒，會撞正入面嘅 <div>，target 唔等於 currentTarget，唔會關。
  await page.mouse.click(5, 5);
  await expect(modal).toBeHidden();
  await expect(button).toBeFocused();
});

test("every screenshot opens its own dialog and closes again", async ({ page }) => {
  // 由真頁面問返有邊啲圖，唔喺度另存一份 18 個 id。「係咪啱啱 18 張、次序啱
  // 唔啱」係 tests/rendered/pos-features-rendered.test.mjs 嘅職責；呢條淨係負責「頁面上
  // 每張圖都撳得開、關得返」。
  const ids = await page.locator("[data-pos-image-id]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-pos-image-id") ?? ""),
  );
  // 數量唔可以慳 —— rendered suite 驗嘅係靜態 HTML，呢度驗嘅係 hydrate 咗嘅
  // 真瀏覽器頁面。只寫 `toBeGreaterThan(0)` 嘅話，一個 client 端先出現嘅流失
  // （得返 1 張圖）會兩邊一齊假綠：rendered 見到 18 張照過，e2e 掃到嗰 1 張開關
  // 成功都照過。
  // 個數由 content 推導，唔硬編 —— 每個 story／核心卡／加購各配一張圖，加多一項
  // 就自動跟住升，唔使記住兩處要一齊改。
  expect(ids.length).toBe(EXPECTED_SCREENSHOT_COUNT);

  for (const id of ids) {
    const button = trigger(page, id);
    const modal = dialog(page, id);

    await button.scrollIntoViewIfNeeded();
    await waitForHydration(page, button);
    await button.click();
    await expect(modal, `${id} should open its own dialog`).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal, `${id} should close again`).toBeHidden();
    await expect(button, `${id} should get focus back`).toBeFocused();
  }
});

test("the trigger is named by its action and described by the picture", async ({ page }) => {
  // 呢條係 F8 修復嘅真正驗證。舊 harness 只可以睇 HTML attribute 有冇出現；
  // 呢度問嘅係瀏覽器計出嚟嘅 accessibility tree —— 即係 screen reader 真正收到嘅嘢。
  const button = trigger(page, FIRST.id);
  await expect(button).toHaveAccessibleName(FIRST.actionLabel);
  await expect(button).toHaveAccessibleDescription(FIRST.alt);
});
