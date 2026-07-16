# SHOPOPS Landing — 全站深色重設計

**日期**：2026-07-16
**Branch**：`wt/dark-redesign`
**狀態**：設計已批准，待寫實施計劃

---

## 問題

Landing 站視覺上「有紀律但冇性格」。內容同資訊架構做得好（`CardGrid` 有寫低註解界定卡片家族、hero 有 A/B 開關、三語文案齊、product mockup 逐個親手砌），但設計語言停留喺預設 Tailwind marketing 站。

具體證據：

1. **`globals.css` 仍然係 Next.js starter 原檔** — 冇任何自訂 design token。入面留低 `font-family: Arial, Helvetica, sans-serif` 喺 `body`，**蓋過咗特登載入嘅 Geist**。全站英文字實際上係 Arial。
2. **中文字冇字體** — Geist 冇 CJK 字符，繁/简中文跌返去系統預設。Windows / macOS / iOS 各自顯示唔同嘅字，同英文完全唔夾。
3. **Emoji 做 icon system** — 🔄 🛠️ 🤖 📦（What we do）、🤝 🍜 🔓（Why SHOPOPS）。跨平台顯示唔一致，同「度身訂造軟件」嘅定位相衝。
4. **正文對比度不足** — 淺灰字喺白底，實際睇得辛苦（用戶原話：「我睇唔到內容」）。
5. **Hero 同下半身斷開** — hero 嘅「黑底 + 發光橙」語言喺 hero 之後零延續，望落似兩個人做嘅站。

## 目標

將 hero 已經證明有效嘅「黑底 + 發光橙」語言，貫穿全站；同時修好字體同對比度呢兩個真實可用性問題。

**非目標**（明確唔做）：
- 唔搬去 Webild 或任何 hosted builder（會蝕咗 repo 擁有權、blog、MDX、產品入口）
- 唔做淺色／深色模式切換開關（全站已經黑，做多一套等於雙倍工作，冇需求）
- 唔改文案、唔改資訊架構、唔改 `SavingsCalculator` 嘅計算邏輯

## 已考慮但否決嘅方案

| 方案 | 否決理由 |
|---|---|
| **B. 黑白 section 交替** | 睇落安全，實際最難做靚 — 每個交界位都係風險，做得唔好似補丁 |
| **C. 只修 emoji / 字體 / 對比度，保留白底** | 半日搞掂、零風險，但解決唔到原本問題：做完個站仍然冇性格 |

**採用 A：全站黑底。** 理由：客戶要信 SHOPOPS 係識做嘢嗰班人，唔係穩陣大公司。黑底發光橙 = 有態度、有技術感，同產品定位夾。Hero 已證明呢套 work，只係冇做落去。

---

## 設計

### 1. 地基：字體

| 用途 | 字體 | 備註 |
|---|---|---|
| 英文／數字 | Geist | 已載入，只需移除 `body` 上覆蓋佢嘅 Arial 宣告 |
| 中文（繁／简） | Noto Sans TC | 經 `next/font/google` 載入 |
| Fallback | `PingFang TC`（Apple）→ `Microsoft JhengHei`（Windows）→ `sans-serif` | |

**點解 Noto Sans TC 唔會拖慢個站**：`next/font/google` 載入 CJK 時，Google Fonts 自動將字體切成 unicode-range 分片，瀏覽器只下載版面真正用到嗰幾塊。唔使自己跑 subset 工具。

**驗證要求**：實測 CJK 字體實際傳輸 KB 數，寫入實施計劃嘅驗收條件。若單頁 CJK 字體傳輸 > 200KB，需回頭檢討（改用系統字體 stack）。

### 2. 地基：顏色 token

全部定義喺 `app/globals.css` 嘅 `@theme` block（Tailwind v4 CSS-first，呢個 repo 冇 `tailwind.config`）。

色值已釘死，並已用 WCAG 公式實算（腳本見「對比度驗證」）。

| Token | 用途 | 值 | 對比（vs 底色） |
|---|---|---|---|
| `--color-bg` | 頁面背景 | `#0A0A0B` | — |
| `--color-surface` | 卡片、面板 | `#141416` | — |
| `--color-border` | 卡邊、分隔線 | `#26262A` | — |
| `--color-text` | 標題、正文 | `#FAFAFA` | **18.96:1** ✅ |
| `--color-text-secondary` | 說明文字 | `#A1A1AA` | **7.72:1** ✅ |
| `--color-accent` | 重點、icon、CTA 底 | `#F97316`（orange-500） | **7.06:1** ✅ |
| `--color-accent-hover` | CTA hover | `#FB923C`（orange-400） | **8.74:1** ✅ |
| `--color-on-accent` | 橙掣上面嘅字 | `#0A0A0B` | **7.06:1** ✅（見下） |

**唔用純黑 `#000`**：純黑喺 OLED 上內容邊界會「浮」。

**刻意只得兩級文字色**：本來考慮加第三級 `#71717A` 做最次要文字，實算得 **4.09:1，過唔到正文 AA（4.5:1）**，故**刪走呢一級**。而家個站「睇唔到內容」嘅根源就係淺灰字，唔喺新設計度重造同一個陷阱。

**⚠️ CTA 用黑字，唔用白字**：現站嘅橙掣配白字實算得 **2.80:1 — 連 AA-large（3:1）都 FAIL**。呢個係現存缺陷，唔係新設計引入。同一隻橙配黑字得 **7.06:1**，且更貼合「黑 + 橙」語言。

