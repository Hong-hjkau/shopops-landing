import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { postsByDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "ShopOps Blog — Running a UK Restaurant Smarter",
  description:
    "Practical guides for UK independent restaurants and cafes: cutting delivery commission, choosing a POS, taking bookings without fees, and getting more reviews.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ShopOps Blog — Running a UK Restaurant Smarter",
    description:
      "Practical guides for UK independent restaurants and cafes: cutting delivery commission, choosing a POS, taking bookings without fees, and getting more reviews.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "ShopOps",
  },
};

// 月份名（日期顯示），避免 toLocaleDateString 喺 server/client locale 唔一致
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export default function BlogIndex() {
  const posts = postsByDate();
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
          ShopOps Blog
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Running a UK restaurant smarter
        </h1>
        <p className="mt-4 text-gray-600 text-lg leading-relaxed">
          Practical, no-fluff guides for small independent restaurants and
          cafes — keeping more of every order, choosing the right tools, and
          getting customers to come back direct.
        </p>

        <div className="mt-10 space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md hover:border-gray-300 transition"
            >
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {post.title}
              </h2>
              <p className="mt-2 text-gray-600 leading-relaxed">
                {post.description}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-orange-600">
                Read guide →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
