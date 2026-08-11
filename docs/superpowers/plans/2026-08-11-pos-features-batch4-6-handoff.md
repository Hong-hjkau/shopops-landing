# /pos/features 覆核 —— 第四～六批 + trivial + 優化 交接（2026-08-11）

接住 [2026-08-11-pos-features-remaining-fixes.md](./2026-08-11-pos-features-remaining-fixes.md)。嗰份係完整歷史（19 條 finding 對帳、已完成批次嘅做法同踩過嘅坑）；**呢份只講仲要做嘅嘢**，畀新 session 直接開工。

## 現況

| 項目 | 值 |
|---|---|
| `main` / `origin/main` | `a0fe858`（已 push，production 已部署）|
| Worktree | `/Users/hong/Claude/SHOPOPS/Landing-wt-pos-features-fixes`（branch `wt/pos-features-fixes`，內容 = main）|
| 驗證 | `npm run verify` 19 秒全過：80/80 content + 5/5 Playwright 互動 |
| 已 ship | F1 F2 F3 F5 F6 F7 F8（+ 互動測試 + 兩個 refactor）|

⚠️ **呢個 worktree 已經裝好 Playwright + chromium，直接用佢開工最慳事**。如果要另開，記住 `npm install` + `npx playwright install chromium`。

⚠️ **開工前一定重新 race check**：`git -C ../Landing log --oneline -3 main` + `wt list`。上兩個 session 都撞過 main 被推前。**下面所有行號動手前逐個 grep 對返**。

---

## 對帳：19 條 finding，8 做完 + 3 唔喺 scope + **8 未做**

> 下面每條「未做」都係 2026-08-11 逐條 grep 過真 code 確認，唔係抄舊文件。

| # | 狀態 | 證據 |
|---|---|---|
| F1 F2 F3 F5 F6 F7 F8 | ✅ 已 ship | commit `4ced55a` `72f7c30` `0f3c308` |
| F19 | ✅ 已被交接檔取代 | — |
| F9 F15 F18 | ❌ 唔喺 scope | F9/F15 要重影 demo 素材（screenshot harness 條線）；F18 mobile nav 係全站舊 pattern，另案 |
| **F4** | ⏳ 第四批 | `grep -c "商標\|trademark\|licence\|logo" docs/pos-demo-screenshot-register.md` = **0** |
| **F10** | ⏳ 第五批 | `lib/pos-features-content.ts:337` 仲係 `.filter((item) => item.id !== "delivery" && item.id !== "finance_inventory")`；`PosFeaturesLanding.tsx` 有 **2** 個手寫 `<PosPremiumFeature>` |
| **F11** | ⏳ 第六批（第 1 項已提早做）| `tests/pos-content.test.mjs:310` 個 test 名叫「POS features route **renders** …」但 body 只係 `existsSync()` 對 5 個 source 檔 |
| **F12** | ⏳ trivial | nav 得 `#workflow` `#add-ons` `#advanced-operations` `#good-to-know`（`PosFeaturesLanding.tsx:99-102`）—— **`#core` 冇入口**，而且 nav 次序 ≠ DOM 次序（DOM 係 workflow → core → advanced-operations → add-ons）|
| **F13** | ⏳ trivial | `grep -c "Profit and loss" lib/pos-features-content.ts` = **2**（句中大寫）|
| **F14** | ⏳ trivial | `lib/pos-features-content.ts:125` 送貨 benefit 寫 `collection code`，但 `:90` `:149` 用 `collection orders` 指外賣自取 —— 撞名 |
| **F16** | ⏳ trivial（但要重影圖）| 截圖見到寫死日期 `2026/08/01`、`08/06/2026`（DD/MM 定 MM/DD 睇唔出）|
| **F17** | ⏳ trivial | `PosFeaturesLanding.tsx:72-73` `delivery` / `finance_inventory` 兩條 entry 永遠讀唔到 |

**8 + 3 + 8 = 19，零 gap。**

🩸 **注意**：HONG 派工嗰陣只提咗第四／五／六批同優化，**冇提 trivial 5 條** —— 佢哋由頭到尾未做過（上一個 session 只 commit 咗第一批 F1/F3/F6）。動手前同 HONG 確認做唔做、幾時做。

---

## 第四批：F4 商標／licence 閘（最細，適合熱身）

素材已經被另一條 branch 換走（live 已生效），剩返**人手審批閘冇落地**。

