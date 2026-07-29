# POS-First Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the SHOPOPS homepage and `/pos` around the completed, trial-ready ShopOps POS while preserving the approved black glowing-logo Hero, truthful claims, three-language entry links, guided trial flow, UK-wide positioning, and secondary Rota/custom-software offerings.

**Architecture:** Keep the existing Next.js 16 App Router and inline typed dictionaries, but move facts shared by the homepage and POS page into one `lib/pos-content.ts` source and extract five focused presentational components. Parse `?lang=` in the `/pos` Server Page and wrap `PosLanding` in a route-level `LangProvider` so the requested language is correct on first render without turning the root layout dynamic or adding `useSearchParams`/Suspense. Use Node's built-in test runner, the existing Node type-stripping convention, the existing contrast/build gates, and browser visual checks; do not add Vitest, Playwright, or other dependencies.

**Tech Stack:** Next.js 16.2.6 App Router, React 19.2.4, TypeScript 5, Tailwind CSS 4, Node 22.18+ built-in test runner, Next Image, existing headless Chrome/browser tooling.

## Global Constraints

- Run implementation in a dedicated worktree created with `wt new pos-first-landing`; do not work directly on `main`.
- Before any git write, record `git status --short`, `git log -3 --oneline`, and `git rev-list --count HEAD`; repeat immediately before every commit and stop on unexplained changes.
- Preserve the production dual theme: black Hero/header plus white content sections.
- Preserve `/logo.png` and its glow; approved B Hero is desktop left Logo/right copy+CTA and mobile Logo above copy.
- POS has no live restaurant customers; remove every claim implying real-customer use, proven outcomes, or operational history.
- Trial terms are exact: 3-day trial, no card, no automatic charge; collect full restaurant/contact/payment details only when the customer continues; first 30 days after activation free; first charge on day 31.
- Language precedence is exact: valid `?lang=en|zh-Hant|zh-Hans` overrides and persists over storage; no query uses stored preference; no preference defaults to English; invalid query follows the no-query rule.
- POS serves the United Kingdom; Edinburgh appears only as the company base.
- Hardware facts are exact: existing iPad, Android tablet, computer, or phone; optional till hardware and receipt printers sold separately and preconfigured before delivery; connect to Wi-Fi to use.
- Do not classify purchasing-order, food-safety, AI invoice, analytics, waitlist, Rota, or other modules as included/add-on until the later feature inventory is approved.
- Preserve existing `ContactSection` 503/mailto fallback, rate limiting, Blog language exception, system CJK font decision, WCAG contrast gate, and `lib/brand.ts`/`lib/og.tsx` single-source rules.
- Do not add or delete historical data, customer data, or production records.
- Each implementation task ends with fresh verification, read-only Codex review, `/review`, race re-check, and a focused commit. Loop reviews to zero findings before committing.
- Do not push or deploy without HONG's explicit approval.

## Research Basis

- Next.js 16 exposes page `searchParams` as a Promise and recommends reading it in the Server Page before passing values to Client Components: <https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional>.
- `useSearchParams` in a prerendered Client Component requires Suspense and can fail the production build without it; this plan therefore avoids it: <https://nextjs.org/docs/app/api-reference/functions/use-search-params>.

## File Map

**Create**

- `lib/language.ts` — valid language list, query parsing, and deterministic precedence helper.
- `lib/pos-content.ts` — typed, shared three-language POS facts and claims used by both pages.
- `components/PosHero.tsx` — approved B Hero.
- `components/PosWorkflow.tsx` — four audited Demo-account screenshots and order journey.
- `components/PosBenefits.tsx` — four fast benefits plus bounded offline wording.
- `components/HardwareOptions.tsx` — existing-device and preconfigured-hardware choices.
- `components/TrialJourney.tsx` — exact trial, activation, and charging timeline.
- `tests/language.test.mjs` — Node built-in unit tests for query precedence.
- `tests/pos-content.test.mjs` — three-language key parity, commercial facts, and forbidden-claim tests.
- `public/pos-demo/order-entry.webp`
- `public/pos-demo/kitchen-order.webp`
- `public/pos-demo/floor-progress.webp`
- `public/pos-demo/checkout-report.webp`
- `docs/pos-demo-screenshot-register.md` — privacy and provenance register for the four web assets.

