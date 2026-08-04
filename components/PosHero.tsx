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
        className="relative aspect-[16/9] w-full lg:absolute lg:inset-0 lg:aspect-auto"
      >
        <Image
          src="/pos-hero-wide.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-left lg:object-center 2xl:object-contain 2xl:object-left"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-l from-black/70 via-black/25 to-transparent lg:block"
      />

      <div className="relative mx-auto grid max-w-6xl px-4 pb-14 sm:px-6 lg:min-h-[34rem] lg:grid-cols-2 lg:items-center lg:py-20">
        <div aria-hidden="true" className="hidden lg:block" />
        <div className="max-w-xl pt-8 lg:pt-0">
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
          <a
            href={copy.situationHref}
            className="mt-4 block w-fit text-sm font-semibold text-hero-text-secondary underline decoration-hero-text-secondary/50 underline-offset-4 transition hover:text-hero-text"
          >
            {copy.situationCta}
          </a>
          <p className="mt-4 text-sm leading-6 text-hero-text-secondary">{copy.reassurance}</p>
        </div>
      </div>
    </section>
  );
}
