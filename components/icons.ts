// Icon 名 → Lucide component 嘅單一映射。
//
// 點解 icon 唔放喺翻譯資料入面：icon 唔係語言相關嘅嘢 —— 一個齒輪喺繁體
// 同英文係同一個齒輪。放喺 dict 度等於同一個 icon 寫三次，改一次要記住改三處，
// 改漏就會出現「英文版新 icon、中文版舊 emoji」。而家 icon 名係 union type，
// 三語任何一份改漏，tsc 即刻報錯。
//
// 揀 Lucide（唔揀 Phosphor）嘅理由係風格：Lucide 幾何、嚴謹、貼死 24px 網格；
// Phosphor friendly、有機。SHOPOPS 賣精準，唔賣親切。
//
// 加新 icon：揀語意對應嘅，唔係揀樣似嘅（例：「離線都做到生意」用 WifiOff
// 唔用 Plug —— 講緊嘅係「斷網」，唔係「插頭」）。
//
// ⚠️ 已知取捨：ICONS 喺同一個 object 度引用晒全部 icon，所以 tree-shaking
// 失效 —— 首頁只用 9 個，但會載齊全部。2026-07-17 production 實測代價 =
// 2.8KB gzip（原始 17KB），佔首頁 691KB 嘅 0.4%，故接受。
// 呢個成本隨 icon 數目線性增長：若日後升到上百個 icon，就拆成 per-surface
// 檔（icons/home.ts、icons/pos.ts、icons/rota.ts）換返 tree-shaking。

import {
  // 服務四柱（首頁）
  Workflow,
  Wrench,
  Brain,
  Package,
  // 點解揀 SHOPOPS（首頁）
  Handshake,
  Flame,
  Unlock,
  // 產品（首頁）
  UtensilsCrossed,
  CalendarDays,
  // POS 痛點卡
  EyeOff,
  Percent,
  TrendingDown,
  // POS 6 大獨家
  ClipboardCheck,
  ScanLine,
  CloudSun,
  TriangleAlert,
  Smartphone,
  Ticket,
  // POS 功能牆
  ConciergeBell,
  Kanban,
  BookOpen,
  Building2,
  WifiOff,
  CalendarCheck,
  Bike,
  ChefHat,
  PoundSterling,
  ChartLine,
  Languages,
  Printer,
  // Rota 痛點卡
  Clock,
  ClipboardX,
  Calculator,
  // Rota 功能
  MapPin,
  ArrowLeftRight,
  FileSpreadsheet,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  // ── 首頁：服務四柱 ──
  automation: Workflow,
  custom: Wrench,
  ai: Brain,
  products: Package,
  // ── 首頁：點解揀 SHOPOPS ──
  direct: Handshake,
  forged: Flame,
  yours: Unlock,
  // ── 首頁：產品 ──
  pos: UtensilsCrossed,
  rota: CalendarDays,

  // ── POS：痛點卡 ──
  /** 佢偷你嘅客 —— 你連邊個幫襯過你都唔知 */
  painCustomersHidden: EyeOff,
  /** 抽你兩三成 */
  painCommission: Percent,
  /** 埋沒你個品牌 */
  painBrandBuried: TrendingDown,

  // ── POS：6 大獨家 ──
  /** 食安日誌（電子 SFBB）*/
  foodSafety: ClipboardCheck,
  /** 影張發票，毛利即更新 */
  invoiceScan: ScanLine,
  /** 天氣 + 客流 + 翻台報表 */
  weatherReport: CloudSun,
  /** 過敏原自動標示 + 落單警示 */
  allergen: TriangleAlert,
  /** Telegram 提醒 + 排更打卡 */
  telegram: Smartphone,
  /** 候位取號 + 電視叫號 + 廣告屏 */
  queueTicket: Ticket,

  // ── POS：功能牆 ──
  /** 三合一點餐 */
  ordering: ConciergeBell,
  /** 即時訂單看板（等緊做／做緊／做完）*/
  orderBoard: Kanban,
  /** 菜單彈性控制 */
  menuControl: BookOpen,
  /** 多店一個後台 */
  multiSite: Building2,
  /** 離線都做到生意 */
  offline: WifiOff,
  /** 網上訂位 */
  reservation: CalendarCheck,
  /** 外賣 + 送貨 */
  delivery: Bike,
  /** 廚房看板 */
  kitchen: ChefHat,
  /** 收銀全套 */
  checkout: PoundSterling,
  /** 銷售報表 */
  salesReport: ChartLine,
  /** 中英雙語 */
  bilingual: Languages,
  /** 單據打印 */
  printing: Printer,

  // ── Rota：痛點卡 ──
  /** 唔知邊個準時 */
  painPunctuality: Clock,
  /** 排更亂晒 */
  painRotaMess: ClipboardX,
  /** 月尾計工時好痛苦 */
  painTallyHours: Calculator,

  // ── Rota：功能 ──
  /** 排更 grid + 員工提交 */
  rotaGrid: CalendarDays,
  /** Telegram 定位打卡 */
  locationClockIn: MapPin,
  /** 員工自助換更 */
  shiftSwap: ArrowLeftRight,
  /** 自動計工時 + Excel */
  hoursExport: FileSpreadsheet,
} as const;

export type IconName = keyof typeof ICONS;
export type { LucideIcon };