**Modify**

- `package.json` — add dependency-free `test:content` and `verify` scripts only.
- `components/LangProvider.tsx` — optional route-level initial language without disturbing root/blog behavior.
- `app/pos/page.tsx` — await `searchParams`, wrap `PosLanding`, and update UK metadata/JSON-LD.
- `app/page.tsx` — POS-first metadata and truthful structured data.
- `components/CompanyHome.tsx` — POS-first section order and secondary offerings.
- `components/PosLanding.tsx` — product-page order, factual claims, shared components, guided trial, and hardware copy.
- `components/SiteHeader.tsx` — POS/Features/Demo-first navigation labels supplied by each page.
- `components/PosFeatureGrid.tsx` — core capabilities before unclassified optional-module summary.
- `components/SavingsCalculator.tsx` — business-case placement and contract-dependent disclaimer.
- `components/PricingCard.tsx` — monthly plan plus unclassified optional-module wording.
- `app/opengraph-image.tsx` — POS-first homepage social preview via shared renderer.
- `app/pos/opengraph-image.tsx` — UK-wide POS social preview via shared renderer.
- `README.md` — UK-wide product positioning and exact verification commands.

---

### Task 1: Establish Dependency-Free Content and Language Tests

**Files:**

- Create: `lib/language.ts`
- Create: `tests/language.test.mjs`
- Modify: `package.json`

**Interfaces:**

- Produces: `LANGS`, `isLang(value)`, `parseQueryLang(value)`, and `resolveInitialLang(queryLang, storedLang)`.
- Produces: `npm run test:content` and `npm run verify`.
- Consumes: existing `Lang` type from `lib/i18n.ts`.

- [ ] **Step 1: Record the clean worktree baseline**

Run:

```bash
date '+%Y-%m-%d %H:%M:%S %Z'
git status --short
git log -3 --oneline
git rev-list --count HEAD
npm run lint
npx tsc --noEmit
npm run contrast
npm run build
```

Expected: clean worktree and all four existing verification commands exit `0`. If the worktree is not clean or another session changes the baseline, stop.

- [ ] **Step 2: Write the failing language tests**

Create `tests/language.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import {
  isLang,
  parseQueryLang,
  resolveInitialLang,
} from "../lib/language.ts";

test("accepts only the three supported language tags", () => {
  assert.equal(isLang("en"), true);
  assert.equal(isLang("zh-Hant"), true);
  assert.equal(isLang("zh-Hans"), true);
  assert.equal(isLang("fr"), false);
  assert.equal(isLang(undefined), false);
});

test("query parser rejects arrays and unknown values", () => {
  assert.equal(parseQueryLang("zh-Hant"), "zh-Hant");
  assert.equal(parseQueryLang(["en", "zh-Hant"]), undefined);
  assert.equal(parseQueryLang("unknown"), undefined);
  assert.equal(parseQueryLang(undefined), undefined);
});

test("valid query overrides storage and invalid query follows storage", () => {
  assert.equal(resolveInitialLang("en", "zh-Hant"), "en");
  assert.equal(resolveInitialLang("zh-Hans", "en"), "zh-Hans");
  assert.equal(resolveInitialLang(undefined, "zh-Hant"), "zh-Hant");
  assert.equal(resolveInitialLang(undefined, "unknown"), "en");
  assert.equal(resolveInitialLang(undefined, null), "en");
});
```

- [ ] **Step 3: Run the tests and verify RED**

Run:

```bash
node --test tests/language.test.mjs
```

Expected: FAIL because `lib/language.ts` does not exist.

- [ ] **Step 4: Implement the minimal pure helper**

Create `lib/language.ts`:

```ts
import type { Lang } from "./i18n.ts";

export const LANGS = ["zh-Hant", "zh-Hans", "en"] as const satisfies readonly Lang[];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export function parseQueryLang(
  value: string | string[] | undefined,
): Lang | undefined {
  return isLang(value) ? value : undefined;
}

export function resolveInitialLang(
  queryLang: unknown,
  storedLang: unknown,
): Lang {
  if (isLang(queryLang)) return queryLang;
  return isLang(storedLang) ? storedLang : "en";
}
```

- [ ] **Step 5: Run the language tests and verify GREEN**

Run:

```bash
node --test tests/language.test.mjs
```

