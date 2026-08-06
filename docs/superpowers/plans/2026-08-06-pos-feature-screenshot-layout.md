# POS Feature Screenshot Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate 18 verified ShopOps screenshots into the three-language POS feature page, add accessible image enlargement, improve pricing and section hierarchy, and add top-nav and Hero entry points from the public homepage.

**Architecture:** Keep feature text in `POS_FEATURES_CONTENT`, keep image paths in one stable-ID static import map, and pass localized alt/action labels into existing card components. Use one small client-side native-dialog component for enlargement while the rest of the feature page remains server-rendered.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Next Image, native HTML dialog, Node test runner.

## Global Constraints

- Repo: `/Users/hong/Claude/SHOPOPS/Landing` in `wt new pos-feature-screenshot-layout` after the POS harness plan produces all 14 handoff assets.
- Approved spec: `docs/superpowers/specs/2026-08-06-pos-feature-screenshots-and-layout-design.md`.
- Handoff input: `/Users/hong/Documents/Codex/2026-08-05/po/pos-demo-assets-2026-08-06/` with 14 verified WebP files.
- Reuse the existing four workflow screenshots; do not duplicate them.
- Exact reconciliation: 18 spec items = 18 stable IDs = 18 unique WebP files = 18 map entries = 18 rendered triggers per language.
- All content remains three-language; images show the English demo interface with localized alt and action labels.
- Desktop/tablet cards use two columns; mobile uses one column; no horizontal overflow.
- Core price appears above the two add-on prices.
- Section order: Hero → workflow → Core → Advanced operations → standard add-ons → mid CTA → Good to know → final CTA.
- Do not alter product prices, payment/VAT/HMRC/allergen/AI boundaries or POS functionality.

---

### Task 1: Add and validate the 18-asset contract

**Files:**
- Create: `lib/pos-feature-images.ts`
- Create: `tests/pos-demo-assets.test.mjs`
- Create: `docs/pos-demo-screenshot-register.md`
- Create: `public/pos-demo/core/bilingual.webp`
- Create: `public/pos-demo/core/offline_backup.webp`
- Create: `public/pos-demo/core/menu_management.webp`
- Create: `public/pos-demo/core/sold_out.webp`
- Create: `public/pos-demo/add-ons/delivery.webp`
- Create: `public/pos-demo/add-ons/finance_inventory.webp`
- Create: `public/pos-demo/add-ons/scheduling.webp`
- Create: `public/pos-demo/add-ons/reservations.webp`
- Create: `public/pos-demo/add-ons/reviews.webp`
- Create: `public/pos-demo/add-ons/food_safety.webp`
- Create: `public/pos-demo/add-ons/allergens.webp`
- Create: `public/pos-demo/add-ons/recipe_costing.webp`
- Create: `public/pos-demo/add-ons/custom_domain.webp`
- Create: `public/pos-demo/add-ons/signage.webp`

**Interfaces:**
- `PosFeatureImageId` is the exact union of four workflow IDs, four Core IDs and ten canonical add-on IDs.
- `POS_FEATURE_IMAGES: Record<PosFeatureImageId, StaticImageData>` is the only image-path source.

- [ ] Write RED tests for exact 18 IDs, unique paths, file existence, RIFF/WEBP signature and one-to-one manifest mapping.
- [ ] Copy only the 14 reviewed handoff assets into the exact paths; reuse the current four workflow files in the map.
- [ ] Implement static imports and the exact typed map; do not place paths inside localized content.
- [ ] Build the screenshot register from the POS harness evidence and record 18 items, dimensions, bytes, hash, English/PII approval.
- [ ] Run focused tests and production build; open all 18 assets at original size and confirm 18 in = 18 out.
- [ ] Review and commit `assets(landing): add verified POS feature screenshots`.

### Task 2: Add three-language image semantics and section title

**Files:**
- Modify: `lib/pos-features-content.ts`
- Modify: `tests/pos-content.test.mjs`

**Interfaces:**
- Every workflow/Core/add-on description gains `imageAlt` and `imageActionLabel`.
- Root content gains `imageDialogCloseLabel`.
- Advanced title values are exactly `Advanced operations`, `進階營運功能`, `进阶营运功能`.

- [ ] Write RED tests requiring 18 nonempty alt/action pairs in each language, exact advanced title, no image path in localized content and no duplicate add-on label source.
- [ ] Add concise localized descriptions of what each screenshot proves; state demo screens are English where relevant.
- [ ] Preserve all existing pricing and operational-boundary tests.
- [ ] Run focused and full content tests, review and commit `content(landing): localize POS screenshot descriptions`.

