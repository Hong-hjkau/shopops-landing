# SHOPOPS 公司首頁 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 landing 首頁由「賣 POS 畀餐廳」重定位成「介紹 SHOPOPS 公司」，POS 內容搬去 `/pos`，並抽出兩版共用嘅 nav / 聯絡表 / footer / 語言切換。

**Architecture:** 把互動內容拆入 client component（`CompanyHome`、`PosLanding`），`app/page.tsx` 同 `app/pos/page.tsx` 做 server 殼負責出各自嘅 metadata + JSON-LD（Next.js metadata 只喺 server component 有效）。語言狀態升上 `LangProvider`（context + localStorage），掛喺 root layout，兩版共用、跳版唔 reset。

**Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4。聯絡後端 `/api/contact`（Resend + Upstash）**零改動**。

## Global Constraints

- 三語：`Lang = "zh-Hant" | "zh-Hans" | "en"`（`lib/i18n.ts`，single source）；所有面向客嘅文字三語鏡像，跟現有 inline `dict` pattern。
- 中文遇英文／數字前後加半形空格（HONG 排版規則）；公司名用 ShopOps（品牌寫法，沿用現有）。
- **公司首頁 `/` 不綁地區**（不提 Edinburgh）。`/pos` **保留** 現有 Edinburgh 本地 SEO 文案 / metadata / JSON-LD（已儲排名，原封承繼）。
- 品牌：延用深色 + 橙（`bg-black` Hero、`orange-500` accent、現有 logo）。
- 公司頁 nav 第二項 = 「服務」；主 CTA = 「免費諮詢」。Reviewscope / Rota 首版無獨立頁，「了解更多」導去 `#contact`。
- **無單元測試框架**（marketing site）。每個 task 驗證 = `npx tsc --noEmit` 乾淨；page／路由 task 額外 `npm run build` 綠 + `npm run start` + curl／Playwright 肉眼核實。**唔好用 `next dev`**（呢部機 Turbopack 易 panic，memory `reference_windows_machine_crashes`）。
- **Commit 前要過 review hook**：repo 有 PreToolUse hook 要 review marker。每次 commit 流程（memory `reference_review_marker_commit_path`）：① 一個 Bash call `git add <files> && python ~/.claude/hooks/review_marker.py write` ② 另一個 Bash call `git commit -F <msgfile>`（commit message 用檔案，避 heredoc 坑 memory `reference_commit_msg_heredoc_trap`；cd 用 `/d/Claude/SHOPOPS/Landing` forward-slash）。CRLF warning 係 autocrlf 正常現象，無視。
- Commit message 結尾加 `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`。**唔好 push**（push 屬對外動作，由 HONG 決定）。

---

## 檔案結構（目標）

```
app/
  layout.tsx          改：包 <LangProvider>；default metadata 改中性公司導向；移走 body 嘅 POS JSON-LD <script>
  page.tsx            改：server 殼 — 公司 metadata + Organization JSON-LD，render <CompanyHome/>
  pos/page.tsx        新：server 殼 — POS metadata + SoftwareApplication JSON-LD，render <PosLanding/>
  sitemap.ts          改：加 /pos
components/
  LangProvider.tsx    新：Lang context + localStorage；export useLang()
  SiteHeader.tsx      新：logo + 語言 toggle + CTA；navLinks/cta 由 prop 傳
  SiteFooter.tsx      新：footer，text 由 prop 傳
  ContactSection.tsx  新：聯絡表單（搬現有 form + fetch），copy 由 prop（公司 / POS 兩套）
  CompanyHome.tsx     新：公司首頁內容 + 三語 dict
  PosLanding.tsx      新：現有 page.tsx 內容原封搬入（接共用 component + useLang + 加公司首頁 link）
lib/i18n.ts           不變（Lang type）
```

執行階段建議先 `wt new company-home` 開 worktree（無 migrations，唔使理號段）。

---

## Phase 1 — 抽共用層 + POS 搬去 /pos

### Task 1: LangProvider（語言記憶）+ 掛入 root layout

**Files:**
- Create: `components/LangProvider.tsx`
- Modify: `app/layout.tsx`（body 包 children）

**Interfaces:**
- Produces: `LangProvider`（component）、`useLang(): { lang: Lang; setLang: (l: Lang) => void }`

- [ ] **Step 1: 建 LangProvider**

`components/LangProvider.tsx`：
```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "shopops-lang";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };
const LangContext = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR 同首次 client render 都用預設,避免 hydration mismatch;mount 後先由 localStorage 還原
  const [lang, setLangState] = useState<Lang>("zh-Hant");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "zh-Hant" || saved === "zh-Hans" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // localStorage 唔可用(隱私模式等)→ 純記憶體 fallback,唔影響切換
    }
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang 必須喺 <LangProvider> 入面用");
  return ctx;
}
```

