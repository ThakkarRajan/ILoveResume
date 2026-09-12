"use client";

import Link from "next/link";
import PublicNav from "./ui/PublicNav";
import PageFooter from "./ui/PageFooter";
import WorkflowStepper from "./ui/WorkflowStepper";
import GuideCardGrid from "./ui/GuideCardGrid";
import FaqAccordion from "./ui/FaqAccordion";
import { homeFaqItems } from "../data/home-faq";
import HomeHero from "./motion/HomeHero";
import HomeLenis from "./motion/HomeLenis";
import ScrollReveal from "./motion/ScrollReveal";
import { motionDistance } from "./motion/motionConfig";
import HeroProductGraphic from "./graphics/HeroProductGraphic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Upload,
  Target,
  Edit3,
  Download,
  Shield,
  FileCheck,
  TrendingUp,
  Search,
  FileOutput,
} from "lucide-react";

const workflowSteps = [
  { id: "upload", label: "Add resume" },
  { id: "job", label: "Paste job post" },
  { id: "edit", label: "Review draft" },
  { id: "export", label: "Export" },
];

const resourceLinks = [
  { href: "/how-to-tailor-a-resume-to-a-job-description", name: "Tailor to a job description", description: "Match posting language without keyword stuffing." },
  { href: "/ats-friendly-resume", name: "ATS-friendly resume", description: "Structure recruiters and parsers can read." },
  { href: "/resume-templates", name: "Resume templates", description: "Layouts that stay readable in Word and PDF." },
  { href: "/resume-examples", name: "Resume examples", description: "Bullet patterns by role and seniority." },
  { href: "/harvard-resume-template", name: "Harvard-style template", description: "Classic one-page academic layout." },
  { href: "/google-docs-resume-template", name: "Google Docs resume", description: "Editable template for Docs users." },
  { href: "/ai-resume-builder", name: "AI resume builder", description: "Use AI suggestions without losing your voice." },
  { href: "/resume-builder-canada", name: "Resume norms for Canada", description: "Country-specific format and conventions when applying in Canada." },
];

const steps = [
  { icon: Upload, title: "Upload PDF or paste text", description: "We extract your content and keep formatting ATS-friendly." },
  { icon: Target, title: "Align to the job description", description: "Surface relevant keywords from the posting." },
  { icon: Edit3, title: "Edit, then export", description: "Review suggestions and rewrite in your voice." },
  { icon: Download, title: "Word and PDF download", description: "Export files that work with employer portals." },
];

const outcomes = [
  {
    icon: TrendingUp,
    title: "Postings drive the draft",
    description: "Suggestions target one role's language, not a generic template.",
  },
  {
    icon: Search,
    title: "Readable for ATS and humans",
    description: "Clean sections and role-relevant keywords, not layout tricks.",
  },
  {
    icon: FileOutput,
    title: "Export when you approve",
    description: "Word and PDF only after you edit every line.",
  },
];

export default function HomePageClient() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const startAuth = async () => {
      await import("../utils/firebase.js");
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      if (cancelled) return;
      const auth = getAuth();
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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

  return (
    <HomeLenis>
    <div className="page-canvas page-canvas-grid">
      <PublicNav fixed />

      <div className="app-container min-w-0 pb-0 pt-[calc(var(--nav-height)+0.85rem)] sm:pt-[calc(var(--nav-height)+1.15rem)]">
        <HomeHero
          copy={
            <>
              <WorkflowStepper steps={workflowSteps} current={0} className="mb-6" />
              <h1 className="display-heading max-w-[16ch] sm:max-w-none">
                Tailor your resume to each job posting
              </h1>
              <p className="prose-lead mt-5">
                <span className="font-medium text-[var(--foreground)]">I Love Resumes</span> helps you align an existing
                draft to a specific role. Paste the job description, refine keywords for recruiters and ATS parsers, then
                export Word or PDF. Every line stays yours to approve.
              </p>

              <div className="mt-8 max-w-md">
                <Link href="/dashboard" className="btn btn-primary w-full sm:w-auto">
                  Start tailoring free
                  <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
                </Link>
                <p className="mt-3 text-xs text-[var(--muted)]">Free. No credit card required.</p>
              </div>

              <div className="feature-strip mt-8">
                {[
                  { icon: Shield, label: "Secure Google sign-in" },
                  { icon: FileCheck, label: "ATS-friendly structure" },
                  { icon: Download, label: "No credit card" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.75} aria-hidden />
                    {label}
                  </div>
                ))}
              </div>
            </>
          }
          panel={<HeroProductGraphic />}
        />

        <section className="section-gap border-t border-[var(--border)] pt-[var(--section-y)]">
          <ScrollReveal y={motionDistance.subtle} className="mb-5 max-w-2xl">
            <h2 className="section-heading">How it works</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              Four steps from an existing draft to a posting-aligned export.
            </p>
          </ScrollReveal>
          <ol className="home-flow-grid">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} as="li" className="home-flow-step" delay={index * 0.05} y={motionDistance.item}>
                <span className="home-flow-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="home-flow-icon">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
              </ScrollReveal>
            ))}
          </ol>
        </section>

        <section className="section-gap border-t border-[var(--border)] pt-[var(--section-y)]">
          <ScrollReveal y={motionDistance.section} className="mb-6 max-w-2xl">
            <h2 className="section-heading">Built for serious applications</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              Most builders stop at templates. This product is for people who already have a draft and need it aligned to
              one posting before they hit submit.
            </p>
          </ScrollReveal>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {outcomes.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} as="article" className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5" delay={index * 0.07} y={motionDistance.item}>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                  <Icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.12} y={motionDistance.subtle} className="mt-6">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              New to tailoring? Start with{" "}
              <Link
                href="/how-to-tailor-a-resume-to-a-job-description"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                how to tailor to a job description
              </Link>
              .
            </p>
          </ScrollReveal>
        </section>

        <section id="guides" className="section-gap scroll-mt-24 border-t border-[var(--border)] pt-[var(--section-y)] sm:scroll-mt-28">
          <ScrollReveal className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-heading">Guides and templates</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)] sm:text-base">
                Practical reads for people actively applying.
              </p>
            </div>
            <Link href="/resume-builder" className="btn btn-secondary shrink-0">
              All guides
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </ScrollReveal>
          <GuideCardGrid guides={resourceLinks} />
        </section>

        <section id="faq" className="section-gap scroll-mt-24 border-t border-[var(--border)] pt-[var(--section-y)] sm:scroll-mt-28">
          <ScrollReveal y={motionDistance.subtle}>
            <h2 className="section-heading mb-6 sm:mb-8">Frequently asked questions</h2>
          </ScrollReveal>
          <ScrollReveal delay={0.06} y={motionDistance.item}>
            <FaqAccordion items={homeFaqItems} />
          </ScrollReveal>
        </section>

        <section className="section-gap border-t border-[var(--border)] pt-[var(--section-y)]">
          <ScrollReveal y={motionDistance.section}>
            <div className="home-cta rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-8 text-center sm:px-10">
              <h2 className="section-heading text-xl sm:text-2xl">Ready to tailor your next application?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--text-secondary)] sm:text-base">
                Open the dashboard, paste a job posting, and export when the draft reads like you.
              </p>
              <Link href="/dashboard" className="btn btn-primary mx-auto mt-6">
                Start tailoring free
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </ScrollReveal>
        </section>

        <PageFooter className="mt-6 sm:mt-8" />
      </div>
    </div>
    </HomeLenis>
  );
}
