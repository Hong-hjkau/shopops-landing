// WCAG 2.1 相對亮度 + 對比度驗算。
// 點解要呢個：現站橙底白字實算得 2.80:1（連 AA-large 3:1 都 FAIL），
// 肉眼同 DevTools 目測捉唔到。新增色對必須加入 PAIRS 一齊驗。
//
// 呢個站有兩個相反環境：
//   1. hero = 黑底淺字
//   2. 其餘 = 白底深字
// 兩套都要各自驗，唔可以只驗一套。

const TOKENS = {
  // ── 主體：淺色 ──
  bg: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: '#111827',
  textSecondary: '#4B5563',

  // ── hero：深色 ──
  heroBg: '#0A0A0B',        // 唔用純黑 #000：OLED 上內容邊界會「浮」
  heroText: '#FAFAFA',
  heroTextSecondary: '#A1A1AA',
  heroBorder: '#3F3F46',

  // ── 橙 ──
  // ⚠️ 冇一隻橙可以同時服務白底同黑底（實算）：
  //    orange-500 → 白底 2.80:1 ❌ / 黑底 7.06:1 ✅
  //    orange-700 → 白底 5.18:1 ✅ / 黑底 3.82:1 ❌
  // 所以分兩隻：掣底 + hero 用 accent，白底上嘅橙字／icon 用 accentStrong。
  accent: '#F97316',            // 掣底色、hero 上嘅橙字／icon
  accentStrong: '#C2410C',      // 白底上嘅橙字／icon（orange-700）
  accentStrongHover: '#9A3412', // 白底上嘅橙字 hover（orange-800）
  onAccent: '#0A0A0B',          // 橙底用黑字：白字得 2.80:1，FAIL
  accentHover: '#EA580C',       // 掣 hover（底色深一級，字仍然係黑）

  // ── 狀態（淺底）──
  success: '#15803D',
  successBg: '#F0FDF4',
  danger: '#B91C1C',
  dangerBg: '#FEF2F2',

  // SavingsCalculator 個大數字（畀外賣平台抽走嘅錢）。
  // 紅 = 對用戶不利 = 蝕錢，語意啱，唔改做橙。
  lossFigure: '#DC2626',

  // blog LeadMagnet 個橙色 callout 底
  accentSoftBg: '#FFF7ED',
};

// [名, 前景, 背景, 最低要求]
const PAIRS = [
  // ── 主體（白底）──
  ['正文 on 白底', TOKENS.text, TOKENS.bg, 4.5],
  ['次要文字 on 白底', TOKENS.textSecondary, TOKENS.bg, 4.5],
  ['正文 on surface', TOKENS.text, TOKENS.surface, 4.5],
  ['次要文字 on surface', TOKENS.textSecondary, TOKENS.surface, 4.5],
  ['橙字/icon on 白底', TOKENS.accentStrong, TOKENS.bg, 4.5],
  ['橙字/icon on surface', TOKENS.accentStrong, TOKENS.surface, 4.5],
  ['橙字 hover on 白底', TOKENS.accentStrongHover, TOKENS.bg, 4.5],

  // ── hero（黑底）──
  ['hero 標題 on 黑底', TOKENS.heroText, TOKENS.heroBg, 4.5],
  ['hero 副題 on 黑底', TOKENS.heroTextSecondary, TOKENS.heroBg, 4.5],
  ['hero 橙字 on 黑底', TOKENS.accent, TOKENS.heroBg, 4.5],

  // ── CTA（兩個環境共用）──
  ['CTA 字 on 橙底', TOKENS.onAccent, TOKENS.accent, 4.5],
  ['CTA 字 on 橙 hover', TOKENS.onAccent, TOKENS.accentHover, 4.5],

  // ── 表單狀態（淺底）──
  ['成功訊息', TOKENS.success, TOKENS.successBg, 4.5],
  ['錯誤訊息', TOKENS.danger, TOKENS.dangerBg, 4.5],
  ['計算機蝕錢數字 on 白底', TOKENS.lossFigure, TOKENS.bg, 3.0],  // 48px 大字 → AA-large
  ['blog callout 橙字', TOKENS.accentStrong, TOKENS.accentSoftBg, 4.5],
  ['blog callout 正文', TOKENS.text, TOKENS.accentSoftBg, 4.5],
];

const srgbToLin = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
};

const ratio = (fg, bg) => {
  const [l1, l2] = [luminance(fg), luminance(bg)];
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
console.log('對比度驗算（WCAG 2.1）\n');
for (const [name, fg, bg, min] of PAIRS) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${name.padEnd(24)} ${r.toFixed(2)}:1  (需 ${min}:1)`);
}
console.log('');
if (failed > 0) {
  console.error(`❌ ${failed} 個色對唔達標`);
  process.exit(1);
}
console.log('✅ 全部色對達標');
