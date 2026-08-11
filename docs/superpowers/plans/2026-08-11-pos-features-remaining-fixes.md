# /pos/features 覆核修復 — 交接（2026-08-11）

上一個 session 對 `/pos/features` 做完獨立唯讀覆核，出咗 19 條 finding，Claude + Codex 雙軌出方案，HONG 拍晒板，**第一批已 commit**。呢份係畀新 session 接手嘅完整手尾。

## 現況

| 項目 | 值 |
|---|---|
| Worktree | `/Users/hong/Claude/SHOPOPS/Landing-wt-pos-features-fixes` |
| Branch | `wt/pos-features-fixes` |
| HEAD | `4ced55a` fix(landing): add POS features share image and reuse canonical price copy |
| Base | `9b70e95`（= `main` = `origin/main`，開工時冇再郁） |
| 狀態 | working tree 乾淨；**領先 origin/main 1 個 commit，未 push、未 merge** |
| 驗證 | `npm run verify` 全過（content tests 75/75、ESLint、typegen、tsc、contrast、production build） |

⚠️ **開工前一定重新做 race check**：`git -C ../Landing log --oneline -3 main` 同 `wt list`。上一個 session 開工前就撞過 —— `main` 喺覆核期間被另一條 branch 推前咗 2 個 commit（換 demo 食物相 + 改加購價錢層 label），令覆核基準過時、行號全部要重對。**唔好假設下面嘅行號仲準，動手前逐個 grep 對返。**

---

## 19 條 finding 對帳表

**19 入 = 19 出，零 gap**（10 雙軌 + 6 trivial + 3 唔喺 scope；編號 1–19 完整無缺，已用程式核對）。

> 註：上一個 session 口頭講過「7 條 trivial、2 條唔喺 scope」，**嗰個數係錯**，實數係 6 + 3。以本表為準。

### A. 雙軌出方案嘅 10 條

| # | Finding | 狀態 |
|---|---|---|
| F1 | `/pos/features` 宣告 `summary_large_image` 但冇 og:image / twitter:image，分享出空白卡 | ✅ **已做**（4ced55a） |
| F3 | EN `goodToKnow` 自己寫第二套卡付款文案，同 canonical `feeNote` 分岔，讀落變成「唔記錄現金」 | ✅ **已做**（4ced55a） |
| F6 | 頁面有 19 個價錢數字但零 VAT 說明（`vatNote` 之前只喺 `/pos`） | ✅ **已做**（4ced55a） |
| F7 | 18 張截圖有 10 張冇「示範畫面為英文」caption，中文頁讀者會誤會加購只有英文 | ⏳ **第二批** |
| F8 | 圖片 trigger 嘅 `aria-label` 蓋走 `alt`，18 張圖嘅描述螢幕閱讀器聽唔到 | ⏳ **第二批** |
| F2 | 三語 `recipeBoundary` 硬編 `+£9`，違反 spec 驗收 #3；連 test 都鎖死咗個違規 | ⏳ **第三批** |
| F5 | checkout 卡文案同 alt 都話有「daily report」，但張圖只有收款 modal，冇報表 | ⏳ **第三批** |
| F4 | NVIDIA 商標 | 🟡 **一半已修**：素材已被另一條 branch 換走（live 已生效）；**register 嘅 trademark／licence 閘仍然未加**（grep 零命中）→ 第四批 |
| F10 | 加購／進階分流靠 hardcode id；hero 兩格都借單一項價錢代表成層 | ⏳ **第五批** |
| F11 | 幾條 test 名寫住 render 但只 grep source，仲鎖死 Tailwind class | ⏳ **第六批** |

### B. Trivial 6 條（唔使過 Codex，一行到幾行）

| # | Finding | 修法 |
|---|---|---|
| F12 | nav 次序 ≠ DOM 次序；nav「Core POS」指去 `#workflow`，真正嘅 `#core` 冇入口 | `#core` 接返，兩個加購 nav 項對調 |
| F13 | EN 句中 `Profit and loss` 大寫，出兩次；test 鎖死咗個 typo | 改細楷，同步改 assert |
| F14 | 送貨面板寫 `collection code`，同頁又用 `collection orders` 指外賣自取，撞名 | 改 `driver collection code` |
| F16 | 截圖見到寫死日期 `2026/08/01`、`08/06/2026`（DD/MM 定 MM/DD 睇唔出） | 重影時順手處理 |
| F17 | `standardAddOnImages` 入面 `delivery` / `finance_inventory` 兩條永遠讀唔到 | 刪兩行 |
| F19 | 原 handoff 檔落後於 live（少講 5 個 commit、入口數目錯、test 數 53 對唔上 75） | 已由本檔取代 |

