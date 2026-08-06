import orderEntry from "@/public/pos-demo/order-entry.webp";
import kitchenOrder from "@/public/pos-demo/kitchen-order.webp";
import floorProgress from "@/public/pos-demo/floor-progress.webp";
import checkoutReport from "@/public/pos-demo/checkout-report.webp";
import PosAddOnCard from "@/components/PosAddOnCard";
import PosFeatureStory from "@/components/PosFeatureStory";
import PosPremiumFeature from "@/components/PosPremiumFeature";
import SiteHeader, { type NavLink } from "@/components/SiteHeader";
import {
  POS_FEATURES_CONTENT,
  getPosFeatureAddOn,
  getPosFeaturePricing,
  getStandardPosFeatureAddOnPrice,
  getStandardPosFeatureAddOns,
} from "@/lib/pos-features-content";
import { POS_CONTENT } from "@/lib/pos-content";
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

const workflowImages = [orderEntry, kitchenOrder, floorProgress, checkoutReport] as const;

export default function PosFeaturesLanding({ lang }: { lang: Lang }) {
  const copy = POS_FEATURES_CONTENT[lang];
  const pricing = POS_CONTENT[lang].pricing;
  const featurePricing = getPosFeaturePricing(lang);
  const contactHref = contactHrefs[lang];
  const storyAltPrefix = lang === "en" ? "ShopOps POS: " : "ShopOps POS：";
  const standardAddOns = getStandardPosFeatureAddOns(lang);
  const standardAddOnPrice = getStandardPosFeatureAddOnPrice(lang);
  const deliveryAddOn = getPosFeatureAddOn(lang, "delivery");
  const financeAddOn = getPosFeatureAddOn(lang, "finance_inventory");
  const recipeAddOn = getPosFeatureAddOn(lang, "recipe_costing");
  const trialReassurance = POS_CONTENT[lang].hero.reassurance;

  return (
    <main lang={lang} className="flex flex-col">
      <SiteHeader
        navLinks={[
          { href: "#workflow", label: copy.hero.corePriceLabel },
          { href: "#add-ons", label: copy.hero.standardAddOnPriceLabel },
          { href: "#delivery", label: copy.delivery.eyebrow },
          { href: "#finance", label: copy.finance.eyebrow },
        ] satisfies NavLink[]}
        cta={{ href: contactHref, label: pricing.cta }}
        languageHrefs={languageHrefs}
      />

      <section className="bg-hero-bg px-4 py-16 text-hero-text sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{copy.hero.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{copy.hero.title}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-hero-text-secondary">{copy.hero.result}</p>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-hero-text-secondary">{copy.hero.body}</p>
          <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-hero-border bg-white/5 p-5">
              <p className="text-sm text-hero-text-secondary">{copy.hero.corePriceLabel}</p>
              <p className="mt-2 text-3xl font-bold">£{pricing.core.monthlyPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
            </div>
            <div className="rounded-2xl border border-hero-border bg-white/5 p-5">
              <p className="text-sm text-hero-text-secondary">{copy.hero.standardAddOnPriceLabel}</p>
              <p className="mt-2 text-3xl font-bold">+£{standardAddOnPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
            </div>
            <div className="rounded-2xl border border-hero-border bg-white/5 p-5">
              <p className="text-sm text-hero-text-secondary">{copy.hero.premiumAddOnPriceLabel}</p>
              <p className="mt-2 text-3xl font-bold">+£{deliveryAddOn.monthlyPrice}<span className="text-base">{pricing.monthlyUnit}</span></p>
            </div>
          </div>
          <a href={contactHref} className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-bold text-on-accent transition hover:bg-accent-hover">
            {pricing.cta}
          </a>
          <p className="mt-4 text-sm text-hero-text-secondary">{trialReassurance}</p>
        </div>
      </section>

      <section id="workflow" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.workflow.title}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.workflow.stories.map((story, index) => (
              <PosFeatureStory
                key={story.title}
                image={workflowImages[index]}
                alt={`${storyAltPrefix}${story.title}`}
                caption={`${index + 1} · ${copy.workflow.caption}`}
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
            <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{copy.core.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.core.title}</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {copy.core.cards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-bg p-6">
                <h3 className="text-xl font-bold text-text">{card.title}</h3>
                <p className="mt-3 leading-7 text-text-secondary">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="add-ons" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.hero.standardAddOnPriceLabel}</h2>
          <p className="mt-4 max-w-2xl leading-7 text-text-secondary">{pricing.addOnsRequirement}</p>
          <p className="mt-2 max-w-2xl leading-7 text-text-secondary">{pricing.addOnsBillingNote}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {standardAddOns.map((item) => (
              <PosAddOnCard
                key={item.id}
                id={item.id}
                label={item.label}
                outcome={copy.addOns[item.id].outcome}
                detail={copy.addOns[item.id].body}
                monthlyPrice={item.monthlyPrice}
                monthlyUnit={pricing.monthlyUnit}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text">{copy.midCta.title}</h2>
          <p className="mt-4 leading-7 text-text-secondary">{copy.midCta.body}</p>
          <a href={contactHref} className="mt-7 inline-flex rounded-xl bg-accent px-6 py-3 font-bold text-on-accent transition hover:bg-accent-hover">
            {copy.midCta.cta}
          </a>
          <p className="mt-4 text-sm text-text-secondary">{trialReassurance}</p>
        </div>
      </section>

      <section className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.premiumTitle}</h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
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
            />
          </div>
        </div>
      </section>

      <section id="good-to-know" className="border-y border-border bg-surface px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-text">{copy.goodToKnowTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {copy.goodToKnow.map((item) => <li key={item} className="rounded-xl bg-bg p-5 text-text">{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="bg-hero-bg px-4 py-16 text-center text-hero-text sm:px-6 sm:py-24">
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
