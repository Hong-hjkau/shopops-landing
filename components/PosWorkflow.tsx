import Image from "next/image";
import orderEntry from "@/public/pos-demo/order-entry.webp";
import kitchenOrder from "@/public/pos-demo/kitchen-order.webp";
import floorProgress from "@/public/pos-demo/floor-progress.webp";
import checkoutReport from "@/public/pos-demo/checkout-report.webp";
import type { Lang } from "@/lib/i18n";
import type { PosSharedContent } from "@/lib/pos-content";

const WORKFLOW_IMAGES = [orderEntry, kitchenOrder, floorProgress, checkoutReport] as const;

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
                src={WORKFLOW_IMAGES[index]}
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
