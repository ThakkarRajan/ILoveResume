import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Harvard Resume Template",
  description:
    "Harvard-style resume template explained: one-page layout, bold section labels, strong bullets, plus ATS-friendly notes.",
  path: "/harvard-resume-template",
});

export default function HarvardResumeTemplatePage() {
  return (
    <MarketingGuideLayout path="/harvard-resume-template" breadcrumbLabel="Harvard resume template">
      <h1>Harvard resume template (what people actually mean)</h1>
      <p>
        “Harvard resume” usually describes a restrained, one-page layout with clear section lines and no gimmicks—not an
        official university form. Recruiters like it because it is fast to scan.
      </p>
      <h2>Core ingredients</h2>
      <ul>
        <li>One column for the body; avoid tables for employment history.</li>
        <li>Reverse-chronological experience with 3–5 bullets per recent role.</li>
        <li>Education placed where it supports the story—often after experience once you are mid-career.</li>
      </ul>
      <h2>Match local expectations</h2>
      <p>
        Resume requirements can vary by country, industry, and employer—photos, personal details, page length, and spelling
        conventions are common differences. Follow the norms of the market where you are applying. For Canada-specific
        notes, see{" "}
        <Link href="/resume-builder-canada">resume norms for Canada</Link>.
      </p>
      <h2>Longer read</h2>
      <p>
        <Link href="/blog/harvard-resume-template-canada-guide">Harvard resume template for Canada</Link> covers margins,
        headings, and ATS tweaks for that market in depth.
      </p>
    </MarketingGuideLayout>
  );
}
