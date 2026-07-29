# SHOPOPS Landing — POS 主導首頁及產品頁內容重整

- **日期**：2026-07-27
- **Project**：shopops-landing（`/Users/hong/Claude/SHOPOPS/Landing`）
- **狀態**：設計已獲 HONG 批准，待寫實施計劃
- **範圍**：首頁 `/`、POS 專頁 `/pos`、英文／繁中／簡中內容

---

## 1. 背景與已確認事實

〔ShopOps POS〕已完成，可以即時安排示範及免費試用，但目前未有正式餐廳客戶。免費試用並非自助開戶：ShopOps 需要先了解餐廳需要、協助輸入餐牌及完成設定。

目標客群同時包括：

- 英國本地獨立餐廳老闆；
- 英國華人餐廳老闆。

兩類客群會透過不同 Facebook 群組及不同語言的 post 進站，但共用同一個三語網站。POS 成為首頁絕對主角；Rota 與度身訂造軟件服務保留，但降為次要內容。

本設計取代 2026-06-19 公司首頁 spec 內「公司服務主導首頁」及任何暗示產品已有真實餐廳客戶的內容。視覺沿用目前 production 的 dual-theme：黑色 Hero／header 配白色內文 sections；不恢復 2026-07-16 舊 spec 原先提出、其後已被取代的全站黑底。

## 2. 目標與成功準則

### 目標

1. 訪客在首頁第一屏理解 ShopOps 是一套管理落單、廚房及結帳的餐廳 POS。
2. 清楚說明產品已可示範及試用，但不暗示已有正式客戶或實際營運紀錄。
3. 先解釋餐廳基本工作流程，再介紹進階功能。
4. 將中英雙語、離線後備、零直接訂單佣金及彈性硬件方案變成容易理解的利益點。
5. 讓訪客準確預期免費試用需要 ShopOps 協助設定。

### 成功準則

- 首頁主 navigation、Hero 及主要 CTA 全部以 POS 為中心。
- 首頁及 `/pos` 不再出現未有證據支持的客戶、實戰或競品 claims。
- CTA 統一為預約示範及免費試用設定，不使用自助式 `Start free trial`。
- 英文、繁中及簡中三版保持相同事實、流程與承諾。
- 清楚交代可使用現有 iPad、Android 平板、電腦或手機；打印機及收銀機可另購並預先設定。
- 訪客可從頁面理解「Facebook post → 預約 Demo → ShopOps 設定 → 3 日免費試用 → 正式啟用首 30 日免費 → 首次扣月費」的完整流程。
- Facebook post 可透過 `?lang=en`、`?lang=zh-Hant` 或 `?lang=zh-Hans` 直接開啟指定語言，並記住訪客選擇。
- SEO、OG、Twitter metadata 及結構化資料以全英國為服務範圍；Edinburgh 只保留為公司所在地。

## 3. 定位與訊息層級

### 主定位

> One POS for orders, kitchen and checkout.

〔ShopOps POS〕是一套為英國獨立餐廳而設的中英雙語 POS，整合 QR 點餐、員工落單、廚房看板及離線後備。

### 訊息優先次序

1. 一套 POS 管理落單、廚房及結帳。
2. 英文及中文可在客人、樓面及廚房各自使用。
3. 已可預約 Demo 及由 ShopOps 協助設定免費試用。
4. 可使用現有設備，亦可另購預先設定好的硬件。
5. 自家 ShopOps 訂單渠道不收 ShopOps 交易佣金。
6. 可按餐廳需要選擇其他功能組；詳細分類留待完整功能盤點後才公開。

「減少外賣平台佣金」保留為重要使用場景，但不再代表整套產品的主定位。

## 4. 轉換流程與 CTA

### 真實轉換流程

`Facebook post → POS 頁面 → 預約 Demo → 了解餐廳需要 → ShopOps 輸入餐牌及設定 → 3 日免費試用（毋須信用卡） → 決定正式使用並提交完整餐廳、聯絡及付款資料 → 正式啟用首 30 日免費 → 第 31 日首次扣月費`

### 主要 CTA

英文：

> Book a demo & free trial setup

繁中：

> 預約示範及免費試用設定

簡中：

> 预约演示及免费试用设置

補充：

> 3-day free trial · No card needed for the trial · We set up your menu for you

