import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const imageModulePath = new URL("../lib/pos-feature-images.ts", import.meta.url);
const registerPath = new URL("../docs/pos-demo-screenshot-register.md", import.meta.url);
const orderEntryPath = `${projectRoot}public/pos-demo/order-entry.webp`;
// 六格食物相喺 harness 產生嘅 order-entry 入面嘅位置（由資產本身量返，唔係憑記憶）。
const orderEntryFoodTiles = [
  { name: "happy-meal", left: 142, top: 78, width: 200, height: 200 },
  { name: "egg-fried-rice", left: 354, top: 78, width: 200, height: 200 },
  { name: "seafood-spaghetti", left: 566, top: 78, width: 200, height: 200 },
  { name: "fried-chicken-wings", left: 778, top: 78, width: 200, height: 200 },
  { name: "beef-satay-skewers", left: 142, top: 339, width: 200, height: 200 },
  { name: "caesar-salad", left: 354, top: 339, width: 200, height: 200 },
];

const expectedAssets = [
  ["order-entry", "public/pos-demo/order-entry.webp"],
  ["kitchen-order", "public/pos-demo/kitchen-order.webp"],
  ["floor-progress", "public/pos-demo/floor-progress.webp"],
  ["checkout-report", "public/pos-demo/checkout-report.webp"],
  ["bilingual", "public/pos-demo/core/bilingual.webp"],
  ["offline_backup", "public/pos-demo/core/offline_backup.webp"],
  ["menu_management", "public/pos-demo/core/menu_management.webp"],
  ["sold_out", "public/pos-demo/core/sold_out.webp"],
  ["delivery", "public/pos-demo/add-ons/delivery.webp"],
  ["finance_inventory", "public/pos-demo/add-ons/finance_inventory.webp"],
  ["scheduling", "public/pos-demo/add-ons/scheduling.webp"],
  ["reservations", "public/pos-demo/add-ons/reservations.webp"],
  ["reviews", "public/pos-demo/add-ons/reviews.webp"],
  ["food_safety", "public/pos-demo/add-ons/food_safety.webp"],
  ["allergens", "public/pos-demo/add-ons/allergens.webp"],
  ["recipe_costing", "public/pos-demo/add-ons/recipe_costing.webp"],
  ["custom_domain", "public/pos-demo/add-ons/custom_domain.webp"],
  ["signage", "public/pos-demo/add-ons/signage.webp"],
];

// 十八張全部 1280×900。kitchen-order / floor-progress 之前係 1045×735 特例，因為嗰兩張
// 係人手影完再裁走側欄；佢哋而家同其餘一樣由 screenshot harness 用固定 viewport 產生，
// 冇咗裁圖呢一步，特例亦都冇咗。
const expectedDimensions = new Map(expectedAssets.map(([id]) => [id, [1280, 900]]));

