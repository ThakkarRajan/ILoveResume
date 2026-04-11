"use client";

import Link from "next/link";
import { HelpCircle, ArrowRight, Home } from "lucide-react";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";

const faqs = [
  {
    q: "How does the AI resume builder work?",
    a: "Upload your resume in PDF format or paste it as text. Optionally, paste a job description to get keyword suggestions that align with what recruiters and ATS systems look for. Our AI analyzes your content and suggests improvements. You can edit in real time and export to Word or PDF.",
  },
  {
    q: "Is I Love Resumes free?",
    a: "Yes. You can create and optimize resumes for free. Export to Word and PDF at no cost. No credit card required.",
  },
  {
    q: "Is my resume data secure?",
    a: "Yes. We use Google Sign-In for authentication. We do not share your data with third parties. Your resume is processed securely.",
  },
  {
    q: "Does it work for ATS (Applicant Tracking Systems)?",
    a: "Yes. We focus on ATS-friendly structure and keyword alignment. Our AI helps you tailor your resume to specific job descriptions so it gets past automated screening.",
  },
  {
    q: "What formats can I export my resume to?",
    a: "Word (.docx) and PDF—both standard formats for job applications. Most employers accept these formats.",
  },
  {
    q: "Can I use this for Canadian jobs?",
    a: "Yes. Our tool works for job seekers worldwide, including Canada. Canadian resume formats are similar to US formats; our AI optimizes for clarity and keywords regardless of location.",
  },
  {
    q: "Do I need to create an account?",
    a: "Yes. We use Google Sign-In for a quick, secure login. No separate password to remember.",
  },
  {
    q: "How do I match my resume to a job description?",
    a: "In the dashboard, paste the job description when prompted. Our AI will suggest keywords and improvements to better align your resume with that specific job. You can edit the suggestions in real time.",
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
            Practical answers about accounts, exports, ATS, and privacy.
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
            Back to home
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
