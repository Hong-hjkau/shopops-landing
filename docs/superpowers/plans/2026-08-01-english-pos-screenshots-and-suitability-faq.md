# English POS Screenshots and Suitability FAQ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mixed-language POS journey images with four real English-only Demo screenshots and replace the Edinburgh-focused homepage FAQ with approved three-language suitability copy.

**Architecture:** Keep `PosWorkflow` and its four existing asset imports unchanged; overwrite the four WebP files with a new English-only journey so every website language displays the same product pixels while captions continue to come from `POS_CONTENT[lang]`. Keep the FAQ inside the existing `CompanyHome` dictionaries and add dependency-free static contracts to the current content test suite.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node test runner, ShopOps Demo POS in the in-app browser, macOS image conversion tools, WebP assets.

## Global Constraints

- Do not open, reuse, modify or expose any existing order, takeaway address, customer detail or production record.
- Every visible label, restaurant name, menu item, order item and status inside all four screenshots must be English.
- Screenshot captions remain supplied by `POS_CONTENT[lang].workflow.steps` and continue switching between English, Traditional Chinese and Simplified Chinese.
- Prefer an existing English-only Demo restaurant. If none exists, create a separate fictional `ShopOps English Demo` restaurant with only the English data required for this journey; do not rename, edit or delete existing restaurants or menus.
- Use one newly created dine-in order at a confirmed empty table for two guests, filter views to that order or dine-in state, and use only Demo payment controls.
- Keep `order-entry.webp`, `kitchen-order.webp`, `floor-progress.webp` and `checkout-report.webp` at the current tablet-style proportions. Record file sizes and preserve text readability; optimise an unusually large file only when doing so does not reduce readability.
- Do not change page layout, pricing, trial terms, hardware terms, other FAQs, `PosWorkflow` image order or product translation behavior.
- Do not push, merge or deploy.

---

### Task 1: Replace the Homepage Suitability FAQ

**Files:**

- Modify: `tests/pos-content.test.mjs`
- Modify: `components/CompanyHome.tsx`

**Interfaces:**

- Consumes: the existing `dict.en`, `dict["zh-Hant"]` and `dict["zh-Hans"]` homepage FAQ objects.
- Produces: one exact `questions.area` and `areaAnswer` pair per language; the existing `faqItems` assembly remains unchanged.

- [ ] **Step 1: Add the failing three-language FAQ contract**

Append this test to `tests/pos-content.test.mjs`:

```js
test("homepage FAQ explains suitable food businesses without Edinburgh", () => {
  const home = readFileSync(
    new URL("../components/CompanyHome.tsx", import.meta.url),
    "utf8",
  );

  const approved = [
    [
      'area: "What types of food businesses is ShopOps POS suitable for?"',
      'areaAnswer: "It is suitable for independent food businesses such as market stalls, cafés, small restaurants and takeaway shops. We can learn about your setup during the demo."',
    ],
    [
      'area: "ShopOps POS 適合甚麼類型的餐飲生意？"',
      'areaAnswer: "適合市集攤位、咖啡店、小餐館及外賣店等獨立餐飲生意。我們可以在示範時了解你的營運方式。"',
    ],
    [
      'area: "ShopOps POS 适合什么类型的餐饮生意？"',
      'areaAnswer: "适合市集摊位、咖啡店、小餐馆及外卖店等独立餐饮生意。我们可以在演示时了解你的营运方式。"',
    ],
  ];

  for (const pair of approved) {
    for (const copy of pair) assert.ok(home.includes(copy), copy);
  }
  assert.doesNotMatch(home, /Edinburgh 以外的餐廳可以使用嗎|Edinburgh 以外的餐厅可以使用吗|Can restaurants outside Edinburgh use it/i);
  assert.doesNotMatch(home, /ShopOps POS 為英國獨立餐廳而設。ShopOps 以 Edinburgh 為基地。|ShopOps POS 为英国独立餐厅而设。ShopOps 以 Edinburgh 为基地。|ShopOps POS is for independent UK restaurants. ShopOps is based in Edinburgh./i);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npm run test:content`

Expected: exactly this new test fails because the current `questions.area` and `areaAnswer` still describe Edinburgh availability.

