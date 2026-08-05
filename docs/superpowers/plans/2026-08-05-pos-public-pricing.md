# ShopOps POS Public Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the POS page’s “Contact us” price with a public £19 core plan, grouped £9/£19 add-ons, and accurate no-VAT wording in English, Traditional Chinese, and Simplified Chinese.

**Architecture:** Keep all POS commercial facts in the existing typed `pricing` object in `lib/pos-content.ts`, expanding it to enforce the approved plan shape and item counts. Render that object through a new POS-only `PosPricingSection` so the shared `PricingCard` and Rota output remain untouched.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Node test runner.

## Global Constraints

- Core POS is £19/month and includes ordering POS, front-of-house/kitchen translation, and discounts.
- £9/month add-ons are rota and clock-in, reservations, customer reviews, food-safety records, allergen recognition, recipe costing, custom domain, and advertising screen.
- £19/month add-ons are takeaway delivery and finance/inventory.
- Every add-on requires the core POS plan.
- Do not display call pop-up anywhere.
- ShopOps is not VAT registered; use “No VAT added”, never “+ VAT”, “excluding VAT”, “VAT free”, or “VAT exempt”.
- Preserve the existing trial, first-payment, card-processing, CTA, and Rota pricing behaviour.
- Do not add dependencies, a configurator, checkout, hardware pricing, payment-processing pricing, or one-off fees.

---

### Task 1: Publish the POS core plan and grouped add-ons

**Files:**
- Modify: `lib/pos-content.ts`
- Create: `components/PosPricingSection.tsx`
- Modify: `components/PosLanding.tsx`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: `Lang` and the existing `POS_CONTENT: Record<Lang, PosSharedContent>`.
- Produces: expanded `PosSharedContent["pricing"]`, containing one core plan and exactly two add-on groups; `PosPricingSection({ copy })`, which renders that data at `#pricing`.

- [ ] **Step 1: Read the local Next.js component guidance before editing**

Run:

```bash
sed -n '1,240p' node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
sed -n '1,220p' node_modules/next/dist/docs/01-app/01-getting-started/11-css.md
```

Confirm the new component stays presentational, takes serialisable copy data, and uses existing Tailwind classes without adding a client boundary.

- [ ] **Step 2: Write the failing public-pricing content test**

Add to `tests/pos-content.test.mjs`:

```js
test("POS public pricing exposes the approved core plan, add-ons, and VAT status in every language", () => {
  for (const lang of languages) {
    const pricing = POS_CONTENT[lang].pricing;
    assert.equal(pricing.core.monthlyPrice, 19);
    assert.equal(pricing.core.included.length, 3);
    assert.deepEqual(pricing.addOnGroups.map((group) => group.monthlyPrice), [9, 19]);
    assert.equal(pricing.addOnGroups[0].items.length, 8);
    assert.equal(pricing.addOnGroups[1].items.length, 2);
    assert.match(pricing.perItemLabel, /Each add-on|每項功能|每项功能/);
    assert.match(pricing.vatNote, /No VAT added|不另收 VAT/);
    assert.doesNotMatch(JSON.stringify(pricing), /call pop-up|來電彈屏|来电弹屏/i);
    assert.doesNotMatch(pricing.vatNote, /\+ VAT|excluding VAT|未包 VAT|VAT free|VAT exempt/i);
  }

  assert.deepEqual(POS_CONTENT.en.pricing.core.included, [
    "Ordering POS",
    "Front-of-house and kitchen translation",
    "Discounts",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[0].items, [
    "Rota and clock-in", "Reservations", "Customer reviews", "Food-safety records",
    "Allergen recognition", "Recipe costing", "Custom domain", "Advertising screen",
  ]);
  assert.deepEqual(POS_CONTENT.en.pricing.addOnGroups[1].items, [
    "Takeaway delivery", "Finance and inventory",
  ]);
});
```

- [ ] **Step 3: Write the failing page-wiring and Rota-isolation test**

Add:

```js
test("POS uses its dedicated pricing section without changing the shared Rota card", () => {
  const pos = readFileSync(new URL("../components/PosLanding.tsx", import.meta.url), "utf8");
  const rota = readFileSync(new URL("../components/RotaLanding.tsx", import.meta.url), "utf8");
  const section = readFileSync(new URL("../components/PosPricingSection.tsx", import.meta.url), "utf8");

  assert.match(pos, /import PosPricingSection from "@\/components\/PosPricingSection"/);
  assert.match(pos, /<PosPricingSection copy=\{pos\.pricing\} trial=\{pos\.trial\.title\} \/>/);
  assert.doesNotMatch(pos, /<PricingCard/);
  assert.match(rota, /import PricingCard from "@\/components\/PricingCard"/);
  assert.match(rota, /<PricingCard pricing=\{t\.pricing\} \/>/);
  assert.match(section, /id="pricing"/);
  assert.match(section, /copy\.addOnGroups\.map/);
  assert.match(section, /copy\.perItemLabel/);
  assert.match(section, /\{trial\}/);
  assert.match(section, /href="#contact"/);
});
```

