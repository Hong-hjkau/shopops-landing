# /pos/features 覆核修復 — 交接（2026-08-11）

> 📍 **新 session 開工睇呢度**：[2026-08-11-pos-features-batch4-6-handoff.md](./2026-08-11-pos-features-batch4-6-handoff.md)
> 呢份係**完整歷史**（19 條 finding 對帳、已完成批次嘅實際做法同踩過嘅坑），仲要做嘅嘢喺上面嗰份。

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
| F7 | 18 張截圖有 10 張冇「示範畫面為英文」caption，中文頁讀者會誤會加購只有英文 | ✅ **已做**（72f7c30） |
| F8 | 圖片 trigger 嘅 `aria-label` 蓋走 `alt`，18 張圖嘅描述螢幕閱讀器聽唔到 | ✅ **已做**（72f7c30） |
| F2 | 三語 `recipeBoundary` 硬編 `+£9`，違反 spec 驗收 #3；連 test 都鎖死咗個違規 | ✅ **已做**（0f3c308） |
| F5 | checkout 卡文案同 alt 都話有「daily report」，但張圖只有收款 modal，冇報表 | ✅ **已做**（0f3c308） |
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

### ~~第二批：F7 + F8~~ ✅ 已完成（`72f7c30`）

實際做法同下面 spec 嘅三個差異（已驗證、已過 Codex）：

1. **caption 位置統一擺喺圖 grid 上面**，四個 section 一致，唔係「h2 下面」。原因：`#add-ons` 個 h2 之後已經有兩段價錢說明，caption 插喺中間會拆散佢哋；擺喺 grid 正上方語意最準（「下面啲圖係英文示範」）而且四區同一節奏。`#core` 本來就要咁做。
2. **`copy.workflow.caption` 改名 `demoImageCaption`**（分歧項自己揀咗 Codex 嗰邊）。caption 而家四個 section 共用，個 key 名再收喺 `workflow.` 下面會誤導；順手加咗 `demoImageBadge`。
3. **workflow 卡個 `1 · ` 序號**改成同 `/pos` `components/PosWorkflow.tsx` 一樣嘅圓形數字 badge（`PosFeatureStory` 新增選填 `step?: number`）。caption 抽走之後個序號冇咗依附，唔另創第三種寫法。

⚠️ **順手提早做咗第六批第 1 項**：`tests/pos-content.test.mjs` 嗰條 grep 死 Tailwind class 嘅 test 被呢次改動撞爆，而 plan 指定嘅處理就係刪，所以即刻刪咗（原位留咗註解解釋）。第六批唔使再做呢項。

🅿️ ~~**一個做唔到、defer 咗嘅位**：plan 寫 F8 test 要驗「鍵盤 Enter/Space/Escape/關閉後 focus 回 trigger」。呢個 repo 冇 Playwright…~~ ✅ **已補**，見下面「互動層測試（Playwright）」section。連 F8 嘅 accessibility tree 都真驗埋（`toHaveAccessibleDescription`）。

Mutation 驗證做咗 6 個，全部確認轉紅：①拆走一個 section caption ②拆走 `aria-describedby` ③掣內圖 `alt` 復辟 ④刪走成個 badge span ⑤badge 拆走 `aria-hidden` ⑥caption 由圖上面搬去圖下面。probe 零殘留。
🩸 教訓：頭一次 mutation 揀錯咗 —— 將 `data-pos-demo-badge` 改名做 `data-pos-demo-badge-DISABLED`，但新名**包含**舊字串所以 regex 照中，test 假綠。**mutation 唔可以用 superset 字串，要真刪。**

<details>
<summary>原本嘅 spec（保留備查）</summary>

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

</details>

### ~~第三批：F2 + F5~~ ✅ 已完成（`0f3c308`；另有 refactor `169477f`）

實際做法同下面 spec 嘅差異：