Expected: 3 tests pass, 0 fail.

- [ ] **Step 6: Add scripts without adding dependencies**

Add to `package.json`:

```json
"test:content": "node --test tests/*.test.mjs",
"verify": "npm run test:content && npm run lint && npx tsc --noEmit && npm run contrast && npm run build"
```

Do not edit `package-lock.json`; no dependency changed.

- [ ] **Step 7: Review, race-check, and commit**

Run language tests and existing verification, obtain read-only Codex review and `/review`, then re-run:

```bash
git status --short
git log -3 --oneline
git rev-list --count HEAD
git add lib/language.ts tests/language.test.mjs package.json
git commit -m "test: add POS content verification baseline"
```

### Task 2: Make Facebook Language Links Correct on First Render

**Files:**

- Modify: `components/LangProvider.tsx`
- Modify: `app/pos/page.tsx`
- Test: `tests/language.test.mjs`

**Interfaces:**

- Consumes: `parseQueryLang()` from Task 1.
- Produces: `LangProvider({ children, initialLang?, persistInitialLang?, ownsDocumentLang? })`.
- Produces: `/pos?lang=en|zh-Hant|zh-Hans` server-rendered in the requested language.

- [ ] **Step 1: Reproduce the real route/provider bug as the RED gate**

Build and start the unmodified page:

```bash
npm run build
npm run start
```

In a real browser context:

1. Open `/pos`, select Traditional Chinese, and confirm `shopops-lang=zh-Hant`.
2. Navigate to `/pos?lang=en`.
3. Record the first heading, final hydrated heading, stored value, and `<html lang>`.

Expected RED evidence on the current implementation: the URL does not force English; stored Traditional Chinese is restored after mount. This production browser reproduction—not the pure helper test—is the required failing test for route/provider behavior.

- [ ] **Step 2: Add optional initial-language support without breaking protected hydration behavior**

Change the provider signature:

```tsx
type LangProviderProps = {
  children: React.ReactNode;
  initialLang?: Lang;
  persistInitialLang?: boolean;
  ownsDocumentLang?: boolean;
};

export function LangProvider({
  children,
  initialLang,
  persistInitialLang = false,
  ownsDocumentLang = true,
}: LangProviderProps) {
  const [lang, setLangState] = useState<Lang>(initialLang ?? "en");
```

Rules:

- When `initialLang` exists, do not replace it from storage during mount.
- When `initialLang` is absent, preserve the existing mount-only storage restoration exactly.
- When `persistInitialLang` is true, write the valid initial language to `shopops-lang` inside a guarded effect.
- Only the route-level provider owns `<html lang>` on `/pos`; the root provider must skip that path to avoid outer/inner effect races.
- Preserve the `/blog` forced-English exception.
- Keep both existing `SecurityError` guards.

- [ ] **Step 3: Parse Next.js 16 Promise searchParams in the Server Page**

Update `app/pos/page.tsx`:

```tsx
type PosPageProps = {
  searchParams: Promise<{ lang?: string | string[] }>;
};

export default async function PosPage({ searchParams }: PosPageProps) {
  const requestedLang = parseQueryLang((await searchParams).lang);

  return (
    <>
      {/* existing safe JSON-LD script */}
      <LangProvider
        initialLang={requestedLang}
        persistInitialLang={requestedLang !== undefined}
        ownsDocumentLang
      >
        <PosLanding />
      </LangProvider>
    </>
  );
}
```

The root provider remains in `app/layout.tsx`. Do not use `useSearchParams`, do not make the layout await request data, and do not add a Suspense workaround.

- [ ] **Step 4: Verify language behavior in a real production build**

Run:

```bash
npm run build
npm run start
```

In the browser, use a fresh context and then an existing stored preference to verify:

- `/pos?lang=en` is English and stores `en`.
- `/pos?lang=zh-Hant` is Traditional Chinese and stores `zh-Hant`.
- `/pos?lang=zh-Hans` is Simplified Chinese and stores `zh-Hans`.
- `/pos` uses stored preference.
- `/pos` with no storage is English.
- `/pos?lang=invalid` uses stored preference or English.
- Manual language switching still persists.
- `/blog` outer UI and `<html lang>` remain English.

Record screenshots or DOM evidence for each case in the review notes.

