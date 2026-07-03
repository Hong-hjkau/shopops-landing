// 全站共用嘅「icon + 標題 + 描述」卡片 grid。
// 兩個 look：tile = 灰卡 icon 喺上（痛點卡／服務四柱／功能牆）；panel = 白卡 icon 喺標題內（產品頁功能卡）。
// 唔屬呢兩個家族嘅 grid（首頁產品卡有 CTA、「點解揀」無卡框、POS 6 大獨家卡嵌 mockup）唔好硬塞入嚟。

type CardItem = { icon: string; title: string; desc: string };

const COLS = {
  "2": "sm:grid-cols-2",
  "3": "sm:grid-cols-3",
  "2/3": "sm:grid-cols-2 lg:grid-cols-3",
} as const;

export default function CardGrid({
  items,
  cols,
  look = "tile",
  centered = false,
  size = "md",
}: {
  items: readonly CardItem[];
  cols: keyof typeof COLS;
  look?: "tile" | "panel";
  /** tile 專用：內容置中（痛點卡） */
  centered?: boolean;
  /** tile 專用：sm = 細一號（功能牆） */
  size?: "md" | "sm";
}) {
  return (
    <div className={`grid grid-cols-1 ${COLS[cols]} gap-5`}>
      {items.map((item) =>
        look === "panel" ? (
          <div key={item.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
          </div>
        ) : (
          <div
            key={item.title}
            className={`bg-gray-50 rounded-xl border border-gray-200 p-6${centered ? " text-center" : ""}`}
          >
            <div className={size === "sm" ? "text-3xl mb-3" : "text-4xl mb-4"}>{item.icon}</div>
            <h3 className={`${size === "sm" ? "text-lg" : "text-xl"} font-bold text-gray-900 mb-2`}>{item.title}</h3>
            <p className={`text-gray-600 leading-relaxed ${size === "sm" ? "text-sm" : "text-sm sm:text-base"}`}>
              {item.desc}
            </p>
          </div>
        ),
      )}
    </div>
  );
}
