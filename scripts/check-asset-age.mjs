#!/usr/bin/env node
// 示範截圖有冇舊到需要重影。
//
// ⚠️ **刻意唔入 `npm run verify`**。呢個閘係「時間到就會響」，唔係「code 有錯」——
// 擺入 verify 嘅話，某日你 push 一個完全唔相干嘅改動就會突然爆紅，而個原因同你
// 手上嗰個改動零關係。所以佢係一條自己走嘅 script，出警告唔會阻塞。
//
// 年紀用 git 最後改動時間，唔另外喺 register 開一欄手寫日期 —— 手寫嗰啲一定會
// 同真實情況分岔，而 git 本身就已經記住咗。
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const assetRoot = join(projectRoot, "public/pos-demo");
const WARN_AFTER_DAYS = 180;

function webpFilesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) return webpFilesBelow(full);
    return entry.isFile() && entry.name.endsWith(".webp") ? [full] : [];
  });
}

function git(args) {
  return execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

// 回傳 null = 計唔到年紀。唔喺 git 入面嘅話，檔案 mtime 可能只係「複製嗰日」，
// 當佢新鮮會將舊圖報成綠燈，所以寧願講「唔知」。
function lastChangedMs(file) {
  const relativePath = relative(projectRoot, file);
  try {
    // 未 commit 嘅改動（新圖或者同一路徑換咗新版）git log 只會見到舊紀錄 ——
    // 呢種情況張圖係啱啱整好，用檔案本身嘅 mtime。
    if (git(["status", "--porcelain", "--", relativePath])) return statSync(file).mtimeMs;
    const stamp = git(["log", "-1", "--format=%cI", "--", relativePath]);
    return stamp ? new Date(stamp).getTime() : null;
  } catch {
    return null;
  }
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
const files = webpFilesBelow(assetRoot).sort();

for (const file of files) {
  const changed = lastChangedMs(file);
  if (changed === null) {
    unknown.push(relative(projectRoot, file));
    continue;
  }
  const ageDays = Math.floor((now - changed) / (24 * 60 * 60 * 1000));
  if (ageDays > WARN_AFTER_DAYS) stale.push({ file: relative(projectRoot, file), ageDays });
}

if (shallow) {
  console.log("⚠️  呢個係 shallow clone：git 歷史唔齊，下面嘅年紀可能偏細。要準確請喺完整 clone 度跑。");
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
