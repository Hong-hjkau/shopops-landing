import { expect, test, type Locator, type Page } from "@playwright/test";
import { POS_FEATURES_CONTENT } from "../lib/pos-features-content";

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

// 撳掣之前要等 React 真係接通咗 handler。
//
// ⚠️ 唔可以用 `toBeEnabled()` 做閘 —— 個 button 本來就冇 disabled，SSR HTML 一出
// 就已經成立，等唔到 hydration；慢機上會喺 handler 未掛好之前撳落去，間歇性紅。
//
// ⚠️ 亦都唔用「重試同一個手勢直到開到」—— 咁樣會將規格嘅「撳一下就開」偷偷
// 變成「若干秒內重複撳最終會開」，反而冚住「第一下撳被 hydration 食咗」呢個
// 真實 UX 問題。
//
// 呢度改為等 React 喺個 button 上面掛好 fiber／props（React 19 嘅 root-level
// delegated listener 就係讀呢個 `__reactProps$…`，所以佢出現 = handler 接通咗），
// 之後每個手勢都係**單次、唔重試**，同規格語意一致。
//
// 呢個係 React 內部命名。萬一將來 React 改名，個 gate 會 timeout **大聲紅**，
// 唔會靜靜哋變綠 —— 到時改呢一處就得。
async function waitForHydration(page: Page, button: Locator): Promise<void> {
  await button.waitFor({ state: "visible" });
  const handle = await button.elementHandle();
  await page.waitForFunction(
    (element) => Object.keys(element as object).some((key) => key.startsWith("__reactProps$")),
    handle,
    { timeout: 15_000 },
  );
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
  // 唔啱」係 tests/pos-features-rendered.test.mjs 嘅職責；呢條淨係負責「頁面上
  // 每張圖都撳得開、關得返」。
  const ids = await page.locator("[data-pos-image-id]").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("data-pos-image-id") ?? ""),
  );
  // 數量唔可以慳 —— rendered suite 睇嘅係 `next dev`，呢度睇嘅係 production
  // build，兩個 server mode 唔同。只寫 `toBeGreaterThan(0)` 嘅話，一個 production
  // 專有嘅流失（得返 1 張圖）會兩邊一齊假綠：rendered 見到 18 張照過，e2e 掃到
  // 嗰 1 張開關成功都照過。
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
