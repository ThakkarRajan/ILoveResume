"use client";

import "../utils/firebase.js";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  Home,
  MessageSquare,
  ChevronDown,
  FileText,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

const navItem =
  "rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const navItemMobile = "min-h-[48px] flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    firebaseSignOut(getAuth());
    window.location.href = "/";
  };

  const shellClass = `w-full sticky top-0 z-50 border-b transition-shadow duration-200 ${
    isScrolled ? "border-zinc-200 bg-white/95 shadow-sm" : "border-zinc-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80"
  }`;

  if (user) {
    return (
      <>
        <motion.nav initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }} className={shellClass}>
          <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
            <Link href="/dashboard" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2">
              <Image src="/logo.png" alt="I Love Resumes" width={72} height={56} className="h-9 w-9 rounded-md object-contain sm:h-10 sm:w-10" />
              <Image
                src="/Iloveresumelogotext.png"
                alt="I Love Resumes"
                width={200}
                height={56}
                sizes="(max-width: 768px) 11rem, 13rem"
                quality={60}
                className="hidden h-8 w-auto max-w-[11rem] object-contain sm:block md:max-w-[13rem]"
              />
            </Link>

            <div className="hidden items-center gap-0.5 md:flex">
              <Link href="/dashboard" className={navItem}>
                Dashboard
              </Link>
              <Link href="/myprofile" className={navItem}>
                Profile
              </Link>
              <Link href="/resume-builder" className={navItem}>
                Guides
              </Link>
              <Link href="/blog" className={navItem}>
                Blog
              </Link>
              <Link href="/contact" className={navItem}>
                Contact
              </Link>
            </div>

            <div className="relative flex shrink-0 items-center gap-2" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
                aria-label="Menu"
              >
                {showMobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={() => setShowMenu((p) => !p)}
                className="flex min-h-[44px] max-w-[200px] items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 sm:px-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="" width={32} height={32} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-zinc-500" />
                  )}
                </div>
                <span className="hidden min-w-0 truncate sm:inline">{user?.displayName?.split(" ")[0] || "Account"}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${showMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg sm:w-72"
                  >
                    <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user?.photoURL ? (
                          <Image src={user.photoURL} alt="" width={40} height={40} className="rounded-lg" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200">
                            <User className="h-5 w-5 text-zinc-600" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-zinc-900">{user?.displayName}</p>
                          <p className="truncate text-xs text-zinc-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <Link href="/dashboard" onClick={() => setShowMenu(false)} className={`${navItem} w-full gap-3`}>
                        <LayoutDashboard className="h-4 w-4 text-zinc-500" />
                        Dashboard
                      </Link>
                      <Link href="/myprofile" onClick={() => setShowMenu(false)} className={`${navItem} w-full gap-3`}>
                        <User className="h-4 w-4 text-zinc-500" />
                        Profile
                      </Link>
                      <Link href="/resume-builder" onClick={() => setShowMenu(false)} className={`${navItem} w-full gap-3`}>
                        <BookOpen className="h-4 w-4 text-zinc-500" />
                        Guides
                      </Link>
                      <Link href="/blog" onClick={() => setShowMenu(false)} className={`${navItem} w-full gap-3`}>
                        <FileText className="h-4 w-4 text-zinc-500" />
                        Blog
                      </Link>
                      <Link href="/contact" onClick={() => setShowMenu(false)} className={`${navItem} w-full gap-3`}>
                        <MessageSquare className="h-4 w-4 text-zinc-500" />
                        Contact
                      </Link>
                      <Link href="/" onClick={() => setShowMenu(false)} className={`${navItem} mt-1 w-full gap-3 border-t border-zinc-100 pt-2`}>
                        <Home className="h-4 w-4 text-zinc-500" />
                        Home
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMenu(false);
                          setShowModal(true);
                        }}
                        className="mt-0.5 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/20"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        <AnimatePresence>
          {showMobileNav && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileNav(false)}
                className="fixed inset-0 z-40 bg-zinc-900/40 md:hidden"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-0 right-0 top-0 z-50 w-[min(18rem,100vw-2rem)] overflow-y-auto border-l border-zinc-200 bg-white shadow-xl md:hidden"
              >
                <div className="flex flex-col gap-0.5 p-4 pt-20">
                  <Link href="/dashboard" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                    Dashboard
                  </Link>
                  <Link href="/myprofile" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                    Profile
                  </Link>
                  <Link href="/resume-builder" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                    Guides
                  </Link>
                  <Link href="/blog" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                    Blog
                  </Link>
                  <Link href="/contact" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                    Contact
                  </Link>
                  <Link href="/" onClick={() => setShowMobileNav(false)} className={`${navItemMobile} mt-2 border-t border-zinc-100 pt-3`}>
                    Home
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl"
              >
                <h2 className="text-lg font-semibold text-zinc-900">Sign out?</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  You&apos;ll need to sign in again to open your drafts and exports.
                </p>
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <motion.nav initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }} className={shellClass}>
        <div className="mx-auto flex max-w-6xl min-w-0 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2">
            <Image src="/logo.png" alt="I Love Resumes" width={40} height={36} className="h-9 w-9 rounded-md sm:h-10 sm:w-10" />
            <Image
              src="/Iloveresumelogotext.png"
              alt="I Love Resumes"
              width={160}
              height={48}
              sizes="(max-width: 768px) 10rem, 12rem"
              quality={60}
              className="hidden h-8 w-auto max-w-[10rem] object-contain sm:block md:max-w-[12rem]"
            />
          </Link>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            <Link href="/" className={navItem}>
              Home
            </Link>
            <Link href="/resume-builder" className={navItem}>
              Guides
            </Link>
            <Link href="/blog" className={navItem}>
              Blog
            </Link>
            <Link href="/contact" className={navItem}>
              Contact
            </Link>
            <Link
              href="/"
              className="ml-2 inline-flex min-h-[44px] items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
              aria-label="Menu"
            >
              {showMobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileNav(false)}
              className="fixed inset-0 z-40 bg-zinc-900/40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-[min(18rem,85vw)] flex-col overflow-y-auto border-l border-zinc-200 bg-white pb-6 pt-20 shadow-xl md:hidden"
            >
              <div className="flex flex-col gap-0.5 px-4">
                <Link href="/" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                  Home
                </Link>
                <Link href="/resume-builder" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                  Guides
                </Link>
                <Link href="/blog" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                  Blog
                </Link>
                <Link href="/contact" onClick={() => setShowMobileNav(false)} className={navItemMobile}>
                  Contact
                </Link>
                <Link
                  href="/"
                  onClick={() => setShowMobileNav(false)}
                  className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
