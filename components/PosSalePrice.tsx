export default function PosSalePrice({
  currentPrice,
  monthlyUnit,
  mutedTextClass = "text-text-secondary",
}: {
  originalPrice: string;
  currentPrice: string;
  monthlyUnit: string;
  mutedTextClass?: "text-text-secondary" | "text-hero-text-secondary" | "text-on-accent";
  prominentStrike?: boolean;
}) {
  return (
    <span data-pos-sale-price className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
      <span>{currentPrice}</span>
      <span data-pos-sale-unit className={`text-base font-semibold ${mutedTextClass}`}>{monthlyUnit}</span>
    </span>
  );
}
