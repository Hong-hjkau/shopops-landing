# English POS Screenshots and Suitability FAQ Design

Date: 2026-08-01 (UK time)

## Goal

Make the four POS journey screenshots visually consistent by showing an
English-only Demo flow, while keeping each screenshot caption translated with
the website language. Replace the Edinburgh-focused homepage FAQ with a useful
answer about the types of food businesses that ShopOps POS can suit.

## Screenshot Design

- Keep the existing four-step journey and layout:
  1. customer QR or staff order;
  2. kitchen receives the order;
  3. front of house tracks progress;
  4. checkout and reporting.
- Recapture all four screenshots from the real ShopOps Demo POS rather than
  editing or fabricating interface text.
- Every visible interface label, restaurant name, menu item, order item and
  status must be English. The captions below the images continue to come from
  the current language dictionary and therefore switch between English,
  Traditional Chinese and Simplified Chinese with the website.
- Use one newly created fictional dine-in order throughout the four stages.
  Do not open, reuse or expose any existing order, takeaway delivery address,
  customer detail or production record.
- Prefer an existing English-only Demo restaurant if one is available. If none
  exists, create a separate fictional English Demo restaurant with the minimum
  English menu data required for the screenshots. Do not rename, modify or
  delete an existing restaurant, menu or order.
- Capture at the same tablet-style viewport as the current assets and keep the
  four existing filenames so the page layout does not need a new image API.
- Check each finished image for names, phone numbers, email addresses, postal
  addresses, tokens, payment details, unrelated orders and browser chrome.
  Record the fictional data and privacy result in the screenshot register.

## FAQ Copy

Replace the homepage service-area question and answer in all three languages.
The wording stays specific without promising that every workflow is supported.

### English

- Question: `What types of food businesses is ShopOps POS suitable for?`
- Answer: `It is suitable for independent food businesses such as market stalls, cafés, small restaurants and takeaway shops. We can learn about your setup during the demo.`

### Traditional Chinese

- Question: `ShopOps POS 適合甚麼類型的餐飲生意？`
- Answer: `適合市集攤位、咖啡店、小餐館及外賣店等獨立餐飲生意。我們可以在示範時了解你的營運方式。`

### Simplified Chinese

- Question: `ShopOps POS 适合什么类型的餐饮生意？`
- Answer: `适合市集摊位、咖啡店、小餐馆及外卖店等独立餐饮生意。我们可以在演示时了解你的营运方式。`

No Edinburgh reference remains in this FAQ. Existing company-location copy
outside this FAQ is not part of this change.

## Verification

- Content tests lock the three approved FAQ questions and answers and reject
  the previous Edinburgh-focused FAQ wording.
- The screenshot register records four English-only assets and reconciles
  four inputs to four outputs with no missing stage.
- Visual checks cover desktop 1440×900 and mobile 390×844 in all three website
  languages. Screenshot captions must translate; screenshot pixels must remain
  the same English-only product UI.
- Run the complete project verification, the prohibited-claim audit and an
  independent read-only review before committing the implementation.

## Out of Scope

- Changing the POS product interface or its translation system.
- Editing existing Demo restaurants, menus or historical orders.
- Changing the four-step journey, page layout, pricing, trial terms, hardware
  terms or other FAQs.
- Pushing, merging or deploying the website.
