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

// Default metadata fallback（各 page 自己覆寫）
const TITLE = "ShopOps — 度身訂造軟件 × 業務自動化";
const DESCRIPTION =
  "SHOPOPS:業務流程自動化、度身訂造軟件 / 系統、AI 與數據分析,以及即裝即用嘅自家產品。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Custom Software & Business Automation",
    description:
      "A software team: business process automation, custom software & systems, AI/data analysis, and ready-made products.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <LangProvider>{children}</LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
