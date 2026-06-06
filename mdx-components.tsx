import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// 全站 MDX 文章嘅統一排版。對齊 landing 既有風格：
// gray-900 標題 / gray-700 內文 / orange 連結 accent / 卡片式表格。
// 唔用 @tailwindcss/typography plugin，逐個 tag 上 class，慳一個 dep。
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-2 mb-6 leading-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-12 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-5">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-700 text-base sm:text-lg marker:text-orange-500">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-700 text-base sm:text-lg marker:text-orange-500">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900">{children}</strong>
    ),
    a: ({ href, children }) => {
      const url = href ?? "#";
      const isInternal = url.startsWith("/") || url.startsWith("#");
      const className =
        "text-orange-600 font-medium underline underline-offset-2 hover:text-orange-700 transition";
      return isInternal ? (
        <Link href={url} className={className}>
          {children}
        </Link>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-orange-400 bg-orange-50 pl-4 pr-3 py-2 my-6 text-gray-800 italic rounded-r-lg">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-gray-200" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm sm:text-base text-left border-collapse">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 text-gray-900">{children}</thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 font-semibold border-b border-gray-200">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-gray-700 border-b border-gray-100 align-top">
        {children}
      </td>
    ),
    ...components,
  };
}
