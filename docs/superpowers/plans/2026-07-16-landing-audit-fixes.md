# Landing 全站 Audit 修復 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修復 2026-07-16 全站 audit 發現嘅全部問題（blog 死 link、試用期矛盾、佣金率唔一致、stale metadata、crash 風險、表單錯誤訊息、一批 nits）。

**Architecture:** 純 copy / link / metadata / 小型 client 邏輯修改，冇新架構。全站三語（zh-Hant / zh-Hans / en）dict pattern，改文案必須三語齊改。

**Tech Stack:** Next.js 16 (Turbopack) + Tailwind v4 + MDX blog。

**Audit 報告出處:** memory `shopops_landing_followups.md`「🔍 全站深層 audit（2026-07-16）」section。

## ⚠️ 開工前必讀（2026-07-17 加註）

呢份 plan 寫於 2026-07-16。之後 **另外兩個 session 改動咗 main + 一個 worktree 進行緊**，令 plan 有兩個地方 stale：

1. **🔴 Task 9 Step 2 嘅做法已過時。** Plan 叫「抄 `app/pos/opengraph-image.tsx` 全個 pattern」寫 ~100 行獨立 `ImageResponse`。但 main 而家已經 merge 咗 `lib/og.tsx` 共用 renderer（commit `7fa7a5e`），每張 OG 圖淨係 12 行 `renderOgImage({ eyebrow, title, tags, cta })`。**照抄 plan 入面嗰段 code 會將啱啱抽走嘅重複種返落去**（違反共享層優先）。正確做法：`app/this-is-you/opengraph-image.tsx` 改用 `renderOgImage(...)`，內容照 plan 嘅英文文案（eyebrow: "A comic for shop owners" / title: "Is this you after closing time?" / tags: 三個 pain / cta: "See the comic →"）。動手前先讀返 `lib/og.tsx` 同 `app/pos/opengraph-image.tsx` 睇實際 API。

2. **🔴 全部行號 + 「舊文案」anchor 對 9 個檔案已經唔準。** `wt/dark-redesign` 深色重設計改緊呢批同一檔案：`PosLanding.tsx`、`ContactSection.tsx`、`SavingsCalculator.tsx`、`CompanyHome.tsx`、`PosFeatureGrid.tsx`、`RotaLanding.tsx`、`blog/LeadMagnet.tsx`、`blog/layout.tsx`、`blog/page.tsx`（仲換咗 emoji → Lucide、icon 抽離三語 dict）。**唔好靠 plan 嘅「Line 37」呢類行號**——逐個 grep 實際 code 搵返個舊字串先改。冇受影響嘅檔案：blog 三語 `.mdx`、`LangProvider.tsx`、`sitemap.ts`、`lib/posts.ts`、`docs/sns-playbook.md`、`app/this-is-you/`。

**HONG 已拍板（2026-07-17）：等 `wt/dark-redesign` merge 返 main 之後先執行呢份 plan**，由新 main 開 worktree，重新對住實際 code 搵舊文案。Task 10 Step 1（CompanyHome grid 3→2 欄）同 Step 2（PosFeatureGrid stale comment）要先檢查係咪已經被 dark-redesign 順手改咗。

**⚠️ `wt new` 要喺 PowerShell 跑**（`wt` 係 PS profile function）。用 Bash tool 跑會靜靜地乜都唔做、零錯誤零輸出 —— 跑完一定 `git worktree list` 核實。

---

## Global Constraints

