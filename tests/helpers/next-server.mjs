import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

async function reservePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.notEqual(typeof address, "string");
  const port = address.port;
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

// 一定要等到 process 真係 exit 先返 —— 送完信號就走嘅話，下一個 test 檔可以喺舊
// server 完全退出之前開始。
async function terminate(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");

  // 個 grace timer 一定要 clear：唔 clear 嘅話，就算 child 即刻死咗，個未 fire
  // 嘅 setTimeout 都會吊住 event loop，令成個 test worker 硬等夠五秒先肯收工。
  let timeout;
  const grace = new Promise((resolve) => { timeout = setTimeout(() => resolve(false), 5_000); });
  const exitedInTime = await Promise.race([exited.then(() => true), grace]);
  clearTimeout(timeout);
  if (exitedInTime) return;

  child.kill("SIGKILL");
  await exited;
}

/**
 * 開一個 `next start`（production build）畀成個 test 檔用，回傳 { baseUrl, stop }。
 *
 * 點解係 production 唔係 `next dev`：呢層 test 驗嘅係對外 HTML / metadata，而真正
 * ship 出去嗰個係 production build。兩層 test（rendered + Playwright e2e）行同一個
 * mode，先至冇「dev 綠、production 紅」呢種假綠。
 *
 * ⚠️ 要先有 build。入口一律行 `npm run test:content` / `npm run verify`（佢哋自己
 * 會 build）；`.next/BUILD_ID` 只證明「build 過」，證明唔到「係最新」。
 */
export async function startNextProduction({ readyPath = "/", timeoutMs = 45_000 } = {}) {
  if (!existsSync(join(projectRoot, ".next", "BUILD_ID"))) {
    throw new Error(
      "rendered test 要 production build，而家搵唔到 .next/BUILD_ID。" +
      "跑 `npm run test:content`（佢會自己 build）或者 `npm run verify`。",
    );
  }

  const port = await reservePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  let output = "";

  const child = spawn("node_modules/.bin/next", ["start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const collect = (chunk) => { output = `${output}${chunk}`.slice(-20_000); };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);

  try {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (child.exitCode !== null) throw new Error(`Next production server exited before rendering the page.\n${output}`);
      try {
        const response = await fetch(`${baseUrl}${readyPath}`);
        if (response.ok) {
          return {
            baseUrl,
            serverOutput: () => output,
            stop: () => terminate(child),
          };
        }
      } catch {
        // The local server is still starting.
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error(`Timed out waiting for rendered page.\n${output}`);
  } catch (error) {
    // 起唔到就要親手收拾：caller 攞唔到 handle，冇人停得到個 process。
    await terminate(child);
    throw error;
  }
}
