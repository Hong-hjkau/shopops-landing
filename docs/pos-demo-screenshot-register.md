# ShopOps POS Website Screenshot Register — 2026-08-06

- Scope: 18 English demo-interface WebP assets used by the POS feature page.
- **Workflow assets (2026-08-13, regenerated):** the four `order-entry` / `kitchen-order` / `floor-progress` /
  `checkout-report` assets are no longer hand-captured from a live Demo restaurant. They now come from the POS
  screenshot harness (`tools/screenshot-harness`, `workflow` scene group) with fixed fictional fixtures, a fixed
  clock and no Supabase connection, so they can be regenerated with one command. The harness renders the real POS
  components; only Core POS (`ordering`) is enabled, which is why no paid add-on entry point appears.
  Reviewed 2026-08-13 by HONG: all four opened at original size in Preview and confirmed English UI, no PII, no
  real commercial data, no third-party logo or trademark, and readable text. The three review columns below are
  ticked on the strength of that review.
- `order-entry.webp` shows the same six original generated food photographs (Happy Meal, Egg Fried Rice, Seafood
  Spaghetti, Crispy Fried Chicken Wings, Beef Satay Skewers, Caesar Salad). They were not regenerated: the harness
  fixture reuses the exact pixels, lifted from the previously approved `order-entry.webp` at the coordinates its
  tile test records, so the trademark and licence review that cleared them still applies to what ships today.
- New Core/add-on assets: copied unchanged from the isolated POS screenshot harness handoff. Its 2026-08-06 review opened all 14 files at original size and approved English UI, fictional data, PII/commercial-data safety and readability. `bilingual` intentionally shows fictional Chinese dish names in a labelled translation preview.
- Hashes and byte counts below are recalculated from the Landing copies, not copied from prose.
- The last two columns are a **manual approval gate**, not automated detection. A reviewer opens each asset at original size and ticks it only after confirming, with their own eyes, that (a) no third-party logo, wordmark or other trademark is visible and (b) every pixel is ShopOps-owned product UI or ShopOps-generated imagery that we are licensed to publish. `tests/pos-demo-assets.test.mjs` can only check that all 18 rows are ticked — it cannot recognise a trademark. Re-tick the row whenever an asset is recaptured, and note the reason below if a gate is ever set to anything other than `PASS`.
- 2026-08-11 review: all 18 assets re-opened at original size. Every visible surface is ShopOps POS UI. The food photographs in `order-entry.webp` are originals generated for ShopOps and carry no third-party branding. The NVIDIA-branded artwork that an earlier capture contained was replaced before this review, and no replacement asset reintroduces a third-party mark.

