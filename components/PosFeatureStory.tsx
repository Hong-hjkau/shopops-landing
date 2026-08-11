import type { StaticImageData } from "next/image";
import PosImageDialog from "@/components/PosImageDialog";

export default function PosFeatureStory({
  image,
  alt,
  imageId,
  imageActionLabel,
  imageDialogCloseLabel,
  imageBadgeLabel,
  step,
  title,
  description,
}: {
  image: StaticImageData;
  alt: string;
  imageId: string;
  imageActionLabel: string;
  imageDialogCloseLabel: string;
  imageBadgeLabel: string;
  /** 流程次序（由落單到結帳）。核心功能卡冇次序，所以係選填。 */
  step?: number;
  title: string;
  description: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <PosImageDialog
        id={imageId}
        image={image}
        alt={alt}
        actionLabel={imageActionLabel}
        closeLabel={imageDialogCloseLabel}
        badgeLabel={imageBadgeLabel}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="p-6">
        <div className="flex items-center gap-3">
          {step === undefined ? null : (
            // 同 /pos 嘅 PosWorkflow 一樣嘅圓形序號，唔另創第三種步驟寫法。
            <span
              data-pos-step={step}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent"
            >
              {step}
            </span>
          )}
          <h3 className="text-xl font-bold text-text">{title}</h3>
        </div>
        <p className="mt-3 leading-7 text-text-secondary">{description}</p>
      </div>
    </article>
  );
}
