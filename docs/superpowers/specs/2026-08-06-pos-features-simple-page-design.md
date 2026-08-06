# POS 簡單功能頁設計

日期：2026-08-06（英國時間）

## 目標

為 ShopOps POS 新增一個三語、易讀、可分享的簡單功能頁，讓餐廳客戶在不閱讀完整操作手冊的情況下，理解主要核心 POS、£9 加購功能及兩項 £19 重點功能。首頁維持精簡，功能頁負責解釋；完整操作手冊日後由獨立功能資料庫製作。

同一輪改動亦落實已批准的驗證方案：在 TypeScript 檢查前先執行本地 `next typegen`。

## 已批准方向

- 採用 C 方案：新增 `/pos/features`，不把所有詳細文字塞入 `/pos`。
- `/pos` 的核心功能區及收費區加入描述清楚的「查看完整功能」入口。
- 三語沿用現有 `?lang=en|zh-Hant|zh-Hans` 模式。
- `+£19` 的「網上送貨訂單」及「財務及庫存」使用較大的詳細區塊。
- 公開名稱固定為「網上送貨訂單／Online delivery orders」及「財務及庫存／Finance and inventory」。
- 首版只重用現有 4 張已登記 POS demo 圖，不為每個 add-on 製造未核實圖片。
- 不加入網上付款、完整卡機整合或其他未經證實的能力。
- 公開文案採短句及白話：技術詞第一次出現時附日常解釋，不直接向客戶使用 `fallback`、`draft`、`input VAT`、`XLSX`、`domain`、`slide` 等內部字眼。

## 頁面架構

### 1. Hero

- H1：ShopOps POS 功能（按語言翻譯），不使用「完整」字眼，避免暗示此簡單頁列齊 44 個 source-level 功能錨點。
- 短文說明落單、廚房、樓面及結帳在同一流程，以及核心 POS 與加購功能的關係。
- Hero 下方加入價格／產品邊界列：Core POS `£19／月`；每項加購為 `+£9／月` 或 `+£19／月`；全部 add-on 都需要 Core POS 並逐項收費。價錢由 `POS_CONTENT` 計算及顯示。
- CTA 返回 `/pos?lang=<lang>#contact` 預約示範。
- CTA 下重用現有試用 reassurance：免費試用 3 天、毋須信用卡、協助輸入餐牌；資料沿用現有 canonical offer content。

### 2. 核心 POS 流程

重用現有 4 張圖片：

1. `order-entry.webp`：員工輸入堂食或外賣自取訂單；同一核心流程亦補充堂食客人可掃枱上 QR 點餐，餐廳可設定先由員工確認。
2. `kitchen-order.webp`：廚房接收並更新準備狀態。
3. `floor-progress.webp`：樓面查看出餐進度。
4. `checkout-report.webp`：現金／卡記錄、折扣及結帳。

每張圖片配一段簡短、可核實的說明。三語頁共用英文介面圖，caption 明示「示範畫面為英文，系統支援英文及中文」。

補充短卡：

- 中英介面。
- 支援餐牌翻譯；未有譯文或翻譯服務不可用時顯示原文。
- Offline 後備。
- 餐牌、套餐及選項管理。
- 後廚手動即時售罄；暫停後從餐牌隱藏，落單時再檢查菜式是否可供應。
- 以並排短句拆清產品邊界：核心 POS 讓店員在 POS 輸入外賣自取訂單；加入 `+£19`「網上送貨訂單／Online delivery orders」後，客人可從餐廳網頁自行提交送貨訂單。不得使用「只限／只能」語意。

### 3. £9 加購功能

以 8 張短卡呈現，每張包含名稱、`+£9／月`、一個結果先行句及最多一個白話能力句。桌面兩欄、手機單欄；內容全部直接可見，不使用 accordion：

- 排班打卡：少花時間追員工更表；安排更次、收集員工可上班時間、換更及 Telegram 定位打卡。
- 訂位：減少電話來回確認；讓客人網上訂位，店員處理 walk-in、編枱、時間線及提醒。
- 顧客評價：更快發現客人意見並跟進；完成訂單／訂位後發出邀請，集中評分、留言及店方通知。
- 食安記錄：把紙本食安工作集中管理；記錄每日檢查、溫度、異常處理及簽核。
- 過敏原辨識：更快整理成分的過敏原資料；相片掃描只提出建議，再由員工確認，每張訂單重新確認客人需要。
- 食譜成本：更清楚每道菜的預計成本；管理食譜、份量、步驟及每份成本，使用量單位需與食材成本單位一致。
- 自訂網域：讓網上餐牌使用餐廳自己的網址；完成網址設定後即可使用，技術設定由示範／啟用流程交代。
- 廣告屏：用現有屏幕展示餐牌及宣傳內容；輪播圖片、影片、菜式或連結內容。

