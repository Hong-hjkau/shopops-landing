# POS Demo Screenshot Register

Capture date: 2026-08-01 (UK time)

Journey: one newly created dine-in order in the fictional Demo restaurant
`Demo A TEST`, table 7, party of 2. Table 7 was visibly `Not open` before the
session and had no unpaid order; table 8 was deliberately avoided because it
already had an order. The Demo-only order was `#26080101A002` (admin code
`260801-01-A002`, short code `#A002`) and contained one `Happy Meal` at £5.00.
It moved from pending to preparing, was completed, paid with Demo cash for
£5.00, and table 7 was confirmed `Not open` afterwards.

| Asset | Source environment | Demo state | Language | Viewport and asset | File size | Masking result | Fictional data checked | Private data checked | Approved |
|---|---|---|---|---|---:|---|---|---|---|
| `order-entry.webp` | Demo account / non-production | Staff dine-in cart, table 7, `Happy Meal` ×1, £5.00 total; table 7 filter shows only new `#A002` unpaid row | EN | 1280×900 viewport; asset 1280×900 | 40,538 bytes | None required | Yes | Yes | Yes |
| `kitchen-order.webp` | Demo account / non-production | Dine-in filter, new `#A002` order pending only | EN | 1280×900 viewport; source 1265×889; product-area crop 1045×735 | 17,934 bytes | Sidebar-only crop; product UI unchanged | Yes | Yes | Yes |
| `floor-progress.webp` | Demo account / non-production | Open Orders, table 7 preparing only; takeaway count 0 | EN | 1280×900 viewport; source 1265×889; product-area crop 1045×735 | 16,828 bytes | Sidebar-only crop; product UI unchanged | Yes | Yes | Yes |
| `checkout-report.webp` | Demo account / non-production | Table 7 filter, checkout before Demo cash payment; cash/card choices visible | EN | 1280×900 viewport; asset 1280×900 | 40,918 bytes | None required | Yes | Yes | Yes |

4 source stages = 4 English assets, zero gap.

## Per-asset privacy and readability gate

| Asset | English UI, restaurant, item and status | Existing order rows absent | Name, email, phone and address absent | Token, API key and payment credential absent | Browser chrome and notifications absent | Text readable at original resolution |
|---|---|---|---|---|---|---|
| `order-entry.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `kitchen-order.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `floor-progress.webp` | Yes | Yes | Yes | Yes | Yes | Yes |
| `checkout-report.webp` | Yes | Yes | Yes | Yes | Yes | Yes |

## Capture decisions

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
