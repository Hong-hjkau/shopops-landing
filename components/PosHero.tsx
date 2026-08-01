import Image from "next/image";
import type { PosSharedContent } from "@/lib/pos-content";

export default function PosHero({
  copy,
}: {
  copy: PosSharedContent["hero"];
}) {
  return (
    <section id="top" className="relative overflow-hidden bg-black">
      <div
        aria-hidden="true"
        className="relative aspect-[16/9] w-full sm:absolute sm:inset-0 sm:aspect-auto"
      >
        <Image
          src="/pos-hero-wide.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left sm:object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-l from-black/70 via-black/25 to-transparent sm:block"
      />

      <div className="relative mx-auto grid max-w-6xl px-4 pb-14 sm:min-h-[34rem] sm:grid-cols-2 sm:items-center sm:px-6 sm:py-20">
        <div aria-hidden="true" className="hidden sm:block" />
        <div className="max-w-xl pt-8 sm:pt-0">
          <p className="text-sm font-semibold tracking-wide text-accent">{copy.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-hero-text sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-hero-text-secondary">{copy.subtitle}</p>
          <a
            href="#contact"
            className="glow-accent mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-bold text-on-accent transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
          >
            {copy.cta}
          </a>
          <p className="mt-4 text-sm leading-6 text-hero-text-secondary">{copy.reassurance}</p>
        </div>
      </div>
    </section>
  );
}