### C. 唔喺今次 scope 3 條

| # | Finding | 點解唔做 |
|---|---|---|
| F9 | Core POS 截圖見到 add-on UI（`order-entry` 有 Delivery tab、`kitchen-order` 有 Recipes 掣） | 要重影 demo 素材，屬 screenshot harness 條線 |
| F15 | `floor-progress` / `kitchen-order` 下半 ~45% 全白 | 同上 |
| F18 | mobile nav 係 `hidden lg:flex` 冇 hamburger | 全站舊 pattern，另案 |

### D. 已核實但**唔算 finding**（spec 已批准嘅取捨，唔好「順手修」）

1. **冇 hreflang／獨立語言 URL** — spec 第 133 行明寫「首版沿用 query 語言，不新增獨立語言 URL／hreflang；這是已知 SEO 限制，不在今次擴 scope」。
2. **SSR `<html lang="en">`（三語都係）** — `components/LangProvider.tsx` 有大段註解講明係刻意避 hydration mismatch；spec 第 132 行嘅要求係「server-rendered **主內容**」，而 `<main lang="zh-Hant">` 實測有、正確。技術上原始 HTML 仍不符 WCAG 3.1.1，真正解法係語言入 path segment（= spec 已 defer 嗰件事）。**守則 #12：呢段係刻意保留，唔好默默改。**

---

## HONG 已拍板嘅決定

| | 決定 | 影響 |
|---|---|---|
| **D1**（F2） | **A：句子拎走個價** | `boundary` 唔使由 `string` 改 `ReactNode`，工程量比 Codex 版細一半。EN 由 `+£9 Recipe costing is…` 變 `Recipe costing is…`，三語照讀得順 |
| **D2**（F5） | **B：連標題一齊改** | 標題改成「記錄付款並完成結帳」類意思。要同步改 `tests/pos-features-rendered.test.mjs` 嘅 heading assert。⚠️ `/pos` 嘅 4 步 workflow 仍叫「結帳及報表」，**判斷唔使改**（嗰版冇配圖，描述功能唔係畫面） |
| **D3**（F7） | **A：section 級一次** + **加 badge 補強** | section caption 出一次（`#add-ons` / `#advanced-operations` 各一次，順手將 core 區重複 4 次嗰句收成 1 次）；**另外每張圖角落加細 badge**（`EN demo` / `英文示範`），解決 Codex 反駁嘅「手機長頁 caption 距離太遠」 |
| **D4**（F10） | **B：完整版** | 見下面第五批範圍 |

---

## 剩餘批次

### 第二批：F7 + F8（同一輪動 `PosImageDialog`）

兩條都改同一個檔，唔好分兩次。

**F7 caption（D3 = A + badge）**
- `#add-ons` 同 `#advanced-operations` 各喺 h2 下面出一次 caption
- ⚠️ `#core` section 而家 h2 下面已經有一段描述文字（`9b70e95` 改咗），原本打算擺 caption 嗰個位被佔咗，要改放圖 grid 上面
- core 區而家同一句重複 4 次，順手收成 1 次
- 每張圖角落加細 badge（`EN demo` / `英文示範`），噪音低但 18 張都帶住
- `copy.workflow.caption` 個 key 名而家唔準（唔再只屬 workflow）。**Claude 建議唔改**（改 key 要動三語 content + test，收益低，加註解算）；**Codex 建議改名 `demoImageCaption`**。呢個係細分歧，HONG 未拍板 —— 自己揀，揀完講一句點解
- Test：assert 每個含 `data-pos-image-id` 嘅 section 都至少出現 caption 一次（三語）+ badge 覆蓋 18 張

