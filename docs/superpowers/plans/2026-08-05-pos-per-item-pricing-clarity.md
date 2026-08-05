# POS Per-item Pricing Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every POS add-on’s individual monthly charge visually explicit in English, Traditional Chinese and Simplified Chinese.

**Architecture:** Extend the existing shared POS pricing content with one localized billing clarification, then render each existing add-on row as a name/price pair using its group’s typed monthly price. Keep the current two-card grouping and all commercial terms unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Node test runner

## Global Constraints

- Keep the existing two grouped add-on cards: eight £9 add-ons and two £19 add-ons.
- Every row shows its own `£9/month` or `£19/month` price.
- English copy: `Choose any add-on individually. Each item is charged separately.`
- Traditional Chinese copy: `各項獨立收費，可任選一項或多項。`
- Simplified Chinese copy: `各项独立收费，可任选一项或多项。`
- On narrow screens, the feature name may wrap but the price must not shrink or detach from its row.
- Core POS, Rota pricing, VAT copy, card-processing-fee copy, add-on names, prices and counts remain unchanged.
- Do not add call pop-up, selectors, calculators or checkout behaviour.
- Preserve semantic list structure and communicate separate pricing with text, not colour alone.

---

### Task 1: Bind every add-on name to its individual monthly price

**Files:**
- Modify: `lib/pos-content.ts`
- Modify: `components/PosPricingSection.tsx`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: `PosSharedContent["pricing"].addOnGroups`, where each group provides `monthlyPrice` and `items`.
- Produces: `PosSharedContent["pricing"].addOnsBillingNote: string`, localized in all three `POS_CONTENT` entries.
- Produces: each rendered add-on `<li>` contains its item name followed by `£{group.monthlyPrice}{copy.monthlyUnit}` in reading order.

- [ ] **Step 1: Write the failing content and wiring tests**

Add exact translation assertions inside the public pricing test:

```js
assert.equal(
  POS_CONTENT.en.pricing.addOnsBillingNote,
  "Choose any add-on individually. Each item is charged separately.",
);
assert.equal(
  POS_CONTENT["zh-Hant"].pricing.addOnsBillingNote,
  "各項獨立收費，可任選一項或多項。",
);
assert.equal(
  POS_CONTENT["zh-Hans"].pricing.addOnsBillingNote,
  "各项独立收费，可任选一项或多项。",
);
```

Extend the dedicated pricing-section source assertions:

```js
assert.match(section, /copy\.addOnsBillingNote/);
assert.match(section, /£\{group\.monthlyPrice\}/);
assert.match(section, /shrink-0/);
assert.match(section, /group\.items\.map/);
```

Keep the existing exact three-language item arrays, VAT prohibition and Rota-isolation assertions unchanged.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/pos-content.test.mjs
```

Expected: FAIL because `addOnsBillingNote` is missing and `PosPricingSection` does not yet render a per-row price.

- [ ] **Step 3: Add the typed three-language billing clarification**

Add the field beside the existing add-on copy in `PosSharedContent`:

```ts
addOnsTitle: string;
addOnsRequirement: string;
addOnsBillingNote: string;
```

Populate the exact English, Traditional Chinese and Simplified Chinese strings from Global Constraints in their respective pricing objects.

- [ ] **Step 4: Render a price in every add-on row**

Place `{copy.addOnsBillingNote}` below the existing Core POS requirement. Keep the cards grouped by `group.monthlyPrice`, then replace the add-on list-item body with this structure:

```tsx
<li key={item} className="flex items-start justify-between gap-4 text-text">
  <span className="flex min-w-0 items-start gap-3">
    <span aria-hidden className="text-success">✓</span>
    <span>{item}</span>
  </span>
  <span className="shrink-0 font-semibold text-text">
    £{group.monthlyPrice}
    <span className="font-medium text-text-secondary">{copy.monthlyUnit}</span>
  </span>
</li>
```

Keep the existing group header and two-column/stacked card layout. Do not create a new component or duplicate pricing data.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```bash
node --test tests/pos-content.test.mjs
```

Expected: all focused tests pass, including the exact translations, row-price wiring, Rota isolation, VAT wording and call-pop-up exclusion.

- [ ] **Step 6: Run the complete verification gate**

Run:

```bash
npm run verify
```

Expected: all content tests, ESLint, TypeScript, contrast checks and Next.js production build pass.

- [ ] **Step 7: Verify the rendered pricing section**

Run the production build locally and inspect `/pos` at desktop and mobile widths for `en`, `zh-Hant` and `zh-Hans`. Confirm:

- every one of the eight £9 items shows `£9/month` or the localized monthly unit;
- both £19 items show `£19/month` or the localized monthly unit;
- long names wrap only on the left while the price stays attached to the same row;
- VAT and card-fee notes remain below the CTA;
- `/rota` still shows its existing contact-based pricing.

- [ ] **Step 8: Review and commit**

Run the project review gate against the complete diff. After all findings are resolved and verification remains green:

```bash
git add lib/pos-content.ts components/PosPricingSection.tsx tests/pos-content.test.mjs
git commit -m "fix: clarify per-item POS add-on pricing"
```

