"use client";

import Link from "next/link";
import { HelpCircle, ArrowRight, Home } from "lucide-react";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

const faqs = [
  {
    q: "How does AI resume tailoring work?",
    a: "Upload your resume as a PDF or paste it as text, then add the job description. You get keyword-aware suggestions and clearer phrasing; you edit in real time and export to Word or PDF when you are ready.",
  },
  {
    q: "Is I Love Resumes really free?",
    a: "Yes—create tailored drafts and export Word or PDF at no charge. No credit card.",
  },
  {
    q: "How do you handle my resume data?",
    a: "Google Sign-In secures your account. We don't sell your resume data. Some processing uses trusted service providers as described in our Privacy Policy.",
  },
  {
    q: "Will this help with ATS resume screening?",
    a: "We focus on clean structure and role-relevant keywords so automated parsers and recruiters can read your resume reliably. Results still depend on the employer's system and your qualifications—no tool can guarantee a pass.",
  },
  {
    q: "What formats can I export my resume to?",
    a: "Word (.docx) and PDF—the formats most application portals accept.",
  },
  {
    q: "Can I use this for Canadian jobs?",
    a: "Yes. The workflow works worldwide, including Canada: clear sections, strong bullets, and posting-aligned keywords.",
  },
  {
    q: "Do I need to create an account?",
    a: "Yes. Google Sign-In keeps login quick and secure—no separate password to remember.",
  },
  {
    q: "How do I match my resume to a job description?",
    a: "On the dashboard, paste the full posting. We align suggestions to that description; you refine the draft, then export.",
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
            <HelpCircle className="h-6 w-6 text-blue-700" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Frequently asked questions</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 sm:text-base">
            Accounts, exports, ATS-friendly tailoring, and how we handle your data.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white shadow-sm">
          {faqs.map((faq, i) => (
            <div key={i} className="px-5 py-5 sm:px-8 sm:py-6">
              <h2 className="text-sm font-semibold text-zinc-900 sm:text-base">{faq.q}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem]">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
          >
            <Home className="h-4 w-4" strokeWidth={1.75} />
            Go to homepage
            <ArrowRight className="h-4 w-4 opacity-80" strokeWidth={1.75} />
          </Link>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <SiteLegalLinks />
        </div>
      </div>
    </div>
  );
}
