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

  // Blog posts live in /blog/sitemap.xml so you can submit a dedicated sitemap in GSC.
  return [...staticEntries, ...marketingEntries];
}
