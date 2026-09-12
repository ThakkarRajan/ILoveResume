"use client";

import "../utils/firebase.js";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useId } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import PublicNav from "./ui/PublicNav";
import SiteBrand from "./ui/SiteBrand";

const authLinks = [
  { href: "/dashboard", label: "Tailor" },
  { href: "/myprofile", label: "Activity" },
  { href: "/resume-builder", label: "Guides" },
  { href: "/contact", label: "Help" },
];

const mobileExtra = [
  { href: "/blog", label: "Blog" },
  { href: "/", label: "Home" },
];

function isActive(pathname, href) {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/myprofile") return pathname === "/myprofile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef();
  const closeRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShowMobileNav(false);
    setShowMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!showMobileNav) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setShowMobileNav(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [showMobileNav]);

  const handleLogout = () => {
    firebaseSignOut(getAuth());
    window.location.href = "/";
  };

  if (!user) {
    return <PublicNav />;
  }

  const shellClass = [
    "site-header",
    "site-header-static",
    "site-header-sticky",
    scrolled || showMobileNav ? "site-header-solid" : "site-header-transparent",
  ].join(" ");

  return (
    <>
      <header className={shellClass}>
        <div className="site-header-inner app-container">
          <SiteBrand href="/dashboard" label="I Love Resumes dashboard" priority />

          <nav className="site-nav-desktop" aria-label="Main">
            <ul className="site-nav-list">
              {authLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`site-nav-link${isActive(pathname, href) ? " is-active" : ""}`}
                    aria-current={isActive(pathname, href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="site-account-btn"
                aria-expanded={showMenu}
                aria-haspopup="menu"
                onClick={() => setShowMenu((p) => !p)}
              >
                <span className="site-account-avatar">
                  {user?.photoURL ? (
                    <Image src={user.photoURL} alt="" width={28} height={28} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-3.5 w-3.5 text-[var(--muted)]" strokeWidth={1.75} />
                  )}
                </span>
                <span className="site-account-name">{user?.displayName?.split(" ")[0] || "Account"}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-[var(--muted)] transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>

              {showMenu ? (
                <div className="site-account-menu" role="menu">
                  <div className="site-account-menu-head">
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">{user?.displayName}</p>
                    <p className="truncate text-xs text-[var(--muted)]">{user?.email}</p>
                  </div>
                  <Link href="/blog" role="menuitem" className="site-account-item" onClick={() => setShowMenu(false)}>
                    Blog
                  </Link>
                  <Link href="/" role="menuitem" className="site-account-item" onClick={() => setShowMenu(false)}>
                    Home
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="site-account-item site-account-item-danger"
                    onClick={() => {
                      setShowMenu(false);
                      setShowModal(true);
                    }}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="site-nav-mobile-bar">
            <button
              type="button"
              className="site-menu-toggle"
              aria-expanded={showMobileNav}
              aria-controls={menuId}
              aria-label={showMobileNav ? "Close menu" : "Open menu"}
              onClick={() => setShowMobileNav((v) => !v)}
            >
              <span className={`site-menu-icon${showMobileNav ? " is-open" : ""}`} aria-hidden>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>

        <div
          id={menuId}
          className={`site-mobile-panel${showMobileNav ? " is-open" : ""}`}
          hidden={!showMobileNav}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="site-mobile-panel-inner">
            <button ref={closeRef} type="button" className="sr-only" onClick={() => setShowMobileNav(false)}>
              Close menu
            </button>
            <nav aria-label="Mobile">
              <ul className="site-mobile-list">
                {[...authLinks, ...mobileExtra].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`site-mobile-link${isActive(pathname, href) ? " is-active" : ""}`}
                      aria-current={isActive(pathname, href) ? "page" : undefined}
                      onClick={() => setShowMobileNav(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              className="site-mobile-cta site-mobile-cta-danger"
              onClick={() => {
                setShowMobileNav(false);
                setShowModal(true);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {showModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-white p-6 shadow-xl"
          >
            <h2 id="signout-title" className="text-lg font-semibold text-[var(--foreground)]">
              Sign out?
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You&apos;ll need to sign in again to open your drafts and exports.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[2.75rem] flex-1 items-center justify-center rounded-[var(--radius-lg)] bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
