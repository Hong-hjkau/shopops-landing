import Image from "next/image";
import type { PosSharedContent } from "@/lib/pos-content";

export default function PosHero({
  copy,
}: {
  copy: PosSharedContent["hero"];
}) {
  return (
    <section id="top" className="bg-hero-bg px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 sm:items-center sm:gap-16">
        <div className="flex justify-center sm:justify-start">
          <Image
            src="/logo.png"
            alt="ShopOps"
            width={880}
            height={495}
            priority
            className="glow-accent h-auto w-full max-w-sm"
          />
        </div>

        <div className="max-w-xl">
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
