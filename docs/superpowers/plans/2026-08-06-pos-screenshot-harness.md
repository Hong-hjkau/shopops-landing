# POS Screenshot Harness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated local-only fixture application that renders real ShopOps POS UI components with fixed fake data and produces 14 verified English WebP screenshots without reading or writing the shared Supabase database.

**Architecture:** Add a standalone Next.js app under `tools/screenshot-harness/` in the POS repo. It imports existing POS components, replaces browser Supabase and local APIs with fail-closed fixtures, binds only to `127.0.0.1:3419`, blocks every external request, and writes validated screenshots to a neutral handoff directory outside both git repos.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Playwright, Sharp, Node test runner.

## Global Constraints

- Repo: `/Users/hong/Claude/SHOPOPS/POS` in its own `wt new pos-screenshot-harness` worktree.
- Read and obey umbrella and POS `AGENTS.md`; do not stage or alter pre-existing untracked files.
- Never read POS `.env.local`, never connect to Supabase, and never import production server clients or production API routes.
- Harness binds only to `127.0.0.1:3419`; if the port is occupied, stop without killing the existing process.
- Unknown API routes, unknown Supabase tables, all Supabase writes, and every external network request fail the run.
- Do not trigger email, Telegram, payment, printer, courier notification, domain provisioning, HMRC, storage upload, or third-party AI.
- All screenshots use English UI, `1280 × 900`, `en-GB`, `Europe/London`, fixed time `2026-08-06 11:30 BST`, fake data only.
- Output handoff directory: `/Users/hong/Documents/Codex/2026-08-05/po/pos-demo-assets-2026-08-06/`.
- Exact outputs: four `core/*.webp` and ten `add-ons/*.webp`; 14 input scenes = 14 unique outputs, zero gap and zero duplicate.
- The harness must not create a production POS route and must be excluded from the POS root TypeScript build.

---

### Task 1: Extract the real offline notice into a pure UI component

**Files:**
- Create: `components/staff/OfflineQueuedNotice.tsx`
- Modify: `app/staff/page.tsx`
- Test: `tests/offline-queued-notice.test.mjs`

**Interfaces:**
- Produces `OfflineQueuedNotice({ summary, onAcknowledge })` where `summary` is the exact existing offline-order summary shape consumed by the inline JSX.
- Production `app/staff/page.tsx` continues to own queue, IndexedDB, retry and checkout behaviour; only the current notice markup moves.

- [ ] Write a source/SSR test proving the extracted component renders the existing queued-order text, summary fields and acknowledge action.
- [ ] Run the focused test and verify RED because the component does not exist.
- [ ] Move only the existing notice JSX into `OfflineQueuedNotice`; do not change state, submit, queue, reconnect or payment logic.
- [ ] Replace the inline block in `app/staff/page.tsx` with the new component and identical props.
- [ ] Run focused tests, POS lint, TypeScript and production build.
- [ ] Confirm production behaviour is unchanged in the browser, run read-only review and commit `refactor(pos): extract offline queued notice`.

### Task 2: Scaffold the fail-closed local harness

**Files:**
- Create: `tools/screenshot-harness/package.json`
- Create: `tools/screenshot-harness/package-lock.json`
- Create: `tools/screenshot-harness/.gitignore`
- Create: `tools/screenshot-harness/next-env.d.ts`
- Create: `tools/screenshot-harness/tsconfig.json`
- Create: `tools/screenshot-harness/next.config.mjs`
- Create: `tools/screenshot-harness/postcss.config.mjs`
- Create: `tools/screenshot-harness/app/globals.css`
- Create: `tools/screenshot-harness/app/layout.tsx`
- Create: `tools/screenshot-harness/app/[scene]/page.tsx`
- Create: `tools/screenshot-harness/app/api/[...path]/route.ts`
- Create: `tools/screenshot-harness/components/FixtureProviders.tsx`
- Create: `tools/screenshot-harness/components/FixtureShell.tsx`
- Create: `tools/screenshot-harness/components/SceneRenderer.tsx`
- Create: `tools/screenshot-harness/fixtures/api-router.ts`
- Create: `tools/screenshot-harness/fixtures/supabase-client.ts`
- Create: `tools/screenshot-harness/scenes/manifest.mjs`
- Create: `tools/screenshot-harness/tests/manifest.test.mjs`
- Create: `tools/screenshot-harness/tests/isolation.test.mjs`
- Modify: `tsconfig.json`

