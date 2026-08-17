import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { startNextDev } from "./helpers/next-server.mjs";

let server;
let baseUrl;

before(async () => {
  server = await startNextDev();
  baseUrl = server.baseUrl;
});

after(async () => {
  await server?.stop();
});

function footerFrom(html) {
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, "rendered page should contain a footer");
  return footer;
}

function anchorWithLabel(footer, label) {
  const anchor = footer.match(
    new RegExp(`<a(?=[^>]*aria-label="${label}")[^>]*>`),
  )?.[0];
  assert.ok(anchor, `footer should contain a ${label} link`);
  return anchor;
}

for (const path of ["/", "/pos", "/rota", "/blog", "/this-is-you"]) {
  test(`${path} footer links to ShopOps email and social profiles`, async () => {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200);

    const footer = footerFrom(await response.text());
    const email = anchorWithLabel(footer, "Email ShopOps");
    const facebook = anchorWithLabel(footer, "ShopOps on Facebook");
    const instagram = anchorWithLabel(footer, "ShopOps on Instagram");

    assert.match(email, /href="mailto:hello@shopops\.co\.uk"/);
    assert.doesNotMatch(email, /target=/);

    assert.match(facebook, /href="https:\/\/www\.facebook\.com\/ShopOps"/);
    assert.match(instagram, /href="https:\/\/www\.instagram\.com\/shopopsuk"/);

    for (const social of [facebook, instagram]) {
      assert.match(social, /target="_blank"/);
      assert.match(social, /rel="noopener noreferrer"/);
    }
  });
}
