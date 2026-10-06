"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Github,
  Send,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const lastSubmitAt = useRef(0);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, () => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot — bots fill hidden "company"
    if (formData.company?.trim()) {
      setSubmitStatus("success");
      return;
    }

    const now = Date.now();
    if (now - lastSubmitAt.current < 5000) {
      showError("Slow down — wait a few seconds");
      return;
    }

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
        lastSubmitAt.current = now;
        setSubmitStatus("success");
        showSuccess("Sent — we'll reply soon");
        setFormData({ name: "", email: "", subject: "", message: "", company: "" });
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

  const team = [
    {
      name: "Rajan",
      links: [
        { icon: Mail, label: "Email", value: "thakkarrajanca@gmail.com", href: "mailto:thakkarrajanca@gmail.com" },
        { icon: Github, label: "GitHub", value: "ThakkarRajan", href: "https://github.com/ThakkarRajan" },
        { icon: ExternalLink, label: "Portfolio", value: "rajan.codes", href: "https://rajan.codes" },
      ],
    },
    {
      name: "Aaftab",
      links: [
        { icon: Mail, label: "Email", value: "aaftabvhora62@gmail.com", href: "mailto:aaftabvhora62@gmail.com" },
        { icon: Github, label: "GitHub", value: "aaftab22", href: "https://github.com/aaftab22" },
        { icon: ExternalLink, label: "Portfolio", value: "aaftab.tech", href: "https://aaftab.tech" },
      ],
    },
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
      <div className="resource-page contact-page">
        <header className="resource-page-header contact-invite">
          <p className="eyebrow">Contact</p>
          <h1 className="display-heading">Let&apos;s talk</h1>
          <p className="prose-lead mt-3">
            Product questions, partnerships, or support—send a message and we&apos;ll reply within about one business day.
          </p>
          <p className="prose-lead mt-3 text-[var(--text-secondary)]">
            I Love Resumes is a free AI resume tailor: paste a job description, edit suggested wording, and export Word or
            PDF. For how-tos first, browse the{" "}
            <a href="/faq" className="underline underline-offset-2">
              FAQ
            </a>
            ,{" "}
            <a href="/ats-friendly-resume" className="underline underline-offset-2">
              ATS-friendly resume guide
            </a>
            , or{" "}
            <a href="/how-to-tailor-a-resume-to-a-job-description" className="underline underline-offset-2">
              tailoring walkthrough
            </a>
            . Use this page for account issues, privacy requests, feedback, and partnership inquiries.
          </p>
          <a href="mailto:thakkarrajanca@gmail.com" className="contact-primary-cta">
            <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            Email Rajan
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </header>

        <div className="contact-layout">
          <section className="contact-form-block" aria-labelledby="contact-form-heading">
            <h2 id="contact-form-heading" className="contact-block-title">
              Send a message
            </h2>
            <p className="contact-block-desc">Use the form for product feedback and general support.</p>

            <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
              {/* Honeypot — leave empty */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
              >
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              {submitStatus === "success" ? (
                <p className="contact-form-status is-success" role="status" aria-live="polite">
                  Message sent — we&apos;ll reply soon.
                </p>
              ) : null}
              {submitStatus === "error" ? (
                <p className="contact-form-status is-error" role="alert" aria-live="assertive">
                  Couldn&apos;t send. Check connection and try again.
                </p>
              ) : null}
              <div className="contact-form-grid">
                <div>
                  <label className="form-label" htmlFor="contact-name">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={unescapeHtml(formData.name)}
                    onChange={handleInputChange}
                    className="input-field"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="contact-email">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={unescapeHtml(formData.email)}
                    onChange={handleInputChange}
                    className="input-field"
                    autoComplete="email"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="form-label" htmlFor="contact-subject">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={unescapeHtml(formData.subject)}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={unescapeHtml(formData.message)}
                  onChange={handleInputChange}
                  rows={5}
                  className="input-field resize-y"
                  required
                />
              </div>
              <button type="submit" disabled={isSubmitting} className={submitBtnClass}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4" aria-hidden />
                    Message sent
                  </>
                ) : submitStatus === "error" ? (
                  <>
                    <AlertCircle className="h-4 w-4" aria-hidden />
                    Try again
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden />
                    Send message
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="contact-aside">
            <section aria-labelledby="team-heading">
              <h2 id="team-heading" className="contact-block-title">
                Team
              </h2>
              <div className="contact-team">
                {team.map((person) => (
                  <div key={person.name} className="contact-person">
                    <p className="contact-person-name">{person.name}</p>
                    <ul className="contact-link-list">
                      {person.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="contact-link-row"
                          >
                            <link.icon className="h-4 w-4 shrink-0 text-[var(--accent)]" strokeWidth={1.75} aria-hidden />
                            <span className="min-w-0">
                              <span className="contact-link-label">{link.label}</span>
                              <span className="contact-link-value">{link.value}</span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="contact-legal" aria-labelledby="legal-heading">
              <h2 id="legal-heading" className="contact-block-title">
                Legal &amp; compliance
              </h2>
              <p className="contact-block-desc">
                Privacy requests and formal notices—not general product feedback.
              </p>
              <ul className="contact-legal-list">
                <li>
                  <span>Operator</span>
                  <strong>I Love Resumes</strong>
                </li>
                <li>
                  <span>Privacy &amp; support</span>
                  <LegalSupportEmailLink />
                </li>
                <li>
                  <span>Mailing address</span>
                  <strong>{LEGAL_BUSINESS_ADDRESS}</strong>
                </li>
              </ul>
            </section>
          </aside>
        </div>

        <div className="contact-close">
          <p className="contact-close-title">Ready to tailor a resume?</p>
          <p className="contact-close-desc">Open the dashboard, paste a job posting, and export when it reads like you.</p>
          <button type="button" onClick={() => push("/dashboard")} className="btn btn-primary">
            Open resume dashboard
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </MarketingShell>
  );
}
