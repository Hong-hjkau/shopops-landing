@AGENTS.md
@../CLAUDE.md

# Landing — ShopOps 市場 landing page

Marketing site，對外推廣 ShopOps（核心 POS 產品）。Live: [shopops-landing.vercel.app](https://shopops-landing.vercel.app)。

## 自家域名 + Email（2026-06-07 已建立）

- **域名 `shopops.co.uk`** —— 喺 Cloudflare 註冊（自動續期），已綁落呢個 Vercel 網站。
  - ⚠️ 網站而家係 **Coming Soon 暫時下架**（`proxy.ts` gate，未 ready 對外）。`shopops.co.uk` / `*.vercel.app` 打開都係 Coming Soon。上線解封見下面 LIST。
- **SHOPOPS Email（Google Workspace）** —— 主址 `hong@shopops.co.uk` + 免費 alias `hello@shopops.co.uk`（客用，同一 inbox）。SPF / DKIM / DMARC 全開。入信箱：[mail.google.com](https://mail.google.com)。
- 詳情同完整未完成 LIST 見 OneDrive memory `shopops_landing_followups.md`。

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

詳見 OneDrive memory `shopops_landing_followups.md`（完整 LIST）。域名 / Email 未完成項：

- [ ] **用 `hello@` 身份回信** —— Gmail → 設定 → 帳戶 → Send mail as 加 `hello@shopops.co.uk`
- [ ] **`www.shopops.co.uk`** —— Cloudflare 加 CNAME（+ 可選 redirect 轉去 apex）
- [ ] **網站上線解封時** —— 刪 `proxy.ts` Coming Soon gate + push、設 Vercel env `NEXT_PUBLIC_SITE_URL=https://shopops.co.uk`、Google Search Console 加 `shopops.co.uk` 新 property 重交 sitemap

## 定位與職責

SHOPOPS Landing 係為〔SHOPOPS〕**所有開發品**做 marketing & sales 嘅對外門面。

〔SHOPOPS〕係一間開發 software 嘅公司：
- 主要以**客人要求**去生產商品（接案 / 度身訂造）
- 同時亦會開發**自家商品**（例如而家開發緊嘅 POS 系統）

做 marketing / sales 內容時，要掌握三方面：

1. **了解產品本身** —— 要熟晒 POS（及其他開發品）所有 item / 功能，先講得準賣點
2. **網上搵 IDEA** —— 包括：
   - 同類商品入面，對手有但我哋未有嘅功能（功能 gap）
   - 對手做網頁 / 宣傳嘅技巧同文案說明（marketing pattern）
   - 市場上某啲商品好用又多人用嘅做法（值得借鏡嘅 reference）
3. **宣傳設計** —— 網頁、海報等對外視覺物料

> 第 2 點「網上搵 IDEA」已有 AI 自動掃描模組：`D:\Claude\ai-automations\shopops_market\`（4 個模組：gap 對手功能 gap／copy 對手宣傳技巧／ref 好用 reference 商品／visual 截圖視覺靈感），每週一 UK 09:00 跑，推 Telegram `SHOPOPS_MARKET` channel。詳見該 folder README + OneDrive memory `shopops_market_plan.md`。gap 判斷會即場讀 POS live code routes，自動跟住 ShopOps 新功能更新。
