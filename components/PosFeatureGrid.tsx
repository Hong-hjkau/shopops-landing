import CardGrid from "@/components/CardGrid";
import type { Lang } from "@/lib/i18n";

const dict = {
  en: {
    title: "Core POS features",
    subtitle: "The essentials for taking orders, running the kitchen and checking out.",
    items: [
      { icon: "ordering", title: "QR and staff ordering", desc: "Take customer QR orders or let staff enter orders through the POS." },
      { icon: "kitchen", title: "Kitchen screen", desc: "Give the kitchen a clear view of the orders it needs to prepare." },
      { icon: "delivery", title: "Dine-in, takeaway and pre-orders", desc: "Keep the supported order types in one POS workflow." },
      { icon: "checkout", title: "Checkout controls", desc: "Handle checkout, discounts, refunds and end-of-day cash-up." },
      { icon: "offline", title: "Offline backup", desc: "Keep taking orders with the bounded offline backup when the internet goes down." },
      { icon: "menuControl", title: "Menu and availability", desc: "Manage the menu and mark items unavailable from the back office." },
    ],
  },
  "zh-Hant": {
    title: "核心 POS 功能",
    subtitle: "處理落單、廚房及結帳所需的基本工具。",
    items: [
      { icon: "ordering", title: "QR 及員工落單", desc: "客人可用 QR 點餐，或由員工在 POS 輸入訂單。" },
      { icon: "kitchen", title: "廚房畫面", desc: "讓廚房清楚看到需要準備的訂單。" },
      { icon: "delivery", title: "堂食、外賣及預訂", desc: "在同一個 POS 流程處理已支援的訂單類型。" },
      { icon: "checkout", title: "結帳管理", desc: "處理結帳、折扣、退款及每日埋數。" },
      { icon: "offline", title: "離線後備", desc: "網絡中斷時，以有運作範圍的離線後備繼續落單。" },
      { icon: "menuControl", title: "餐牌及售罄管理", desc: "在後台管理餐牌，並將售罄項目設為不可供應。" },
    ],
  },
  "zh-Hans": {
    title: "核心 POS 功能",
    subtitle: "处理点餐、厨房及结账所需的基本工具。",
    items: [
      { icon: "ordering", title: "扫码及员工点餐", desc: "顾客可扫码点餐，或由员工在 POS 输入订单。" },
      { icon: "kitchen", title: "厨房画面", desc: "让厨房清楚看到需要准备的订单。" },
      { icon: "delivery", title: "堂食、外卖及预订", desc: "在同一个 POS 流程处理已支持的订单类型。" },
      { icon: "checkout", title: "结账管理", desc: "处理结账、折扣、退款及每日交班对账。" },
      { icon: "offline", title: "离线备用", desc: "网络中断时，以有运作范围的离线备用继续下单。" },
      { icon: "menuControl", title: "菜单及售罄管理", desc: "在后台管理菜单，并将售罄项目设为不可供应。" },
    ],
  },
} as const;

export default function PosFeatureGrid({ lang, id = "core-features" }: { lang: Lang; id?: string }) {
  const t = dict[lang];

  return (
    <section id={id} className="bg-bg px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text-secondary sm:text-lg">{t.subtitle}</p>
        </div>
        <div className="mt-10"><CardGrid items={t.items} cols="2/3" size="sm" /></div>
      </div>
    </section>
  );
}
