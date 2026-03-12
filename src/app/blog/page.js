"use client";

import Link from "next/link";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { blogPosts } from "../../data/blog-posts";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
            Resume & Career Blog
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Expert tips on resumes, ATS optimization, job descriptions, and career growth.
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/50 shadow-lg hover:shadow-xl hover:border-purple-200/50 transition-all duration-200 group"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-purple-600 font-medium text-sm group-hover:gap-3 transition-all">
                Read article
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
