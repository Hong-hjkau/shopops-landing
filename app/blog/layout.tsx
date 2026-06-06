import Link from "next/link";
import Image from "next/image";

// Blog 區共用外殼：ShopOps 頂部 nav（logo 連返首頁）+ footer。
// 對齊首頁 page.tsx 嘅 sticky 白 nav / orange CTA / footer 風格。
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang="en"：blog 內容係英文，但 root <html> 係 zh-Hant；
    // 喺度 scope 返英文，畀 Google / screen reader 正確語言訊號（呢個係 SEO 功能，語言要啱）
    <div lang="en" className="flex flex-col min-h-full">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt=""
              width={512}
              height={496}
              className="h-8 w-auto"
            />
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              ShopOps
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-gray-600">
            <Link href="/blog" className="hover:text-gray-900 transition">
              Blog
            </Link>
            <Link
              href="/#contact"
              className="hidden sm:inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Book a Demo
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="px-4 sm:px-6 py-8 border-t border-gray-100 text-center text-sm text-gray-500">
        © 2026 ShopOps · Edinburgh ·{" "}
        <Link href="/" className="underline hover:text-gray-700">
          Home
        </Link>
      </footer>
    </div>
  );
}
