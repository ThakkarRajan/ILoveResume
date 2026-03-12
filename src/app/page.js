"use client";

import "../utils/firebase.js";
import { wakeBackend } from "../utils/api.js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

import Link from "next/link";
import SocialLinks from "../components/SocialLinks";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Upload,
  Target,
  Edit3,
  Download,
  Star,
  Zap,
  Shield,
  Users,
  Menu,
  X,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Removed the loading screen for status === 'loading'.
  // Always render the main content below.

  return (
    <LazyMotion features={domAnimation} strict>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Homepage Header - internal links for SEO */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/50">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px] min-w-[44px] items-center justify-center shrink-0">
            <Image src="/logo.png" alt="I Love Resumes" width={40} height={40} className="rounded-lg" />
            <span className="font-semibold text-gray-800 hidden sm:inline text-base">I Love Resumes</span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="#features" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg min-h-[44px] flex items-center">Features</Link>
            <Link href="#faq" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg min-h-[44px] flex items-center">FAQ</Link>
            <Link href="/blog" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg min-h-[44px] flex items-center">Blog</Link>
            <Link href="/contact" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 rounded-lg min-h-[44px] flex items-center">Contact</Link>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-purple-100/80 hover:text-purple-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
        {/* Mobile nav dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-lg px-4 py-4 flex flex-col gap-1">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="py-3 px-3 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">Features</Link>
            <Link href="#faq" onClick={() => setMobileMenuOpen(false)} className="py-3 px-3 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">FAQ</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="py-3 px-3 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">Blog</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-3 px-3 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">Contact</Link>
          </div>
        )}
      </header>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2 sm:px-6 py-6 sm:py-10 !pt-40">
        {/* Hero Section */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center max-w-2xl sm:max-w-4xl w-full"
        >
          {/* Logo and Brand */}
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 lg:gap-8 mb-6 sm:mb-12 lg:mb-16"
          >
            <div className="relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              <Image
                src="/logo.png"
                alt="I Love Resumes Logo"
                width={100}
                height={100}
                priority
                className="relative z-10 rounded-2xl shadow-lg w-24 h-24 transition-transform duration-300 group-hover:scale-105"
                style={{ width: "120px", height: "100px" }}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Image
                src="/Iloveresumelogotext.png"
                alt="I Love Resumes Logo"
                width={160}
                height={50}
                priority
                className="h-10 sm:h-14 md:h-20 lg:h-24 object-contain drop-shadow-lg"
                style={{ width: "auto", height: "auto" }}
              />
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg border border-white/20">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 animate-pulse" />
                <span className="text-xs sm:text-base font-medium text-gray-700">
                  AI-Powered
                </span>
              </div>
            </div>
          </m.div>

          {/* Main Heading */}
          <m.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-3 sm:mb-6 leading-tight px-2 sm:px-4"
          >
            Free AI Resume Builder –{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ATS-Optimized in Seconds
            </span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-12 max-w-xl sm:max-w-2xl leading-relaxed px-2 sm:px-4"
          >
            Upload your resume, paste a job description, and get tailored keyword suggestions. Export to Word or PDF. Free. No credit card required.
          </m.p>

          {/* CTA Button */}
          <m.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              const auth = getAuth();
              const provider = new GoogleAuthProvider();
              try {
                await signInWithPopup(auth, provider);
                wakeBackend(); // Wake backend so it's ready when user reaches dashboard
                router.push("/dashboard");
              } catch (error) {
                // Optionally show error to user
              }
            }}
            className="group flex items-center justify-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm text-gray-800 px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold text-base sm:text-lg relative overflow-hidden w-full max-w-xs sm:max-w-sm sm:w-auto min-h-[48px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Image
              src="/google-logo.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="relative z-10 w-5 h-5 sm:w-6 sm:h-6"
            />
            <span className="relative z-10">Continue with Google</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </m.button>
          <p className="text-xs text-gray-500 mt-2">Free – no credit card required</p>

          {/* Trust Indicators */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-row flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 sm:mt-8 text-sm sm:text-base text-gray-500 px-2 sm:px-4"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
              <span>Trusted by 1000+ users</span>
            </div>
          </m.div>
        </m.div>

        {/* Why Choose Section - adds content depth for SEO */}
        <m.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 sm:mt-20 w-full max-w-2xl mx-auto px-4 text-center"
        >
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            I Love Resumes helps job seekers in Canada and beyond create ATS-optimized resumes that pass applicant tracking systems. Over 75% of applications are filtered by ATS before a human sees them—our AI analyzes job descriptions and suggests the right keywords so your resume gets through. Whether you&apos;re in Toronto, Vancouver, or anywhere else, our free resume builder works with Canadian and international formats. Upload your existing resume, paste the job description, and get tailored suggestions in seconds. Export to Word or PDF when you&apos;re ready to apply.
          </p>
        </m.section>

        {/* Features Section - scroll-mt for anchor links */}
        <m.section
          id="features"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 sm:mt-32 w-full max-w-2xl sm:max-w-6xl scroll-mt-24 sm:scroll-mt-28"
        >
          <div className="text-center mb-8 sm:mb-16 px-2 sm:px-4">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
              How Our Free AI Resume Builder Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg max-w-xl sm:max-w-2xl mx-auto">
              Create resumes that pass ATS systems and get noticed by recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-4">
            {[
              {
                icon: Upload,
                title: "PDF Resume Upload",
                description:
                  "Upload your resume in PDF or paste as text. Our AI analyzes it in seconds.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Target,
                title: "Job Description Matching",
                description:
                  "Paste any job description. Get keyword suggestions to align your resume with what recruiters and ATS look for.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Edit3,
                title: "Real-Time Editing",
                description:
                  "Edit AI suggestions on the spot. No back-and-forth.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Download,
                title: "Export to Word & PDF",
                description:
                  "Download your resume as .docx or PDF. ATS-friendly formats for any application.",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl group-hover:shadow-2xl transition-all duration-300"></div>
                <div className="relative p-4 sm:p-8 rounded-2xl sm:rounded-3xl">
                  <div
                    className={`inline-flex p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${feature.color} mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-xs sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </m.div>
            ))}
          </div>
        </m.section>

        {/* FAQ Section - scroll-mt for anchor links so content isn't hidden behind fixed header */}
        <m.section
          id="faq"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-12 sm:mt-24 w-full max-w-2xl mx-auto px-4 scroll-mt-24 sm:scroll-mt-28"
        >
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 text-left bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-lg">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Is I Love Resumes free?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Yes. Create and optimize resumes for free. Export to Word and PDF at no cost.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">How does the AI work?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Upload your resume and paste a job description. Our AI suggests improvements and keywords to match the job.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Does it work for ATS?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Yes. We focus on ATS-friendly structure and keyword alignment so your resume gets past automated screening.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What formats can I export?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Word (.docx) and PDF—standard formats for job applications.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Is my data private?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Yes. We use Google Sign-In for secure authentication. We do not sell or share your resume data with third parties.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Does it work for Canadian jobs?</h3>
              <p className="text-gray-600 text-sm sm:text-base">Yes. Our tool works for job seekers in Canada, the US, and worldwide. Canadian resume formats are fully supported.</p>
            </div>
          </div>
        </m.section>

        {/* Stats Section */}
        <m.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-12 sm:mt-32 w-full max-w-xl sm:max-w-4xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8 px-2 sm:px-4">
            {[
              { number: "8490+", label: "Resumes Created", icon: Star },
              { number: "98%", label: "Success Rate", icon: Zap },
              { number: "24/7", label: "AI Support", icon: Shield },
            ].map((stat, index) => (
              <m.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + index * 0.2, duration: 0.6 }}
                className="text-center"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/20 shadow-lg">
                  <stat.icon className="w-7 h-7 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                  <div className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </m.section>

        {/* Footer */}
        <m.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-16 sm:mt-32 text-center px-2"
        >
          <div className="bg-white/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-3">
              <Link href="/contact" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 min-h-[44px] min-w-[44px] flex items-center justify-center">Contact</Link>
              <Link href="/faq" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 min-h-[44px] min-w-[44px] flex items-center justify-center">FAQ</Link>
              <Link href="/blog" className="text-base font-medium text-gray-600 hover:text-purple-600 transition-colors py-2 px-3 min-h-[44px] min-w-[44px] flex items-center justify-center">Blog</Link>
            </div>
            <SocialLinks />
            <p className="text-gray-600 text-xs sm:text-base mt-3">
              © {new Date().getFullYear()} I Love Resumes · Built with ❤️ by{" "}
              <span className="font-semibold text-blue-600">Rajan and Aaftab</span>
            </p>
          </div>
        </m.footer>
      </div>
    </div>
    </LazyMotion>
  );
}
