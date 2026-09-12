"use client";

import Link from "next/link";
import MarketingShell from "../../components/ui/MarketingShell";
import FaqAccordion from "../../components/ui/FaqAccordion";

const groups = [
  {
    title: "Product",
    items: [
      {
        q: "How does AI resume tailoring work?",
        a: "Upload your resume as a PDF or paste it as text, then add the job description. You get keyword-aware suggestions and clearer phrasing. You edit in real time and export to Word or PDF when you are ready.",
      },
      {
        q: "Will this help with ATS resume screening?",
        a: "We focus on clean structure and role-relevant keywords so automated parsers and recruiters can read your resume reliably. Results still depend on the employer's system and your qualifications. No tool can guarantee a pass.",
      },
      {
        q: "How do I match my resume to a job description?",
        a: "On the dashboard, paste the full posting. We align suggestions to that description. You refine the draft, then export.",
      },
      {
        q: "What formats can I export my resume to?",
        a: "Word (.docx) and PDF, the formats most application portals accept.",
      },
      {
        q: "Can I use this for jobs in different countries?",
        a: "Yes. The workflow works wherever you apply: clear sections, strong bullets, and posting-aligned keywords. Resume requirements can vary by country, industry, and employer—follow local expectations for the role.",
      },
    ],
  },
  {
    title: "Account & privacy",
    items: [
      {
        q: "Is I Love Resumes really free?",
        a: "Yes. Create tailored drafts and export Word or PDF at no charge. No credit card.",
      },
      {
        q: "Do I need to create an account?",
        a: "Yes. Google Sign-In keeps login quick and secure. No separate password to remember.",
      },
      {
        q: "How do you handle my resume data?",
        a: "Google Sign-In secures your account. We don't sell your resume data. Some processing uses trusted service providers as described in our Privacy Policy.",
      },
    ],
  },
];

const allFaqs = groups.flatMap((g) => g.items);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
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
    <MarketingShell narrow>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="resource-page">
        <header className="resource-page-header">
          <p className="eyebrow">Support</p>
          <h1 className="display-heading">Frequently asked questions</h1>
          <p className="prose-lead mt-3">
            Accounts, exports, ATS-friendly tailoring, and how we handle your data—scannable answers first.
          </p>
        </header>

        <div className="faq-groups">
          {groups.map((group, groupIndex) => (
            <section key={group.title} className="faq-group" aria-labelledby={`faq-group-${groupIndex}`}>
              <h2 id={`faq-group-${groupIndex}`} className="faq-group-title">
                {group.title}
              </h2>
              <FaqAccordion items={group.items} idPrefix={`faq-${groupIndex}`} />
            </section>
          ))}
        </div>

        <div className="faq-footer-actions">
          <Link href="/dashboard" className="btn btn-primary">
            Start tailoring a resume
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact support
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