- [ ] **Step 5: Review, race-check, and commit**

After the read-only review loop is clear:

```bash
git add components/LangProvider.tsx app/pos/page.tsx tests/language.test.mjs
git commit -m "feat: honour POS language entry links"
```

### Task 3: Create the Shared Three-Language POS Facts

**Files:**

- Create: `lib/pos-content.ts`
- Modify: `components/CompanyHome.tsx`
- Modify: `components/PosLanding.tsx`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**

- Produces: `POS_CONTENT: Record<Lang, PosSharedContent>`.
- Consumes: `Lang` from `lib/i18n.ts`.
- Later components consume exact keys: `hero`, `benefits`, `hardware`, `trial`, `pricing`, `commission`, `workflow`.

- [ ] **Step 1: Write the failing shared-content tests**

Create `tests/pos-content.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { POS_CONTENT } from "../lib/pos-content.ts";

const languages = ["en", "zh-Hant", "zh-Hans"];
const forbidden = [
  /systems already running/i,
  /used and refined daily/i,
  /forged in real use/i,
  /not demo ware/i,
  /one price, everything included/i,
  /start free trial/i,
];

test("all languages expose identical shared keys", () => {
  const expected = Object.keys(POS_CONTENT.en).sort();
  for (const lang of languages) {
    assert.deepEqual(Object.keys(POS_CONTENT[lang]).sort(), expected);
  }
});

test("all languages preserve exact numeric offer facts", () => {
  for (const lang of languages) {
    assert.equal(POS_CONTENT[lang].trialDays, 3);
    assert.equal(POS_CONTENT[lang].freeActivationDays, 30);
    assert.equal(POS_CONTENT[lang].firstChargeDay, 31);
    assert.equal(POS_CONTENT[lang].trialNeedsCard, false);
    assert.equal(POS_CONTENT[lang].trialAutoCharges, false);
  }
});

test("shared copy contains no prohibited claim", () => {
  const text = JSON.stringify(POS_CONTENT);
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern);
});
```

Run:

```bash
node --test tests/pos-content.test.mjs
```

Expected: FAIL because `lib/pos-content.ts` does not exist.

- [ ] **Step 2: Define the shared type before copy**

Create a single typed contract:

```ts
type TrialStep = { title: string; detail: string };

export type PosSharedContent = {
  trialDays: 3;
  freeActivationDays: 30;
  firstChargeDay: 31;
  trialNeedsCard: false;
  trialAutoCharges: false;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    reassurance: string;
  };
  workflow: {
    title: string;
    steps: readonly [string, string, string, string];
  };
  benefits: readonly [string, string, string, string];
  hardware: {
    title: string;
    existingDeviceCopy: string;
    readyHardwareCopy: string;
  };
  trial: {
    title: string;
    steps: readonly TrialStep[];
  };
  pricing: { title: string; body: string };
  commission: { title: string; body: string; disclaimer: string };
};
```

- [ ] **Step 3: Fill all three languages from the approved spec**

Use the exact approved facts. The English Hero starts:

```ts
hero: {
  eyebrow: "Restaurant POS · English + 中文",
  title: "One POS for orders, kitchen and checkout.",
  subtitle:
    "A bilingual restaurant POS for independent UK restaurants — QR ordering, staff ordering, live kitchen screens and offline backup in one system.",
  cta: "Book a demo & free trial setup",
  reassurance:
    "3-day free trial · No card needed for the trial · We set up your menu for you",
},
```

All three `trial.steps` arrays must explicitly represent:

1. Book demo.
2. ShopOps understands the restaurant workflow.
3. ShopOps enters the menu and configures the system.
4. Three-day trial without card or automatic charge.
5. Customer chooses to continue and supplies full restaurant/contact/payment details.
6. First 30 activation days free; first monthly charge on day 31.

Do not include an itemized add-on list.

- [ ] **Step 4: Run the content tests and verify GREEN**

Run:

```bash
node --test tests/pos-content.test.mjs
```

Expected: all key-parity, numeric-fact, and forbidden-claim tests pass.

- [ ] **Step 5: Replace duplicated shared facts, not page-specific copy**

Import `POS_CONTENT` in both page components and remove only overlapping Hero/trial/hardware/pricing/commission facts. Keep page-specific nav, FAQ, secondary-offering, and section-heading copy local unless it is actually reused.

