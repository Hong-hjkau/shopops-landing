# 四張 workflow 截圖重新產生 —— 雙軌方案（2026-08-12）

接住 [2026-08-12-pos-features-remaining-handoff.md](./2026-08-12-pos-features-remaining-handoff.md) 嘅 **A 線**（finding #1 F9／#2 F15／#3 F16）。
B 線（`PosWorkflow` 收返入 image map）已完成，commit `b114003`。

Claude 同 Codex 各自獨立寫一份（互相冇睇過對方），本檔由 Claude 組合。
**未拍板，未開工。**

---

## 0. 事實基礎（兩份一致，Claude 已逐條核實）

Landing 用嘅 18 張 demo 截圖分兩批來源：

- **14 張** core／add-on 圖：POS repo `tools/screenshot-harness/` 自動產生（固定 fixture、唔連 Supabase、固定時鐘、Playwright 影 1280×900）
- **4 張** workflow 圖（`order-entry`／`kitchen-order`／`floor-progress`／`checkout-report`）：**唔喺 harness 入面**，2026-08-01 人手喺真 Supabase 嘅 `Demo A TEST` 餐廳影

呢四張就係 A 線要處理嗰四張。

### 0.1 🔴 決定性發現（Codex 揪出，推翻 Claude 原方案前提）

**「喺 Demo 餐廳熄加購模組」修唔到 F9。** 已核實：

