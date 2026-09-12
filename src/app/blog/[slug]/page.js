import Link from "next/link";
import { blogPosts } from "../../../data/blog-posts";
import { postContent } from "../../../data/blog-content";
import JsonLd from "../../../components/seo/JsonLd";
import BlogPostHero from "../../../components/blog/BlogPostHero";
import BlogCasualAside from "../../../components/blog/BlogCasualAside";
import BlogSquiggle from "../../../components/blog/BlogSquiggle";
import MarketingShell from "../../../components/ui/MarketingShell";
import BreadcrumbNav from "../../../components/ui/BreadcrumbNav";
import { getBlogCover } from "../../../data/blog-visuals";
import { Calendar } from "lucide-react";
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
      <MarketingShell narrow footerClassName="mt-10">
        <div className="py-12 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">Post not found</h1>
          <p className="mt-2 text-sm text-zinc-600">That article may have moved or never existed.</p>
          <Link href="/blog" className="btn btn-primary mt-6">
            Back to blog
          </Link>
        </div>
      </MarketingShell>
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
    <MarketingShell narrow>
      <JsonLd data={structuredData} />
      <article itemScope itemType="https://schema.org/BlogPosting">
        <BreadcrumbNav
          items={[
            { href: "/", label: "Home" },
            { href: "/blog", label: "Blog" },
            { label: post.title },
          ]}
        />

        <BlogPostHero slug={post.slug} alt={coverAlt} />

        <div className="panel">
          <div className="panel-body">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="badge badge-info">{post.category}</span>
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

          

            <BlogCasualAside slug={post.slug} category={post.category} />

            <div
              className="blog-content"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: content.content.trim() }}
            />
          </div>
        </div>

        <nav className="panel mt-10" aria-label="Related guides">
          <div className="panel-body">
            <h2 className="panel-title">Related on I Love Resumes</h2>
            <p className="panel-desc">
              These guides pair well with this article. Use the free builder to apply the ideas to your own resume and export Word or PDF.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--accent)]">
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
                  Resume norms for Canada
                </Link>
              </li>
              <li>
                <Link href="/resume-templates" className="font-medium underline-offset-2 hover:underline">
                  Resume templates and structure
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-10 text-center">
          <Link href="/" className="btn btn-primary">
            Open resume builder
          </Link>
        </div>
      </article>
    </MarketingShell>
  );
}
