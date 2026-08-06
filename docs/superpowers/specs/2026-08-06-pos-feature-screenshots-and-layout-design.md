# ShopOps POS 功能實圖及頁面層級設計

日期：2026-08-06（英國時間）

## 目標

讓由 `shopops.co.uk` 進入的餐廳客戶可立即找到完整 POS 功能及價格頁，並以真實 ShopOps 示範系統畫面理解每項主要功能，而不是只閱讀文字。

## 已批准決定

1. 正式首頁頂部選單增加功能及價格入口。
2. 正式首頁 Hero 的「預約示範及免費試用設定」旁增加功能及價格入口。
3. 功能頁 Hero 的 Core POS 價格卡放在兩類加購卡上面。
4. 「進階營運功能」放在「逐項加購功能」上面。
5. 原「詳細 +£19 加購功能」改名為「進階營運功能」。
6. 「不確定需要哪些功能？」移到「逐項加購功能」下面。
7. 使用方案 A：兩欄圖片功能卡，手機單欄，圖片可按下放大。
8. 共展示 18 張 ShopOps 真實系統畫面；全部使用英文介面、示範餐廳及假資料。

## 首頁入口

### 頂部選單

新增一個獨立入口，不移除現有同頁「功能」anchor：

- English：`Features & pricing`
- 繁體中文：`功能及價格`
- 簡體中文：`功能及价格`

連結必須保留目前語言：`/pos/features?lang=${lang}`。

### Hero 次要 CTA

放在主要橙色「預約示範及免費試用設定」旁邊。主要 CTA 保持橙色；新入口使用清楚但較次要的深色／outline 樣式，避免兩個按鈕爭奪主次。

- English：`View all POS features and pricing`
- 繁體中文：`查看全部 POS 功能及價格`
- 簡體中文：`查看全部 POS 功能及价格`

Desktop 兩個按鈕並排；mobile 垂直排列並保持全寬可按。

現有首頁核心功能卡下方入口繼續保留，形成三個合理入口：top nav、Hero、core feature section。

## 功能頁 Hero 價格層級

價格卡由原本三張同級排列改為：

```text
               [ Core POS £19／月 ]
[ 逐項加購功能 +£9／月 ] [ 送貨或財務加購 +£19／月 ]
```

- Desktop／tablet：Core POS 全寬置頂；兩張加購卡在下一行並排。
- Mobile：Core POS 置頂；兩張加購卡在下面逐張全寬排列，不能因半欄太窄令文字擠迫。
- Core 卡需要視覺上最先閱讀，但三張卡保持同一設計語言。

## 功能頁內容次序

1. Hero 及價格層級。
2. Core POS 四步流程。
3. Core POS 四項主要能力。
4. 進階營運功能：兩個 `+£19` 功能。
5. 逐項加購功能：八個 `+£9` 功能。
6. 「不確定需要哪些功能？」中段 CTA。
7. 「需要知道」產品界線。
8. 最後組合例子及預約示範 CTA。

「進階營運功能」三語題目：

- English：`Advanced operations`
- 繁體中文：`進階營運功能`
- 簡體中文：`进阶营运功能`

## 18 張實圖清單（18 入 = 18 出）

### Core POS 流程（4 張，重用現有安全資產）

1. 員工輸入訂單：`public/pos-demo/order-entry.webp`。
2. 廚房收到訂單：`public/pos-demo/kitchen-order.webp`。
3. 樓面查看進度：`public/pos-demo/floor-progress.webp`。
4. 結帳及報表：`public/pos-demo/checkout-report.webp`。

### Core POS 主要能力（4 張，新拍）

5. 中英文並排：以假測試單展示前台／廚房雙語內容，不顯示客人備註。
6. 斷網後備：以假菜式建立離線 queue；不可在 production 真單上模擬。
7. 餐牌、套餐及選項：使用假分類、菜式、套餐及 modifier。
8. 手動售罄：以假菜式展示 availability toggle 及不可供應狀態。

### `+£19` 進階營運功能（2 張，新拍）

9. 網上送貨訂單：使用假 postcode、時段、最低消費、運費及取貨流程；不得顯示真實姓名、電話、地址或司機資料。
10. 財務與庫存：使用假 supplier、invoice、VAT、食材及 stocktake；不得顯示真實 invoice、供應商或財務數字。

### `+£9` 逐項加購功能（8 張，新拍）

11. 排班及打卡：假員工、availability 及 shift；不得通知真實員工。
12. 訂位：假姓名、電話、email、walk-in 及枱位時間線。
13. 顧客評價：假星級、短評及統計；不得使用真實客人留言。
14. 食安記錄：假 checklist、溫度、corrective action 及簽核。
15. 過敏原辨識：使用自製無品牌包裝標籤，顯示「建議」及人手確認，不可呈現為自動確定。
16. 食譜成本：假菜式、三種假食材、份量、單位及每份估算成本。
17. 自訂網域：使用 `demo.example.com` 之類無法誤連 production 的假 domain；不得按啟用或 recheck。
18. 廣告屏：只使用自製／有權素材及假餐牌，不使用客人相片或未授權圖片。

