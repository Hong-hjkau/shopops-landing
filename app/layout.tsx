import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
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

// 中文字體。Geist 冇 CJK 字符，唔載入嘅話繁/简中文會跌返系統預設，
// Windows / macOS / iOS 各自顯示唔同嘅字。
//
// subsets: ["latin"] 唔係手民之誤 —— next/font 對 CJK 字體照樣生成全套
// unicode-range 分片（實測 211 個 @font-face，覆蓋 U+4E00 等 CJK 範圍），
// subsets 只影響 preload 邊幾塊。瀏覽器按頁面用到嘅字下載對應分片。
//
// 刻意只載 400 / 700：CJK 每個 weight 都係成套 211 個分片，加 500/600 會令
// 中文負載倍增（spec 定咗單頁 CJK ≤ 200KB）。代價 —— 中文 font-semibold(600)
// 會跌做 700、font-medium(500) 跌做 400，英文（Geist 可變字體）則有真 weight。
// 中英夾雜時粗細層次會有微妙落差，屬已知取捨，唔係 bug。要加 weight 先驗傳輸量。
const notoTC = Noto_Sans_TC({
  variable: "--font-noto-tc",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
      className={`${geistSans.variable} ${geistMono.variable} ${notoTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <LangProvider>{children}</LangProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
