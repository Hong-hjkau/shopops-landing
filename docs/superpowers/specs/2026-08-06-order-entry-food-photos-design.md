# Order-entry Food Photos Design

## Goal

Replace the incorrect NVIDIA image and five blank image areas in the public POS order-entry screenshot with six matching, licence-safe food photographs. This is a marketing screenshot change only; the POS demo database and application behaviour remain unchanged.

## Approved approach

- Generate six original, photorealistic food photographs in one consistent casual restaurant style.
- Match the visible menu items: Happy Meal, Egg Fried Rice, Seafood Spaghetti, Crispy Fried Chicken Wings, Beef Satay Skewers and Caesar Salad.
- Use close, appetising overhead or three-quarter food framing with neutral tableware, no people, logos, packaging, text or watermark.
- Composite each photograph only into its existing menu-card image rectangle in `public/pos-demo/order-entry.webp`.
- Preserve every UI pixel outside those six rectangles, including labels, prices, order details and page dimensions.
- Keep the result as WebP and update the screenshot register bytes and SHA-256 evidence.

## Safety and quality constraints

- Do not download third-party food photography or introduce external copyright risk.
- Do not alter the actual POS demo tenant or upload any image to production POS storage.
- Do not add personal information, real restaurant data or identifiable branding.
- Each inserted photograph must visibly match its dish label at the screenshot's rendered size.
- The final image must decode successfully, retain its original dimensions and remain readable without covering text.

## Verification

- Compare before and after at original size and confirm only the six image rectangles changed.
- Confirm all six rectangles contain distinct, nonblank food images and the NVIDIA logo is absent.
- Re-run Landing asset, content, lint, TypeScript, WCAG and production-build verification.
- Perform an independent read-only review, then update the live site and smoke-test the deployed image.
