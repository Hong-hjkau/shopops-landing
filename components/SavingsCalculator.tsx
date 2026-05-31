"use client";

import { useState } from "react";

// 呢個 block 係自包含嘅功能塊（slider + 即時計算 + 結算 UI，> 40 行），
// 跟 component-first 原則抽成獨立檔。佢只食 `lang` prop，自帶 zh/en 文案，
// 由 page.tsx 嘅同一個 lang state 驅動，維持全站雙語一致。
type Lang = "zh" | "en";

// ShopOps 固定月費（per venue）。改價只需要改呢一個常數。
const SHOPOPS_MONTHLY = 49;

// Slider 預設值 / 範圍（全部訪客可調，避免 hardcode 任何對手嘅實際收費）
const TURNOVER_DEFAULT = 30000;
const TURNOVER_MIN = 5000;
const TURNOVER_MAX = 150000;
const TURNOVER_STEP = 1000;

const RATE_DEFAULT = 1.6; // 訪客自己改；只係 slider 起點，唔係對任何供應商嘅斷言
const RATE_MIN = 0.5;
const RATE_MAX = 3;
const RATE_STEP = 0.1;

const FEES_DEFAULT = 75;
const FEES_MIN = 0;
const FEES_MAX = 300;
const FEES_STEP = 5;

const copy = {
  zh: {
    eyebrow: "慳返佣金",
    title: "每筆交易都被抽佣？計下你一年俾咗幾多",
    subtitle:
      "好多 POS 同落單平台用「低月費」做招徠，但每筆刷卡都靜靜抽你佣金。ShopOps 一個固定月費，刷幾多都唔抽佣。拉下面條 bar，睇下你一年可以慳幾多。",
    turnoverLabel: "每月刷卡營業額",
    rateLabel: "你現用供應商嘅交易佣金率",
    rateHint: "英國一般介乎 1.4%–2.5%",
    feesLabel: "你現付嘅固定月費（帳戶費 + 機租）",
    resultLead: "你一年可以慳返",
    perYear: "／年",
    breakdownCompetitor: "佣金制供應商一年約",
    breakdownCommission: "當中淨係佣金就佔",
    breakdownShopops: "ShopOps 一年固定",
    noSaving:
      "就算喺呢個佣金率，ShopOps 都係固定收費、零交易抽佣 —— 賬單可預測，仲送離線後備。",
    cta: "預約 Demo，慳返呢筆",
    disclaimer:
      "數字只供參考，按你輸入嘅佣金率同營業額即時估算；實際收費以各供應商報價為準。ShopOps 以 £49／間／月計，不抽交易佣金。",
  },
  en: {
    eyebrow: "Stop paying commission",
    title: "Charged on every sale? See what it costs you a year",
    subtitle:
      "Many POS and ordering platforms lure you in with a “low monthly fee”, then quietly take a cut of every card payment. ShopOps is one flat monthly fee — no commission, no matter how much you take. Drag the sliders to see your yearly saving.",
    turnoverLabel: "Monthly card turnover",
    rateLabel: "Your current provider's transaction rate",
    rateHint: "Typically 1.4%–2.5% in the UK",
    feesLabel: "Your current fixed monthly fees (account + terminal)",
    resultLead: "You could save",
    perYear: "/year",
    breakdownCompetitor: "Commission-based provider, per year ≈",
    breakdownCommission: "Commission alone accounts for",
    breakdownShopops: "ShopOps, flat per year",
    noSaving:
      "Even at this rate, ShopOps is a flat fee with zero per-sale commission — predictable billing, plus offline backup included.",
    cta: "Book a demo & keep this",
    disclaimer:
      "Estimate only, based on the rate and turnover you enter; actual costs depend on each provider's quote. ShopOps is £49/venue/month with no transaction commission.",
  },
} as const;

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function SavingsCalculator({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [turnover, setTurnover] = useState(TURNOVER_DEFAULT);
  const [rate, setRate] = useState(RATE_DEFAULT);
  const [fees, setFees] = useState(FEES_DEFAULT);

  const commissionAnnual = turnover * 12 * (rate / 100);
  const competitorAnnual = commissionAnnual + fees * 12;
  const shopopsAnnual = SHOPOPS_MONTHLY * 12;
  const saving = competitorAnnual - shopopsAnnual;

  return (
    <section
      id="savings"
      className="px-4 sm:px-6 py-16 sm:py-24 bg-gray-50 border-y border-gray-100"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-4">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="turnover" className="text-sm font-semibold text-gray-700">
                  {t.turnoverLabel}
                </label>
                <span className="text-base font-bold text-gray-900">{gbp.format(turnover)}</span>
              </div>
              <input
                id="turnover"
                type="range"
                min={TURNOVER_MIN}
                max={TURNOVER_MAX}
                step={TURNOVER_STEP}
                value={turnover}
                onChange={(e) => setTurnover(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="rate" className="text-sm font-semibold text-gray-700">
                  {t.rateLabel}
                </label>
                <span className="text-base font-bold text-gray-900">{rate.toFixed(1)}%</span>
              </div>
              <input
                id="rate"
                type="range"
                min={RATE_MIN}
                max={RATE_MAX}
                step={RATE_STEP}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="mt-1 text-xs text-gray-400">{t.rateHint}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="fees" className="text-sm font-semibold text-gray-700">
                  {t.feesLabel}
                </label>
                <span className="text-base font-bold text-gray-900">{gbp.format(fees)}</span>
              </div>
              <input
                id="fees"
                type="range"
                min={FEES_MIN}
                max={FEES_MAX}
                step={FEES_STEP}
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
            </div>
          </div>

          {/* Result */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            {saving > 0 ? (
              <div className="text-center">
                <p className="text-sm text-gray-500">{t.resultLead}</p>
                <p className="mt-1 text-4xl sm:text-5xl font-bold text-green-600">
                  {gbp.format(saving)}
                  <span className="text-lg font-semibold text-gray-400">{t.perYear}</span>
                </p>
              </div>
            ) : (
              <p className="text-center text-gray-600 leading-relaxed">{t.noSaving}</p>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-gray-500">{t.breakdownCompetitor}</p>
                <p className="mt-1 text-lg font-bold text-red-600">{gbp.format(competitorAnnual)}</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-gray-500">{t.breakdownCommission}</p>
                <p className="mt-1 text-lg font-bold text-red-600">{gbp.format(commissionAnnual)}</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                <p className="text-gray-500">{t.breakdownShopops}</p>
                <p className="mt-1 text-lg font-bold text-green-600">{gbp.format(shopopsAnnual)}</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <a
                href="#contact"
                className="inline-flex px-6 py-4 bg-orange-500 text-white rounded-xl font-bold text-base hover:bg-orange-600 transition"
              >
                {t.cta}
              </a>
            </div>

            <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
