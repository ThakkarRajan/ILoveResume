import { blogPosts } from "../data/blog-posts";
import { SITE_URL } from "../config/site";

const MARKETING_PATHS = [
  "/resume-builder",
  "/resume-builder-canada",
  "/ai-resume-builder",
  "/resume-templates",
  "/resume-examples",
  "/harvard-resume-template",
  "/google-docs-resume-template",
  "/ats-friendly-resume",
  "/how-to-tailor-a-resume-to-a-job-description",
];

const STATIC_PATHS = [
  "/",
  "/contact",
  "/faq",
  "/blog",
  "/terms",
  "/privacy",
  "/cookies",
  "/disclaimer",
];

export default function sitemap() {
  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.75,
  }));

  const marketingEntries = MARKETING_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogEntries = blogPosts.map((post) => {
    const entry = {
      url: `${SITE_URL}/blog/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.72,
    };
    if (post.date) entry.lastModified = new Date(post.date);
    return entry;
  });

  /** Single sitemap so crawlers get every public URL from one /sitemap.xml (better than split for smaller sites). */
  return [...staticEntries, ...marketingEntries, ...blogEntries];
}
