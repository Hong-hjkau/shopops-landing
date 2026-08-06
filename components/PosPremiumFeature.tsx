import PosImageDialog, { type PosImageDialogProps } from "@/components/PosImageDialog";

export default function PosPremiumFeature({
  id,
  eyebrow,
  title,
  body,
  monthlyPrice,
  monthlyUnit,
  benefits,
  boundary,
  bundleExamples,
  image,
}: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  monthlyPrice: number;
  monthlyUnit: string;
  benefits: readonly string[];
  boundary: string;
  bundleExamples: readonly string[];
  image?: PosImageDialogProps;
}) {
  return (
    <article id={id} className="rounded-2xl border border-accent/30 bg-surface p-6 sm:p-8">
      {image ? <div className="-mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl sm:-mx-8 sm:-mt-8"><PosImageDialog {...image} /></div> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">{eyebrow}</p>
          <h3 className="mt-3 text-2xl font-bold text-text">{title}</h3>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-on-accent">
          +£{monthlyPrice}{monthlyUnit}
        </span>
      </div>
      <p className="mt-4 leading-7 text-text-secondary">{body}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li key={benefit} className="rounded-xl bg-bg p-4 text-text">
            {benefit}
          </li>
        ))}
      </ul>
      <p className="mt-5 rounded-xl border border-border bg-bg p-4 text-sm leading-6 text-text-secondary">
        {boundary}
      </p>
      <ul className="mt-5 grid gap-2 font-semibold text-text">
        {bundleExamples.map((example) => <li key={example}>{example}</li>)}
      </ul>
    </article>
  );
}
