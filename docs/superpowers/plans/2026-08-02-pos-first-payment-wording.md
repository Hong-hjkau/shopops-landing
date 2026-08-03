# POS First Payment Wording Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 30-day activation offer with wording that states activation-day payment, two months of use for the first one-month payment, then monthly billing.

**Architecture:** Keep the commercial terms in `lib/pos-content.ts`, which is already the shared source for the homepage, `/pos`, visible FAQs and FAQ schema. Update the existing content contract and regression test without changing page components or layout.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node.js test runner

## Global Constraints

- Keep the existing 3-day free trial, no-card and no-automatic-charge terms unchanged.
- Traditional Chinese, Simplified Chinese and English must express the same payment timing and coverage period.
- Do not use “first month free” or any wording that implies the first payment happens in month two.
- Remove public-content claims that activation includes 30 free days or that the first charge occurs on day 31.
- Do not change layout, price, trial flow or unrelated product copy.

---

### Task 1: Update the shared payment terms with regression coverage

**Files:**
- Modify: `tests/pos-content.test.mjs`
- Modify: `lib/pos-content.ts`

**Interfaces:**
- Consumes: `POS_CONTENT`, the shared `Record<Lang, PosSharedContent>` used by `CompanyHome` and `PosLanding`.
- Produces: three-language trial-step copy with activation-day payment and two-month first-payment coverage.

- [ ] **Step 1: Write the failing content test**

Update the existing all-language offer test so it requires these facts:

```js
assert.match(source, /first monthly payment is charged on the day you activate/i);
assert.match(source, /single payment covers your first two months/i);
assert.match(source, /正式啟用當日收取首期月費/);
assert.match(source, /首期只收 1 個月費用，即可使用首 2 個月/);
assert.match(source, /正式启用当日收取首期月费/);
assert.match(source, /首期只收 1 个月费用，即可使用前 2 个月/);
assert.doesNotMatch(source, /first 30 days are free|day 31|首 30 天免費|第 31 天|首 30 天免费/i);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/pos-content.test.mjs`

Expected: FAIL because the shared content still states 30 free activation days and first charge on day 31.

- [ ] **Step 3: Make the smallest shared-content change**

Remove `freeActivationDays` and `firstChargeDay` from `PosSharedContent` and `OFFER_TERMS`. Replace the final trial step in all three languages with:

```ts
// English
{
  title: "One monthly payment covers your first two months",
  detail: "Your first monthly payment is charged on the day you activate; this single payment covers your first two months, after which billing continues monthly.",
}

// Traditional Chinese
{
  title: "首期只收 1 個月費用，可使用首 2 個月",
  detail: "正式啟用當日收取首期月費；首期只收 1 個月費用，即可使用首 2 個月，其後按月收費。",
}

// Simplified Chinese
{
  title: "首期只收 1 个月费用，可使用前 2 个月",
  detail: "正式启用当日收取首期月费；首期只收 1 个月费用，即可使用前 2 个月，之后按月收费。",
}
```

Keep the preceding “only provide full details when continuing” step unchanged so the rendered FAQ reads as the approved complete answer.

- [ ] **Step 4: Run focused and full verification**

Run:

```bash
node --test tests/pos-content.test.mjs
npx tsc --noEmit
npm run build
```

Expected: all commands pass with no content regression, type error or production-build error.

- [ ] **Step 5: Review and commit**

Review only the planned files and design/plan documents. Confirm no concurrent git changes appeared since the baseline, then commit:

```bash
git add lib/pos-content.ts tests/pos-content.test.mjs docs/superpowers/specs/2026-08-02-pos-first-payment-wording-design.md docs/superpowers/plans/2026-08-02-pos-first-payment-wording.md
git commit -m "fix: clarify POS first payment offer"
```