**Interfaces:**
- `SceneManifestEntry = { id, group, route, output, readySelector, allowedApiRoutes, prepareAction? }`.
- `FixtureProviders` fixes locale to English and exposes restaurant ID `fixture-restaurant` with all required canonical modules.
- API router returns fixture JSON only for explicit method/path pairs; unmatched requests return an error response.
- Supabase stub supports explicit read fixtures only; every write method and unknown table throws.

- [ ] Write RED tests for 14 exact manifest IDs, uniqueness, localhost-only configuration, no `.env*`, prohibited-import scan, fail-closed API and fail-closed Supabase writes.
- [ ] Verify RED before creating the harness implementation.
- [ ] Add the standalone package with private dependencies `playwright` and `sharp`; do not change POS root dependencies.
- [ ] Configure webpack alias `@/lib/supabase/client` to the fixture stub and reuse POS `@/*` imports.
- [ ] Exclude `tools/screenshot-harness/**` from POS root `tsconfig.json`.
- [ ] Implement local layout, provider and catch-all API; no production app/layout, PWA, auth or server Supabase imports.
- [ ] Run harness tests and build using the harness-local scripts.
- [ ] Run POS root lint, TypeScript and production build; inspect generated manifests and assert zero fixture/harness production route.
- [ ] Review and commit `test(pos): add isolated screenshot harness`.

### Task 3: Implement the four Core fixture scenes

**Files:**
- Create: `tools/screenshot-harness/fixtures/core.ts`
- Create: `tools/screenshot-harness/scenes/BilingualScene.tsx`
- Create: `tools/screenshot-harness/scenes/OfflineBackupScene.tsx`
- Create: `tools/screenshot-harness/scenes/MenuManagementScene.tsx`
- Create: `tools/screenshot-harness/scenes/SoldOutScene.tsx`
- Modify: `tools/screenshot-harness/components/SceneRenderer.tsx`
- Modify: `tools/screenshot-harness/scenes/manifest.mjs`
- Test: `tools/screenshot-harness/tests/manifest.test.mjs`

**Exact scene IDs and outputs:**
- `bilingual` → `core/bilingual.webp`
- `offline_backup` → `core/offline_backup.webp`
- `menu_management` → `core/menu_management.webp`
- `sold_out` → `core/sold_out.webp`

- [ ] Add RED tests requiring the four exact entries and ready selectors.
- [ ] Render real `OrderCard`, extracted `OfflineQueuedNotice`, menu/set-meal/option components and `PauseMenuModal` with fixed fake fixtures.
- [ ] Ensure no customer note, real order, real menu price or external translation request is present.
- [ ] Build and visually inspect all four scenes at `1280 × 900`.
- [ ] Run isolation and manifest tests, review and commit `feat(pos): add Core screenshot fixtures`.

### Task 4: Implement the two advanced-operation fixture scenes

**Files:**
- Create: `tools/screenshot-harness/fixtures/advanced.ts`
- Create: `tools/screenshot-harness/scenes/DeliveryScene.tsx`
- Create: `tools/screenshot-harness/scenes/FinanceInventoryScene.tsx`
- Modify: `tools/screenshot-harness/components/SceneRenderer.tsx`
- Modify: `tools/screenshot-harness/scenes/manifest.mjs`
- Modify: `tools/screenshot-harness/fixtures/api-router.ts`
- Test: `tools/screenshot-harness/tests/manifest.test.mjs`

**Exact scene IDs and outputs:**
- `delivery` → `add-ons/delivery.webp`
- `finance_inventory` → `add-ons/finance_inventory.webp`

