"use client";

import "../utils/firebase.js";
import { wakeBackend } from "../utils/api.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

import Link from "next/link";
import SocialLinks from "./SocialLinks";
import SiteLegalLinks from "./legal/SiteLegalLinks";
import LegalConsentCheckbox from "./legal/LegalConsentCheckbox";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Upload,
  Target,
  Edit3,
  Download,
  Shield,
  FileCheck,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

const navLink =
  "text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors py-2.5 px-3 rounded-md min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50";

const resourceLinks = [
  { href: "/resume-builder-canada", label: "Resume builder for Canada" },
  { href: "/how-to-tailor-a-resume-to-a-job-description", label: "Tailor resume to a job description" },
  { href: "/ats-friendly-resume", label: "ATS-friendly resume" },
  { href: "/resume-templates", label: "Resume templates" },
  { href: "/resume-examples", label: "Resume examples" },
  { href: "/harvard-resume-template", label: "Harvard-style template" },
  { href: "/google-docs-resume-template", label: "Google Docs resume" },
  { href: "/ai-resume-builder", label: "AI resume builder" },
];

export default function HomePageClient() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [legalConsent, setLegalConsent] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (user) {
    return null;
  }

  const features = [
    {
      icon: Upload,
      title: "PDF or text",
      description:
        "Upload a PDF or paste your resume as text. We extract content and keep structure ATS-friendly.",
    },
    {
      icon: Target,
      title: "Match the posting",
      description:
        "Paste a job description to surface relevant keywords and align phrasing with what employers expect.",
    },
    {
      icon: Edit3,
      title: "Edit before export",
      description:
        "Review suggestions, refine wording in place, then export when the resume reflects how you want to be seen.",
    },
    {
      icon: Download,
      title: "Word and PDF",
      description:
        "Download standard .docx or PDF files suitable for most application portals and recruiters.",
    },
  ];

  const trustItems = [
    { icon: Shield, label: "Google sign-in" },
    { icon: FileCheck, label: "ATS-oriented structure" },
    { icon: Download, label: "No card required" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
          <Link
            href="/"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Image src="/logo.png" alt="I Love Resumes logo" width={36} height={36} className="rounded-md" />
            <span className="hidden text-sm font-semibold tracking-tight text-zinc-900 sm:inline">
              I Love Resumes
            </span>
          </Link>
          <div className="hidden items-center gap-0.5 md:flex">
            <Link href="/resume-builder" className={navLink}>
              Guides
            </Link>
            <Link href="#features" className={navLink}>
              Features
            </Link>
            <Link href="#faq" className={navLink}>
              FAQ
            </Link>
            <Link href="/blog" className={navLink}>
              Blog
            </Link>
            <Link href="/contact" className={navLink}>
              Contact
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-0.5">
              <Link href="/resume-builder" onClick={() => setMobileMenuOpen(false)} className={`${navLink} rounded-lg`}>
                Guides
              </Link>
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className={`${navLink} rounded-lg`}>
                Features
              </Link>
              <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className={`${navLink} rounded-lg`}>
                FAQ
              </Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className={`${navLink} rounded-lg`}>
                Blog
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={`${navLink} rounded-lg`}>
                Contact
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Free · No credit card</p>
          <div className="mb-8 flex flex-col items-center gap-5 sm:mb-10 sm:flex-row sm:justify-center sm:gap-6">
            <Image
              src="/logo.png"
              alt="I Love Resumes app icon"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] rounded-xl border border-zinc-200 bg-white object-contain shadow-sm"
            />
            <Image
              src="/Iloveresumelogotext.png"
              alt="I Love Resumes wordmark"
              width={200}
              height={48}
              priority
              className="h-9 w-auto object-contain sm:h-11"
            />
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
            Free AI resume builder for applications that need a tight match
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
            Built for people in Canada and elsewhere who already have a draft: add a job posting, tighten wording and
            keywords, then export a clean Word or PDF file. You stay in control of every line.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:items-center">
            <LegalConsentCheckbox id="home-legal-consent" checked={legalConsent} onChange={setLegalConsent} />
            <button
              type="button"
              onClick={async () => {
                if (!legalConsent) return;
                const auth = getAuth();
                const provider = new GoogleAuthProvider();
                try {
                  await signInWithPopup(auth, provider);
                  wakeBackend();
                  router.push("/dashboard");
                } catch {
                  /* user closed popup or auth error */
                }
              }}
              disabled={!legalConsent}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Image src="/google-logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
              Continue with Google
              <ArrowRight className="h-4 w-4 text-zinc-400" aria-hidden />
            </button>
            <p className="text-center text-xs text-zinc-500">Free to use · No credit card</p>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-zinc-200/80 pt-10 text-sm text-zinc-600">
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-blue-600" strokeWidth={1.75} aria-hidden />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-16 max-w-3xl space-y-3 border-t border-zinc-200 pt-16 sm:mt-20 sm:pt-20">
          <p className="text-center text-sm leading-relaxed text-zinc-600 sm:text-base">
            Most broad “resume builder” searches are crowded. I Love Resumes focuses on one workflow: take your existing
            resume, align it to a specific posting, and ship a file employers can open.
          </p>
          <p className="text-center text-sm leading-relaxed text-zinc-600 sm:text-base">
            If you are applying in Canada, start with our{" "}
            <Link href="/resume-builder-canada" className="font-medium text-blue-700 underline-offset-2 hover:underline">
              Canada-focused guide
            </Link>{" "}
            or the step-by-step on{" "}
            <Link
              href="/how-to-tailor-a-resume-to-a-job-description"
              className="font-medium text-blue-700 underline-offset-2 hover:underline"
            >
              tailoring to a job description
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-4xl scroll-mt-24 border-t border-zinc-200 pt-14 sm:scroll-mt-28 sm:pt-16" id="guides">
          <div className="mb-8 flex flex-col items-center gap-3 text-center sm:mb-10">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
              <BookOpen className="h-5 w-5 text-blue-700" strokeWidth={1.75} aria-hidden />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Guides and templates</h2>
            <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
              Practical pages—long-tail topics, not generic buzzwords. Each links deeper into the blog where we go line by
              line.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {resourceLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
                >
                  {label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/resume-builder"
                className="flex min-h-[48px] items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
              >
                All guides hub
                <ArrowRight className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </Link>
            </li>
          </ul>
        </section>

        <section id="features" className="scroll-mt-24 pt-20 sm:scroll-mt-28 sm:pt-24">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-zinc-600 sm:text-base">
              Four steps from upload to a file you can submit with confidence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <feature.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 pt-20 sm:scroll-mt-28 sm:pt-24">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white px-5 py-1 shadow-sm sm:px-8">
            {[
              {
                q: "Is I Love Resumes free?",
                a: "Yes. Create and optimize resumes for free and export to Word and PDF at no cost.",
              },
              {
                q: "How does the AI work?",
                a: "Upload your resume and paste a job description. We suggest improvements and keywords to better match the role.",
              },
              {
                q: "Does it work for ATS?",
                a: "We emphasize clear structure and keyword alignment so automated screening can parse your resume reliably.",
              },
              {
                q: "What formats can I export?",
                a: "Word (.docx) and PDF—formats accepted by most employers and portals.",
              },
              {
                q: "Is my data private?",
                a: "We use Google Sign-In for authentication. We do not sell your resume data.",
              },
              {
                q: "Does it work for Canadian jobs?",
                a: "Yes. The tool supports job seekers in Canada and internationally, including common Canadian resume conventions.",
              },
            ].map((item) => (
              <div key={item.q} className="py-5 sm:py-6">
                <h3 className="text-sm font-semibold text-zinc-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-zinc-200 pt-12 text-center sm:mt-24 sm:pt-14">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-600">
            <Link href="/faq" className="min-h-[44px] min-w-[44px] px-2 py-2 hover:text-zinc-900 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25">
              FAQ
            </Link>
            <Link href="/blog" className="min-h-[44px] min-w-[44px] px-2 py-2 hover:text-zinc-900 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25">
              Blog
            </Link>
            <Link href="/resume-builder" className="min-h-[44px] min-w-[44px] px-2 py-2 hover:text-zinc-900 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25">
              Guides
            </Link>
          </div>
          <SiteLegalLinks className="mt-5" />
          <SocialLinks />
          <p className="mt-6 text-xs text-zinc-500 sm:text-sm">
            © {new Date().getFullYear()} I Love Resumes · Built by Rajan and Aaftab
          </p>
        </footer>
      </div>
    </div>
  );
}