不使用 `Start free trial`，因為訪客不能自行開戶後立即開始。試用階段不收信用卡資料及不會自動收費；只有客人決定正式使用時，才收集完整餐廳、聯絡及付款資料。正式啟用後首 30 日免月費，第 31 日才首次扣月費。

## 5. 首頁資訊架構

### 5.1 POS Hero

採用 HONG 在視覺比較中選定的 **B 方案：Logo＋POS 訊息同一個黑色 Hero**。

- 保留現時黑底及原有發光 S Logo；不換 Logo、不刪發光效果。
- 桌面版：左邊 Logo，右邊主標題、副標題、主要 CTA 及低風險補充。
- 手機版：Logo 在上，文字及 CTA 在下，全部保持在同一個黑色 Hero。
- 訪客毋須向下捲動，即可同時看到品牌、產品定位及 Demo CTA。
- 不在 Logo 圖上疊大量文字。
- 真實 POS 畫面移到 Hero 緊接的產品操作 section，避免第一屏同時爭奪 Logo、文案及產品截圖三個焦點。
- Hero 延續目前 production 的黑底視覺；下方內容維持白底。
- 截圖只使用虛構餐廳、假餐牌及假訂單；不得顯示登入、付款或其他私人資料。

英文：

> **One POS for orders, kitchen and checkout.**
>
> A bilingual restaurant POS for independent UK restaurants — QR ordering, staff ordering, live kitchen screens and offline backup in one system.

繁中：

> **落單、廚房、結帳，一套 POS 全部處理。**
>
> 為英國獨立餐廳而設的中英雙語 POS，整合 QR 點餐、員工落單、廚房看板及離線後備。

簡中：

> **点餐、厨房、结账，一套餐饮 POS 全部处理。**
>
> 为英国独立餐厅而设的中英双语 POS，整合扫码点餐、员工点餐、厨房看板及离线备用。

### 5.2 真實產品畫面及訂單流程

用 Demo account 截取四張真實產品畫面說明：

`客人 QR／員工落單 → 廚房即時收到 → 樓面追蹤出餐 → 結帳及報表`

桌面／平板畫面用於主要流程；手機畫面只用於確實適合手機操作的功能。實施計劃需列明四個截圖狀態、語言及遮罩要求，不可用程式砌出的 marketing mockup 冒充真實產品截圖。

### 5.3 四個快速利益點

- English and Chinese throughout
- No ShopOps commission on direct orders
- Keep taking orders if the internet goes down
- Use existing devices or choose ready-to-use hardware

離線文案在實施時必須與實際離線功能邊界一致，不可寫成所有功能永久不中斷。

### 5.4 核心 POS 功能

首頁只展示餐廳老闆首先需要確認的基本能力：

- QR 及員工落單；
- 廚房即時看板；
- 堂食、外賣及預訂；
- 結帳、折扣、退款及埋數；
- 離線後備；
- 餐牌及售罄管理。

進階功能留在 `/pos` 詳述。

### 5.5 中英雙語工作流程

核心例子：

> Customers can order in English while kitchen staff view the same order in Chinese.

重點是同一張單可按使用者顯示不同語言，而不是只宣傳網站有語言切換。

### 5.6 硬件選擇

先消除「是否需要購買一整套新硬件」的疑慮：

- 使用現有 iPad、Android 平板、電腦或手機；
- 由 ShopOps 協助確認兼容性及設定；
- 或另購打印機及收銀機硬件；
- 另購硬件在寄出前完成設定，收到後連接 Wi-Fi 即可使用。

### 5.7 免費試用流程

1. 預約免費 Demo；
2. ShopOps 了解餐廳流程；
3. ShopOps 輸入餐牌及設定；
4. 餐廳開始 3 日免費試用，毋須信用卡；
5. 客人決定正式使用後提交完整餐廳、聯絡及付款資料；
6. 正式啟用後首 30 日免月費，第 31 日首次扣月費。

### 5.8 第二次 CTA

> See how ShopOps would work in your restaurant.

按鈕沿用 `Book a demo & free trial setup`。

### 5.9 次要產品與服務

- Rota：員工排班及打卡；
- Custom software：按需要度身訂造。

只使用較細的內容卡，不與 POS 平起平坐。

