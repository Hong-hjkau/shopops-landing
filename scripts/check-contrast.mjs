// WCAG 2.1 相對亮度 + 對比度驗算。
// 點解要呢個：現站橙底白字實算得 2.80:1（連 AA-large 3:1 都 FAIL），
// 肉眼同 DevTools 目測捉唔到。新增色對必須加入 PAIRS 一齊驗。

const TOKENS = {
  bg: '#0A0A0B',
  surface: '#141416',
  border: '#26262A',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  accent: '#F97316',
  accentHover: '#FB923C',
  onAccent: '#0A0A0B',
  // 狀態色（表單成功 / 失敗）。深色底要用淺色調（400 級），
  // 唔可以照搬淺色底嗰套 green-700 / red-700 —— 嗰啲喺黑底上係一嚿黑。
  success: '#4ADE80',
  danger: '#F87171',
};

// [名, 前景, 背景, 最低要求]
const PAIRS = [
  ['正文 on bg', TOKENS.text, TOKENS.bg, 4.5],
  ['次要文字 on bg', TOKENS.textSecondary, TOKENS.bg, 4.5],
  ['正文 on surface', TOKENS.text, TOKENS.surface, 4.5],
  ['次要文字 on surface', TOKENS.textSecondary, TOKENS.surface, 4.5],
  ['橙 on bg', TOKENS.accent, TOKENS.bg, 4.5],
  ['橙 on surface', TOKENS.accent, TOKENS.surface, 4.5],
  ['CTA 字 on 橙底', TOKENS.onAccent, TOKENS.accent, 4.5],
  ['CTA 字 on 橙 hover', TOKENS.onAccent, TOKENS.accentHover, 4.5],
  ['成功訊息 on surface', TOKENS.success, TOKENS.surface, 4.5],
  ['錯誤訊息 on surface', TOKENS.danger, TOKENS.surface, 4.5],
  // header 語言切換掣：當前語言個底用 border 色（唔用橙，橙留返畀 CTA）
  ['當前語言 on border底', TOKENS.text, TOKENS.border, 4.5],
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
