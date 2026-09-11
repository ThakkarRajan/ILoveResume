import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "AI resume builder — use AI without sounding generic",
  description:
    "Practical take on AI resume builders: match job descriptions, keep facts accurate, edit for voice, export Word/PDF. Links to tailoring and ATS guides.",
  path: "/ai-resume-builder",
});

export default function AiResumeBuilderPage() {
  return (
    <MarketingGuideLayout path="/ai-resume-builder" breadcrumbLabel="AI resume builder">
      <h1>AI resume builder that rewards editing</h1>
      <p>
        AI is useful when it shortens the gap between a job posting and your draft. It fails when it replaces your judgment.
        The strongest applications still read like a human chose what to emphasize.
      </p>
      <h2>How I Love Resumes uses AI</h2>
      <p>
        You bring the resume and the posting. The tool suggests tighter phrasing and missing keywords so you can align
        faster than copying bullets from older versions. Nothing ships until you export—so treat suggestions as a first
        pass, not a final submission.
      </p>
      <h2>Guardrails that matter</h2>
      <ul>
        <li>Verify dates, titles, and metrics—models can hallucinate if you push them.</li>
        <li>Prefer plain section headings recruiters recognize.</li>
        <li>Keep one primary story per role; depth beats buzzwords.</li>
      </ul>
      <h2>Read next</h2>
      <ul>
        <li>
          <Link href="/blog/ai-resume-builder-canada-pros-cons">AI resume tools in Canada</Link> (blog)
        </li>
        <li>
          <Link href="/how-to-tailor-a-resume-to-a-job-description">Tailor to a job description</Link>
        </li>
        <li>
          <Link href="/resume-builder-canada">Resume builder for Canada</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