- [ ] **Step 2: root layout 包 LangProvider**

`app/layout.tsx`：`import { LangProvider } from "@/components/LangProvider";`，body 內把 `{children}` 包住：
```tsx
<body className="min-h-full flex flex-col bg-white text-gray-900">
  <LangProvider>{children}</LangProvider>
  <Analytics />
  <SpeedInsights />
</body>
```
（暫時保留現有 `<script>` JSON-LD 喺 body，Task 7 先移走，免一次過爆太多改動。）

- [ ] **Step 3: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error（exit 0）。

- [ ] **Step 4: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/LangProvider.tsx app/layout.tsx && python ~/.claude/hooks/review_marker.py write
```
（另一 call）
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 加 LangProvider 語言記憶(context + localStorage)' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 2: SiteHeader（共用 nav）

**Files:**
- Create: `components/SiteHeader.tsx`

**Interfaces:**
- Consumes: `useLang()`（Task 1）
- Produces: `SiteHeader`（default export）、`type NavLink = { href: string; label: string }`。Props：`{ navLinks: NavLink[]; cta: { href: string; label: string } }`

- [ ] **Step 1: 建 SiteHeader**

搬現有 `app/page.tsx` 嘅 `<header>` markup（logo + nav + 三語 toggle + CTA），改成食 props + `useLang()`。logo 連去 `/`（公司首頁）。

`components/SiteHeader.tsx`：
```tsx
"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import type { Lang } from "@/lib/i18n";

export type NavLink = { href: string; label: string };

const LANGS: { key: Lang; label: string }[] = [
  { key: "zh-Hant", label: "繁" },
  { key: "zh-Hans", label: "简" },
  { key: "en", label: "EN" },
];

export default function SiteHeader({
  navLinks,
  cta,
}: {
  navLinks: NavLink[];
  cta: { href: string; label: string };
}) {
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="" width={512} height={496} className="h-8 w-auto" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">ShopOps</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gray-900 transition">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-medium">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-3 py-1 rounded-full transition ${
                  lang === l.key ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === l.key}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href={cta.href}
            className="hidden sm:inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error（SiteHeader 暫未被任何頁用，純編譯通過）。

- [ ] **Step 3: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/SiteHeader.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 抽 SiteHeader 共用 nav(logo + 語言 toggle + CTA)' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 3: SiteFooter（共用 footer）

**Files:**
- Create: `components/SiteFooter.tsx`

**Interfaces:**
- Produces: `SiteFooter`（default export）。Props：`{ text: string }`

- [ ] **Step 1: 建 SiteFooter**

`components/SiteFooter.tsx`（純展示，唔需 "use client"）：
```tsx
export default function SiteFooter({ text }: { text: string }) {
  return (
    <footer className="px-4 sm:px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
      {text}
    </footer>
  );
}
```

- [ ] **Step 2: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error。

- [ ] **Step 3: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/SiteFooter.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 抽 SiteFooter 共用 footer' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 4: ContactSection（共用聯絡表單）

**Files:**
- Create: `components/ContactSection.tsx`

**Interfaces:**
- Consumes: `useLang()`（Task 1）；POST `/api/contact`，body `{ name, email, message, lang }`，成功回 `{ ok: true }`
- Produces: `ContactSection`（default export）、`type ContactCopy`。Props：`{ copy: ContactCopy }`

`ContactCopy` 欄位（同現有 `dict.*.contact` 完全對齊，方便 POS 直接傳）：
```
title, subtitle, reassure, nameLabel, namePlaceholder, emailLabel,
emailPlaceholder, messageLabel, messagePlaceholder, submitIdle,
submitSending, submitSent, submitError, orEmail, note  （全部 string）
```

- [ ] **Step 1: 建 ContactSection**

搬現有 `app/page.tsx` 嘅 `<section id="contact">` + `handleSubmit` + `handleFieldChange` + status 機制 + mailto fallback，改成食 `copy` prop + `useLang()` 攞 lang。