**F8 aria-label（Claude 讓步，跟 Codex 方案）**
```tsx
const descriptionId = `pos-image-${id}-description`;
<button aria-label={actionLabel} aria-describedby={descriptionId}>
  <Image alt="" ... />
</button>
<span id={descriptionId} className="sr-only">{alt}</span>
```
- name 講「做咩」、description 講「係咩」，係 ARIA 正統
- ❌ **唔好用** `aria-label={alt + actionLabel}`（Claude 原方案，Codex 否決：18 個掣 accessible name 變超長，screen reader 嘅 element list 冇得掃）
- dialog 內嘅放大圖繼續保留描述性 `alt`
- Test：18 個 description ID 要唯一、`aria-describedby` target 要存在、in-button 圖 `alt=""`、鍵盤 Enter/Space/Escape/關閉後 focus 回 trigger

### 第三批：F2 + F5（三語文案）

**F2**：三語 `recipeBoundary` 拎走 `+£9`（`lib/pos-features-content.ts` 132 / 214 / 296，行號要重對）。
- 同步刪 `tests/pos-features-rendered.test.mjs` 兩條 assert 字面 `+£9 食譜成本`（406 / 422 附近）—— **呢兩條 test 而家係喺度鎖死違規**
- 加 `assert.doesNotMatch(recipeBoundary, /£/)` 三語
- 加 mutation test：改 recipe price → rendered boundary 要跟新價、舊價要消失

**F5**：三語 story #4 嘅 title + body + imageAlt 全部拎走「daily report / 報表」（81 / 163 / 245，行號要重對）。
- 檔名 `checkout-report.webp` 同 stable id `checkout-report` **建議唔改**（改名要同步 register／SHA／test／import 四處，收益近零）
- Codex 建議建立「stable ID → required／forbidden semantic phrases」表，獨立於 content object（例如 `checkout-report` 嘅 alt 必須含付款語意、**不得**含 report／報表）。呢個比人手 tick 強，值得做

### 第四批：F4 收尾（唔使重影，素材已好）

- `docs/pos-demo-screenshot-register.md` 逐張閘加兩欄：**無第三方 logo／商標**、**asset licence／ownership confirmed**
- 兩欄要覆蓋全部 18 張，唔止 `order-entry`
- `tests/pos-demo-assets.test.mjs` 嘅 parser 改成要求每行新欄都係 `PASS`（Codex 指出呢個可以自動驗「人手閘有冇 tick」—— Claude 原本以為冇得驗，讓步）
- 文件要寫明呢個係 manual approval gate，唔係自動辨認商標

### 第五批：F10 presentation contract（D4 = B，最大最易錯，獨立做獨立審）

1. 新增 `POS_FEATURE_PRESENTATION: Record<PosAddOnId, { layout: "card" | "premium" }>` —— **留喺 Landing 層，唔好入 `POS_CONTENT`**（Codex 明確否決放 canonical pricing model：`/pos` 根本唔需要知邊個係 card 定 premium，會污染 + 違反單向依賴）
2. `getStandardPosFeatureAddOns` 改用 `layout` 過濾，唔再 hardcode 排除兩個 id
3. 兩個手寫 `<PosPremiumFeature>` 改成由 premium list map
4. **`copy.delivery` / `copy.finance` → `copy.premium[id]`（三語 content 重組，呢舊最高風險）**
5. hero **兩格都要改**：標準格同 premium 格都唔可以借單一項價（`getStandardPosFeatureAddOnPrice` 攞 scheduling、premium 格攞 delivery）。混合價要出 range（`+£9–£19` 或「由 +£9 起」）
6. TypeScript 強制每個 `layout: "premium"` 嘅 id 都有 details（type-level 對帳）

❌ **唔好用** 「`monthlyPrice === 19` 就當 premium」（Codex 否決：價錢 ≠ 內容複雜度，將來一個簡單 £19 加購未必需要大 panel）

現有 `tests/pos-content.test.mjs:355-375` 已覆蓋「group 重排時逐項 badge 價唔會漂」，**呢部分係好嘅，保留**；缺口只喺 hero 概括價同 section 分流。

### 第六批：F11 test 重整（放最後，前五批會加新 test，一次過收）

