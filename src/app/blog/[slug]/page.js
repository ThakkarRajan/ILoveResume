import Link from "next/link";
import { blogPosts } from "../../../data/blog-posts";
import { postContent } from "../../../data/blog-content";
import SiteLegalLinks from "../../../components/legal/SiteLegalLinks";
import { ArrowLeft, Calendar } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };
  const url = `https://iloveresumes.ca/blog/${post.slug}`;
  const pageTitle = post.metaTitle ?? `${post.title} | I Love Resumes Blog`;
  const pageDescription = post.metaDescription ?? post.excerpt;
  return {
    title: pageTitle,
    description: pageDescription,
    alternates: { canonical: url },
    keywords: post.tags?.join(", "),
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: pageDescription,
      url,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: "https://iloveresumes.ca/logo.png",
          width: 1200,
          height: 630,
          alt: post.coverImageAlt ?? "I Love Resumes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? post.title,
      description: pageDescription,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const content = post ? postContent[slug] : null;

  if (!post || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-900">Post not found</h1>
          <Link href="/blog" className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "I Love Resumes", url: "https://iloveresumes.ca" },
    publisher: { "@type": "Organization", name: "I Love Resumes", logo: { "@type": "ImageObject", url: "https://iloveresumes.ca/logo.png" } },
    url: `https://iloveresumes.ca/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://iloveresumes.ca/blog/${post.slug}` },
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" itemScope itemType="https://schema.org/BlogPosting">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back to blog
        </Link>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">{post.category}</span>
            <time dateTime={post.date} itemProp="datePublished" className="flex items-center gap-1 text-sm text-zinc-500">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
              {post.date}
            </time>
            <span className="text-sm text-zinc-500">{post.readTime}</span>
          </div>

          <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-[2rem] lg:leading-snug" itemProp="headline">
            {post.title}
          </h1>

          <div
            className="blog-content text-zinc-600 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_p]:mb-4 [&_p]:leading-relaxed [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-800"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: content.content.trim() }}
          />
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
          >
            Open resume builder
          </Link>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <SiteLegalLinks />
        </div>
      </article>
    </div>
  );
}
