"use client";

import { useState } from "react";
import Image from "next/image";

type Lang = "hant" | "hans" | "en";

const L: Record<Lang, { label: string; img: string; cta: string; sub: string; foot: string }> = {
  hant: {
    label: "繁",
    img: "/comic-hant.webp",
    cta: "了解更多 / 預約 Demo →",
    sub: "免費試用 1 天 · 無合約 · 零抽佣",
    foot: "© 2026 ShopOps 店管家 · Edinburgh",
  },
  hans: {
    label: "简",
    img: "/comic-hans.webp",
    cta: "了解更多 / 预约 Demo →",
    sub: "免费试用 1 天 · 无合约 · 零抽佣",
    foot: "© 2026 ShopOps 店管家 · Edinburgh",
  },
  en: {
    label: "EN",
    img: "/comic-en.webp",
    cta: "Learn more / Book a Demo →",
    sub: "Free 1-day trial · No contract · No commission",
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
                lang === k ? "bg-orange-500 text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              {L[k].label}
            </button>
          ))}
        </div>

        <Image
          src={t.img}
          alt="餐廳老闆嘅日常煩惱：外賣平台抽三成佣金、夜晚對數做報表估唔到邊樣賺錢、一堆系統各自為政、食安過敏原驚出事——原來一個 ShopOps app 就搞掂晒"
          width={1024}
          height={1536}
          priority
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <a
          href="/#contact"
          className="mt-7 px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-xl transition"
        >
          {t.cta}
        </a>
        <p className="mt-3.5 text-sm text-gray-400">{t.sub}</p>
        <footer className="mt-7 text-xs text-gray-500">{t.foot}</footer>
      </div>
    </main>
  );
}
