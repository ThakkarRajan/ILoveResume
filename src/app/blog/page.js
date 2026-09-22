import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "../../data/blog-posts";
import { getBlogCover } from "../../data/blog-visuals";
import MarketingShell from "../../components/ui/MarketingShell";
import ScrollReveal from "../../components/motion/ScrollReveal";
import { IMAGE_BLUR_DATA_URL, IMAGE_QUALITY_PHOTO } from "../../utils/imagePerf";

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const recent = rest.slice(0, 4);
  const archive = rest.slice(4);
  const featuredCover = getBlogCover(featured.slug);
  const featuredAlt = featured.coverImageAlt ?? `${featured.title} — article cover`;

  return (
    <MarketingShell>
      <div className="resource-page">
        <header className="resource-page-header">
          <p className="eyebrow">Publication</p>
          <h1 className="display-heading">Resume &amp; career blog</h1>
          <p className="prose-lead mt-3">
            Practical reads on ATS, tailoring, templates, and job search—written to be scanned and applied.
          </p>
        </header>

        <ScrollReveal>
          <article className="blog-featured">
            <Link href={`/blog/${featured.slug}`} className="blog-featured-media">
              <Image
                src={featuredCover.src}
                alt={featuredAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className="object-cover"
                quality={IMAGE_QUALITY_PHOTO}
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
              />
            </Link>
            <div className="blog-featured-copy">
              <div className="blog-meta">
                <span className="blog-meta-cat">{featured.category}</span>
                <time dateTime={featured.date}>{featured.date}</time>
                <span>{featured.readTime}</span>
              </div>
              <h2 className="blog-featured-title">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
              <Link href={`/blog/${featured.slug}`} className="blog-read-link">
                Read article
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </article>
        </ScrollReveal>

        <section className="blog-recent" aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="blog-section-label">
            Recent
          </h2>
          <ul className="blog-recent-list">
            {recent.map((post) => {
              const cover = getBlogCover(post.slug, "thumb");
              const alt = post.coverImageAlt ?? `${post.title} — article cover`;
              return (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-recent-item">
                    <span className="blog-recent-thumb">
                      <Image
                        src={cover.src}
                        alt={alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                        quality={IMAGE_QUALITY_PHOTO}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                      />
                    </span>
                    <span className="blog-recent-copy">
                      <span className="blog-meta">
                        <span className="blog-meta-cat">{post.category}</span>
                        <time dateTime={post.date}>{post.date}</time>
                        <span>{post.readTime}</span>
                      </span>
                      <span className="blog-recent-title">{post.title}</span>
                      <span className="blog-recent-excerpt">{post.excerpt}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {archive.length > 0 ? (
          <section className="blog-archive" aria-labelledby="archive-heading">
            <h2 id="archive-heading" className="blog-section-label">
              All articles
            </h2>
            <ul className="blog-index-list">
              {archive.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="blog-index-row">
                    <span className="blog-index-main">
                      <span className="blog-index-title">{post.title}</span>
                      <span className="blog-index-meta">
                        {post.category} · {post.readTime}
                      </span>
                    </span>
                    <time className="blog-index-date" dateTime={post.date}>
                      {post.date}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="blog-credit">
          Article cover images are from{" "}
          <a href="https://www.pexels.com" rel="noreferrer">
            Pexels
          </a>{" "}
          (
          <a href="https://www.pexels.com/license/" rel="noreferrer">
            license
          </a>
          ). Credits appear on each post.
        </p>
      </div>
    </MarketingShell>
  );
}
