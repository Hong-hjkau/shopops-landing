import type { StaticImageData } from "next/image";
import PosAddOnCard from "@/components/PosAddOnCard";
import PosFeatureStory from "@/components/PosFeatureStory";
import type { PosImageDialogProps } from "@/components/PosImageDialog";
import PosPremiumFeature from "@/components/PosPremiumFeature";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import {
  POS_FEATURES_CONTENT,
  getPosFeatureAddOn,
  getPosFeaturePricing,
  getStandardPosFeatureAddOnPrice,
  getStandardPosFeatureAddOns,
  type PosFeaturesContent,
} from "@/lib/pos-features-content";
import { POS_CONTENT, type PosAddOnId } from "@/lib/pos-content";
import { POS_FEATURE_IMAGES } from "@/lib/pos-feature-images";
import type { Lang } from "@/lib/i18n";

const languageHrefs: Record<Lang, string> = {
  en: "/pos/features?lang=en",
  "zh-Hant": "/pos/features?lang=zh-Hant",
  "zh-Hans": "/pos/features?lang=zh-Hans",
};

const contactHrefs: Record<Lang, string> = {
  en: "/pos?lang=en#contact",
  "zh-Hant": "/pos?lang=zh-Hant#contact",
  "zh-Hans": "/pos?lang=zh-Hans#contact",
};

const workflowImages = [
  { id: "order-entry", image: POS_FEATURE_IMAGES["order-entry"] },
  { id: "kitchen-order", image: POS_FEATURE_IMAGES["kitchen-order"] },
  { id: "floor-progress", image: POS_FEATURE_IMAGES["floor-progress"] },
  { id: "checkout-report", image: POS_FEATURE_IMAGES["checkout-report"] },
] as const;

const coreImages = [
  { id: "bilingual", image: POS_FEATURE_IMAGES["bilingual"] },
  { id: "offline_backup", image: POS_FEATURE_IMAGES["offline_backup"] },
  { id: "menu_management", image: POS_FEATURE_IMAGES["menu_management"] },
  { id: "sold_out", image: POS_FEATURE_IMAGES["sold_out"] },
] as const;

// 三處要砌同一組 dialog props（premium 兩塊 + 自選加購一個 loop）。逐處手寫
// 六個 field 嘅話，加一個 prop 就要記住改三處 —— badgeLabel 就係咁樣險啲漏。
function buildDemoImage(
  copy: PosFeaturesContent,
  id: PosAddOnId,
  image: StaticImageData,
): PosImageDialogProps {
  return {
    id,
    image,
    alt: copy.addOns[id].imageAlt,
    actionLabel: copy.addOns[id].imageActionLabel,
    closeLabel: copy.imageDialogCloseLabel,
    badgeLabel: copy.demoImageBadge,
    sizes: "(max-width: 768px) 100vw, 50vw",
  };
}

const standardAddOnImages = {
  scheduling: POS_FEATURE_IMAGES["scheduling"],
  reservations: POS_FEATURE_IMAGES["reservations"],
  reviews: POS_FEATURE_IMAGES["reviews"],
  food_safety: POS_FEATURE_IMAGES["food_safety"],
  allergens: POS_FEATURE_IMAGES["allergens"],
  recipe_costing: POS_FEATURE_IMAGES["recipe_costing"],
  custom_domain: POS_FEATURE_IMAGES["custom_domain"],
  signage: POS_FEATURE_IMAGES["signage"],
  delivery: POS_FEATURE_IMAGES["delivery"],
  finance_inventory: POS_FEATURE_IMAGES["finance_inventory"],
} as const;