| Asset | Stable ID | Public path | Language | Dimensions | Bytes | SHA-256 | English / PII / commercial data / readability | No third-party logo or trademark | Asset licence and ownership confirmed |
|---|---|---|---|---:|---:|---|---|---|---|
| `order-entry.webp` | `order-entry` | `public/pos-demo/order-entry.webp` | EN | 1280 × 900 | 84910 | `ecb2fb95f08689e8962914816c9c282681ada5ad7b9180bf152b12d41b607712` | PASS | PASS | PASS |
| `kitchen-order.webp` | `kitchen-order` | `public/pos-demo/kitchen-order.webp` | EN | 1280 × 900 | 43656 | `6eaf35e4bf5a96d1215f2dc32744ca93a6f9b579fe40dd0fb83259fca65c18df` | PASS | PASS | PASS |
| `floor-progress.webp` | `floor-progress` | `public/pos-demo/floor-progress.webp` | EN | 1280 × 900 | 50286 | `e82d39e0f7a9d0f6f8cfc8de0df59c613edb5f65ccc618368c916dca4817fce4` | PASS | PASS | PASS |
| `checkout-report.webp` | `checkout-report` | `public/pos-demo/checkout-report.webp` | EN | 1280 × 900 | 56560 | `249d41b32dd9b325665bf7458553e166ac6882ad77c3e6a11620233f378e0602` | PASS | PASS | PASS |
| `bilingual.webp` | `bilingual` | `public/pos-demo/core/bilingual.webp` | EN | 1280 × 900 | 23570 | `1dc82c8e606df2ed591fdfef97f7bfd46d4545b3c990242fff9bb201733426ab` | PASS | PASS | PASS |
| `offline_backup.webp` | `offline_backup` | `public/pos-demo/core/offline_backup.webp` | EN | 1280 × 900 | 20822 | `584e739c609bb03d2e8308299402e249c78362ea25b2b122dd28e1774de479b1` | PASS | PASS | PASS |
| `menu_management.webp` | `menu_management` | `public/pos-demo/core/menu_management.webp` | EN | 1280 × 900 | 17232 | `2379cae92217af7e1e156aace7ffc9083bc45374676a083a6b986cd14fca9ee7` | PASS | PASS | PASS |
| `sold_out.webp` | `sold_out` | `public/pos-demo/core/sold_out.webp` | EN | 1280 × 900 | 15952 | `d8723e6e8f4d97386a7c98839db6183a2444c80da8ef918b5cbc417e754e3158` | PASS | PASS | PASS |
| `delivery.webp` | `delivery` | `public/pos-demo/add-ons/delivery.webp` | EN | 1280 × 900 | 45122 | `a51c02bd437f9672b1975c1be62c40a2e5a1b47572a7457404cd16e424f6c529` | PASS | PASS | PASS |
| `finance_inventory.webp` | `finance_inventory` | `public/pos-demo/add-ons/finance_inventory.webp` | EN | 1280 × 900 | 50356 | `35fa610c34e7bb6421ebee3ffcc621a2189fd8f72b27d7a5e7163dd7a81de6d8` | PASS | PASS | PASS |
| `scheduling.webp` | `scheduling` | `public/pos-demo/add-ons/scheduling.webp` | EN | 1280 × 900 | 20240 | `d34c6ef9bcfd657fa82a55808c41228ea97b73398946b8630c6cc2529bb8911f` | PASS | PASS | PASS |
| `reservations.webp` | `reservations` | `public/pos-demo/add-ons/reservations.webp` | EN | 1280 × 900 | 20626 | `43ee5a3ab8139e3d6dcfef8c68a847f4e311da3f8f7bee942c2d7aad37a423e6` | PASS | PASS | PASS |
| `reviews.webp` | `reviews` | `public/pos-demo/add-ons/reviews.webp` | EN | 1280 × 900 | 27256 | `3cac651a7cdb4c2dc315ebdda24418bbbfced6b4d21c9cb1493a213d56e05787` | PASS | PASS | PASS |
| `food_safety.webp` | `food_safety` | `public/pos-demo/add-ons/food_safety.webp` | EN | 1280 × 900 | 21172 | `a16186f27972d51bad3b2af212bca43076deebcd7842a74a2260f3c1facb1869` | PASS | PASS | PASS |
| `allergens.webp` | `allergens` | `public/pos-demo/add-ons/allergens.webp` | EN | 1280 × 900 | 24266 | `4ab27958341c4b1127f31088df6e769cfb2563ccec7b975b0e4c2bc65feef7e4` | PASS | PASS | PASS |
| `recipe_costing.webp` | `recipe_costing` | `public/pos-demo/add-ons/recipe_costing.webp` | EN | 1280 × 900 | 26514 | `48aa5067c1dac90aab85c61ed0f714146df5b6124580f389131cf6dec3154087` | PASS | PASS | PASS |
| `custom_domain.webp` | `custom_domain` | `public/pos-demo/add-ons/custom_domain.webp` | EN | 1280 × 900 | 21800 | `ff91ce2846d697c4584040066f6087f09f8c110d41ba88d4cb4e3b22bf8f4a2f` | PASS | PASS | PASS |
| `signage.webp` | `signage` | `public/pos-demo/add-ons/signage.webp` | EN | 1280 × 900 | 27574 | `51396a185b034bf76228165c84dc61a584b6f774639a1e5caeab758b081f3280` | PASS | PASS | PASS |

