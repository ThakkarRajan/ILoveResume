import Link from "next/link";
import MarketingGuideLayout from "../../components/seo/MarketingGuideLayout";
import { pageMeta } from "../../config/site";

export const metadata = pageMeta({
  title: "Google Docs Resume Templates",
  description:
    "Free Google Docs resume templates you can rebuild in minutes: classic, early-career, and experienced layouts plus ATS export checks.",
  path: "/google-docs-resume-template",
});

function TemplateBlock({ title, children }) {
  return (
    <div className="not-prose rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] p-4 sm:p-5">
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-md bg-[var(--background)] p-3 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
        {children}
      </pre>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        In Google Docs: File → New → Document, paste this outline, then File → Make a copy for each application.
      </p>
    </div>
  );
}

export default function GoogleDocsResumeTemplatePage() {
  return (
    <MarketingGuideLayout path="/google-docs-resume-template" breadcrumbLabel="Google Docs resume template">
      <h1>Google Docs resume templates (copy, then tailor)</h1>
      <p>
        Searchers looking for a Google Docs resume template usually want something they can duplicate today—not a lecture
        about fonts. Below are three one-column outlines you can paste into a new Doc, edit with your facts, and export as
        PDF or Word. Docs is great for mentoring and fast revisions; the risk is hidden tables or text boxes that confuse
        applicant tracking systems (ATS) after export.
      </p>

      <h2>How to use these templates</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5">
        <li>Open Google Docs and create a blank document.</li>
        <li>Paste one outline below. Replace bracketed prompts with your real experience—never invent metrics.</li>
        <li>Apply Heading styles to section labels (Experience, Education, Skills).</li>
        <li>File → Make a copy for each job, then tailor with our{" "}
          <Link href="/how-to-tailor-a-resume-to-a-job-description">tailoring guide</Link>.</li>
        <li>Download as PDF and run the text-select test from the{" "}
          <Link href="/ats-friendly-resume">ATS-friendly resume guide</Link>.</li>
      </ol>

      <h2>Template 1 — Classic one-page</h2>
      <TemplateBlock title="Classic (most corporate roles)">
{`YOUR NAME
City, Region · phone · email · LinkedIn URL (optional)

SUMMARY
[2–3 lines: years of experience, function, strongest proof]

EXPERIENCE
Job Title — Company Name
Mon YYYY – Mon YYYY (or Present)
• [Action + what you did + result/number when honest]
• [Second strongest bullet for this target role]
• [Third bullet]

Job Title — Earlier Company
Mon YYYY – Mon YYYY
• [Bullet]
• [Bullet]

EDUCATION
Degree — School — Year
[Optional: relevant coursework or honors]

SKILLS
[Tools and methods that match the posting, truthfully]`}
      </TemplateBlock>

      <h2>Template 2 — Early career / internship</h2>
      <TemplateBlock title="Early career">
{`YOUR NAME
City, Region · phone · email

SUMMARY
[Degree or program + target role type + 1 proof point (project, internship, or leadership)]

EDUCATION
Degree — School — Expected/Grad year
• [Relevant coursework, GPA only if strong and asked]
• [Capstone or club leadership if it proves skills]

EXPERIENCE / INTERNSHIPS
Role — Organization
Mon YYYY – Mon YYYY
• [What you owned]
• [Tool or method + outcome]

PROJECTS
Project name — tools used
• [Problem → what you built → result]

SKILLS
[Languages, tools, lab or office systems from the posting]`}
      </TemplateBlock>

      <h2>Template 3 — Experienced / career change</h2>
      <TemplateBlock title="Experienced or pivoting">
{`YOUR NAME
City, Region · phone · email · portfolio URL (optional)

SUMMARY
[Target title + years in related work + transferable strength. Name the pivot clearly.]

SELECTED EXPERIENCE
Most Relevant Title — Company
Mon YYYY – Mon YYYY
• [Bullet that maps to the new role’s must-haves]
• [Bullet]
• [Bullet]

Earlier Title — Company
Mon YYYY – Mon YYYY
• [Only bullets that still support the target role]

ADDITIONAL EXPERIENCE
[Shorter list of older roles: Title — Company — years]

EDUCATION & CERTIFICATIONS
[Degrees and certifications that support the switch]

SKILLS
[Target-role skills first, then supporting skills]`}
      </TemplateBlock>

      <h2>Formatting habits that survive ATS</h2>
      <ul>
        <li>Use built-in heading styles instead of manual bold + larger font alone.</li>
        <li>Avoid multi-column sections and text boxes for core employment content.</li>
        <li>Keep contact info as typed text, not icon-only rows.</li>
        <li>Export PDF and reopen it to confirm nothing reflowed or became unselectable.</li>
      </ul>

      <h2>Pair Docs with the product</h2>
      <p>
        Once the skeleton is stable, paste your Doc text and a job posting into I Love Resumes to speed wording and keyword
        alignment—then approve every change before export.
      </p>

      <h2>Related reading</h2>
      <ul>
        <li>
          <Link href="/blog/google-docs-resume-template-canada">Google Docs resume template tips</Link> (deeper export
          hygiene)
        </li>
        <li>
          <Link href="/harvard-resume-template">Harvard-style one-page structure</Link>
        </li>
        <li>
          <Link href="/ats-friendly-resume">ATS-friendly resume checklist</Link>
        </li>
      </ul>
    </MarketingGuideLayout>
  );
}
