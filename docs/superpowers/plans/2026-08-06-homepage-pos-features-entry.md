# Homepage POS Features Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one prominent, language-preserving CTA on the public homepage so desktop and mobile visitors can reach the detailed POS features and pricing page.

**Architecture:** Extend the existing `CompanyHome` three-language copy object with one CTA label and render one ordinary anchor immediately after the core feature `CardGrid`. Reuse the site's existing orange CTA classes and the current `lang` state; do not change shared navigation, Hero, or feature-page code.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Node test runner.

## Global Constraints

- English label: `View all POS features and pricing` → `/pos/features?lang=en`.
- Traditional Chinese label: `查看全部 POS 功能及價格` → `/pos/features?lang=zh-Hant`.
- Simplified Chinese label: `查看全部 POS 功能及价格` → `/pos/features?lang=zh-Hans`.
- The CTA is visible on desktop and mobile immediately after the core feature cards.
- Preserve the current language through the query parameter.
- Do not modify the top navigation, Hero, demo CTA, feature-page content, pricing, tracking, or section order.
- Follow TDD: prove the homepage has no entry before changing production code.

---

### Task 1: Add the public homepage CTA

**Files:**
- Modify: `components/CompanyHome.tsx`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: existing `lang: Lang` state and the three-language `dict` inside `CompanyHome.tsx`.
- Produces: one rendered `<a>` with `href={`/pos/features?lang=${lang}`}` and the selected language's `featuresCta` label.

- [ ] **Step 1: Write the failing homepage entry test**

Add a test that reads `components/CompanyHome.tsx` and asserts all three exact labels exist, the anchor uses `/pos/features?lang=${lang}`, and its source position is after `<CardGrid items={t.features.items}` but before the closing core-features section.

```js
test("public homepage links core feature cards to the detailed POS pricing page", () => {
  const companyHome = readFileSync(new URL("../components/CompanyHome.tsx", import.meta.url), "utf8");

  assert.match(companyHome, /View all POS features and pricing/);
  assert.match(companyHome, /查看全部 POS 功能及價格/);
  assert.match(companyHome, /查看全部 POS 功能及价格/);
  assert.match(companyHome, /href={`\/pos\/features\?lang=\${lang}`}/);

  const cards = companyHome.indexOf("<CardGrid items={t.features.items}");
  const entry = companyHome.indexOf('href={`/pos/features?lang=${lang}`}');
  const nextSection = companyHome.indexOf('<section id="bilingual"');
  assert.ok(cards !== -1 && cards < entry && entry < nextSection);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test --test-name-pattern="public homepage links" tests/pos-content.test.mjs
```

Expected: FAIL because `CompanyHome.tsx` has no `/pos/features` anchor.

- [ ] **Step 3: Add the three-language label**

Add `featuresCta` to each `CompanyHome` language object using the exact Global Constraints values.

- [ ] **Step 4: Render the CTA after the core feature cards**

Immediately after the existing `CardGrid` in `#core-features`, render:

```tsx
<div className="mt-8 text-center">
  <a
    href={`/pos/features?lang=${lang}`}
    className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-base font-bold text-on-accent transition hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
  >
    {t.featuresCta}
  </a>
</div>
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
node --test --test-name-pattern="public homepage links" tests/pos-content.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Run full verification**

Run:

```bash
npm run verify
```

Expected: all content/rendered tests, ESLint, Next route type generation, TypeScript, WCAG contrast and production build pass.

- [ ] **Step 7: Browser verification**

Start the local app and inspect `/` in `en`, `zh-Hant`, and `zh-Hans` at desktop and mobile widths. Confirm the CTA is visible, has no horizontal overflow, and each click opens the matching `/pos/features?lang=...` page.

- [ ] **Step 8: Review and commit**

Review only the two task files, confirm `git diff --check` passes, then commit:

```bash
git add components/CompanyHome.tsx tests/pos-content.test.mjs
git commit -m "feat(landing): link homepage to POS feature pricing"
```