`components/ContactSection.tsx`：
```tsx
"use client";

import { useState } from "react";
import { useLang } from "@/components/LangProvider";

export type ContactCopy = {
  title: string;
  subtitle: string;
  reassure: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitIdle: string;
  submitSending: string;
  submitSent: string;
  submitError: string;
  orEmail: string;
  note: string;
};

type FormStatus = "idle" | "sending" | "sent" | "error";

// 聯絡 email；可由 NEXT_PUBLIC_CONTACT_EMAIL 覆寫,未設就用真實預設地址
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@shopops.co.uk";

export default function ContactSection({ copy }: { copy: ContactCopy }) {
  const { lang } = useLang();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("[contact] 表單提交失敗：", err);
      setStatus("error");
    }
  }

  // 送出失敗 / 成功後再改任何欄位,清走舊狀態 banner
  function handleFieldChange(setter: (v: string) => void, value: string) {
    setter(value);
    if (status === "error" || status === "sent") setStatus("idle");
  }

  const mailtoSubject = encodeURIComponent(
    lang === "en"
      ? "ShopOps Enquiry"
      : lang === "zh-Hans"
        ? "ShopOps 咨询"
        : "ShopOps 查詢"
  );

  return (
    <section id="contact" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{copy.title}</h2>
          <p className="mt-4 text-gray-600">{copy.subtitle}</p>
          <p className="mt-2 text-sm font-medium text-orange-600">{copy.reassure}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.nameLabel}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleFieldChange(setName, e.target.value)}
              placeholder={copy.namePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.emailLabel}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => handleFieldChange(setEmail, e.target.value)}
              placeholder={copy.emailPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{copy.messageLabel}</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => handleFieldChange(setMessage, e.target.value)}
              placeholder={copy.messagePlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition disabled:opacity-60"
          >
            {status === "sending" ? copy.submitSending : copy.submitIdle}
          </button>

          {status === "sent" && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
              {copy.submitSent}
            </p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
              {copy.submitError}
            </p>
          )}

          <p className="text-xs text-gray-500 text-center pt-2">
            {copy.orEmail}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${mailtoSubject}`}
              className="font-semibold text-gray-700 hover:text-gray-900 underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </form>

        <p className="mt-8 text-sm text-gray-500 text-center">{copy.note}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error。

- [ ] **Step 3: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/ContactSection.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 抽 ContactSection 共用聯絡表單(copy 由 prop)' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 5: PosLanding + /pos 路由（POS 內容搬遷，保留 Edinburgh SEO）

**Files:**
- Create: `components/PosLanding.tsx`（現有 `app/page.tsx` 內容搬入）
- Create: `app/pos/page.tsx`（server 殼 + POS metadata + SoftwareApplication JSON-LD）

**Interfaces:**
- Consumes: `useLang()`、`SiteHeader`、`ContactSection`（`ContactCopy`）、`SiteFooter`、`SavingsCalculator`、`Faq`、mockups
- Produces: `PosLanding`（default export，無 props）

- [ ] **Step 1: 建 PosLanding（搬現有首頁內容）**

`components/PosLanding.tsx`：把現有 `app/page.tsx` **整份** dict + sections 搬入，做以下修改：
1. 頂部 `"use client";` 保留。
2. import 改：
   ```tsx
   import { MenuMockup, BoardMockup, OfflineMockup, AdminMockup } from "@/components/mockups";
   import SavingsCalculator from "@/components/SavingsCalculator";
   import Faq from "@/components/Faq";
   import SiteHeader, { type NavLink } from "@/components/SiteHeader";
   import SiteFooter from "@/components/SiteFooter";
   import ContactSection from "@/components/ContactSection";
   import { useLang } from "@/components/LangProvider";
   ```
   （移走 `useState`、`Image`、`import type { Lang }`、`FormStatus`、`CONTACT_EMAIL` —— 表單機制已搬去 ContactSection。）
3. `dict` 整個保留不變（pains / features / pricing / faq / contact / footer / hero），`HERO_VARIANT`、`MOCKUPS` 常數保留。
4. component 改名 `export default function PosLanding()`，內部：
   - `const { lang } = useLang();`（取代 `const [lang, setLang] = useState(...)` 同所有表單 state）
   - `const t = dict[lang];` `const heroTitle = ...` 保留
   - 刪走 `handleSubmit` / `handleFieldChange`（已喺 ContactSection）
5. JSX 改：
   - `<header>...</header>` 整段換成：
     ```tsx
     <SiteHeader
       navLinks={[
         { href: "#features", label: t.nav.features },
         { href: "#savings", label: t.nav.savings },
         { href: "#pricing", label: t.nav.pricing },
         { href: "#contact", label: t.nav.contact },
         { href: "/blog", label: t.nav.blog },
         { href: "/", label: t.nav.company },
       ] satisfies NavLink[]}
       cta={{ href: "#contact", label: t.nav.cta }}
     />
     ```
   - Hero / Pain points / Features / `<SavingsCalculator lang={lang} />` / Pricing / `<Faq title={t.faq.title} items={t.faq.items} schemaItems={dict.en.faq.items} />` 全部**原封保留**。
   - `<section id="contact">...</section>` 整段換成 `<ContactSection copy={t.contact} />`。
   - `<footer>...</footer>` 換成 `<SiteFooter text={t.footer} />`。