export default function PosFeaturesLanding({ lang }: { lang: Lang }) {
  const copy = POS_FEATURES_CONTENT[lang];
  const pricing = POS_CONTENT[lang].pricing;
  const featurePricing = getPosFeaturePricing(lang);
  const contactHref = contactHrefs[lang];
  const standardAddOns = getStandardPosFeatureAddOns(lang);
  const standardAddOnPrice = getStandardPosFeatureAddOnPrice(lang);
  const deliveryAddOn = getPosFeatureAddOn(lang, "delivery");
  const financeAddOn = getPosFeatureAddOn(lang, "finance_inventory");
  const recipeAddOn = getPosFeatureAddOn(lang, "recipe_costing");
  const trialReassurance = POS_CONTENT[lang].hero.reassurance;
  // 每個有截圖嘅 section 出一次，貼住圖 grid 上面。之前係逐張卡重複同一句
  // （core 區一連 4 次），噪音大而且四個 section 入面得兩個講過。
  const demoImageCaption = (
    <p data-pos-demo-caption className="mt-6 max-w-2xl text-sm leading-6 text-text-secondary">
      {copy.demoImageCaption}
    </p>
  );

  return (
    <main lang={lang} className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#workflow", label: copy.hero.corePriceLabel },
          { href: "#add-ons", label: copy.hero.standardAddOnPriceLabel },
          { href: "#advanced-operations", label: copy.premiumTitle },
          { href: "#good-to-know", label: copy.goodToKnowTitle },
        ] satisfies NavLink[]}
        cta={{ href: contactHref, label: pricing.cta }}
        languageHrefs={languageHrefs}
      />

      <section id="hero" className="bg-hero-bg px-4 py-16 text-hero-text sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{copy.hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{copy.hero.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-hero-text-secondary">{copy.hero.result}</p>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-hero-text-secondary">{copy.hero.body}</p>
          <div className="mx-auto mt-9 grid max-w-3xl gap-3">
            <div data-pos-price-tier="core" className="col-span-full rounded-2xl border border-hero-border bg-white/5 p-5">
              <p className="text-sm text-hero-text-secondary">{copy.hero.corePriceLabel}</p>
              <p className="mt-2 text-3xl font-bold">£{pricing.core.monthlyPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
            </div>
            <div data-pos-price-add-ons className="grid gap-3 sm:grid-cols-2">
              <div data-pos-price-tier="advanced-add-ons" className="rounded-2xl border border-hero-border bg-white/5 p-5">
                <p className="text-sm text-hero-text-secondary">{copy.hero.premiumAddOnPriceLabel}</p>
                <p className="mt-2 text-3xl font-bold">+£{deliveryAddOn.monthlyPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
              </div>
              <div data-pos-price-tier="standard-add-ons" className="rounded-2xl border border-hero-border bg-white/5 p-5">
                <p className="text-sm text-hero-text-secondary">{copy.hero.standardAddOnPriceLabel}</p>
                <p className="mt-2 text-3xl font-bold">+£{standardAddOnPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
              </div>
            </div>
          </div>
          {/* VAT 立場貼住第一次出現嘅價錢講，唔留到頁尾；文字用 canonical 來源，
              同 /pos 嘅 pricing section 一致，避免兩頁各寫一套。 */}
          <p data-pos-vat-note className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-hero-text-secondary">
            {pricing.vatNote}
          </p>
          <a data-pos-hero-cta href={contactHref} className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-bold text-on-accent transition hover:bg-accent-hover">
            {pricing.cta}
          </a>
          <p className="mt-4 text-sm text-hero-text-secondary">{trialReassurance}</p>
        </div>
      </section>

      <section id="workflow" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.workflow.title}</h2>
          </div>
          {demoImageCaption}
          <div data-pos-feature-grid className="mt-10 grid gap-6 md:grid-cols-2">
            {copy.workflow.stories.map((story, index) => (
              <PosFeatureStory
                key={story.title}
                image={workflowImages[index].image}
                alt={story.imageAlt}
                imageId={workflowImages[index].id}
                imageActionLabel={story.imageActionLabel}
                imageDialogCloseLabel={copy.imageDialogCloseLabel}
                imageBadgeLabel={copy.demoImageBadge}
                step={index + 1}
                title={story.title}
                description={story.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="core" className="border-y border-border bg-surface px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.core.title}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-text-secondary">{copy.core.eyebrow}</p>
          </div>
          {demoImageCaption}
          <div data-pos-feature-grid className="mt-10 grid gap-6 md:grid-cols-2">
            {copy.core.cards.map((card, index) => (
              <PosFeatureStory
                key={card.title}
                image={coreImages[index].image}
                alt={card.imageAlt}
                imageId={coreImages[index].id}
                imageActionLabel={card.imageActionLabel}
                imageDialogCloseLabel={copy.imageDialogCloseLabel}
                imageBadgeLabel={copy.demoImageBadge}
                title={card.title}
                description={card.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="advanced-operations" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.premiumTitle}</h2>
          {demoImageCaption}
          <div data-pos-feature-grid className="mt-10 grid gap-6 md:grid-cols-2">
            <PosPremiumFeature
              id="delivery"
              eyebrow={copy.delivery.eyebrow}
              title={deliveryAddOn.label}
              body={copy.delivery.body}
              monthlyPrice={deliveryAddOn.monthlyPrice}
              monthlyUnit={pricing.monthlyUnit}
              benefits={copy.delivery.benefits}
              boundary={`${copy.delivery.cashOnly} ${copy.delivery.onlinePaymentBoundary}`}
              bundleExamples={[`${copy.hero.corePriceLabel} + ${deliveryAddOn.label}: £${featurePricing.corePlusDelivery}${pricing.monthlyUnit}`]}
              image={buildDemoImage(copy, "delivery", POS_FEATURE_IMAGES["delivery"])}
            />
            <PosPremiumFeature
              id="finance"
              eyebrow={copy.finance.eyebrow}
              title={financeAddOn.label}
              body={copy.finance.body}
              monthlyPrice={financeAddOn.monthlyPrice}
              monthlyUnit={pricing.monthlyUnit}
              benefits={copy.finance.benefits}
              boundary={`${copy.finance.recipeBoundary} ${copy.finance.hmrcBoundary}`}
              bundleExamples={[
                `${copy.hero.corePriceLabel} + ${financeAddOn.label}: £${featurePricing.corePlusFinance}${pricing.monthlyUnit}`,
                `${copy.hero.corePriceLabel} + ${financeAddOn.label} + ${recipeAddOn.label}: £${featurePricing.corePlusFinanceAndRecipe}${pricing.monthlyUnit}`,
              ]}
              image={buildDemoImage(copy, "finance_inventory", POS_FEATURE_IMAGES["finance_inventory"])}
            />
          </div>
        </div>
      </section>

      <section id="add-ons" className="border-y border-border bg-surface px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.hero.standardAddOnPriceLabel}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">{pricing.addOnsRequirement}</p>
          <p className="mt-2 max-w-2xl leading-7 text-text-secondary">{pricing.addOnsBillingNote}</p>
          {demoImageCaption}
          <div data-pos-feature-grid className="mt-10 grid gap-5 md:grid-cols-2">
            {standardAddOns.map((item) => (
              <PosAddOnCard
                key={item.id}
                id={item.id}
                label={item.label}
                outcome={copy.addOns[item.id].outcome}
                detail={copy.addOns[item.id].body}
                monthlyPrice={item.monthlyPrice}
                monthlyUnit={pricing.monthlyUnit}
                image={buildDemoImage(copy, item.id, standardAddOnImages[item.id])}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="feature-help" className="bg-bg px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text">{copy.midCta.title}</h2>
          <p className="mt-4 leading-7 text-text-secondary">{copy.midCta.body}</p>
          <a href={contactHref} className="mt-7 inline-flex rounded-xl bg-accent px-6 py-3 font-bold text-on-accent transition hover:bg-accent-hover">
            {copy.midCta.cta}
          </a>
          <p className="mt-4 text-sm text-text-secondary">{trialReassurance}</p>
        </div>
      </section>

      <section id="good-to-know" className="border-y border-border bg-surface px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-text">{copy.goodToKnowTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              copy.goodToKnow.collection,
              copy.goodToKnow.delivery,
              // 卡付款邊界用 canonical 來源，同 /pos 嘅 pricing section 同一句。
              pricing.feeNote,
              copy.goodToKnow.invoiceVat,
            ].map((item) => <li key={item} className="rounded-xl bg-bg p-5 text-text">{item}</li>)}
          </ul>
        </div>
      </section>

      <section id="final-cta" className="bg-hero-bg px-4 py-16 text-center text-hero-text sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{copy.finalCta.title}</h2>
          <p className="mt-4 leading-7 text-hero-text-secondary">{copy.finalCta.body}</p>
          <ul className="mx-auto mt-5 grid max-w-2xl gap-2 text-sm font-semibold text-hero-text-secondary">
            <li>{copy.hero.corePriceLabel} + {deliveryAddOn.label}: £{featurePricing.corePlusDelivery}{pricing.monthlyUnit}</li>
            <li>{copy.hero.corePriceLabel} + {financeAddOn.label} + {recipeAddOn.label}: £{featurePricing.corePlusFinanceAndRecipe}{pricing.monthlyUnit}</li>
          </ul>
          <a href={contactHref} className="mt-7 inline-flex rounded-xl bg-accent px-6 py-3 font-bold text-on-accent transition hover:bg-accent-hover">
            {pricing.cta}
          </a>
          <p className="mt-4 text-sm text-hero-text-secondary">{trialReassurance}</p>
        </div>
      </section>
    </main>
  );
}
