import Link from "next/link";
import { blogPosts } from "../../../data/blog-posts";
import { postContent } from "../../../data/blog-content";
import SiteLegalLinks from "../../../components/legal/SiteLegalLinks";
import JsonLd from "../../../components/seo/JsonLd";
import BlogPostHero from "../../../components/blog/BlogPostHero";
import BlogCasualAside from "../../../components/blog/BlogCasualAside";
import BlogSquiggle from "../../../components/blog/BlogSquiggle";
import { getBlogCover } from "../../../data/blog-visuals";
import { ArrowLeft, Calendar } from "lucide-react";
import { pageMeta, SITE_NAME, SITE_URL } from "../../../config/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  const pageTitle = post.metaTitle ?? `${post.title} | I Love Resumes Blog`;
  const pageDescription = post.metaDescription ?? post.excerpt;
  const base = pageMeta({
    title: pageTitle,
    description: pageDescription,
    path: `/blog/${post.slug}`,
    ogType: "article",
  });

  const cover = getBlogCover(post.slug);
  const coverAlt = post.coverImageAlt ?? `${post.title} — article cover`;

  return {
    ...base,
    keywords: post.tags?.join(", "),
    openGraph: {
      ...base.openGraph,
      publishedTime: post.date,
      modifiedTime: post.date,
      images: [{ url: cover.src, width: 1600, height: 1000, alt: coverAlt }],
    },
    twitter: {
      ...base.twitter,
      images: [cover.src],
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

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const cover = getBlogCover(post.slug);
  const coverAlt = post.coverImageAlt ?? `${post.title} — article cover`;
  const orgLogoUrl = `${SITE_URL}/logo.png`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.metaDescription ?? post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: orgLogoUrl },
        },
        image: cover.src,
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        url: postUrl,
        ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/40 via-zinc-50 to-zinc-50 text-zinc-900">
      <JsonLd data={structuredData} />
      <article
        className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        itemScope
        itemType="https://schema.org/BlogPosting"
      >
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Back to blog
        </Link>

        <BlogPostHero slug={post.slug} alt={coverAlt} />

        <div className="rounded-2xl border border-zinc-200/90 bg-white/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-[2px] sm:p-8 lg:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800">
              {post.category}
            </span>
            <time dateTime={post.date} itemProp="datePublished" className="flex items-center gap-1 text-sm text-zinc-500">
              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
              {post.date}
            </time>
            <span className="text-sm text-zinc-500">{post.readTime}</span>
          </div>

          <h1
            className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl lg:text-[2rem] lg:leading-snug"
            itemProp="headline"
          >
            {post.title}
          </h1>

          <div className="mx-auto mt-5 max-w-md">
            <BlogSquiggle className="h-3 w-full text-violet-400" gradientId={`blog-sq-${post.slug}`} />
          </div>

          <BlogCasualAside slug={post.slug} category={post.category} />

          <div
            className="blog-content"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: content.content.trim() }}
          />
        </div>

        <nav className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm sm:p-8" aria-label="Related guides">
          <h2 className="text-sm font-semibold text-zinc-900">Related on I Love Resumes</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            These guides pair well with this article. Use the free builder to apply the ideas to your own resume and export Word or PDF.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-blue-700">
            <li>
              <Link href="/how-to-tailor-a-resume-to-a-job-description" className="font-medium underline-offset-2 hover:underline">
                How to tailor a resume to a job description
              </Link>
            </li>
            <li>
              <Link href="/ats-friendly-resume" className="font-medium underline-offset-2 hover:underline">
                ATS-friendly resume basics
              </Link>
            </li>
            <li>
              <Link href="/resume-builder-canada" className="font-medium underline-offset-2 hover:underline">
                Resume builder for Canada
              </Link>
            </li>
            <li>
              <Link href="/resume-templates" className="font-medium underline-offset-2 hover:underline">
                Resume templates and structure
              </Link>
            </li>
          </ul>
        </nav>

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
