"use client";

import dynamic from "next/dynamic";
import { wakeBackend } from "../utils/api.js";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Link from "next/link";
import LegalConsentCheckbox from "./legal/LegalConsentCheckbox";
import { useEffect, useState } from "react";

const SocialLinks = dynamic(() => import("./SocialLinks"), { ssr: true });
const SiteLegalLinks = dynamic(() => import("./legal/SiteLegalLinks"), { ssr: true });
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
    let cancelled = false;
    let unsubscribe = () => {};

    const startAuth = async () => {
      await import("../utils/firebase.js");
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      if (cancelled) return;
      const auth = getAuth();
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          router.push("/dashboard");
        }
      });
    };

    const ric = typeof window !== "undefined" && window.requestIdleCallback;
    let idleId;
    let timeoutId;
    if (typeof ric === "function") {
      idleId = ric(() => void startAuth(), { timeout: 2000 });
    } else {
      timeoutId = window.setTimeout(() => void startAuth(), 1);
    }

    return () => {
      cancelled = true;
      unsubscribe();
      if (idleId != null) window.cancelIdleCallback?.(idleId);
      if (timeoutId != null) clearTimeout(timeoutId);
    };
  }, [router]);

  if (user) {
    return null;
  }

  const features = [
    {
      icon: Upload,
      title: "Upload PDF or paste text",
      description:
        "Upload a PDF or paste plain text. We extract your content and keep formatting easy for ATS parsers to read.",
    },
    {
      icon: Target,
      title: "Align to the job description",
      description:
        "Paste the posting to surface relevant keywords and align phrasing with what employers and parsers look for.",
    },
    {
      icon: Edit3,
      title: "Edit, then export",
      description:
        "Review AI suggestions, rewrite in your voice, and export when the resume reflects how you want to be seen.",
    },
    {
      icon: Download,
      title: "Word & PDF download",
      description:
        "Download .docx or PDF files that work with most employer portals and recruiter inboxes.",
    },
  ];

  const trustItems = [
    { icon: Shield, label: "Secure Google sign-in" },
    { icon: FileCheck, label: "ATS-friendly structure" },
    { icon: Download, label: "No credit card" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
          <Link
            href="/"
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Image
              src="/logo.png"
              alt="I Love Resumes logo"
              width={36}
              height={36}
              sizes="36px"
              className="rounded-md"
            />
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
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Free resume builder · Clear, ATS-friendly layout · No credit card
          </p>
          <div className="mb-8 flex flex-col items-center gap-5 sm:mb-10 sm:flex-row sm:justify-center sm:gap-6">
            <Image
              src="/logo.png"
              alt="I Love Resumes app icon"
              width={72}
              height={72}
              priority
              fetchPriority="high"
              sizes="72px"
              className="h-[72px] w-[72px] rounded-xl border border-zinc-200 bg-white object-contain shadow-sm"
            />
            <Image
              src="/Iloveresumelogotext.png"
              alt="I Love Resumes wordmark"
              width={200}
              height={48}
              sizes="(max-width: 640px) 148px, 200px"
              quality={60}
              className="h-9 w-auto object-contain sm:h-11"
            />
          </div>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
            Free AI resume builder for applications that demand a tight match
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-zinc-600 sm:text-lg">
            For candidates who already have a draft: paste the job description, align keywords and phrasing for recruiters
            and ATS parsers, export a polished Word or PDF—every line stays yours to approve.
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:items-center">
            <LegalConsentCheckbox id="home-legal-consent" checked={legalConsent} onChange={setLegalConsent} />
            <button
              type="button"
              onClick={async () => {
                if (!legalConsent) return;
                try {
                  await import("../utils/firebase.js");
                  const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
                  const auth = getAuth();
                  const provider = new GoogleAuthProvider();
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
              Sign in with Google
              <ArrowRight className="h-4 w-4 text-zinc-400" aria-hidden />
            </button>
            <p className="text-center text-xs text-zinc-500">Free · No credit card required</p>
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
            Most resume builders stop at templates. I Love Resumes is built for one workflow: align an existing resume to a
            specific posting, then export a file recruiters can open.
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
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Guides & templates</h2>
            <p className="max-w-2xl text-sm text-zinc-600 sm:text-base">
              Practical guides on tailoring, ATS readability, Canada-specific norms, and downloads—written for people who
              are actively applying.
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
                All guides
                <ArrowRight className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              </Link>
            </li>
          </ul>
        </section>

        <section id="features" className="scroll-mt-24 pt-20 sm:scroll-mt-28 sm:pt-24">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">How it works</h2>
            <p className="mt-3 text-sm text-zinc-600 sm:text-base">
              Four steps from upload to an application-ready file.
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
                q: "Is I Love Resumes really free?",
                a: "Yes—create tailored drafts and export Word or PDF at no charge. No credit card.",
              },
              {
                q: "How does AI resume tailoring work?",
                a: "You upload or paste your resume and add the job description. We suggest stronger wording and relevant keywords; you edit and approve everything before export.",
              },
              {
                q: "Will this help with ATS resume screening?",
                a: "We focus on clean structure and role-relevant keywords so automated parsers and recruiters can read your resume reliably—results still depend on the employer's system and your qualifications.",
              },
              {
                q: "What formats can I export?",
                a: "Word (.docx) and PDF—the formats most application portals accept.",
              },
              {
                q: "How do you handle my resume data?",
                a: "Google Sign-In secures your account. We don't sell your resume data. Some processing uses trusted service providers as described in our Privacy Policy.",
              },
              {
                q: "Does it work for Canadian jobs?",
                a: "Yes—clear, keyword-aware resumes for Canada and international applications alike.",
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
