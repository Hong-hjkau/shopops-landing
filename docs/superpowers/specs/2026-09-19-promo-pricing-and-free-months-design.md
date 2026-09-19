# 2026-09-19 推廣定價 + 啟用後免費期設計

## 目的

為〔SHOPOPS〕POS 推出一季限時推廣：減價、延長免費試用，並在正式啟用後加入免費期，
用來吸納第一批真實餐廳客戶。

## 已確認商業安排

1. 推廣期：**2026-09-19 至 2026-12-31**（試行一季，期滿後檢討是否定為長期標價）。
2. 價錢（推廣期內啟用的新餐廳）：
   - 核心 POS：£19 → **£8／月**
   - 標準加購（8 項）：£9 → **£4／月**
   - 進階加購（2 項：網上送貨訂單、財務及庫存）：£19 → **£8／月**
   - `workplace_safety`（系統有價但 Landing 未對外銷售）：£9 → **£4／月**，與其他標準加購看齊
3. 免費試用：3 天 → **30 天**；毋須信用卡，不會自動收費。
4. 正式確認啟用後：**首 2 個月免費**，核心與所有已選加購一律包含。
5. 資格：**每間餐廳一次**（同一老闆開分店，每間分店各自享有）。
6. 跨期：推廣期內取得報價、在報價有效期（`quote_validity_days` = 30 天）內正式啟用者，
   即使啟用日已過 2026-12-31 仍照享推廣條件。
7. 對外只顯示現價，不做劃線原價對比。

## 首期月費的計算方式（本次設計的核心）

**首期月費 = 啟用日 + 2 個月的同一日期**，之後每月同一日。
若該月份沒有相同日期（例如 1 月 31 日 + 1 個月），以該月最後一日為準，
其後恢復原本的月結日，**不可逐次累加**。

例：3 月 1 日啟用 → 免費至 4 月 30 日 → **5 月 1 日**繳付首期 → 其後每月 1 日。

### 為何刻意用「月」而不用「日」

2026-08-02 的措辭決定（`2026-08-02-pos-first-payment-wording-design.md`）已查明：
「第 N 天收費」與「按月收費」永遠對不齊——2 月只有 28 天、7 月有 31 天，
用日數表達會讓客人與系統各自算出不同的收費日。該次決定移除了當時的日數說法，
並加入測試防止它復活。

本次改動**沒有推翻**那個決定，而是沿用它：免費期長度由「30 天」改為「2 個月結週期」，
仍然禁止任何日數說法（包括「第 31 天」「第 61 天」「60 天免費」等變體）。
`tests/pos-content.test.mjs` 的 guard 已相應擴充。

⚠️ 撰寫說明文字時**不可逐字引用被禁的句子**——guard 是對整個
`lib/pos-content.ts` 做 grep，寫在註解裡同樣會觸發（2026-09-19 實際撞過一次）。

## 修改範圍（Landing）

- `lib/pos-content.ts`
  - `OFFER_TERMS` 新增 `freeMonthsAfterActivation: 2` 與 `promoEndsOn: "2026-12-31"`，
    三語共用同一份，避免各寫一套而分岔。
  - `trialDays` 3 → 30；核心與兩層加購的 `monthlyPrice` 改為 8 / 4 / 8。
  - `originalMonthlyPrice` 由 29 / 19 / 29 更正為 **19 / 9 / 19**——舊值是更早期的牌價，
    不是推廣前實收價；一季後回復標價需要依據這組數字。
    ⚠️ 目前沒有任何 component render 這個值，要做劃線對比需另行開發 UI。
  - 三語流程第 6 步改寫為免費期說法。
  - 新增 `pricing.promoNote`（三語）：推廣截止日 + 「推廣期內取得報價，在報價有效期內
    啟用一樣適用」。**刻意獨立於 `pricing.body`**——`body` 是 section 開場白，只在 `/pos`
    出現；而推廣資格必須貼著價錢講，語意上與 `vatNote` 平行。
    `/pos/features` 是獨立入口（有人由搜尋直接進入），只在 `/pos` 講過不算講過。
    兩個 component 都以 `data-pos-promo-note` 標記，rendered 測試對兩頁 × 三語各驗一次。
