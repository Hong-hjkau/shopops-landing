# POS Features Simple Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clear three-language `/pos/features` page with canonical add-on pricing, verified product boundaries, four existing screenshots, detailed `+£19` panels, and a fresh-worktree-safe verification command.

**Architecture:** Keep pricing names and prices canonical in `POS_CONTENT`, but replace positional add-on strings with stable `{ id, label }` objects. Store feature-page-only copy in one shared multilingual content module keyed by the same IDs. Render a server-owned route for metadata and requested language, plus focused presentational components; extend the shared header only through an optional language-href interface.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Node test runner, Next Image and Metadata APIs.

## Global Constraints

- All public copy must follow `docs/superpowers/specs/2026-08-06-pos-features-simple-page-design.md` verbatim in meaning.
- All add-ons require Core POS and are charged separately; badges use `+£9/month` or `+£19/month` semantics.
- Prices and add-on labels have one canonical source in `POS_CONTENT`; calculated examples must derive from those values.
- Delivery is cash-only and has no online payment.
- Dine-in/in-store card checkout uses the restaurant's own card terminal; ShopOps only records the payment.
- VAT data can be recorded/exported but is not submitted directly to HMRC.
- Public copy may say staff can enter collection orders, but must not claim the current POS is staff-only.
- Existing four `public/pos-demo/*.webp` images are the only screenshots used.
- No new dependency and no expected `package-lock.json` change.

---

### Task 1: Stable add-on IDs and canonical pricing model

**Files:**
- Modify: `lib/pos-content.ts`
- Modify: `components/PosPricingSection.tsx`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**
- Produces: `PosAddOnId`, `PosAddOnItem`, and `pricing.addOnGroups[*].items[*] = { id, label }`.
- Preserves: current order, 8 items at `9`, 2 items at `19`, all public labels and row prices.

- [ ] **Step 1: Write failing stable-ID tests**

Update the pricing test to assert the exact IDs and labels per language, for example:

```js
assert.deepEqual(
  POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.id),
  ["scheduling", "reservations", "reviews", "food_safety", "allergens", "recipe_costing", "custom_domain", "signage"],
);
assert.deepEqual(
  POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.id),
  ["delivery", "finance_inventory"],
);
assert.equal(POS_CONTENT["zh-Hant"].pricing.addOnGroups[1].items[1].label, "財務及庫存");
```

Also update component-source assertions from `{item}` to `{item.label}` and `key={item.id}`.

- [ ] **Step 2: Run the targeted test and confirm failure**

Run: `npm run test:content`

Expected: FAIL because add-on items are still strings and `id`／`label` do not exist.

- [ ] **Step 3: Implement the minimal stable model**

Add exported types:

```ts
export type PosAddOnId =
  | "scheduling" | "reservations" | "reviews" | "food_safety"
  | "allergens" | "recipe_costing" | "custom_domain" | "signage"
  | "delivery" | "finance_inventory";

export type PosAddOnItem = { id: PosAddOnId; label: string };
```

Replace each language's string tuples with objects while preserving order and approved labels. Rename Traditional Chinese `財務在庫` to `財務及庫存`, Simplified Chinese to `财务及库存`, and English delivery to `Online delivery orders`.

Update `PosPricingSection` to render `item.label`, key by `item.id`, and leave all row prices sourced from `group.monthlyPrice`.

- [ ] **Step 4: Run content tests**

Run: `npm run test:content`

Expected: all tests pass, including 8-ID and 2-ID exact mappings.

- [ ] **Step 5: Review checkpoint**

Inspect `git diff --check` and confirm pricing visuals still have one price per row and no `來電彈屏`／`call pop-up` copy.

---

### Task 2: Shared three-language feature-page content

**Files:**
- Create: `lib/pos-features-content.ts`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: `Lang`, `PosAddOnId`, and canonical pricing IDs.
- Produces: `POS_FEATURES_CONTENT: Record<Lang, PosFeaturesContent>` with hero, workflow captions, core cards, keyed add-on descriptions, boundaries, CTA and metadata copy; `getPosFeaturePricing(lang)` derives Core/add-on prices and bundle totals from `POS_CONTENT` stable IDs.

- [ ] **Step 1: Write failing content-contract tests**

