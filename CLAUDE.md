@AGENTS.md
@../CLAUDE.md

# Landing — ShopOps 市場 landing page

Marketing site，對外推廣 ShopOps（核心 POS 產品）。Live: [shopops-landing.vercel.app](https://shopops-landing.vercel.app)。

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind v4
- Resend (contact form 後端)
- Upstash Redis（rate limit，見 OneDrive memory `reference_upstash_ratelimit.md`）

## 部署

- GitHub repo：[Hong-hjkau/shopops-landing](https://github.com/Hong-hjkau/shopops-landing)
- Vercel auto-deploy on push to main

## 環境變數

| 名 | 用途 |
|----|------|
| `RESEND_API_KEY` | Contact form 發 email |
| `CONTACT_TO_EMAIL` | 收 lead email 嘅地址 |
| `CONTACT_FROM_EMAIL` | Email 嘅 from address |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limit |

冇設 key：API route fail-graceful（503 + UI 顯示 mailto fallback）。

## Marketing-specific 守則

呢部分而家**未寫**，動工時陸續補：

- Hero 設計原則（CTA 文案、視覺風格）
- Pricing 表結構（同 [POS/CLAUDE.md](../POS/CLAUDE.md) 嘅商業化 anchor 對齊）
- SEO 守則（meta / Open Graph / sitemap）
- Conversion funnel 跟蹤（Vercel Analytics + Web Vitals）
- A/B test 嘅變數記錄（若有）

## 待動工 phase

詳見 OneDrive memory `shopops_landing_followups.md`：
- Phase A-E：自家 domain (`.co.uk`) + Resend domain-scoped key（減 leak blast radius）
- 細項：Logo 壓縮、Form `error` state auto-reset
