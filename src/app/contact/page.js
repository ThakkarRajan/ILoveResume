// app/contact/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import emailjs from '@emailjs/browser';
import { 
  Mail, 
  Github, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send,
  Sparkles,
  Heart,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../../utils/firebase.js";

import { unescapeHtml } from "../../utils/safeHtml";
import SiteLegalLinks from "../../components/legal/SiteLegalLinks";
import LegalSupportEmailLink from "../../components/legal/LegalSupportEmailLink";
import { LEGAL_BUSINESS_ADDRESS } from "../../components/legal/legal-constants";

export default function Contact() {
  const [user, setUser] = useState(null);
  const { push } = useRouter();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Public page - show content for both logged-in and logged-out users
    });
    return () => unsubscribe();
  }, []);

  // Contact page is now public - no auth gate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error("Please complete all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        toast.error("Email service not configured.");
        setIsSubmitting(false);
        return;
      }

      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        toast.success("Message sent. We typically reply within one business day.");
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      const detail =
        typeof error?.text === "string"
          ? error.text
          : error?.message || (typeof error === "string" ? error : JSON.stringify(error));
      console.error("[contact] EmailJS send failed:", detail, error);
      setSubmitStatus('error');
      toast.error("Couldn't send your message. Try again or use the email links on this page.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Rajan's Email",
      value: "thakkarrajanca@gmail.com",
      href: "mailto:thakkarrajanca@gmail.com",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Github,
      title: "Rajan's GitHub",
      value: "ThakkarRajan",
      href: "https://github.com/ThakkarRajan",
      color: "from-gray-700 to-gray-800",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-700"
    },
    {
      icon: ExternalLink,
      title: "Rajan's Portfolio",
      value: "rajan.codes",
      href: "https://rajan.codes",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      icon: Mail,
      title: "Aaftab's Email",
      value: "aaftabvhora62@gmail.com",
      href: "mailto:aaftabvhora62@gmail.com",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Github,
      title: "Aaftab's GitHub",
      value: "aaftab22",
      href: "https://github.com/aaftab22",
      color: "from-gray-700 to-gray-800",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-700"
    },
    {
      icon: ExternalLink,
      title: "Aaftab's Portfolio",
      value: "aaftab.tech",
      href: "https://aaftab.tech",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: "Tailored drafts",
      description: "Suggestions aligned to your target role and job description—not generic templates.",
    },
    {
      icon: Send,
      title: "Built for quick applications",
      description: "Upload, tailor, edit, and export so you can submit faster with confidence.",
    },
    {
      icon: Heart,
      title: "Simple workflow",
      description: "Clear steps from job description to a resume you are proud to send.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <div className="mx-auto max-w-6xl px-page py-8 sm:py-14">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-10 text-center sm:mb-16">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm sm:h-14 sm:w-14">
            <MessageSquare className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-zinc-900 min-[400px]:text-3xl sm:text-4xl">Contact us</h1>
          <p className="mx-auto mt-3 max-w-2xl px-0.5 text-base text-zinc-600 sm:px-0 sm:text-lg">
            Product questions, partnerships, or support—we read every message.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Methods */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-8">
              <div className="mb-5 flex min-w-0 items-start gap-3 sm:mb-8 sm:items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 sm:h-12 sm:w-12">
                  <MessageSquare className="h-5 w-5 text-blue-700 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Reach the team</h2>
                  <p className="text-sm text-zinc-600 sm:text-base">Choose the channel that works best for you.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.href}
                    target={method.href.startsWith('http') ? "_blank" : undefined}
                    rel={method.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.2 }}
                    whileHover={{ y: -1, transition: { duration: 0.15 } }}
                    className="group relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-5"
                  >
                    <div className="relative flex w-full min-w-0 flex-col items-center justify-center gap-3 text-center">
                      <ExternalLink className="pointer-events-none absolute right-0 top-0 h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700" aria-hidden />
                      <div className={`h-12 w-12 sm:h-14 sm:w-14 ${method.bgColor} flex items-center justify-center rounded-xl transition-transform group-hover:scale-110`}>
                        <method.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${method.iconColor}`} />
                      </div>
                      <div className="w-full min-w-0">
                        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-zinc-900 sm:text-base">{method.title}</h3>
                        <p
                          className="break-words text-xs text-zinc-600 sm:text-sm"
                          title={method.value}
                        >
                          {method.value}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Legal &amp; compliance</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                For privacy requests, compliance correspondence, and formal notices—not general product feedback (use the
                form for that).
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                <li>
                  <span className="text-zinc-500">Site / operator:</span>{" "}
                  <span className="font-medium text-zinc-900">I Love Resumes</span>
                  <span className="mt-1 block text-xs text-zinc-500">
                    Public name of this resume service; operated by individuals, not as a registered corporation.
                  </span>
                </li>
                <li>
                  <span className="text-zinc-500">Privacy &amp; support:</span> <LegalSupportEmailLink />
                </li>
                <li>
                  <span className="text-zinc-500">Legal / formal notices:</span> <LegalSupportEmailLink />
                </li>
                <li>
                  <span className="text-zinc-500">Mailing address:</span>{" "}
                  <span className="font-medium text-zinc-900">{LEGAL_BUSINESS_ADDRESS}</span>
                </li>
              </ul>
            </div>

            {/* Features Section */}
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-8">
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
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.2 }}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-5 text-center transition-colors hover:border-zinc-300 hover:bg-white"
                  >
                    <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-zinc-200">
                      <feature.icon className="h-5 w-5 text-blue-700" strokeWidth={1.75} />
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-zinc-900">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-20 h-fit rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:top-24 sm:p-5">
              <div className="mb-4 flex items-center gap-2.5 sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:h-10 sm:w-10">
                  <Send className="h-4 w-4 text-blue-700 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-tight text-zinc-900 sm:text-xl">Send a message</h2>
                  <p className="text-xs text-zinc-600 sm:text-sm">Reply within ~1 business day.</p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-800 sm:text-sm">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={unescapeHtml(formData.name)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-800 sm:text-sm">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={unescapeHtml(formData.email)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-800 sm:text-sm">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={unescapeHtml(formData.subject)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-800 sm:text-sm">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={unescapeHtml(formData.message)}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-snug text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="Details, links, or screenshots…"
                    required
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 ${
                    isSubmitting
                      ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                      : submitStatus === "success"
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : submitStatus === "error"
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Message Sent!
                    </>
                  ) : submitStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Try Again
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-3 flex items-center gap-1.5 text-xs leading-snug text-zinc-500">
                <Heart className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                Thanks for reaching out—we read every message.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-10 sm:mt-16 sm:pt-12">
          <SiteLegalLinks />
        </div>

        {/* Footer Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-16 text-center sm:mt-20"
        >
          <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white px-6 py-10 shadow-sm sm:px-10">
            <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">Ready to tailor your resume?</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-600 sm:text-base">
              Sign in with Google to open the dashboard, add a job description, and export when you are satisfied.
            </p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => push("/dashboard")}
              className="mx-auto mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
            >
              <Sparkles className="h-4 w-4 opacity-90" />
              Open resume dashboard
              <ArrowRight className="h-4 w-4 opacity-80" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
