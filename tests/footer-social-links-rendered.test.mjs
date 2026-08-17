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

function socialLinksSurface(html, path) {
  if (path === "/this-is-you") {
    const beforeComic = html.split(/<img\b/, 1)[0];
    assert.ok(beforeComic, "comic page should render content before its image");
    const socialPosition = beforeComic.indexOf('aria-label="ShopOps contact links"');
    const languagePosition = beforeComic.indexOf('aria-label="language"');
    assert.ok(socialPosition >= 0, "comic page should render contact links before its image");
    assert.ok(languagePosition >= 0, "comic page should render its language switcher");
    assert.ok(socialPosition < languagePosition, "contact links should render above the language switcher");
    return beforeComic;
  }

  const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, "rendered page should contain a header");
  return header;
}

test("mobile-safe homepage logo link keeps an accessible name", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);

  const header = (await response.text()).match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, "homepage should contain a header");
  assert.match(header, /<a(?=[^>]*href="\/)(?=[^>]*aria-label="ShopOps home")[^>]*>/);
});

function anchorWithLabel(surface, label) {
  const anchor = surface.match(
    new RegExp(`<a(?=[^>]*aria-label="${label}")[^>]*>`),
  )?.[0];
  assert.ok(anchor, `top of page should contain a ${label} link`);
  return anchor;
}

for (const path of ["/", "/pos", "/rota", "/blog", "/this-is-you"]) {
  test(`${path} top links to ShopOps email and social profiles without repeating them in the footer`, async () => {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200);

    const html = await response.text();
    const surface = socialLinksSurface(html, path);
    const email = anchorWithLabel(surface, "Email ShopOps");
    const facebook = anchorWithLabel(surface, "ShopOps on Facebook");
    const instagram = anchorWithLabel(surface, "ShopOps on Instagram");

    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer, "rendered page should contain a footer");
    assert.doesNotMatch(footer, /aria-label="ShopOps (?:on Facebook|on Instagram)"/);
    assert.doesNotMatch(footer, /aria-label="Email ShopOps"/);

    assert.match(email, /href="mailto:hello@shopops\.co\.uk"/);
    assert.doesNotMatch(email, /target=/);

    assert.match(facebook, /href="https:\/\/www\.facebook\.com\/profile\.php\?id=61591337769113"/);
    assert.match(instagram, /href="https:\/\/www\.instagram\.com\/shopopsuk"/);

    for (const social of [facebook, instagram]) {
      assert.match(social, /target="_blank"/);
      assert.match(social, /rel="noopener noreferrer"/);
    }
  });
}
