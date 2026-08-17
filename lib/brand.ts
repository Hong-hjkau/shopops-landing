/**
 * 品牌 single source of truth：顏色 + 對外社交／分享圖文案。
 *
 * 用喺：app/opengraph-image.tsx（網站分享預覽圖）、scripts/gen-social.mjs
 * （FB／IG／LinkedIn 圖）。改一次，兩邊一齊跟。
 */

/**
 * ⚠️ 呢度嘅色值係 app/globals.css `@theme` 嗰套 CSS token 嘅 JS 鏡像。
 *
 * 點解要重複：satori（next/og）同出圖 script 都讀唔到 CSS variable，只食得
 * JS 字面值。改色時兩邊一齊改，唔好淨係改一邊。
 */
export const COLORS = {
  bg: "#0A0A0B", // 唔用純黑 #000：OLED 上內容邊界會「浮」
  surface: "#141416",
  border: "#26262A",
  text: "#FAFAFA",
  textSecondary: "#A1A1AA",
  accent: "#F97316",
  accentHover: "#FB923C",
  onAccent: "#0A0A0B", // 橙底用黑字：白字得 2.80:1，連 AA-large 都 FAIL
} as const;

/** 深色底漸變，bg → surface。 */
export const BG_GRADIENT = `linear-gradient(135deg, ${COLORS.bg} 0%, ${COLORS.surface} 100%)`;

/** 橙光暈，用喺 logo 背後。 */
export const ACCENT_GLOW =
  "radial-gradient(circle, rgba(249,115,22,0.20) 0%, rgba(249,115,22,0.06) 40%, rgba(249,115,22,0) 68%)";

/** 對外品牌文案（英文；對外客群係英國生意）。 */
export const COPY = {
  eyebrow: "Custom software · Automation",
  title: "Software built around how you work.",
  tags: ["Automation", "Custom systems", "AI & data", "Products"],
  url: "shopops.co.uk",
  cta: "Free consult",
} as const;

/** 對外聯絡及社交平台連結。 */
export const SOCIAL_LINKS = {
  email: "mailto:hello@shopops.co.uk",
  facebook: "https://www.facebook.com/ShopOps",
  instagram: "https://www.instagram.com/shopopsuk",
} as const;
