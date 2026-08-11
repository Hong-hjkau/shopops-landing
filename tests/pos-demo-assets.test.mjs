import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const imageModulePath = new URL("../lib/pos-feature-images.ts", import.meta.url);
const registerPath = new URL("../docs/pos-demo-screenshot-register.md", import.meta.url);
const orderEntryBaselinePath = fileURLToPath(new URL("./fixtures/pos-demo-order-entry-baseline.webp", import.meta.url));
const orderEntryPath = `${projectRoot}public/pos-demo/order-entry.webp`;
const orderEntryFoodTiles = [
  { name: "happy-meal", left: 142, top: 129, width: 200, height: 200 },
  { name: "egg-fried-rice", left: 354, top: 129, width: 200, height: 200 },
  { name: "seafood-spaghetti", left: 566, top: 129, width: 200, height: 200 },
  { name: "fried-chicken-wings", left: 778, top: 129, width: 200, height: 200 },
  { name: "beef-satay-skewers", left: 142, top: 424, width: 200, height: 201 },
  { name: "caesar-salad", left: 354, top: 424, width: 200, height: 201 },
];
const orderEntryTileRadius = 10;

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

const expectedDimensions = new Map(expectedAssets.map(([id]) => [
  id,
  id === "kitchen-order" || id === "floor-progress" ? [1045, 735] : [1280, 900],
]));

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

test("order-entry replaces only its six rounded menu tiles with distinct food photographs", async () => {
  assert.equal(existsSync(orderEntryBaselinePath), true, "the pre-composite order-entry baseline must be retained for pixel comparison");

  const [baseline, replacement] = await Promise.all([
    sharp(orderEntryBaselinePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(orderEntryPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);
  assert.deepEqual([replacement.info.width, replacement.info.height], [1280, 900]);
  assert.deepEqual([baseline.info.width, baseline.info.height], [1280, 900]);

  const tileHashes = [];
  for (const tile of orderEntryFoodTiles) {
    const { data } = await sharp(orderEntryPath)
      .extract(tile)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const { data: baselineTile } = await sharp(orderEntryBaselinePath)
      .extract(tile)
      .raw()
      .toBuffer({ resolveWithObject: true });
    assert.notDeepEqual(data, baselineTile, `${tile.name}: menu tile must replace its baseline content`);
    assert.ok(new Set(data).size > 16, `${tile.name}: menu tile must not be blank`);
    tileHashes.push(createHash("sha256").update(data).digest("hex"));
  }
  assert.equal(new Set(tileHashes).size, orderEntryFoodTiles.length, "all six menu tiles must be distinct food photographs");

  const roundedMasks = await Promise.all(orderEntryFoodTiles.map(({ width, height }) => sharp(Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" rx="${orderEntryTileRadius}" ry="${orderEntryTileRadius}" fill="white"/></svg>`,
  )).raw().toBuffer({ resolveWithObject: true })));
  const allowedPixelOffsets = new Set();
  for (const [index, tile] of orderEntryFoodTiles.entries()) {
    const { data: mask, info } = roundedMasks[index];
    for (let y = 0; y < tile.height; y += 1) {
      for (let x = 0; x < tile.width; x += 1) {
        if (mask[(y * tile.width + x) * info.channels + (info.channels - 1)] > 0) {
          allowedPixelOffsets.add((tile.top + y) * replacement.info.width + tile.left + x);
        }
      }
    }
  }
  for (let pixel = 0; pixel < replacement.info.width * replacement.info.height; pixel += 1) {
    if (!allowedPixelOffsets.has(pixel)) {
      const offset = pixel * replacement.info.channels;
      assert.deepEqual(
        replacement.data.subarray(offset, offset + replacement.info.channels),
        baseline.data.subarray(offset, offset + baseline.info.channels),
        `pixel ${pixel} outside the six rounded menu masks changed`,
      );
    }
  }
});
