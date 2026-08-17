import Link from "next/link";
import Image from "next/image";
import SocialLinks from "@/components/SocialLinks";

// Blog 區共用外殼：ShopOps 頂部 nav（logo 連返首頁）+ footer。
// 對齊首頁 page.tsx 嘅 sticky 白 nav / orange CTA / footer 風格。
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // blog 外殼語言中性：語言由每篇文章自己 scope（<article lang={post.lang}>），
    // 因為 blog 而家有英文 + 中文版，唔可以喺外殼硬寫一種語言
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-20 bg-bg/80 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt=""
              width={512}
              height={496}
              className="h-8 w-auto"
            />
            <span className="font-bold text-text text-lg tracking-tight">
              ShopOps
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-text-secondary">
            <SocialLinks compact />
            <Link href="/blog" className="hover:text-text transition">
              Blog
            </Link>
            <Link
              href="/pos#contact"
              className="hidden sm:inline-flex px-4 py-2 bg-text text-bg text-sm font-semibold rounded-lg hover:bg-text-secondary transition"
            >
              Book a Demo
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="px-4 sm:px-6 py-8 border-t border-border text-center text-sm text-text-secondary">
        © 2026 ShopOps · Edinburgh ·{" "}
        <Link href="/" className="underline hover:text-text">
          Home
        </Link>
      </footer>
    </div>
  );
}