- **HONG 已拍板（2026-07-16）:** 試用 offer = 「免費試用 3 天（唔使入太多資料）→ 確認採用後首 30 天免費 + 我哋幫佢入齊資料」；Just Eat 佣金統一 **14–17%**；`/this-is-you` **加入 sitemap**（唔係 noindex）；nits **全做**。
- **三語同步:** 任何 user-visible 文案改動，zh-Hant / zh-Hans / en 三份 dict 都要改，key 結構保持 parallel。
- **開工先開 worktree:** 喺 `D:\Claude\SHOPOPS\Landing` 跑 `wt new audit-fixes`（house rule：SHOPOPS repo 多 session 密集，必開 worktree）。⚠️ Landing 係 Next 16 + junction node_modules，worktree 入面 build 唔到就照 [[reference_worktree_nextjs16_pitfalls]]：刪 junction → 獨立 `npm install` → copy `.env.local`。
- **驗證方式:** 呢部機 `next dev` 好易 panic —— 一律用 `npm run build`（production build）驗，唔好依賴 dev server。
- **Type check:** 先刪 `.next` 資料夾再跑 `./node_modules/.bin/tsc --noEmit`（`.next/dev/types` 有個爛咗嘅生成檔會報 7 個假錯；**唔准用 bare `npx tsc`** —— squatter 風險，house rule）。
- **已知 pre-existing lint 錯（唔好修，超出 scope）:** `app/this-is-you/ComicAd.tsx:75` 同 `components/SiteHeader.tsx:27` 用 raw `<a href>`、`components/LangProvider.tsx` setState-in-effect。`npm run lint` exit non-zero 係預期。
- **OG image code 文字只可以用英文／ASCII**（satori 預設字型 render 唔到中文）。
- **Commit 前跑 `/review`**（house rule）；**push 屬對外動作，要問 HONG 先做**。
- 收工用 `wt done audit-fixes` merge 返 main。

---

### Task 1: 開 worktree + baseline build

**Files:** 無改動，純 setup。

- [ ] **Step 1: 開 worktree**

```powershell
cd D:\Claude\SHOPOPS\Landing
wt new audit-fixes
cd D:\Claude\SHOPOPS\Landing-wt-audit-fixes
```

- [ ] **Step 2: Baseline build 確認起點乾淨**

Run: `npm run build`
Expected: build 綠（exit 0）。如果 junction node_modules 令 build 爆，照 Global Constraints 嘅 worktree 三步修。

---

### Task 2: Blog 漏斗 link 全部改指 /pos（audit 🔴1）

**背景:** 2026-06-20 首頁重定位做公司頁後，計算機／POS 內容搬咗去 `/pos`，但 blog 全部 CTA 同內文 link 仲指住 `/`。

**Files:**
- Modify: `components/blog/LeadMagnet.tsx`
- Modify: `app/blog/layout.tsx`
- Modify: `app/blog/move-regulars-to-direct-ordering-uk/page.mdx`
- Modify: `app/blog/move-regulars-to-direct-ordering-uk-zh-hant/page.mdx`
- Modify: `app/blog/move-regulars-to-direct-ordering-uk-zh-hans/page.mdx`
- Modify: `app/blog/deliveroo-uber-eats-just-eat-commission-uk-2026/page.mdx`
- Modify: `app/blog/deliveroo-uber-eats-just-eat-commission-uk-2026-zh-hant/page.mdx`
- Modify: `app/blog/deliveroo-uber-eats-just-eat-commission-uk-2026-zh-hans/page.mdx`

- [ ] **Step 1: LeadMagnet.tsx 兩個 href + stale comment**

Line 44: `href="/#savings"` → `href="/pos#savings"`
Line 50: `href="/#contact"` → `href="/pos#contact"`

Lines 4-5 嘅 comment 改成（原文講「首頁既有」已經 stale）：

```
// 文末轉化區（漏斗出口）。Step 1 唔整獨立 gated PDF，先 reuse /pos 頁既有
// savings calculator + demo 聯絡表做 conversion，已係完整漏斗。
```

- [ ] **Step 2: app/blog/layout.tsx 「Book a Demo」掣**

Line 34: `href="/#contact"` → `href="/pos#contact"`

- [ ] **Step 3: 熟客文三語 line 81（計算機 link + 「首頁」字眼）**