If two existing strings appear similar but differ in meaning, stop and ask before consolidating; do not silently merge them.

- [ ] **Step 6: Review, race-check, and commit**

Run `npm run test:content`, read-only review, `/review`, and:

```bash
git add lib/pos-content.ts components/CompanyHome.tsx components/PosLanding.tsx tests/pos-content.test.mjs
git commit -m "refactor: centralise approved POS facts"
```

### Task 4: Capture and Audit Four Real Demo-Account Screenshots

**Files:**

- Create: `public/pos-demo/order-entry.webp`
- Create: `public/pos-demo/kitchen-order.webp`
- Create: `public/pos-demo/floor-progress.webp`
- Create: `public/pos-demo/checkout-report.webp`
- Create: `docs/pos-demo-screenshot-register.md`

**Interfaces:**

- Produces: four stable WebP assets consumed by `PosWorkflow`.
- Produces: a privacy register with capture state, language, viewport, and approval status.

- [ ] **Step 1: Open the existing Demo account through the signed-in browser**

Use `browser:control-in-app-browser`. If the session is not authenticated, stop and ask HONG to sign in; never request or store credentials in the repo.

- [ ] **Step 2: Build one coherent fictional order journey**

Use a fictional restaurant, fictional staff/customer names, fake table/order numbers, and fake prices. Capture:

1. `order-entry.webp` — English QR or staff ordering screen.
2. `kitchen-order.webp` — the same order on the Chinese kitchen screen.
3. `floor-progress.webp` — fictional table/order progress.
4. `checkout-report.webp` — completed fake order or summary without real transaction identifiers.

- [ ] **Step 3: Perform the privacy gate before adding assets**

For each image inspect the original at full resolution. Reject and recapture if it contains:

- real restaurant/customer/staff identity;
- real email, phone, address, account ID, URL token, API key, or payment token;
- browser password-manager popup, notification, bookmarks, or unrelated tab;
- production order, sales, payment, or analytics data.

Do not use ImageGen for product screenshots. If cropping is needed, crop only browser chrome and irrelevant margins; do not fabricate UI.

- [ ] **Step 4: Convert approved captures to WebP and register them**

Use the existing image tooling available in the workspace. Preserve aspect ratio and readable UI text; target each web asset below 250 KB without making small text illegible.

`docs/pos-demo-screenshot-register.md` must list:

```markdown
| Asset | Source environment | Demo state | Language | Viewport | Masking result | Fictional data checked | Private data checked | Approved |
|---|---|---|---|---|---|---|---|---|
| order-entry.webp | Demo account / non-production | Staff/QR order entry | EN | tablet | None required | Yes | Yes | Yes |
```

- `Source environment` must distinguish the Demo account from production.
- `Masking result` must be `None required` after a clean recapture, or describe the exact cropped browser-chrome area. Never blur or cover product data and call the image verified.
- If a capture is rejected, record the reason in a short rejected-capture note before recapturing; only the clean final WebP is committed.

- [ ] **Step 5: Visually inspect all four final files**

Open all four WebPs at original resolution and verify readability, aspect ratio, and absence of sensitive data.

- [ ] **Step 6: Review, race-check, and commit**

Require a separate read-only privacy review before:

```bash
git add public/pos-demo docs/pos-demo-screenshot-register.md
git commit -m "assets: add audited POS demo journey"
```

### Task 5: Build the Shared POS Presentation Components

**Files:**

- Create: `components/PosHero.tsx`
- Create: `components/PosWorkflow.tsx`
- Create: `components/PosBenefits.tsx`
- Create: `components/HardwareOptions.tsx`
- Create: `components/TrialJourney.tsx`
- Modify: `app/globals.css` only if an existing token cannot express the approved B layout.

**Interfaces:**

- Each component consumes `{ copy: PosSharedContent[...] }`; `PosWorkflow` additionally consumes `lang: Lang`.
- Components contain presentation only and do not import page-specific dictionaries.
- `PosHero` owns only the `#top` anchor; its CTA links to the later `ContactSection` that owns `#contact`. `PosWorkflow` exposes `#workflow`; benefits/hardware/trial expose stable section IDs.

- [ ] **Step 1: Add a static render contract before implementation**

