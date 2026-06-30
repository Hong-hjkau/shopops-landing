// 共享定價卡：三個產品 landing（POS / Rota / Reviewscope）共用同一個定價區。
// POS 有 features ✓ 清單，傳 `features` 就 render；Rota / Reviewscope 唔傳，淨係
// 標題 + 價錢 + CTA。只食一個 `pricing` 物件（各頁 `t.pricing`，雙語由各頁 lang 驅動）。

type PricingCardCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  trial: string;
  price: string;
  unit: string;
  cta: string;
  note: string;
  features?: readonly string[];
};

export default function PricingCard({ pricing }: { pricing: PricingCardCopy }) {
  const { eyebrow, title, subtitle, trial, price, unit, cta, note, features } = pricing;

  return (
    <section id="pricing" className="px-4 sm:px-6 py-16 sm:py-24">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">{subtitle}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="text-center">
            <span className="inline-block mb-4 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide">
              {trial}
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-gray-900">{price}</span>
              {unit && <span className="text-lg font-semibold text-gray-400">{unit}</span>}
            </div>
          </div>

          {features && features.length > 0 && (
            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-gray-700">
                  <span className="shrink-0 mt-0.5 text-green-600 font-bold" aria-hidden>
                    ✓
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 text-center">
            <a
              href="#contact"
              className="inline-flex w-full justify-center px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition"
            >
              {cta}
            </a>
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">{note}</p>
        </div>
      </div>
    </section>
  );
}
