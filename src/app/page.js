import HomePageClient from "../components/HomePageClient";
import JsonLd from "../components/seo/JsonLd";
import { pageMeta } from "../config/site";

export const metadata = pageMeta({
  title: "Free AI resume builder — tailor your resume to every job description",
  description:
    "Free resume builder: paste your resume and the job description, refine suggestions for clarity and keyword fit, then export Word or PDF for typical job portals—no credit card.",
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
