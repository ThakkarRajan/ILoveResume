import Link from "next/link";
import JsonLd from "../../components/seo/JsonLd";
import GuideCta from "../../components/seo/GuideCta";
import { pageMeta, SITE_NAME, SITE_URL } from "../../config/site";

export const metadata = pageMeta({
  title: "Resume builder guides: ATS, tailoring, Canada, templates",
  description:
    "Guides from I Love Resumes: free resume builder for Canada, ATS-friendly formats, Harvard-style and Google Docs templates, tailoring to job descriptions, and examples.",
  path: "/resume-builder",
});

const guides = [
  { href: "/resume-builder-canada", name: "Free resume builder for Canada" },
  { href: "/how-to-tailor-a-resume-to-a-job-description", name: "Tailor a resume to a job description" },
  { href: "/ats-friendly-resume", name: "ATS-friendly resume" },
  { href: "/resume-templates", name: "Resume templates" },
  { href: "/resume-examples", name: "Resume examples" },
  { href: "/harvard-resume-template", name: "Harvard resume template" },
  { href: "/google-docs-resume-template", name: "Google Docs resume template" },
  { href: "/ai-resume-builder", name: "AI resume builder" },
];

export default function ResumeBuilderHubPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} resume guides`,
    numberOfItems: guides.length,
    itemListElement: guides.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.name,
      url: `${SITE_URL}${g.href}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav className="mb-8 text-sm text-zinc-500">
          <Link href="/" className="font-medium text-blue-700 hover:underline">
            Home
          </Link>
          <span className="mx-1.5 text-zinc-400">/</span>
          <span className="font-medium text-zinc-800">Resume builder guides</span>
        </nav>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Resume builder guides & templates
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
          I Love Resumes is a free tool for uploading or pasting a resume, adding a job posting, and exporting Word or PDF.
          These guides explain templates, ATS readability, and Canada-specific conventions—without claiming one keyword
          alone will fix ATS or search rankings.
        </p>
        <h2 className="mt-10 text-lg font-semibold text-zinc-900">Start here</h2>
        <ul className="mt-4 space-y-2">
          {guides.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="font-medium text-blue-700 underline-offset-2 hover:underline">
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-10 text-lg font-semibold text-zinc-900">Deep dives on the blog</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          Longer walkthroughs live in the{" "}
          <Link href="/blog" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            blog
          </Link>
          —for example{" "}
          <Link
            href="/blog/free-resume-builder-download-canada"
            className="font-medium text-blue-700 underline-offset-2 hover:underline"
          >
            free resume builder and download in Canada
          </Link>
          ,{" "}
          <Link href="/blog/how-to-tailor-resume-to-job" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            how to tailor your resume to each job
          </Link>
          , and{" "}
          <Link href="/blog/how-to-optimize-resume-for-ats-2026" className="font-medium text-blue-700 underline-offset-2 hover:underline">
            ATS optimization
          </Link>
          .
        </p>
        <GuideCta />
      </article>
    </>
  );
}
