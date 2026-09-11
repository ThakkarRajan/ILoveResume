import Link from "next/link";
import JsonLd from "../../components/seo/JsonLd";
import GuideCta from "../../components/seo/GuideCta";
import MarketingShell from "../../components/ui/MarketingShell";
import BreadcrumbNav from "../../components/ui/BreadcrumbNav";
import GuideCardGrid from "../../components/ui/GuideCardGrid";
import { pageMeta, SITE_NAME, SITE_URL } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume builder guides: ATS, tailoring, Canada, templates",
  description:
    "Guides from I Love Resumes: free resume builder for Canada, ATS-friendly formats, Harvard-style and Google Docs templates, tailoring to job descriptions, and examples.",
  path: "/resume-builder",
});

const guides = [
  { href: "/resume-builder-canada", name: "Free resume builder for Canada", description: "Canadian resume conventions and length." },
  { href: "/how-to-tailor-a-resume-to-a-job-description", name: "Tailor a resume to a job description", description: "Align bullets and skills to one posting." },
  { href: "/ats-friendly-resume", name: "ATS-friendly resume", description: "Structure that parsers and recruiters read." },
  { href: "/resume-templates", name: "Resume templates", description: "Layouts for Word, PDF, and online forms." },
  { href: "/resume-examples", name: "Resume examples", description: "Sample bullets by role and level." },
  { href: "/harvard-resume-template", name: "Harvard resume template", description: "Classic one-page academic format." },
  { href: "/google-docs-resume-template", name: "Google Docs resume template", description: "Editable Docs-friendly layout." },
  { href: "/ai-resume-builder", name: "AI resume builder", description: "Use AI without sounding generic." },
];

export default function ResumeBuilderHubPage() {
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
    <MarketingShell narrow>
      <JsonLd data={itemList} />
      <article>
        <BreadcrumbNav
          items={[
            { href: "/", label: "Home" },
            { label: "Resume builder guides" },
          ]}
        />
        <header className="mb-8 sm:mb-9">
          <h1 className="display-heading">Resume builder guides and templates</h1>
          <p className="prose-lead mt-4">
            I Love Resumes is a free tool for uploading or pasting a resume, adding a job posting, and exporting Word or
            PDF. These guides explain templates, ATS readability, and Canada-specific conventions.
          </p>
        </header>

        <GuideCardGrid guides={guides} />

        <div className="prose-guide mt-8 space-y-4 border-t border-[var(--border)] pt-8">
          <h2 className="!mt-0 !border-0 !pt-0 section-heading text-lg">Deep dives on the blog</h2>
          <p>
            Longer walkthroughs live in the{" "}
            <Link href="/blog">blog</Link>
            , for example{" "}
            <Link href="/blog/free-resume-builder-download-canada">free resume builder and download in Canada</Link>,{" "}
            <Link href="/blog/how-to-tailor-resume-to-job">how to tailor your resume to each job</Link>, and{" "}
            <Link href="/blog/how-to-optimize-resume-for-ats-2026">ATS optimization</Link>.
          </p>
        </div>

        <GuideCta />
      </article>
    </MarketingShell>
  );
}
