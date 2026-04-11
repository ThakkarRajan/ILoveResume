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
import LegalConsentCheckbox from "../../components/legal/LegalConsentCheckbox";
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
  const [legalConsent, setLegalConsent] = useState(false);

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
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!legalConsent) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy.");
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
        toast.success("Message sent successfully! We'll get back to you soon.");
        
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
      setSubmitStatus('error');
      toast.error("Failed to send message. Please try again or contact us directly.");
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
      title: "AI-Powered",
      description: "Advanced AI technology for resume optimization"
    },
    {
      icon: Send,
      title: "Fast Processing",
      description: "Quick turnaround time for your resume needs"
    },
    {
      icon: Heart,
      title: "User-Friendly",
      description: "Intuitive interface designed for ease of use"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mb-12 text-center sm:mb-16">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm sm:h-14 sm:w-14">
            <MessageSquare className="h-6 w-6 text-blue-600 sm:h-7 sm:w-7" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Contact</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-zinc-600 sm:text-lg">
            Questions about the product, partnerships, or support—we read every message.
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
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 sm:h-12 sm:w-12">
                  <MessageSquare className="h-5 w-5 text-blue-700 sm:h-6 sm:w-6" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 sm:text-xl">Team & links</h2>
                  <p className="text-sm text-zinc-600 sm:text-base">Choose the channel that works best for you.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.href}
                    target={method.href.startsWith('http') ? "_blank" : undefined}
                    rel={method.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                    className="group relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 transition-colors hover:border-zinc-300 hover:bg-white hover:shadow-sm sm:p-5"
                  >
                    <div className="relative flex w-full flex-col items-center justify-center gap-3 text-center">
                      <ExternalLink className="absolute right-0 top-0 h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-700" />
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <method.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${method.iconColor}`} />
                      </div>
                      <div className="w-full overflow-hidden">
                        <h3 className="mb-1 truncate text-sm font-semibold text-zinc-900 sm:text-base">{method.title}</h3>
                        <p className="truncate text-xs text-zinc-600 sm:text-sm">{method.value}</p>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
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
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-100">
                  <Sparkles className="h-5 w-5 text-zinc-700" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">What we focus on</h2>
                  <p className="text-sm text-zinc-600">Straightforward tooling for serious applications.</p>
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
            <div className="sticky top-24 h-fit rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50">
                  <Send className="h-5 w-5 text-blue-700" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Send a message</h2>
                  <p className="text-sm text-zinc-600">We usually reply within a business day.</p>
                </div>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={unescapeHtml(formData.name)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={unescapeHtml(formData.email)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={unescapeHtml(formData.subject)}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={unescapeHtml(formData.message)}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600/15"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <LegalConsentCheckbox id="contact-legal-consent" checked={legalConsent} onChange={setLegalConsent} disabled={isSubmitting} />

                <motion.button
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting || !legalConsent}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 ${
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
                      Send Message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-zinc-700">
                  <Heart className="h-4 w-4 shrink-0 text-zinc-500" />
                  <span>We aim to respond within one business day.</span>
                </div>
              </div>


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
            <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">Ready to tailor a resume?</h3>
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
              Open dashboard
              <ArrowRight className="h-4 w-4 opacity-80" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
