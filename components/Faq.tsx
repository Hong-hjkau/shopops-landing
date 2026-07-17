"use client";

import { useState } from "react";

// 純 UI accordion + FAQPage JSON-LD。文案（題目／答案）由 page.tsx 嘅三語 dict 傳入，
// 維持「dict 喺 page、可重用 UI 抽 component」嘅現有 pattern。
export type FaqItem = { q: string; a: string };

export default function Faq({
  title,
  items,
  schemaItems,
}: {
  title: string;
  items: readonly FaqItem[];
  // FAQPage schema 用嘅題目／答案。固定傳英文版入嚟（英文對本地 SEO 價值最大），
  // 同畫面顯示嘅 items（跟當前語言）分開。唔傳就 fallback 用顯示版。
  schemaItems?: readonly FaqItem[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  // SEO：FAQPage schema。client component render 出嘅 DOM Google 照爬。
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (schemaItems ?? items).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section id="faq" className="px-4 sm:px-6 py-16 sm:py-24 bg-surface border-y border-border">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text">{title}</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
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
                  <span className="font-semibold text-text">{it.q}</span>
                  <span
                    className={`shrink-0 text-accent-strong text-xl transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-5 -mt-1 text-text-secondary leading-relaxed text-sm sm:text-base">
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