6. **加 nav「公司首頁」label**：喺三語 dict 嘅 `nav` 各加一個 key `company`：繁「公司首頁」、简「公司首页」、EN「Company」。

- [ ] **Step 2: 建 /pos server 殼（搬 POS metadata + JSON-LD）**

`app/pos/page.tsx`（metadata / description / JSON-LD 由現有 `app/layout.tsx` 搬過嚟，**逐字保留** Edinburgh 文案，canonical / url 改 `/pos`）：
```tsx
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import PosLanding from "@/components/PosLanding";

const TITLE = "ShopOps — Restaurant POS & QR Ordering for Edinburgh｜餐廳點餐管理系統";
const DESCRIPTION =
  "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down. 為 Edinburgh 小型餐廳而設嘅一站式點餐系統：客人 scan QR 自助落單、員工 POS、即時廚房看板，仲有離線後備，斷網都照做生意。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pos" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/pos`,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Restaurant POS, QR ordering & kitchen board for Edinburgh",
    description:
      "All-in-one ordering system for small Edinburgh restaurants. QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down.",
  },
};

// JSON-LD:POS 產品 + 服務 Edinburgh,搬自原 root layout
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShopOps",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/pos`,
  description:
    "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board and offline backup.",
  areaServed: { "@type": "City", name: "Edinburgh" },
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function PosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PosLanding />
    </>
  );
}
```

- [ ] **Step 3: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error。

- [ ] **Step 4: Build + 行為核實（/pos 同舊首頁一致）**

Run:
```bash
cd /d/Claude/SHOPOPS/Landing && npm run build && (npm run start &) && sleep 6 && curl -s http://localhost:3000/pos | grep -o "外賣平台抽走你三成\|ShopOps" | head -3 && curl -s http://localhost:3000/pos | grep -c "SoftwareApplication"
```
Expected: build 綠；curl 印到 Hero 文案 + `SoftwareApplication` JSON-LD（count ≥ 1）。完成後 `kill` 個 `next start`（或 Playwright 開 `localhost:3000/pos` 肉眼睇晒 Hero→Pricing→FAQ→聯絡，同舊版一樣 + 語言 toggle work）。

> ⚠️ 注意此刻 `/`（舊首頁）同 `/pos` 內容重複（Task 7 先改 `/`）。呢個 task 只驗 `/pos` 出到嘢。

- [ ] **Step 5: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/PosLanding.tsx app/pos/page.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: POS 內容搬去 /pos(server 殼出 POS metadata+JSON-LD,保留 Edinburgh SEO)' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

## Phase 2 — 公司首頁

### Task 6: CompanyHome（公司首頁內容 + 三語 dict）

**Files:**
- Create: `components/CompanyHome.tsx`

**Interfaces:**
- Consumes: `useLang()`、`SiteHeader`（`NavLink`）、`ContactSection`（`ContactCopy`）、`SiteFooter`
- Produces: `CompanyHome`（default export，無 props）

- [ ] **Step 1: 建 CompanyHome（含完整三語 dict）**

`components/CompanyHome.tsx`：
```tsx
"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactSection, { type ContactCopy } from "@/components/ContactSection";

type Pillar = { icon: string; title: string; desc: string };
type Product = { icon: string; name: string; desc: string; href: string; cta: string };
type Reason = { icon: string; title: string; desc: string };

