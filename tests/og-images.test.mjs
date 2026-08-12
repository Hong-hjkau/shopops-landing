import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { startNextDev } from "./helpers/next-server.mjs";

// `/pos/features` 嗰張由 tests/pos-features-rendered.test.mjs 逐語言驗（嗰度仲要
// 對埋三語分享文案）。呢個檔補返其餘四條 —— 佢哋由頭到尾冇 test 驗過張分享圖
// 出唔出到，宣告咗 summary_large_image 但分享出去係白卡都唔會有人知。
const ROUTES = [
  { path: "/", image: "/opengraph-image" },
  { path: "/pos", image: "/pos/opengraph-image" },
  { path: "/rota", image: "/rota/opengraph-image" },
  { path: "/this-is-you", image: "/this-is-you/opengraph-image" },
];

let server;

before(async () => {
  server = await startNextDev();
}, { timeout: 50_000 });

after(async () => {
  await server?.stop();
});

function metaContent(html, key) {
  const tag = html.match(new RegExp(`<meta(?=[^>]*(?:property|name)="${key}")[^>]*>`))?.[0];
  assert.ok(tag, `response should contain ${key} metadata`);
  const content = tag.match(/content="([^"]*)"/)?.[1];
  assert.ok(content, `${key} metadata should have content`);
  return content;
}

test("every public route declares a share image and actually serves it", async () => {
  for (const { path, image } of ROUTES) {
    const response = await fetch(`${server.baseUrl}${path}`);
    assert.equal(response.status, 200, `${path} should render`);
    const html = await response.text();

    assert.equal(metaContent(html, "twitter:card"), "summary_large_image",
      `${path} promises a large share card`);
    const ogImage = metaContent(html, "og:image");
    assert.equal(metaContent(html, "twitter:image"), ogImage,
      `${path}: Twitter and Open Graph should share one image`);
    // 精確比對，唔用 startsWith：`/pos/opengraph-image-old` 咁樣宣告錯，只要
    // 嗰條 endpoint 啱啱好出到一張 PNG，前綴式比對就會照過。
    assert.equal(new URL(ogImage).pathname, image,
      `${path} declares ${ogImage}, which is not its own share image`);
    assert.equal(metaContent(html, "og:image:type"), "image/png");
    assert.equal(metaContent(html, "og:image:width"), "1200");
    assert.equal(metaContent(html, "og:image:height"), "630");

    // metadataBase 指住 production origin，所以攞同一條 path 落本機 server。
    const declared = new URL(ogImage);
    const served = await fetch(`${server.baseUrl}${declared.pathname}${declared.search}`);
    assert.equal(served.status, 200, `${path}: ${declared.pathname} should be served`);
    assert.equal(served.headers.get("content-type"), "image/png");
    const bytes = new Uint8Array(await served.arrayBuffer());
    assert.ok(bytes.byteLength > 1000, `${path}: share image should not be empty`);
    assert.deepEqual([...bytes.slice(0, 4)], [0x89, 0x50, 0x4e, 0x47],
      `${path}: share image should be a real PNG`);
  }
});
