import HomePageClient from "../components/HomePageClient";
import JsonLd from "../components/seo/JsonLd";
import { pageMeta } from "../config/site";
import { homeFaqItems } from "../data/home-faq";

export const metadata = pageMeta({
  title: "100% Free AI Resume Tailor",
  description:
    "100% free AI resume tailor for job seekers. Match each job description, keep ATS-friendly structure, export Word or PDF. No credit card.",
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
