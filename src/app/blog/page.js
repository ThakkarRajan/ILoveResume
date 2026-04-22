import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { blogPosts } from "../../data/blog-posts";
import { getBlogCover } from "../../data/blog-visuals";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/35 via-zinc-50 to-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
            <FileText className="h-6 w-6 text-blue-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.25rem]">
            Resume &amp; career blog
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base">
            Practical reads on ATS, tailoring, and Canadian job search—coffee optional, panic-saving understood.
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6">
          {blogPosts.map((post) => {
            const cover = getBlogCover(post.slug);
            const alt = post.coverImageAlt ?? `${post.title} — article cover`;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/95 shadow-[var(--shadow-card)] transition-all hover:border-violet-200/80 hover:shadow-[var(--shadow-card-hover)] sm:flex-row"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 bg-zinc-100 sm:aspect-auto sm:h-auto sm:w-52 sm:min-h-[200px] md:w-60">
                  <Image
                    src={cover.src}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-6 sm:p-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-800">
                      {post.category}
                    </span>
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
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline"
          >
            ← Back to home
          </Link>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-xs leading-relaxed text-zinc-500">
          Article cover images are from{" "}
          <a href="https://www.pexels.com" className="text-blue-700 underline-offset-2 hover:underline" rel="noreferrer">
            Pexels
          </a>{" "}
          (
          <a href="https://www.pexels.com/license/" className="text-blue-700 underline-offset-2 hover:underline" rel="noreferrer">
            license
          </a>
          ). Credits appear on each post.
        </p>

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <SiteLegalLinks />
        </div>
      </div>
    </div>
  );
}