`move-regulars-to-direct-ordering-uk/page.mdx:81`:
- 舊: `use the [savings calculator on the homepage](/#savings) to run yours.`
- 新: `use the [savings calculator](/pos#savings) to run yours.`

`...-zh-hant/page.mdx:81`:
- 舊: `可以用首頁的[慳錢計算機](/#savings)套你自己盤數。`
- 新: `可以用[慳錢計算機](/pos#savings)套你自己盤數。`

`...-zh-hans/page.mdx:81`:
- 舊: `可以用首页的[省钱计算器](/#savings)套你自己的账。`
- 新: `可以用[省钱计算器](/pos#savings)套你自己的账。`

- [ ] **Step 4: 6 篇文內文 `[ShopOps](/)` → `[ShopOps](/pos)`**

熟客文 ×3 喺 line 85、佣金文 ×3 喺 line 88，共 6 處。逐檔 Edit：`[ShopOps](/)` → `[ShopOps](/pos)`。

- [ ] **Step 5: 驗證零殘留**

Run: `grep -rn "](/#" app/blog components/blog && grep -rn "](/)" app/blog`
Expected: 兩個 grep 都零 match。

- [ ] **Step 6: Build + commit**

Run: `npm run build` → 綠。

```bash
git add components/blog/LeadMagnet.tsx app/blog/layout.tsx app/blog/*/page.mdx
git commit -m "blog: 漏斗 link 全部改指 /pos（計算機/聯絡/品牌 link 修死 anchor）"
```

---

### Task 3: 試用 offer 統一 —— 3 天試用 + 確認後首 30 天免費（audit 🔴2）

**Files:**
- Modify: `components/PosLanding.tsx`（三語 dict：hero.reassure / pricing.trial / contact.subtitle）
- Modify: `app/this-is-you/ComicAd.tsx`（三語 sub）

- [ ] **Step 1: PosLanding.tsx zh-Hant**

Line 37 `hero.reassure`:
- 舊: `"免費試用 1 天 (無合約 · 唔使信用卡登記)"`
- 新: `"免費試用 3 天 (無合約 · 唔使信用卡登記)"`

Line 100 `pricing.trial`:
- 舊: `"首月免費試用"`
- 新: `"免費試用 3 天 · 確認後首 30 天免費"`

Line 137 `contact.subtitle`:
- 舊: `"留低資料我哋會聯絡你，安排免費試用 1 天。"`
- 新: `"留低資料我哋會聯絡你，安排免費試用 3 天 —— 唔使入太多資料。確認採用後首 30 天免費，我哋仲會幫你入齊資料。"`

- [ ] **Step 2: PosLanding.tsx zh-Hans**

Line 163 `hero.reassure`: `"免费试用 1 天 (无合约 · 不用信用卡登记)"` → `"免费试用 3 天 (无合约 · 不用信用卡登记)"`

Line 226 `pricing.trial`: `"首月免费试用"` → `"免费试用 3 天 · 确认后首 30 天免费"`

Line 263 `contact.subtitle`: `"留下资料我们会联系你，安排免费试用 1 天。"` → `"留下资料我们会联系你，安排免费试用 3 天 —— 不用填太多资料。确认采用后首 30 天免费，我们还会帮你录入资料。"`

- [ ] **Step 3: PosLanding.tsx en**

Line 289 `hero.reassure`: `"Free 1-day trial (no contract · no card needed)"` → `"Free 3-day trial (no contract · no card needed)"`

Line 352 `pricing.trial`: `"First month free"` → `"Free 3-day trial · first 30 days free once you join"`

Line 395 `contact.subtitle`: `"Leave your details and we'll set up your free 1-day trial."` → `"Leave your details and we'll set up your free 3-day trial — hardly any setup needed. Once you're on board, your first 30 days are free and we'll load your data in for you."`

- [ ] **Step 4: ComicAd.tsx 三語 sub**

