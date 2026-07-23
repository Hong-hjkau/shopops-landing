<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
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
- 驗證基準：`npx tsc --noEmit` + `npm run build` 過到先算 clean。
