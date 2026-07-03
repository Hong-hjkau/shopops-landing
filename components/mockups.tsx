import type { Lang } from "@/lib/i18n";

export function SafetyMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      title: "🧾 食安日誌 · 今日",
      badge: "✓ 已簽核",
      rows: [
        { icon: "🌅", label: "開店清單", value: "8/8 完成" },
        { icon: "🌡️", label: "雪櫃 2.8°C · 冰格 −18.2°C", value: "正常" },
        { icon: "🌙", label: "收店清單 + 簽名", value: "陳師傅" },
      ],
      footer: "📄 EHO 檢查？一撳匯出 PDF",
    },
    "zh-Hans": {
      title: "🧾 食安日志 · 今日",
      badge: "✓ 已签核",
      rows: [
        { icon: "🌅", label: "开店清单", value: "8/8 完成" },
        { icon: "🌡️", label: "冰箱 2.8°C · 冷冻 −18.2°C", value: "正常" },
        { icon: "🌙", label: "收店清单 + 签名", value: "陈师傅" },
      ],
      footer: "📄 EHO 检查？一键导出 PDF",
    },
    en: {
      title: "🧾 Food safety · Today",
      badge: "✓ Signed off",
      rows: [
        { icon: "🌅", label: "Opening checks", value: "8/8 done" },
        { icon: "🌡️", label: "Fridge 2.8°C · Freezer −18.2°C", value: "OK" },
        { icon: "🌙", label: "Closing checks + sign-off", value: "Chef Chan" },
      ],
      footer: "📄 EHO visit? Export PDF in one tap",
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800">{t.title}</span>
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
          {t.badge}
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {t.rows.map((row) => (
          <div key={row.label} className="px-3 py-2 flex items-center gap-2">
            <span className="text-base">{row.icon}</span>
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{row.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-semibold flex-shrink-0">
              {row.value}
            </span>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 font-medium">
        {t.footer}
      </div>
    </div>
  );
}

export function MarginMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      step1: "📸 影低供應商發票",
      step1Badge: "AI 已入帳",
      step2: "雞髀肉",
      step2Change: "£3.80 → £4.20/kg",
      step2Badge: "自動更新",
      step3: "照燒雞髀飯 £9.50",
      step3Badge: "毛利 62%",
    },
    "zh-Hans": {
      step1: "📸 拍下供应商发票",
      step1Badge: "AI 已入账",
      step2: "鸡腿肉",
      step2Change: "£3.80 → £4.20/kg",
      step2Badge: "自动更新",
      step3: "照烧鸡腿饭 £9.50",
      step3Badge: "毛利 62%",
    },
    en: {
      step1: "📸 Snap the supplier invoice",
      step1Badge: "Logged by AI",
      step2: "Chicken thigh",
      step2Change: "£3.80 → £4.20/kg",
      step2Badge: "Auto-updated",
      step3: "Teriyaki chicken rice £9.50",
      step3Badge: "62% margin",
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-3 space-y-1">
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-800">{t.step1}</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-bold">
          {t.step1Badge}
        </span>
      </div>
      <div className="text-center text-gray-300 text-xs leading-none">↓</div>
      <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-800 flex-shrink-0">{t.step2}</span>
        <span className="text-[10px] text-red-600 font-semibold truncate">{t.step2Change} ⬆</span>
        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold flex-shrink-0">
          {t.step2Badge}
        </span>
      </div>
      <div className="text-center text-gray-300 text-xs leading-none">↓</div>
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center justify-between shadow-sm">
        <span className="text-xs font-bold text-gray-900 truncate">{t.step3}</span>
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex-shrink-0">
          🟢 {t.step3Badge}
        </span>
      </div>
    </div>
  );
}

export function InsightsMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      title: "📊 今日概況",
      weather: "☔ 雨 · 12°C",
      stats: [
        { label: "客流", value: "86 人" },
        { label: "翻枱", value: "2.4 轉" },
        { label: "外賣", value: "+32%" },
      ],
      insight: "💡 落雨日外賣單通常多三成，早啲備貨",
    },
    "zh-Hans": {
      title: "📊 今日概况",
      weather: "☔ 雨 · 12°C",
      stats: [
        { label: "客流", value: "86 人" },
        { label: "翻台", value: "2.4 轮" },
        { label: "外卖", value: "+32%" },
      ],
      insight: "💡 下雨天外卖单通常多三成，提早备货",
    },
    en: {
      title: "📊 Today at a glance",
      weather: "☔ Rain · 12°C",
      stats: [
        { label: "Covers", value: "86" },
        { label: "Table turns", value: "2.4×" },
        { label: "Takeaway", value: "+32%" },
      ],
      insight: "💡 Rainy days usually mean ~30% more takeaway — prep early",
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800">{t.title}</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
          {t.weather}
        </span>
      </div>
      <div className="p-3 grid grid-cols-3 gap-2">
        {t.stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-50 border border-gray-100 rounded-lg py-2 text-center"
          >
            <div className="text-sm font-bold text-gray-900">{s.value}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="px-3 py-2 bg-orange-50 border-t border-orange-100 text-[10px] text-orange-800 font-medium">
        {t.insight}
      </div>
    </div>
  );
}

