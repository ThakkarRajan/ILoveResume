import Link from "next/link";
import { blogPosts } from "../../../data/blog-posts";
import { postContent } from "../../../data/blog-content";
import { ArrowLeft, Calendar } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  const url = `https://iloveresumes.ca/blog/${post.slug}`;
  return {
    title: `${post.title} | I Love Resumes Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: "https://iloveresumes.ca/logo.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const content = post ? postContent[slug] : null;

  if (!post || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
          <Link href="/blog" className="text-purple-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "I Love Resumes", url: "https://iloveresumes.ca" },
    publisher: { "@type": "Organization", name: "I Love Resumes", logo: { "@type": "ImageObject", url: "https://iloveresumes.ca/logo.png" } },
    url: `https://iloveresumes.ca/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://iloveresumes.ca/blog/${post.slug}` },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16" itemScope itemType="https://schema.org/BlogPosting">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-white/50 shadow-lg">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <time dateTime={post.date} itemProp="datePublished" className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </time>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6" itemProp="headline">
            {post.title}
          </h1>

          <div
            className="blog-content text-gray-600 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_p]:mb-4 [&_p]:leading-relaxed [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: content.content.trim() }}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Try Our Free AI Resume Builder
          </Link>
        </div>
      </article>
    </div>
  );
}