- [ ] **Step 3: Replace only the six FAQ string literals**

In `components/CompanyHome.tsx`, set the English, Traditional Chinese and Simplified Chinese `questions.area` and `areaAnswer` values to the exact strings in Step 1. Keep the `faqItems` array and the other four FAQs unchanged.

- [ ] **Step 4: Run focused and static verification**

Stop the temporary preview on port 3115 and confirm the port is released without deleting `.next/lock` manually. Then run:

```bash
npm run verify
git diff --check
```

Expected: content tests, lint, TypeScript, contrast, production build and diff check all exit `0`.

- [ ] **Step 5: Run read-only review, race-check, and commit**

Review only `components/CompanyHome.tsx` and the new test. Immediately before staging, compare `git status`, `git log -3 --oneline` and `git rev-list --count HEAD` with the task baseline. Then run:

```bash
git add components/CompanyHome.tsx tests/pos-content.test.mjs
git commit -m "copy: explain which food businesses fit ShopOps"
```

---

### Task 2: Capture One English-Only Demo Journey

**Files:**

- Replace: `public/pos-demo/order-entry.webp`
- Replace: `public/pos-demo/kitchen-order.webp`
- Replace: `public/pos-demo/floor-progress.webp`
- Replace: `public/pos-demo/checkout-report.webp`
- Modify: `docs/pos-demo-screenshot-register.md`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**

- Consumes: the authenticated ShopOps Demo POS, the current four-stage workflow order, and the four existing asset filenames.
- Produces: four privacy-checked English-only WebP files in the exact order consumed by `WORKFLOW_IMAGES` and a static register contract for the English asset set.

- [ ] **Step 1: Add the failing screenshot-register contract**

Extend the existing workflow screenshot test in `tests/pos-content.test.mjs` with:

```js
const register = readFileSync(
  new URL("../docs/pos-demo-screenshot-register.md", import.meta.url),
  "utf8",
);
for (const file of [
  "order-entry.webp",
  "kitchen-order.webp",
  "floor-progress.webp",
  "checkout-report.webp",
]) {
  assert.match(register, new RegExp(`\\| \\`${file}\\` [^\\n]*\\| EN \\|`));
}
assert.match(register, /4 source stages = 4 English assets, zero gap/i);
```

- [ ] **Step 2: Run the content test and confirm RED**

Run: `npm run test:content`

Expected: the workflow screenshot test fails because the current register still records two Traditional Chinese assets and does not contain the four-to-four English reconciliation statement.

- [ ] **Step 3: Audit the available Demo restaurant options without opening orders**

Open the Demo POS home and staff-order restaurant selector. Record only the visible restaurant names. Select an existing English-only fictional Demo restaurant if it has an English fictional menu item and does not require opening an existing order. Record the chosen item and price for the remaining steps.

If no suitable restaurant exists, use the Demo administration UI to create a separate restaurant named `ShopOps English Demo`, an English `Main` category, and one `Demo Burger` item priced at `£5.00`. Stop and report a blocker instead of editing an existing restaurant if the Demo UI does not offer a bounded create flow.

- [ ] **Step 4: Create a new English dine-in session at a confirmed empty table**

Set the POS interface to English. In Staff order, identify a table with no active or unpaid order; use table 8 only if it is visibly empty, otherwise use another visibly empty table. Set party size 2, confirm the Demo allergy prompt using the fictional no-allergy test state, and add the chosen English item. For an existing English Demo restaurant, use its existing English fictional item and price; for the new `ShopOps English Demo` fallback, use `Demo Burger` at £5.00. Keep the staff list filtered to the chosen table. Do not open an existing unpaid order.

- [ ] **Step 5: Capture English order entry**

At a 1280×900 tablet viewport, capture the staff-order screen with the chosen empty table, chosen English item, quantity 1 and actual total visible. Exclude browser chrome and any unfiltered unpaid/delivery records. Save and convert the capture to `public/pos-demo/order-entry.webp` without changing its aspect ratio.

- [ ] **Step 6: Submit and capture the English kitchen state**

Place the new order. Open the kitchen board in English, filter to dine-in or the new table/order, and capture that pending order without existing delivery rows. Save it as `public/pos-demo/kitchen-order.webp`.

