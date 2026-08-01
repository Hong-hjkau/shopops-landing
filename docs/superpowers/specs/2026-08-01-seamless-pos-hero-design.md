# Seamless POS Hero Design

Date: 2026-08-01 (UK)
Status: Approved direction; implementation pending

## Goal

Replace the current framed `logo.png` presentation in the ShopOps POS hero with a single continuous cinematic hero scene. The change must remove the visible black rectangle around the logo while preserving the premium black, orange, reflective 3D brand style.

## Approved visual direction

- Use the newly generated 16:9 ShopOps hero artwork as a new asset named `public/pos-hero-wide.png`.
- Keep the complete glossy black squircle and glowing orange S on the left third.
- Extend the black background, orange floor-level light streak and reflective floor seamlessly across the full image.
- Reserve the quiet right half for live website copy.
- Do not bake any words into the bitmap. English, Traditional Chinese and Simplified Chinese continue to render as accessible HTML.
- Keep the existing `public/logo.png` unchanged for rollback and any existing non-hero uses.

## Responsive layout

### Desktop

- The new image fills the full POS hero rather than appearing as a separate image card.
- Live eyebrow, heading, description, CTA and reassurance sit over the negative space on the right.
- A subtle dark gradient behind the copy may be used only as much as needed to maintain readability.
- The logo, orange light streak and reflection must remain fully visible without a rectangular boundary.

### Mobile

- The hero becomes a vertical composition within one continuous black section.
- The artwork appears first and is cropped with the logo prominent.
- The live copy and CTA follow below the artwork rather than covering the logo.
- The local hero background may match the artwork's pure-black edge, but the site's global `#0A0A0B` hero token remains unchanged.

## Scope

- Update the shared `PosHero` component used by the homepage and `/pos` page.
- Do not alter the sticky header logo, Open Graph artwork, Rota hero, blog header or other product pages.
- Do not change approved POS wording, trial terms, pricing facts or language-switch behaviour.

## Accessibility and performance

- Preserve semantic heading order and the existing CTA keyboard focus behaviour.
- Keep the artwork decorative when the live HTML heading already communicates the content.
- Use responsive image sizing and avoid loading duplicate desktop and mobile source files unless visual testing proves one asset cannot serve both.
- Verify copy contrast over the darkest and brightest parts of the rendered hero.

## Verification

- Check homepage and `/pos` at desktop and mobile widths.
- Check English, Traditional Chinese and Simplified Chinese on both routes.
- Confirm no horizontal overflow, text clipping, logo cropping or visible rectangular image edge.
- Run content tests, lint, TypeScript, contrast checks and the production build.
- Visually inspect the final local preview before any push or deployment.

## Supporting research

- CSS masking can use gradients to create soft image-edge transitions, but this design avoids relying on masking by generating one continuous hero scene: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mask-image
- Modern WebP supports alpha transparency and efficient web delivery; the final format can be selected after measuring the generated PNG against an optimised WebP: https://web.dev/learn/images/webp/
