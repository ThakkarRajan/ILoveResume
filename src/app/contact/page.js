// app/contact/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Github,
  MessageSquare,
  Send,
  Sparkles,
  Heart,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import MarketingShell from "../../components/ui/MarketingShell";
import { showError, showSuccess } from "../../utils/toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";
import { unescapeHtml } from "../../utils/safeHtml";
import LegalSupportEmailLink from "../../components/legal/LegalSupportEmailLink";
import { LEGAL_BUSINESS_ADDRESS } from "../../components/legal/legal-constants";

export default function Contact() {
  const { push } = useRouter();
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {});
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      showError("Fill everything in");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError("Bad email");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        showError("Email isn't set up yet");
        setIsSubmitting(false);
        return;
      }

      const result = await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);

      if (result.status === 200) {
        setSubmitStatus("success");
        showSuccess("Sent — we'll reply soon");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      const detail =
        typeof error?.text === "string"
          ? error.text
          : error?.message || (typeof error === "string" ? error : JSON.stringify(error));
      console.error("[contact] EmailJS send failed:", detail, error);
      setSubmitStatus("error");
      showError("Didn't send — try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    { icon: Mail, title: "Rajan's Email", value: "thakkarrajanca@gmail.com", href: "mailto:thakkarrajanca@gmail.com" },
    { icon: Github, title: "Rajan's GitHub", value: "ThakkarRajan", href: "https://github.com/ThakkarRajan" },
    { icon: ExternalLink, title: "Rajan's Portfolio", value: "rajan.codes", href: "https://rajan.codes" },
    { icon: Mail, title: "Aaftab's Email", value: "aaftabvhora62@gmail.com", href: "mailto:aaftabvhora62@gmail.com" },
    { icon: Github, title: "Aaftab's GitHub", value: "aaftab22", href: "https://github.com/aaftab22" },
    { icon: ExternalLink, title: "Aaftab's Portfolio", value: "aaftab.tech", href: "https://aaftab.tech" },
  ];

  const features = [
    { icon: Sparkles, title: "Tailored drafts", description: "Suggestions aligned to your target role and job description—not generic templates." },
    { icon: Send, title: "Built for quick applications", description: "Upload, tailor, edit, and export so you can submit faster with confidence." },
    { icon: Heart, title: "Simple workflow", description: "Clear steps from job description to a resume you are proud to send." },
  ];

  const submitBtnClass =
    isSubmitting
      ? "btn w-full cursor-not-allowed bg-zinc-200 text-zinc-500"
      : submitStatus === "success"
        ? "btn w-full bg-emerald-600 text-white hover:bg-emerald-700"
        : submitStatus === "error"
          ? "btn w-full bg-red-600 text-white hover:bg-red-700"
          : "btn btn-primary w-full";

  return (
    <MarketingShell>
      <PageHeader title="Contact us" description="Product questions, partnerships, or support—we read every message." />

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="panel">
            <div className="panel-body p-4 sm:p-8">
              <div className="mb-5 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)] sm:h-11 sm:w-11">
                  <MessageSquare className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="section-heading text-lg sm:text-xl">Reach the team</h2>
                  <p className="text-sm text-zinc-600">Choose the channel that works best for you.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {contactMethods.map((method) => (
                  <a
                    key={method.title}
                    href={method.href}
                    target={method.href.startsWith("http") ? "_blank" : undefined}
                    rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="card-interactive group relative flex flex-col items-center gap-3 p-4 text-center sm:p-5"
                  >
                    <ExternalLink className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700" aria-hidden />
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                      <method.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                    </div>
                    <div className="w-full min-w-0">
                      <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-900">{method.title}</h3>
                      <p className="break-words text-xs text-zinc-600 sm:text-sm" title={method.value}>{method.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body p-4 sm:p-8">
              <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Legal &amp; compliance</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                For privacy requests, compliance correspondence, and formal notices—not general product feedback (use the form for that).
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>
                  <span className="text-zinc-500">Site / operator:</span>{" "}
                  <span className="font-medium text-zinc-900">I Love Resumes</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    Public name of this resume service; operated by individuals, not as a registered corporation.
                  </span>
                </li>
                <li><span className="text-zinc-500">Privacy &amp; support:</span> <LegalSupportEmailLink /></li>
                <li><span className="text-zinc-500">Legal / formal notices:</span> <LegalSupportEmailLink /></li>
                <li>
                  <span className="text-zinc-500">Mailing address:</span>{" "}
                  <span className="font-medium text-zinc-900">{LEGAL_BUSINESS_ADDRESS}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="panel">
            <div className="panel-body p-4 sm:p-8">
              <div className="mb-6 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                  <Sparkles className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">What we focus on</h2>
                  <p className="text-sm text-zinc-600">Straightforward tooling for serious job applications.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3 md:gap-5">
                {features.map((feature) => (
                  <div key={feature.title} className="card-interactive p-5 text-center">
                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-zinc-200">
                      <feature.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-900">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="panel sticky top-20 h-fit sm:top-24">
            <div className="panel-body p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-muted)] sm:h-10 sm:w-10">
                  <Send className="h-4 w-4 text-[var(--accent)] sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-tight text-zinc-900 sm:text-xl">Send a message</h2>
                  <p className="text-xs text-zinc-600 sm:text-sm">Reply within ~1 business day.</p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input type="text" name="name" value={unescapeHtml(formData.name)} onChange={handleInputChange} className="input-field" placeholder="Full name" required />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" value={unescapeHtml(formData.email)} onChange={handleInputChange} className="input-field" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="form-label">Subject *</label>
                  <input type="text" name="subject" value={unescapeHtml(formData.subject)} onChange={handleInputChange} className="input-field" placeholder="What is this about?" required />
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={unescapeHtml(formData.message)} onChange={handleInputChange} rows={2} className="input-field resize-y leading-snug" placeholder="Details, links, or screenshots…" required />
                </div>
                <button type="submit" disabled={isSubmitting} className={submitBtnClass}>
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />Sending...</>
                  ) : submitStatus === "success" ? (
                    <><CheckCircle className="h-4 w-4" />Message Sent!</>
                  ) : submitStatus === "error" ? (
                    <><AlertCircle className="h-4 w-4" />Try Again</>
                  ) : (
                    <><Send className="h-4 w-4" />Send message<ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="mt-3 flex items-center gap-1.5 text-xs leading-snug text-zinc-500">
                <Heart className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                Thanks for reaching out—we read every message.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center sm:mt-12">
        <div className="panel mx-auto max-w-2xl">
          <div className="panel-body px-6 py-8 sm:px-10">
            <h3 className="section-heading text-lg sm:text-xl">Ready to tailor your resume?</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600 sm:text-base">
              Sign in with Google to open the dashboard, add a job description, and export when you are satisfied.
            </p>
            <button type="button" onClick={() => push("/dashboard")} className="btn btn-primary mx-auto mt-6">
              <Sparkles className="h-4 w-4 opacity-90" />
              Open resume dashboard
              <ArrowRight className="h-4 w-4 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
