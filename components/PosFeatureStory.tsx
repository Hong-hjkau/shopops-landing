import type { StaticImageData } from "next/image";
import PosImageDialog from "@/components/PosImageDialog";

export default function PosFeatureStory({
  image,
  alt,
  imageId,
  imageActionLabel,
  imageDialogCloseLabel,
  caption,
  title,
  description,
}: {
  image: StaticImageData;
  alt: string;
  imageId: string;
  imageActionLabel: string;
  imageDialogCloseLabel: string;
  caption: string;
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
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="p-6">
        <p className="text-sm font-semibold text-accent-strong">{caption}</p>
        <h3 className="mt-3 text-xl font-bold text-text">{title}</h3>
        <p className="mt-3 leading-7 text-text-secondary">{description}</p>
      </div>
    </article>
  );
}
