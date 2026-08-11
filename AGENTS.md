<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ShopOps Landing — Agent 家規（Codex / 非 Claude agent 必讀）

> 俾外部 agent（主要係 Codex 做 review / 診斷）嘅精簡家規。完整 spec 喺 `CLAUDE.md`（Claude 專用，佢 import 埋呢份）。

## 項目一句話

ShopOps 嘅 marketing site（Next.js 16 App Router + React 19 + TypeScript + Tailwind v4），**production live 喺 shopops.co.uk**（Vercel，push `main` 自動 deploy）。

## 鐵則

1. **Secrets 唔准 hardcode**：全部 `process.env` 讀；env key 缺失時 API route 係 fail-graceful（503 + UI 顯示 mailto fallback）——呢個係刻意設計，唔係 bug。
2. **Brand 資訊單一來源 `lib/brand.ts`**：名 / tagline / URL / 色唔准喺 route 內 hardcode；OG 圖一律用 `lib/og.tsx` 共用 renderer，唔好每條 route 自己砌。
3. **SEO**：sitemap / canonical / OG 全部指 `https://shopops.co.uk`（`NEXT_PUBLIC_SITE_URL`）。
4. **文字對比要過 WCAG**：dual-theme 橙色分兩隻（light/dark 各一），有 prebuild 對比閘；新 CTA / badge 顏色唔好裸寫一隻橙走天涯。
5. **Vercel Hobby plan 限制**：cron 一日一次、env 條數有限、商業條款限制——唔好提案加超出 Hobby 嘅 webhook / cron / 功能而唔標明要升 plan。

## Review 輸出要求

- 每個 finding 要 `file:line` + 具體 failure scenario；唔收純 style / naming nit。
- Focus：SEO 正確性、form / rate-limit 安全、env 缺失 fallback、對比度 / 可讀性。
- 驗證基準：`npm run verify` 過到先算 clean（= content tests → ESLint → typegen → tsc → WCAG 對比閘 → production build → Playwright 互動測試）。

## 測試分兩層，唔好混

| 層 | 位置 | 跑法 | 驗到咩 |
|---|---|---|---|
| Content / rendered | `tests/*.test.mjs`（`node --test`）| `npm run test:content` | 靜態 HTML。自己 spawn `next dev`，`fetch()` 返 HTML 用 regex 驗。**冇 DOM、冇 JS、冇互動。** |
| 互動 | `e2e/*.spec.ts`（`@playwright/test`）| `npm run test:e2e` | 真 Chromium 食 production build（`next start`）。鍵盤、focus、native `<dialog>`、accessibility tree。 |

- **`npm run test:e2e` 自己會先 `npm run build`**，唔使你手動 build（手動 build 多一次係浪費）。咁樣保證一定測緊最新 source —— `playwright.config.ts` 頂部個 `.next/BUILD_ID` guard **只**證明「build 過」，證明唔到「係最新」，所以唔好靠佢，要行 npm script。
- **`showModal()` 冇得用 jsdom 驗**（[jsdom#3294](https://github.com/jsdom/jsdom/issues/3294) 由 2021 開到而家仲未實作）。所以呢個 repo **唔會**加 vitest + jsdom 去測 dialog —— 一定要真瀏覽器。
- Playwright 唔設 retry：flaky 要即刻見到，唔好用重試冚住。
- **等 hydration 唔可以用 `toBeEnabled()`**（button 本來就冇 disabled，SSR HTML 一出就成立），**亦都唔可以「重試同一個手勢直到成功」**（會將規格嘅「撳一下就開」偷偷變成「若干秒內重複撳會開」，反而冚住「第一下被 hydration 食咗」呢個真 UX 問題）。用 `waitForHydration()` 等 React 喺元素上面掛好 `__reactProps$`，然後每個手勢都係單次唔重試。
- `verify` 入面 `npm run contrast` 同 build 嘅 `prebuild` 都會跑對比閘，**係刻意重複**：前者行喺 chain 早段，衰咗即刻死，唔使等成個 build。
