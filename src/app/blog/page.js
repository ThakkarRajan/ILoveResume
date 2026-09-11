import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { blogPosts } from "../../data/blog-posts";
import { getBlogCover } from "../../data/blog-visuals";
import PageHeader from "../../components/ui/PageHeader";
import MarketingShell from "../../components/ui/MarketingShell";

export default function BlogPage() {
  return (
    <MarketingShell>
      <PageHeader
        eyebrow="Blog"
        title="Resume & career blog"
        description="Practical reads on ATS, tailoring, and Canadian job search."
      />

      <div className="grid gap-4 sm:gap-5">
        {blogPosts.map((post) => {
          const cover = getBlogCover(post.slug);
          const alt = post.coverImageAlt ?? `${post.title} — article cover`;
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-interactive group flex flex-col overflow-hidden sm:flex-row"
            >
              <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-100 sm:aspect-auto sm:h-auto sm:w-52 sm:min-h-[180px] md:w-56">
                <Image
                  src={cover.src}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                <div className="mb-2.5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  <span className="badge badge-info">{post.category}</span>
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {post.date}
                  </span>
                  <span className="text-zinc-500">{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)]">
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="btn btn-ghost">
          ← Back to home
        </Link>
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-zinc-500">
        Article cover images are from{" "}
        <a href="https://www.pexels.com" className="text-[var(--accent)] underline-offset-2 hover:underline" rel="noreferrer">
          Pexels
        </a>{" "}
        (
        <a href="https://www.pexels.com/license/" className="text-[var(--accent)] underline-offset-2 hover:underline" rel="noreferrer">
          license
        </a>
        ). Credits appear on each post.
      </p>
    </MarketingShell>
  );
}