### Task 3: Build the accessible shared image dialog

**Files:**
- Create: `components/PosImageDialog.tsx`
- Modify: `components/PosFeatureStory.tsx`
- Modify: `components/PosAddOnCard.tsx`
- Modify: `components/PosPremiumFeature.tsx`
- Modify: `tests/pos-features-rendered.test.mjs`

**Interfaces:**
- `PosImageDialog({ id, image, alt, actionLabel, closeLabel, sizes })` renders a thumbnail button and a native modal dialog.
- Each trigger exposes unique `data-pos-image-id`.

- [ ] Write RED rendered tests for the four existing workflow image triggers, button semantics, dialog label, close button and no priority loading.
- [ ] Implement the only new `"use client"` boundary with native `dialog.showModal()`.
- [ ] Support click, Enter/Space, Escape, visible close, backdrop close and explicit focus return to the opening trigger.
- [ ] Use Next Image static dimensions, lazy loading, responsive `sizes`, `max-h-[85vh]` and mobile-safe width.
- [ ] Replace `PosFeatureStory`'s current direct image with the shared dialog so the four existing workflow screenshots provide an immediately testable integration; extend the other two card types to accept optional shared image props for Task 4. Keep prices and boundaries as HTML.
- [ ] Run rendered tests and browser keyboard checks on the four workflow images, review and commit `feat(landing): add accessible POS image dialog`.

### Task 4: Wire 18 images and restructure the feature page

**Files:**
- Modify: `components/PosFeaturesLanding.tsx`
- Modify: `tests/pos-content.test.mjs`
- Modify: `tests/pos-features-rendered.test.mjs`

- [ ] Write RED tests for all 18 stable image IDs, exact section order, Core-first price order, two-column/one-column card contract and mid CTA after all eight standard add-ons.
- [ ] Route all screenshots through `POS_FEATURE_IMAGES`; remove scattered direct imports.
- [ ] Render workflow 4, Core 4, Advanced 2 and standard add-on 8 images with their localized semantics.
- [ ] Change pricing layout to full-width Core first, then the two add-on cards; mobile stacks all three.
- [ ] Move Advanced operations above standard add-ons and move the mid CTA below all eight standard add-ons.
- [ ] Use two columns from tablet upward and one on mobile; do not reintroduce 3/4-column screenshot cards.
- [ ] Run focused tests, `npm run verify`, desktop/mobile three-language inspection and 18-trigger count.
- [ ] Review and commit `feat(landing): restructure POS feature screenshot layout`.

### Task 5: Add the homepage top-nav and Hero entry points

**Files:**
- Modify: `components/CompanyHome.tsx`
- Modify: `components/PosHero.tsx`
- Modify: `components/SiteHeader.tsx`
- Modify: `tests/pos-content.test.mjs`

**Exact labels:**
- Nav: `Features & pricing`, `功能及價格`, `功能及价格`.
- Hero: `View all POS features and pricing`, `查看全部 POS 功能及價格`, `查看全部 POS 功能及价格`.

- [ ] Write RED tests requiring three language-preserving homepage entry locations: top nav, Hero secondary CTA and existing core-section CTA.
- [ ] Preserve the existing `#core-features` nav anchor and add a separate feature-pricing nav entry.
- [ ] Add Hero secondary outline CTA beside the existing orange demo CTA; desktop aligns side by side and mobile stacks full width.
- [ ] Keep the demo CTA primary and unchanged; tighten header spacing only if required to prevent overflow.
- [ ] Run focused tests and browser checks at 1440, 1024 and 390 widths in all languages.
- [ ] Review and commit `feat(landing): add POS feature pricing entry points`.

### Task 6: Full visual, accessibility and release verification

**Files:**
- Modify only if verification exposes a scoped defect.

- [ ] Run `npm run verify`, `git diff --check` and asset contract tests.
- [ ] Prove 18 spec items = 18 IDs = 18 unique WebP = 18 map entries = 18 triggers per language, zero gap and duplicate.
- [ ] Inspect `/` and `/pos/features?lang=...` for all three languages at 1440×900, 1024×768 and 390×844.
- [ ] Verify homepage entries, pricing hierarchy, section order, two-column/mobile layout, image readability and zero horizontal overflow.
- [ ] Exercise click, Enter/Space, Escape, close button, backdrop, focus containment and focus return for each card type.
- [ ] Inspect original-size assets again for PII, commercial data, English UI and unauthorised media.
- [ ] Run independent task reviews and whole-branch final review to CLEAN, then merge worktree locally.
- [ ] Ask HONG before push; after Vercel succeeds, repeat the production smoke test before claiming completion.