const dict = {
  "zh-Hant": {
    nav: { services: "服務", products: "產品", contact: "聯絡", blog: "網誌", cta: "免費諮詢" },
    hero: {
      title: "度身訂造軟件 × 業務自動化，幫你慳返重複工夫",
      subtitle:
        "SHOPOPS 係一隊軟件團隊。由餐廳 POS 到內部工具、數據自動化、AI 應用 —— 你話畀我哋知個痛點，我哋幫你整一套真係用得着、唔使俾佣金、唔使受制於人嘅系統。",
      ctaPrimary: "免費諮詢",
      ctaSecondary: "睇我哋嘅產品",
    },
    services: {
      title: "我哋做咩",
      items: [
        { icon: "🔄", title: "業務流程自動化", desc: "把重複手動工序自動化：報表、提醒、數據收集、定時任務、Telegram／email 通知，慳返人手、唔會漏。" },
        { icon: "🛠️", title: "度身訂造軟件 / 系統", desc: "按你需求開發 web app、內部工具、管理後台、dashboard。唔使硬塞現成軟件，啱你流程先做。" },
        { icon: "🤖", title: "AI / 數據分析", desc: "LLM 應用（摘要 / 分類 / 客服）、數據監控、市場 / 評價 / 信號掃描，幫你由數據攞到決策。" },
        { icon: "📦", title: "自家現成產品", desc: "已經做好、即裝即用嘅 SaaS，唔使從零開發。" },
      ] as Pillar[],
    },
    products: {
      title: "自家產品",
      subtitle: "已經喺真實生意度用緊嘅系統，即裝即用。",
      learnMore: "了解更多",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "餐廳點餐 / POS / 廚房看板 / 離線後備，零佣金、唔鎖數據。", href: "/pos", cta: "了解更多" },
        { icon: "⭐", name: "Reviewscope", desc: "餐廳評價監察 —— 各大平台評分一個版面睇晒，差評即時知。", href: "#contact", cta: "了解更多" },
        { icon: "🗓️", name: "Rota", desc: "員工排班 + 打卡出席，定位簽到、自動計時數。", href: "#contact", cta: "了解更多" },
      ] as Product[],
    },
    why: {
      title: "點解揀 SHOPOPS",
      items: [
        { icon: "🤝", title: "直接溝通、唔外判", desc: "同實際做嘢嗰個人傾，唔使隔幾層、唔使等外判。" },
        { icon: "🍜", title: "由實戰磨出嚟", desc: "產品喺真生意日日用住改出嚟，唔係 demo ware。" },
        { icon: "🔓", title: "你嘅嘢係你嘅", desc: "零佣金、唔鎖數據、唔綁約。" },
      ] as Reason[],
    },
    contact: {
      title: "想傾個項目，或者了解多啲？",
      subtitle: "留低資料同你想解決嘅問題，我哋會聯絡你。",
      reassure: "免費諮詢 · 唔使預先付費",
      nameLabel: "你嘅名 / 公司名",
      namePlaceholder: "例：陳生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "你想做咩 / 想解決咩問題？",
      messagePlaceholder: "例：想把每日入貨報表自動化 / 想整一個訂單管理系統...",
      submitIdle: "發送查詢",
      submitSending: "發送中...",
      submitSent: "已收到！我哋會盡快聯絡你",
      submitError: "發送失敗，請直接 email 或稍後再試",
      orEmail: "或直接 email：",
      note: "由自動化小工具到完整系統都做，歡迎傾下。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  "zh-Hans": {
    nav: { services: "服务", products: "产品", contact: "联系", blog: "博客", cta: "免费咨询" },
    hero: {
      title: "量身定制软件 × 业务自动化，帮你省下重复工序",
      subtitle:
        "SHOPOPS 是一支软件团队。从餐厅 POS 到内部工具、数据自动化、AI 应用 —— 你告诉我们痛点，我们帮你做一套真正好用、不用付佣金、不受制于人的系统。",
      ctaPrimary: "免费咨询",
      ctaSecondary: "看看我们的产品",
    },
    services: {
      title: "我们做什么",
      items: [
        { icon: "🔄", title: "业务流程自动化", desc: "把重复手动工序自动化：报表、提醒、数据收集、定时任务、Telegram／email 通知，省人手、不漏单。" },
        { icon: "🛠️", title: "量身定制软件 / 系统", desc: "按你需求开发 web app、内部工具、管理后台、dashboard。不用硬塞现成软件，贴合你流程才做。" },
        { icon: "🤖", title: "AI / 数据分析", desc: "LLM 应用（摘要 / 分类 / 客服）、数据监控、市场 / 评价 / 信号扫描，帮你从数据得出决策。" },
        { icon: "📦", title: "自家现成产品", desc: "已经做好、即装即用的 SaaS，不用从零开发。" },
      ] as Pillar[],
    },
    products: {
      title: "自家产品",
      subtitle: "已经在真实生意里使用的系统，即装即用。",
      learnMore: "了解更多",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "餐厅点餐 / POS / 厨房看板 / 离线备援，零佣金、不锁数据。", href: "/pos", cta: "了解更多" },
        { icon: "⭐", name: "Reviewscope", desc: "餐厅评价监察 —— 各大平台评分一个面板看齐，差评即时知道。", href: "#contact", cta: "了解更多" },
        { icon: "🗓️", name: "Rota", desc: "员工排班 + 打卡考勤，定位签到、自动算工时。", href: "#contact", cta: "了解更多" },
      ] as Product[],
    },
    why: {
      title: "为什么选 SHOPOPS",
      items: [
        { icon: "🤝", title: "直接沟通、不外包", desc: "跟实际做事的人聊，不用隔几层、不用等外包。" },
        { icon: "🍜", title: "实战打磨出来", desc: "产品在真实生意里天天用着改出来，不是 demo ware。" },
        { icon: "🔓", title: "你的东西是你的", desc: "零佣金、不锁数据、不绑约。" },
      ] as Reason[],
    },
    contact: {
      title: "想聊个项目，或了解更多？",
      subtitle: "留下资料和你想解决的问题，我们会联系你。",
      reassure: "免费咨询 · 不用预先付费",
      nameLabel: "你的名字 / 公司名",
      namePlaceholder: "例：陈先生 / ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "你想做什么 / 想解决什么问题？",
      messagePlaceholder: "例：想把每日进货报表自动化 / 想做一个订单管理系统...",
      submitIdle: "发送咨询",
      submitSending: "发送中...",
      submitSent: "已收到！我们会尽快联系你",
      submitError: "发送失败，请直接 email 或稍后再试",
      orEmail: "或直接 email：",
      note: "从自动化小工具到完整系统都做，欢迎聊聊。",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
  en: {
    nav: { services: "Services", products: "Products", contact: "Contact", blog: "Blog", cta: "Free consult" },
    hero: {
      title: "Custom software and automation that takes the busywork off your plate",
      subtitle:
        "SHOPOPS is a software team. From restaurant POS to internal tools, data automation and AI — tell us the problem and we'll build a system that actually works, charges no commission, and keeps you in control.",
      ctaPrimary: "Free consult",
      ctaSecondary: "See our products",
    },
    services: {
      title: "What we do",
      items: [
        { icon: "🔄", title: "Business process automation", desc: "Automate repetitive manual work — reports, reminders, data collection, scheduled jobs, Telegram/email alerts. Less manual effort, nothing slips through." },
        { icon: "🛠️", title: "Custom software & systems", desc: "We build web apps, internal tools, admin panels and dashboards around your needs — not a generic product you have to bend your workflow to fit." },
        { icon: "🤖", title: "AI & data analysis", desc: "LLM apps (summarise / classify / support), data monitoring, market / review / signal scanning — turning your data into decisions." },
        { icon: "📦", title: "Ready-made products", desc: "Built-and-ready SaaS you can use right away, no building from scratch." },
      ] as Pillar[],
    },
    products: {
      title: "Our products",
      subtitle: "Systems already running in real businesses, ready to use.",
      learnMore: "Learn more",
      items: [
        { icon: "🍽️", name: "ShopOps POS", desc: "Restaurant ordering / POS / kitchen board / offline backup. Zero commission, your data stays yours.", href: "/pos", cta: "Learn more" },
        { icon: "⭐", name: "Reviewscope", desc: "Restaurant review monitoring — every platform's ratings in one dashboard, bad reviews flagged instantly.", href: "#contact", cta: "Learn more" },
        { icon: "🗓️", name: "Rota", desc: "Staff scheduling and clock-in attendance — location check-in, automatic hours.", href: "#contact", cta: "Learn more" },
      ] as Product[],
    },
    why: {
      title: "Why SHOPOPS",
      items: [
        { icon: "🤝", title: "Talk to the maker, no outsourcing", desc: "You deal with the person actually building it — no layers, no offshore handoffs." },
        { icon: "🍜", title: "Forged in real use", desc: "Our products are used and refined daily in a real business — not demo ware." },
        { icon: "🔓", title: "What's yours stays yours", desc: "Zero commission, no data lock-in, no contracts." },
      ] as Reason[],
    },
    contact: {
      title: "Want to talk about a project, or just learn more?",
      subtitle: "Leave your details and the problem you want solved — we'll get in touch.",
      reassure: "Free consult · no upfront payment",
      nameLabel: "Your name / company",
      namePlaceholder: "e.g. ABC Ltd",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      messageLabel: "What do you want built or solved?",
      messagePlaceholder: "e.g. Automate our daily stock report / build an order-management system...",
      submitIdle: "Send enquiry",
      submitSending: "Sending...",
      submitSent: "Got it! We'll be in touch shortly.",
      submitError: "Send failed. Please email us directly or try again.",
      orEmail: "Or email directly:",
      note: "From small automation scripts to full systems — happy to chat.",
    } as ContactCopy,
    footer: "© 2026 ShopOps",
  },
} as const;

