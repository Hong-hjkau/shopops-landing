import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

// 3000-3004 畀 dev server 同各個 worktree 佔咗（見 wt list），行遠啲避開。
const PORT = 3210;

// 呢個 suite 行 production build 唔行 dev server：驗到嘅係真正 ship 出去嗰個版本。
// `npm run test:e2e` 本身包住 `npm run build`，所以行正常途徑一定係最新 source。
// ⚠️ 下面個 guard 淨係畀「直接跑 npx playwright test」兜底 —— 佢只證明「build 過」，
// 證明唔到「係最新」。唔好靠佢當保證，要行 npm script。
// 用 process.cwd()：Playwright 將 config transpile 成 CJS，`import.meta` 用唔到。
// npm script 一律由 package root 起步，所以 cwd 就係 repo root。
if (!existsSync(join(process.cwd(), ".next", "BUILD_ID"))) {
  throw new Error(
    "互動測試要 production build，而家搵唔到 .next/BUILD_ID。跑 `npm run test:e2e`（佢會自己 build）或者 `npm run verify`。",
  );
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // 唔設 retry：flaky 要即刻見到，唔好用重試冚住（守則 #8 no silent failure）。
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // 唔用 on-first-retry：retries 係 0，咁樣就永遠唔會有 trace 可以睇。
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start --hostname 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}/pos/features?lang=en`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
