# POS Per-item Pricing Clarity Design

**Date:** 2026-08-05  
**Status:** Approved visual direction; awaiting written-spec review

## Problem

The current add-on cards place one prominent price above a list of features. Even though the heading says “Each add-on”, a visitor can reasonably read the card as “£9 includes all eight features”. The layout must make it immediately clear that every listed feature is charged separately.

## Approved direction

Keep the existing two grouped add-on cards, but bind a price to every feature row.

- The £9 card continues to contain the eight £9 add-ons.
- The £19 card continues to contain the two £19 add-ons.
- Every row shows the feature name on the left and its own `£9/month` or `£19/month` price on the right.
- Add one explicit sentence above the grouped cards:
  - English: `Choose any add-on individually. Each item is charged separately.`
  - Traditional Chinese: `各項獨立收費，可任選一項或多項。`
  - Simplified Chinese: `各项独立收费，可任选一项或多项。`
- Keep the existing statement that all add-ons require the Core POS plan.

## Responsive behaviour

- Desktop keeps the two-card layout.
- Mobile stacks the cards as it does now.
- Each feature row is a two-part flex layout: the feature name may wrap, while the price is non-shrinking and remains attached to that row.
- The price must not fall onto an ambiguous line beneath a different feature.

## Scope boundaries

- Core POS remains £19 per month and its included features do not change.
- Add-on names, prices and counts do not change.
- Rota pricing remains unchanged.
- VAT and card-processing-fee wording remains unchanged.
- Call pop-up is not added.
- No selector, calculator or checkout behaviour is introduced.

## Accessibility

- Preserve semantic list structure for the add-ons.
- Each row exposes the feature name and its corresponding monthly price together in reading order.
- Do not rely on colour alone to communicate that prices are separate.

## Verification

- Content tests lock the three exact billing-note translations.
- Tests verify every rendered add-on row includes its group price and monthly unit.
- Tests retain the exact 8-item £9 group and 2-item £19 group in all three languages.
- Rota isolation, VAT wording and call-pop-up exclusions remain covered.
- Run the full `npm run verify` gate.
- Visually inspect English, Traditional Chinese and Simplified Chinese at mobile and desktop widths, checking wrapping and price alignment.

