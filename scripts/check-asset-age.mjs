#!/usr/bin/env node
// 示範截圖有冇舊到需要重影。
//
// ⚠️ **刻意唔入 `npm run verify`**。呢個閘係「時間到就會響」，唔係「code 有錯」——
// 擺入 verify 嘅話，某日你 push 一個完全唔相干嘅改動就會突然爆紅，而個原因同你
// 手上嗰個改動零關係。所以佢係一條自己走嘅 script，出警告唔會阻塞。
//
// 年紀用 git 最後改動時間，唔另外喺 register 開一欄手寫日期 —— 手寫嗰啲一定會
// 同真實情況分岔，而 git 本身就已經記住咗。
//
// 用法：
//   npm run assets:age                         睇 working tree（人手用）
//   node check-asset-age.mjs --repo <path> --ref <sha> --json
//                                              睇某個 commit（排程用：ai-automations
//                                              `shopops_asset_age` 先 fetch 再傳 origin/main 嘅 SHA，
//                                              唔理本機 checkout 落後定改緊嘢）
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const { values: opts } = parseArgs({
  options: {
    repo: { type: "string" },
    ref: { type: "string" },
    json: { type: "boolean", default: false },
  },
});

const projectRoot = opts.repo ? resolve(opts.repo) : fileURLToPath(new URL("../", import.meta.url));
const ASSET_DIR = "public/pos-demo";
const WARN_AFTER_DAYS = 180;

function git(args) {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function webpFilesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) return webpFilesBelow(full);
    return entry.isFile() && entry.name.endsWith(".webp") ? [full] : [];
  });
}

// 回傳 null = 計唔到年紀。唔喺 git 入面嘅話，檔案 mtime 可能只係「複製嗰日」，
// 當佢新鮮會將舊圖報成綠燈，所以寧願講「唔知」。
function workingTreeChangedMs(relativePath) {
  try {
    // 未 commit 嘅改動（新圖或者同一路徑換咗新版）git log 只會見到舊紀錄 ——
    // 呢種情況張圖係啱啱整好，用檔案本身嘅 mtime。
    if (git(["status", "--porcelain", "--", relativePath])) {
      return statSync(join(projectRoot, relativePath)).mtimeMs;
    }
    const stamp = git(["log", "-1", "--format=%cI", "--", relativePath]);
    return stamp ? new Date(stamp).getTime() : null;
  } catch {
    return null;
  }
}

// --ref 模式：檔案清單同日期都由同一個 commit 攞，唔睇 working tree、唔用 mtime。
function refChangedMs(sha, relativePath) {
  try {
    const stamp = git(["log", "-1", "--format=%cI", sha, "--", relativePath]);
    return stamp ? new Date(stamp).getTime() : null;
  } catch {
    return null;
  }
}

let sha = null;
let files;
if (opts.ref) {
  try {
    sha = git(["rev-parse", "--verify", `${opts.ref}^{commit}`]);
    files = git(["ls-tree", "-r", "--name-only", sha, "--", ASSET_DIR])
      .split("\n")
      .filter((path) => path.endsWith(".webp"))
      .sort();
  } catch {
    console.error(`❌ 喺 ${projectRoot} 搵唔到 ref「${opts.ref}」。`);
    process.exit(2);
  }
} else {
  files = webpFilesBelow(join(projectRoot, ASSET_DIR))
    .map((file) => relative(projectRoot, file))
    .sort();
}

let shallow = false;
try {
  shallow = git(["rev-parse", "--is-shallow-repository"]) === "true";
} catch {
  // 唔喺 git 入面 —— 每張圖都會落「計唔到」，下面會講。
}

const now = Date.now();
const stale = [];
const unknown = [];

for (const file of files) {
  const changed = sha ? refChangedMs(sha, file) : workingTreeChangedMs(file);
  if (changed === null) {
    unknown.push(file);
    continue;
  }
  const ageDays = Math.floor((now - changed) / (24 * 60 * 60 * 1000));
  if (ageDays > WARN_AFTER_DAYS) {
    stale.push({ file, ageDays, lastChanged: new Date(changed).toISOString().slice(0, 10) });
  }
}

if (opts.json) {
  // 判斷交返 caller：呢度只講事實，唔決定「全部 OK 未」。
  console.log(
    JSON.stringify({ sha, shallow, warnAfterDays: WARN_AFTER_DAYS, total: files.length, stale, unknown }),
  );
  process.exit(0);
}

if (shallow) {
  console.log("⚠️  呢個係 shallow clone：git 歷史唔齊，下面嘅年紀可能偏細。要準確請喺完整 clone 度跑。");
}
if (files.length === 0) {
  console.log(`⚠️  ${ASSET_DIR} 入面一張示範截圖都搵唔到。`);
}
if (unknown.length > 0) {
  console.log(`⚠️  ${unknown.length}/${files.length} 張示範截圖計唔到年紀（唔喺 git 或者冇 commit 紀錄）：`);
  for (const file of unknown) console.log(`   ${file}`);
}

const known = files.length - unknown.length;
if (known === 0) {
  // 全部都計唔到就唔好出「✅ 全部新鮮」。
} else if (stale.length === 0) {
  // 只講計得到嗰批 —— 有幾張計唔到嘅話唔可以講「全部」。
  const scope = unknown.length === 0 ? `${files.length} 張示範截圖全部` : `計得到嘅 ${known}/${files.length} 張示範截圖`;
  console.log(`✅ ${scope}喺 ${WARN_AFTER_DAYS} 日內改過。`);
} else {
  console.log(`⚠️  ${stale.length}/${files.length} 張示範截圖超過 ${WARN_AFTER_DAYS} 日冇更新：`);
  for (const { file, ageDays } of stale) console.log(`   ${ageDays} 日  ${file}`);
  console.log("\n重影：喺 POS repo 跑 tools/screenshot-harness 嘅 `npm run capture`，");
  console.log("再照 docs/pos-demo-screenshot-register.md 更新 bytes / SHA-256 同重新人手 tick。");
}
