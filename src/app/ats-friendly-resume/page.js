import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "ATS-Friendly Resume Guide",
  description:
    "Build an ATS-friendly resume: clear headings, one column, honest keywords from the job post, and a PDF text-select test before you apply.",
  path: "/ats-friendly-resume",
});

export default function AtsFriendlyResumePage() {
  return (
    <MarketingGuideLayout path="/ats-friendly-resume" breadcrumbLabel="ATS-friendly resume">
      <h1>ATS-friendly resume (practical, not magical)</h1>
      <p>
        An applicant tracking system (ATS) is software many employers use to store and search applications. Systems vary by
        vendor and settings. What stays constant: parsers prefer predictable structure, literal section titles, and text you
        can select—not flattened images that hide your experience.
      </p>
      <p>
        This guide is a section-by-section checklist you can apply to Word, Google Docs, or a PDF export. Pair it with{" "}
        <Link href="/how-to-tailor-a-resume-to-a-job-description">tailoring to each job description</Link> and our{" "}
        <Link href="/blog/how-to-optimize-resume-for-ats-2026">2026 ATS optimization article</Link>.
      </p>

      <h2>Contact and header</h2>
      <ul>
        <li>Put name, phone, email, city/region, and LinkedIn (optional) as plain text—not icons only.</li>
        <li>Skip photos, age, marital status, and full street address unless the market explicitly expects them.</li>
        <li>Use a standard font size for body text (roughly 10–12 pt) so nothing is tiny in the sidebar.</li>
      </ul>

      <h2>Section headings parsers recognize</h2>
      <p>Prefer plain labels over creative ones:</p>
      <ul>
        <li>
          <strong>Experience</strong> (or Work Experience)—not “Where I’ve made magic”
        </li>
        <li>
          <strong>Education</strong>
        </li>
        <li>
          <strong>Skills</strong>
        </li>
        <li>Optional: Summary, Certifications, Projects, Volunteer</li>
      </ul>
      <p>
        Clever headings look branded to humans and invisible to many parsers. Keep one primary heading style (Heading 1 /
        Heading 2 in Docs or Word), not a mix of bold manual sizing.
      </p>

      <h2>One-column layout for job history</h2>
      <ul>
        <li>Keep employment history in a single column so dates, titles, and bullets stay in reading order.</li>
        <li>Avoid sidebars, text boxes, and tables for core roles—many ATS tools scramble or drop that content.</li>
        <li>
          A simple visual example of safe order: Name → Contact → Summary → Experience (each job: title, company, dates,
          bullets) → Education → Skills.
        </li>
      </ul>

      <h2>Honest keywords from the posting</h2>
      <ul>
        <li>Highlight must-have tools, methods, and domain nouns in the job description.</li>
        <li>Mirror those terms where they are truthful in your summary, recent bullets, and skills list.</li>
        <li>Density is not the goal. Stuffing keywords without proof fails interviews even if a parser matches the file.</li>
        <li>
          Product tip: in I Love Resumes, paste the posting beside your draft, review suggested phrasing, edit anything
          inaccurate, then export—paste → edit → export.
        </li>
      </ul>

      <h2>Dates, titles, and bullets</h2>
      <ul>
        <li>Write dates left-to-right in a consistent format (e.g. Jan 2022 – Present).</li>
        <li>Lead each role with job title and employer on their own lines when possible.</li>
        <li>Start bullets with strong verbs and add a result when you can measure one.</li>
      </ul>

      <h2>PDF text-select test (do this before every upload)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Export the same file you plan to submit (usually PDF).</li>
        <li>Open it in a PDF viewer and try to select your name, a job title, and a date.</li>
        <li>If you cannot select text, or order jumps around, fix the template before you apply.</li>
        <li>Paste the text into a plain notepad as a second check—headings and roles should still make sense.</li>
      </ol>

      <h2>What an ATS-friendly resume is not</h2>
      <ul>
        <li>Not a guaranteed interview or a magic “ATS score.”</li>
        <li>Not an excuse to invent skills—you still have to defend every line live.</li>
        <li>Not the same as a designed portfolio PDF for networking; keep a conservative version for portals.</li>
      </ul>

      <h2>Learn more</h2>
      <ul>
        <li>
          <Link href="/blog/how-to-optimize-resume-for-ats-2026">How to optimize your resume for ATS</Link> (blog)
        </li>
        <li>
          <Link href="/resume-templates">Resume templates overview</Link>
        </li>
        <li>
          <Link href="/google-docs-resume-template">Google Docs resume template workflow</Link>
        </li>
        <li>
          <Link href="/how-to-tailor-a-resume-to-a-job-description">Tailor to a job description</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
