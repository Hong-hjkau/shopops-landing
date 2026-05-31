# ShopOps Landing Page

對外推廣 ShopOps（Edinburgh 餐廳點餐管理系統）嘅 marketing landing page，獨立於 ShopOps app。

## 技術 stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind v4
- Resend (contact form 後端)

## 本地開發

```powershell
npm install
cp .env.local.example .env.local   # 然後填入 Resend key
npm run dev
```

預設 port 3000，被佔住會自動跳 3001。

## 環境變數

| 名 | 用途 | 哪裡攞 |
|----|------|------|
| `RESEND_API_KEY` | Contact form 發 email 嘅 API key | https://resend.com/api-keys (免費 100 emails/day) |
| `CONTACT_TO_EMAIL` | 收 lead email 嘅地址 | 你自己 email |
| `CONTACT_FROM_EMAIL` | Email 嘅 from address | 預設 `onboarding@resend.dev`，或用 verified domain |

冇設 key：API route 會 return 503，form UI 顯示「發送失敗」message，user 仍然可以撳 mailto fallback。

## 部署到 Vercel

### 一次性 setup

1. 喺 [github.com/new](https://github.com/new) 開新 repo（e.g. `shopops-landing`），**唔好** init README
2. 本地 commit + push（已 `git init`、staged 晒，仲未 commit）：
   ```powershell
   cd D:\Claude\SHOPOPS\Landing
   git commit -m "Initial commit: ShopOps landing page MVP"
   git remote add origin https://github.com/<你 username>/shopops-landing.git
   git push -u origin main
   ```
3. 去 [vercel.com/new](https://vercel.com/new) → Import 呢個 repo → Deploy
4. Vercel project Settings → Environment Variables 加：
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`（optional）
5. Redeploy 一次令 env var 生效

### 後續更新

`git push` 之後 Vercel 自動 build + deploy。

## 結構

```
app/
├── layout.tsx               → 全站 metadata + OG 設定
├── page.tsx                 → Landing 主頁（Hero / Features / Contact form）
├── opengraph-image.tsx      → 動態生成 1200×630 OG image（分享預覽用）
├── globals.css              → Tailwind import
└── api/
    └── contact/route.ts     → Resend 發信 API
```

## OG image 預覽

本地：http://localhost:3001/opengraph-image

部署後可用 [opengraph.xyz](https://www.opengraph.xyz/) 貼網址驗。
