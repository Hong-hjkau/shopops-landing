# Landing 全站深色重設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 hero 已證明有效嘅「黑底 + 發光橙」語言貫穿全站，同時修好字體（Geist 被 Arial 蓋、中文冇字體）同對比度兩個真實可用性缺陷。

**Architecture:** Tailwind v4 CSS-first — 所有 design token 定義喺 `app/globals.css` 嘅 `@theme` block（呢個 repo 冇 `tailwind.config`）。Icon 由三語翻譯資料抽出，改為 stable id + 共用 `Record<Id, LucideIcon>` 映射。深色化係逐個 component 換 class，唔改結構、唔改文案、唔改邏輯。

**Tech Stack:** Next.js 16.2.6 (App Router, Turbopack) · React 19.2.4 · TypeScript · Tailwind CSS v4 · `next/font/google` · `lucide-react`（新增）

## Global Constraints

- **Worktree**：全程喺 `D:\Claude\SHOPOPS\Landing-wt-dark-redesign`，branch `wt/dark-redesign`。**唔好喺主 repo `D:\Claude\SHOPOPS\Landing` 做嘢。**
- **⚠️ 本 worktree 會改 `package.json`（加 `lucide-react`）**。node_modules 係 junction 共享主 repo，唔反映新 deps → **必須喺本 worktree 跑獨立 `npm install`**（Task 2 Step 1）。
- **零測試框架**：呢個 repo 只有 `npm run lint` 同 `npm run build`。**唔好為此任務引入 vitest/jest**。驗證靠：對比度腳本（Task 1 建立）、grep 檢查、Playwright computed-style 檢查、逐頁截圖。
- **色值（已用 WCAG 公式實算，唔准改）**：
  - `--color-bg: #0A0A0B` · `--color-surface: #141416` · `--color-border: #26262A`
  - `--color-text: #FAFAFA`（18.96:1）· `--color-text-secondary: #A1A1AA`（7.72:1）
  - `--color-accent: #F97316`（7.06:1）· `--color-accent-hover: #FB923C`（8.74:1）
  - `--color-on-accent: #0A0A0B`（橙掣上面用**黑字**，7.06:1）
- **禁止**：新增第三級文字色（`#71717A` 實算 4.09:1，過唔到正文 AA）。文字色只有兩級。
- **禁止**：橙底配白字（實算 2.80:1，連 AA-large 3:1 都 FAIL）。
- **發光只准 3 個位**：hero logo、主 CTA 掣、`SavingsCalculator` 關鍵數字。其餘用實色橙。
- **唔改**：文案（三語）、資訊架構、`SavingsCalculator` 計算邏輯、`lib/site.ts`、SEO metadata、`/api/contact`。
- **唔做**：淺色／深色模式切換開關。
- **Blog 文章內文頁保持淺色背景**（唯一例外，見 Task 8）。
- **Commit 前跑 `/review`**（用戶 CLAUDE.md 規則）。Commit message 用繁體中文，結尾加 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。

---

### Task 1: 地基 — design token、字體、對比度驗證腳本

呢個 task 一做完，全站會即刻變黑（因為 `body` 換 token），之後每個 task 逐個 component 執靚。中途狀態係「黑底但部分 component 仲係淺色殘留」，屬預期。

**Files:**
- Create: `scripts/check-contrast.mjs`
- Modify: `app/globals.css`（全檔重寫，現時係 Next starter 原檔）
- Modify: `app/layout.tsx:1-17`（字體載入）、`app/layout.tsx:58`（body class）
- Modify: `package.json`（加 `contrast` script）

**Interfaces:**
- Consumes: 無（首個 task）
- Produces:
  - CSS 變數／Tailwind utility：`bg-bg` `bg-surface` `border-border` `text-text` `text-text-secondary` `text-accent` `bg-accent` `text-on-accent` `bg-accent-hover`
  - CSS class `.glow-accent`（發光，見 Task 7 使用）
  - `--font-geist-sans` `--font-geist-mono` `--font-noto-tc`
  - `npm run contrast` → 對比度驗算，任何色對 FAIL 即 exit 1

- [ ] **Step 1: 寫對比度驗證腳本**

Create `scripts/check-contrast.mjs`：