export function AllergenMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      title: "⚠️ 過敏原警示",
      declared: "枱 3 · 客人已申報：",
      allergens: ["🥜 花生", "🦐 甲殼類"],
      dish: "沙嗲雞肉串",
      dishTag: "含花生",
      alert: "⛔ 撞過敏原，落單已擋",
      footer: "菜單自動標晒英國法定 14 種過敏原",
    },
    "zh-Hans": {
      title: "⚠️ 过敏原警示",
      declared: "桌 3 · 顾客已申报：",
      allergens: ["🥜 花生", "🦐 甲壳类"],
      dish: "沙嗲鸡肉串",
      dishTag: "含花生",
      alert: "⛔ 冲突过敏原，下单已拦",
      footer: "菜单自动标齐英国法定 14 种过敏原",
    },
    en: {
      title: "⚠️ Allergen alert",
      declared: "Table 3 · declared allergies:",
      allergens: ["🥜 Peanuts", "🦐 Crustaceans"],
      dish: "Chicken satay skewers",
      dishTag: "contains peanuts",
      alert: "⛔ Allergen conflict — order blocked",
      footer: "All 14 UK statutory allergens labelled automatically",
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800">{t.title}</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-gray-500 font-medium">{t.declared}</span>
          {t.allergens.map((a) => (
            <span
              key={a}
              className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold"
            >
              {a}
            </span>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-800 truncate">{t.dish}</span>
          <span className="text-[10px] text-gray-500 flex-shrink-0">🥜 {t.dishTag}</span>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs font-bold text-red-700 text-center">
          {t.alert}
        </div>
      </div>
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-500 font-medium">
        {t.footer}
      </div>
    </div>
  );
}

export function TelegramMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      title: "✈️ ShopOps 提醒",
      msgs: [
        { mine: false, text: "⏰ 聽日 10:00 消防年檢，記得預約師傅" },
        { mine: false, text: "📋 阿明：你聽日更係 11:00–19:00" },
        { mine: true, text: "✅ 打卡成功 08:58 · 舖頭範圍內" },
      ],
    },
    "zh-Hans": {
      title: "✈️ ShopOps 提醒",
      msgs: [
        { mine: false, text: "⏰ 明天 10:00 消防年检，记得预约师傅" },
        { mine: false, text: "📋 阿明：你明天班次是 11:00–19:00" },
        { mine: true, text: "✅ 打卡成功 08:58 · 店铺范围内" },
      ],
    },
    en: {
      title: "✈️ ShopOps reminders",
      msgs: [
        { mine: false, text: "⏰ Fire-safety inspection due tomorrow 10:00" },
        { mine: false, text: "📋 Ming: your shift tomorrow is 11:00–19:00" },
        { mine: true, text: "✅ Clocked in 08:58 · on-site" },
      ],
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 bg-sky-50 flex items-center gap-1.5">
        <span className="text-sm font-bold text-sky-800">{t.title}</span>
        <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] font-semibold">
          Telegram
        </span>
      </div>
      <div className="p-3 space-y-1.5 bg-gray-50">
        {t.msgs.map((m) => (
          <div key={m.text} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-2.5 py-1.5 rounded-xl text-[10px] leading-snug font-medium ${
                m.mine
                  ? "bg-green-100 text-green-900 rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-700 rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WaitlistMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      tvLabel: "📺 電視叫號屏",
      tvCall: "A08 請取餐",
      tvSub: "淡市自動輪播廣告",
      ticket: "候位飛",
      ticketNo: "W12",
      ticketInfo: "2 位 · 前面 3 組",
      print: "🖨️ 即場打印",
    },
    "zh-Hans": {
      tvLabel: "📺 电视叫号屏",
      tvCall: "A08 请取餐",
      tvSub: "淡市自动轮播广告",
      ticket: "候位小票",
      ticketNo: "W12",
      ticketInfo: "2 位 · 前面 3 组",
      print: "🖨️ 当场打印",
    },
    en: {
      tvLabel: "📺 TV call board",
      tvCall: "A08 ready",
      tvSub: "Loops promos in quiet hours",
      ticket: "Waitlist ticket",
      ticketNo: "W12",
      ticketInfo: "Party of 2 · 3 groups ahead",
      print: "🖨️ Printed on the spot",
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-3 space-y-2">
      {/* TV call board */}
      <div className="bg-gray-900 rounded-lg px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-semibold">{t.tvLabel}</span>
          <span className="text-[10px] text-gray-500">{t.tvSub}</span>
        </div>
        <div className="mt-1 text-center text-lg font-bold text-orange-400 tracking-wide">
          {t.tvCall}
        </div>
      </div>
      {/* Waitlist ticket */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 flex items-center gap-3">
        <div className="text-xl font-black text-gray-900">{t.ticketNo}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-800">{t.ticket}</div>
          <div className="text-[10px] text-gray-500">{t.ticketInfo}</div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold flex-shrink-0">
          {t.print}
        </span>
      </div>
    </div>
  );
}
