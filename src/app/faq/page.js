"use client";

import Link from "next/link";
import PageHeader from "../../components/ui/PageHeader";
import MarketingShell from "../../components/ui/MarketingShell";
import FaqAccordion from "../../components/ui/FaqAccordion";

const faqs = [
  {
    q: "How does AI resume tailoring work?",
    a: "Upload your resume as a PDF or paste it as text, then add the job description. You get keyword-aware suggestions and clearer phrasing. You edit in real time and export to Word or PDF when you are ready.",
  },
  {
    q: "Is I Love Resumes really free?",
    a: "Yes. Create tailored drafts and export Word or PDF at no charge. No credit card.",
  },
  {
    q: "How do you handle my resume data?",
    a: "Google Sign-In secures your account. We don't sell your resume data. Some processing uses trusted service providers as described in our Privacy Policy.",
  },
  {
    q: "Will this help with ATS resume screening?",
    a: "We focus on clean structure and role-relevant keywords so automated parsers and recruiters can read your resume reliably. Results still depend on the employer's system and your qualifications. No tool can guarantee a pass.",
  },
  {
    q: "What formats can I export my resume to?",
    a: "Word (.docx) and PDF, the formats most application portals accept.",
  },
  {
    q: "Can I use this for Canadian jobs?",
    a: "Yes. The workflow works worldwide, including Canada: clear sections, strong bullets, and posting-aligned keywords.",
  },
  {
    q: "Do I need to create an account?",
    a: "Yes. Google Sign-In keeps login quick and secure. No separate password to remember.",
  },
  {
    q: "How do I match my resume to a job description?",
    a: "On the dashboard, paste the full posting. We align suggestions to that description. You refine the draft, then export.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHeader
        align="left"
        title="Frequently asked questions"
        description="Accounts, exports, ATS-friendly tailoring, and how we handle your data."
      />

      <FaqAccordion items={faqs} />

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Link href="/dashboard" className="btn btn-primary">
          Start tailoring a resume
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact support
        </Link>
      </div>
    </MarketingShell>
  );
}