Import `POS_FEATURES_CONTENT` and assert:

```js
const nineIds = POS_CONTENT.en.pricing.addOnGroups[0].items.map((item) => item.id);
const nineteenIds = POS_CONTENT.en.pricing.addOnGroups[1].items.map((item) => item.id);
for (const lang of languages) {
  assert.deepEqual(Object.keys(POS_FEATURES_CONTENT[lang].addOns).sort(), [...nineIds, ...nineteenIds].sort());
  assert.equal(POS_FEATURES_CONTENT[lang].workflow.length, 4);
  assert.match(POS_FEATURES_CONTENT[lang].delivery.cashOnly, /cash|現金|现金/i);
  assert.match(POS_FEATURES_CONTENT[lang].finance.hmrcBoundary, /HMRC/);
}
```

Add direct assertions that all three languages contain the required negative boundaries (“no online payment”, “does not submit directly to HMRC”, and equivalents). Separately forbid only affirmative unsupported claims such as “accept online payment”, “submits VAT Returns to HMRC”, staff-only collection, and automatic AI confirmation; do not blacklist the words inside required negative sentences.

Write a failing pricing-helper test before implementation:

```js
for (const lang of languages) {
  const prices = getPosFeaturePricing(lang);
  assert.equal(prices.corePlusDelivery, 38);
  assert.equal(prices.corePlusFinance, 38);
  assert.equal(prices.corePlusFinanceAndRecipe, 47);
}
```

Also assert the feature page component does not contain hard-coded public bundle strings such as `£38` or `£47`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:content`

Expected: FAIL because `lib/pos-features-content.ts` does not exist.

- [ ] **Step 3: Implement the content module**

Define focused types and all three languages. Public content must include:

- hero result sentence and price-strip labels;
- four workflow captions, including table QR ordering and optional staff approval;
- core cards for bilingual UI/translation fallback, offline backup, menu/options and manual sold-out;
- eight outcome-first `+£9` descriptions keyed by stable ID;
- detailed delivery and finance copy, cash/card/VAT/HMRC/AI/recipe boundaries;
- four one-line “Good to know” items;
- mid and final CTA copy plus existing trial reassurance labels;
- per-language title, description and share copy.

Use customer language instead of raw internal terms: “staff availability”, “straight-line estimate”, “draft for staff to check”, “VAT paid on purchases”, “Profit and loss”, “Excel export”, “own web address”, and “advertising content”.

Implement `getPosFeaturePricing(lang)` by finding `delivery`, `finance_inventory`, and `recipe_costing` by stable ID inside `POS_CONTENT[lang].pricing.addOnGroups`; return calculated totals and fail loudly if a required ID is absent. Components render examples from this helper only.

- [ ] **Step 4: Run content tests**

Run: `npm run test:content`

Expected: PASS with `8 in = 8 out` and `2 in = 2 out` for every language.

- [ ] **Step 5: Review checkpoint**

Manually compare the three stable ID sets and ensure no description is paired by array position.

---

### Task 3: Route, UI, language links and metadata

**Files:**
- Create: `app/pos/features/page.tsx`
- Create: `components/PosFeaturesLanding.tsx`
- Create: `components/PosFeatureStory.tsx`
- Create: `components/PosAddOnCard.tsx`
- Create: `components/PosPremiumFeature.tsx`
- Modify: `components/SiteHeader.tsx`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**
- `PosFeaturesLanding({ lang }: { lang: Lang })` renders `<main lang={lang}>` and reads both shared content sources.
- `SiteHeader` gains optional `languageHrefs?: Record<Lang, string>`; when present, language controls are links, otherwise existing button behavior remains unchanged.
- Page uses `searchParams: Promise<{ lang?: string | string[] }>` and `parseQueryLang`; invalid/missing query resolves to `en` for shareable URL behavior.

- [ ] **Step 1: Write failing route/UI source tests**

Add assertions that the new files exist and include:

```js
assert.match(page, /generateMetadata/);
assert.match(page, /parseQueryLang/);
assert.match(landing, /<main[^>]*lang=\{lang\}/);
assert.match(header, /languageHrefs/);
assert.match(landing, /POS_FEATURES_CONTENT\[lang\]/);
assert.match(landing, /item\.id/);
assert.match(landing, /group\.monthlyPrice/);
```

Assert all three language hrefs use `/pos/features?lang=` and all contact hrefs use `/pos?lang=<value>#contact`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:content`

