import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const imageModulePath = new URL("../lib/pos-feature-images.ts", import.meta.url);
const registerPath = new URL("../docs/pos-demo-screenshot-register.md", import.meta.url);

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
  const rows = [...register.matchAll(/^\| `[^`]+\.webp` \| `([^`]+)` \| `([^`]+)` \| EN \| (\d+ × \d+) \| (\d+) \| `(\w{64})` \| (PASS) \|$/gm)]
    .map((match) => ({ id: match[1], path: match[2], dimensions: match[3], bytes: Number(match[4]), hash: match[5], approval: match[6] }));

  assert.equal(rows.length, 18);
  assert.deepEqual(rows.map(({ id, path }) => [id, path]), expectedAssets);
  for (const row of rows) {
    const file = readFileSync(`${projectRoot}${row.path}`);
    const actualDimensions = readWebpDimensions(file, row.id);
    assert.equal(row.dimensions, `${actualDimensions[0]} × ${actualDimensions[1]}`, `${row.id}: dimension drift`);
    assert.equal(row.bytes, file.byteLength, `${row.id}: byte count drift`);
    assert.equal(row.hash, createHash("sha256").update(file).digest("hex"), `${row.id}: hash drift`);
    assert.equal(row.approval, "PASS");
  }
});
