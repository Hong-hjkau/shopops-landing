# ShopOps 首頁 POS 功能詳情入口設計

日期：2026-08-06（英國時間）

## 問題

正式首頁 `/` 沒有任何連結前往 `/pos/features`。現有兩個入口只出現在 `/pos`，一般由 `shopops.co.uk` 進入的客戶無法找到新功能及價格頁。

## 已批准方案

在首頁「餐廳每日要做的事，一套系統處理」核心功能卡區塊下方，加入一個明顯的橙色 CTA 按鈕。桌面版及手機版都顯示。

不修改頂部選單，不在 Hero 增加第二個 CTA，避免與「預約示範」競爭。

## 三語文字及連結

- English：`View all POS features and pricing` → `/pos/features?lang=en`
- 繁體中文：`查看全部 POS 功能及價格` → `/pos/features?lang=zh-Hant`
- 簡體中文：`查看全部 POS 功能及价格` → `/pos/features?lang=zh-Hans`

按鈕必須跟隨首頁目前語言，不能跳回其他語言。

## 顯示位置及樣式

- 位置：`CompanyHome` 的核心功能 `CardGrid` 正下方。
- 樣式：沿用網站現有橙色主 CTA 樣式，具備 hover、focus-visible 及足夠對比度。
- 不改變現有 section 排列。
- 不新增另一個 component；改動保持最小。

## 驗收條件

1. 首頁 rendered output 在三種語言各有一個 `/pos/features?lang=...` 入口。
2. 三種語言按鈕文字完全符合本文件。
3. 按鈕出現在核心功能卡後、下一個 section 前。
4. Desktop 及 mobile 都可見，沒有水平 overflow。
5. 鍵盤 focus 樣式清楚。
6. `npm run verify` 全部通過。
7. 正式部署後，直接在 `https://shopops.co.uk/` 看得到入口並可進入正確語言功能頁。

## 範圍外

- 不修改 `/pos/features` 內容或價格。
- 不修改頂部 navigation。
- 不修改 Hero 或「預約示範」CTA。
- 不新增 tracking、動畫或其他功能。

