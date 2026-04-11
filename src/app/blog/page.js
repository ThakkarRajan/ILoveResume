"use client";

import Link from "next/link";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { blogPosts } from "../../data/blog-posts";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
            <FileText className="h-6 w-6 text-blue-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.25rem]">Resume & career blog</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
            Notes on ATS, job descriptions, and how to present experience clearly.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 sm:p-8"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-800">{post.category}</span>
                <span className="flex items-center gap-1 text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {post.date}
                </span>
                <span className="text-zinc-500">{post.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-700">
                Read article
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline">
            ← Back to home
          </Link>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <SiteLegalLinks />
        </div>
      </div>
    </div>
  );
}
