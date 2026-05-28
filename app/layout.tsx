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
  title: "ShopOps — 餐廳點餐管理系統 | Restaurant Ordering System",
  description:
    "QR 自助點餐 + 員工 POS + 後台管理 + 離線運作，一站式餐廳系統。QR self-order, staff POS, kitchen dashboard, offline-ready.",
  openGraph: {
    title: "ShopOps — Edinburgh 餐廳點餐管理系統",
    description:
      "QR 自助點餐、員工 POS、後台訂單管理、離線運作。一個系統打通客人、樓面、廚房。",
    type: "website",
    locale: "zh_HK",
    siteName: "ShopOps",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopOps — Edinburgh 餐廳點餐管理系統",
    description: "QR ordering, staff POS, kitchen board, offline-ready.",
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
