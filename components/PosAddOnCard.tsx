import PosImageDialog, { type PosImageDialogProps } from "@/components/PosImageDialog";
import PosSalePrice from "@/components/PosSalePrice";

export default function PosAddOnCard({
  id,
  label,
  outcome,
  detail,
  originalMonthlyPrice,
  monthlyPrice,
  monthlyUnit,
  image,
}: {
  id: string;
  label: string;
  outcome: string;
  detail: string;
  originalMonthlyPrice: number;
  monthlyPrice: number;
  monthlyUnit: string;
  image?: PosImageDialogProps;
}) {
  return (
    <article id={id} className="rounded-2xl border border-border bg-surface p-6">
      {image ? <div className="-mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl"><PosImageDialog {...image} /></div> : null}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold text-text">{label}</h3>
        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-bold text-on-accent">
          <PosSalePrice
            originalPrice={`+£${originalMonthlyPrice}`}
            currentPrice={`+£${monthlyPrice}`}
            monthlyUnit={monthlyUnit}
            mutedTextClass="text-on-accent"
          />
        </span>
      </div>
      <p className="mt-4 font-semibold leading-6 text-text">{outcome}</p>
      <p className="mt-3 leading-7 text-text-secondary">{detail}</p>
    </article>
  );
}
