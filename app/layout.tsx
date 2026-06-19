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

// 中英雙語 meta：英文行先抽 Edinburgh 本地英文搜尋，中文跟後保留華人圈
const TITLE =
  "ShopOps — Restaurant POS & QR Ordering for Edinburgh｜餐廳點餐管理系統";
const DESCRIPTION =
  "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down. 為 Edinburgh 小型餐廳而設嘅一站式點餐系統：客人 scan QR 自助落單、員工 POS、即時廚房看板，仲有離線後備，斷網都照做生意。";

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
    title:
      "ShopOps — Restaurant POS, QR ordering & kitchen board for Edinburgh",
    description:
      "All-in-one ordering system for small Edinburgh restaurants. QR self-ordering, staff POS, live kitchen board, and offline backup so you keep trading when the cloud goes down.",
  },
};

// JSON-LD 結構化資料：畀 Google rich result 識別 ShopOps 係邊間公司、做咩產品、服務邊個區
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShopOps",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE_URL,
  description:
    "All-in-one ordering system for small Edinburgh restaurants — QR self-ordering, staff POS, live kitchen board and offline backup.",
  areaServed: { "@type": "City", name: "Edinburgh" },
  publisher: {
    "@type": "Organization",
    name: "ShopOps",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LangProvider>{children}</LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