### 5.10 FAQ、聯絡表及 Footer

聯絡表需配合 guided setup，收集足以安排 Demo 的最少資料，不在首版加入冗長資格審查。

## 6. POS 專頁資訊架構

1. **產品 Hero**：一套 POS 管理全店核心流程；Demo／免費試用設定 CTA。
2. **真實操作畫面**：從 Demo account 截取員工落單、廚房新單、樓面進度、結帳／報表；全部使用虛構資料。
3. **完整訂單旅程**：由落單到記錄。
4. **適用餐廳場景**：只列實際已完整支援的堂食、外賣、預訂、多分店等場景。
5. **核心 POS 功能**：把現時 `Beyond the exclusives, the basics are rock solid` 搬到進階功能之前。
6. **中英雙語**：以同一張單在客人、樓面、廚房顯示不同語言作示範。
7. **硬件選擇**：現有設備或預先設定好的另購硬件。
8. **可選功能組**：本輪只用概括文案，不公開逐項 included／add-on 分類。入貨單、食安、AI 發票、分析、候位、Rota 等詳細分類，待所有功能完整盤點及商業決定後另行加入。
9. **外賣平台佣金使用場景**：保留計算器，但降為其中一個 business case。
10. **轉用及免費試用流程**：Demo → 兼容性／流程確認 → 餐牌設定 → 3 日試用（免信用卡） → 提交正式資料 → 正式啟用首 30 日免費 → 第 31 日首次扣月費。
11. **收費方式**：月費 POS 計劃＋可選功能組；清楚分開軟件、硬件及付款處理費，但本輪不公開尚未確認的逐項功能分類。
12. **FAQ**。
13. **最後 CTA**。

## 7. 硬件文案

### 英文

> **Use what you already have — or choose a ready-to-use setup**
>
> Run ShopOps on your existing iPad, Android tablet, computer or phone. You don’t need to buy new hardware to get started.
>
> Need a complete till setup? Receipt printers and till hardware are also available separately. We configure everything before delivery — simply connect to Wi-Fi when it arrives and start using it.

### 繁中

> **用現有設備即可開始，亦可選購設定完成的硬件**
>
> ShopOps 可在現有的 iPad、Android 平板、電腦或手機上使用，開始試用毋須購買新硬件。
>
> 如果需要完整收銀設備，我們亦可另外提供收銀機及打印機。所有設定會在寄出前完成，收到後連接 Wi-Fi 即可使用。

### 硬件 FAQ

> **Do I need to buy new hardware?**
>
> No. ShopOps works on iPad, Android tablets, computers and mobile phones. We’ll help confirm that your devices are suitable and set everything up. Optional pre-configured till hardware and receipt printers are also available separately.

「兼容」只代表可運行 ShopOps；現有打印機、錢箱、付款終端等周邊是否兼容，仍需逐項確認。

## 8. 收費與佣金文案原則

目前 `One price, everything included` 與 `Add-on modules` 互相衝突，改為：

> A monthly POS plan, with optional modules available to match your restaurant. We’ll confirm what is included in your quote before you start.

繁中：

> POS 採用月費計劃，另有不同可選功能組。我們會在開始試用前，清楚確認報價所包含的功能。

本輪只公開已確認的核心 POS 能力。入貨單功能組及其他進階功能尚未完成分類，不可由實作者自行判斷或公開 included／add-on 歸類；完成功能盤點後，另行設計功能比較表。

直接訂單佣金需寫成：

> No ShopOps commission applies to orders placed through your own ShopOps ordering channels. Card-processing fees remain separate.

不可暗示 ShopOps 能免除外賣平台本身的合約費用，亦不可將所有 Deliveroo、Uber Eats 或 Just Eat 合約寫成同一固定佣金率。

## 9. 必須移除或避免的 Claims

- `Systems already running in real businesses`
- `Used and refined daily in a real business`
- `Forged in real use`
- `Not demo ware`
- 任何暗示已有正式餐廳客戶、客戶成果或已驗證可靠性紀錄的句子
- `One price, everything included`（若存在 optional add-ons）
- `You won’t find on a typical POS`、`Most POS systems stop...` 等未有逐項競品證據的比較
- `Deadlines never slip`、`takes over instantly` 等絕對保證
- 把 POS 說成完全取代 Deliveroo／Uber Eats

