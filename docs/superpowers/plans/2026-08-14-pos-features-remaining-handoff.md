# /pos/features 覆核 —— 剩餘手尾交接（2026-08-14）

接住 [2026-08-12-pos-features-remaining-handoff.md](./2026-08-12-pos-features-remaining-handoff.md)（9 條）。
呢份講**做咗邊 4 條、剩返邊 5 條**，加埋今次做嘢途中產生嘅新手尾。

方案同拍板紀錄喺 [2026-08-12-workflow-screenshots-reshoot-plan.md](./2026-08-12-workflow-screenshots-reshoot-plan.md)。

## 已上 production

| Repo | Branch | Commit |
|---|---|---|
| POS | `master` | `eb0ff91a`（之後另一 session 再 merge 咗 5 個 commit，我嘅嘢仍在） |
| Landing | `main` | `53e9484` |

真機驗證 2026-08-14 由 HONG 做過：`/admin/tables` 樓面打剔正常、`shopops.co.uk` 四張新圖正常。

---

## 對帳：原 handoff 9 條

| # | 項目 | 狀態 |
|---|---|---|
| 1 | F9 素材：Core POS 截圖出咗加購 UI | ✅ **完成**（結構性） |
| 2 | F15 素材：兩張圖下半空白 | ✅ **完成**（結構性） |
| 3 | F16 素材：截圖寫死日期 | ✅ **完成**（結構性） |
| 4 | F18：mobile 冇 nav | ⏳ **未做** —— 見 A |
| 5 | `PosWorkflow` 繞過 image map | ✅ **完成** |
| 6 | 首頁／`SiteHeader` 語言切換冇互動測試 | ⏳ **未做** —— 見 B |
| 7 | rendered suite 應唔應該行 production build | ⏳ **未拍板** —— 見 B |
| 8 | `/pos`、`/rota`、`/this-is-you` 補互動測試 | ⏳ **未做** —— 見 B |
| 9 | `--test-concurrency=1` 係鈍器 | ⏳ **未做** —— 見 B |

**9 入 = 4 完成 + 5 未完成，零 gap。**

---

## A. F18 mobile nav（原 #4）—— 獨立一案

`hidden lg:flex` 係**全站**寫法，唔止 `/pos/features`。手機完全冇導覽。
改動範圍係 `components/SiteHeader.tsx`，即係影響全部頁面 —— 唔應該當 `/pos/features` 嘅手尾嚟做。

證據（2026-08-14 仍然成立）：`components/SiteHeader.tsx` 係 `hidden lg:flex`，全檔 hamburger／`aria-expanded` marker 零個。

## B. 測試層四條（原 #6 #7 #8 #9）—— 互相糾纏，一次過拍板

四條係同一個問題嘅唔同切面：**e2e 只有一個 spec，而 rendered 層同 e2e 層行緊兩個 server mode。**

現況（2026-08-14 核實）：
- `e2e/` 得一個檔：`pos-image-dialog.spec.ts`
- `package.json:13` 仍然係 `node --test --test-concurrency=1 tests/*.test.mjs`
- `tests/helpers/next-server.mjs` 行 `next dev`；`playwright.config.ts` 行 `next start`

**建議次序**（同上一份 handoff 一致）：先拍 #7（rendered 行邊個 mode）→ 佢會決定 #9 要唔要 restructure → 最後先加 #6 #8 嘅 spec，唔使加完再搬。

📌 唔好重覆踩：同一個 project 目錄唔可以同時開兩個 `next dev`，`--test-concurrency=1` 就係為咗呢個，唔好順手拎走。

---

## C. 今次做嘢途中產生嘅新手尾（4 條）

### C1. 兩個現有 scene 仍然燒住絕對日期（POS）

`scripts/capture.mjs` 新加咗一道閘：影相之前驗渲染文字，見到絕對日期就拒影。
但兩個**現有** scene 本身就犯規，暫時列咗白名單：

- `scheduling`：排更表欄頭 `Mon 08-03` … `Sun 08-16`
- `reviews`：評價卡 `2026-08-06`

白名單喺 `POS/tools/screenshot-harness/scripts/capture.mjs` 嘅 `LEGACY_DATE_SCENES`。
**呢張清單只可以縮短，唔應該加長。** 修法：改嗰兩個 scene 顯示相對日期（例如 `This week` /
`2 days ago`），然後由白名單剔走。