```js
// WCAG 2.1 相對亮度 + 對比度驗算。
// 點解要呢個：現站橙底白字實算得 2.80:1（連 AA-large 3:1 都 FAIL），
// 肉眼同 DevTools 目測捉唔到。新增色對必須加入 PAIRS 一齊驗。

const TOKENS = {
  bg: '#0A0A0B',
  surface: '#141416',
  border: '#26262A',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  accent: '#F97316',
  accentHover: '#FB923C',
  onAccent: '#0A0A0B',
};

// [名, 前景, 背景, 最低要求]
const PAIRS = [
  ['正文 on bg', TOKENS.text, TOKENS.bg, 4.5],
  ['次要文字 on bg', TOKENS.textSecondary, TOKENS.bg, 4.5],
  ['正文 on surface', TOKENS.text, TOKENS.surface, 4.5],
  ['次要文字 on surface', TOKENS.textSecondary, TOKENS.surface, 4.5],
  ['橙 on bg', TOKENS.accent, TOKENS.bg, 4.5],
  ['橙 on surface', TOKENS.accent, TOKENS.surface, 4.5],
  ['CTA 字 on 橙底', TOKENS.onAccent, TOKENS.accent, 4.5],
  ['CTA 字 on 橙 hover', TOKENS.onAccent, TOKENS.accentHover, 4.5],
];

const srgbToLin = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
};

const ratio = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
console.log('對比度驗算（WCAG 2.1）\n');
for (const [name, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${name.padEnd(24)} ${r.toFixed(2)}:1  (需 ${min}:1)`);
}
console.log('');
if (failed > 0) {
  console.error(`❌ ${failed} 個色對唔達標`);
  process.exit(1);
}
console.log('✅ 全部色對達標');
```

- [ ] **Step 2: 加 npm script，跑腳本驗證佢通過**

喺 `package.json` 嘅 `scripts` 加一行：

```json
"contrast": "node scripts/check-contrast.mjs"
```

Run: `npm run contrast`
Expected: 8 行全部 ✅，最後 `✅ 全部色對達標`，exit 0。

- [ ] **Step 3: 證明腳本捉到真嘅錯（反向驗證）**

暫時將 `PAIRS` 入面 `['CTA 字 on 橙底', TOKENS.onAccent, ...]` 嘅 `TOKENS.onAccent` 改做 `'#FFFFFF'`（即現站嘅做法）。

Run: `npm run contrast`
Expected: `❌ CTA 字 on 橙底  2.80:1  (需 4.5:1)`，exit 1。

**改返做 `TOKENS.onAccent`**，再跑一次確認返綠。呢步證明個腳本唔係擺設。

- [ ] **Step 4: 重寫 globals.css**

`app/globals.css` 全檔換成：

```css
@import "tailwindcss";

@theme {
  /* 深色 token —— 色值經 scripts/check-contrast.mjs 驗算，改動前先跑 npm run contrast */
  --color-bg: #0A0A0B;          /* 唔用純黑 #000：OLED 上內容邊界會「浮」 */
  --color-surface: #141416;
  --color-border: #26262A;
  --color-text: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-accent: #F97316;
  --color-accent-hover: #FB923C;
  --color-on-accent: #0A0A0B;   /* 橙底用黑字：白字得 2.80:1，FAIL */

  --font-sans: var(--font-geist-sans), var(--font-noto-tc), "PingFang TC",
    "Microsoft JhengHei", sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

/* 發光 —— 只准用喺 3 個位：hero logo、主 CTA、SavingsCalculator 關鍵數字。
   濫用會令發光唔再係重點，變成噪音。加新使用位前先問。 */
.glow-accent {
  filter: drop-shadow(0 0 24px rgb(249 115 22 / 0.45));
}
.glow-accent-sm {
  text-shadow: 0 0 18px rgb(249 115 22 / 0.55);
}
```

**⚠️ 注意**：starter 原檔嘅 `font-family: Arial, Helvetica, sans-serif` 已經移除 — 呢行就係蓋過 Geist 嘅元兇。

- [ ] **Step 5: 加載 Noto Sans TC + 改 body class**

`app/layout.tsx` — import 行加 `Noto_Sans_TC`：

```tsx
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
```

喺 `geistMono` 定義之後加：

```tsx
// 中文字體。Geist 冇 CJK 字符，唔載入嘅話繁/简中文會跌返系統預設，
// Windows / macOS / iOS 各自顯示唔同嘅字。
// next/font 會自動將 CJK 切成 unicode-range 分片，瀏覽器只下載用到嗰幾塊。
const notoTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});
```

改 `<html>` className（加 `notoTC.variable`）：

```tsx
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoTC.variable} h-full antialiased`}
    >
```

改 `<body>` className（`bg-white text-gray-900` → token）：

```tsx
      <body className="min-h-full flex flex-col bg-bg text-text">
```

- [ ] **Step 6: 起動 dev server 肉眼確認地基生效**

Run: `cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign && PORT=3001 npm run dev`

開 `http://localhost:3001`，DevTools 檢查：
- `<body>` computed `background-color` = `rgb(10, 10, 11)`
- 英文字 computed `font-family` **第一個係 Geist**（唔再係 Arial）
- 中文字 computed 用到 Noto Sans TC

Expected: 頁面已經係黑底（下半身 section 仲有淺色殘留 — 預期，後續 task 修）。

- [ ] **Step 7: Build 過**

Run: `npm run build`
Expected: build 成功，零 error。

- [ ] **Step 8: Review + Commit**

跑 `/review` 審當前改動，然後：

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
git add scripts/check-contrast.mjs app/globals.css app/layout.tsx package.json
git commit -m "$(cat <<'EOF'
feat(landing): 深色 design token 地基 + 修字體 + 對比度驗證腳本

