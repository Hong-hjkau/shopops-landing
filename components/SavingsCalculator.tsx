"use client";

import { useState } from "react";

// 呢個 block 係自包含嘅功能塊（slider + 即時計算 + 結算 UI，> 40 行），
// 跟 component-first 原則抽成獨立檔。佢只食 `lang` prop，自帶 zh/en 文案，
// 由 page.tsx 嘅同一個 lang state 驅動，維持全站雙語一致。
//
// 對比對象係「外賣平台抽佣」(Deliveroo/Uber Eats 25–35%、Just Eat 14–18%)，
// 唔係卡機過卡費 —— ShopOps 唔做卡機，過卡費轉咗都照俾，講卡機會誤導。
// ShopOps 慳到嘅係：引導熟客 / 回頭客去自家 QR / 外賣網落單，嗰部分唔使俾平台抽。
type Lang = "zh" | "en";

// ShopOps 固定月費（per venue）。改價只需要改呢一個常數。
const SHOPOPS_MONTHLY = 49;

// Slider 預設值 / 範圍（訪客自己調，避免 hardcode 任何平台嘅實際收費）
const TURNOVER_DEFAULT = 8000;
const TURNOVER_MIN = 1000;
const TURNOVER_MAX = 50000;
const TURNOVER_STEP = 500;

const RATE_DEFAULT = 27; // 訪客自己改；只係 slider 起點，唔係對任何平台嘅斷言
const RATE_MIN = 10;
const RATE_MAX = 35;
const RATE_STEP = 1;

const copy = {
  zh: {
    eyebrow: "慳返平台抽佣",
    title: "外賣平台每張單抽你兩三成？計下一年俾咗幾多",
    subtitle:
      "Deliveroo、Uber Eats 一張單抽 25–35%，Just Eat 都要 14–18%。熟客、回頭客其實唔需要經平台 —— 用 ShopOps 自家 QR 同外賣網落單，呢部分生意一蚊佣金都唔使俾。拉下面條 bar，睇下你一年慳幾多。",
    turnoverLabel: "每月外賣平台營業額（可以轉去自家落單嗰部分）",
    rateLabel: "平台抽佣率",
    rateHint: "Deliveroo / Uber Eats 約 25–35%，Just Eat 約 14–18%",
    resultLead: "你一年可以慳返",
    perYear: "／年",
    breakdownPlatform: "呢部分經平台一年抽走",
    breakdownShopops: "ShopOps 一年固定月費",
    noSaving:
      "就算呢個金額，ShopOps 都係一個固定月費、零交易抽佣 —— 賬單可預測，仲有 QR 點餐、員工 POS、離線後備一齊用。",
    cta: "預約 Demo，慳返呢筆",
    disclaimer:
      "數字只供參考，按你輸入嘅金額同抽佣率即時估算；實際平台收費以各自合約為準，亦視乎你有幾多生意可以轉去自家落單。ShopOps 以 £49／間／月計，不抽交易佣金（卡機過卡費仍由你嘅收單機構收取，與 ShopOps 無關）。",
  },
  en: {
    eyebrow: "Cut delivery commission",
    title: "Delivery apps taking 25–35% per order? See the yearly cost",
    subtitle:
      "Deliveroo and Uber Eats take 25–35% of every order; Just Eat 14–18%. Your regulars and repeat customers don't need the middleman — when they order through ShopOps' own QR and ordering site, you pay zero commission on that business. Drag the sliders to see your yearly saving.",
    turnoverLabel: "Monthly delivery-app turnover (the share you can move to your own ordering)",
    rateLabel: "Platform commission rate",
    rateHint: "Deliveroo / Uber Eats ~25–35%, Just Eat ~14–18%",
    resultLead: "You could save",
    perYear: "/year",
    breakdownPlatform: "Taken by the platform per year on this share",
    breakdownShopops: "ShopOps flat fee per year",
    noSaving:
      "Even at this amount, ShopOps is one flat monthly fee with zero per-order commission — predictable billing, plus QR ordering, staff POS and offline backup included.",
    cta: "Book a demo & keep this",
    disclaimer:
      "Estimate only, based on the amount and rate you enter; actual platform fees depend on each contract and on how much business you can move to your own ordering. ShopOps is £49/venue/month with no transaction commission (card-processing fees are still charged by your own acquirer, separate from ShopOps).",
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

  const platformAnnual = turnover * 12 * (rate / 100);
  const shopopsAnnual = SHOPOPS_MONTHLY * 12;
  const saving = platformAnnual - shopopsAnnual;

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
                <span className="text-base font-bold text-gray-900 shrink-0 ml-3">
                  {gbp.format(turnover)}
                </span>
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
                <span className="text-base font-bold text-gray-900 shrink-0 ml-3">{rate}%</span>
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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-gray-500">{t.breakdownPlatform}</p>
                <p className="mt-1 text-lg font-bold text-red-600">{gbp.format(platformAnnual)}</p>
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