In the existing journey-order test, replace `"<PricingCard"` with `"<PosPricingSection"`. In the existing `POS FAQ uses the shared pricing...` test, replace the `pos.pricing.body` assertion with the new `PosPricingSection copy={pos.pricing} trial={pos.trial.title}` wiring assertion; keep all commission assertions unchanged.

- [ ] **Step 4: Run the focused tests and verify red**

```bash
node --test --test-name-pattern="POS public pricing|dedicated pricing section|approved factual product journey" tests/pos-content.test.mjs
```

Expected: FAIL because the expanded `pricing` shape and `PosPricingSection.tsx` do not exist and POS still renders `PricingCard`.

- [ ] **Step 5: Add the typed three-language pricing facts**

Replace the existing two-field `pricing` type in `PosSharedContent` with:

```ts
pricing: {
  eyebrow: string;
  title: string;
  body: string;
  monthlyUnit: string;
  includedLabel: string;
  perItemLabel: string;
  core: {
    name: string;
    monthlyPrice: 19;
    included: readonly [string, string, string];
  };
  addOnsTitle: string;
  addOnsRequirement: string;
  addOnGroups: readonly [
    {
      monthlyPrice: 9;
      items: readonly [string, string, string, string, string, string, string, string];
    },
    {
      monthlyPrice: 19;
      items: readonly [string, string];
    },
  ];
  cta: string;
  vatNote: string;
  feeNote: string;
};
```

Add the following exact facts to each language:

```ts
// en
pricing: {
  eyebrow: "Pricing",
  title: "A clear monthly POS plan, with optional add-ons",
  body: "Start with the core POS plan, then add only the extra tools your restaurant needs.",
  monthlyUnit: "/month",
  includedLabel: "Included",
  perItemLabel: "Each add-on",
  core: {
    name: "Core POS",
    monthlyPrice: 19,
    included: ["Ordering POS", "Front-of-house and kitchen translation", "Discounts"],
  },
  addOnsTitle: "Optional add-ons",
  addOnsRequirement: "All add-ons require the Core POS plan.",
  addOnGroups: [
    { monthlyPrice: 9, items: ["Rota and clock-in", "Reservations", "Customer reviews", "Food-safety records", "Allergen recognition", "Recipe costing", "Custom domain", "Advertising screen"] },
    { monthlyPrice: 19, items: ["Takeaway delivery", "Finance and inventory"] },
  ],
  cta: "Book a demo & free trial setup",
  vatNote: "No VAT added. ShopOps is not currently VAT registered, so the price shown is the total monthly subscription price.",
  feeNote: "Card-processing fees remain separate.",
},

// zh-Hant
pricing: {
  eyebrow: "收費",
  title: "清晰 POS 月費，可按需要加購功能",
  body: "先選用核心 POS 套餐，再按餐廳需要加入其他工具。",
  monthlyUnit: "／月",
  includedLabel: "已包括",
  perItemLabel: "每項功能",
  core: {
    name: "核心 POS",
    monthlyPrice: 19,
    included: ["落單 POS", "店房翻譯", "優惠折扣"],
  },
  addOnsTitle: "加購功能",
  addOnsRequirement: "所有加購功能均須配合核心 POS 套餐使用。",
  addOnGroups: [
    { monthlyPrice: 9, items: ["排班打卡", "訂位", "顧客評價", "食安記錄", "過敏原辨識", "食譜成本", "自訂網域", "廣告屏"] },
    { monthlyPrice: 19, items: ["外賣送貨", "財務在庫"] },
  ],
  cta: "預約示範及免費試用設定",
  vatNote: "不另收 VAT。ShopOps 目前未登記 VAT，所示價格就是現時每月實際收費。",
  feeNote: "信用卡付款處理費另計。",
},

// zh-Hans
pricing: {
  eyebrow: "收费",
  title: "清晰 POS 月费，可按需要加购功能",
  body: "先选用核心 POS 套餐，再按餐厅需要加入其他工具。",
  monthlyUnit: "／月",
  includedLabel: "已包括",
  perItemLabel: "每项功能",
  core: {
    name: "核心 POS",
    monthlyPrice: 19,
    included: ["点餐 POS", "前厅与厨房翻译", "优惠折扣"],
  },
  addOnsTitle: "加购功能",
  addOnsRequirement: "所有加购功能均须配合核心 POS 套餐使用。",
  addOnGroups: [
    { monthlyPrice: 9, items: ["排班打卡", "订位", "顾客评价", "食品安全记录", "过敏原识别", "食谱成本", "自定义域名", "广告屏"] },
    { monthlyPrice: 19, items: ["外卖配送", "财务与库存"] },
  ],
  cta: "预约演示及免费试用设置",
  vatNote: "不另收 VAT。ShopOps 目前未登记 VAT，所示价格就是目前每月实际收费。",
  feeNote: "信用卡付款处理费另计。",
},
```

