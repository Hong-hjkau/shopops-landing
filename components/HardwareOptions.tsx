import { MonitorSmartphone, Printer } from "lucide-react";
import type { PosSharedContent } from "@/lib/pos-content";

export default function HardwareOptions({
  copy,
}: {
  copy: PosSharedContent["hardware"];
}) {
  return (
    <section id="hardware" className="bg-surface px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {copy.title}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-bg p-6 sm:p-8">
            <MonitorSmartphone aria-hidden="true" className="h-8 w-8 text-accent-strong" />
            <p className="mt-5 leading-7 text-text-secondary">{copy.existingDeviceCopy}</p>
          </article>
          <article className="rounded-2xl border border-border bg-bg p-6 sm:p-8">
            <Printer aria-hidden="true" className="h-8 w-8 text-accent-strong" />
            <p className="mt-5 leading-7 text-text-secondary">{copy.readyHardwareCopy}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
