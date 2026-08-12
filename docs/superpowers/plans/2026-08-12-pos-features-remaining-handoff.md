# /pos/features 覆核 —— 剩餘手尾交接（2026-08-12）

接住 [2026-08-11-pos-features-batch4-6-handoff.md](./2026-08-11-pos-features-batch4-6-handoff.md)（嗰份已收官：8 條入 = 7 做完 + 1 剔走）。
**呢份淨係講仲未做嘅嘢**，畀新 session 直接開工。

## 現況

| 項目 | 值 |
|---|---|
| `main` = `origin/main` | `2409c04` —— **已 push、production 已上線**（線上 nav／文案／分享圖都核實過）|
| 已 ship 嘅批次 | F4 `ea669df`／trivial F12+F13+F14 `b303262`／F10 `9d4de9a`／F11+F17 `a2b0758`／兩條優化 `4ee0cd1` |
| 驗證基準 | `npm run verify` exit 0 = **93 content + 5 Playwright e2e**，content suite ~8 秒 |
| Worktree | `/Users/hong/Claude/SHOPOPS/Landing-wt-pos-features-fixes`（branch 已 merge；Playwright + chromium 裝好，重用佢最慳事）|

⚠️ **開工前照做 race check**：`git -C ../Landing log --oneline -3 main` + `wt list`。呢個 repo 同時有 4 個 worktree（`pos-features-simple`／`pos-payment-wording`／`pos-public-pricing` 都仲喺度）。

🩸 **`main` repo 嘅 `node_modules` 曾經滯後**：`@playwright/test` 係喺 branch 加嘅，main 一直冇 `npm install`，所以喺 main 度跑 `npm run verify` 會 exit 2（tsc 搵唔到 `@playwright/test`）。2026-08-12 已補裝、lockfile 零改動。**唔係 code 問題**，見到類似 error 先 `npm install` 再判斷。

---

## 對帳：9 條未做，全部 2026-08-12 逐條核實過（唔係抄舊文件）

| # | 項目 | 核實證據 |
|---|---|---|
| 1 | F9 素材：Core POS 截圖出咗加購 UI | ✅ 肉眼核實 —— `kitchen-order.webp` 見到 **Recipes** 掣同 **Delivery** tab，兩個都係收費加購 |
| 2 | F15 素材：兩張圖下半空白 | ✅ 量度過 —— `floor-progress` 下半 45% 有 **98%** 近白像素、`kitchen-order` **97%**；對照 `checkout-report` 只有 **13%** |
| 3 | F16 素材：截圖寫死日期 | ✅ 肉眼核實 —— `kitchen-order.webp` 日期格寫住 `2026/08/01` |
| 4 | F18：mobile 冇 nav | ✅ `components/SiteHeader.tsx:37` 係 `hidden lg:flex`，全檔 hamburger／`aria-expanded` marker **0** 個 |
| 5 | 🆕 `PosWorkflow` 繞過 image map | ✅ `components/PosWorkflow.tsx:2-5` 有 **4** 條直接 `@/public/pos-demo/*.webp` import；由 `PosLanding.tsx:152` 同 `CompanyHome.tsx:261` 用 |
| 6 | 🆕 首頁／SiteHeader 語言切換冇互動測試 | ✅ `e2e/` 只有 `e2e/pos-image-dialog.spec.ts` 一個檔，入面 `lang=` 命中 **0** |
| 7 | 優化提案：rendered suite 應唔應該行 production build | ✅ 兩層真係唔同 mode —— `tests/helpers/next-server.mjs` 行 `next dev`，`playwright.config.ts:33` 行 `next start` |
| 8 | 優化提案：`/pos`、`/rota`、`/this-is-you` 補互動測試 | ✅ 同 #6 —— e2e 得一個 spec |
| 9 | 🆕 `--test-concurrency=1` 係鈍器 | ✅ `package.json:13`；Codex 指佢按「純 source test 檔數目」線性收費，唔係按「要 server 嘅檔數目」|

**9 入 = 9 出，零 gap。**

---

## A. 素材線（#1 #2 #3）—— 要重影，一次過做

三條全部指住同一批 demo 截圖，**唔好分三次影**。

- **F9**：Core POS 區嗰四張唔可以見到加購功能。至少要處理 `kitchen-order`（Recipes 掣 + Delivery tab）同 `order-entry`（Delivery tab）。做法二揀一：影之前喺 demo 餐廳熄晒加購模組，或者影完裁走。**熄模組較穩** —— 裁圖會改尺寸，要同步改 `tests/pos-demo-assets.test.mjs` 嘅 `expectedDimensions`。
- **F15**：`floor-progress` / `kitchen-order` 下半空得滯（實測 97–98% 近白）。要麼 demo 資料多幾張單，要麼裁短。同樣：裁就要改 expectedDimensions。
- **F16**：畫面唔好見到寫死日期。`2026/08/01` 呢種絕對日期會令張圖一年後睇落好舊。

🔑 **重影之後一定要做嘅四步**（`tests/pos-demo-assets.test.mjs` 會逐項捉）：
1. `docs/pos-demo-screenshot-register.md` 更新該行嘅 **bytes** 同 **SHA-256**（test 會即場重算對數）
2. 尺寸如有變 → 改 test 入面 `expectedDimensions`
3. **重新 tick 商標／licence 兩欄**（`ea669df` 加嘅人手閘；register 頂部寫明重影就要重 tick）
4. `order-entry` 特別 —— 佢有 pixel-level baseline test（六格食物相 mask 比對），換圖要同步換 `tests/fixtures/pos-demo-order-entry-baseline.webp`

