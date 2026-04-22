import HomePageClient from "../components/HomePageClient";
import JsonLd from "../components/seo/JsonLd";
import { pageMeta } from "../config/site";

export const metadata = pageMeta({
  title: "Free resume builder & AI resume — templates, skills, ATS export",
  description:
    "I Love Resumes (iloveresumes.ca): free resume builder and AI resume help—paste your resume and job description, tighten skills and keywords for ATS screening, then export Word or PDF. Templates, examples, and tailoring guides—no credit card.",
  path: "/",
});

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is I Love Resumes really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes—create tailored drafts and export Word or PDF at no charge. No credit card.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI resume tailoring work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You upload or paste your resume and add the job description. We suggest stronger wording and relevant keywords; you edit and approve everything before export.",
      },
    },
    {
      "@type": "Question",
      name: "Will this help with ATS resume screening?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We focus on clean structure and role-relevant keywords so automated parsers and recruiters can read your resume reliably—results still depend on the employer's system and your qualifications.",
      },
    },
    {
      "@type": "Question",
      name: "What formats can I export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Word (.docx) and PDF—the formats most application portals accept.",
      },
    },
    {
      "@type": "Question",
      name: "How do you handle my resume data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Sign-In secures your account. We don't sell your resume data. Some processing uses trusted service providers as described in our Privacy Policy.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for Canadian jobs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes—clear, keyword-aware resumes for Canada and international applications alike.",
      },
    },
    {
      "@type": "Question",
      name: "What is I Love Resumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "I Love Resumes (iloveresumes.ca) is a free online resume builder focused on tailoring. You sign in with Google, upload or paste a resume, add a job description, review AI-assisted wording and keyword ideas, then export Word or PDF. Core drafting and export are free and no credit card is required.",
      },
    },
    {
      "@type": "Question",
      name: "Who should use I Love Resumes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "People who already have a resume draft and want to align bullets, skills, and keywords with a specific job posting—especially in Canada—before submitting through employer portals.",
      },
    },
    {
      "@type": "Question",
      name: "How is I Love Resumes different from template-only resume sites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The default workflow is job-driven: you paste the posting so suggestions target that role’s language and requirements, not only visual layout. Guides cover templates and formats, but tailoring to a job description is the core experience.",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeFaqSchema} />
      <HomePageClient />
    </>
  );
}
