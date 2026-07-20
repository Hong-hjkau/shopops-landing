import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { postsByDate } from "@/lib/posts";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "ShopOps Blog — Running a UK Restaurant Smarter",
  description:
    "Practical guides for UK independent restaurants and cafes: cutting delivery commission and moving your regulars to direct ordering.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "ShopOps Blog — Running a UK Restaurant Smarter",
    description:
      "Practical guides for UK independent restaurants and cafes: cutting delivery commission and moving your regulars to direct ordering.",
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: "ShopOps",
  },
};

export default function BlogIndex() {
  const posts = postsByDate();
  return (
    <section className="px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-semibold text-accent-strong uppercase tracking-wide">
          ShopOps Blog
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-text tracking-tight">
          Running a UK restaurant smarter
        </h1>
        <p className="mt-4 text-text-secondary text-lg leading-relaxed">
          Practical, no-fluff guides for small independent restaurants and
          cafes — keeping more of every order, choosing the right tools, and
          getting customers to come back direct.
        </p>

        <BlogList posts={posts} />
      </div>
    </section>
  );
}
