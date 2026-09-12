import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Google Docs resume template — collaboration without ATS surprises",
  description:
    "Build a Google Docs resume that exports cleanly: styles, headings, tables to avoid, and PDF checks. Links to ATS and tailoring guides.",
  path: "/google-docs-resume-template",
});

export default function GoogleDocsResumeTemplatePage() {
  return (
    <MarketingGuideLayout path="/google-docs-resume-template" breadcrumbLabel="Google Docs resume template">
      <h1>Google Docs resume template workflow</h1>
      <p>
        Docs shines when you iterate quickly or share with a mentor. The risk is hidden tables, text boxes, or inconsistent
        styles that look fine on screen but confuse parsers after export.
      </p>
      <h2>Formatting habits that hold up</h2>
      <ul>
        <li>Use built-in styles for headings instead of manual bold + larger font.</li>
        <li>Avoid multi-column sections for core employment content.</li>
        <li>Export PDF and reopen it to confirm nothing reflowed unexpectedly.</li>
      </ul>
      <h2>Pair Docs with tailoring</h2>
      <p>
        Once the skeleton is stable, mirror each posting with deliberate edits. Our{" "}
        <Link href="/how-to-tailor-a-resume-to-a-job-description">tailoring guide</Link> keeps that pass short; I Love
        Resumes can help when you already have text to refine.
      </p>
      <h2>Blog walkthrough</h2>
      <p>
        <Link href="/blog/google-docs-resume-template-canada">Google Docs resume template tips</Link> goes deeper on
        collaboration and export hygiene (written with Canadian applications in mind).
      </p>
    </MarketingGuideLayout>
  );
}
