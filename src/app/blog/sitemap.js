import { blogPosts } from "../../data/blog-posts";
import { SITE_URL } from "../../config/site";

/** Blog-only sitemap — submit alongside /sitemap.xml in Search Console. */
export default function sitemap() {
  const fallback = new Date();
  return blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : fallback,
    changeFrequency: "monthly",
    priority: 0.65,
  }));
}
