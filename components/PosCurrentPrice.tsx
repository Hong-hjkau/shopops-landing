export default function PosCurrentPrice({
  currentPrice,
  monthlyUnit,
  mutedTextClass = "text-text-secondary",
}: {
  currentPrice: string;
  monthlyUnit: string;
  mutedTextClass?: "text-text-secondary" | "text-hero-text-secondary" | "text-on-accent";
}) {
  return (
    <span data-pos-current-price className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
      <span>{currentPrice}</span>
      <span data-pos-current-unit className={`text-base font-semibold ${mutedTextClass}`}>{monthlyUnit}</span>
    </span>
  );
}
