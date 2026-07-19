// 出社交平台圖（FB cover / IG 方 / LinkedIn 個人 + 公司 banner）。
//
//   npm run social          → 出去 social-out/（gitignore，唔入 repo）
//
// 顏色同文案由 lib/brand.ts 嚟，同網站分享圖 app/opengraph-image.tsx 同一個來源。
// 每個尺寸嘅 inset 係按各平台手機裁切嘅安全區計，改尺寸前先睇下面註解。
//
// 要 Node ≥ 22.18（直接 import .ts 靠原生 type stripping，唔使 build step）。
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ACCENT_GLOW, BG_GRADIENT, COLORS, COPY } from "../lib/brand.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "social-out");

/** Playwright 各平台放 headless shell 嘅位。 */
const CHROME_IN_CACHE = {
  win32: ["chrome-headless-shell-win64/chrome-headless-shell.exe"],
  darwin: [
    "chrome-headless-shell-mac-arm64/chrome-headless-shell",
    "chrome-headless-shell-mac-x64/chrome-headless-shell",
  ],
  linux: ["chrome-headless-shell-linux/chrome-headless-shell"],
};

/** 搵一個 headless Chrome：CHROME_BIN 行先，否則用 Playwright 裝落嘅 cache。 */
function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;

  const cache =
    process.platform === "win32"
      ? join(process.env.LOCALAPPDATA ?? "", "ms-playwright")
      : process.platform === "darwin"
        ? join(process.env.HOME ?? "", "Library/Caches/ms-playwright")
        : join(process.env.HOME ?? "", ".cache/ms-playwright");

  if (existsSync(cache)) {
    const dirs = readdirSync(cache)
      .filter((d) => d.startsWith("chromium_headless_shell-"))
      .sort()
      .reverse();
    for (const d of dirs) {
      for (const rel of CHROME_IN_CACHE[process.platform] ?? []) {
        const p = join(cache, d, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  throw new Error("搵唔到 headless Chrome。設個 CHROME_BIN 指去 Chrome／Chromium binary。");
}

/** brand.ts 啲文案會直接 interpolate 落 HTML，逐個 escape。 */
function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * 喺 slogan 指定短語前面加分行。搵唔到錨點即拋錯 —— 改咗 COPY.title 但
 * 冇更新分行位嘅話，寧願即刻爆，好過靜靜雞出一行過嘅爛版面。
 */
function breakBefore(text, phrase) {
  if (!text.includes(phrase)) {
    throw new Error(
      `分行錨點「${phrase}」喺 COPY.title 搵唔到。改咗 slogan 就要一齊更新 scripts/gen-social.mjs 嘅分行位。`
    );
  }
  return text.replace(phrase, `<br />${phrase}`);
}

const tagsHtml = COPY.tags
  .map((t) => `<span>${esc(t)}</span>`)
  .join('<span class="dot">·</span>');

// s = 字級／間距倍率；inset = 兩邊留白（手機安全區）；lift = 內容抬高幾多避開頭像
function page({ w, h, s, inset, lift, vertical = false, titleHtml }) {
  const logoW = (vertical ? 420 : 340) * s;
  return `<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${w}px; height:${h}px; overflow:hidden;
    font-family:"Segoe UI", Arial, Helvetica, sans-serif; background:${COLORS.bg}; }
  .cover { position:relative; width:${w}px; height:${h}px; background:${BG_GRADIENT}; overflow:hidden; }
  .horizon { position:absolute; left:0; right:0; bottom:0; height:${Math.max(2, Math.round(4 * s))}px;
    background:linear-gradient(90deg, rgba(249,115,22,0) 0%, rgba(249,115,22,0.85) 35%, rgba(251,146,60,0.9) 55%, rgba(249,115,22,0) 100%); }
  .inner { position:absolute; left:${inset}px; right:${inset}px; top:0; bottom:0;
    display:flex; ${vertical ? "flex-direction:column;" : ""} align-items:center; justify-content:center; gap:${(vertical ? 40 : 64) * s}px; }
  .logo-wrap { position:relative; flex-shrink:0; width:${logoW}px; display:flex; align-items:center;
    justify-content:center; margin-bottom:${lift}px; }
  /* 光暈綁喺 logo 身上，唔用固定座標 —— 否則換尺寸就同 logo 脫節 */
  .logo-wrap::before { content:""; position:absolute; left:50%; top:50%;
    width:${logoW * 2.6}px; height:${logoW * 2.6}px; transform:translate(-50%,-50%);
    pointer-events:none; background:${ACCENT_GLOW}; }
  /* logo.png 本身黑底方圖，screen 混合先溶到入深色底，唔會見到方框接縫 */
  .logo-wrap img { position:relative; width:${logoW}px; height:auto; mix-blend-mode:screen; }
  .text { flex:0 1 auto; margin-bottom:${lift * 0.7}px; ${vertical ? "text-align:center;" : ""} }
  .eyebrow { color:${COLORS.accentHover}; font-size:${21 * s}px; font-weight:700;
    letter-spacing:${3 * s}px; text-transform:uppercase; margin-bottom:${22 * s}px; }
  h1 { color:${COLORS.text}; font-size:${62 * s}px; font-weight:800; line-height:1.06;
    letter-spacing:${-1 * s}px; margin-bottom:${26 * s}px; }
  .tags { color:${COLORS.textSecondary}; font-size:${23 * s}px; display:flex; gap:${16 * s}px;
    align-items:center; ${vertical ? "justify-content:center;" : ""} margin-bottom:${30 * s}px; }
  .tags .dot { color:${COLORS.textSecondary}; }
  .foot { display:flex; align-items:center; gap:${20 * s}px; ${vertical ? "justify-content:center;" : ""} }
  .url { color:${COLORS.text}; font-size:${24 * s}px; font-weight:700; letter-spacing:${0.5 * s}px; }
  .pill { border:${Math.max(1, 1.5 * s)}px solid rgba(249,115,22,0.55); color:${COLORS.accentHover};
    font-size:${19 * s}px; font-weight:600; padding:${8 * s}px ${18 * s}px; border-radius:999px; }
</style>
<div class="cover">
  <div class="inner">
    <div class="logo-wrap"><img src="${join(ROOT, "public/logo.png").replace(/\\/g, "/")}" alt="ShopOps" /></div>
    <div class="text">
      <div class="eyebrow">${esc(COPY.eyebrow)}</div>
      <h1>${titleHtml}</h1>
      <div class="tags">${tagsHtml}</div>
      <div class="foot">
        <span class="url">${esc(COPY.url)}</span>
        <span class="pill">${esc(COPY.cta)}</span>
      </div>
    </div>
  </div>
  <div class="horizon"></div>
</div>`;
}

// 分行位置逐個尺寸手揀（闊嘅兩行、方嘅三行），係版面決定，所以留喺呢度；
// 但字本身一定由 COPY.title 嚟，唔可以喺呢度再抄一次 slogan。
const WIDE_TITLE = breakBefore(esc(COPY.title), "how you work.");
const STACKED_TITLE = breakBefore(WIDE_TITLE, "around ");

const VARIANTS = [
  // FB Page cover：顯示 820×312，手機兩邊各切 ~90px（@1x）→ 內容收中間 1280
  { name: "shopops-fb-cover", w: 1640, h: 624, s: 1, inset: 180, lift: 56, titleHtml: WIDE_TITLE },
  // IG 方形貼文
  { name: "shopops-ig-square", w: 1080, h: 1080, s: 1.05, inset: 80, lift: 0, vertical: true, titleHtml: STACKED_TITLE },
  // LinkedIn 個人 banner：1584×396，手機淨中間 1200
  { name: "shopops-li-personal", w: 1584, h: 396, s: 0.62, inset: 192, lift: 10, titleHtml: WIDE_TITLE },
  // LinkedIn 公司頁 banner：上傳 4200×700（顯示 ~1128×191），手機淨中間 900 → 換算 3350
  { name: "shopops-li-company", w: 4200, h: 700, s: 1.55, inset: 425, lift: 40, titleHtml: WIDE_TITLE },
];

const chrome = findChrome();
mkdirSync(OUT_DIR, { recursive: true });

for (const v of VARIANTS) {
  const htmlPath = join(OUT_DIR, `${v.name}.html`);
  const pngPath = join(OUT_DIR, `${v.name}.png`);
  writeFileSync(htmlPath, page(v));
  execFileSync(chrome, [
    "--headless",
    "--disable-gpu",
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    `--screenshot=${pngPath}`,
    `--window-size=${v.w},${v.h}`,
    `file:///${htmlPath.replace(/\\/g, "/")}`,
  ]);
  if (!existsSync(pngPath)) throw new Error(`${v.name} 出圖失敗`);
  // .html 只係畀 Chrome 截圖用嘅中間檔，截完即刪 —— social-out/ 只留 .png，
  // 免得撳錯個 4200px 闊嘅 .html 以為壞咗。
  rmSync(htmlPath, { force: true });
  console.log(`✓ ${v.name}.png  (${v.w}×${v.h})`);
}
console.log(`\n出咗喺 ${OUT_DIR}`);