8 張 £9 卡後加入中段 CTA：「不確定需要哪些功能？預約 15 分鐘示範」，連到同語言 `/pos?lang=<lang>#contact`。

### 4. `+£19` 網上送貨訂單

使用大型 feature panel，內容包括：

- 客人從餐廳網頁自行提交送貨訂單。
- 管理 postcode 區域、時段、最低消費及運費規則。
- 訂單取貨碼及司機專用版面。
- 司機流程：取貨 → 確認取貨 → 送達／取消 → 回店現金對帳。
- 按每單及每公里設定司機薪酬；能取得行車距離時使用行車距離，否則改用直線距離估算。
- 醒目限制：目前只支援現金交易，沒有網上付款。
- Panel badge 顯示 `+£19／月`，並列實際組合例子：Core POS £19 + 網上送貨訂單 £19 = £38／月。

### 5. `+£19` 財務及庫存

使用大型 feature panel，內容包括：

- 採購、供應商、收貨及入庫。
- AI 掃描 Invoice 相片／PDF，建立待員工檢查的草稿，不會自動確認入庫。
- 提取及核對採購時支付的 VAT；資料不可靠時保留待確認狀態。
- Invoice 每行可選擇入庫或排除；排除原因包括私人用途。
- 自訂採購／庫存單位換算，例如 `1 pack = 500 g`。
- 盤點、存貨估值、實際耗用及成本、開支、人工、損益（Profit and loss）及 Excel 匯出。
- 清楚分界：財務及庫存本身按採購、盤點及耗用計算實際成本／損益；每道菜／每份的估算成本需要另加 `+£9` 食譜成本功能，並完成食譜設定。食譜用量單位須與食材成本單位一致。
- VAT 邊界：可記錄銷售及採購 VAT 並匯出資料；不會直接向 HMRC 提交 VAT Return。餐廳仍需使用可向 HMRC 報稅的會計軟件，或交由會計師處理。
- Panel badge 顯示 `+£19／月`，並列實際組合例子：Core POS £19 + 財務及庫存 £19 = £38／月；若再加食譜成本，合計為 £47／月。所有數字由 `POS_CONTENT` 計算。

### 6. 需要知道（Good to know）

集中顯示以下產品邊界，每點只用一行：

- 店員可在 POS 輸入外賣自取訂單。
- 送貨訂單目前只收現金，沒有網上付款。
- 堂食／店內結帳可記錄卡付款；實際收款使用餐廳自己的卡機，卡機供應商費用另計。
- AI Invoice 先建立待員工檢查的草稿；VAT 資料不會直接提交 HMRC。

### 7. 收尾 CTA

- 重申 Core POS 與逐項 add-on 收費關係。
- CTA 返回同語言的 `/pos?lang=<lang>#contact`。
- 重用試用 reassurance，並展示一個按所讀 section 對應的實際價錢組合例子。
- 不在功能頁重複整張 pricing table，避免兩個價錢來源漂移；價錢資料仍由 `POS_CONTENT` 單一來源提供。

## 外賣自取邊界

HONG 的產品定義是「外賣自取只由店員輸入」。現有 POS code 仍有公開 `/order/[slug]` 外賣頁及 takeaway QR，與產品定義不一致。

本 Landing 改動採用安全文案：「店員可輸入外賣自取訂單」，不宣稱「只能店員輸入」。移除／停用客人自助外賣入口屬 POS repo 的獨立後續修正，不在本 Landing scope 內。

## 元件及資料邊界

- 新增共享三語內容來源，包含 page hero、核心補充卡、£9 短卡、£19 詳細 panel 及 CTA。
- 每項 add-on 使用跨語言穩定 ID（例如 `scheduling`、`reservations`、`delivery`、`finance_inventory`）；名稱、描述及 price group 全部按 ID 對應，不用三語陣列位置或 `zip` 配對。
- 價錢、add-on 名稱與 Core requirement 仍取自現有 `POS_CONTENT[lang].pricing`；不得建立第二份硬編價錢表。
- 新頁 component 只負責排版，不能自行硬編三語產品資料。
- 4 張圖片沿用 `public/pos-demo/` 及 `next/image`；below-fold 圖片使用預設 lazy loading 與正確 `sizes`。
- Mobile 採單欄；desktop 核心圖文及 £19 panel 可雙欄。禁止橫向功能大表。

