import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "How to tailor a resume to a job description",
  description:
    "A focused workflow to tailor your resume to a job posting: mine the description, map proof, rewrite bullets, verify truth, export Word/PDF. Links to ATS and Canada guides.",
  path: "/how-to-tailor-a-resume-to-a-job-description",
});

export default function HowToTailorResumePage() {
  return (
    <MarketingGuideLayout
      path="/how-to-tailor-a-resume-to-a-job-description"
      breadcrumbLabel="Tailor resume to job description"
    >
      <h1>How to tailor a resume to a job description</h1>
      <p>
        Tailoring is not rewriting your entire career for every click. It is choosing which proof to foreground and which
        verbs to align with the posting—without inventing skills you do not have.
      </p>
      <h2>A repeatable pass (15–20 minutes)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Highlight must-have tools, domains, and outcomes in the posting.</li>
        <li>Match each must-have to a bullet you already own; if none exist, skip—do not fabricate.</li>
        <li>Reorder bullets so the two strongest relevant wins sit at the top of each role.</li>
        <li>Sync the skills block to mirror language from the posting where honest.</li>
        <li>Re-read for tense, dates, and Canadian spelling if applicable.</li>
      </ol>
      <h2>Where the product helps</h2>
      <p>
        I Love Resumes reads your resume and the posting together so you can see suggested phrasing faster than staring at a
        blank page. You still approve every change before export.
      </p>
      <h2>Further reading</h2>
      <ul>
        <li>
          <Link href="/blog/how-to-tailor-resume-to-job">How to tailor your resume to each job</Link> (blog)
        </li>
        <li>
          <Link href="/ats-friendly-resume">ATS-friendly resume</Link>
        </li>
        <li>
          <Link href="/resume-builder-canada">Resume builder for Canada</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
