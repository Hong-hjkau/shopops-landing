export default function PosSalePrice({
  originalPrice,
  currentPrice,
  monthlyUnit,
  mutedTextClass = "text-text-secondary",
  prominentStrike = false,
}: {
  originalPrice: string;
  currentPrice: string;
  monthlyUnit: string;
  mutedTextClass?: "text-text-secondary" | "text-hero-text-secondary" | "text-on-accent";
  prominentStrike?: boolean;
}) {
  return (
    <span data-pos-sale-price className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
      <del
        data-pos-sale-original
        className={`${prominentStrike ? "font-normal decoration-2" : "font-semibold"} ${mutedTextClass}`}
      >
        {originalPrice}
      </del>
      <span>{currentPrice}</span>
      <span data-pos-sale-unit className={`text-base font-semibold ${mutedTextClass}`}>{monthlyUnit}</span>
    </span>
  );
}
