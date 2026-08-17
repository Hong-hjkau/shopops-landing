"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import SocialLinks from "@/components/SocialLinks";
import type { Lang } from "@/lib/i18n";

export type NavLink = { href: string; label: string };

const LANGS: { key: Lang; label: string }[] = [
  { key: "zh-Hant", label: "繁" },
  { key: "zh-Hans", label: "简" },
  { key: "en", label: "EN" },
];

export default function SiteHeader({
  navLinks,
  cta,
  languageHrefs,
}: {
  navLinks: NavLink[];
  cta: { href: string; label: string };
  languageHrefs?: Record<Lang, string>;
}) {
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-20 border-b border-hero-border bg-hero-bg/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          aria-label="ShopOps home"
          className="flex items-center gap-2 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
        >
          <Image src="/logo-icon.png" alt="" width={512} height={496} className="h-8 w-auto" />
          <span className="hidden text-lg font-bold tracking-tight text-hero-text sm:inline">
            ShopOps
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6 text-sm text-hero-text-secondary lg:gap-3 lg:text-xs xl:gap-6 xl:text-sm">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded transition hover:text-hero-text focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <SocialLinks dark compact />
          <div className="flex items-center rounded-full bg-white/10 p-0.5 text-xs font-medium ring-1 ring-white/10">
            {LANGS.map((l) => (
              languageHrefs ? (
                <Link
                  key={l.key}
                  href={languageHrefs[l.key]}
                  className={`rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg ${
                    lang === l.key
                      ? "bg-hero-text text-hero-bg"
                      : "text-hero-text-secondary hover:text-hero-text"
                  }`}
                  aria-current={lang === l.key ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`rounded-full px-3 py-1 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg ${
                    lang === l.key
                      ? "bg-hero-text text-hero-bg"
                      : "text-hero-text-secondary hover:text-hero-text"
                  }`}
                  aria-pressed={lang === l.key}
                >
                  {l.label}
                </button>
              )
            ))}
          </div>
          <a
            href={cta.href}
            className="hidden rounded-lg bg-hero-text px-4 py-2 text-sm font-semibold text-hero-bg transition hover:bg-hero-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg sm:inline-flex"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