可以用真實產品畫面、功能示範、清楚試用流程及硬件設定服務建立信任，不虛構 social proof。

## 10. Navigation 與 Facebook 流量

首頁 navigation 以 `POS`、`Features`、`Demo` 為主；Rota、Custom Software、Blog 保留為次要入口。

Facebook：

- 本地英文群組：英文 post，主打簡單管理落單、廚房及結帳；
- 華人群組：繁中或簡中 post，額外突出前台英文、廚房中文；
- 英文 post 連到 `/pos?lang=en`；
- 繁中 post 連到 `/pos?lang=zh-Hant`；
- 簡中 post 連到 `/pos?lang=zh-Hans`；
- `LangProvider` 在初次 render 前讀取及驗證 `lang` query；有效值優先於舊有 `localStorage` 偏好，直接顯示指定語言並寫入既有語言偏好。
- 無 `lang` query 時沿用訪客上次選擇；首次到訪且沒有紀錄時預設英文。
- 無效 `lang` 值忽略並按上述無 query 規則處理。之後訪客手動切換語言仍照現有方式記住選擇；
- Facebook post 不作超出網站及產品現況的額外承諾。

## 11. 全英國 SEO 與分享預覽

- `/pos` metadata、Open Graph、Twitter card 及 POS 結構化資料由 Edinburgh 改為 UK-wide。
- 建議英文 title：`ShopOps POS — Bilingual Restaurant POS for UK Restaurants`。
- description 需包含 QR ordering、staff POS、live kitchen screen、offline backup 及 bilingual，不作客戶或實戰 claims。
- `areaServed` 使用 United Kingdom，不再只限 Edinburgh。
- Footer／聯絡區可保留 `Based in Edinburgh`，清楚區分公司所在地與產品服務範圍。
- 三種指定語言入口共用 `/pos` canonical，避免 query URL 被當成三個重複 SEO 頁面；本輪不建立 `/zh-hant/pos` 等獨立路由。

## 12. 非目標

- 不在沒有真實客戶前加入 testimonial、客戶 logo 或 case study。
- 不建立兩套獨立網站。
- 不在本輪改動 POS 產品功能、已確認的 3 日試用、首 30 日免費或價格。
- 不承諾未經確認的硬件／付款服務兼容性。
- 不把 Rota 或 custom software 從網站刪除。
- 不改動目前 production 的黑色 Hero／header＋白色內文 dual-theme。
- 不在功能盤點完成前公開入貨單或其他可選功能組的逐項分類及價錢。

## 13. 驗收要求

1. 英文、繁中、簡中三版逐項對帳，沒有遺漏 section 或事實分歧。
2. 全站搜尋本文件第 9 節禁用 claims，公開頁面零命中。
3. CTA 不出現自助式 `Start free trial`。
4. 首頁第一屏及主 navigation 明確以 POS 為中心。
5. `/pos` 的核心功能排列在進階功能及佣金計算器之前。
6. 硬件文案完整包含四類現有設備、另購硬件、預先設定及連 Wi-Fi 即用。
7. 試用文案逐項寫明：3 日、免信用卡、不自動收費、正式使用才收完整資料、首 30 日免費、第 31 日首次扣月費。
8. 收費文案不再同時聲稱 `everything included` 及 optional add-ons，亦不出現未獲批准的逐項 add-on 分類。
9. `/pos?lang=en`、`/pos?lang=zh-Hant`、`/pos?lang=zh-Hans` 首次載入即分別顯示英文、繁中、簡中，並覆蓋舊語言偏好；無 query 沿用舊偏好、首次無偏好預設英文；無效 `lang` 不破壞頁面；canonical 保持 `/pos`。
10. SEO、OG、Twitter 及結構化資料的服務範圍為 United Kingdom；Edinburgh 只作公司所在地。
11. 四張產品圖均來自 Demo account、使用虛構資料，並通過桌面及手機私隱檢查。
12. 手機及桌面視覺檢查：維持黑色 Hero／header＋白色內文；桌面 Hero 為左 Logo／右文案，手機 Hero 為上 Logo／下文案；第一屏、訂單流程、硬件區、試用流程及 CTA 可清楚閱讀。
13. `npx tsc --noEmit`、`npm run build` 及現有對比度檢查全部通過。