- **F2 個 assert 收得比 plan 辣**：唔止 `assert.doesNotMatch(recipeBoundary, /£/)`，係整份 `POS_FEATURES_CONTENT[lang]` 序列化之後零個 `£`（配合 spec 驗收 #3「頁面不另寫產品價錢常量」）。⚠️ **代價**：將來如果有正當理由喺 feature 文案出現 `£`（舉例、非產品價錢），會被誤殺，要當時放寬。Codex 認同呢個係測試政策取捨，唔算 bug。
- **F2 個「改價 mutation test」擺咗喺 `tests/pos-content.test.mjs`**（唔係 rendered 檔）。原因：rendered harness 係 spawn 一個獨立 `next dev` process，喺 test process 度改 `POS_CONTENT` 影響唔到 server。所以由改 canonical 價落手嗰條 test 一定要喺同一個 process 行得到嘅 unit 層。
- **F5 新文案**（三語）：title「收款並完成結帳」／body 講「喺未付款清單揀返張單」／alt 講「收款視窗及現金、信用卡選項」。⚠️ 首版寫「由未付款清單**開單**」被 Codex 捉到有歧義（讀得成開新單），已改。
- **語意契約表**（Codex 上一輪提議）已落地：`IMAGE_SEMANTIC_CONTRACT` 喺 `tests/pos-features-rendered.test.mjs`，暫時只填 `checkout-report`。設計要點：**`required` 只可以由肉眼睇到嘅文案滿足**（rendered 一邊先剝走 `sr-only` 描述再驗），`forbidden` 就覆蓋晒連 alt／action label。呢個分層係 Codex 第一輪捉到嘅 P2 —— 唔分層嘅話，可見標題／內文可以退化到同張圖無關，靠隱藏 alt 保住個 required 假綠。

Codex 兩輪：第一輪 2 條 P2（rendered 只驗 forbidden／中文「開單」歧義），修完第二輪 CLEAN。Mutation 4 個全紅。

🆕 **Codex 順帶提出、已 defer 嘅一條**：唔應該為咗維持 `tests/pos-content.test.mjs` 嗰條「landing source 要出現 18 次 literal `POS_FEATURE_IMAGES["<id>"]`」契約，而永久保留 `standardAddOnImages` 兩條死 entry（= F17）。佢認為真正契約應該係「所有 ID 都經 `POS_FEATURE_IMAGES` 解析」，改完就可以刪 map、`buildDemoImage` 直接由 id 查圖。**併入 F17 + 第六批 test 重整一齊做**，唔好單獨郁（會令現有架構契約失效）。

<details>
<summary>原本嘅 spec（保留備查）</summary>

### 第三批：F2 + F5（三語文案）

**F2**：三語 `recipeBoundary` 拎走 `+£9`（`lib/pos-features-content.ts` 132 / 214 / 296，行號要重對）。
- 同步刪 `tests/pos-features-rendered.test.mjs` 兩條 assert 字面 `+£9 食譜成本`（406 / 422 附近）—— **呢兩條 test 而家係喺度鎖死違規**
- 加 `assert.doesNotMatch(recipeBoundary, /£/)` 三語
- 加 mutation test：改 recipe price → rendered boundary 要跟新價、舊價要消失

**F5**：三語 story #4 嘅 title + body + imageAlt 全部拎走「daily report / 報表」（81 / 163 / 245，行號要重對）。
- 檔名 `checkout-report.webp` 同 stable id `checkout-report` **建議唔改**（改名要同步 register／SHA／test／import 四處，收益近零）
- Codex 建議建立「stable ID → required／forbidden semantic phrases」表，獨立於 content object（例如 `checkout-report` 嘅 alt 必須含付款語意、**不得**含 report／報表）。呢個比人手 tick 強，值得做


</details>

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

1. ~~**刪** `tests/pos-content.test.mjs` 嗰條 assert 字面 Tailwind class 嘅~~ ✅ **第二批已做**（`72f7c30`，原位留咗註解）
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

## 三條優化

### ✅ 已做（`169477f`）
- **`buildDemoImage(copy, id, image)`** —— 三處手砌同一組六 field dialog props（加 `badgeLabel` 嗰陣險啲漏一處），收成一個 helper
- **Test 定位 regex 收成 helper** —— `triggerById` / `triggerElementById` / `dialogById`
- ❌ **`data-pos-*` marker 抽共用常數：評估後唔做**。JSX 寫唔到 computed attribute name，要用 `{...{ [M.badge]: true }}` spread hack，讀落差過直接寫；而且現有重複本身已經有守衛（component 改名 → test 即刻紅）