- [ ] Add RED tests for both entries, exact fake API routes and prohibited PII patterns.
- [ ] Compose real delivery settings, postcode and courier components with fake postcode zones, slots, fees, collection code and driver workflow.
- [ ] Compose real expense/invoice and stocktake UI with fake supplier, invoice, VAT and ingredient fixtures; the invoice remains a draft.
- [ ] Assert no valid phone, email, address, VAT number, live postcode, supplier or external endpoint appears.
- [ ] Build and visually inspect both scenes; run isolation tests, review and commit `feat(pos): add advanced-operation screenshot fixtures`.

### Task 5: Implement the eight standard add-on fixture scenes

**Files:**
- Create: `tools/screenshot-harness/fixtures/addons.ts`
- Create: `tools/screenshot-harness/scenes/SchedulingScene.tsx`
- Create: `tools/screenshot-harness/scenes/ReservationsScene.tsx`
- Create: `tools/screenshot-harness/scenes/ReviewsScene.tsx`
- Create: `tools/screenshot-harness/scenes/FoodSafetyScene.tsx`
- Create: `tools/screenshot-harness/scenes/AllergensScene.tsx`
- Create: `tools/screenshot-harness/scenes/RecipeCostingScene.tsx`
- Create: `tools/screenshot-harness/scenes/CustomDomainScene.tsx`
- Create: `tools/screenshot-harness/scenes/SignageScene.tsx`
- Create: `tools/screenshot-harness/public/fixture-assets/allergen-label.png`
- Create: `tools/screenshot-harness/public/fixture-assets/signage-special.svg`
- Modify: `tools/screenshot-harness/components/SceneRenderer.tsx`
- Modify: `tools/screenshot-harness/scenes/manifest.mjs`
- Modify: `tools/screenshot-harness/fixtures/api-router.ts`
- Test: `tools/screenshot-harness/tests/manifest.test.mjs`

**Exact scene IDs:** `scheduling`, `reservations`, `reviews`, `food_safety`, `allergens`, `recipe_costing`, `custom_domain`, `signage`.

- [ ] Add RED tests for all eight exact IDs, output paths, fixture-only domains/emails/phones and allowed APIs.
- [ ] Render real roster, reservation timeline, feedback page, food-safety children, allergen modal, recipe modal, custom-domain editor and signage components with fixed fake data.
- [ ] Allergen scan uses the local image and local fixture response; custom domain displays `demo.example.com` without executing add/enable/recheck; signage uses only self-created local artwork.
- [ ] Build and inspect all eight scenes; verify no notification, upload, provisioning or third-party request.
- [ ] Run tests, review and commit `feat(pos): add standard add-on screenshot fixtures`.

### Task 6: Capture and verify the 14 screenshot assets

**Files:**
- Create: `tools/screenshot-harness/scripts/capture.mjs`
- Create: `tools/screenshot-harness/tests/artifacts.test.mjs`
- Create: `tools/screenshot-harness/docs/screenshot-register.md`
- Output outside repo: `/Users/hong/Documents/Codex/2026-08-05/po/pos-demo-assets-2026-08-06/core/*.webp`
- Output outside repo: `/Users/hong/Documents/Codex/2026-08-05/po/pos-demo-assets-2026-08-06/add-ons/*.webp`

- [ ] Write RED artifact tests for all 14 paths, WebP decode, exact `1280 × 900`, ≤300 KiB, nonblank pixels and unique content hash.
- [ ] Implement capture: build harness, fail if port 3419 is occupied, start only on `127.0.0.1`, fresh browser context per scene, block external requests/service workers, freeze time/motion/caret, wait for fonts/images/ready selector.
- [ ] Capture PNG buffer, convert with Sharp to WebP, validate in a temporary file, then atomically rename.
- [ ] Record each scene's route, fake-data set, viewport, bytes, hash, network request list and manual PII result in the register.
- [ ] Run artifact, manifest and isolation tests: 14 scenes = 14 files, zero gap, zero duplicate.
- [ ] Open every file at original size for manual English/PII/commercial-data/readability review; recapture any failure.
- [ ] Run POS root lint, TypeScript and production build and confirm zero harness route.
- [ ] Final independent read-only review; commit harness script/register only as `test(pos): automate safe marketing screenshots`. Generated handoff assets remain outside the POS repo.