## SEO、語言及導覽

- `/pos/features` 有獨立 title、description、canonical、Open Graph、Twitter metadata 及 H1。
- Title、description 及分享文字按有效 `lang` query 產生；canonical 維持 `/pos/features`，Open Graph URL 帶當前有效 `lang`，讓分享預覽保持所見語言。
- Sitemap 加入 `/pos/features`。
- `/pos` 使用描述性文字連到詳細功能頁。
- 功能頁向 `SiteHeader` 提供三個直接語言 href；切換後仍在 `/pos/features`，並把所選語言寫入 `?lang=`，不只更新 context／localStorage。
- 所有由功能頁往返 `/pos` 的 CTA／internal link 都帶當前有效 `lang`；測試逐一驗證三語 href。
- 功能頁 server-rendered 主內容設定正確語言範圍：`en` → `lang="en"`、`zh-Hant` → `lang="zh-Hant"`、`zh-Hans` → `lang="zh-Hans"`。不依賴 hydration 後才更改語言語意。
- 首版沿用 query 語言，不新增獨立語言 URL／hreflang；這是已知 SEO 限制，不在今次擴 scope。

## 驗證方案 1

將 `package.json` 驗證流程改為使用本地 binaries：

```json
"verify": "npm run test:content && npm run lint && next typegen && tsc --noEmit && npm run contrast && npm run build"
```

- 不使用可能嘗試下載 package 的 `npx`。
- 不改 `wt`、不加 dependency、`package-lock.json` 不應變動。
- Fresh worktree 沒有 `.next`／`next-env.d.ts` 時，`npm run verify` 仍能自行產生 route types。

## 測試及驗收

1. 三語都有相同 stable ID set，以及同樣的 8 個 £9、2 個 £19 add-ons。
2. `8 入 = 8 出`、`2 入 = 2 出`，並逐 ID 驗證三語名稱、描述及 price group 對應，頁面不漏項、不串項。
3. 價錢只從 `POS_CONTENT` 讀取；頁面不另寫 `9`／`19` 的產品價錢常量。
4. 所有 add-on badge 使用 `+£9／月` 或 `+£19／月`；頁面至少驗證 Core + Delivery = £38、Core + Finance = £38、Core + Finance + Recipe Costing = £47，而且數值只由 canonical pricing content 計算。
5. 網上送貨訂單明示現金交易及沒有網上付款；核心自取與網上送貨名稱及並排邊界三語一致。
6. 財務及庫存明示 AI 結果需人手確認、私人用途排除、VAT、單位換算、實際成本與每道菜估算成本的分界。
7. VAT 邊界明示不直接提交 HMRC；卡付款邊界明示使用餐廳自己的卡機及費用另計。
8. 核心流程包含堂食 QR 點餐及可選員工確認，不會被誤列為 add-on。
9. 不出現「外賣自取只能店員輸入」的未落實聲稱。
10. 公開三語文案沒有未解釋的 `fallback`、`draft`、`input VAT`、`XLSX`、`domain` 或 `slide` 技術詞。
11. 4 張圖片、caption、alt、heading、CTA 及 navigation 全部有三語內容。
12. Keyboard、screen reader heading hierarchy、server-rendered `lang`、mobile 單欄及 WCAG 對比度通過。
13. `/pos/features` 三語 title／description／Open Graph／Twitter metadata、canonical、sitemap及 `/pos` internal links 正確。
14. 三個語言切換 href、首頁入口及所有返回 `/pos?lang=<lang>#contact` 的 CTA 都保留有效 `lang` query。
15. Fresh generated-types 狀態下執行 `npm run verify`，全部 tests、lint、TypeScript、contrast 及 build 通過；`git status` 不產生 tracked generated diff。

## 不在今次範圍

- 移除 POS 客人自助外賣頁／QR。
- 製作全部 add-on screenshot。
- 完整客戶操作手冊或 PDF。
- 新增網上付款或卡機整合。
- 修正 POS repo 內已盤點的權限／E2E 缺口。

完整功能資料庫已另存於：

`/Users/hong/Documents/Codex/2026-08-05/po/POS_FEATURE_INVENTORY_2026-08-06.md`