Expected: FAIL because the route and components do not exist.

- [ ] **Step 3: Implement optional header language hrefs**

Extend `SiteHeader` without changing existing callers:

```ts
languageHrefs?: Record<Lang, string>;
```

Render `<Link href={languageHrefs[l.key]}>` with `aria-current={lang === l.key ? "page" : undefined}` when supplied; retain existing `setLang` buttons otherwise.

- [ ] **Step 4: Implement focused presentational components**

- `PosFeatureStory`: one screenshot, alt/caption, title and description.
- `PosAddOnCard`: stable ID, label, outcome, detail and `+price/month` badge.
- `PosPremiumFeature`: `+£19` badge, benefits, boundary callout and calculated bundle example.
- `PosFeaturesLanding`: header, hero price strip, 4 workflow stories, core cards, 8 add-on cards, mid CTA, 2 premium panels, Good-to-know block and final CTA.

Use `next/image`, existing screenshot imports and responsive `sizes`; do not make a generic component abstraction beyond these repeated sections.

- [ ] **Step 5: Implement the server route and metadata**

Use the Next 16 documented promise-based `searchParams`. Implement `generateMetadata` from localized content:

```ts
export async function generateMetadata({ searchParams }: PosFeaturesPageProps): Promise<Metadata> {
  const lang = parseQueryLang((await searchParams).lang) ?? "en";
  const copy = POS_FEATURES_CONTENT[lang].metadata;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: "/pos/features" },
    openGraph: { title: copy.title, description: copy.description, url: `${SITE_URL}/pos/features?lang=${lang}`, type: "website", siteName: "ShopOps" },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
  };
}
```

Wrap the client landing in a route-level provider with the complete remount contract:

```tsx
<LangProvider
  key={requestedLang}
  initialLang={requestedLang}
  persistInitialLang
  ownsDocumentLang
>
  <PosFeaturesLanding lang={requestedLang} />
</LangProvider>
```

Resolve missing/invalid query to `en` before this block. The `key` is required so client navigation between language hrefs remounts the provider instead of retaining stale visible copy.

- [ ] **Step 6: Run tests and build checks**

Run: `npm run test:content && npm run lint && npm exec next typegen && node_modules/.bin/tsc --noEmit`

Expected: all pass; generated route type includes `/pos/features`.

---

### Task 4: Homepage entry links, sitemap and canonical fee wording

**Files:**
- Modify: `components/PosLanding.tsx`
- Modify: `components/PosFeatureGrid.tsx`
- Modify: `components/PosPricingSection.tsx`
- Modify: `lib/pos-content.ts`
- Modify: `app/sitemap.ts`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**
- `PosFeatureGrid` accepts `detailsHref` and `detailsLabel`.
- `PosPricingSection` accepts the same link pair near add-on pricing.
- Links preserve current language: `/pos/features?lang=${lang}`.

- [ ] **Step 1: Write failing entry-link and wording tests**

Assert the homepage renders two descriptive feature links, sitemap contains `${SITE_URL}/pos/features`, and fee wording says ShopOps records card payments while the restaurant uses its own card terminal.

