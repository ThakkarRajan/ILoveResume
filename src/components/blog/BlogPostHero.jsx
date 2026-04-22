import Image from "next/image";
import { getBlogCover, unsplashSiteUrl } from "../../data/blog-visuals";

export default function BlogPostHero({ slug, alt }) {
  const cover = getBlogCover(slug);

  return (
    <figure className="mb-8">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-100 shadow-[var(--shadow-card)] ring-1 ring-black/[0.03]">
        <Image
          src={cover.src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 720px"
          className="object-cover"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-900/25 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs leading-relaxed text-zinc-500">
        <span>Photo by</span>
        <a
          href={cover.photographerUrl}
          className="font-medium text-blue-700 underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {cover.photographer}
        </a>
        <span>on</span>
        <a
          href={unsplashSiteUrl}
          className="text-zinc-600 underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          Unsplash
        </a>
        <span aria-hidden>·</span>
        <a
          href="https://unsplash.com/license"
          className="text-zinc-600 underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          License
        </a>
      </figcaption>
    </figure>
  );
}