### ⏳ 未做
1. **補齊 OG 圖 test 覆蓋** — 全 repo **零個** test assert 過任何 route 有 OG 圖。第一批只補咗 `/pos/features`；`/`、`/pos`、`/rota`、`/this-is-you` 四條仍然裸奔。抄第一批嗰條 test 嘅做法（驗 meta tag + 真 fetch 圖 + PNG magic bytes）。
2. **`lib/og.tsx` tags 孤立 `·`** — `flexWrap` 換行時會留個分隔點喺行尾（`/pos` 同新嗰張都係）。改共用 renderer 影響三頁，第一批刻意冇動（守則 #3）。做嘅時候三頁一齊睇。
3. ✅ **互動層 test —— 已做**（見下面獨立 section）

---

---

## 互動層測試（Playwright）—— 2026-08-11 新增

**點解要做**：`docs/superpowers/specs/2026-08-06-pos-feature-screenshots-and-layout-design.md:163` 驗收第 9 條明寫「圖片可用 click、Enter／Space 開啟；Escape、關閉按鈕及 focus return 正常」。舊 harness 淨係 `fetch()` HTML 用 regex 驗（冇 DOM、冇 JS、冇互動），**呢條驗收由頭到尾冇機器驗過，係一筆已經欠咗嘅 spec 驗收**。

