"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";

// 呢個 block 係自包含嘅功能塊（slider + 即時計算 + 結算 UI，> 40 行），
// 跟 component-first 原則抽成獨立檔。佢只食 `lang` prop，自帶 zh/en 文案，
// 由 page.tsx 嘅同一個 lang state 驅動，維持全站雙語一致。
//
// 對比對象係「外賣平台抽佣」(Deliveroo/Uber Eats 25–35%、Just Eat 14–17%)，
// 唔係卡機過卡費 —— ShopOps 唔做卡機，過卡費轉咗都照俾，講卡機會誤導。
// ShopOps 慳到嘅係：引導熟客 / 回頭客去自家 QR / 外賣網落單，嗰部分唔使俾平台抽。
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
    title: "外賣平台每張單抽你兩三成？計下一年俾咗幾多",
    subtitle:
      "Deliveroo、Uber Eats 一張單抽 25–35%，Just Eat 都要 14–17%。熟客、回頭客其實唔需要經平台 —— 用 ShopOps 自家 QR 同外賣網落單，呢部分生意一蚊佣金都唔使俾。拉下面條 bar，睇下你一年慳幾多。",
    turnoverLabel: "每月外賣平台營業額（可以轉去自家落單嗰部分）",
    rateLabel: "平台抽佣率",
    rateHint: "Deliveroo / Uber Eats 約 25–35%，Just Eat 約 14–17%",
    resultLead: "外賣平台一年抽走你",
    perYear: "／年",
    resultSub:
      "把熟客、回頭客轉去自家 QR／外賣網落單，呢部分生意一蚊佣金都唔使俾平台 —— 即係一年慳返呢筆。",
    cta: "預約 Demo，慳返呢筆",
    disclaimer:
      "數字只供參考，按你輸入嘅金額同抽佣率即時估算；實際平台收費以各自合約為準，亦視乎你有幾多生意可以轉去自家落單。ShopOps 收固定月費、不抽交易佣金（客人碌卡嗰個手續費仍由你嘅收款公司收，與 ShopOps 無關）。報價請聯絡我哋。",
  },
  "zh-Hans": {
    eyebrow: "省回平台抽佣",
    title: "外卖平台每张单抽你两三成？算算一年付了多少",
    subtitle:
      "Deliveroo、Uber Eats 一张单抽 25–35%，Just Eat 也要 14–17%。熟客、回头客其实不需要经平台 —— 用 ShopOps 自家 QR 和外卖网下单，这部分生意一分佣金都不用付。拉下面的滑块，看看你一年省多少。",
    turnoverLabel: "每月外卖平台营业额（可以转去自家下单的部分）",
    rateLabel: "平台抽佣率",
    rateHint: "Deliveroo / Uber Eats 约 25–35%，Just Eat 约 14–17%",
    resultLead: "外卖平台一年抽走你",
    perYear: "／年",
    resultSub:
      "把熟客、回头客转去自家 QR／外卖网下单，这部分生意一分佣金都不用付给平台 —— 也就是一年省回这笔。",
    cta: "预约 Demo，省回这笔",
    disclaimer:
      "数字仅供参考，按你输入的金额和抽佣率即时估算；实际平台收费以各自合约为准，也视乎你有多少生意可以转去自家下单。ShopOps 收固定月费、不抽交易佣金（顾客刷卡的手续费仍由你的收款公司收取，与 ShopOps 无关）。报价请联系我们。",
  },
  en: {
    eyebrow: "Cut delivery commission",
    title: "Delivery apps taking 25–35% per order? See the yearly cost",
    subtitle:
      "Deliveroo and Uber Eats take 25–35% of every order; Just Eat 14–17%. Your regulars and repeat customers don't need the middleman — when they order through ShopOps' own QR and ordering site, you pay zero commission on that business. Drag the sliders to see your yearly saving.",
    turnoverLabel: "Monthly delivery-app turnover (the share you can move to your own ordering)",
    rateLabel: "Platform commission rate",
    rateHint: "Deliveroo / Uber Eats ~25–35%, Just Eat ~14–17%",
    resultLead: "Platforms take from you each year",
    perYear: "/year",
    resultSub:
      "Move regulars and repeat customers to your own QR and ordering site and you pay zero commission on that business — that's what you keep each year.",
    cta: "Book a demo & keep this",
    disclaimer:
      "Estimate only, based on the amount and rate you enter; actual platform fees depend on each contract and on how much business you can move to your own ordering. ShopOps charges one flat monthly fee with no transaction commission (any card fee on customer payments still comes from your own card-payment provider, separate from ShopOps). Contact us for a quote.",
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