Extend `tests/pos-content.test.mjs` to read the not-yet-created `components/PosWorkflow.tsx` and assert:

- four static imports named `orderEntry`, `kitchenOrder`, `floorProgress`, and `checkoutReport`;
- imports point to the four approved `public/pos-demo/*.webp` files;
- one render mapping pairs each import with exactly one of the four workflow steps;
- the component owns `id="workflow"`.

Also assert the shared content still has a four-step workflow tuple, six trial steps, and four supported existing device types in every language.

Run:

```bash
npm run test:content
```

Expected RED: `components/PosWorkflow.tsx` does not exist yet. Do not weaken the test to pass before the component is created.

- [ ] **Step 2: Implement the approved B Hero**

`PosHero` requirements:

- black `bg-hero-bg`;
- existing `/logo.png` and `glow-accent`;
- desktop `sm:grid sm:grid-cols-2` with left Logo/right content;
- mobile single column with Logo first;
- no text over the Logo image;
- one primary CTA to `#contact`;
- no competing product screenshot inside the Hero.

- [ ] **Step 3: Implement the immediate real-product workflow**

`PosWorkflow` must be the first content section after `PosHero`. Use `next/image` static imports so dimensions are intrinsic. Pair each screenshot with one workflow step and concise alt text; do not use `components/mockups.tsx` in this section.

- [ ] **Step 4: Implement benefits, hardware, and trial components**

- `PosBenefits`: bilingual, direct-order commission, bounded offline backup, and device choice.
- `HardwareOptions`: existing iPad/Android tablet/computer/phone versus separately sold, preconfigured till/printer.
- `TrialJourney`: exact six-step commercial flow.

Do not create a generic section builder; five focused components are easier to understand and verify.

- [ ] **Step 5: Verify isolated rendering through the pages**

Temporarily render the components in one page at a time, run `npx tsc --noEmit` and `npm run build`, then remove any temporary wiring before commit.

- [ ] **Step 6: Review, race-check, and commit**

```bash
git add components/PosHero.tsx components/PosWorkflow.tsx components/PosBenefits.tsx components/HardwareOptions.tsx components/TrialJourney.tsx app/globals.css tests/pos-content.test.mjs
git commit -m "feat: add POS landing building blocks"
```

### Task 6: Rebuild the Homepage Around POS

**Files:**

- Modify: `components/CompanyHome.tsx`
- Modify: `components/SiteHeader.tsx` only if the existing prop interface cannot express the approved links.
- Modify: `app/page.tsx`
- Modify: `app/opengraph-image.tsx`

**Interfaces:**

- Consumes: all shared components and `POS_CONTENT`.
- Preserves: `ContactSection`, `SiteFooter`, language switcher, Rota link, custom-software offer.

- [ ] **Step 1: Write a failing homepage structure check**

Add a content test that reads `components/CompanyHome.tsx` and verifies the component order:

```js
const requiredOrder = [
  "<PosHero",
  "<PosWorkflow",
  "<PosBenefits",
  "id=\"core-features\"",
  "id=\"bilingual\"",
  "<HardwareOptions",
  "<TrialJourney",
  "id=\"secondary-offerings\"",
  "<ContactSection",
];
```

The test compares each token's index and fails if any token is absent or out of order. Run `npm run test:content`; expect RED.

- [ ] **Step 2: Change navigation and assemble the approved order**

Homepage nav:

- POS → `#top`
- Features → `#core-features`
- Demo → `#contact`
- Rota → `/rota`
- Custom Software → `#secondary-offerings`
- Blog → `/blog`

Assemble:

1. `PosHero`
2. `PosWorkflow`
3. `PosBenefits`
4. core POS capabilities
5. bilingual example
6. `HardwareOptions`
7. `TrialJourney`
8. second CTA
9. smaller Rota/custom-software cards
10. FAQ/contact/footer

Remove the current software-company-first service pillars and all false real-business claims.

- [ ] **Step 3: Update homepage metadata and social image**

Position the homepage around ShopOps POS without deleting the organization identity. Use the shared `renderOgImage()`; do not duplicate brand colors or renderer logic.

- [ ] **Step 4: Verify homepage behavior and visual hierarchy**

Run `npm run test:content`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Inspect:

