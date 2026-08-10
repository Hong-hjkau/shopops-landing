# Order-entry Food Photos and Pricing Labels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six incorrect or blank dish-image areas in the public order-entry screenshot and apply the approved three-language pricing-card names, order and Core-section supporting-copy treatment.

**Architecture:** Generate six original food photographs as temporary source assets, then use Sharp to resize and composite them into six fixed 200 × 200 screenshot rectangles with rounded masks. Keep website copy and layout changes separate from the binary asset replacement so each can be tested and reviewed independently.

**Tech Stack:** OpenAI Image Generation, Sharp, Next.js 16, React 19, TypeScript, Node test runner.

## Global Constraints

- Work only in `/Users/hong/Claude/SHOPOPS/Landing-wt-landing-menu-food-photos`.
- Do not modify the POS application, Demo A TEST data or production image storage.
- Do not use downloaded third-party food photographs.
- Preserve `public/pos-demo/order-entry.webp` at exactly `1280 × 900`.
- Preserve every screenshot pixel outside the six approved rounded image rectangles.
- Prices remain Core £19/month, selectable tools +£9/month each and advanced operations +£19/month each.
- Final pricing labels are `Choose-your-own operations tools` / `自選營運功能` / `自选营运功能` and `Advanced operations (Delivery or finance)` / `進階營運功能（送貨或財務）` / `进阶营运功能（配送或财务）`.
- Desktop order is advanced £19 on the left and choose-your-own £9 on the right; mobile follows the same reading order.
- `Included with Core POS` / `核心 POS 已包括` must render as ordinary supporting copy below the Core section title, not as a heading or eyebrow.
- Update every website use of `order-entry.webp`; both `PosWorkflow` and `POS_FEATURE_IMAGES` already import that same asset, so one binary replacement must update both.
- After verification and review, merge locally, push `main` and smoke-test production without asking again.

---

### Task 1: Generate and composite six matching dish photographs

**Files:**
- Temporary source directory: `/private/tmp/shopops-order-entry-food-2026-08-10/`
- Replace: `public/pos-demo/order-entry.webp`
- Modify: `docs/pos-demo-screenshot-register.md`
- Modify: `tests/pos-demo-assets.test.mjs`

**Interfaces:**
- Consumes six generated square raster images named `happy-meal`, `egg-fried-rice`, `seafood-spaghetti`, `fried-chicken-wings`, `beef-satay-skewers` and `caesar-salad`.
- Produces the existing `order-entry.webp` path with unchanged dimensions and changed pixels only inside these rectangles: `(142,129,200,200)`, `(354,129,200,200)`, `(566,129,200,200)`, `(778,129,200,200)`, `(142,424,200,201)` and `(354,424,200,201)`.

- [ ] Generate six separate photorealistic food photographs with consistent warm casual-restaurant lighting, neutral plates, tight square framing, and no people, logos, text, packaging or watermark.
- [ ] Inspect every generated source and reject any image that does not clearly match its dish name or contains branding/text.
- [ ] Write a failing asset test that compares the original baseline copy with the replacement and requires: exact `1280 × 900`, six nonblank/distinct rectangles, no unchanged NVIDIA rectangle, and byte-for-byte equality for all pixels outside the six rounded masks.
- [ ] Run `node --test tests/pos-demo-assets.test.mjs` and confirm RED against the current screenshot.
- [ ] Use Sharp `resize({ width, height, fit: "cover" })` and `composite([{ input, left, top }])` with a rounded-corner alpha mask for each rectangle. Sharp applies resize before composition and honours explicit `left`/`top`, matching the official composite contract.
- [ ] Encode the finished screenshot as WebP at a quality that keeps all UI text readable; do not alter its dimensions.
- [ ] Update the screenshot register's current bytes, SHA-256 and note that all six dish tiles now use original generated food photography.
- [ ] Run the focused asset test and confirm GREEN; open the finished image at original size and verify all six labels match their photographs.
- [ ] Run an independent read-only review and commit `assets(landing): replace demo menu tiles with food photos`.

### Task 2: Apply the approved pricing labels, card order and Core supporting copy

**Files:**
- Modify: `lib/pos-features-content.ts`
- Modify: `components/PosFeaturesLanding.tsx`
- Modify: `tests/pos-content.test.mjs`
- Modify: `tests/pos-features-rendered.test.mjs`

**Interfaces:**
- `hero.standardAddOnPriceLabel` keeps the £9 tier but receives the new choose-your-own label.
- `hero.premiumAddOnPriceLabel` keeps the £19 tier but receives the new advanced-operations label.
- `core.eyebrow` remains supporting copy data, rendered after `core.title` as a normal paragraph.

- [ ] Add failing three-language content tests for the six exact approved labels and rendered tests requiring `advanced-add-ons` before `standard-add-ons`.
- [ ] Add a failing rendered test requiring the Core title before the Core-inclusion supporting paragraph and rejecting uppercase eyebrow styling on that paragraph.
- [ ] Run `node --test tests/pos-content.test.mjs tests/pos-features-rendered.test.mjs` and confirm RED.
- [ ] Replace the three standard and three advanced price labels exactly as specified in Global Constraints.
- [ ] Render the advanced £19 card first and the choose-your-own £9 card second inside the existing two-column price grid; do not change price lookup logic.
- [ ] Render the Core `h2` first, then render the Core-inclusion copy as an ordinary `p` using secondary-body styling without uppercase, tracking or eyebrow emphasis.
- [ ] Run focused tests and confirm GREEN; inspect all three languages at desktop and mobile widths for label wrapping, left/right order and zero horizontal overflow.
- [ ] Run an independent read-only review and commit `content(landing): clarify POS add-on price tiers`.

### Task 3: Full verification, integration and production smoke test

**Files:**
- Modify only if verification exposes a scoped defect.

**Interfaces:**
- Consumes Tasks 1–2 commits.
- Produces a clean Landing `main` deployment with the new screenshot and pricing hierarchy.

- [ ] Run `npm run verify`, `node --test tests/pos-demo-assets.test.mjs` and `git diff --check`.
- [ ] Verify the homepage workflow and `/pos/features` both load the new `order-entry.webp` hash and show all six correct food photographs.
- [ ] Verify all three languages at `1440 × 900` and `390 × 844`: exact labels, advanced-left/first order, £9/£19 prices unchanged, Core supporting copy not styled as a heading, and zero overflow.
- [ ] Run a fresh whole-branch read-only review to `CLEAN`; fix any finding with a regression test and re-review.
- [ ] Confirm the worktree contains only intended changes, then merge it into local `main` with `wt done landing-menu-food-photos`.
- [ ] Re-run `npm run verify` on merged `main`, push `origin main`, wait for deployment, and smoke-test the live homepage and POS features page.