---

## B. `PosWorkflow` 繞過 image map（#5）—— 有真風險，建議排第一

`lib/pos-feature-images.ts` 係「唯一圖片來源」呢個契約，只喺 `/pos/features` 成立。`/pos` 同首頁行 `PosWorkflow`，佢自己 import 同四張圖。

**今日仲未 drift**（兩邊指住同四個檔，已核對），但改 image map 只會更新 `/pos/features`，另外兩頁會靜靜留喺舊圖。**A 線重影素材之後就會即刻中招** —— 所以呢條應該喺重影之前做完。

做法：`PosWorkflow` 改用 `POS_FEATURE_IMAGES`，然後將 `tests/pos-content.test.mjs` 嗰個 import-graph 契約由 `PosFeaturesLanding` 一個 entry 擴到埋 `/pos` 同首頁嘅 entry。契約嘅 walker（`collectLocalImportGraph`）已經寫好，加 entry 就得。

⚠️ 動到 `/pos` 同首頁 = 兩頁 production code，要重驗嗰兩頁。

---

## C. 測試層（#6 #7 #8 #9）—— 互相糾纏，一次過拍板

四條其實係同一個問題嘅唔同切面：**e2e 只有一個 spec，而 rendered 層同 e2e 層行緊兩個 server mode。**

- #6 #8 係「加 spec」：`/pos`、`/rota`、`/this-is-you` 嘅互動，同 `SiteHeader` 語言切換（呢個順手補返 `tests/pos-features-rendered.test.mjs` 入面明寫「唔覆蓋」嗰個窿 —— 首頁語言喺 client provider 手上，SSR 一定係 `en`，fetch harness 結構上驗唔到）
- #7 係「rendered 應唔應該改行 production build」：而家一個 production 專有嘅 regression 可以兩層一齊假綠，靠 e2e 嗰句數量斷言補返
- #9 係「serialisation 點解決」：Codex 建議收埋 rendered case 落一個 server-owning 檔

**建議次序**：先拍 #7（決定 rendered 行邊個 mode）→ 佢會直接決定 #9 要唔要 restructure → 最後先加 #6 #8 嘅 spec，唔使加完再搬。

📌 **唔好重覆踩嘅坑**（已寫入 `AGENTS.md`，開工前讀）：同一個 project 目錄唔可以同時開兩個 `next dev`；`test:content` 嘅 `--test-concurrency=1` 就係為咗呢個，唔好順手拎走。

---

## D. F18 mobile nav（#4）—— 全站 pattern，獨立一案

`hidden lg:flex` 係全站寫法，唔止 `/pos/features`。手機完全冇導覽。改動範圍係 `SiteHeader`，即係全部頁面 —— 唔應該當 `/pos/features` 覆核嘅手尾嚟做，另開一案。

---

## 流程規矩（照上幾批做法，行之有效）

- **TDD**：先寫 failing test → 確認 RED → 實作 → GREEN
- **Mutation 驗證**：關鍵 assert 要人為整壞一次確認真係會紅。⚠️ 唔可以用 superset 字串（改名加後綴 → regex 照中 → 假綠），要真刪；每次 mutation 後先 `diff` 確認落咗先解讀結果；做完 grep 確認 probe 零殘留
- **⚠️ 唔好用 `git checkout <file>` 還原 mutation** —— 會連未 commit 嘅工作一齊沖走（2026-08-12 實撞，F4 做到一半冇晒）。用 `cp` 影檔案快照做還原點
- **Codex loop 到清零**：每批寫完即刻派 Codex 獨立 **read-only**（prompt 硬寫「唔准改檔」，派完 `git status` 對一對）。今次用咗 2／1／3／**8**／3 輪 —— 8 輪嗰次每一輪都揪到真嘢，唔好因為輪數多就當佢煩
- **自審完整 diff**：Codex 收 findings，但自審捉到佢冇捉嘅（今次捉到一個冇根據嘅 `as` type assertion）
- **commit 前**：`python3 ~/.claude/hooks/review_marker.py write`（要**喺 `git add` 之後**跑；⚠️ 唔可以同 `git commit` 寫喺同一句 compound command）
- **push 要問 HONG**，而且要分清楚「push branch」定「merge 落 main = 即刻上 production」

## 已知陷阱

| 陷阱 | 對策 |
|---|---|
| 派 Codex 時 prompt 含 `git commit` 字樣 → hook 誤攔 | prompt 寫入檔案，叫 Codex 去讀 |
| Codex rescue runtime 預設 write-capable | prompt 硬寫「READ-ONLY，唔准改檔」，派完 `git status` 對一對 |
| Codex sandbox 綁唔到 `127.0.0.1` | 佢跑唔到 rendered / e2e（`listen EPERM`），**唔係 test failure**。叫佢睇 code |
| `/_next/image` 睇 `Accept` header 決定格式 | `fetch` 送 `*/*` 會攞返 **JPEG**，唔好喺 optimiser output 度驗 WebP magic bytes |
| 大量 image-optimiser 請求會拖慢 dev server | 曾令隔籬條 OG test 逾時。要驗資產就攞底層靜態檔，唔好行 optimiser |
| 本地冇 `NEXT_PUBLIC_SITE_URL` → OG URL 係 `shopops-landing.vercel.app` | 正常，Vercel 上有設。唔好當 bug 修 |
| satori（`next/og`）唔係瀏覽器 | 一個 element 多過一個 child 就一定要明寫 `display: flex` |
