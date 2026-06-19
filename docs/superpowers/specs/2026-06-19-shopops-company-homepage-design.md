# SHOPOPS 公司首頁 — 設計 spec

- **日期**：2026-06-19
- **Project**：shopops-landing（`D:\Claude\SHOPOPS\Landing`）
- **狀態**：設計定案，待寫實作計劃

---

## 1. 背景與目標

現有首頁 `/` 係**賣 ShopOps POS 畀餐廳**嘅產品頁（痛點卡、功能、慳錢計算機、Pricing、FAQ、聯絡）。

HONG 要把首頁**重新定位**成介紹〔SHOPOPS〕**呢間公司**：一間做度身訂造軟件、業務自動化、AI／數據、同自家現成產品嘅軟件團隊。POS 變成佢其中一件自家產品。

呢個定位同 `Landing/CLAUDE.md`「定位與職責」一致（接案度身訂造 + 自家商品）。

### 成功準則
1. `/` 顯示公司簡介，四類服務、自家產品 showcase、雙 CTA。
2. 現有 POS 內容**原封**搬去 `/pos`，文案 / mockup / 計算機零重寫。
3. 兩版共用 nav / 聯絡表 / footer / 語言切換，改一處兩版跟。
4. 語言（繁／简／EN）喺 `/` ↔ `/pos` 跳版唔 reset。
5. `/pos` 保留現有 Edinburgh 本地 SEO；`/` 用公司導向、不綁地區嘅新 SEO。
6. `tsc` 乾淨 + `next build` 綠 + 真機行為核實（雙 CTA、語言記憶、SEO 輸出）。

---

## 2. 路由結構

| 網址 | 內容 | SEO 主打 |
|------|------|---------|
| `/` | **新**：SHOPOPS 公司簡介 | 軟件開發 / 業務自動化（不綁地區）|
| `/pos` | 現有 POS 餐廳內容整批搬過去 | Edinburgh 餐廳 POS（**承繼**現有排名）|
| `/blog` | 不變 | 不變 |

- `/` 嘅副 CTA「睇產品」+ 產品 showcase 嘅 POS 卡 → `/pos`
- `/pos` nav 加 link 撳返公司首頁 `/`

---

## 3. 公司首頁內容（由上到下）

> 以下繁體文案係定稿基礎；简／EN 鏡像翻譯，跟現有 inline dict pattern。語氣：平實、實在，唔過度推銷。

### 3.1 Hero（黑底 + logo + 橙 CTA）
- **大標題**：度身訂造軟件 × 業務自動化，幫你慳返重複工夫
- **副標**：SHOPOPS 係一隊軟件團隊。由餐廳 POS 到內部工具、數據自動化、AI 應用 —— 你話畀我哋知個痛點，我哋幫你整一套真係用得着、唔使俾佣金、唔使受制於人嘅系統。
- **主 CTA**：免費諮詢（→ `#contact`）
- **副 CTA**：睇我哋嘅產品（→ 頁內 `#products`）

### 3.2 服務四柱（4 格卡）
1. 🔄 **業務流程自動化** — 把重複手動工序自動化：報表、提醒、數據收集、定時任務、Telegram／email 通知，慳返人手、唔會漏。
2. 🛠️ **度身訂造軟件 / 系統** — 按你需求開發 web app、內部工具、管理後台、dashboard。唔使硬塞現成軟件，啱你流程先做。
3. 🤖 **AI / 數據分析** — LLM 應用（摘要 / 分類 / 客服）、數據監控、市場 / 評價 / 信號掃描，幫你由數據攞到決策。
4. 📦 **自家現成產品** — 已經做好、即裝即用嘅 SaaS，唔使從零開發。

### 3.3 自家產品 showcase（`#products`）
三張產品卡：
- **ShopOps POS** — 餐廳點餐 / POS / 廚房看板 / 離線後備。✅ live →「了解更多」撳入 `/pos`。
- **Reviewscope** — 餐廳評價監察。「了解更多」→ `#contact`（首版無獨立頁）。
- **Rota** — 員工排班 + 打卡出席。「了解更多」→ `#contact`（首版無獨立頁）。

> **首版決定（HONG 拍板）**：只有 POS 有獨立頁；Reviewscope / Rota 嘅卡撳「了解更多」直接導去聯絡表 `#contact`。對外賣點一句草稿，實作時可微調。

### 3.4 點解揀 SHOPOPS（信任區，3 點）
- 🤝 **直接溝通、唔外判** — 同實際做嘢嗰個人傾，唔使隔幾層。
- 🍜 **由實戰磨出嚟** — 產品喺真生意（餐廳）日日用住改出嚟，唔係 demo ware。
- 🔓 **你嘅嘢係你嘅** — 零佣金、唔鎖數據、唔綁約。