- desktop 1440×900;
- mobile 390×844;
- black Hero/white content boundary;
- Logo/copy layout;
- screenshots immediately after Hero;
- first CTA visible without scrolling on common desktop/mobile heights;
- Rota/custom software still discoverable but visually secondary.

- [ ] **Step 5: Review, race-check, and commit**

```bash
git add components/CompanyHome.tsx components/SiteHeader.tsx app/page.tsx app/opengraph-image.tsx tests/pos-content.test.mjs
git commit -m "feat: make POS the homepage focus"
```

### Task 7: Reorder and Correct the POS Product Page

**Files:**

- Modify: `components/PosLanding.tsx`
- Modify: `components/PosFeatureGrid.tsx`
- Modify: `components/SavingsCalculator.tsx`
- Modify: `components/PricingCard.tsx`

**Interfaces:**

- Consumes: shared POS components and facts.
- Preserves: existing FAQ component/schema mechanism, contact fallback, calculator inputs, and language switching.

- [ ] **Step 1: Write a failing POS-page order and claim test**

Read `components/PosLanding.tsx` and assert this order:

```js
[
  "<PosHero",
  "<PosWorkflow",
  "id=\"order-journey\"",
  "id=\"restaurant-scenarios\"",
  "id=\"core-features\"",
  "id=\"bilingual\"",
  "<HardwareOptions",
  "id=\"optional-modules\"",
  "<SavingsCalculator",
  "<TrialJourney",
  "<PricingCard",
  "<Faq",
  "<ContactSection",
]
```

Also scan `components/` and `app/` for every prohibited claim from the design spec. Run and verify RED against the current site.

- [ ] **Step 2: Reassemble `/pos` in the approved order**

Use:

1. Hero
2. real workflow screenshots
3. complete order journey (`id="order-journey"`)
4. supported restaurant scenarios only (`id="restaurant-scenarios"`)
5. core POS features (`id="core-features"`)
6. bilingual section
7. hardware
8. unclassified optional-module summary
9. commission calculator as one business case
10. guided trial/activation timeline
11. monthly-plan wording
12. FAQ
13. final CTA/contact/footer

Do not list purchasing-order or other module classifications. Remove the `HERO_VARIANT` switch after B becomes the only approved Hero.

- [ ] **Step 3: Correct calculator and pricing claims**

Keep the user-controlled rate input and yearly estimate. Replace universal competitor assertions with contract-dependent wording. Preserve:

> No ShopOps commission applies to orders placed through your own ShopOps ordering channels. Card-processing fees remain separate.

Pricing says monthly POS plan plus optional modules and promises that the quote will state what is included before trial; it does not publish unapproved prices or categories.

- [ ] **Step 4: Correct FAQ answers**

FAQ must include:

- hardware not required; supported device types;
- separately sold preconfigured till/printer;
- exact guided trial/payment timeline;
- bounded offline behavior;
- UK availability and Edinburgh base;
- ShopOps direct-order commission versus card/provider/platform fees.

Remove absolute reliability and unsupported competitor claims from visible FAQ and `schemaItems`.

- [ ] **Step 5: Verify and commit**

Run content tests, lint, TypeScript, contrast, build, desktop/mobile browser checks, read-only review, `/review`, race check, then:

```bash
git add components/PosLanding.tsx components/PosFeatureGrid.tsx components/SavingsCalculator.tsx components/PricingCard.tsx tests/pos-content.test.mjs
git commit -m "feat: clarify the POS product journey"
```

### Task 8: Make POS Metadata and Sharing UK-Wide

**Files:**

- Modify: `app/pos/page.tsx`
- Modify: `app/pos/opengraph-image.tsx`
- Modify: `README.md`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**

- Canonical remains `${SITE_URL}/pos` for every `?lang=` entry.
- JSON-LD `areaServed` is a `Country` named `United Kingdom`.
- Edinburgh remains only in base/location copy.

- [ ] **Step 1: Write a failing static metadata test**

Read both POS route files and assert:

- approved title contains `UK Restaurants`;
- description contains bilingual, QR ordering, staff POS, kitchen screen, and offline backup;
- `areaServed` contains `Country` and `United Kingdom`;
- canonical stays `/pos`;
- OG copy contains no Edinburgh-only positioning.

Run `npm run test:content`; expect RED.

- [ ] **Step 2: Update metadata, JSON-LD, and OG**

