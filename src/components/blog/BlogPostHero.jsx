import Image from "next/image";
import { getBlogCover } from "../../data/blog-visuals";

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
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs leading-relaxed text-zinc-500">
        <span>Image from</span>
        <a
          href={cover.creditUrl}
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {cover.creditLabel}
        </a>
        <span aria-hidden>·</span>
        <a
          href={cover.licenseUrl}
          className="text-zinc-600 underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          Pexels License
        </a>
      </figcaption>
    </figure>
  );
}
