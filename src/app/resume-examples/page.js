import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume examples — borrow structure, not wording",
  description:
    "How to use resume examples responsibly: mirror impact and section flow, avoid copying, stay truthful. Links to tailoring and skills content.",
  path: "/resume-examples",
});

export default function ResumeExamplesPage() {
  return (
    <MarketingGuideLayout path="/resume-examples" breadcrumbLabel="Resume examples">
      <h1>Resume examples worth imitating</h1>
      <p>
        Examples are shorthand for “what good looks like” in a given industry: strong verbs, measurable outcomes, and tight
        bullets. They are not a license to paste someone else’s sentences.
      </p>
      <h2>What to copy</h2>
      <ul>
        <li>Section ordering that matches your seniority.</li>
        <li>Bullet rhythm: outcome, scope, tool—without filler.</li>
        <li>How skills sit next to proof in the experience section.</li>
      </ul>
      <h2>What to avoid</h2>
      <p>
        Buzzword stacks, unrelated volunteer lines stretched to look technical, and claims you cannot defend in an
        interview. If an example reads flashy but empty, skip it.
      </p>
      <h2>Go deeper</h2>
      <ul>
        <li>
          <Link href="/how-to-tailor-a-resume-to-a-job-description">Tailor to a job description</Link>
        </li>
        <li>
          <Link href="/blog/resume-examples-canada-by-role">Resume examples by role</Link> (blog; Canada-focused)
        </li>
        <li>
          <Link href="/blog/best-skills-to-put-on-resume-canada">Skills for your resume</Link> (blog)
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
