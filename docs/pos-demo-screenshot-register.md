# POS Demo Screenshot Register

Capture date: 2026-08-01 (UK time)

Journey: one newly created dine-in order in the fictional Demo restaurant
`Demo A TEST`, table 7, party of 2. Table 7 was visibly `Not open` before the
session and had no unpaid order; table 8 was deliberately avoided because it
already had an order. The Demo-only order was `#26080101A001` (admin code
`260801-01-A001`, short code `#A001`) and contained one `Happy Meal` at £5.00.
It moved from pending to preparing, was completed, paid with Demo cash for
£5.00, and table 7 was confirmed `Not open` afterwards.

| Asset | Source environment | Demo state | Language | Viewport and asset | File size | Masking result | Fictional data checked | Private data checked | Approved |
|---|---|---|---|---|---:|---|---|---|---|
| `order-entry.webp` | Demo account / non-production | Staff dine-in cart, table 7, `Happy Meal` ×1, £5.00 total | EN | 1280×900 viewport; intentional product-area clip 1280×520 | 27,974 bytes | None; clean product-area capture | Yes | Yes | Yes |
| `kitchen-order.webp` | Demo account / non-production | Dine-in filter, new `#A001` order pending only | EN | 1280×900 viewport; asset 1265×889 | 34,746 bytes | None required | Yes | Yes | Yes |
| `floor-progress.webp` | Demo account / non-production | Open Orders, table 7 preparing only; takeaway count 0 | EN | 1280×900 viewport; asset 1265×889 | 34,188 bytes | None required | Yes | Yes | Yes |
| `checkout-report.webp` | Demo account / non-production | Table 7 filter, checkout before Demo cash payment; cash/card choices visible | EN | 1280×900 viewport; asset 1280×900 | 40,808 bytes | None required | Yes | Yes | Yes |

4 source stages = 4 English assets, zero gap.

## Per-asset privacy and readability gate

| Asset | English UI, restaurant, item and status | Existing order rows absent | Name, email, phone and address absent | Token, API key and payment credential absent | Browser chrome and notifications absent | Text readable at original resolution |
|---|---|---|---|---|---|---|
| `order-entry.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `kitchen-order.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `floor-progress.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `checkout-report.webp` | Yes | Yes | Yes | Yes | Yes | Yes |

## Capture decisions

- `order-entry.webp` uses a clean 1280×520 product-area clip from the 1280×900
  viewport so the pre-existing staff unpaid section is outside the capture. The
  product UI was not altered, covered, blurred, replaced or fabricated.
- Kitchen was filtered to **Dine-in** and captured while the new order was the
  only pending dine-in card.
- Open Orders showed only table 7 preparing; the takeaway section showed
  `0 orders` and no takeaway row or address.
- Checkout remained filtered to table 7. The only visible order row was the new
  Demo order; no pre-existing delivery row or address was exposed. Card ref
  `434` was generated inside the Demo checkout and is not a payment credential.
- The active product language was English throughout. The admin sidebar's
  language switch still shows `中文` as the name of the alternative language;
  restaurant, menu, order and status content remain English.
- No customer or staff name, email, phone number, postal address, account ID,
  URL token, API key, payment token, real card data or production analytics is
  visible.
- Screenshots contain product UI only. Browser chrome, password-manager prompts,
  notifications, bookmarks and unrelated tabs are absent.
