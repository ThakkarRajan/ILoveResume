import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume templates — pick structure before decoration",
  description:
    "Choose resume templates for ATS and recruiters: headings, one column, sensible fonts, and export hygiene. Links to Harvard-style and Google Docs guides.",
  path: "/resume-templates",
});

export default function ResumeTemplatesPage() {
  return (
    <MarketingGuideLayout path="/resume-templates" breadcrumbLabel="Resume templates">
      <h1>Resume templates that survive screening</h1>
      <p>
        A template is mostly structure: where experience lives, how skills appear, and whether a parser can read dates in
        order. Fancy columns and icon grids often cost more than they add once your file hits an ATS.
      </p>
      <h2>What to prioritize</h2>
      <ul>
        <li>Single-column body text for most roles.</li>
        <li>Standard headings: Experience, Education, Skills—not cute synonyms.</li>
        <li>Fonts employers already expect (system or common web fonts).</li>
      </ul>
      <h2>Template styles we reference</h2>
      <p>
        The Harvard-style layout is a shorthand for a tight, one-page narrative—see{" "}
        <Link href="/harvard-resume-template">Harvard resume template</Link>. If you draft in Docs, read{" "}
        <Link href="/google-docs-resume-template">Google Docs resume template</Link> for export habits that keep PDFs clean.
      </p>
      <h2>Further reading</h2>
      <ul>
        <li>
          <Link href="/ats-friendly-resume">ATS-friendly resume</Link>
        </li>
        <li>
          <Link href="/blog/resume-templates-canada-pick-right-one">Picking a resume template</Link> (blog;
          Canada-focused)
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
