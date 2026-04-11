import HomePageClient from "../components/HomePageClient";
import JsonLd from "../components/seo/JsonLd";
import { pageMeta } from "../config/site";

export const metadata = pageMeta({
  title: "Free AI resume builder — tailor your resume to each job",
  description:
    "Free resume builder for Canada and beyond: upload or paste your resume, add a job description, refine wording for ATS and recruiters, export Word or PDF. No credit card.",
  path: "/",
});

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is I Love Resumes free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Create and optimize resumes for free and export to Word and PDF at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Upload your resume and paste a job description. We suggest improvements and keywords to better match the role.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We emphasize clear structure and keyword alignment so automated screening can parse your resume reliably.",
      },
    },
    {
      "@type": "Question",
      name: "What formats can I export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Word (.docx) and PDF—formats accepted by most employers and portals.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use Google Sign-In for authentication. We do not sell your resume data.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work for Canadian jobs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The tool supports job seekers in Canada and internationally, including common Canadian resume conventions.",
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