## 示範資料安全規則

- 只可在隔離的 demo tenant／local environment 建立資料。
- 禁止在 production tenant 執行會清空或重建資料的 seed script。
- 禁止使用真實客人、員工、電話、email、地址、評價、食譜、工資、invoice、供應商、VAT 或營業數字。
- 所有姓名、餐廳、餐牌、訂位、司機、postcode、domain 及金額均為明顯假資料。
- 截圖前逐張做 PII／商業敏感資料檢查；有疑問即重拍，不以模糊遮蓋作主要流程。
- 不觸發 email、Telegram、付款、domain provisioning、HMRC、司機通知或其他外部副作用。

## 圖片規格

- 全部使用英文 ShopOps 介面，caption 說明示範畫面為英文、系統支援英文及中文。
- 建議來源尺寸 `1280 × 900` 或 `1440 × 900`，最終裁成統一約 `1.42:1` 比例。
- 輸出 WebP；thumbnail 目標寬度 1280px，保持介面文字可讀。
- 新資產位置：
  - `public/pos-demo/core/<stable-id>.webp`
  - `public/pos-demo/add-ons/<stable-id>.webp`
- 圖片檔名只用 stable ID，不用翻譯文字。
- 使用 Next.js `Image` static import；首屏以下全部 lazy-load，不設 `priority`。
- 正常卡片 `sizes` 按 desktop 兩欄、mobile 一欄設定，避免下載不必要的大圖。

## 卡片版面

- 18 個功能均需在自己的內容附近展示對應實圖。
- Desktop／tablet：兩欄圖片卡。
- Mobile：單欄。
- 卡片順序：圖片、功能名稱／價錢、結果句、詳細內容／界線。
- 圖片不得取代文字；價格、功能界線及 CTA 仍以 HTML 顯示，方便 SEO、翻譯及無障礙工具閱讀。
- `+£19` 兩張卡可保持與 `+£9` 一致的視覺語言，但內容可更長。

## 圖片放大

- 點擊圖片開啟同頁 modal／dialog 顯示較大版本。
- 圖片本身以 button 包裹，必須可用鍵盤聚焦及 Enter／Space 開啟。
- modal 支援 Escape 關閉、可見關閉按鈕、背景點擊關閉、focus trapping 或使用符合無障礙要求的原生 dialog 行為。
- 關閉後 focus 返回原圖片按鈕。
- mobile 放大圖不可產生水平 overflow。
- alt 及開啟按鈕 accessible label 按三語內容提供，描述畫面證明的功能，不只重複產品名稱。

## Content 及資產架構

- 功能文字繼續由 `POS_FEATURES_CONTENT` 管理。
- 圖片使用 stable-ID static import map，不把圖片 path 重複放入三語翻譯物件。
- 三語 content 只新增 `imageAlt`／`imageActionLabel` 等語意文字。
- 既有 4 張 workflow image 繼續重用，避免重複資產。
- 優先擴充 `PosFeatureStory`、`PosAddOnCard` 及 `PosPremiumFeature`；只有圖片 dialog 值得新增一個小型 shared component。

## 測試及驗收

1. 18 個 stable ID 都有且只對應一張實圖：18 入 = 18 出，零 gap。
2. 所有圖片資產存在、可解碼、比例一致，且沒有異常大檔案。
3. 三語 render 相同 18 張圖及各自的 alt／accessible label。
4. 首頁 top nav、Hero secondary CTA、既有 core-section CTA 都保留語言並正確跳轉。
5. Core 價格卡在兩張加購卡之前及上方。
6. DOM section 次序符合本規格；`Advanced operations`／`進階營運功能`／`进阶营运功能` 正確。
7. 「不確定需要哪些功能？」在八個 `+£9` 功能之後。
8. Desktop 兩欄、mobile 單欄，沒有水平 overflow。
9. 圖片可用 click、Enter／Space 開啟；Escape、關閉按鈕及 focus return 正常。
10. `npm run verify` 全數通過。
11. 正式部署後逐項檢查首頁入口、價格層級、section 順序及 18 張圖片。

## 範圍外

- 不改 POS 功能、資料庫、entitlement 或產品價格。
- 不使用 AI 生成圖片代替真實系統畫面。
- 不使用 production 真實資料。
- 不新增影片、carousel、CMS、tracking 或圖片管理後台。
- 不重寫整個功能頁或建立新的設計系統。

## 研究依據

- Toast 及 Lightspeed 的官方產品頁以真實產品畫面貼近功能說明，讓客戶直接把功能和介面連結起來。
- W3C Design System 建議預設 lazy loading，並在已知比例時使用固定 frame，減少頁面跳動。
- FAO Design System 建議不要把重要文字燒進圖片，並控制圖片尺寸以兼顧速度及清晰度。