- globals.css 由 Next starter 原檔重寫成深色 token（Tailwind v4 @theme）
- 移除 body 上 `font-family: Arial` —— 呢行一直蓋過特登載入嘅 Geist
- 加 Noto Sans TC（中文本來冇字體，跌返系統預設，各平台唔同）
- 加 scripts/check-contrast.mjs：WCAG 實算，捉到現站 CTA 橙底白字得 2.80:1

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Icon 由翻譯資料抽出 + 引入 Lucide（CompanyHome）

**點解要抽**：`icon` 而家埋喺三語翻譯資料入面 —— 同一個 🔄 喺 zh-Hant / zh-Hans / en 各寫一次。但 icon 唔係語言相關嘅嘢。唔抽走，就要喺三個地方重複貼同一段 Lucide import，本身就係製造重複。

**Files:**
- Create: `components/icons.ts`
- Modify: `components/CardGrid.tsx:1-5`（`CardItem.icon` 型別）、`components/CardGrid.tsx:28-53`（render）
- Modify: `components/CompanyHome.tsx:10-12`（型別）、翻譯資料三份、`components/CompanyHome.tsx:241-270`（render）
- Modify: `package.json`（加 `lucide-react`）

**Interfaces:**
- Consumes: Task 1 嘅 token utility（`bg-surface` `border-border` `text-text` `text-text-secondary` `text-accent`）
- Produces:
  - `components/icons.ts` 匯出 `type IconName`、`ICONS: Record<IconName, LucideIcon>`
  - `CardGrid` 嘅 `CardItem` 改為 `{ icon: IconName; title: string; desc: string }`（**由 emoji string 改為 icon 名**）

- [ ] **Step 1: 裝 lucide-react（本 worktree 獨立 install）**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
npm install lucide-react
```

⚠️ node_modules 係 junction 共享主 repo，呢步必須喺本 worktree 跑，唔可以靠主 repo。

Run: `node -e "import('lucide-react').then(m => console.log('ok', typeof m.Workflow))"`
Expected: `ok function`

- [ ] **Step 2: 建立共用 icon 映射**

Create `components/icons.ts`：

```ts
// Icon 名 → Lucide component 嘅單一映射。
//
// 點解 icon 唔放喺翻譯資料入面：icon 唔係語言相關嘅嘢 —— 一個齒輪喺繁體
// 同英文係同一個齒輪。放喺 dict 度等於同一個 icon 寫三次，改一次要記住改三處，
// 改漏就會出現「英文版新 icon、中文版舊 emoji」。
//
// 揀 Lucide（唔揀 Phosphor）嘅理由係風格：Lucide 幾何、嚴謹、貼死 24px 網格；
// Phosphor friendly、有機。SHOPOPS 賣精準，唔賣親切。

import {
  Workflow,
  Wrench,
  Brain,
  Package,
  Handshake,
  Flame,
  Unlock,
  UtensilsCrossed,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  // 服務四柱
  automation: Workflow,
  custom: Wrench,
  ai: Brain,
  products: Package,
  // 點解揀 SHOPOPS
  direct: Handshake,
  forged: Flame,
  yours: Unlock,
  // 產品
  pos: UtensilsCrossed,
  rota: CalendarDays,
} as const;

export type IconName = keyof typeof ICONS;
export type { LucideIcon };
```

- [ ] **Step 3: 改 CardGrid 收 IconName**

`components/CardGrid.tsx` — 頂部註解**保留原有兩個 look 嘅界定**，加一行講 icon 改動。完整新檔：

```tsx
// 全站共用嘅「icon + 標題 + 描述」卡片 grid。
// 兩個 look：tile = 深卡 icon 喺上（痛點卡／服務四柱／功能牆）；panel = 卡 icon 喺標題內（產品頁功能卡）。
// 唔屬呢兩個家族嘅 grid（首頁產品卡有 CTA、「點解揀」無卡框、POS 6 大獨家卡嵌 mockup）唔好硬塞入嚟。
// icon 收 IconName（見 components/icons.ts），唔收 emoji —— icon 唔屬翻譯資料。

import { ICONS, type IconName } from "@/components/icons";

type CardItem = { icon: IconName; title: string; desc: string };

const COLS = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-3",
  "2/3": "sm:grid-cols-2 lg:grid-cols-3",
} as const;

