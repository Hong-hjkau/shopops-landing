import Image, { type StaticImageData } from "next/image";

export default function PosFeatureStory({
  image,
  alt,
  caption,
  title,
  description,
}: {
  image: StaticImageData;
  alt: string;
  caption: string;
  title: string;
  description: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <Image
        src={image}
        alt={alt}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="h-auto w-full border-b border-border"
      />
      <div className="p-6">
        <p className="text-sm font-semibold text-accent-strong">{caption}</p>
        <h2 className="mt-3 text-xl font-bold text-text">{title}</h2>
        <p className="mt-3 leading-7 text-text-secondary">{description}</p>
      </div>
    </article>
  );
}
