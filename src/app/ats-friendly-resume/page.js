import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "ATS-friendly resume — parsing, headings, and honest keywords",
  description:
    "ATS-friendly resume basics: clear headings, simple layout, keyword alignment without stuffing, and PDF hygiene. Links to templates and tailoring.",
  path: "/ats-friendly-resume",
});

export default function AtsFriendlyResumePage() {
  return (
    <MarketingGuideLayout path="/ats-friendly-resume" breadcrumbLabel="ATS-friendly resume">
      <h1>ATS-friendly resume (practical, not magical)</h1>
      <p>
        Applicant tracking systems vary by vendor and employer configuration. What stays constant is that parsers like
        predictable structure, literal section titles, and text you can select—not flattened images hiding your experience.
      </p>
      <h2>High-impact fixes</h2>
      <ul>
        <li>Use “Experience”, “Education”, “Skills” instead of clever labels.</li>
        <li>Keep one column for job history; parsers struggle with side-by-side layouts.</li>
        <li>Mirror important nouns from the posting where they are truthful—density is not the goal.</li>
      </ul>
      <h2>Test before you submit</h2>
      <p>
        Export the same file you plan to upload, select text in a PDF viewer, and confirm dates read left-to-right. If you
        cannot select text, assume an ATS will struggle too.
      </p>
      <h2>Learn more</h2>
      <ul>
        <li>
          <Link href="/blog/how-to-optimize-resume-for-ats-2026">How to optimize your resume for ATS</Link> (blog)
        </li>
        <li>
          <Link href="/resume-templates">Resume templates overview</Link>
        </li>
        <li>
          <Link href="/how-to-tailor-a-resume-to-a-job-description">Tailor to a job description</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
