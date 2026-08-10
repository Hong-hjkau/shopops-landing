# Task 1 report — order-entry food photographs

## Deliverables

- Replaced only the six approved rounded menu-image tiles in `public/pos-demo/order-entry.webp` with original food photographs: Happy Meal, Egg Fried Rice, Seafood Spaghetti, Crispy Fried Chicken Wings, Beef Satay Skewers and Caesar Salad.
- Kept the screenshot at `1280 × 900`; its finished file is `559198` bytes with SHA-256 `7814c59dd64c6043a413ec5fad6eb71b4568e9008270cfff2c9ed6151e5d33ff`.
- Added a decode-based asset test against the version-controlled preserved baseline at `tests/fixtures/pos-demo-order-entry-baseline.webp`. It requires six changed, nonblank and distinct food tiles, plus exact decoded-pixel equality outside the six rounded masks.
- Updated the screenshot register with the current byte count, SHA-256 and generated-food provenance.

## Source provenance and inspection

All six were generated separately with the built-in image-generation tool, then copied to `/private/tmp/shopops-order-entry-food-2026-08-10/` and opened from those local copies for inspection. Every accepted source uses a neutral plate, warm casual-restaurant lighting and square framing; no source contains people, brands, packaging, text or watermark.

| Dish | Local source | Inspection result |
|---|---|---|
| Happy Meal | `happy-meal.png` | Plain burger, fries and chicken nuggets clearly visible |
| Egg Fried Rice | `egg-fried-rice.png` | Fried rice, egg, spring onion and vegetables clearly visible |
| Seafood Spaghetti | `seafood-spaghetti.png` | Spaghetti with prawns, mussels and calamari clearly visible |
| Crispy Fried Chicken Wings | `fried-chicken-wings.png` | Six fried chicken wings clearly visible |
| Beef Satay Skewers | `beef-satay-skewers.png` | Grilled beef skewers and cucumber clearly visible |
| Caesar Salad | `caesar-salad.png` | Romaine, croutons, parmesan and dressing clearly visible |

## Composition and validation

- Sharp resized each source using `resize({ width, height, fit: "cover" })`, applied a `10 px` rounded alpha mask, then composited it at the exact required coordinates. The WebP is lossless so decoded pixels outside those masks remain unchanged.
- RED confirmed before composition: `node --test tests/pos-demo-assets.test.mjs` failed because the baseline `happy-meal` tile had not yet changed.
- GREEN confirmed after composition: focused asset test passed `4/4`, including true Sharp decoding and the outside-mask pixel comparison.
- Original-size visual QA opened the completed screenshot and confirmed all six visible labels match their food photos.
- Full `npm run verify` passed: content tests `70/70`, ESLint, route type generation, TypeScript, WCAG contrast and production build. `git diff --check` passed.

## Scope

Only Task 1 files were changed. No pricing copy or labels were edited.
