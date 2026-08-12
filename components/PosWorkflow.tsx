import Image from "next/image";
import { POS_FEATURE_IMAGES, type PosFeatureImageId } from "@/lib/pos-feature-images";
import type { Lang } from "@/lib/i18n";
import type { PosSharedContent } from "@/lib/pos-content";

// 呢四張圖同 `/pos/features` 係同一批資產。喺呢度直接 import 資產檔嘅話，換圖
// 只會換到經 image map 嗰頁，`/pos` 同首頁會靜靜留喺舊圖，所以一律經 map 查。
// `satisfies` 令打錯一個 id 即刻 tsc 紅。
const WORKFLOW_IMAGE_IDS = [
  "order-entry", "kitchen-order", "floor-progress", "checkout-report",
] as const satisfies readonly PosFeatureImageId[];

export default function PosWorkflow({
  copy,
  lang,
}: {
  copy: PosSharedContent["workflow"];
  lang: Lang;
}) {
  const altPrefix = lang === "en" ? "ShopOps POS: " : "ShopOps POS：";

  return (
    <section id="workflow" className="bg-surface px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {copy.title}
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2">
          {copy.steps.map((step, index) => (
            <li key={step} className="overflow-hidden rounded-2xl border border-border bg-bg shadow-sm">
              <Image
                src={POS_FEATURE_IMAGES[WORKFLOW_IMAGE_IDS[index]]}
                alt={`${altPrefix}${step}`}
                sizes="(max-width: 640px) 100vw, 50vw"
                className="h-auto w-full border-b border-border"
              />
              <div className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
                  {index + 1}
                </span>
                <p className="font-semibold text-text">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
