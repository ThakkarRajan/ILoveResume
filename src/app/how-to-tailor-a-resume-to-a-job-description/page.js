import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Tailor Resume to a Job Description",
  description:
    "How to tailor a resume to a job description in 15–20 minutes: mine the posting, map proof, rewrite bullets, then export Word or PDF.",
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
        verbs to align with the posting—without inventing skills you do not have. Recruiters and applicant tracking systems
        (ATS) both reward relevance; a generic file reads like a mass application.
      </p>

      <h2>A repeatable pass (15–20 minutes)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Highlight must-have tools, domains, and outcomes in the posting.</li>
        <li>Match each must-have to a bullet you already own; if none exist, skip—do not fabricate.</li>
        <li>Reorder bullets so the two strongest relevant wins sit at the top of each role.</li>
        <li>Sync the skills block to mirror language from the posting where honest.</li>
        <li>Re-read for tense, dates, and spelling conventions that match your target market.</li>
      </ol>

      <h2>Worked example (before → after)</h2>
      <p>
        Imagine a posting that asks for <em>stakeholder communication</em>, <em>SQL reporting</em>, and{" "}
        <em>reducing support backlog</em>. You already did that work—but your master resume hides it.
      </p>
      <p>
        <strong>Before (generic):</strong> “Worked with the team on reports and helped customers.”
      </p>
      <p>
        <strong>After (tailored):</strong> “Built weekly SQL reports for product and support leads, cutting open ticket
        backlog by ~20% over one quarter.”
      </p>
      <ul>
        <li>The after version keeps a fact you can defend in an interview.</li>
        <li>It mirrors nouns from the posting (SQL, backlog, stakeholders via product/support leads).</li>
        <li>It leads with impact instead of vague teamwork language.</li>
      </ul>
      <p>
        Repeat that swap for the two or three bullets most relevant to each new posting. Leave unrelated older bullets
        lower or remove them from the targeted copy.
      </p>

      <h2>What to change vs what to leave alone</h2>
      <ul>
        <li>
          <strong>Usually change:</strong> summary, top bullets under recent roles, skills order, optional projects
          section.
        </li>
        <li>
          <strong>Rarely change:</strong> employer names, dates, degrees—accuracy matters more than keyword matching.
        </li>
        <li>
          <strong>Never invent:</strong> tools, titles, or metrics you cannot explain live.
        </li>
      </ul>

      <h2>Where I Love Resumes helps</h2>
      <p>
        Sign in, paste your resume and the job description, review suggested phrasing and keywords, edit until it sounds
        like you, then export Word or PDF. You approve every line before download. ATS behaviour still varies by
        employer—clean structure and relevant keywords help, but they are not a guarantee.
      </p>

      <h2>Further reading</h2>
      <ul>
        <li>
          <Link href="/ats-friendly-resume">ATS-friendly resume</Link>
        </li>
        <li>
          <Link href="/blog/how-to-optimize-resume-for-ats-2026">How to optimize your resume for ATS</Link>
        </li>
        <li>
          <Link href="/resume-builder-canada">Resume norms for Canada</Link> (market-specific)
        </li>
        <li>
          <Link href="/ai-resume-builder">AI resume builder—edit, don’t autopilot</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