Reconciliation: 18 approved feature items = 18 stable IDs = 18 unique WebP files = 18 map entries = 18 register rows. Zero missing, extra or duplicate path.

4 source stages = 4 English assets, zero gap.

## Workflow asset provenance

Regenerated 2026-08-13 by `npm run capture` in `POS/tools/screenshot-harness`. Fixed viewport 1280×900,
`en-GB`, `Europe/London`, clock pinned to 2026-08-06 11:30 BST, local-only `127.0.0.1:3419`, external requests
blocked. All four render one fictional order at table 7 so the journey reads as a single story. Capture refuses
any scene whose rendered text contains an absolute date, which is why no date picker value appears.

<details>
<summary>Superseded: the 2026-08-01 hand-capture provenance</summary>

## Existing four-stage workflow provenance

The four workflow images were captured on 2026-08-01 (UK time) from one newly
created dine-in order in the fictional Demo restaurant `Demo A TEST`, table 7,
party of 2. Table 7 was visibly `Not open` before the session and had no unpaid
order; table 8 was deliberately avoided because it already had an order. The
Demo-only order was `#26080101A002` (admin code `260801-01-A002`, short code
`#A002`) and contained one `Happy Meal` at £5.00. It moved from pending to
preparing, was completed, paid with Demo cash for £5.00, and table 7 was
confirmed `Not open` afterwards.

| Asset | Demo state | Viewport and asset | Masking result |
|---|---|---|---|
| `order-entry.webp` | Staff dine-in cart, table 7, `Happy Meal` ×1, £5.00 total; table 7 filter shows only new `#A002` unpaid row | 1280×900 viewport; asset 1280×900 | None required |
| `kitchen-order.webp` | Dine-in filter, new `#A002` order pending only | 1280×900 viewport; source 1265×889; product-area crop 1045×735 | Sidebar-only crop; product UI unchanged |
| `floor-progress.webp` | Open Orders, table 7 preparing only; takeaway count 0 | 1280×900 viewport; source 1265×889; product-area crop 1045×735 | Sidebar-only crop; product UI unchanged |
| `checkout-report.webp` | Table 7 filter, checkout before Demo cash payment; cash/card choices visible | 1280×900 viewport; asset 1280×900 | None required |

### Per-asset privacy and readability gate

| Asset | English UI, restaurant, item and status | Existing order rows absent | Name, email, phone and address absent | Token, API key and payment credential absent | Browser chrome and notifications absent | Text readable at original resolution |
|---|---|---|---|---|---|---|
| `order-entry.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `kitchen-order.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `floor-progress.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `checkout-report.webp` | Yes | Yes | Yes | Yes | Yes | Yes |

### Capture decisions

- `order-entry.webp` uses the full 1280×900 product capture. The staff unpaid
  list is filtered to table 7 and its only visible row is the new Demo order
  `#A002`; no pre-existing order row is shown.
- Kitchen was filtered to **Dine-in** and captured while the new order was the
  only pending dine-in card. Its 1045×735 crop removes the complete navigation
  sidebar from the real full capture; the product area is otherwise unchanged.
- Open Orders showed only table 7 preparing; the takeaway section showed
  `0 orders` and no takeaway row or address. Its 1045×735 crop applies the same
  complete-sidebar removal without altering the product area.
- Checkout remained filtered to table 7. The only visible order row was the new
  Demo order; no pre-existing delivery row or address was exposed. Card ref
  `435` was generated inside the Demo checkout and is not a payment credential.
- The active product language was English throughout. Every visible restaurant,
  menu, order, filter and status label in the four final assets is English.
- No customer or staff name, email, phone number, postal address, account ID,
  URL token, API key, payment token, real card data or production analytics is
  visible.
- Screenshots contain product UI only. Browser chrome, password-manager prompts,
  notifications, bookmarks and unrelated tabs are absent.

</details>
