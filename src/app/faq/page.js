"use client";

import Link from "next/link";
import { HelpCircle, ArrowRight, Home } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Everything you need to know about our free AI resume builder.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
