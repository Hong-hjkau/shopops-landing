"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts";
import { langLabel } from "@/lib/posts";

// Blog index 嘅文章列表 + 語言篩選。抽成 client component，令 page.tsx
// 維持 server component（保留 metadata export）。篩選純前端 state。

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

type Filter = "all" | Post["lang"];

export default function BlogList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  // 只顯示實際存在嘅語言 pill（避免「簡」未有文都出個空 tab）
  const langsPresent = Array.from(new Set(posts.map((p) => p.lang)));
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    ...langsPresent.map((l) => ({ key: l as Filter, label: langLabel(l) })),
  ];

  const shown = filter === "all" ? posts : posts.filter((p) => p.lang === filter);

  return (
    <>
      {filters.length > 2 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                filter === f.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 space-y-4">
        {shown.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-semibold text-gray-600">
                {langLabel(post.lang)}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              {post.title}
            </h2>
            <p className="mt-2 text-gray-600 leading-relaxed">{post.description}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-orange-600">
              Read guide →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
