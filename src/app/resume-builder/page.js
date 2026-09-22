import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "../../components/seo/JsonLd";
import GuideCta from "../../components/seo/GuideCta";
import MarketingShell from "../../components/ui/MarketingShell";
import BreadcrumbNav from "../../components/ui/BreadcrumbNav";
import ScrollReveal from "../../components/motion/ScrollReveal";
import { pageMeta, SITE_NAME, SITE_URL } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume Builder Guides",
  description:
    "Resume builder guides: ATS-friendly formats, templates, tailoring to job descriptions, examples, and Canada notes from I Love Resumes.",
  path: "/resume-builder",
});

const guides = [
  {
    href: "/how-to-tailor-a-resume-to-a-job-description",
    name: "Tailor a resume to a job description",
    description: "Align bullets and skills to one posting.",
    topic: "Tailoring",
  },
  {
    href: "/ats-friendly-resume",
    name: "ATS-friendly resume",
    description: "Structure that parsers and recruiters read.",
    topic: "ATS",
  },
  {
    href: "/resume-templates",
    name: "Resume templates",
    description: "Layouts for Word, PDF, and online forms.",
    topic: "Templates",
  },
  {
    href: "/resume-examples",
    name: "Resume examples",
    description: "Sample bullets by role and level.",
    topic: "Templates",
  },
  {
    href: "/harvard-resume-template",
    name: "Harvard resume template",
    description: "Classic one-page academic format.",
    topic: "Templates",
  },
  {
    href: "/google-docs-resume-template",
    name: "Google Docs resume template",
    description: "Editable Docs-friendly layout.",
    topic: "Templates",
  },
  {
    href: "/ai-resume-builder",
    name: "AI resume builder",
    description: "Use AI without sounding generic.",
    topic: "AI",
  },
  {
    href: "/resume-builder-canada",
    name: "Resume norms for Canada",
    description: "Format and conventions when applying in Canada.",
    topic: "By market",
  },
];

const topicOrder = ["Tailoring", "ATS", "Templates", "AI", "By market"];

export default function ResumeBuilderHubPage() {
  const featured = guides[0];
  const remaining = guides.slice(1);
  const groups = topicOrder
    .map((topic) => ({
      topic,
      items: remaining.filter((g) => g.topic === topic),
    }))
    .filter((g) => g.items.length > 0);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} resume guides`,
    numberOfItems: guides.length,
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.name,
      url: `${SITE_URL}${g.href}`,
    })),
  };

  return (
    <MarketingShell>
      <JsonLd data={itemList} />
      <article className="resource-page">
        <BreadcrumbNav
          items={[
            { href: "/", label: "Home" },
            { label: "Resume builder guides" },
          ]}
        />

        <header className="resource-page-header">
          <p className="eyebrow">Resource library</p>
          <h1 className="display-heading">Resume builder guides</h1>
          <p className="prose-lead mt-3">
            Practical pages on ATS readability, templates, and tailoring—plus market-specific notes where expectations
            differ. Built to sit beside the free builder, not replace your judgment.
          </p>
        </header>

        <ScrollReveal className="guide-featured">
          <p className="guide-featured-label">Start here</p>
          <div className="guide-featured-body">
            <div className="min-w-0">
              <p className="guide-topic">{featured.topic}</p>
              <h2 className="guide-featured-title">
                <Link href={featured.href}>{featured.name}</Link>
              </h2>
              <p className="guide-featured-desc">{featured.description}</p>
            </div>
            <Link href={featured.href} className="btn btn-primary shrink-0 self-start">
              Open guide
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </ScrollReveal>

        <div className="guide-groups">
          {groups.map((group) => (
            <section key={group.topic} className="guide-group">
              <h2 className="guide-group-title">{group.topic}</h2>
              <ul className="guide-row-list">
                {group.items.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href} className="guide-row">
                      <span className="guide-row-copy">
                        <span className="guide-row-title">{guide.name}</span>
                        <span className="guide-row-desc">{guide.description}</span>
                      </span>
                      <span className="guide-row-action">
                        Read
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="resource-aside">
          <h2 className="section-heading text-lg">Deep dives on the blog</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            Longer walkthroughs live in the{" "}
            <Link href="/blog" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
              blog
            </Link>
            , for example{" "}
            <Link
              href="/how-to-tailor-a-resume-to-a-job-description"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              how to tailor your resume to each job
            </Link>
            ,{" "}
            <Link
              href="/blog/how-to-optimize-resume-for-ats-2026"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              ATS optimization
            </Link>
            , and country-specific pieces such as{" "}
            <Link
              href="/blog/canadian-resume-format-guide"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Canadian resume format
            </Link>
            .
          </p>
        </div>

        <GuideCta />
      </article>
    </MarketingShell>
  );
}