export default function CompanyHome() {
  const { lang } = useLang();
  const t = dict[lang];

  return (
    <main className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#services", label: t.nav.services },
          { href: "#products", label: t.nav.products },
          { href: "#contact", label: t.nav.contact },
          { href: "/blog", label: t.nav.blog },
        ] satisfies NavLink[]}
        cta={{ href: "#contact", label: t.nav.cta }}
      />

      {/* Hero — 黑底 + logo + 橙 CTA */}
      <section id="top" className="bg-black px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/logo.png"
            alt="ShopOps"
            width={288}
            height={162}
            priority
            className="mx-auto mb-6 sm:mb-8 w-56 sm:w-72 h-auto"
          />
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact" className="px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition">
              {t.hero.ctaPrimary}
            </a>
            <a href="#products" className="px-6 py-4 border border-gray-600 text-gray-200 rounded-xl font-semibold text-base hover:bg-gray-800 transition">
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* 服務四柱 */}
      <section id="services" className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.services.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.services.items.map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 自家產品 showcase */}
      <section id="products" className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.products.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t.products.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.products.items.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1">{p.desc}</p>
                <a href={p.href} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition">
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 點解揀 SHOPOPS */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.why.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {t.why.items.map((r) => (
              <div key={r.title} className="text-center px-4">
                <div className="text-4xl mb-4">{r.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection copy={t.contact} />
      <SiteFooter text={t.footer} />
    </main>
  );
}
```

- [ ] **Step 2: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error。

- [ ] **Step 3: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add components/CompanyHome.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 加 CompanyHome 公司首頁(三語:服務/產品/點解揀/聯絡)' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 7: app/page.tsx 改公司殼 + root layout 收尾

**Files:**
- Modify: `app/page.tsx`（整檔換成 server 殼）
- Modify: `app/layout.tsx`（default metadata 改中性、移走 body POS JSON-LD）

**Interfaces:**
- Consumes: `CompanyHome`（Task 6）、`SITE_URL`

- [ ] **Step 1: app/page.tsx 換成 server 殼**

把 `app/page.tsx` **整檔內容**（舊 POS 首頁，已搬去 PosLanding）換成：
```tsx
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import CompanyHome from "@/components/CompanyHome";

const TITLE = "ShopOps — 度身訂造軟件 × 業務自動化｜Custom Software & Automation";
const DESCRIPTION =
  "SHOPOPS 係一隊軟件團隊:業務流程自動化、度身訂造軟件 / 系統、AI 與數據分析,以及即裝即用嘅自家產品(餐廳 POS 等)。零佣金、唔鎖數據。 SHOPOPS is a software team building business automation, custom software, AI/data tools and ready-made products.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Custom Software & Business Automation",
    description:
      "A software team: business process automation, custom software & systems, AI/data analysis, and ready-made products.",
  },
};

