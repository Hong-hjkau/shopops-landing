import type { PosSharedContent } from "@/lib/pos-content";

export default function TrialJourney({
  copy,
}: {
  copy: PosSharedContent["trial"];
}) {
  return (
    <section id="trial" className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{copy.title}</h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-2">
          {copy.steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-2xl border border-border bg-surface p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-on-accent">
                {index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