1. `docs/pos-demo-screenshot-register.md` **逐張**加兩欄：**無第三方 logo／商標**、**asset licence／ownership confirmed**
2. 兩欄要覆蓋全部 18 張，唔止 `order-entry`
3. `tests/pos-demo-assets.test.mjs` 個 parser 改成要求每行新欄都係 `PASS`（Codex 指出呢個可以自動驗「人手閘有冇 tick」）
4. 文件要寫明呢個係 **manual approval gate，唔係自動辨認商標**

---

## 第五批：F10 presentation contract（最大最易錯，獨立做獨立審）

HONG 已拍板 **D4 = B 完整版**。

1. 新增 `POS_FEATURE_PRESENTATION: Record<PosAddOnId, { layout: "card" | "premium" }>` —— **留喺 Landing 層，唔好入 `POS_CONTENT`**（Codex 明確否決放 canonical pricing model：`/pos` 根本唔需要知邊個係 card 定 premium，會污染 + 違反單向依賴）
2. `getStandardPosFeatureAddOns` 改用 `layout` 過濾，唔再 hardcode 排除兩個 id
3. 兩個手寫 `<PosPremiumFeature>` 改成由 premium list map
4. **`copy.delivery` / `copy.finance` → `copy.premium[id]`（三語 content 重組，呢舊最高風險）**
5. hero **兩格都要改**：標準格同 premium 格都唔可以借單一項價（`getStandardPosFeatureAddOnPrice` 攞 scheduling、premium 格攞 delivery）。混合價要出 range（`+£9–£19` 或「由 +£9 起」）
6. TypeScript 強制每個 `layout: "premium"` 嘅 id 都有 details（type-level 對帳）

❌ **唔好用**「`monthlyPrice === 19` 就當 premium」（Codex 否決：價錢 ≠ 內容複雜度，將來一個簡單 £19 加購未必需要大 panel）

✅ **保留**：`tests/pos-content.test.mjs` 嗰條「group 重排時逐項 badge 價唔會漂」係好嘅。缺口只喺 hero 概括價同 section 分流。

⚠️ **改完之後 e2e 嗰條數量斷言會自動跟**（`EXPECTED_SCREENSHOT_COUNT` 由 content shape 推導），但如果 premium content 由 `copy.delivery`/`copy.finance` 搬去 `copy.premium[id]`，`e2e/pos-image-dialog.spec.ts` 個推導式（`stories.length + cards.length + Object.keys(addOns).length`）**要同步 re-check** —— 圖片數量嘅來源冇變（仍然係 addOns），但確認一次。

---

## 第六批：F11 test 重整（放最後，前面幾批會加新 test，一次過收）

1. ~~刪 grep 死 Tailwind class 嗰條~~ ✅ **已提早做**（`72f7c30`，原位留咗註解）
2. **搬** 行為類 assert 去 `pos-features-rendered.test.mjs` 對真 output 驗（route 回應、三語內容、metadata、heading／DOM 次序、language-preserving links、`/pos` 同首頁入口）
3. **保留** 真正屬架構契約嘅 source test（例如「唔准直接 import `../public/pos-demo`，必須經 stable image map」），但 test 名要改到誠實（`... source contract` 而唔係 `... renders ...`）。**首要目標**：`tests/pos-content.test.mjs:310`「POS features route **renders** localized content…」實際只係 `existsSync()`
4. rendered harness 嘅 `render()` 要接受 path，全檔共用同一個 server process
5. AGENTS.md 加一條「test 名出現 render 就必須真係 render」

**完成標準用 mutation 驗**：
- 故意令 `/pos/features` 回 500 → 「route renders」test 真係要紅
- 改 Tailwind class 但 DOM 不變 → heading test 要保持綠
- 把 card 移到 section heading 前面 → DOM order test 要紅
- 移走首頁或 `/pos` 其中一個 link → rendered test 要紅

### 🔗 F17 同第六批綁埋做（Codex 提，唔好分開）

Codex 認為唔應該為咗維持「landing source 要出現 18 次 literal `POS_FEATURE_IMAGES["<id>"]`」呢條契約（`tests/pos-content.test.mjs:343`），而永久保留 `standardAddOnImages` 兩條死 entry。真正契約應該係「**所有 ID 都經 `POS_FEATURE_IMAGES` 解析**」。改完就可以：刪成個 `standardAddOnImages` map、`buildDemoImage` 直接由 id 查圖。**單獨郁會令現有架構契約失效，所以要同第六批一齊做。**

---

## Trivial 5 條（未同 HONG 確認幾時做）

