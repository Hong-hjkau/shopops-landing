// 站點正式 URL（OG 絕對路徑 / sitemap / robots / JSON-LD 共用嘅 single source of truth）。
// 換域名只改 NEXT_PUBLIC_SITE_URL env var，唔使改 code。
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://shopops-landing.vercel.app";
