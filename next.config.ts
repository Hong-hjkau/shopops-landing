import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // 容許 .md / .mdx 檔做頁面（blog 文章用 MDX 寫，方便非工程師改文字）
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    // remark-gfm：MDX 預設唔識 Markdown pipe table / 刪除線 / 自動連結，要呢個先 parse 到表格。
    // ⚠️ Turbopack 序列化唔到 import 入嚟嘅 function，要用 string 形式（Next 16 官方做法）。
    remarkPlugins: [["remark-gfm"]],
  },
});

export default withMDX(nextConfig);
