import type { Locator, Page } from "@playwright/test";

// 撳掣之前要等 React 真係接通咗 handler。
//
// ⚠️ 唔可以用 `toBeEnabled()` 做閘 —— 個 button 本來就冇 disabled，SSR HTML 一出
// 就已經成立，等唔到 hydration；慢機上會喺 handler 未掛好之前撳落去，間歇性紅。
//
// ⚠️ 亦都唔用「重試同一個手勢直到開到」—— 咁樣會將規格嘅「撳一下就開」偷偷
// 變成「若干秒內重複撳最終會開」，反而冚住「第一下撳被 hydration 食咗」呢個
// 真實 UX 問題。
//
// 呢度改為等 React 喺個元素上面掛好 fiber／props（React 19 嘅 root-level
// delegated listener 就係讀呢個 `__reactProps$…`，所以佢出現 = handler 接通咗），
// 之後每個手勢都係**單次、唔重試**，同規格語意一致。
//
// 呢個係 React 內部命名。萬一將來 React 改名，個 gate 會 timeout **大聲紅**，
// 唔會靜靜哋變綠 —— 到時改呢一處就得。
export async function waitForHydration(page: Page, element: Locator): Promise<void> {
  await element.waitFor({ state: "visible" });
  const handle = await element.elementHandle();
  await page.waitForFunction(
    (node) => Object.keys(node as object).some((key) => key.startsWith("__reactProps$")),
    handle,
    { timeout: 15_000 },
  );
}
