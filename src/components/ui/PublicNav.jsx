"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import SiteBrand from "./SiteBrand";
import { showError } from "../../utils/toast";

const baseLinks = [
  { href: "/resume-builder", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

export default function PublicNav({ fixed = false, extraLinks = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const menuId = useId();
  const closeRef = useRef(null);
  const links = [...baseLinks, ...extraLinks];
  const isDashboard = pathname.startsWith("/dashboard");
  const ctaLabel = isDashboard ? "Login" : "Start free";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleGoogleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    setOpen(false);
    try {
      await import("../../utils/firebase.js");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const { wakeBackend } = await import("../../utils/api");
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      wakeBackend();
    } catch {
      showError("Sign in with Google to continue");
    } finally {
      setSigningIn(false);
    }
  };

  const shellClass = [
    "site-header",
    fixed ? "site-header-fixed" : "site-header-static",
    scrolled || open ? "site-header-solid" : "site-header-transparent",
  ].join(" ");

  const ctaText = signingIn ? "Signing in…" : ctaLabel;

  return (
    <header className={shellClass}>
      <div className="site-header-inner app-container">
        <SiteBrand href="/" label="I Love Resumes home" priority />

        <nav className="site-nav-desktop" aria-label="Main">
          <ul className="site-nav-list">
            {links.map(({ href, label }) => (
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
          {isDashboard ? (
            <button
              type="button"
              className="site-nav-cta"
              onClick={handleGoogleLogin}
              disabled={signingIn}
            >
              {ctaText}
              <span className="site-nav-cta-arrow" aria-hidden>
                →
              </span>
            </button>
          ) : (
            <Link href="/dashboard" className="site-nav-cta">
              {ctaLabel}
              <span className="site-nav-cta-arrow" aria-hidden>
                →
              </span>
            </Link>
          )}
        </nav>

        <div className="site-nav-mobile-bar">
          {isDashboard ? (
            <button
              type="button"
              className="site-nav-cta site-nav-cta-compact"
              onClick={handleGoogleLogin}
              disabled={signingIn}
            >
              {ctaText}
            </button>
          ) : (
            <Link href="/dashboard" className="site-nav-cta site-nav-cta-compact">
              {ctaLabel}
            </Link>
          )}
          <button
            type="button"
            className="site-menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`site-menu-icon${open ? " is-open" : ""}`} aria-hidden>
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`site-mobile-panel${open ? " is-open" : ""}`}
        hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <div className="site-mobile-panel-inner">
          <button
            ref={closeRef}
            type="button"
            className="sr-only"
            onClick={() => setOpen(false)}
          >
            Close menu
          </button>
          <nav aria-label="Mobile">
            <ul className="site-mobile-list">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`site-mobile-link${isActive(pathname, href) ? " is-active" : ""}`}
                    aria-current={isActive(pathname, href) ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {isDashboard ? (
            <button
              type="button"
              className="site-mobile-cta"
              onClick={handleGoogleLogin}
              disabled={signingIn}
            >
              {ctaText}
              <span aria-hidden>→</span>
            </button>
          ) : (
            <Link href="/dashboard" className="site-mobile-cta" onClick={() => setOpen(false)}>
              {ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