// JSON-LD:公司導向 Organization(不綁地區)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShopOps",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Software team building business process automation, custom software and systems, AI/data analysis, and ready-made products.",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompanyHome />
    </>
  );
}
```

- [ ] **Step 2: root layout default metadata 改中性 + 移走 body JSON-LD**

`app/layout.tsx`：
1. `TITLE` / `DESCRIPTION` 兩個常數改成公司導向 default（被各 page 覆寫,呢個只係 fallback）：
   ```tsx
   const TITLE = "ShopOps — 度身訂造軟件 × 業務自動化";
   const DESCRIPTION =
     "SHOPOPS:業務流程自動化、度身訂造軟件 / 系統、AI 與數據分析,以及即裝即用嘅自家產品。";
   ```
2. `metadata` 物件入面 `openGraph` 嘅 `url` 維持 `SITE_URL`、其餘照舊（仍做 metadataBase 用途）。
3. **刪走** `const jsonLd = {...SoftwareApplication...}`（已搬去 `/pos`）同 body 入面嗰個 `<script type="application/ld+json">`。Organization JSON-LD 而家由 `/` 自己出，唔再喺 layout。
4. `<LangProvider>{children}</LangProvider>` 維持 Task 1 加咗嘅。

最終 body：
```tsx
<body className="min-h-full flex flex-col bg-white text-gray-900">
  <LangProvider>{children}</LangProvider>
  <Analytics />
  <SpeedInsights />
