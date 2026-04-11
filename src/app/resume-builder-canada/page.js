import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import GuideCta from "../../components/seo/GuideCta";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Free resume builder for Canada — Word, PDF, ATS-friendly",
  description:
    "How a free Canadian resume builder should work: clean exports, no photo for most roles, spelling employers expect, and tailoring to each posting. Links to templates and ATS tips.",
  path: "/resume-builder-canada",
});

export default function ResumeBuilderCanadaPage() {
  return (
    <MarketingGuideLayout path="/resume-builder-canada" breadcrumbLabel="Resume builder Canada">
      <h1>Free resume builder for Canada</h1>
      <p>
        Canadian employers usually expect a concise resume (often one page early-career), clear dates, and no photo on
        typical corporate postings. The hard part is not picking a font—it is mirroring the job description without
        inventing experience.
      </p>
      <h2>What “free” should still include</h2>
      <p>
        Look for predictable Word or PDF export, text you can edit line by line, and enough structure for applicant
        tracking systems to read headings and employment blocks. I Love Resumes keeps layout simple on purpose so parsers
        and humans see the same story.
      </p>
      <h2>When to tailor more than the file name</h2>
      <p>
        If you send one generic file to every bank or software posting, you are competing against applicants who mirrored
        keywords and outcomes from the posting. Use a repeatable 15–20 minute pass: compare your bullets to the posting,
        then adjust phrasing and ordering. Our{" "}
        <Link href="/how-to-tailor-a-resume-to-a-job-description">tailoring guide</Link> walks through that workflow; the
        product itself nudges wording once you paste the description.
      </p>
      <h2>Related reading</h2>
      <ul>
        <li>
          <Link href="/blog/canadian-resume-format-guide">Canadian resume format guide</Link> (blog)
        </li>
        <li>
          <Link href="/blog/free-resume-builder-download-canada">Free resume builder and download</Link> (blog)
        </li>
        <li>
          <Link href="/ats-friendly-resume">ATS-friendly resume basics</Link>
        </li>
        <li>
          <Link href="/resume-templates">Resume templates overview</Link>
        </li>
      </ul>
      <GuideCta />
    </MarketingGuideLayout>
  );
}
