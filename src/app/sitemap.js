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
  const lastMod = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastMod,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.75,
  }));

  const marketingEntries = MARKETING_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: lastMod,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : lastMod,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  /** Single sitemap so crawlers get every public URL from one /sitemap.xml (better than split for smaller sites). */
  return [...staticEntries, ...marketingEntries, ...blogEntries];
}