1. **刪** `tests/pos-content.test.mjs` 嗰條 assert 字面 Tailwind class 嘅（`/<h3 className="mt-3 text-xl font-bold text-text">\{title\}<\/h3>/`，364 / 370 附近）—— 零行為價值，rendered test 已有 heading hierarchy 覆蓋
2. **搬** 行為類 assert 去 `pos-features-rendered.test.mjs` 對真 output 驗（route 回應、三語內容、metadata、heading／DOM 次序、language-preserving links、`/pos` 同首頁入口）
3. **保留** 真正屬架構契約嘅 source test（例如「唔准直接 import `../public/pos-demo`，必須經 stable image map」），但 test 名要改到誠實（`... source contract` 而唔係 `... renders ...`）
4. rendered harness 嘅 `render()` 要接受 path，全檔共用同一個 server process（唔好每條 test 開一次 Next server）
5. Claude 額外建議：AGENTS.md 加一條「test 名出現 render 就必須真係 render」

**完成標準用 mutation 驗**（Codex 提，好強）：
- 故意令 `/pos/features` 回 500 → 「route renders」test 真係要紅
- 改 Tailwind class 但 DOM 不變 → heading test 要保持綠
- 把 card 移到 section heading 前面 → DOM order test 要紅
- 移走首頁或 `/pos` 其中一個 link → rendered test 要紅

---

## 兩條優化（HONG 已批「做」）

1. **補齊 OG 圖 test 覆蓋** — 全 repo **零個** test assert 過任何 route 有 OG 圖。第一批只補咗 `/pos/features`；`/`、`/pos`、`/rota`、`/this-is-you` 四條仍然裸奔。抄第一批嗰條 test 嘅做法（驗 meta tag + 真 fetch 圖 + PNG magic bytes）。
2. **`lib/og.tsx` tags 孤立 `·`** — `flexWrap` 換行時會留個分隔點喺行尾（`/pos` 同新嗰張都係）。改共用 renderer 影響三頁，第一批刻意冇動（守則 #3）。做嘅時候三頁一齊睇。

---

## 流程規矩（照上一批做法）

- **TDD**：先寫 failing test → 確認 RED → 實作 → GREEN。上一批三條全部咁做
- **Mutation 驗證**：關鍵 assert 要人為整壞一次確認真係會紅（上一批做過 VAT 次序嗰條，捉到）。做完 **grep 確認 probe 零殘留**
- **Codex loop 到清零**：每批寫完即刻派 Codex 獨立 read-only 審，修完再送，直到明確 CLEAN。上一批用咗三輪
- **自審完整 diff**：Codex 唔收 style nit，但佢哋係真問題。上一批自審捉到 3 個（重複註解、半形逗號混入中文、新引入 const 同既有 inline style 兩種寫法並存）
- **commit 前**：`python3 ~/.claude/hooks/review_marker.py write`（要**喺 `git add` 之後**跑，否則綁到空 diff hash `e3b0c442…`）
- **push 要問 HONG**（對外動作）

### 已知陷阱

| 陷阱 | 對策 |
|---|---|
| 派 Codex 時 prompt 含 `git commit` 字樣 → `require_review_before_commit.py` hook 誤攔 Bash | prompt 寫入檔案，用 `task --fresh "$(cat 檔案)"` |
| Codex rescue runtime 預設 write-capable | prompt 硬寫「READ-ONLY，唔准改檔」，派完 `git status` 對一對 |
| `find -newermt "-6 hours"` 喺 macOS BSD find 唔支援，配 `2>/dev/null` 會靜默假陰性 | 用 `stat -f "%Sm"` |
| 本地冇 `NEXT_PUBLIC_SITE_URL` → OG URL 會係 `shopops-landing.vercel.app` | 正常，Vercel 上有設。唔好當 bug 去修 |
| PWA／已開頁面食舊 JS | 真機測之前 reload |

---

## 新知識（未記入 memory，值得記）

**`opengraph-image` 係 file-based route convention，攞唔到 `searchParams`。** 所以只要語言係 query param（`?lang=`），技術上就**做唔到多語 OG 圖**，同字型無關。將來如果想要三語分享圖，唯一出路係語言入 path segment（即 spec 已 defer 嗰件事）。

另外實測確認：`app/pos/opengraph-image.tsx` **唔會**被 `/pos/features` 繼承 —— 巢狀 segment 要自己開一個。