Use:

```ts
const TITLE = "ShopOps POS — Bilingual Restaurant POS for UK Restaurants";
```

Keep OG generation through `renderOgImage()`. Serialize JSON-LD with:

```ts
JSON.stringify(jsonLd).replace(/</g, "\\u003c")
```

Do not create language-specific canonicals for query parameters.

- [ ] **Step 3: Update README positioning**

Describe the product as UK-wide and the company as based in Edinburgh. Document:

```bash
npm run test:content
npm run verify
```

- [ ] **Step 4: Verify metadata from production build output**

Run `npm run build && npm run start`. Inspect source/head for `/pos` and all three query entries. Confirm one canonical, UK-wide OG/metadata/JSON-LD, and no Edinburgh-only service claim.

- [ ] **Step 5: Review, race-check, and commit**

```bash
git add app/pos/page.tsx app/pos/opengraph-image.tsx README.md tests/pos-content.test.mjs
git commit -m "feat: position ShopOps POS across the UK"
```

### Task 9: Full Three-Language, Claims, Accessibility, and Visual Verification

**Files:**

- Modify only files required by verified findings.
- Update: `tests/pos-content.test.mjs` if a missing acceptance check is discovered.

**Interfaces:**

- Consumes all prior tasks.
- Produces a review-clean, build-clean branch ready for HONG's approval to merge/deploy.

- [ ] **Step 1: Run the complete automated gate**

```bash
npm run verify
```

Expected: content tests, lint, TypeScript, contrast, and production build all exit `0`.

- [ ] **Step 2: Run the exact prohibited-claim audit**

```bash
rg -n -i \
  "Systems already running|Used and refined daily|Forged in real use|Not demo ware|One price, everything included|You won.t find on a typical POS|Most POS systems|Deadlines never slip|takes over instantly|Start free trial" \
  app components lib
```

Expected: zero public-copy matches. Comments or tests that intentionally name forbidden phrases must live outside public components and be reviewed separately.

- [ ] **Step 3: Reconcile all three languages**

Enumerate the shared keys and page sections:

- input: 3 languages × shared keys/section arrays;
- output: identical key sets and array lengths;
- evidence: `tests/pos-content.test.mjs` pass plus a count table in the review note;
- claim: `N 入 = N 出，零 gap` only after the counts match.

- [ ] **Step 4: Browser behavior matrix**

Check both 1440×900 and 390×844:

| Route/state | Expected |
|---|---|
| `/` new visitor | English POS-first Hero |
| `/pos?lang=en` with stored Chinese | English and storage becomes `en` |
| `/pos?lang=zh-Hant` with stored English | Traditional Chinese and storage updates |
| `/pos?lang=zh-Hans` with stored English | Simplified Chinese and storage updates |
| `/pos` with stored Chinese | Stored Chinese |
| `/pos` without storage | English |
| `/pos?lang=invalid` | Stored language or English |
| `/blog` after Chinese POS | English outer shell and correct `<html lang>` |

For `/` and `/pos`, inspect:

- no horizontal overflow;
- keyboard focus visible;
- all images have useful alt text or intentionally empty decorative alt;
- Hero CTA visible and works;
- screenshots readable and immediately below Hero;
- hardware and trial terms readable;
- black Hero/white content boundary preserved.

- [ ] **Step 5: Review OG images**

Render/open both 1200×630 OG images. Verify UK-wide POS wording, safe crop, Logo clarity, and absence of Edinburgh-only/product-proof claims.

- [ ] **Step 6: Independent review loop**

Run Codex read-only review immediately after implementation and `/review`. Fix findings one at a time, re-run the relevant verification, and send back for review until:

- no new finding remains; or
- a reported item is demonstrably a false positive and documented for HONG.

- [ ] **Step 7: Final race check and branch completion**

Immediately before the final commit:

```bash
git status --short
git log -3 --oneline
git rev-list --count HEAD
git diff --check
```

Stop if there is any unexplained new file, commit, ahead count, or modification time.

If the final review finds no issue, do not create an empty final commit. If it finds an issue, return to the task that owns that file, apply its explicit file list and commit command, and repeat the full final gate.

Do not push, merge, or deploy yet. Present the final screenshots, verification results, review verdict, commit list, and optimization proposals to HONG for approval.
