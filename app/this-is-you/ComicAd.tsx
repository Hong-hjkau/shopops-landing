"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Lang = "hant" | "hans" | "en";

const L: Record<Lang, { label: string; img: string; w: number; h: number; cta: string; sub: string; foot: string }> = {
  hant: {
    label: "繁",
    img: "/comic-hant.webp",
    w: 864,
    h: 1820,
    cta: "了解更多 / 預約 Demo →",
    sub: "免費試用 3 天 · 無合約 · 零抽佣",
    foot: "© 2026 ShopOps 店管家 · Edinburgh",
  },
  hans: {
    label: "简",
    img: "/comic-hans.webp",
    w: 864,
    h: 1821,
    cta: "了解更多 / 预约 Demo →",
    sub: "免费试用 3 天 · 无合约 · 零抽佣",
    foot: "© 2026 ShopOps 店管家 · Edinburgh",
  },
  en: {
    label: "EN",
    img: "/comic-en.webp",
    w: 876,
    h: 1796,
    cta: "Learn more / Book a Demo →",
    sub: "Free 3-day trial · No contract · No commission",
    foot: "© 2026 ShopOps · Edinburgh",
  },
};

const ORDER: Lang[] = ["hant", "hans", "en"];

export default function ComicAd() {
  const [lang, setLang] = useState<Lang>("hant");
  const t = L[lang];

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 pt-4 pb-12 bg-black"
      style={{ backgroundImage: "radial-gradient(120% 60% at 50% 0%, #2a1402 0%, #000 55%)" }}
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* 語言切換 */}
        <div className="flex gap-1 bg-white/10 rounded-full p-1 mb-4" role="group" aria-label="language">
          {ORDER.map((k) => (
            <button
              key={k}
              onClick={() => setLang(k)}
              aria-pressed={lang === k}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                // 橙底用黑字：白字得 2.80:1，連 AA-large 3:1 都 FAIL（全站一致）
                lang === k ? "bg-accent text-on-accent" : "text-gray-300 hover:text-white"
              }`}
            >
              {L[k].label}
            </button>
          ))}
        </div>

        <Image
          src={t.img}
          alt="小店老闆嘅日常煩惱：收工後文書做不完、買咗 POS 但功能唔啱用、日日重複悶到爆、要搵嘅資料太多做唔哂——店管家 ShopOps 度身訂造解決方案，營運智能化效率倍增"
          width={t.w}
          height={t.h}
          priority
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <Link
          href="/#contact"
          className="mt-7 px-10 py-4 bg-accent hover:bg-accent-hover text-on-accent text-lg font-bold rounded-xl transition"
        >
          {t.cta}
        </Link>
        <p className="mt-3.5 text-sm text-gray-400">{t.sub}</p>
        <footer className="mt-7 text-xs text-gray-500">{t.foot}</footer>
      </div>
    </main>
  );
}
