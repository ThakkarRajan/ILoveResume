import HomePageClient from "../components/HomePageClient";
import JsonLd from "../components/seo/JsonLd";
import { pageMeta } from "../config/site";
import { homeFaqItems } from "../data/home-faq";

export const metadata = pageMeta({
  title: "Free resume builder & AI resume — templates, skills, ATS export",
  description:
    "Free AI resume builder for job seekers—paste your resume and job description, tighten skills and keywords for ATS screening, then export Word or PDF. Templates, examples, and tailoring guides—no credit card.",
  path: "/",
});

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqItems.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeFaqSchema} />
      <HomePageClient />
    </>
  );
}