function readUint24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function readWebpDimensions(file, id) {
  assert.ok(file.length >= 30, `${id}: WebP container is truncated`);
  assert.equal(file.readUInt32LE(4) + 8, file.length, `${id}: RIFF length does not match file length`);

  let offset = 12;
  while (offset + 8 <= file.length) {
    const chunkType = file.subarray(offset, offset + 4).toString("ascii");
    const chunkSize = file.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    const chunkEnd = dataOffset + chunkSize;
    assert.ok(chunkEnd <= file.length, `${id}: ${chunkType} chunk is truncated`);

    if (chunkType === "VP8 ") {
      assert.ok(chunkSize >= 10, `${id}: VP8 frame header is truncated`);
      assert.deepEqual([...file.subarray(dataOffset + 3, dataOffset + 6)], [0x9d, 0x01, 0x2a], `${id}: invalid VP8 frame header`);
      return [file.readUInt16LE(dataOffset + 6) & 0x3fff, file.readUInt16LE(dataOffset + 8) & 0x3fff];
    }
    if (chunkType === "VP8L") {
      assert.ok(chunkSize >= 5, `${id}: VP8L frame header is truncated`);
      assert.equal(file[dataOffset], 0x2f, `${id}: invalid VP8L signature`);
      const bits = file.readUInt32LE(dataOffset + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    if (chunkType === "VP8X") {
      assert.ok(chunkSize >= 10, `${id}: VP8X frame header is truncated`);
      return [readUint24LE(file, dataOffset + 4) + 1, readUint24LE(file, dataOffset + 7) + 1];
    }
    offset = chunkEnd + (chunkSize % 2);
  }
  assert.fail(`${id}: WebP image frame chunk is missing`);
}

function parseImageContract() {
  const source = readFileSync(imageModulePath, "utf8");
  const imports = new Map(
    [...source.matchAll(/^import (\w+) from "\.\.\/(public\/pos-demo\/[^"\n]+\.webp)";$/gm)]
      .map((match) => [match[1], match[2]]),
  );
  const mapBody = source.match(/export const POS_FEATURE_IMAGES[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1];
  assert.ok(mapBody, "POS_FEATURE_IMAGES should be an explicit typed object map");
  const entries = [...mapBody.matchAll(/^\s*"([\w-]+)":\s*(\w+),$/gm)]
    .map((match) => [match[1], imports.get(match[2])]);
  return { source, entries };
}

test("POS image contract maps the exact 18 stable IDs to 18 unique WebP paths", () => {
  const { source, entries } = parseImageContract();

  assert.match(source, /export type PosFeatureImageId\s*=/);
  assert.match(source, /Record<PosFeatureImageId, StaticImageData>/);
  assert.deepEqual(entries, expectedAssets);
  assert.equal(new Set(entries.map(([, path]) => path)).size, 18);
});

test("all 18 POS image contract files exist and decode as the approved WebP dimensions", async () => {
  const actualPaths = readdirSync(`${projectRoot}public/pos-demo`, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".webp"))
    .map((entry) => `public/pos-demo/${entry.parentPath.replace(`${projectRoot}public/pos-demo`, "").replace(/^\//, "")}${entry.parentPath.endsWith("pos-demo") ? "" : "/"}${entry.name}`)
    .sort();
  assert.deepEqual(actualPaths, expectedAssets.map(([, path]) => path).sort());

  const hashes = [];
  for (const [id, relativePath] of expectedAssets) {
    const absolutePath = `${projectRoot}${relativePath}`;
    assert.equal(existsSync(absolutePath), true, `${id}: missing ${relativePath}`);
    const file = readFileSync(absolutePath);
    assert.equal(file.subarray(0, 4).toString("ascii"), "RIFF", `${id}: missing RIFF signature`);
    assert.equal(file.subarray(8, 12).toString("ascii"), "WEBP", `${id}: missing WEBP signature`);
    assert.deepEqual(readWebpDimensions(file, id), expectedDimensions.get(id), `${id}: source dimensions drifted`);
    const decoded = await sharp(file).raw().toBuffer({ resolveWithObject: true });
    assert.deepEqual([decoded.info.width, decoded.info.height], expectedDimensions.get(id), `${id}: decoded dimensions drifted`);
    assert.ok(decoded.data.byteLength > 0, `${id}: decoded image contains no pixels`);
    hashes.push(createHash("sha256").update(file).digest("hex"));
  }
  assert.equal(new Set(hashes).size, 18, "all 18 feature images should be distinct files");
});

test("screenshot register reconciles one row per mapped asset with current bytes and SHA-256", () => {
  const register = readFileSync(registerPath, "utf8");
  const rows = [...register.matchAll(/^\| `[^`]+\.webp` \| `([^`]+)` \| `([^`]+)` \| EN \| (\d+ × \d+) \| (\d+) \| `(\w{64})` \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
    .map((match) => ({
      id: match[1],
      path: match[2],
      dimensions: match[3],
      bytes: Number(match[4]),
      hash: match[5],
      contentGate: match[6],
      trademarkGate: match[7],
      licenceGate: match[8],
    }));

  assert.equal(rows.length, 18);
  assert.deepEqual(rows.map(({ id, path }) => [id, path]), expectedAssets);
  for (const row of rows) {
    const file = readFileSync(`${projectRoot}${row.path}`);
    const actualDimensions = readWebpDimensions(file, row.id);
    assert.equal(row.dimensions, `${actualDimensions[0]} × ${actualDimensions[1]}`, `${row.id}: dimension drift`);
    assert.equal(row.bytes, file.byteLength, `${row.id}: byte count drift`);
    assert.equal(row.hash, createHash("sha256").update(file).digest("hex"), `${row.id}: hash drift`);
    assert.equal(row.contentGate, "PASS", `${row.id}: English / PII / commercial data / readability gate is not ticked`);
  }
});

test("every registered asset carries a ticked third-party trademark and asset licence gate", () => {
  const register = readFileSync(registerPath, "utf8");

  assert.match(
    register,
    /\| SHA-256 \| English \/ PII \/ commercial data \/ readability \| No third-party logo or trademark \| Asset licence and ownership confirmed \|/,
    "the last two register columns must stay named after the trademark and licence gates they record",
  );

  const rows = [...register.matchAll(/^\| `([^`]+\.webp)` \|(?:[^|]*\|){5} `\w{64}` \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
    .map((match) => ({ asset: match[1], trademarkGate: match[3], licenceGate: match[4] }));

  assert.equal(rows.length, 18, "the trademark and licence gates must cover all 18 registered assets, not only order-entry");
  assert.deepEqual(rows.map(({ asset }) => asset), expectedAssets.map(([, path]) => path.split("/").at(-1)));
  for (const row of rows) {
    assert.equal(row.trademarkGate, "PASS", `${row.asset}: no third-party logo or trademark gate is not ticked`);
    assert.equal(row.licenceGate, "PASS", `${row.asset}: asset licence and ownership gate is not ticked`);
  }

  for (const [phrase, why] of [
    [/manual approval gate/i, "call the two columns a manual approval gate"],
    [/not automated detection/i, "say the gate is not automated detection"],
    [/cannot recognise a trademark/i, "say this test cannot recognise a trademark itself"],
  ]) {
    assert.match(register, phrase, `the register must ${why}, so nobody reads a ticked row as a machine-verified one`);
  }
});

test("order-entry shows six distinct, non-blank food photographs", async () => {
  // 舊契約係「同一張未貼相嘅底圖逐粒 pixel 對比，只准六格圓角位唔同」。嗰個係為咗守住一個
  // **人手貼相**嘅流程：有人事後 P 圖就會即刻紅。
  //
  // 而家張圖由 screenshot harness 由零 render，六張已批准嘅相係 fixture 一部分，
  // 「未貼相嘅底圖」呢個中間產物根本唔再存在 —— 要維持舊契約就要特登 render 多一次冇相版
  // 去遷就個測試。所以契約改成驗**六格真係有六張唔同嘅相**，資產本身嘅完整性交返
  // register 嘅 SHA-256 同人眼閘。
  //
  // ⚠️ 明確講清楚放寬咗乜：有人繞過 harness、直接喺呢個 repo 換走 order-entry.webp，
  // 呢條 test 唔會再即刻紅。守住嗰道閘而家係 register（SHA 對唔上就要重新 tick）。
  const tiles = [];
  for (const tile of orderEntryFoodTiles) {
    const { data, info } = await sharp(orderEntryPath)
      .extract(tile)
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 相片有色彩變化；空格 / 灰色 placeholder 冇。
    let minLuma = 255;
    let maxLuma = 0;
    let saturated = 0;
    for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
      const offset = pixel * info.channels;
      const [r, g, b] = [data[offset], data[offset + 1], data[offset + 2]];
      const luma = (r * 299 + g * 587 + b * 114) / 1000;
      minLuma = Math.min(minLuma, luma);
      maxLuma = Math.max(maxLuma, luma);
      if (Math.max(r, g, b) - Math.min(r, g, b) > 30) saturated += 1;
    }
    const saturatedRatio = saturated / (info.width * info.height);

    assert.ok(maxLuma - minLuma > 80,
      `${tile.name}: tile spans only ${Math.round(maxLuma - minLuma)} luma levels, so it is not a photograph`);
    assert.ok(saturatedRatio > 0.2,
      `${tile.name}: only ${(saturatedRatio * 100).toFixed(0)}% of the tile is coloured — a grey placeholder would look like this`);

    tiles.push(createHash("sha256").update(data).digest("hex"));
  }

  assert.equal(new Set(tiles).size, orderEntryFoodTiles.length,
    "all six menu tiles must be different photographs, not the same one repeated");
});
