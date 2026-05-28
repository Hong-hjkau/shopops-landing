import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "ShopOps — Edinburgh 餐廳 QR 點餐、員工 POS、後台訂單管理一站式系統",
  description:
    "為 Edinburgh 小型餐廳（堂食 / 外賣 / 雲廚房）而設嘅一站式系統。客人 scan QR 自助落單，員工 POS 一頁搞掂堂食外賣，後台即時睇訂單狀態。仲有本機後備，斷網都照樣做生意。",
  openGraph: {
    title:
      "ShopOps — Edinburgh 餐廳 QR 點餐、員工 POS、後台訂單管理一站式系統",
    description:
      "為 Edinburgh 小型餐廳（堂食 / 外賣 / 雲廚房）而設嘅一站式系統。客人 scan QR 自助落單，員工 POS 一頁搞掂堂食外賣，後台即時睇訂單狀態。仲有本機後備，斷網都照樣做生意。",
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
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