- [ ] **Step 6: Create the POS-only pricing component**

Create `components/PosPricingSection.tsx`:

```tsx
import type { PosSharedContent } from "@/lib/pos-content";

type PosPricingCopy = PosSharedContent["pricing"];

export default function PosPricingSection({ copy, trial }: { copy: PosPricingCopy; trial: string }) {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{copy.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-secondary">{copy.body}</p>
        </div>

        <div className="mt-10 rounded-2xl border border-accent/30 bg-surface p-6 sm:p-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-strong">{trial}</span>
            <h3 className="mt-5 text-xl font-bold text-text">{copy.core.name}</h3>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-text">£{copy.core.monthlyPrice}</span>
              <span className="text-lg font-semibold text-text-secondary">{copy.monthlyUnit}</span>
            </div>
          </div>
          <p className="mt-7 text-sm font-semibold text-text">{copy.includedLabel}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {copy.core.included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-xl bg-bg p-4 text-text">
                <span aria-hidden className="font-bold text-success">✓</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-center text-2xl font-bold text-text">{copy.addOnsTitle}</h3>
          <p className="mt-2 text-center text-sm text-text-secondary">{copy.addOnsRequirement}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {copy.addOnGroups.map((group) => (
              <div key={group.monthlyPrice} className="rounded-2xl border border-border bg-surface p-6">
                <p className="text-sm font-semibold text-text-secondary">{copy.perItemLabel}</p>
                <p className="text-2xl font-bold text-text">£{group.monthlyPrice}<span className="text-base font-semibold text-text-secondary">{copy.monthlyUnit}</span></p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                  {group.items.map((item) => <li key={item} className="flex gap-3 text-text"><span aria-hidden className="text-success">✓</span><span>{item}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#contact" className="inline-flex w-full justify-center rounded-xl bg-accent px-6 py-4 text-base font-bold text-on-accent transition hover:bg-accent-hover sm:w-auto">{copy.cta}</a>
          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{copy.vatNote}</p>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">{copy.feeNote}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Wire the POS page**

In `components/PosLanding.tsx`:

1. Replace the `PricingCard` import with `PosPricingSection`.
2. Remove `pricing` from each language’s local `dict`.
3. Remove the local `const pricing = { ... }` adapter.
4. Replace `<PricingCard pricing={pricing} />` with:

```tsx
<PosPricingSection copy={pos.pricing} trial={pos.trial.title} />
```

Do not change section order, FAQ, contact adapter, trial adapter, or Rota files.

- [ ] **Step 8: Run focused tests and make them pass**

```bash
node --test --test-name-pattern="POS public pricing|dedicated pricing section|approved factual product journey" tests/pos-content.test.mjs
```

Expected: 3 matching tests PASS, zero failures.

- [ ] **Step 9: Run complete verification**

```bash
npm run verify
```

Expected: content tests, ESLint, TypeScript, contrast checks, and production build all PASS.

- [ ] **Step 10: Verify desktop and mobile rendering**

Start the successful production build:

```bash
npm run start
```

Inspect `/pos?lang=en`, `/pos?lang=zh-Hant`, and `/pos?lang=zh-Hans` at approximately 390px and 1440px. Confirm:

- core £19 and three included features are visible;
- eight £9 and two £19 add-ons are visible without horizontal scrolling;
- “No VAT added” / “不另收 VAT” appears near the CTA;
- call pop-up is absent;
- focus, text contrast, wrapping, and CTA remain usable;
- `/rota` still shows its existing contact-based `PricingCard`.

- [ ] **Step 11: Run independent review and clear every finding**

Run the independent reviewer with “read-only, do not modify files”, then run `/review` on the current diff. Review price completeness, multilingual drift, VAT accuracy, Rota regressions, accessibility, and unsupported claims. For any real finding, add a focused failing test, apply the smallest fix, rerun `npm run verify`, and repeat both reviews until no new findings remain.

- [ ] **Step 12: Recheck race signals and commit**

Immediately before staging, compare `git status`, upstream-ahead count, latest commit, and changed-file mtimes with the execution baseline. Stop without staging if unrelated new changes or commits appeared.

When clean:

```bash
git add lib/pos-content.ts components/PosPricingSection.tsx components/PosLanding.tsx tests/pos-content.test.mjs
git commit -m "feat: publish POS pricing"
```

Do not push without HONG’s approval.