</body>
```

- [ ] **Step 3: 驗證型別**

Run: `cd /d/Claude/SHOPOPS/Landing && npx tsc --noEmit`
Expected: 無 error（注意 layout 刪 jsonLd 後唔好留 unused var）。

- [ ] **Step 4: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add app/page.tsx app/layout.tsx && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: 首頁 / 改公司簡介(Organization JSON-LD);layout 移走 POS JSON-LD' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

### Task 8: sitemap 加 /pos + 全站 build 驗收

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: sitemap 加 /pos**

`app/sitemap.ts`：喺 `/blog` entry 之前（或之後）加 `/pos`：
```ts
{
  url: `${SITE_URL}/pos`,
  changeFrequency: "monthly",
  priority: 0.9,
},
```
（放喺 homepage entry 同 `/blog` entry 之間。）

- [ ] **Step 2: 全站 build + curl 驗收**

Run:
```bash
cd /d/Claude/SHOPOPS/Landing && npm run build && (npm run start &) && sleep 6 && echo "--- / 公司首頁 ---" && curl -s http://localhost:3000/ | grep -o "業務流程自動化\|Organization\|度身訂造" | head -5 && echo "--- /pos ---" && curl -s http://localhost:3000/pos | grep -o "SoftwareApplication\|Edinburgh" | head -3 && echo "--- sitemap ---" && curl -s http://localhost:3000/sitemap.xml | grep -o "/pos"
```
Expected:
- `/`：印到「業務流程自動化」「度身訂造」+ `Organization`（公司 JSON-LD）。
- `/pos`：印到 `SoftwareApplication` + `Edinburgh`（POS SEO 保留）。
- sitemap：印到 `/pos`。
- 確認 `/` **唔再**出現 `SoftwareApplication`／Edinburgh，`/pos` **唔再**係 `Organization`。

- [ ] **Step 3: Playwright 真機行為核實**

開 `http://localhost:3000/`：
- 雙 CTA：「免費諮詢」→ scroll 落 `#contact`；「睇我哋嘅產品」→ scroll 落 `#products`。
- 產品卡 ShopOps POS「了解更多」→ 去 `/pos`；Reviewscope / Rota → scroll `#contact`。
- 語言 toggle 繁／简／EN：三 section 文案有跟住變。
- 由 `/` 撳去 `/pos`，再撳 logo 返 `/`：**語言唔 reset**（揀咗 EN 跳版仍係 EN）。
- 手機闊度（resize 375px）：nav、Hero、grid 唔爆版。
完成後 kill `next start` / 關 Playwright（headed 撞 window.print 時要殺 chrome，memory `reference_enterworktree_playwright_gotchas`）。

- [ ] **Step 4: Commit**

```bash
cd /d/Claude/SHOPOPS/Landing && git add app/sitemap.ts && python ~/.claude/hooks/review_marker.py write
```
```bash
cd /d/Claude/SHOPOPS/Landing && printf '%s\n' 'feat: sitemap 加 /pos entry' '' 'Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>' > m.txt && git commit -F m.txt && rm -f m.txt
```

---

## Self-Review（against spec）

**Spec coverage：**
- 路由 `/` 公司 + `/pos` POS → Task 5（/pos）、Task 7（/）、Task 8（sitemap）。✅
- POS 內容原封搬、文案/mockup/計算機零重寫 → Task 5 Step 1（dict + sections 原封，只換 chrome）。✅
- 共用 nav/聯絡表/footer/語言 → Task 1–4。✅
- 語言跳版唔 reset → Task 1（LangProvider + localStorage），Task 8 Step 3 驗。✅
- /pos 保留 Edinburgh SEO、/ 不綁地區 → Task 5（POS metadata+JSON-LD 逐字保留）、Task 7（公司 metadata + Organization）。✅
- 雙 CTA、nav=服務、CTA=免費諮詢、Reviewscope/Rota 導 #contact → Task 6 dict + JSX。✅
- 品牌深色+橙 → Task 6 Hero `bg-black` + `orange-500`。✅
- 服務四柱、產品三卡、點解揀三點 → Task 6。✅

**Placeholder scan：** 無 TBD／TODO；全部 code 完整；三語 dict 全寫齊。✅

**Type consistency：** `NavLink`（SiteHeader）、`ContactCopy`（ContactSection）兩個 type 喺 PosLanding（Task 5）+ CompanyHome（Task 6）一致引用；`useLang()` 回傳 `{ lang, setLang }` 全程一致；PosLanding 嘅 `t.contact` 同 CompanyHome 嘅 `contact` 都 `as ContactCopy` 對齊欄位。✅

**注意：** Task 5 要喺三語 nav dict 加 `company` key（繁/简/EN），否則 `t.nav.company` 編譯失敗 —— 已喺 Task 5 Step 1.6 標明。

**範圍外（無 task，刻意）：** Reviewscope/Rota 獨立頁、見證、進階動畫、opengraph-image.tsx 改動（現有動態 OG 圖維持，低優先）。