Line 15: `"免費試用 1 天 · 無合約 · 零抽佣"` → `"免費試用 3 天 · 無合約 · 零抽佣"`
Line 24: `"免费试用 1 天 · 无合约 · 零抽佣"` → `"免费试用 3 天 · 无合约 · 零抽佣"`
Line 33: `"Free 1-day trial · No contract · No commission"` → `"Free 3-day trial · No contract · No commission"`

- [ ] **Step 5: 驗證零殘留**

Run: `grep -rn "1 天\|1-day\|首月免費\|首月免费\|First month free" app components`
Expected: 零 match。

- [ ] **Step 6: Build + commit**

Run: `npm run build` → 綠。

```bash
git add components/PosLanding.tsx app/this-is-you/ComicAd.tsx
git commit -m "pos: 試用 offer 統一 —— 3 天試用 + 確認後首 30 天免費（三語，修 1 天 vs 首月矛盾）"
```

---

### Task 4: Just Eat 佣金統一 14–17%（audit 🟡3）

**Files:**
- Modify: `components/SavingsCalculator.tsx`

- [ ] **Step 1: 6 個 dict string + 1 個 comment 改 14–18% → 14–17%**

- Line 10 comment: `Just Eat 14–18%` → `Just Eat 14–17%`
- Line 33 (zh-Hant subtitle): `Just Eat 都要 14–18%` → `Just Eat 都要 14–17%`
- Line 36 (zh-Hant rateHint): `Just Eat 約 14–18%` → `Just Eat 約 14–17%`
- Line 49 (zh-Hans subtitle): `Just Eat 也要 14–18%` → `Just Eat 也要 14–17%`
- Line 52 (zh-Hans rateHint): `Just Eat 约 14–18%` → `Just Eat 约 14–17%`
- Line 65 (en subtitle): `Just Eat 14–18%` → `Just Eat 14–17%`
- Line 68 (en rateHint): `Just Eat ~14–18%` → `Just Eat ~14–17%`

- [ ] **Step 2: 驗證**

Run: `grep -rn "14–18\|14-18" app components lib`
Expected: 零 match。

- [ ] **Step 3: Build + commit**

```bash
git add components/SavingsCalculator.tsx
git commit -m "calculator: Just Eat 佣金統一 14–17%（對齊 blog 查證版）"
```

---

### Task 5: Blog index metadata 刪 stale 承諾（audit 🟡4）

**背景:** description 賣「taking bookings without fees, and getting more reviews」—— 評價功能已殺（07-15），blog 亦冇 bookings / reviews 文章。改成只講實際有嘅兩個 topic。

**Files:**
- Modify: `app/blog/page.tsx:8-9` 同 `:13-14`

- [ ] **Step 1: 改兩處 description（metadata + openGraph 一樣字）**

- 舊（兩處相同）: `"Practical guides for UK independent restaurants and cafes: cutting delivery commission, choosing a POS, taking bookings without fees, and getting more reviews."`
- 新（兩處相同）: `"Practical guides for UK independent restaurants and cafes: cutting delivery commission and moving your regulars to direct ordering."`

- [ ] **Step 2: Build + commit**

Run: `npm run build` → 綠。

```bash
git add app/blog/page.tsx
git commit -m "blog: index metadata 刪已停嘅 reviews/bookings 承諾，改講實有 topic"
```

---

### Task 6: Blog 文章補 twitter metadata（audit 🟡5）

**背景:** Next metadata 係 per-top-level-key 淺 merge —— 文章冇 `twitter` key 就成個繼承 root layout 嘅通用公司 title，分享去 X 出錯卡。

**Files:**
- Modify: 全部 6 篇 `app/blog/*/page.mdx`（metadata export）
- Modify: `app/blog/page.tsx`（index 都補埋）

- [ ] **Step 1: 每篇 page.mdx 嘅 `export const metadata = {...}` 加 twitter block**

每篇喺 `openGraph: {...},` 之後加（6 篇一樣 pattern，`post` 係該檔頂已有嘅 export）：

