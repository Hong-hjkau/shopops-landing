export default function PosAddOnCard({
  id,
  label,
  outcome,
  detail,
  monthlyPrice,
  monthlyUnit,
}: {
  id: string;
  label: string;
  outcome: string;
  detail: string;
  monthlyPrice: number;
  monthlyUnit: string;
}) {
  return (
    <article id={id} className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-text">{label}</h3>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-on-accent">
          +£{monthlyPrice}{monthlyUnit}
        </span>
      </div>
      <p className="mt-4 font-semibold leading-6 text-text">{outcome}</p>
      <p className="mt-3 leading-7 text-text-secondary">{detail}</p>
    </article>
  );
}
