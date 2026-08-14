import type { PosSharedContent } from "@/lib/pos-content";
import PosSalePrice from "@/components/PosSalePrice";

type PosPricingCopy = PosSharedContent["pricing"];

export default function PosPricingSection({
  copy,
  trial,
  detailsHref,
  detailsLabel,
}: {
  copy: PosPricingCopy;
  trial: string;
  detailsHref: string;
  detailsLabel: string;
}) {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-text-secondary">
            {copy.body}
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-accent/30 bg-surface p-6 sm:p-8">
          <div className="text-center">
            <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-strong">
              {trial}
            </span>
            <h3 className="mt-5 text-xl font-bold text-text">{copy.core.name}</h3>
            <div className="mt-2 text-4xl font-bold text-text">
              <PosSalePrice
                originalPrice={`£${copy.core.originalMonthlyPrice}`}
                currentPrice={`£${copy.core.monthlyPrice}`}
                monthlyUnit={copy.monthlyUnit}
              />
            </div>
          </div>

          <p className="mt-7 text-sm font-semibold text-text">{copy.includedLabel}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {copy.core.included.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl bg-bg p-4 text-text"
              >
                <span aria-hidden className="font-bold text-success">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-center text-2xl font-bold text-text">{copy.addOnsTitle}</h3>
          <p className="mt-2 text-center text-sm text-text-secondary">
            {copy.addOnsRequirement}
          </p>
          <p className="mt-1 text-center text-sm text-text-secondary">
            {copy.addOnsBillingNote}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {copy.addOnGroups.map((group) => (
              <div
                key={group.monthlyPrice}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-sm font-semibold text-text-secondary">
                  {copy.perItemLabel}
                </p>
                <p className="text-2xl font-bold text-text">
                  <PosSalePrice
                    originalPrice={`£${group.originalMonthlyPrice}`}
                    currentPrice={`£${group.monthlyPrice}`}
                    monthlyUnit={copy.monthlyUnit}
                  />
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 text-text">
                      <span className="flex min-w-0 items-start gap-3">
                        <span aria-hidden className="text-success">✓</span>
                        <span>{item.label}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-text">
                        <PosSalePrice
                          originalPrice={`£${group.originalMonthlyPrice}`}
                          currentPrice={`£${group.monthlyPrice}`}
                          monthlyUnit={copy.monthlyUnit}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href={detailsHref} className="text-sm font-semibold text-accent-strong underline underline-offset-4">
            {detailsLabel}
          </a>
        </div>

        <div className="mt-8 text-center">
          <a
            href="#contact"
            className="inline-flex w-full justify-center rounded-xl bg-accent px-6 py-4 text-base font-bold text-on-accent transition hover:bg-accent-hover sm:w-auto"
          >
            {copy.cta}
          </a>
          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{copy.vatNote}</p>
          <p className="mt-2 text-xs leading-relaxed text-text-secondary">{copy.feeNote}</p>
        </div>
      </div>
    </section>
  );
}