- [ ] **Step 7: Capture the English front-of-house progress state**

Move only the new order to preparing. Open the English floor/progress view, filter to the new dine-in order, and capture the chosen table in progress without takeaway rows. Save it as `public/pos-demo/floor-progress.webp`.

- [ ] **Step 8: Capture English checkout and close the Demo order**

Complete only the new order, return to the English staff checkout, and capture the checkout summary before payment with the English item, total and Demo payment choices visible. Save it as `public/pos-demo/checkout-report.webp`. Finish with Demo cash payment, then confirm the chosen table is closed.

- [ ] **Step 9: Reconcile and privacy-check all four assets**

Open every WebP at original resolution. For each file, verify:

```text
English UI = yes
English restaurant/menu/order/status = yes
Existing orders = absent
Name/email/phone/address = absent
Token/API key/payment credential = absent
Browser chrome/notification = absent
File size recorded; text remains readable
```

Update `docs/pos-demo-screenshot-register.md` with the new UK capture date, fictional restaurant, order code, actual table, chosen item and price, viewport, four `EN` language entries, file sizes and the result of each privacy check. Explicitly reconcile `4 source stages = 4 English assets, zero gap`.

- [ ] **Step 10: Run content and asset verification, read-only privacy review, race-check, and commit**

Run:

```bash
npm run test:content
file public/pos-demo/*.webp
sips -g pixelWidth -g pixelHeight public/pos-demo/*.webp
npm run verify
git diff --check
```

Expected: four valid WebP assets with readable tablet-style dimensions, all content tests, lint, TypeScript, contrast and production build passing, no whitespace errors and no unreviewed image. Run a separate read-only privacy review of all four files and the register. Race-check immediately before staging, then run:

```bash
git add public/pos-demo/order-entry.webp public/pos-demo/kitchen-order.webp public/pos-demo/floor-progress.webp public/pos-demo/checkout-report.webp docs/pos-demo-screenshot-register.md tests/pos-content.test.mjs
git commit -m "assets: unify the POS demo journey in English"
```

---

### Task 3: Verify Three-Language Presentation and Final Quality

**Files:**

- Modify only if a verified defect requires it: `components/PosWorkflow.tsx`
- Modify only if a verified defect requires it: `components/CompanyHome.tsx`

**Interfaces:**

- Consumes: the four English assets and static register contract from Task 2 plus the existing `POS_CONTENT[lang].workflow.steps` captions.
- Produces: browser evidence that captions translate without changing product pixels and a review-clean branch.

- [ ] **Step 1: Stop the temporary preview and run the full automated gate**

Stop the local preview process on port 3115 and confirm the port is released before building. Do not delete `.next/lock` manually.

Run: `npm run verify`

Expected: content tests, lint, TypeScript, contrast and the production build all exit `0`.

- [ ] **Step 2: Run the browser matrix**

Start the production build locally. At 1440×900 and 390×844, inspect `/` and `/pos` with `?lang=en`, `?lang=zh-Hant` and `?lang=zh-Hans`.

For every state confirm:

```text
Four product screenshots = same English-only pixels
Four captions = current website language
FAQ suitability question/answer = current website language
Old Edinburgh FAQ = absent
Horizontal overflow = absent
Images and captions = readable
```

- [ ] **Step 3: Run final prohibited-copy audit and independent review**

Run:

```bash
rg -n -i "Edinburgh 以外的餐廳可以使用嗎|Edinburgh 以外的餐厅可以使用吗|Can restaurants outside Edinburgh use it" app components lib
git diff --check
```

Expected: zero old-FAQ matches and a clean diff. Run an independent read-only review of all changes from the design-spec commit through HEAD. Fix findings one at a time and repeat the relevant checks until the reviewer reports no P0–P3 finding.

- [ ] **Step 4: Final race check and conditional commit**

Run:

```bash
git status --short
git log -3 --oneline
git rev-list --count HEAD
git diff --check
```

If browser or review verification exposes a real defect, edit only its owning file, rerun the relevant test and review, and commit with a message describing that defect. If no file changes in Task 3, do not create an empty commit. Do not push, merge or deploy. Present the final four screenshots, automated results, three-language browser evidence, review verdict and commit list to HONG.
