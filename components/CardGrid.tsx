// 全站共用嘅「icon + 標題 + 描述」卡片 grid。
// 兩個 look：tile = 深卡 icon 喺上（痛點卡／服務四柱／功能牆）；panel = 卡 icon 喺標題內（產品頁功能卡）。
// 唔屬呢兩個家族嘅 grid（首頁產品卡有 CTA、「點解揀」無卡框、POS 6 大獨家卡嵌 mockup）唔好硬塞入嚟。
// icon 收 IconName（見 components/icons.ts），唔收 emoji —— icon 唔屬翻譯資料。

import { ICONS, type IconName } from "@/components/icons";

type CardItem = { icon: IconName; title: string; desc: string };

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
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        return look === "panel" ? (
          <div key={item.title} className="bg-surface rounded-xl border border-border p-5 sm:p-6">
            <h3 className="text-xl font-bold text-text mb-2 flex items-center gap-2">
              <Icon className="w-6 h-6 text-accent shrink-0" strokeWidth={2} aria-hidden />
              {item.title}
            </h3>
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{item.desc}</p>
          </div>
        ) : (
          <div
            key={item.title}
            className={`bg-surface rounded-xl border border-border p-6${centered ? " text-center" : ""}`}
          >
            <Icon
              className={`${size === "sm" ? "w-7 h-7 mb-3" : "w-8 h-8 mb-4"} text-accent${centered ? " mx-auto" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
            <h3 className={`${size === "sm" ? "text-lg" : "text-xl"} font-bold text-text mb-2`}>{item.title}</h3>
            <p className={`text-text-secondary leading-relaxed ${size === "sm" ? "text-sm" : "text-sm sm:text-base"}`}>
              {item.desc}
            </p>
          </div>
        );
      })}
    </div>
  );
}