### 3.5 聯絡（共用 ContactSection）+ Footer（共用）
- 公司版聯絡文案：標題「想傾個項目，或者想了解多啲？」、placeholder 改成項目導向（唔再係「餐廳名 / 幾多枱」）。

---

## 4. 技術架構

### 4.1 關鍵約束：metadata 只能喺 Server Component
現有 `app/page.tsx` 係 `"use client"`，靠**根 `layout.tsx`** 出 metadata + JSON-LD（全站共用）。Next.js 嘅 `export const metadata` 只喺 Server Component 有效。

要做到 `/` 同 `/pos` 各自 SEO，必須把**互動內容**（useState、表單、語言）拆入 client component，`page.tsx` 做 server 殼負責出 metadata + JSON-LD。

### 4.2 檔案結構（目標）

```
app/
  layout.tsx          server — 包 <LangProvider>，中性 default metadata，移走 POS-specific JSON-LD
  page.tsx            server — 公司 metadata + Organization JSON-LD，render <CompanyHome/>
  pos/
    page.tsx          server — POS metadata + SoftwareApplication JSON-LD，render <PosLanding/>
  sitemap.ts          加 /pos entry
components/
  LangProvider.tsx    client — Lang context + localStorage 記憶；export useLang()
  SiteHeader.tsx      client — logo + 語言 toggle + CTA；nav links 按版用 prop 傳入
  SiteFooter.tsx      共用 footer
  ContactSection.tsx  client — 聯絡表單（共用機制），文案用 prop（公司版 / POS 版兩套）
  CompanyHome.tsx     client — 新公司首頁內容 + 自己 dict
  PosLanding.tsx      client — 現有 page.tsx 內容原封搬入（只改：接共用 component + nav links + 加返公司首頁 link）
lib/
  i18n.ts             Lang type（不變或加 re-export）
```

### 4.3 共用層拆法（啱 CLAUDE.md #9）
- **LangProvider**：`createContext<{lang, setLang}>` + `useState` 初值由 `localStorage` 讀（key 例 `shopops-lang`），`setLang` 同步寫返 localStorage。掛喺根 `layout.tsx` body 包住 `{children}`。兩版用 `useLang()` 攞同一個語言狀態 → 跳版唔 reset。
  - SSR 安全：初值 server 端用 `"zh-Hant"`，client mount 後由 localStorage hydrate（避免 hydration mismatch，用 `useEffect` set）。
- **SiteHeader**：logo + 三語 toggle（搬現有 markup）+ 右上 CTA。nav links 由 prop 傳（公司版：服務 / 產品 / 聯絡 / Blog；POS 版：功能 / 慳幾多 / 定價 / 聯絡 / Blog）。
- **ContactSection**：搬現有 `<form>` + `handleSubmit` + status 機制 + `/api/contact` fetch（**零後端改動**）。文案（標題 / label / placeholder / note）由 prop 傳，兩套 preset（公司 / POS）。
- **SiteFooter**：搬現有 footer。

### 4.4 PosLanding 搬遷原則
- 現有 `page.tsx` 嘅 dict（pains / features / pricing / faq / contact）+ 各 section markup + SavingsCalculator + Faq + mockups **原封搬入** `components/PosLanding.tsx`。
- 改動只限：① nav / footer / 聯絡表改用共用 component ② nav 加「公司首頁」link ③ 語言由 `useLang()` 取代本地 `useState`。
- 唔重寫已驗證文案，唔郁 mockup。

---

## 5. SEO 處理（唔整跌現有排名）

| 項 | 現狀（喺 root layout） | 目標 |
|----|----------------------|------|
| POS title/description（Edinburgh） | 套喺 `/` | 搬去 `/pos` 嘅 `page.tsx` metadata |
| SoftwareApplication JSON-LD（areaServed Edinburgh）| root layout body | 搬去 `/pos` |
| `/` metadata | （無專屬）| 新公司 title/description（不綁地區）+ Organization JSON-LD |
| root `layout.tsx` | POS 專屬 | 改中性 default（被各 page 覆寫）|
| `sitemap.ts` | `/`、`/blog`、文章 | **加 `/pos`**（priority 0.9）|

- `/` → `/pos` 內鏈（副 CTA + 產品卡）傳遞權重。
- canonical：`/` self、`/pos` self。

---

## 6. 範圍外（YAGNI / 下輪）
- Reviewscope / Rota 獨立產品頁（首版導去 `#contact` 即可）。
- 客戶見證 / case study（有真 case 先加，唔作假）。
- 公司頁動畫 / 進階視覺打磨（先出內容版，視覺後續）。
- 語言由 useState 換 next-intl（流量大先升）。

---

## 7. 開放項 —— 已拍板（2026-06-19）
1. ✅ Reviewscope / Rota：首版只導 `#contact`（只 POS 有獨立頁）。
2. ✅ 公司頁 nav 第二項 = **「服務」**。
3. ✅ 主 CTA 文字 = **「免費諮詢」**。