```ts
  twitter: {
    card: "summary",
    title: post.title,
    description: post.description,
  },
```

（用 `summary` 卡 —— 文章冇自己嘅大圖，唔好聲稱 `summary_large_image`。）

- [ ] **Step 2: app/blog/page.tsx metadata 加 twitter block**

喺 `openGraph: {...},` 之後加：

```ts
  twitter: {
    card: "summary",
    title: "ShopOps Blog — Running a UK Restaurant Smarter",
    description:
      "Practical guides for UK independent restaurants and cafes: cutting delivery commission and moving your regulars to direct ordering.",
  },
```

- [ ] **Step 3: 驗證 render 出 twitter tag**

Run: `npm run build && npx next start -p 3199 &`（背景起 production server），然後
`curl -s http://localhost:3199/blog/move-regulars-to-direct-ordering-uk | grep -o 'twitter:title[^>]*'`
Expected: 出文章 title（唔係「Custom Software & Business Automation」）。驗完 kill 個 server。

- [ ] **Step 4: Commit**

```bash
git add app/blog
git commit -m "blog: 文章+index 補 twitter metadata，修 X 分享卡出通用公司 title"
```

---

### Task 7: LangProvider —— localStorage read 加 guard + `<html lang>` 跟語言（audit 🟡7 + nit）

**Files:**
- Modify: `components/LangProvider.tsx:16-21`

**Interfaces:** `useLang()` API 不變。

- [ ] **Step 1: 改 useEffect（read 加 try/catch + 同步 document lang）**

舊（lines 16-21）:

```tsx
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh-Hant" || saved === "zh-Hans" || saved === "en") {
      setLangState(saved);
    }
  }, []);
```

新（read guard 同 setter 嗰個 try/catch 對齊；另加一個 effect 令 `<html lang>` 跟當前語言，screen reader / SEO 一致）:

```tsx
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "zh-Hant" || saved === "zh-Hans" || saved === "en") {
        setLangState(saved);
      }
    } catch {
      // localStorage 唔可用(cookies 全禁等)→ 維持預設語言,唔好 crash 成頁
    }
  }, []);

  // <html lang> 跟當前語言(root layout 係 server component 寫死 "en",呢度 client 同步)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
```

- [ ] **Step 2: Build + commit**

Run: `npm run build` → 綠。

```bash
git add components/LangProvider.tsx
git commit -m "lang: localStorage read 加 guard 防 SecurityError crash + html lang 跟語言切換"
```

---

### Task 8: 聯絡表單 —— 錯誤原因 surface + label 綁定（audit 🟡8 + nit）

**Files:**
- Modify: `components/ContactSection.tsx`
- Modify: `components/PosLanding.tsx`（contact dict ×3 語）
- Modify: `components/RotaLanding.tsx`（contact dict ×3 語）
- Modify: `components/CompanyHome.tsx`（contact dict ×3 語）

**Interfaces:** `ContactCopy` type 加兩個必填 key：`submitErrorTooLong: string` / `submitErrorRateLimit: string`。三個 landing component 嘅 contact dict 都要加（9 個 dict block）。

- [ ] **Step 1: ContactSection.tsx 改 type + 錯誤分流 + label 綁定**

`ContactCopy` type（line 20 `submitError` 之後）加：

```ts
  submitErrorTooLong: string;
  submitErrorRateLimit: string;
```

State 加 errorKind（line 41 附近）：

```tsx
  const [errorKind, setErrorKind] = useState<"generic" | "tooLong" | "rateLimit">("generic");
```

`handleSubmit` 入面（lines 53-61）舊:

```tsx
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
      setStatus("error");
    }
```

新（429 / 超長 分開顯示，其餘照舊 generic）:

```tsx
      if (!res.ok) {
        setErrorKind(
          res.status === 429 ? "rateLimit" : message.length > 2000 ? "tooLong" : "generic"
        );
        setStatus("error");
        return;
      }
      setErrorKind("generic");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
      setErrorKind("generic");
      setStatus("error");
    }
```

