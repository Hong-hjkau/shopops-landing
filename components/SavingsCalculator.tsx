"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

// 呢個 block 係自包含嘅功能塊（slider + 即時計算 + 結算 UI，> 40 行），
// 跟 component-first 原則抽成獨立檔。佢只食 `lang` prop，自帶 zh/en 文案，
// 由 page.tsx 嘅同一個 lang state 驅動，維持全站雙語一致。
//
// 呢個只係一個「直接訂單」使用場景：餐廳自行輸入合約佣金率，
// 睇下可轉去自家落單嘅部分一年涉及幾多平台佣金。
//
// 注意：呢度刻意唔顯示 ShopOps 月費（網站已改成「請聯絡我們」報價），
// 所以「慳返」= 呢部分生意轉去自家落單後唔使俾平台嘅佣金，唔再減 ShopOps 月費。

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
  "zh-Hant": {
    eyebrow: "慳返平台抽佣",
    title: "估算可轉去自家落單部分的年度平台佣金",
    subtitle:
      "輸入你可轉去自家落單的營業額，以及你現時合約的佣金率，看看該部分的年度估算。",
    turnoverLabel: "每月外賣平台營業額（可以轉去自家落單嗰部分）",
    rateLabel: "平台抽佣率",
    rateHint: "請按你現時的平台合約輸入",
    resultLead: "這部分訂單的年度估算平台佣金",
    perYear: "／年",
    resultSub:
      "這是按你輸入的營業額和佣金率計算的估算，不包括任何其他費用。",
    cta: "預約 Demo，了解直接落單",
    disclaimer:
      "數字只供參考，按你輸入的金額和佣金率即時估算；實際平台收費視乎各自合約及可轉去自家落單的生意。透過你的 ShopOps 點餐渠道落單，ShopOps 不會收取佣金；信用卡付款處理費另計。",
  },
  "zh-Hans": {
    eyebrow: "省回平台抽佣",
    title: "估算可转去自家下单部分的年度平台佣金",
    subtitle:
      "输入你可转去自家下单的营业额，以及你现时合约的佣金率，看看该部分的年度估算。",
    turnoverLabel: "每月外卖平台营业额（可以转去自家下单的部分）",
    rateLabel: "平台抽佣率",
    rateHint: "请按你现时的平台合约输入",
    resultLead: "这部分订单的年度估算平台佣金",
    perYear: "／年",
    resultSub:
      "这是按你输入的营业额和佣金率计算的估算，不包括任何其他费用。",
    cta: "预约 Demo，了解直接下单",
    disclaimer:
      "数字仅供参考，按你输入的金额和佣金率即时估算；实际平台收费视乎各自合约及可转去自家下单的生意。通过你的 ShopOps 点餐渠道下单，ShopOps 不会收取佣金；信用卡付款处理费另计。",
  },
  en: {
    eyebrow: "Cut delivery commission",
    title: "Estimate annual platform commission on the direct-order share",
    subtitle:
      "Enter the turnover you could move to your own ordering and the rate in your current contract to estimate that portion's annual platform commission.",
    turnoverLabel: "Monthly delivery-app turnover (the share you can move to your own ordering)",
    rateLabel: "Platform commission rate",
    rateHint: "Set this to the rate in your current platform contract",
    resultLead: "Estimated annual platform commission on this portion",
    perYear: "/year",
    resultSub:
      "This estimate uses the turnover and rate you enter, and excludes all other fees.",
    cta: "Book a demo to discuss direct ordering",
    disclaimer:
      "Estimate only, based on the amount and rate you enter; actual platform fees depend on each contract and on how much business you can move to your own ordering. No ShopOps commission applies to orders placed through your own ShopOps ordering channels. Card-processing fees remain separate.",
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

  return (
    <section
      id="savings"
      className="px-4 sm:px-6 py-16 sm:py-24 bg-surface border-y border-border"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-semibold text-accent-strong uppercase tracking-wide mb-4">
            {t.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">{t.title}</h2>
          <p className="mt-4 text-text-secondary leading-relaxed max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="bg-bg border border-border rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="turnover" className="text-sm font-semibold text-text">
                  {t.turnoverLabel}
                </label>
                <span className="text-base font-bold text-text shrink-0 ml-3">
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
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label htmlFor="rate" className="text-sm font-semibold text-text">
                  {t.rateLabel}
                </label>
                <span className="text-base font-bold text-text shrink-0 ml-3">{rate}%</span>
              </div>
              <input
                id="rate"
                type="range"
                min={RATE_MIN}
                max={RATE_MAX}
                step={RATE_STEP}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <p className="mt-1 text-xs text-text-secondary">{t.rateHint}</p>
            </div>
          </div>

          {/* Result */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-text-secondary">{t.resultLead}</p>
              <p className="mt-1 text-4xl sm:text-5xl font-bold text-loss">
                {gbp.format(platformAnnual)}
                <span className="text-lg font-semibold text-text-secondary">{t.perYear}</span>
              </p>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">{t.resultSub}</p>
            </div>

            <div className="mt-8 text-center">
              <a
                href="#contact"
                className="inline-flex px-6 py-4 bg-accent text-on-accent rounded-xl font-bold text-base hover:bg-accent-hover transition"
              >
                {t.cta}
              </a>
            </div>

            <p className="mt-6 text-xs text-text-secondary text-center leading-relaxed">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
