import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import { LangProvider } from "@/components/LangProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 中文字體：刻意唔載 webfont，用系統字體（見 globals.css --font-sans）。
//
// 2026-07-17 試過 Noto Sans TC 求「三個平台中文一模一樣」，production 實測
// 代價太重：首頁 177KB、/pos 368KB、/blog 1,507KB（blog index 一次過列
// 三語六篇文，獨特中文字多）。全站只用到 1,185 個獨特中文字（佔 Noto 覆蓋
// 5.9%），但瀏覽器按 unicode-range 分片攞，攞返嚟九成幾係用唔著嘅字。
//
// 改用系統 stack：0KB、零維護，三個平台各自用返自己嗰隻為螢幕而設嘅好字
// （PingFang TC / Microsoft JhengHei / Android 內建 Noto）。
// 「唔一致」係理論上嘅，實際冇人攞兩部機對比。
//
// ⚠️ 真正嘅中文字 bug 唔係「冇 webfont」，係 body 上有 `font-family: Arial`
// 蓋晒全部、令中文跌落 Arial 嘅 fallback 鏈 —— 嗰個已經喺 globals.css 修咗。
// 唔好因為「中文冇 webfont」就再加返 —— 先跑 Task 9 嘅字體傳輸量實測。

// Default metadata fallback（各 page 自己覆寫）
const TITLE = "ShopOps — 度身訂造軟件 × 業務自動化";
const DESCRIPTION =
  "SHOPOPS:業務流程自動化、度身訂造軟件 / 系統、AI 與數據分析,以及即裝即用嘅自家產品。";
// 分享預覽（OG / Twitter）用英文 —— 主要對象係英國客
const OG_TITLE_EN = "ShopOps — Custom Software & Business Automation";
const OG_DESC_EN =
  "A software team: business process automation, custom software & systems, AI/data analysis, and ready-made products.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
    url: SITE_URL,
    type: "website",
    locale: "en_GB",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE_EN,
    description: OG_DESC_EN,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <LangProvider>{children}</LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
