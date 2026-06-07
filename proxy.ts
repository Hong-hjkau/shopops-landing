import { NextResponse, type NextRequest } from "next/server";

// ⚠️ TEMPORARY "COMING SOON" GATE — landing not ready for public (HONG, 2026-06-07).
// This intercepts every request and returns a self-contained holding page so the
// real site (homepage, pricing, blog) stays hidden from the public / competitors.
// TO BRING THE SITE BACK ONLINE: delete this file and push. Nothing else changes —
// all real content is untouched in the repo.

const COMING_SOON_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>ShopOps — Coming soon</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0a0a0a;
    color: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 24px;
    line-height: 1.6;
  }
  .wrap { max-width: 520px; text-align: center; }
  .brand { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 40px; }
  .logo {
    width: 44px; height: 44px; border-radius: 11px;
    background: #161616; border: 1px solid #2a2a2a;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 24px; color: #f97316;
  }
  .word { font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
  h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; }
  h1 .accent { color: #f97316; }
  p { color: #a3a3a3; font-size: 17px; margin-bottom: 32px; }
  a.contact {
    color: #f97316; text-decoration: none; font-weight: 600; font-size: 15px;
    border-bottom: 1px solid rgba(249,115,22,0.4); padding-bottom: 2px;
  }
  a.contact:hover { border-bottom-color: #f97316; }
  @media (max-width: 480px) { h1 { font-size: 27px; } p { font-size: 16px; } }
</style>
</head>
<body>
  <div class="wrap">
    <div class="brand">
      <div class="logo">S</div>
      <div class="word">ShopOps</div>
    </div>
    <h1>Something great is <span class="accent">coming soon</span>.</h1>
    <p>Smarter operations for independent UK restaurants &amp; cafes — keeping more of every order. We&rsquo;re putting the finishing touches in place.</p>
    <a class="contact" href="mailto:wspeedw13@gmail.com">Get in touch &rarr;</a>
  </div>
</body>
</html>`;

export function proxy(_req: NextRequest) {
  return new NextResponse(COMING_SOON_HTML, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store, max-age=0",
    },
  });
}

// Intercept every route (homepage, /blog, /api, robots, sitemap…).
// Only let Next's internal asset pipeline + favicon through so the page renders.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
