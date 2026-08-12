import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
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
// server 完全退出之前開始，於是撞返「同一個目錄已經有 dev server」嗰個坑。
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
 * 開一個 `next dev` 畀成個 test 檔用，回傳 { baseUrl, stop }。
 *
 * ⚠️ 同一個 project 目錄唔可以同時開兩個 dev server —— Next 見到已經有一個就會
 * 即刻退出，個 test 檔會收到「Next dev exited before rendering the page」。所以
 * `test:content` 行 `--test-concurrency=1`，每個 test 檔各自 `start()` 一次、
 * `after()` 入面 `stop()`。
 */
export async function startNextDev({ readyPath = "/", timeoutMs = 45_000 } = {}) {
  const port = await reservePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  let output = "";

  const child = spawn("node_modules/.bin/next", ["dev", "--hostname", "127.0.0.1", "--port", String(port)], {
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
      if (child.exitCode !== null) throw new Error(`Next dev exited before rendering the page.\n${output}`);
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
    // 起唔到就要親手收拾：caller 攞唔到 handle，冇人停得到個 process，而佢會一路
    // 霸住個 project 嘅 dev lock，令跟住嗰個 test 檔無辜咁紅。
    await terminate(child);
    throw error;
  }
}