Error banner（lines 132-136）舊:

```tsx
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              {copy.submitError}
            </p>
          )}
```

新:

```tsx
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              {errorKind === "tooLong"
                ? copy.submitErrorTooLong
                : errorKind === "rateLimit"
                  ? copy.submitErrorRateLimit
                  : copy.submitError}
            </p>
          )}
```

Label 綁定 —— 三對 label/input 加 `htmlFor` / `id`：
- name: label 加 `htmlFor="contact-name"`，input 加 `id="contact-name"`
- email: label 加 `htmlFor="contact-email"`，input 加 `id="contact-email"`
- message: label 加 `htmlFor="contact-message"`，textarea 加 `id="contact-message"`

- [ ] **Step 2: 三個 landing component 嘅 contact dict 各加兩 key**

每個檔案入面，搵每個 `submitError:` 行，喺佢之後加（每檔 3 個 dict block，共 9 處）：

zh-Hant block:
```ts
      submitErrorTooLong: "訊息太長（上限 2000 字），請縮短啲再試",
      submitErrorRateLimit: "試多咗幾次，請等幾分鐘再試，或直接 email 我哋",
```

zh-Hans block:
```ts
      submitErrorTooLong: "信息太长（上限 2000 字），请缩短后再试",
      submitErrorRateLimit: "尝试次数过多，请几分钟后再试，或直接 email 我们",
```

en block:
```ts
      submitErrorTooLong: "Message too long (2,000 characters max) — please shorten it.",
      submitErrorRateLimit: "Too many attempts — please wait a few minutes or email us directly.",
```

- [ ] **Step 3: Type check 驗 9 個 dict 齊（`as const` + required key，漏一個會 build 爆）**

Run: `Remove-Item -Recurse -Force .next; ./node_modules/.bin/tsc --noEmit`
Expected: 0 error。

- [ ] **Step 4: Build + commit**

Run: `npm run build` → 綠。

```bash
git add components/ContactSection.tsx components/PosLanding.tsx components/RotaLanding.tsx components/CompanyHome.tsx
git commit -m "contact: 429/超長錯誤原因 surface 畀用戶（三語）+ label htmlFor 綁定"
```

---

### Task 9: /this-is-you —— 加入 sitemap + 換 1200×630 OG 圖（audit 🟡6）

**Files:**
- Modify: `app/sitemap.ts`
- Create: `app/this-is-you/opengraph-image.tsx`
- Modify: `app/this-is-you/page.tsx`（刪 metadata 入面嘅直幅 webp og/twitter images，改由 file convention 供圖）

- [ ] **Step 1: sitemap.ts 加 entry**

喺 `/blog` entry（line 26-29）之後、`...posts.map` 之前加：

```ts
    {
      url: `${SITE_URL}/this-is-you`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
```

- [ ] **Step 2: 新建 app/this-is-you/opengraph-image.tsx**