| # | 修法 |
|---|---|
| F12 | `#core` 接返入 nav，兩個加購 nav 項對調到同 DOM 次序一致 |
| F13 | `Profit and loss` 改細楷（2 處），同步改 assert |
| F14 | 送貨嗰個 `collection code` 改 `driver collection code` |
| F16 | 截圖寫死日期 —— 要重影，同 F9／F15 一條線 |
| F17 | 見上面，同第六批綁埋 |

---

## 優化（4 條，2 條 HONG 批過、2 條係新 proposal 未拍板）

### ✅ HONG 已批「做」但仲未做

1. **補齊 OG 圖 test 覆蓋** —— 已核實：真正嘅 OG test（驗 meta tag + 真 fetch 圖 + PNG magic bytes）**只有 `/pos/features` 有**（`tests/pos-features-rendered.test.mjs:655-680` 附近）。`tests/pos-content.test.mjs:1016` `:1163` 嗰兩處只係 `readFileSync` 讀 source 檔，唔係真 fetch。**`/`、`/pos`、`/rota`、`/this-is-you` 四條仍然裸奔。** 抄 `/pos/features` 嗰條嘅做法。
2. **`lib/og.tsx` tags 孤立 `·`** —— `lib/og.tsx:104` `[<span>·</span>, <span>{tag}</span>]`，`flexWrap` 換行時會留個分隔點喺行尾（`/pos` 同 `/pos/features` 都係）。改共用 renderer 影響三頁，做嘅時候三頁一齊睇。

### 🆕 新 proposal（未拍板）

3. **rendered suite 都改行 production build** —— 2026-08-11 發現兩個 suite 睇緊唔同 server mode（rendered 用 `next dev`、e2e 用 `next start`），一個 production 專有嘅 regression 可以兩邊一齊假綠。而家靠 e2e 嗰句數量斷言補返，但根源係 dev/prod 分岔。
4. **`/pos`、`/rota`、`/this-is-you` 補互動測試** —— Playwright 已經裝好，邊際成本細；而家只覆蓋 `/pos/features`。

---

## 流程規矩

- **TDD**：先寫 failing test → 確認 RED → 實作 → GREEN
- **Mutation 驗證**：關鍵 assert 要人為整壞一次確認真係會紅。⚠️ **mutation 唔可以用 superset 字串**（改名加 `_DISABLED` 後綴 → regex 照中 → 假綠），要真刪；**每次 mutation 之後先 `diff` 確認佢真係落咗**先解讀結果。做完 grep 確認 probe 零殘留
- **Codex loop 到清零**：每批寫完即刻派 Codex 獨立 **read-only**（prompt 硬寫「唔准改檔」，派完 `git status` 對一對），修完再送，直到明確 CLEAN。今次 F7/F8 用咗 2 輪、F2/F5 用咗 2 輪、互動測試用咗 **5 輪**
- **自審完整 diff**：Codex 唔收 style nit，但佢哋係真問題。今次自審捉到 3 個（helper 定義次序、半形分號混入中文、18 個 id 跨檔重複）
- **commit 前**：`python3 ~/.claude/hooks/review_marker.py write`（要**喺 `git add` 之後**跑；⚠️ 唔可以同 `git commit` 寫喺同一句 compound command，`require_review_before_commit.py` hook 會喺 marker 寫低之前就攔截）
- **push 要問 HONG**（對外動作）。⚠️ 問嘅時候要分清楚「淨係 push branch」定「merge 落 main = 即刻上 production」

## 已知陷阱

| 陷阱 | 對策 |
|---|---|
| 派 Codex 時 prompt 含 `git commit` 字樣 → hook 誤攔 | prompt 寫入檔案，叫 Codex 去讀 |
| Codex rescue runtime 預設 write-capable | prompt 硬寫「READ-ONLY，唔准改檔」，派完 `git status` 對一對 |
| Codex sandbox 綁唔到 `127.0.0.1` | 佢跑唔到 rendered / e2e suite（`listen EPERM`），**唔係 test failure**。叫佢睇 code 就得，唔好逼佢重跑 |
| `find -newermt` 喺 macOS BSD find 唔支援 | 用 `stat -f "%Sm"` |
| 本地冇 `NEXT_PUBLIC_SITE_URL` → OG URL 係 `shopops-landing.vercel.app` | 正常，Vercel 上有設。唔好當 bug 修 |
| 互動測試相關嘅坑 | 見 [remaining-fixes 檔嘅「互動層測試」section](./2026-08-11-pos-features-remaining-fixes.md)（hydration 閘三個錯法、backdrop click、`waitUntil: "commit"`）|
