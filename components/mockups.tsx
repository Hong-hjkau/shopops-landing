import type { Lang } from "@/lib/i18n";

export function MenuMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      table: "枱號 5",
      session: "🌞 午市",
      tabs: ["套餐", "主菜", "飲品"],
      items: [
        { name: "經典牛肉漢堡", desc: "炭烤牛肉配車打芝士薯條", price: "£8.50" },
        { name: "炸魚薯條", desc: "脆漿鱈魚配青豆蓉", price: "£7.80" },
      ],
    },
    "zh-Hans": {
      table: "桌号 5",
      session: "🌞 午市",
      tabs: ["套餐", "主菜", "饮品"],
      items: [
        { name: "经典牛肉汉堡", desc: "炭烤牛肉配车打芝士薯条", price: "£8.50" },
        { name: "炸鱼薯条", desc: "脆浆鳕鱼配青豆蓉", price: "£7.80" },
      ],
    },
    en: {
      table: "Table 5",
      session: "🌞 Lunch",
      tabs: ["Sets", "Mains", "Drinks"],
      items: [
        { name: "Classic Beef Burger", desc: "Chargrilled beef, cheddar, fries", price: "£8.50" },
        { name: "Fish & Chips", desc: "Beer-battered cod, mushy peas", price: "£7.80" },
      ],
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Sticky header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🪑</span>
          <span className="text-sm font-bold text-gray-800">{t.table}</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
          {t.session}
        </span>
      </div>
      {/* Tab pills */}
      <div className="px-3 py-2 flex gap-1.5 border-b border-gray-100">
        {t.tabs.map((tab, i) => (
          <span
            key={tab}
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              i === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>
      {/* Menu items */}
      <div className="p-3 space-y-2 bg-gray-50">
        {t.items.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-lg p-2.5 flex items-center justify-between border border-gray-100"
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-800 truncate">{item.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
              <div className="text-sm font-bold text-orange-600 mt-0.5">{item.price}</div>
            </div>
            <button className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BoardMockup({ lang }: { lang: Lang }) {
  const labels = {
    "zh-Hant": { pending: "待處理", progress: "製作中", done: "已完成" },
    "zh-Hans": { pending: "待处理", progress: "制作中", done: "已完成" },
    en: { pending: "Pending", progress: "In Progress", done: "Done" },
  }[lang];
  const info = {
    "zh-Hant": { a12: "枱 3 · 4 件", a10: "外賣 · 3 件", a09: "枱 1 · 5 件" },
    "zh-Hans": { a12: "桌 3 · 4 件", a10: "外卖 · 3 件", a09: "桌 1 · 5 件" },
    en: { a12: "Table 3 · 4 items", a10: "Takeaway · 3 items", a09: "Table 1 · 5 items" },
  }[lang];

  const columns = [
    {
      label: labels.pending,
      headerClass: "bg-red-100 text-red-700",
      cards: [{ code: "#A12", info: info.a12, price: "£24.00" }],
    },
    {
      label: labels.progress,
      headerClass: "bg-yellow-100 text-yellow-700",
      cards: [{ code: "#A10", info: info.a10, price: "£18.00" }],
    },
    {
      label: labels.done,
      headerClass: "bg-gray-200 text-gray-600",
      cards: [{ code: "#A09", info: info.a09, price: "£32.50" }],
    },
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-3">
      <div className="grid grid-cols-3 gap-2">
        {columns.map((col) => (
          <div key={col.label} className="space-y-2">
            <div
              className={`text-[10px] font-bold text-center py-1 rounded ${col.headerClass}`}
            >
              {col.label}
            </div>
            {col.cards.map((c) => (
              <div
                key={c.code}
                className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
              >
                <div className="text-xs font-bold text-gray-800">{c.code}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{c.info}</div>
                <div className="text-xs font-bold text-gray-900 mt-1">{c.price}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function OfflineMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      cloudTitle: "☁️ 雲端服務",
      cloudBadge: "✕ 全部死晒",
      cloud: ["網站", "資料", "網絡"],
      localTitle: "🏠 本機後備",
      localBadge: "✓ 照樣運作",
      local: ["iPad", "本機", "廚房"],
    },
    "zh-Hans": {
      cloudTitle: "☁️ 云端服务",
      cloudBadge: "✕ 全部宕机",
      cloud: ["网站", "资料", "网络"],
      localTitle: "🏠 本机后备",
      localBadge: "✓ 照常运作",
      local: ["iPad", "本机", "厨房"],
    },
    en: {
      cloudTitle: "☁️ Cloud services",
      cloudBadge: "✕ All down",
      cloud: ["Website", "Database", "Network"],
      localTitle: "🏠 Local backup",
      localBadge: "✓ Still running",
      local: ["iPad", "Local", "Kitchen"],
    },
  }[lang];

  const cloudIcons = ["🌐", "🗄️", "📶"];
  const localIcons = ["📱", "📦", "🍳"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4">
      {/* Cloud layer - dead */}
      <div className="pb-3 border-b border-dashed border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500">{t.cloudTitle}</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
            {t.cloudBadge}
          </span>
        </div>
        <div className="flex items-center justify-around opacity-40">
          {t.cloud.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <div className="text-xl">{cloudIcons[i]}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 line-through">{label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Local layer - alive */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-700">{t.localTitle}</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
            {t.localBadge}
          </span>
        </div>
        <div className="flex items-center justify-around">
          {t.local.map((label, i, arr) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-xl">{localIcons[i]}</div>
                <div className="text-[10px] text-gray-700 font-semibold mt-0.5">{label}</div>
              </div>
              {i < arr.length - 1 && <span className="text-gray-400 text-sm mx-2">↔</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminMockup({ lang }: { lang: Lang }) {
  const t = {
    "zh-Hant": {
      title: "📝 菜單管理",
      addBtn: "+ 加菜式",
      on: "● 上架",
      off: "○ 下架",
      items: [
        { name: "經典牛肉漢堡", price: "£8.50", on: true },
        { name: "炸魚薯條", price: "£7.80", on: true },
        { name: "是日例湯（限午市）", price: "£3.50", on: false },
      ],
    },
    "zh-Hans": {
      title: "📝 菜单管理",
      addBtn: "+ 加菜式",
      on: "● 上架",
      off: "○ 下架",
      items: [
        { name: "经典牛肉汉堡", price: "£8.50", on: true },
        { name: "炸鱼薯条", price: "£7.80", on: true },
        { name: "是日例汤（限午市）", price: "£3.50", on: false },
      ],
    },
    en: {
      title: "📝 Menu Manager",
      addBtn: "+ Add item",
      on: "● Live",
      off: "○ Hidden",
      items: [
        { name: "Classic Beef Burger", price: "£8.50", on: true },
        { name: "Fish & Chips", price: "£7.80", on: true },
        { name: "Soup of the Day (lunch)", price: "£3.50", on: false },
      ],
    },
  }[lang];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
        <span className="text-sm font-bold text-gray-800">{t.title}</span>
        <span className="px-2 py-0.5 rounded-lg bg-gray-900 text-white text-[10px] font-semibold">
          {t.addBtn}
        </span>
      </div>
      {/* Table */}
      <div className="divide-y divide-gray-100">
        {t.items.map((item) => (
          <div key={item.name} className="px-3 py-2 flex items-center gap-2">
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{item.name}</span>
            <span className="text-xs font-semibold text-orange-600 w-12 text-right">{item.price}</span>
            {item.on ? (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                {t.on}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                {t.off}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