Update pricing label expectations to `Online delivery orders`, `財務及庫存`, and `财务及库存`.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm run test:content`

Expected: FAIL because links, sitemap entry and revised fee copy do not exist.

- [ ] **Step 3: Add localized link labels and route-preserving hrefs**

Add per-language `viewFeatures` copy to the existing `PosLanding` dictionary and pass `/pos/features?lang=${lang}` to both sections. Keep links visually secondary to the booking CTA.

- [ ] **Step 4: Correct card-fee wording**

Replace both canonical card-payment fields in all three languages: `pricing.feeNote` and `commission.disclaimer` (the FAQ consumes the latter). Add tests for both fields.

Approved boundary:

- EN: ShopOps can record card payments. Take payment on your own card terminal; your terminal provider's fees remain separate.
- zh-Hant: ShopOps 可記錄信用卡付款；實際收款使用餐廳自己的卡機，卡機供應商費用另計。
- zh-Hans: ShopOps 可记录银行卡付款；实际收款使用餐厅自己的刷卡机，刷卡机供应商费用另计。

Do not alter the delivery cash-only statement in feature-page content.

- [ ] **Step 5: Add sitemap entry and run tests**

Run: `npm run test:content`

Expected: PASS; two entry links and sitemap route are present.

---

### Task 5: Fresh-worktree verification command

**Files:**
- Modify: `package.json`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- `npm run verify` must invoke local `next typegen` immediately before local `tsc --noEmit`.

- [ ] **Step 1: Add a failing package-script test**

Read `package.json` and assert:

```js
assert.match(pkg.scripts.verify, /next typegen && tsc --noEmit/);
assert.doesNotMatch(pkg.scripts.verify, /npx tsc/);
```

- [ ] **Step 2: Run content tests and confirm failure**

Run: `npm run test:content`

Expected: FAIL because verify still contains `npx tsc --noEmit` without `next typegen`.

- [ ] **Step 3: Update the script minimally**

Set:

```json
"verify": "npm run test:content && npm run lint && next typegen && tsc --noEmit && npm run contrast && npm run build"
```

Do not edit dependencies or the lockfile.

- [ ] **Step 4: Run fresh full verification**

Create a disposable directory with `mktemp -d`, copy the current worktree while excluding `.git`, `.next`, `next-env.d.ts`, and `node_modules`, run `npm ci`, then run the single command `npm run verify` there. Resolve and print the exact temporary path before any cleanup; never target a broad directory or unresolved variable.

Expected: before the command, `.next` and `next-env.d.ts` are absent; content tests, lint, typegen, TypeScript, contrast and production build all pass; `/pos/features` appears in generated route output.

- [ ] **Step 5: Confirm generated files are not tracked**

Run in the main worktree: `git status --short` and `git diff -- package-lock.json`. In the disposable copy, confirm type generation created the required ignored artifacts. Move the validated disposable directory to Trash or remove only its exact `mktemp` path after confirming it is inside the system temporary directory.

Expected: no tracked generated diff and no lockfile change.

---

### Task 6: Browser verification, review loop and commit

**Files:**
- Review all files changed in Tasks 1–5.

**Interfaces:**
- Production-like page URLs: `/pos/features?lang=en`, `?lang=zh-Hant`, `?lang=zh-Hans`.

- [ ] **Step 1: Start the local site and inspect all three languages**

Verify desktop and mobile widths. Confirm price strip, 4 images, 8 `+£9` cards, 2 `+£19` panels, Good-to-know boundaries, middle/final CTA, and no horizontal overflow.

For each language, click the other two header language links and confirm URL, metadata and visible copy all change together. Verify `<main lang>` is `en`, `zh-Hant`, or `zh-Hans` as requested.

- [ ] **Step 2: Verify links and metadata**

Confirm language links preserve `/pos/features`, contact CTAs preserve `lang`, homepage has two feature links, metadata is localized, canonical is `/pos/features`, and sitemap includes the route.

Keyboard/accessibility checks: Tab through all language links and CTAs, confirm visible focus rings, activate each with Enter, inspect one H1 followed by logical H2/H3 levels, confirm all four screenshots have meaningful localized alt text, and verify the complete mobile layout in all three languages.

- [ ] **Step 3: Run full verification again**

Run: `npm run verify`

Expected: all checks pass with 0 test failures.

- [ ] **Step 4: Run independent read-only review**

1. Dispatch Codex rescue with an explicit **read-only, do not edit files** prompt focused on pricing truth, stable-ID mapping, three-language meaning, cash/card/VAT/HMRC boundaries, accessibility, SEO and unsupported claims.
2. After rescue returns, compare `git status` against the pre-review snapshot to prove the reviewer did not edit files.
3. Fix every valid finding and send the revised diff back to Codex rescue; loop until clean or document a specific false positive.
4. Run the project `/review` (or the repository's equivalent review command) on the final current diff.
5. Fix and re-run `/review` until no new finding remains. Only then proceed to race check and commit.

- [ ] **Step 5: Race check and commit**

Compare final `git status`, ahead count and recent log against the worktree baseline. Stage only task files and commit with a focused message such as:

```bash
git commit -m "feat: add POS features page"
```