**點解一定要真瀏覽器**：[jsdom#3294](https://github.com/jsdom/jsdom/issues/3294) —— jsdom 由 2021-11 到而家仍然**未實作 `HTMLDialogElement.showModal()`**。vitest + jsdom 走呢條路要 mock `showModal`，等於驗緊個 mock；Escape 關閉同 focus return 更加係瀏覽器行為，mock 唔到。⚠️ **以後唔好再提議喺呢個 repo 用 jsdom 測 dialog。**

**方案雙軌**（Claude + Codex 各寫一份，HONG 拍板即刻做）。兩份一致：要真瀏覽器、揀 Playwright、唔郁現有 rendered test。兩處分歧，**兩處都跟咗 Codex**：

| | Claude 原本 | 落地 | 點解 |
|---|---|---|---|
| Runner | Playwright 當 library 塞入現有 `node --test` | 獨立 `@playwright/test` | 要驗 `toBeFocused()` 呢類時序敏感嘢，冇 auto-wait 就係製造 flaky test。慳一個 config 檔唔值 |
| Server | `next dev` | `next start` 食 production build | 驗到嘅係真正 ship 出去嗰個版本 |

**落地內容**：`playwright.config.ts`（port 3210 避開 3000-3004、`retries: 0`、`trace: retain-on-failure`）+ `e2e/pos-image-dialog.spec.ts`（5 條，覆蓋驗收第 9 條六項，另加一條用 `toHaveAccessibleName` / `toHaveAccessibleDescription` 驗**瀏覽器計出嚟嘅 accessibility tree** —— 呢條先係 F8 修復嘅真正驗證，舊 harness 只可以睇 attribute 有冇出現）。

**兩個 suite 嘅職責分工（唔好搞亂）**：
- `tests/pos-features-rendered.test.mjs` 負責「**係咪啱啱 18 張、次序啱唔啱、文案啱唔啱**」
- `e2e/pos-image-dialog.spec.ts` 負責「**頁面上每一張都撳得開、關得返、focus 返到**」，個 id 清單**由真頁面問返**（`page.locator("[data-pos-image-id]").evaluateAll(...)`），唔喺 e2e 另存一份 —— 否則同 rendered suite 各有一份 18 個 id，改一邊就分岔。

⚠️ **但數量斷言唔可以慳**（Codex 第四輪 P2）。兩個 suite **睇緊唔同 server mode**：rendered 用 `next dev`，e2e 用 production build。所以「兩條 test 加埋就覆蓋完整」呢個想法有窿 —— 一個 production 專有嘅圖片流失（得返 1 張）會**兩邊一齊假綠**：rendered 喺 dev 見到 18 張照過，e2e 掃到嗰 1 張開關成功都照過。所以 e2e 要自己 assert 數量：

```ts
const EXPECTED_SCREENSHOT_COUNT =
  EN.workflow.stories.length + EN.core.cards.length + Object.keys(EN.addOns).length;
expect(ids.length).toBe(EXPECTED_SCREENSHOT_COUNT);
```

**由 content 推導唔硬編 `18`**：加第 19 張圖唔使記住兩個檔一齊改。（原本想直接數 `POS_FEATURE_IMAGES` 個 register，但佢 import 緊 `.webp`，Playwright 嘅 TS transform 食唔到。）職責分工仍然成立：**rendered suite 釘死「邊 18 個 id、乜次序」，e2e 釘死「production DOM 同 content 對得上、每張都撳得郁」**。已 mutation 驗過（`standardAddOns.slice(0, 1)` 模擬 8 張加購圖流失剩 1 張 → `Expected: 18 / Received: 11`，紅）。

**npm script**：`test:e2e` = `npm run build && playwright test`（一定測最新 source）；`pretest:e2e` = `playwright install chromium`（npm 自動跑，HONG 唔使記任何手動步驟）；`verify` 尾段由獨立 `npm run build` 改成 `npm run test:e2e`。

**成本實測**：`npm run verify` 全套 **19 秒**（e2e 佔 ~5 秒）。Chromium binary 約 **550MB**（`chromium-1234` 356M + headless shell 196M），存喺全機共用嘅 `~/Library/Caches/ms-playwright`，係「每個 Playwright 版本一次」唔係每個 project 一次。

### 🩸 呢輪學到嘅坑

1. **等 hydration 有兩個都唔得嘅做法，繞咗一個圈先搵到啱嘅**（Codex 連續兩輪 P2）：
   - ❌ **`toBeEnabled()`** —— 個 button 本來就冇 `disabled`，SSR HTML 一出就成立，等唔到 React 掛好 handler。慢機上會喺 handler 未掛好之前撳落去 → 間歇性紅。
   - ❌ **`expect(async () => {…}).toPass()` 重試同一個手勢** —— 我第二次嘅答案，被 Codex 推翻。佢啱：咁樣將規格嘅「撳一下就開」偷偷變成「15 秒內重複撳最終會開」，**反而冚住「第一下被 hydration 食咗」呢個真實 UX 問題**。
   - ❌ **Codex 提議嘅「hydration 前將 button `disabled`」** —— 冇跟。呢個係為咗測試訊號而改 production 行為（18 個 instance 都要加 state flip），而且 disabled button 會被抽離 tab order，hydration 期間對鍵盤用家反而更差。測試需求唔應該推動產品行為改變。
   - ✅ **等 React 喺元素上面掛好 `__reactProps$…`，然後單次、唔重試嘅手勢**。React 19 嘅 root-level delegated listener 讀嘅正正就係呢個 property，所以佢出現 = handler 接通咗。純測試側，零 production 改動，而且同規格語意一致。React 改名嘅話個 gate 會 timeout **大聲紅**，唔會假綠。

   **點證明個 gate 唔係擺設**（本機太快，拆走佢連跑 3 次都照綠，證明唔到嘢）：做咗個對照實驗 —— `page.route("**/*.js")` 拖慢 1.5 秒 + `page.goto(..., { waitUntil: "commit" })`，**冇 gate 嘅單次撳紅咗，有 gate 嗰條綠**。⚠️ `waitUntil` 一定要 `commit`：預設 `load` 會等埋 script 落齊，根本造唔到空隙，實驗會假綠。
2. **`.next/BUILD_ID` guard 只證明「曾經 build」，證明唔到「係最新」**（Codex P2）。獨立跑 e2e 而冇重新 build 就會測緊舊版本假綠。解法：`test:e2e` 自己包住 `npm run build`。
3. **撳 backdrop 唔可以用 `modal.click({position})`** —— 個座標係相對 dialog 個盒，會撞正入面嗰個 `<div>`，`target !== currentTarget` 就唔會關。真 backdrop 係盒**以外**嘅暗區，瀏覽器會將嗰度嘅 click 派去 `<dialog>` 自己。用 `page.mouse.click(5, 5)`。
4. **`trace: "on-first-retry"` 配 `retries: 0` = 永遠冇 trace**。要 `retain-on-failure`。
5. **`onClose={() => triggerRef.current?.focus()}` 拆走都唔會紅** —— 因為 native modal `<dialog>` 關閉時瀏覽器本身就會還原 focus（HTML spec 行為）。Codex 判斷：同 native close algorithm 唔完全等價（非模態情況），**唔應該順手刪**。個 test 驗唔到嗰行唔代表 test 有問題 —— 規格要求嘅係「focus return 正常」呢個用家可見結果，如果將來有人將 `<dialog>` 換成 div-based modal，test 就會捉到。

### ⏳ 未做（將來擴展）

- `/pos`、`/rota`、`/this-is-you` 嘅互動未覆蓋
- `SiteHeader` 語言切換未覆蓋
- 跨瀏覽器（而家只行 chromium）、visual regression —— 都係另案

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