| 控制項 | 有冇 entitlement gate | 證據 |
|---|---|---|
| Staff 落單頁 `Delivery` 掣 | ❌ **固定 render**，只係 `!deliverySettings?.is_active` 令佢 disabled | [app/staff/page.tsx:676-682](/Users/hong/Claude/SHOPOPS/POS/app/staff/page.tsx#L676-L682)；全檔零個 `useHasModule` |
| Kitchen `All／Dine-in／Takeaway／Delivery` filter | ❌ **固定 render**，hardcode array | [app/admin/page.tsx:461](/Users/hong/Claude/SHOPOPS/POS/app/admin/page.tsx#L461) |
| Kitchen `Recipes` 掣 | ✅ `useHasModule('recipes')` | [app/admin/page.tsx:36](/Users/hong/Claude/SHOPOPS/POS/app/admin/page.tsx#L36)、[:477](/Users/hong/Claude/SHOPOPS/POS/app/admin/page.tsx#L477) |

即係話：人手路熄模組**只可靠地移走 Recipes**，Delivery tab 照樣喺度。要修淨低嗰半，只剩「裁走／遮走」或者「改 production entitlement 行為」。

### 0.2 🔴 第二個發現（Claude 原本講漏、Codex 講得更盡）

**固定時鐘唔會令 F16 自動消失。** harness 而家釘死 `FIXED_TIME = '2026-08-06T10:30:00.000Z'`（[capture.mjs:17](/Users/hong/Claude/SHOPOPS/POS/tools/screenshot-harness/scripts/capture.mjs#L17)），照搬入 harness 只會由 `2026/08/01` 變 `2026/08/06`，一年後一樣舊。

真正結構性修法：**scene 唔顯示絕對日期**（顯示 `Today`／相對時間），再加一條測試禁止 `20xx/xx/xx` 同 ISO 日期出現。

### 0.3 🆕 Claude 核實時新發現（兩份都冇講）

如果 scene 直接**唔 render** Delivery 掣，張 marketing 圖就會展示一個**真實客人見唔到嘅畫面**——因為按 0.1，一個 Core-only 客人**仍然會見到一個灰色 disabled 嘅 Delivery 掣**。

咁樣 F9 由「過度銷售（展示咗收費功能）」變成「展示假 UI」，係另一種同樣唔想要嘅失實。**呢個要拍板**，見下面 D2。

---

## 1. 三條路

### 路 A：再人手影一次（Claude 提出，Codex 詳述風險）

去 `Demo A TEST` 熄模組、落 4–6 張虛構單、逐格影、裁圖。

- **F9**：⚠️ 只修到 Recipes（見 0.1），Delivery 要後製／裁走
- **F15**：✅ 靠多落單填滿 —— 但下次 Demo 狀態唔同，會翻兜
- **F16**：❌ 修唔到根，影嗰日就係嗰個日期
- **風險**：真 Supabase 寫入（落單／改狀態／收款）；熄模組即時影響其他人用緊嘅 Demo 餐廳；realtime 令畫面截圖期間跳動；清理易漏；收款 modal 真確認會寫 `paid_at`
- **下次成本**：每次 2–4 個鐘（撞到 Delivery tab 隱藏唔到／狀態撞單可升至半日）

### 路 B：將四個完整 production page 搬入 harness（Claude 提出，兩邊都唔建議）

逐頁依賴（Claude 量度 + Codex 逐條列）：

| Scene | 頁面 | 規模 | 主要依賴 |
|---|---|---|---|
| `order-entry` | [app/staff/page.tsx](/Users/hong/Claude/SHOPOPS/POS/app/staff/page.tsx) | **1147 行、57 個 hook** | 8 條 `/api/*`、Supabase 6 張表（含 nested）、menu realtime、離線 menu cache、**IndexedDB 落單佇列／帳簿**、客顯 broadcast、CTI popup、held-payment recovery |
| `checkout-report` | 同上 + 收款 modal | 繼承上面全部 | 再加預載 ledger／打開 `UnpaidList`／觸發 `OfflineCheckoutModal` |
| `kitchen-order` | [app/admin/page.tsx](/Users/hong/Claude/SHOPOPS/POS/app/admin/page.tsx) | 610 行 | `orders` 七組 query（`eq/gte/lte/lt/not/is/in`）、nested `order_items`、`.channel().on().subscribe()`、`sessionStorage`、`localStorage`、10 秒輪詢 |
| `floor-progress` | [app/admin/tables/page.tsx](/Users/hong/Claude/SHOPOPS/POS/app/admin/tables/page.tsx) | 917 行 | 多組 orders query、realtime、輪詢、打印狀態 channel、`/api/print-jobs/[id]`、courier verify |

而 harness 個假 Supabase client 得 **74 行**，只撐 `select/order/eq/maybeSingle/single`，未知 table 直接 throw（[fixtures/supabase-client.ts:25](/Users/hong/Claude/SHOPOPS/POS/tools/screenshot-harness/fixtures/supabase-client.ts#L25)），亦**冇 `.channel()`**（一叫即 throw）。

- **核心問題**（Codex 講得好準）：query stub 會愈加愈似自己寫一個半套 Supabase emulator。Production 一加 `.or()`／`.range()`／新 nested join，scene 就斷
- **下次成本**：重跑 30–60 分鐘，但**日常 upkeep 貴**

### 路 C：Harness presentation scenes（🏆 Codex 提出並建議）

唔載入完整 production page，**用真 component 直接餵固定 props**，scene 負責砌成一個真實 workflow 畫面。呢個就係 harness 現有 14 個 scene 已經用緊嘅 pattern（例：`BilingualScene` 直接用真 `OrderCard` 加 fixture）。

| Scene | 重用嘅真 component | 新增 | 工時（Codex 估） |
|---|---|---|---|
| `order-entry` | `OrderingLayout`／`MenuItemGrid`／`Cart` | `OrderEntryScene.tsx` + `fixtures/workflow.ts`；scene 自己出 Core-only header | 1–1.5 日 |
| `checkout-report` | 真 `OfflineCheckoutModal` | 共用上面 fixture；建一個冇 `server_order_id` 嘅 ledger entry → 直接行 local fallback，唔掂 API | 半日 |
| `kitchen-order` | 真 `OrderCard` | `KitchenOrderScene.tsx`；3 pending + 2 preparing；**唔傳 `onShowRecipe` → recipe icon 自動唔出**（[OrderCard.tsx:212](/Users/hong/Claude/SHOPOPS/POS/components/admin/OrderCard.tsx#L212)，已核實）；日期位顯示 `Today` | 半日–1 日 |
| `floor-progress` | 要先抽 `TableProgressCard` | markup 而家 inline 喺 917 行 page 入面（[:775](/Users/hong/Claude/SHOPOPS/POS/app/admin/tables/page.tsx#L775)、[:517](/Users/hong/Claude/SHOPOPS/POS/app/admin/tables/page.tsx#L517)、[:599](/Users/hong/Claude/SHOPOPS/POS/app/admin/tables/page.tsx#L599)）→ **要動 production code** | 1–1.5 日 |

**共用要改**：`fixtures/workflow.ts`（新）、四個 scene（新）、`components/SceneRenderer.tsx`、`scenes/manifest.mjs`（新增 `workflow` group，輸出 `workflow/*.webp`）、`scripts/capture.mjs`、`tests/manifest.test.mjs`、`tests/artifacts.test.mjs`、`tests/workflow-scenes.test.mjs`（新）、harness `docs/screenshot-register.md`、`components/admin/TableProgressCard.tsx`（新，production）、`app/admin/tables/page.tsx`（改用抽出嘅 component）、POS production regression test。

**Codex 點名嘅五個撞板位**：
1. `TableProgressCard` extraction **只准搬 markup／props／callbacks**，唔准順手重構行為
2. Staff header 而家唔係獨立 component，scene 手砌會有 drift 風險 → scene test 要核對必要 label
3. Checkout modal 初 render 會由 loading 轉 offline fallback → ready selector 要等 `CASH`／`CARD` 出現先截圖
4. 現有 capture 用自訂 `Date` override，長遠建議轉 Playwright 官方 `page.clock.setFixedTime()`
5. `FixtureProviders` 而家對**所有** scene 開齊全部模組（[FixtureProviders.tsx:8](/Users/hong/Claude/SHOPOPS/POS/tools/screenshot-harness/components/FixtureProviders.tsx#L8) `FIXTURE_MODULES = [...MODULE_KEYS]`，已核實）→ **唔可以全域改走**，否則整壞 14 張 add-on scene；workflow scene 要有自己嘅 Core-only provider

**下次成本**：15–30 分鐘（跑 capture → 自動驗 → 人眼 gate → copy 入 Landing → 更新 register → 跑 verify）

---

## 2. 兩份方案嘅一致位同分歧位

### ✅ 一致

1. 純人手路（路 A）唔應該再揀
2. 完整 fixture 化四個 production page（路 B）成本／風險唔成正比
3. F15 應該**加數據唔好裁圖**，四張統一 1280×900（Codex 額外指出：Landing 而家 kitchen／floor 係 1045×735 特例，[pos-demo-assets.test.mjs:44-47](/Users/hong/Claude/SHOPOPS/Landing/tests/pos-demo-assets.test.mjs#L44-L47)，統一返會簡化 layout）
4. 呢個決定**唔算難回頭**（四張 WebP 隨時換得；harness 係 local-only；冇 DB schema／對外 API 鎖死）
5. 守則 #11 嘅判斷：唔應該用「長遠」去支持路 B；但「唔好揀之後不停返工嘅易路」對路 A **fire**
6. Landing 側收尾兩條路都要做（見第 4 節）

### ⚔️ 分歧

| | Claude | Codex | 拍板後果 |
|---|---|---|---|
| **建議** | 混合路：`kitchen-order` + `floor-progress` 搬入 harness，`order-entry` + `checkout-report` 維持人手 | 路 C：四張一次過搬，用 presentation scene | Claude 版少做約一半，但保留兩套 provenance |
| **F9 修得到未** | 假設「熄模組」搞掂 → **已證實錯**（0.1） | 由 scene 控制 render 咩 → 修到 | Codex 勝 |
| **`floor-progress` 最抵搬？** | 排第二抵（有日期 + 有空白） | 排**最貴**（UI inline 喺 917 行 page，要先抽 production component） | Codex 講得對，Claude 冇睇到 markup 係 inline |
| **分唔分期** | 分（2 搬 2 留） | 唔建議分（四張今次都要重影，分期反而同時維持兩套 provenance）；但如果要分，次序係 kitchen-order → checkout-report → order-entry → floor-progress | 見 D1 |

**Claude 認低嘅位**：我原本嘅混合路建基於兩個錯判——(a) 以為熄模組修到 F9；(b) 以為 `floor-progress` 易搬。兩個都經核實推翻。Codex 嗰份喺呢兩點上準過我。

---

## 3. HONG 已拍板（2026-08-12）

| | 決定 | 影響 |
|---|---|---|
| **D1** | **路 C，四張全做** | 唔分期。約 3.5–4.5 日，工作主要喺 POS repo |
| **D2** | **a：scene render 灰色 disabled 嘅 Delivery** | 同 Core-only 真客人所見一致；唔改 production entitlement 行為；`Recipes` 就真係唔出（唔傳 `onShowRecipe`） |
| **D3** | 加數據，唔裁圖，四張統一 1280×900 | Landing `expectedDimensions` 要拆走 kitchen／floor 嘅 1045×735 特例 |
| **D5** | **收貨**：准為 `floor-progress` 抽 `TableProgressCard` | 只准搬 markup／props／callbacks，唔准順手重構行為，要有 production regression test |
| **E1** | **a：四張維持全螢幕真 app 外觀** | Workflow scene **唔用**現有 marketing `FixtureShell`（橙色 eyebrow／大標題／`Fictional demo data` badge）；要喺 scene 砌返 app chrome，並用 scene test 釘住必要 label 防 drift |
| **E2** | **c：兩道新閘（下半空白上限、唔准絕對日期）寫成全 18 張適用，現有違規者列白名單** | 唔擴大今次 scope；白名單本身就係一張可見嘅舊債清單，之後另開一案清 |
| **D4** | ⏳ **未拍板** | 見下面。只阻住 `order-entry`，唔阻住頭兩個 scene |

### ⏳ D4 —— `order-entry` 嘅逐 pixel baseline 測試點算

Landing 現有測試只准 6 個食物相圓角格嘅 pixel 同 baseline 唔同，其餘每一粒都要一樣
（[pos-demo-assets.test.mjs:184](/Users/hong/Claude/SHOPOPS/Landing/tests/pos-demo-assets.test.mjs#L184)）。重影之後必定失效。

- **D4-a**：保留現流程，更新 `tests/fixtures/pos-demo-order-entry-baseline.webp` 同 tile 座標
- **D4-b**：harness fixture 直接用已批准嘅 6 張食物相，測試改成「6 格存在／非空／各自 hash 唔同／零第三方 request」

⚠️ D4-b 等於放寬現有保護契約，Codex 自己都話實作前要獨立 review。

---

## 3b. 原始拍板選項（保留備查）

### D1 — 揀邊條路？

- **C（Codex 建議）**：四張一次過用 presentation scene 搬入 harness。約 3.5–4.5 日
- **C 分期（Codex 次選）**：先 `kitchen-order` + `checkout-report`（約 1–1.5 日，收益最大），其餘之後做
- **A（唔建議）**：人手再影，但 F9 修唔全、F16 修唔到根

### D2 — 🔴 F9 到底點修？（0.3 帶出，兩份原方案都冇答）

一個 Core-only 客人**真係會見到**灰色 Delivery 掣。所以：

- **D2-a**：scene render **灰色 disabled** 嘅 Delivery／Takeaway → 誠實（同真客人所見一致），而且灰色本身已經唔似「已包含嘅功能」
- **D2-b**：scene **完全唔 render** Delivery → 畫面最乾淨，但展示緊冇人見過嘅 UI
- **D2-c**：改 POS production，令呢啲控制真係受 entitlement gate 管 → 最徹底，但係**產品決定**，影響真客人，唔應該由 marketing 截圖推動

Claude 傾向 **D2-a**。

### D3 — F15 加數據定裁圖？

兩份一致建議**加數據 + 統一 1280×900**。如果冇異議可以直接照做，唔使特別拍板。

### D4 — `order-entry` 嘅 pixel baseline 點算？

Landing 有一條好辣嘅測試：只准 6 個食物相圓角格嘅 pixel 唔同，其餘每一粒都要同 baseline 一樣（[pos-demo-assets.test.mjs:184](/Users/hong/Claude/SHOPOPS/Landing/tests/pos-demo-assets.test.mjs#L184)，已核實）。重影之後一定失效。

- **D4-a**：保留現流程，更新 `tests/fixtures/pos-demo-order-entry-baseline.webp` 同 tile 座標
- **D4-b**（Codex 較推薦）：harness fixture 本身直接用已批准嘅 6 張食物相，Landing 測試改成「6 格存在／非空／各自 hash 唔同／零第三方 request」，ownership 交返人眼 licence gate

⚠️ Codex 自己都標明 D4-b **等於放寬現有保護契約，實作前要獨立 review，唔可以靜靜鬆**。

### D5 — 為咗截圖去抽 production component（`TableProgressCard`）你收唔收貨？

路 C 嘅 `floor-progress` 要動 [app/admin/tables/page.tsx](/Users/hong/Claude/SHOPOPS/POS/app/admin/tables/page.tsx) 抽一個純展示 component 出嚟。係可回退嘅 presentation refactor，但佢係**由 marketing 需求驅動嘅 production 改動**。唔收貨嘅話，`floor-progress` 就要留返人手，或者 scene 自己複製一份會 drift 嘅假 markup（唔建議）。

---

## 3c. 開工後量度到嘅新事實（2026-08-12，Claude）

量度全部 18 張「下半 45% 近白像素」比例（同 handoff 同一方法），發現 **F15 同 F16 都唔限於嗰四張人手圖**：

| 資產 | 下半近白 | 備註 |
|---|---:|---|
| `core/bilingual` | 99% | 已上線；**肉眼核實真係空一半** |
| `add-ons/scheduling` | 99% | 已上線；**肉眼核實空一半，兼且顯示絕對日期 `08-03`…`08-16`（＝F16）** |
| `add-ons/food_safety`／`add-ons/custom_domain` | 99% | |
| `floor-progress` | 98% | F15 flag 咗 |
| `add-ons/reservations` | 98% | |
| `kitchen-order` | 97% | F15 flag 咗 |
| `add-ons/reviews`／`add-ons/delivery` | 95% | |
| `order-entry` | 84% | ⚠️ 但肉眼睇係滿嘅 —— 見下面警告 |
| `checkout-report` | 13% | |
| `core/offline_backup` | 6% | |

⚠️ **呢個數字係 proxy 唔係真相**：白底 UI 都會計入「近白」，所以 `order-entry` 84% 但實際好滿。
單靠數字唔可以判違規，一定要配肉眼。定閘門檻嗰陣要記住呢點。

**結論**：F15 係 harness 個框（固定 `min-h-[836px]` 卡 + 內容唔夠高）造成，唔係人手影圖獨有；
F16 亦已經出現喺 harness 產物。所以兩道閘擺喺 harness 層先啱（＝E2-c）。

---

## 4. Landing 側收尾（揀邊條路都要做，7 項）

1. 換四個 `public/pos-demo/*.webp`
2. 更新 [docs/pos-demo-screenshot-register.md](/Users/hong/Claude/SHOPOPS/Landing/docs/pos-demo-screenshot-register.md)：capture 日期／provenance／fixture 狀態／dimensions／bytes／SHA-256／network request／F9-F15-F16 審核結果／**商標同 licence 兩欄人手重新 tick**
3. 更新 [tests/pos-demo-assets.test.mjs](/Users/hong/Claude/SHOPOPS/Landing/tests/pos-demo-assets.test.mjs)：kitchen／floor 改 1280×900；新增 workflow 內容閘（唔准出 `Recipes`／`Delivery` 字樣、最低 card 數、唔准有絕對日期 pattern、下半近白像素上限）
4. 處理 `order-entry` baseline（見 D4）
5. 真 render 驗三個使用位置：首頁、`/pos`、`/pos/features`
6. 跑 Landing `npm run verify`
7. 原尺寸逐張人眼 gate：英文／無 PII／無真商業資料／無第三方商標／食物相 licence／文字可讀／F9-F15-F16 清零

---

## 對帳

來源：Codex 方案 13 個 block + Claude 方案 6 個 block + Claude 核實新增 2 條 = **21 條入**。

本檔覆蓋：C1→§0.1、C2→§0.2、C3→§1 路 A、C4→§1 路 B、C5→§1 路 C 表、C6→§1 路 C 共用要改、C7→§1 五個撞板位、C8→§2 分歧表 + D1、C9→§2 一致位 3 + D3、C10→D4、C11→§4、C12→§2 一致位 4-5、C13→§2 分歧表；
K1→§0、K2→§2 分歧表（已被推翻）、K3→§1 各路 findings、K4→§1 路 B 表、K5→§2 分歧表、K6→§0.2 + §2 一致位 5；
N1→§0.1/§0.2 證據欄、N2→§0.3 + D2。

**21 入 = 21 出，零 gap。**