export default function CardGrid({
  items,
  cols,
  look = "tile",
  centered = false,
  size = "md",
}: {
  items: readonly CardItem[];
  cols: keyof typeof COLS;
  look?: "tile" | "panel";
  /** tile 專用：內容置中（痛點卡） */
  centered?: boolean;
  /** tile 專用：sm = 細一號（功能牆） */
  size?: "md" | "sm";
}) {
  return (
    <div className={`grid grid-cols-1 ${COLS[cols]} gap-5`}>
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return look === "panel" ? (
          <div key={item.title} className="bg-surface rounded-xl border border-border p-5 sm:p-6">
            <h3 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
              <Icon className="w-6 h-6 text-accent shrink-0" strokeWidth={2} aria-hidden />
              {item.title}
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{item.desc}</p>
          </div>
        ) : (
          <div
            key={item.title}
            className={`bg-surface rounded-xl border border-border p-6${centered ? " text-center" : ""}`}
          >
            <Icon
              className={`${size === "sm" ? "w-7 h-7 mb-3" : "w-8 h-8 mb-4"} text-accent${centered ? " mx-auto" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
            <h3 className={`${size === "sm" ? "text-lg" : "text-xl"} font-bold text-text mb-2`}>{item.title}</h3>
            <p className={`text-text-secondary leading-relaxed ${size === "sm" ? "text-sm" : "text-sm sm:text-base"}`}>
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: CompanyHome 型別改用 IconName**

`components/CompanyHome.tsx` — 加 import：

```tsx
import { ICONS, type IconName } from "@/components/icons";
```

改型別（`components/CompanyHome.tsx:10-12`）：

```tsx
type Pillar = { icon: IconName; title: string; desc: string };
type Product = { icon: IconName; name: string; desc: string; href: string; cta: string };
type Reason = { icon: IconName; title: string; desc: string };
```

- [ ] **Step 5: 三語翻譯資料嘅 emoji 換 icon 名**

喺 `dict` 入面**三份**（`zh-Hant` / `zh-Hans` / `en`）逐一改。**只改 `icon:` 欄位，唔准改 `title` / `desc` / `name` / `href` / `cta` 任何一隻字。**

`services.items`（三份都係同樣次序）：

| 原 | 改做 |
|---|---|
| `icon: "🔄"` | `icon: "automation"` |
| `icon: "🛠️"` | `icon: "custom"` |
| `icon: "🤖"` | `icon: "ai"` |
| `icon: "📦"` | `icon: "products"` |

`products.items`：

| 原 | 改做 |
|---|---|
| `icon: "🍽️"` | `icon: "pos"` |
| `icon: "🗓️"` | `icon: "rota"` |

`why.items`：

| 原 | 改做 |
|---|---|
| `icon: "🤝"` | `icon: "direct"` |
| `icon: "🍜"` | `icon: "forged"` |
| `icon: "🔓"` | `icon: "yours"` |

- [ ] **Step 6: 型別檢查捉漏網之魚**

Run: `cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign && npx tsc --noEmit`

Expected: 如果三份翻譯有任何一個 `icon:` 仲係 emoji，TS 會報 `Type '"🔄"' is not assignable to type 'IconName'`。**呢個就係抽走 icon 換嚟嘅保障** — 改漏一個 TS 即刻捉到。

⚠️ 若 `npx tsc` 出現非預期行為，改用 `./node_modules/.bin/tsc --noEmit`（避開 npx 拉錯 package）。

修到零 error 為止。

- [ ] **Step 7: CompanyHome 產品卡 + why 卡 render 改 icon component**

`components/CompanyHome.tsx` 產品卡（原 `:241-252`）：

```tsx
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.products.items.map((p) => {
              const Icon = ICONS[p.icon];
              return (
                <div key={p.name} className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                  <Icon className="w-8 h-8 mb-4 text-accent" strokeWidth={2} aria-hidden />
                  <h3 className="text-xl font-bold text-text mb-2">{p.name}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm sm:text-base flex-1">{p.desc}</p>
                  <a href={p.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover transition">
                    {p.cta} →
                  </a>
                </div>
              );
            })}
          </div>
```

`why` 卡（原 `:262-270`）：

```tsx
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.why.items.map((r) => {
              const Icon = ICONS[r.icon];
              return (
                <div key={r.title} className="text-center px-4">
                  <Icon className="w-8 h-8 mb-4 mx-auto text-accent" strokeWidth={2} aria-hidden />
                  <h3 className="text-xl font-bold text-text mb-2">{r.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{r.desc}</p>
                </div>
              );
            })}
          </div>
```

- [ ] **Step 8: 肉眼驗三語 icon 都出到**

Run: `PORT=3001 npm run dev`，開 `http://localhost:3001`

逐個語言撳 header 嘅 繁／简／EN 切換，確認：
- 「What we do」四個 icon 出到，橙色線條，**三語都一樣**
- 「Our products」兩個 icon 出到
- 「Why SHOPOPS」三個 icon 出到
- 冇任何 emoji 殘留喺呢三個 section

- [ ] **Step 9: Review + Commit**

跑 `/review`，然後：

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
git add components/icons.ts components/CardGrid.tsx components/CompanyHome.tsx package.json package-lock.json
git commit -m "$(cat <<'EOF'
feat(landing): icon 由三語翻譯資料抽出 + emoji 換 Lucide（首頁）

icon 唔係語言相關嘅嘢，但一直埋喺 dict 三份 copy 度各寫一次，
改一個要記住改三處。抽去 components/icons.ts 單一映射，
CardItem.icon 型別由 string 改 IconName —— 改漏 TS 即刻捉到。

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: PosLanding / RotaLanding / PosFeatureGrid 嘅 icon

**Files:**
- Modify: `components/icons.ts`（加新 icon）
- Modify: `components/PosLanding.tsx`（型別 + 三語 dict + render）
- Modify: `components/RotaLanding.tsx`（型別 + 三語 dict + render）
- Modify: `components/PosFeatureGrid.tsx`（型別 + 三語 dict）

**Interfaces:**
- Consumes: Task 2 嘅 `ICONS` / `IconName` / 新 `CardGrid` 介面
- Produces: 全站 `CardGrid` caller 統一用 `IconName`

- [ ] **Step 1: 盤點呢三個檔用緊邊啲 emoji**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -n 'icon: "' components/PosLanding.tsx components/RotaLanding.tsx components/PosFeatureGrid.tsx | sed 's/desc:.*//' 
```

將輸出嘅每個獨特 emoji 列一份清單，**逐個揀對應嘅 Lucide icon**。揀嘅原則：語意對應，唔係樣似。（例：🔔 候位叫號 → `BellRing`；📋 清單 → `ClipboardCheck`；🌡️ 溫度 → `Thermometer`）

⚠️ 呢步冇辦法喺計劃度預先寫死 —— 要睇實際 emoji 清單先揀得準。揀完先做 Step 2。

- [ ] **Step 2: 將新 icon 加入 components/icons.ts**

跟 Task 2 Step 2 嘅格式，喺 `ICONS` 加新條目 + 喺 import 加對應 Lucide component。**按 section 分組並加註解**（跟現有 `// 服務四柱` 嗰種）。

- [ ] **Step 3: 三個檔嘅型別改 IconName**

每個檔搵到 `icon: string` 嘅型別定義，改做 `icon: IconName`，並加 import：

```tsx
import { ICONS, type IconName } from "@/components/icons";
```

（`PosFeatureGrid` / `PosLanding` / `RotaLanding` 有部分只經 `CardGrid` render，唔使自己 `ICONS[...]` lookup — 只需型別啱。若有自行 render icon 嘅位，跟 Task 2 Step 7 嘅 pattern。）

- [ ] **Step 4: 三語 dict emoji 換 icon 名**

每個檔嘅三份翻譯逐一改 `icon:` 欄位。**唔准改任何文案。**

- [ ] **Step 5: 型別檢查**

Run: `cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign && ./node_modules/.bin/tsc --noEmit`
Expected: 零 error。任何漏改嘅 emoji 會報 `not assignable to type 'IconName'`。

- [ ] **Step 6: 全站 emoji-as-icon 清零驗證**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -rn 'icon: "' --include=*.tsx components app | grep -v 'icon: "[a-z]' 
```

Expected: **只剩 `components/mockups.tsx` 嘅結果**（假 UI 內部嘅 emoji，Task 9 處理）。`CompanyHome` / `PosLanding` / `RotaLanding` / `PosFeatureGrid` 應該零結果。

- [ ] **Step 7: 肉眼驗 /pos 同 /rota 三語**

Run: `PORT=3001 npm run dev`
開 `http://localhost:3001/pos` 同 `http://localhost:3001/rota`，三語各睇一次，確認 icon 出到、冇 emoji 殘留、語意啱（唔會出現「候位叫號」配個垃圾桶 icon 呢類）。

- [ ] **Step 8: Review + Commit**

跑 `/review`，然後 commit（message 講清楚換咗邊幾個檔嘅 icon）。

---

### Task 4: 深色化共用 component（SiteHeader / SiteFooter / ContactSection / Faq / PricingCard）

**Files:**
- Modify: `components/SiteHeader.tsx`
- Modify: `components/SiteFooter.tsx`
- Modify: `components/ContactSection.tsx`
- Modify: `components/Faq.tsx`
- Modify: `components/PricingCard.tsx`

**Interfaces:**
- Consumes: Task 1 token utility
- Produces: 無新介面（純樣式）

- [ ] **Step 1: 逐個檔盤點硬編碼淺色 class**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -nE 'bg-white|bg-gray-(50|100)|text-gray-(900|800|700|600|500)|border-gray-(100|200|300)' \
  components/SiteHeader.tsx components/SiteFooter.tsx components/ContactSection.tsx \
  components/Faq.tsx components/PricingCard.tsx
```

- [ ] **Step 2: 逐個換 token（對照表）**

| 原 class | 換做 |
|---|---|
| `bg-white` | `bg-surface`（卡／面板）或 `bg-bg`（頁面級） |
| `bg-gray-50` / `bg-gray-100` | `bg-surface` |
| `text-gray-900` / `text-gray-800` | `text-text` |
| `text-gray-600` / `text-gray-500` | `text-text-secondary` |
| `border-gray-100` / `border-gray-200` / `border-gray-300` | `border-border` |
| `text-orange-600` / `text-orange-500` | `text-accent` |
| `hover:text-orange-700` | `hover:text-accent-hover` |
| `bg-orange-500 text-white`（CTA） | `bg-accent text-on-accent`（**黑字**） |
| `hover:bg-orange-600` | `hover:bg-accent-hover` |

⚠️ **`SiteHeader` 嘅 `bg-white/80 backdrop-blur`** → `bg-bg/80 backdrop-blur`（保留 backdrop-blur，只換底色）。

⚠️ **表單 input**（`ContactSection`）：底色 `bg-surface`，邊 `border-border`，focus 邊 `focus:border-accent`，placeholder `placeholder:text-text-secondary`。

- [ ] **Step 3: 確認冇遺留**

Run 返 Step 1 同一句 grep。
Expected: 零結果（或只剩明確判定為 Blog 淺色例外嘅位 — 但呢 5 個檔應該全清）。

- [ ] **Step 4: 肉眼驗**

Run: `PORT=3001 npm run dev`
- Header：深色半透明、scroll 落去 backdrop-blur 仍然生效、三語切換掣睇得到
- Footer：深色
- Contact 表單：input 睇得到、打字睇得到、focus 有橙邊
- CTA 掣：**橙底黑字**

- [ ] **Step 5: Review + Commit**

---

### Task 5: 深色化頁面 section（CompanyHome / PosLanding / RotaLanding）

**Files:**
- Modify: `components/CompanyHome.tsx`（section 背景 + hero CTA）
- Modify: `components/PosLanding.tsx`（534 行 — 最大嗰個）
- Modify: `components/RotaLanding.tsx`

**Interfaces:**
- Consumes: Task 1 token、Task 4 已深色化嘅共用 component
- Produces: 無新介面

- [ ] **Step 1: CompanyHome hero 修 CTA + logo 發光**

`components/CompanyHome.tsx` hero section：

- `<section id="top" className="bg-black ...">` → `bg-bg`（統一用 token，唔用純黑）
- Logo `<Image ... className="mx-auto mb-6 sm:mb-8 w-56 sm:w-72 h-auto">` → 加 `glow-accent`（**發光位 1/3**）
- `text-white` → `text-text`；`text-gray-300` → `text-text-secondary`
- 主 CTA：`bg-orange-500 text-white ... hover:bg-orange-600` → `bg-accent text-on-accent ... hover:bg-accent-hover glow-accent`（**發光位 2/3**）
- 次 CTA：`border-gray-600 text-gray-200 hover:bg-gray-800` → `border-border text-text hover:bg-surface`

- [ ] **Step 2: CompanyHome 其餘 section 換 token**

用 Task 4 Step 2 同一張對照表。特別注意：
- `<section id="products" className="... bg-gray-50 border-y border-gray-100">` → `bg-surface border-y border-border`
- 所有 `text-gray-900` 標題 → `text-text`

- [ ] **Step 3: PosLanding 換 token**

同上對照表。呢個檔 534 行，**逐段做，唔好一次過 sed 全檔** —— 有啲 `bg-white` 可能係 mockup 內部（Task 9 先決定），要分開睇。

盤點：
```bash
grep -nE 'bg-white|bg-gray-|text-gray-|border-gray-|orange-' components/PosLanding.tsx
```

- [ ] **Step 4: RotaLanding 換 token**

同上。

- [ ] **Step 5: 全站淺色殘留掃描**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -rnE 'bg-white|bg-gray-(50|100)|text-gray-(900|800|700|600|500)|border-gray-' \
  --include=*.tsx components app | grep -v mockups.tsx | grep -v '/blog/'
```

Expected: 零結果（`mockups.tsx` 同 blog 排除 — 各自有專屬 task）。有殘留就修。

- [ ] **Step 6: 肉眼驗三頁三語**

`/`、`/pos`、`/rota` × 繁／简／EN = 9 個組合，逐個 scroll 到底。
搵：白色殘留區塊、睇唔到嘅字、橙底白字。

- [ ] **Step 7: Review + Commit**

---

### Task 6: SavingsCalculator 深色化 + 關鍵數字發光

**Files:**
- Modify: `components/SavingsCalculator.tsx`

**Interfaces:**
- Consumes: Task 1 token + `.glow-accent-sm`
- Produces: 無

⚠️ **唔准改計算邏輯** —— 只改樣式。

- [ ] **Step 1: 讀檔，分清楚「計算」同「樣式」**

Read `components/SavingsCalculator.tsx` 全檔。標出邊啲行係 state / 數學，邊啲係 className。**只准動 className。**

- [ ] **Step 2: 換 token**

用 Task 4 Step 2 對照表。滑桿／input 用 `bg-surface` + `border-border` + `accent-accent`（原生 range 用 `accent-*`）。

- [ ] **Step 3: 關鍵數字加發光（發光位 3/3）**

搵到顯示「每月慳返 £X」嗰個最大嘅數字，class 加 `text-accent glow-accent-sm`。

**只准一個數字發光** —— 呢個係全站最後一個發光配額。其他數字用 `text-accent` 實色。

- [ ] **Step 4: 肉眼驗**

拉滑桿，確認：數字跟住變（邏輯冇壞）、發光只喺主數字、其餘睇得清。

- [ ] **Step 5: 發光配額審計**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -rn 'glow-accent' --include=*.tsx components app
```

Expected: **剛好 3 個結果** — hero logo、hero 主 CTA、SavingsCalculator 主數字。多過 3 個就係違反設計約束，要收返。

- [ ] **Step 6: Review + Commit**

---

### Task 7: Blog — 列表深色、文章內文保持淺色

**點解內文係例外**：長文章喺純黑底上睇 5 分鐘會眼攰 —— 生理問題，唔係品味。全站黑嘅目的係畀人記得 SHOPOPS，唔係逼人睇唔完篇文。呢個係全案唯一嘅唔一致位，用戶明確批准。

**Files:**
- Modify: `components/blog/BlogList.tsx`
- Modify: `components/blog/LeadMagnet.tsx`
- Modify: blog 文章 layout（先確認實際路徑，見 Step 1）

**Interfaces:**
- Consumes: Task 1 token
- Produces: 文章內文頁一個淺色 scope wrapper

- [ ] **Step 1: 搞清楚 blog 路由結構**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
find app/blog -type f | sort
cat app/blog/layout.tsx 2>/dev/null || echo "（冇 blog layout）"
```

搞清楚：列表頁同文章頁係咪共用同一個 layout？文章內文喺邊度包住？

- [ ] **Step 2: BlogList / LeadMagnet 深色化**

用 Task 4 Step 2 對照表。

- [ ] **Step 3: 文章內文加淺色 scope**

喺**只包住文章內文**嘅 wrapper（唔係 blog 列表）加：

```tsx
<div className="bg-white text-gray-900">
  {/* 文章內文 */}
</div>
```

並加註解：

```tsx
{/* 刻意例外：全站深色，但長文章喺純黑底睇 5 分鐘眼攰（生理問題，唔係品味）。
    見 docs/superpowers/specs/2026-07-16-landing-dark-redesign-design.md「唯一嘅例外」。
    改之前先睇 spec。 */}
```

⚠️ 若文章同列表共用 layout，需將淺色 scope 落喺文章頁 route 而唔係共用 layout — **唔好連列表都變返白**。

- [ ] **Step 4: 肉眼驗**

- `/blog` 列表 → 深色
- 撳入任何一篇文 → 內文淺色、字睇得清
- 文章頁嘅 header / footer 交界唔會突兀

- [ ] **Step 5: Review + Commit**

---

### Task 8: mockups.tsx — 決定 + 執行

**呢個係 spec 刻意留低嘅未決點。** `components/mockups.tsx` 有 6 個手砌嘅假產品 UI 截圖，內部係淺色，並且用 emoji（🌅 🌡️ 🌙）做 UI 元素。

**唔可以喺紙上拍板** —— 要睇實物先判斷得到。

- [ ] **Step 1: 睇實物**

Run: `PORT=3001 npm run dev`，開 `/pos`，scroll 到有 mockup 嘅位，睇實際效果。

- [ ] **Step 2: 按實物揀（三選一，記錄理由）**

| 選項 | 幾時揀 |
|---|---|
| **A. 保留淺色 mockup** | 睇落似「真係影住個產品畫面」→ 淺色反而真實（真 POS UI 本身就係淺色）。加深色邊框／圓角過渡即可 |
| **B. mockup 深色化** | 睇落似「漏咗執嘅殘留白塊」→ 跟全站深色 |
| **C. 加框當「截圖」處理** | 中間路 — 保留淺色但明確加裝置框／陰影，讀者一望知係截圖唔係頁面 |

**mockup 內部嘅 emoji（🌅 🌡️ 🌙）預設保留** —— 佢哋係模擬真實 POS 畫面嘅內容，唔係本站嘅 icon system。除非選 B，否則唔郁。

- [ ] **Step 3: 執行揀咗嘅選項**

- [ ] **Step 4: 記錄決定**

喺 `components/mockups.tsx` 頂部加註解，寫低揀咗邊個 + 理由（跟 `CardGrid.tsx` 嗰種寫法）。

- [ ] **Step 5: Review + Commit**

---

### Task 9: 全站驗收

**Files:** 無改動（純驗證）。有發現先開修正 commit。

- [ ] **Step 1: 對比度腳本**

Run: `cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign && npm run contrast`
Expected: 全部 ✅，exit 0。

- [ ] **Step 2: Emoji-as-icon 清零**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
grep -rn 'icon: "' --include=*.tsx components app | grep -v 'icon: "[a-z]'
```
Expected: 只剩 `mockups.tsx`（若 Task 8 選 A/C）。

- [ ] **Step 3: 發光配額**

⚠️ **計劃修正（2026-07-17）**：原本寫「總數 = 3」係錯嘅。「3 個發光位」指嘅係
**3 個種類**（hero logo / 主 CTA / SavingsCalculator 關鍵數字），但站有 3 個
頁面（`/`、`/pos`、`/rota`）各有自己嘅 hero，所以正確預期係
**3 個種類 × 實際出現 7 次**（3 logo + 3 CTA + 1 數字）。

```bash
# 按種類審計，唔係數總數
grep -rn 'glow-accent' --include=*.tsx components app
```

Expected：
- `CompanyHome.tsx` 2 個（hero logo + hero 主 CTA）
- `PosLanding.tsx` 2 個（同上）
- `RotaLanding.tsx` 2 個（同上）
- `SavingsCalculator.tsx` 1 個（`glow-accent-sm`，關鍵數字）
- **其他任何檔案出現 = 違反設計約束，要收返**

- [ ] **Step 4: 字體實測（Playwright）**

`PORT=3001 npm run dev` 之後，用 Playwright 開 `http://localhost:3001`，evaluate：

```js
() => {
  const h1 = document.querySelector('h1');
  const body = document.body;
  return {
    bodyBg: getComputedStyle(body).backgroundColor,
    h1Font: getComputedStyle(h1).fontFamily,
    bodyFont: getComputedStyle(body).fontFamily,
  };
}
```

Expected:
- `bodyBg` = `rgb(10, 10, 11)`
- `fontFamily` **唔包含 `Arial`**，第一個係 Geist，之後有 Noto Sans TC

- [ ] **Step 5: CJK 字體傳輸量（spec 硬性上限 200KB）**

喺 Playwright 開繁體版首頁，睇 Network，篩 font 檔，加總。

Expected: **≤ 200KB**。
⚠️ 若超 200KB → **停低，唔好硬推**。按 spec 風險欄，退回系統字體 stack（`"PingFang TC", "Microsoft JhengHei", sans-serif`，移除 Noto Sans TC），並向用戶報告。

- [ ] **Step 6: 逐頁截圖**

三語 × 6 頁：`/`、`/pos`、`/rota`、`/blog`、任一 blog 文章、`/this-is-you`。

⚠️ **`/this-is-you` 係漫畫頁，本任務冇 task 覆蓋過佢** — 截圖睇下深色化之後有冇爛。有爛就修，冇就算。

搵：白色殘留、睇唔到嘅字、橙底白字、icon 唔見咗、版面爆咗。

- [ ] **Step 7: Lint + Build**

```bash
cd /d/Claude/SHOPOPS/Landing-wt-dark-redesign
npm run lint && npm run build
```
Expected: 兩個都零 error。

- [ ] **Step 8: 向用戶報告 + 交收**

按用戶 CLAUDE.md「完成實質工作後 3 件事」：
1. 改咗咩（1-3 bullet）
2. 優化 proposal（列點 + 「要唔要做？」收尾，唔好靜雞雞動手）
3. 新知識 → 記落 `reference_*.md` memory

然後問用戶收貨與否。**`wt done dark-redesign` merge 返主 repo 之前要用戶批准；push 去 remote 屬對外動作，另外問。**

---

## Self-Review 記錄

**Spec 覆蓋檢查**：

| Spec 章節 | 對應 Task |
|---|---|
| 1. 字體 | Task 1（Step 4-5），驗證 Task 9 Step 4-5 |
| 2. 顏色 token | Task 1（Step 4） |
| 3. 發光 3 個位限制 | Task 5 Step 1（2 個）、Task 6 Step 3（1 個），審計 Task 6 Step 5 + Task 9 Step 3 |
| 4. Icon → Lucide | Task 2（首頁）、Task 3（其餘），驗證 Task 9 Step 2 |
| 5. 逐個 section | Task 4（共用 component）、Task 5（頁面）、Task 6（計算機） |
| 6. Blog 例外 | Task 7 |
| 風險：CJK 字體肥 | Task 9 Step 5（含超標時嘅退路） |
| 風險：對比度唔夠 | Task 1 Step 1-3（腳本）+ Task 9 Step 1 |
| 風險：淺色殘留 | Task 5 Step 5 + Task 9 Step 6 |
| 風險：mockups 突兀 | Task 8 |

**發現嘅缺口（已補入計劃）**：
- Spec 冇提 `/this-is-you` 漫畫頁 → 補入 Task 9 Step 6 做截圖檢查
- Spec 冇提 `package-lock.json` → 補入 Task 2 Step 9 嘅 `git add`
- Task 3 Step 1 嘅 icon 對應表無法預先寫死（要睇實際 emoji 清單）→ 已明確標示係「睇咗先揀」嘅步驟，唔係 placeholder

**型別一致性**：`IconName` / `ICONS` / `LucideIcon` 喺 Task 2 定義，Task 3 沿用同一批名，無分歧。
