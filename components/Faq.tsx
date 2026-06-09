"use client";

import { useState } from "react";

// 純 UI accordion + FAQPage JSON-LD。文案（題目／答案）由 page.tsx 嘅三語 dict 傳入，
// 維持「dict 喺 page、可重用 UI 抽 component」嘅現有 pattern。
export type FaqItem = { q: string; a: string };

export default function Faq({ title, items }: { title: string; items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  // SEO：FAQPage schema。client component render 出嘅 DOM Google 照爬，
  // 跟住目前語言出（英文版有最大本地搜尋價值）。
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id="faq" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((it, idx) => {
            const isOpen = open === idx;
            return (
              <div key={it.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900">{it.q}</span>
                  <span
                    className={`shrink-0 text-orange-500 text-xl transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 -mt-1 text-gray-600 leading-relaxed text-sm sm:text-base">
                    {it.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
