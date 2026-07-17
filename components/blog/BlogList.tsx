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
                  ? "bg-text text-bg"
                  : "bg-surface text-text-secondary hover:text-text"
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
            className="block rounded-2xl border border-border p-5 sm:p-6 hover:shadow-md hover:border-accent-strong/40 transition"
          >
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="inline-flex items-center rounded-full bg-surface px-2 py-0.5 font-semibold text-text-secondary">
                {langLabel(post.lang)}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-text leading-snug">
              {post.title}
            </h2>
            <p className="mt-2 text-text-secondary leading-relaxed">{post.description}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-accent-strong">
              Read guide →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