### C2. `order-entry` 購物車欄中間有空位（Landing 圖）

原本人手影嗰張，嗰個位係「未付款」清單。但 `components/staff/UnpaidList.tsx` 唔係
prop-driven —— 佢用 `useSyncExternalStore` 由 `lib/offline/orderQueue`（IndexedDB）讀數。
要餵 fixture 就要喺 harness `next.config.mjs` 再 alias 多一個 production module。

**當時判斷唔值得**（會令 harness 愈嚟愈似半套 emulator，正正係揀路 C 想避開嘅嘢）。
如果日後覺得張圖需要，呢個係做法；唔係就當佢係已知取捨。

### C3. Harness `npm run dev` 少咗 bundler flag（POS，現存問題）

`tools/screenshot-harness/package.json` 嘅 `dev` 係 `next dev --hostname … --port 3419`，
冇 `--webpack`。Next 16 冇預設 bundler，加上 `next.config.mjs` 用 webpack alias 做 fixture
注入，所以 `npm run dev` 會即刻報錯。`build` 有 `--webpack` 所以 `npm run capture` 冇事。

開發 scene 嗰陣要用：`npx next dev --webpack --hostname 127.0.0.1 --port 3419`。
**呢個係現存問題，唔係今次改動引入**，所以冇順手改（守則 #3）。要修就係 `dev` script 加個 flag。

### C4. Worktree 未收

- `/Users/hong/Claude/SHOPOPS/POS-wt-pos-workflow-scenes`（`wt/pos-workflow-scenes`，已 merge 落 master）
- `/Users/hong/Claude/SHOPOPS/Landing-wt-pos-features-fixes`（`wt/pos-features-fixes`，已 merge 落 main）

兩條都 merge 完，可以 `wt done` 或者 `wt drop`。

---

## D. 開工前要知嘅環境陷阱

| 陷阱 | 對策 |
|---|---|
| Worktree 冇 `.env.local`（gitignore，`wt new` 唔 copy）→ POS `npm run build` 喺 collect page data 階段死 | 傳假 env 值就 build 得（`NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co` 等四個），唔使真 secrets |
| Harness 自己個 `node_modules` 唔會由 `wt new` 裝 | 跑 capture 之前要喺 `tools/screenshot-harness/` 跑一次 `npm install` |
| POS root `tsc --noEmit` **唔覆蓋** harness | Harness 有自己 tsconfig，型別錯要靠 `npm run capture`（佢會先 build）先揪到 |
| Capture 寫去 repo 外面 | 輸出喺 `/Users/hong/Documents/Codex/2026-08-05/po/pos-demo-assets-2026-08-06/`，唔喺 git 入面 |

---

## E. 今次學到、值得帶落去嘅三件事

1. **「近白像素比例」唔可以做空白閘。** UI 本身白底，內容越多分數越差 —— 實測加多一張單，
   分數由 64% **升**到 86%。改由圖底向上數連續空白帶又只捉到圖底空白，捉唔到卡入面嘅空白。
   結論：「空唔空」要喺 DOM 層驗內容量（例如「每欄至少 N 張卡」），唔好做圖像分析。
2. **String 級 `assert.doesNotMatch` 會連註解都捉。** 今次撞咗兩次（`PosWorkflow`、`SceneRenderer`）：
   解釋規矩嘅註解本身提到個 attribute 名，於是自己捉自己。第二次改成剝走註解先驗。
3. **用「測試過關」去驗證編輯有冇套用係假綠。** 如果編輯同對應嘅測試修改喺同一個 script 入面
   一齊冇套用，兩邊一致就會過。要直接讀 runtime 值（例如 `node -e "import(...)"` 印出真嘅
   manifest）先算數。

---

## 對帳（本檔）

來源：原 handoff 9 條 + 今次新手尾 4 條 + 環境陷阱 4 條 + 學到 3 條 = **20 條入**。
覆蓋：9 條喺對帳表（4 完成 / 5 未完成，未完成嗰 5 條分別展開喺 A、B）；
新手尾 4 條 = C1–C4；環境陷阱 4 條 = D 表四行；學到 3 條 = E 三點。

**20 入 = 20 出，零 gap。**
