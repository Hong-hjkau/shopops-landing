import { Check } from "lucide-react";
import type { PosSharedContent } from "@/lib/pos-content";

export default function PosBenefits({
  copy,
}: {
  copy: PosSharedContent["benefits"];
}) {
  return (
    <section id="benefits" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {copy.map((benefit) => (
          <div key={benefit} className="rounded-2xl border border-border bg-surface p-6">
            <Check aria-hidden="true" className="h-6 w-6 text-accent-strong" />
            <p className="mt-4 font-semibold leading-6 text-text">{benefit}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