抄 `app/pos/opengraph-image.tsx` 全個 pattern（nodejs runtime、讀 `public/logo.png` 做 base64、1200×630、同一個深色 gradient + 橙 accent），淨係換右邊文字。**文字必須英文（satori 預設字型 render 唔到中文）**。完整檔案：

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Is this you? — ShopOps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0b0b0d 0%, #1a1a1f 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "440px",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="ShopOps" width={440} height={248} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "40px",
            flex: 1,
          }}
        >
          <div
            style={{
              color: "#fb923c",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            A comic for shop owners
          </div>
          <div
            style={{
              color: "#fff",
              fontSize: "60px",
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: "28px",
            }}
          >
            Is this you after closing time?
          </div>
          <div
            style={{
              color: "#9ca3af",
              fontSize: "24px",
              display: "flex",
              gap: "18px",
              flexWrap: "wrap",
            }}
          >
            <span>Endless paperwork</span>
            <span>·</span>
            <span>POS that fights you</span>
            <span>·</span>
            <span>Same grind daily</span>
          </div>
          <div style={{ marginTop: "36px", display: "flex" }}>
            <div
              style={{
                background: "#f97316",
                color: "#fff",
                fontSize: "26px",
                fontWeight: 700,
                padding: "14px 32px",
                borderRadius: "12px",
              }}
            >
              See the comic →
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 3: page.tsx 刪直幅 webp 圖引用**

`app/this-is-you/page.tsx` metadata：
- `openGraph` block 入面刪 `images: ["/comic-hant.webp"],` 呢行
- `twitter: { card: "summary_large_image", images: ["/comic-hant.webp"] },` 改成 `twitter: { card: "summary_large_image" },`

（file convention 嘅 `opengraph-image.tsx` 會自動掛上 og:image + twitter:image。）

- [ ] **Step 4: 驗證**

Run: `npm run build && npx next start -p 3199 &`，然後：
- `curl -s http://localhost:3199/sitemap.xml | grep this-is-you` → 有 entry
- `curl -s -o /dev/null -w "%{content_type} %{http_code}" http://localhost:3199/this-is-you/opengraph-image` → `image/png 200`
- `curl -s http://localhost:3199/this-is-you | grep -o 'og:image[^>]*'` → 指向 opengraph-image，唔再係 comic-hant.webp

驗完 kill server。

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/this-is-you
git commit -m "this-is-you: 加入 sitemap + 專屬 1200x630 OG 圖（取代被裁嘅直幅漫畫圖）"
```

---

### Task 10: 小 nits 一次過（audit 🔵）

**Files:**
- Modify: `components/CompanyHome.tsx:241`
- Modify: `components/PosFeatureGrid.tsx:6`
- Modify: `components/PosLanding.tsx`（pains 卡 #2 標題 zh ×2）
- Modify: `lib/posts.ts:84`

- [ ] **Step 1: CompanyHome 產品 grid 3 欄 → 2 欄**（Reviewscope 移走後得 2 卡，desktop 永遠空一欄）

Line 241: `grid grid-cols-1 sm:grid-cols-3 gap-5` → `grid grid-cols-1 sm:grid-cols-2 gap-5`

- [ ] **Step 2: PosFeatureGrid stale comment 刪「客人評價」**

Line 6:
- 舊: `// 同 6 大獨家重複嘅（食安記錄／客人評價／叫號屏廣告屏／成本毛利）唔喺呢度重覆。`
- 新: `// 同 6 大獨家重複嘅（食安記錄／叫號屏廣告屏／成本毛利）唔喺呢度重覆。`

- [ ] **Step 3: pains 卡 #2 zh 標題對齊數字口徑**（en 係 25–35%，zh「兩三成」=20–30% 唔對辦；desc £50 抽 £15 = 30%）

`components/PosLanding.tsx`:
- Line 49 (zh-Hant): `title: "抽你兩三成",` → `title: "一張單抽走三成",`
- Line 175 (zh-Hans): `title: "抽你两三成",` → `title: "一张单抽走三成",`
- en（line 301 `"They take 25–35%"`）唔郁。
- ⚠️ FAQ 同計算機標題嘅「兩三成」係口語 range 描述（連 Just Eat 14–17% 計，range 闊）——刻意唔郁，surgical。

- [ ] **Step 4: posts.ts comparator 補 equal case**（而家永不 return 0，同日期文章排序係 engine-defined）

Line 84:
- 舊: `[...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));`
- 新: `[...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));`

- [ ] **Step 5: Build + commit**

Run: `npm run build` → 綠。

```bash
git add components/CompanyHome.tsx components/PosFeatureGrid.tsx components/PosLanding.tsx lib/posts.ts
git commit -m "nits: 產品 grid 2 欄、stale comment、pains 卡數字口徑、posts sort stable"
```

---

### Task 11: docs/sns-playbook.md 刪 Reviewscope（audit 🟡 內部文件）

**背景:** Reviewscope 已停產品（07-15），但 SNS playbook（FB/IG 出帖藍本）仲有 9 處賣佢，包括 W4 content calendar 排咗 Reviewscope 推廣帖 —— 照住出帖就會賣咗隻死產品。

**Files:**
- Modify: `docs/sns-playbook.md`（lines 13, 31, 51, 68, 72, 93, 113, 133, 147 附近 —— 先 grep 攞實際行）

- [ ] **Step 1: 搵晒全部 mention**

Run: `grep -n -i "reviewscope" docs/sns-playbook.md`

- [ ] **Step 2: 逐處處理**

原則：**刪產品介紹 / 帖文模板**；content calendar 嘅 Reviewscope slot **換做 POS 功能 highlight**（例如「⭐ POS 獨家功能系列 — 過敏原落單警示 / 天氣客流報表 輪住介紹」），保持每週節奏唔留窿。唔肯定嘅位（例如成段 narrative 提到三隻產品）改寫成剩 POS + Rota 兩隻。

- [ ] **Step 3: 驗證 + commit**

Run: `grep -n -i "reviewscope" docs/sns-playbook.md`
Expected: 零 match。

```bash
git add docs/sns-playbook.md
git commit -m "docs: sns-playbook 刪已停嘅 Reviewscope，content calendar slot 換 POS 功能帖"
```

---

### Task 12: 總驗證 + /review + 交接

- [ ] **Step 1: 全套驗證**

```powershell
Remove-Item -Recurse -Force .next
./node_modules/.bin/tsc --noEmit   # expect 0 error
npm run build                       # expect 綠
```

再起 `npx next start -p 3199` 用 curl 全站掃一次：
- `/pos` 有「免費試用 3 天」「確認後首 30 天免費」，冇「1 天」「首月」
- `/blog/move-regulars-to-direct-ordering-uk` 內文 link 指 `/pos#savings`、twitter:title 係文章名
- `/sitemap.xml` 有 `/this-is-you`
- `/this-is-you/opengraph-image` 回 `image/png`
- 三語切換（可用 Playwright 截圖繁/简/EN 各一張肉眼睇 /pos hero + pricing + contact 三個位）

- [ ] **Step 2: 跑 `/review`**（house rule：commit 前 review；如上面逐 task commit 咗，就 review 成條 branch diff `git diff main...HEAD`），有真 finding 就修完再 commit。

- [ ] **Step 3: `wt done audit-fixes`** merge 返 main。

- [ ] **Step 4: 更新 memory** `shopops_landing_followups.md` 嘅「🔍 全站深層 audit」section —— 逐項 mark ✅，剩低未做嘅（見下面 Out of scope）保留。

- [ ] **Step 5: 問 HONG 先 push**（push 屬對外動作）。Push 完提醒 HONG：X/FB 分享卡有 cache，改咗 metadata 要用 Facebook Sharing Debugger / 貼新 link 先見到新卡。

---

## Out of scope（audit 有提但今次刻意唔做）

- **手機版 navbar 冇 menu**（Blog/定價 link 手機睇唔到）—— 可能係刻意極簡設計，要 HONG 另外拍板 + 設計，唔好順手加。
- **Footer 冇 privacy notice / 公司資料** —— 屬 legal/GDPR 上線清單（memory `shopops_legal_gdpr_launch`），等 Ltd / 首客節點一齊做。
- **Faq.tsx / ArticleJsonLd.tsx 嘅 JSON.stringify 未 escape `<`** —— 而家內容全部係 developer-authored 靜態 dict，冇實際風險；第時 FAQ 內容改由 CMS/用戶來源先要修。
- **3 個 pre-existing lint 錯**（見 Global Constraints）。
- **blog chrome（layout nav/footer）跟文章語言** —— 已知接受（品牌 chrome 保持英文）。
