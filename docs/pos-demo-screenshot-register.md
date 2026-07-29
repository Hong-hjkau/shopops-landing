# POS Demo Screenshot Register

Capture date: 2026-07-29 (UK time)

Journey: a newly created dine-in order in `示範餐廳 A TEST`, table 8, party of 2,
using the Demo-only order `260729-01-A001`. The order contained one Light Set
with Seafood Spaghetti for £12.80. It was moved from pending to preparing,
completed, and closed with a Demo cash payment. No existing takeaway or delivery
order was used.

| Asset | Source environment | Demo state | Language | Viewport | Masking result | Fictional data checked | Private data checked | Approved |
|---|---|---|---|---|---|---|---|---|
| `order-entry.webp` | Demo account / non-production | Staff dine-in order entry, table 8 | EN | Tablet override 1280×900; asset 1280×900 | None required | Yes | Yes | Yes |
| `kitchen-order.webp` | Demo account / non-production | Dine-in-only kitchen filter, new order pending | ZH-Hant | Tablet override 1280×900; asset 1265×889 | None required | Yes | Yes | Yes |
| `floor-progress.webp` | Demo account / non-production | New table 8 order preparing, no takeaway rows | ZH-Hant | Tablet override 1280×900; asset 1265×889 | None required | Yes | Yes | Yes |
| `checkout-report.webp` | Demo account / non-production | Checkout summary before Demo cash payment | EN | Tablet override 1280×900; asset 1280×900 | None required | Yes | Yes | Yes |

## Privacy checks

- The restaurant name is explicitly fictional: `示範餐廳 A TEST`.
- Table number, party size, menu selection, price, order code, and short checkout
  reference were generated inside the Demo environment for this capture journey.
- No customer or staff name, email, phone number, postal address, account ID,
  URL token, API key, payment token, real card data, or production analytics is
  visible.
- Screenshots contain product UI only. Browser chrome, password-manager prompts,
  notifications, bookmarks, and unrelated tabs are absent.
- No blur, cover, replacement text, or fabricated UI was used.

## Rejected capture notes

- The public takeaway flow was rejected before capture because it contains
  customer contact/address fields and was not needed for a dine-in journey.
- The unfiltered staff unpaid list and unfiltered kitchen board were rejected
  because they showed pre-existing Demo delivery orders. Final captures use the
  table-8 or dine-in filter and show only the newly created Demo order.
