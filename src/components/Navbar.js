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
  LayoutDashboard
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const handleLogout = () => {
    firebaseSignOut(getAuth());
    // Optionally redirect to home
    window.location.href = "/";
  };



  // ========== SIGNED-IN NAVBAR ==========
  if (user) {
    return (
      <>
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`w-full sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg border-b shadow-md ${isScrolled ? "shadow-lg" : "shadow-md"} bg-gradient-to-r from-white/90 via-purple-100/70 to-pink-100/70 border-purple-100/50`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <Image src="/logo.png" alt="I Love Resumes" width={80} height={56} className="w-12 h-10 sm:w-16 sm:h-12 md:w-20 md:h-14 rounded-lg sm:rounded-xl object-contain" />
              <Image src="/Iloveresumelogotext.png" alt="I Love Resumes" width={200} height={56} className="hidden sm:block w-32 md:w-44 h-8 object-contain" />
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link href="/dashboard" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-100/80 hover:text-purple-700 min-h-[44px] flex items-center">Dashboard</Link>
              <Link href="/myprofile" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-100/80 hover:text-purple-700 min-h-[44px] flex items-center">My Profile</Link>
              <Link href="/blog" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-100/80 hover:text-purple-700 min-h-[44px] flex items-center">Blog</Link>
              <Link href="/contact" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-100/80 hover:text-purple-700 min-h-[44px] flex items-center">Contact</Link>
            </div>

            <div className="relative flex items-center gap-2 shrink-0" ref={menuRef}>
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-purple-100/80 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Menu"
              >
                {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMenu((p) => !p)}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl font-medium text-sm shadow-md min-h-[44px]"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:block truncate max-w-[120px]">{user?.displayName?.split(" ")[0] || "Profile"}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 ${showMenu ? "rotate-180" : ""} transition-transform`} />
              </motion.button>

              {/* Signed-in: Profile dropdown */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
                  >
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center gap-3">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="" width={48} height={48} className="rounded-xl" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 truncate">{user?.displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Link href="/dashboard" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                <Link href="/myprofile" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">
                  <User className="w-5 h-5" />
                  My Profile
                </Link>
                <Link href="/blog" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">
                  <FileText className="w-5 h-5" />
                  Blog
                </Link>
                <Link href="/contact" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 font-medium">
                  <MessageSquare className="w-5 h-5" />
                  Contact
                </Link>
                <Link href="/" onClick={() => setShowMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-purple-50 font-medium border-t border-gray-100 mt-2 pt-3">
                  <Home className="w-5 h-5" />
                  Home
                </Link>
                <button
                  onClick={() => { setShowMenu(false); setShowModal(true); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium w-full mt-1"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.nav>

        {/* Signed-in: Mobile menu */}
        <AnimatePresence>
          {showMobileNav && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileNav(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25 }} className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden pt-20 px-4">
                <Link href="/dashboard" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700">Dashboard</Link>
                <Link href="/myprofile" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700">My Profile</Link>
                <Link href="/blog" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700">Blog</Link>
                <Link href="/contact" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700">Contact</Link>
                <Link href="/" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700 border-t mt-2 pt-3">Home</Link>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Logout Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border rounded-xl font-medium text-gray-700">Cancel</button>
                  <button onClick={handleLogout} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium">Logout</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ========== SIGNED-OUT NAVBAR ==========
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`w-full sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg border-b shadow-md ${isScrolled ? "shadow-lg" : "shadow-md"} bg-white/95 border-slate-200/50`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <Image src="/logo.png" alt="I Love Resumes" width={48} height={40} className="w-10 h-9 sm:w-12 sm:h-10 rounded-lg shrink-0" />
            <Image src="/Iloveresumelogotext.png" alt="I Love Resumes" width={160} height={48} className="hidden sm:block w-28 md:w-36 h-8 object-contain min-w-0" />
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2 ml-auto">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 min-h-[44px] flex items-center">Home</Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 min-h-[44px] flex items-center">Blog</Link>
            <Link href="/contact" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-600 min-h-[44px] flex items-center">Contact</Link>
            <Link href="/" className="ml-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 min-h-[44px] flex items-center">Sign in</Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Menu"
            >
              {showMobileNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="md:hidden px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white min-h-[44px] flex items-center justify-center whitespace-nowrap touch-manipulation">
              Sign in
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Signed-out: Mobile menu */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileNav(false)} className="fixed inset-0 bg-black/30 z-40 md:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25 }} className="fixed top-0 right-0 bottom-0 w-64 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden pt-20 px-4 pb-6 overflow-y-auto">
              <Link href="/" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700 min-h-[44px]">Home</Link>
              <Link href="/blog" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700 min-h-[44px]">Blog</Link>
              <Link href="/contact" onClick={() => setShowMobileNav(false)} className="flex items-center gap-3 py-3 font-medium text-gray-700 min-h-[44px]">Contact</Link>
              <Link href="/" onClick={() => setShowMobileNav(false)} className="mt-4 flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold min-h-[44px]">Sign in</Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
