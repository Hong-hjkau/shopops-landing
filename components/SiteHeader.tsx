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
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="" width={512} height={496} className="h-8 w-auto" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">ShopOps</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-gray-900 transition">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 text-xs font-medium">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className={`px-3 py-1 rounded-full transition ${
                  lang === l.key ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                aria-pressed={lang === l.key}
              >
                {l.label}
              </button>
            ))}
          </div>
          <a
            href={cta.href}
            className="hidden sm:inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            {cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
