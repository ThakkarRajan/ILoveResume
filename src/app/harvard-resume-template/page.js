import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import GuideCta from "../../components/seo/GuideCta";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Harvard resume template — clean one-page structure",
  description:
    "Harvard-style resume template explained: tight one-page layout, bold section labels, strong bullets. Canadian ATS notes and links to Canada guides.",
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
      <h2>Canada-specific tweaks</h2>
      <p>
        Skip photos for most private-sector postings, keep spelling consistent (Canadian English if you apply locally), and
        export a PDF that preserves fonts. Pair the layout with{" "}
        <Link href="/resume-builder-canada">Canada builder guidance</Link> so content matches local norms.
      </p>
      <h2>Longer read</h2>
      <p>
        <Link href="/blog/harvard-resume-template-canada-guide">Harvard resume template for Canada</Link> covers margins,
        headings, and ATS tweaks in depth.
      </p>
      <GuideCta />
    </MarketingGuideLayout>
  );
}
