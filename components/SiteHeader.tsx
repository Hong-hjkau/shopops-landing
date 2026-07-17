"use client";

import Image from "next/image";
import { useLang } from "@/components/LangProvider";
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
}: {
  navLinks: NavLink[];
  cta: { href: string; label: string };
}) {
  const { lang, setLang } = useLang();

  return (
    <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="" width={512} height={496} className="h-8 w-auto" />
          <span className="font-bold text-text text-lg tracking-tight">ShopOps</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-text transition">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface rounded-full p-0.5 text-xs font-medium">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-3 py-1 rounded-full transition ${
                  // 當前語言用中性色，唔用橙 —— 橙留返畀 CTA，
                  // 一個語言掣搶咗主色會攤薄真正想人撳嘅嘢
                  lang === l.key ? "bg-border text-text" : "text-text-secondary hover:text-text"
                }`}
                aria-pressed={lang === l.key}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href={cta.href}
            className="hidden sm:inline-flex px-4 py-2 bg-accent text-on-accent text-sm font-semibold rounded-lg hover:bg-accent-hover transition"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