- `tests/pos-content.test.mjs`
  - offer guard 改為守住新條款。**禁語刻意分兩層**：
    - 層 1 只掃 offer 欄位（試用流程步驟、hero 保證、`promoNote`），可用最嚴格的規則；
    - 層 2 掃整個 `lib/pos-content.ts`，只擋「無論寫在哪裡都一定錯」的句式。
    單層寫法試過會由「漏擋」盪去「誤擋」：`/day \d+/i` 沒有字界，
    連 `Friday 1 May 2026` 都會中。日數禁語因此以**收費語境**判斷
    （`day 61` 與 `free`／`payment`／`billing` 同句才算），
    因為 `from day 61`（收費日）與 `from day 1 of service`（正常散文）句式相同。
  - 每一個展示優惠價或免費期的出口都要帶 `promoNote`：兩個 pricing section、
    `TrialJourney`（首頁與 `/pos` 共用）、兩頁的 FAQ 答案（會進 JSON-LD）。
  - shadow-copy guard 的數字改用 `\d+` 捕捉，避免下次改期又漏網。
  - 真價 assert 更新；使用虛構價驗證邏輯的測試維持不變（只更新含真實核心價的組合數）。
  - 變數 `ninePoundGroup` / `nineteenPoundGroup` 改名為 `standardGroup` / `premiumGroup`，
    名稱不再隨價錢過時。
- `tests/pos-features-rendered.test.mjs`、`e2e/pos-current-price.spec.ts`：真價與試用日數更新。

## 驗證準則

1. `npm run verify` 全數通過。
2. 對 offer guard 做 mutation，兩輪共十項全部被預期的測試捕捉：
   - 第一輪（日數說法、拆走月尾 fallback、拆走截止日、在 `PosLanding.tsx` 寫死試用日數）
   - 第二輪（Codex 覆核實測繞得過的原句）：`Your first 60 days are free`、
     網站本身語序 `30-day free trial`、中文數字「免費試用三十天」、
     「試用須信用卡、期滿自動收費」、拆走功能頁的推廣聲明、拆走報價有效期那一句
   - 第三輪（雙向）：除了「錯文案一定要紅」，同時驗「正常文案不可以被誤殺」
     （`Friday 1 May 2026`、`day 1 of service`、`Open 7 days a week`、
     `within 14 days of enquiry` 四句必須照樣通過）。
   禁語清單因此改用 `\d+`、中文數字與收費語境判斷，不再逐個數字列舉；
   免卡與不自動收費除了驗 boolean 旗標，也驗三語實際文字。

   ⚠️ 兩個反覆踩中的陷阱，寫在這裡免得下一個人再中：
   1. **解釋禁語的註解不可以逐字引用被禁的句子** —— guard 是 grep 整個檔案。
   2. **grep 一個識別字證明不到「用了它」** —— `TrialJourney` 的 props 解構
      `{ copy, promoNote, }` 本身就滿足 `/\{[^{}]*promoNote[^{}]*\}/`，
      把 JSX 裡真正那個 `{promoNote}` 拆走依然全綠。所以改為要求
      `data-pos-promo-note` 與該值出現在同一段。
3. 對外頁面三語均顯示：核心 £8、標準加購 +£4、進階加購 +£8、30 天免費試用、
   推廣截止日，且組合價由 canonical 價自動計算（核心 + 進階 = £16）。

## ⛔ 上線前置條件（這頁先上線會對客人說謊）

本頁承諾「30 天免費試用」與「啟用後首 2 個月免費」，但 POS 系統目前**兩樣都做不到**。
以下三件事未完成之前，這份 Landing 改動不可以上 production：

1. **`p5855`（全局標價 8／4／8）已 apply 到 prod** —— 否則新開的餐廳仍照舊價 19／9／19
   收費，而網站寫著 £8。
2. **`p5856`（`post_golive_trial_days` 14 → 30）已 apply 到 prod** —— 否則網站寫 30 天，
   系統第 15 天就把人鎖住。
3. **「啟用後首 2 個月免費」在 POS 側有落地做法** —— 系統目前沒有這個概念。
   最小做法是啟用時把 `restaurants.next_due_date` 設為啟用日 + 2 個月
   （`billingState()` 見 `today <= next_due_date` 即回 `ok`，不鎖店）。
   在此之前，任何依本頁文案進來的客人都會在 3 月 1 日啟用、3 月 15 日被收錢。

順序照 POS 鐵則：**先 apply migration，後 deploy code**。

## 尚待處理（POS 側，不屬本文件範圍）

系統目前沒有「啟用後免費期」這個概念，`platform_settings.post_golive_trial_days`
（prod 實際值 14）只提供啟用後的日數試用，並非月結制免費期。
另已知 `components/platform/RecordPayment.tsx` 由上次到期日逐次 `addMonths(..., 1)`，
月結日會隨月尾漂移。兩者於 POS repo 另行處理。