**對比度硬性要求**：所有文字對背景需達 WCAG AA（正文 4.5:1、大字 3:1）。呢個唔係美術偏好 — 現站正正衰喺呢度。

**對比度驗證**：實施時用 WCAG 相對亮度公式實算每個色對，唔靠肉眼、唔靠 DevTools 目測。新增色對必須跑同一驗算。

### 3. 發光嘅使用限制（刻意）

**發光只准出現喺 3 個地方**：
1. Hero 嘅 S logo
2. 主 CTA 掣
3. 定價／`SavingsCalculator` 嘅關鍵數字

其餘所有位置只用實色橙。

**點解**：濫用發光會令佢唔再係重點，變成噪音。克制先顯得貴（參考 Linear、Vercel）。呢條係設計約束，唔係建議 — 日後想加發光位要有明確理由。

### 4. Icon system：emoji → Lucide

採用 `lucide-react`。

**點解揀 Lucide 而唔係 Phosphor / Heroicons**：
- Heroicons 得 292 個 icon，唔夠用
- Phosphor 有 7,700 個 icon 但每個 bundle 埋 6 種粗幼，肥啲
- **決定性理由唔係下載量，係風格**：Lucide 幾何、嚴謹、貼死 24px 網格；Phosphor friendly、有機。SHOPOPS 賣精準（度身訂造軟件 + 自動化），唔賣親切
- 三者都 tree-shake，用幾多 bundle 幾多

**替換對照**：

| 位置 | 而家 | 換做 |
|---|---|---|
| What we do | 🔄 🛠️ 🤖 📦 | `workflow` / `wrench` / `brain` / `package` |
| Why SHOPOPS | 🤝 🍜 🔓 | `handshake` / `flame` / `unlock` |

Icon 用橙色線條、唔填色 — 同 Lucide 嘅 outline 本質夾，亦同「克制用橙」一致。

### 5. 逐個 section

| Section | 改動 |
|---|---|
| **Hero** | 基本唔郁 — 全站最好嘅嘢。只修字體（Geist 活返、中文有 Noto TC） |
| **What we do / Our products / Why SHOPOPS** | 白底 → 黑底。卡片由「白底灰框」→「略淺嘅黑 + 微弱邊」。文字對比度拉返上去 |
| **定價 / SavingsCalculator** | 黑底，關鍵數字橙色發光（3 個發光位之一）。計算邏輯唔郁 |
| **Contact 表單** | 黑底，input 深灰底 + 橙色 focus 邊 |
| **SiteHeader** | 而家係 `bg-white/80 backdrop-blur` → 深色半透明 + backdrop-blur |
| **SiteFooter** | 黑底 |
| **Blog 列表** | 黑底 |
| **Blog 文章內文** | ⚠️ **例外 — 保持淺色背景**（見下） |

### 6. 唯一嘅例外：Blog 內文

Blog **文章內文頁**保持淺色背景，唔跟全站黑。

**理由**：長文章喺純黑底上睇 5 分鐘會眼攰 — 生理問題，唔係品味問題。全站黑嘅目的係畀人記得 SHOPOPS，唔係逼人睇唔完篇文。

呢個係成個方案唯一嘅唔一致位，經用戶明確批准保留。

---

## 風險

| 風險 | 緩解 |
|---|---|
| CJK webfont 拖慢個站 | 實測傳輸 KB；超 200KB 則退回系統字體 stack |
| 對比度做完仍然唔夠 | 逐個色對驗 WCAG AA，唔靠肉眼 |
| 深色化過程漏咗某啲 `dark:` 未覆蓋嘅硬編碼白底 | 全站逐頁視覺檢查（見驗收） |
| `mockups.tsx` 嘅假 UI 截圖係淺色，喺黑底上會突兀 | 實施時逐個評估：可保留（模擬真實產品 UI）或加深色邊框過渡。**需喺計劃入面明確決定** |

## 驗收條件

1. `body` 唔再有 Arial 宣告；DevTools 確認英文字實際 computed font 係 Geist
2. 中文字 computed font 係 Noto Sans TC（唔係系統 fallback）
3. 單頁 CJK 字體傳輸 ≤ 200KB
4. 全站零 emoji 做 icon（`grep` 驗）
5. 所有文字對背景達 WCAG AA
6. 發光效果只出現喺 3 個指定位置
7. 逐頁視覺檢查（`/`、`/pos`、`/rota`、`/blog`、blog 內文、`/this-is-you`）：冇殘留白底、冇睇唔到嘅字
8. Blog 內文頁仍然係淺色背景
9. `npm run build` 過

## 受影響檔案（初步）

- `app/globals.css` — token 定義（核心改動）
- `app/layout.tsx` — 字體載入
- `components/CardGrid.tsx` — 卡片樣式（注意：呢個檔有寫低嘅設計註解，改動要同步更新註解）
- `components/{SiteHeader,SiteFooter,PricingCard,PosFeatureGrid,Faq,ContactSection,SavingsCalculator}.tsx`
- `components/CompanyHome.tsx`、`components/PosLanding.tsx`（534 行）
- `components/mockups.tsx` — 視乎風險欄嘅決定
- `package.json` — 加 `lucide-react`

⚠️ 呢個 worktree 會改 `package.json`（加 `lucide-react`）。按 `wt` 規矩，需喺呢個 worktree 跑獨立 `npm install`（junction 共享唔反映新 deps）。
