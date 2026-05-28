export function MenuMockup() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Sticky header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-1.5">
          <span className="text-base">🪑</span>
          <span className="text-sm font-bold text-gray-800">枱號 5</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
          🌞 午市
        </span>
      </div>
      {/* Tab pills */}
      <div className="px-3 py-2 flex gap-1.5 border-b border-gray-100">
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">套餐</span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">主菜</span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">飲品</span>
      </div>
      {/* Menu items */}
      <div className="p-3 space-y-2 bg-gray-50">
        {[
          { name: "招牌叉燒飯", desc: "蜜汁叉燒配絲苗白飯", price: "£8.50" },
          { name: "海南雞飯", desc: "嫩雞配香茅雞汁飯", price: "£7.80" },
        ].map((item) => (
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

export function BoardMockup() {
  const columns = [
    {
      label: "待處理",
      headerClass: "bg-red-100 text-red-700",
      cards: [{ code: "#A12", info: "枱 3 · 4 件", price: "£24.00" }],
    },
    {
      label: "製作中",
      headerClass: "bg-yellow-100 text-yellow-700",
      cards: [{ code: "#A10", info: "外賣 · 3 件", price: "£18.00" }],
    },
    {
      label: "已完成",
      headerClass: "bg-gray-200 text-gray-600",
      cards: [{ code: "#A09", info: "枱 1 · 5 件", price: "£32.50" }],
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

export function OfflineMockup() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-4">
      {/* Cloud layer - dead */}
      <div className="pb-3 border-b border-dashed border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-500">☁️ 雲端服務</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
            ✕ 全部死晒
          </span>
        </div>
        <div className="flex items-center justify-around opacity-40">
          {[
            { icon: "🌐", label: "網站" },
            { icon: "🗄️", label: "資料" },
            { icon: "📶", label: "網絡" },
          ].map((it) => (
            <div key={it.label} className="flex flex-col items-center">
              <div className="text-xl">{it.icon}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 line-through">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Local layer - alive */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-700">🏠 本機後備</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
            ✓ 照樣運作
          </span>
        </div>
        <div className="flex items-center justify-around">
          {[
            { icon: "📱", label: "iPad" },
            { icon: "📦", label: "本機" },
            { icon: "🍳", label: "廚房" },
          ].map((it, i, arr) => (
            <div key={it.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-xl">{it.icon}</div>
                <div className="text-[10px] text-gray-700 font-semibold mt-0.5">{it.label}</div>
              </div>
              {i < arr.length - 1 && <span className="text-gray-400 text-sm mx-2">↔</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminMockup() {
  const items = [
    { name: "招牌叉燒飯", price: "£8.50", on: true },
    { name: "海南雞飯", price: "£7.80", on: true },
    { name: "例湯（限午市）", price: "£3.50", on: false },
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between bg-white">
        <span className="text-sm font-bold text-gray-800">📝 菜單管理</span>
        <span className="px-2 py-0.5 rounded-lg bg-gray-900 text-white text-[10px] font-semibold">
          + 加菜式
        </span>
      </div>
      {/* Table */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.name} className="px-3 py-2 flex items-center gap-2">
            <span className="flex-1 text-xs font-medium text-gray-800 truncate">{item.name}</span>
            <span className="text-xs font-semibold text-orange-600 w-12 text-right">{item.price}</span>
            {item.on ? (
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                ● 上架
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold">
                ○ 下架
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
