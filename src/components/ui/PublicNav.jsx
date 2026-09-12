"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

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
  const menuId = useId();
  const closeRef = useRef(null);
  const links = [...baseLinks, ...extraLinks];

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

  const shellClass = [
    "site-header",
    fixed ? "site-header-fixed" : "site-header-static",
    scrolled || open ? "site-header-solid" : "site-header-transparent",
  ].join(" ");

  return (
    <header className={shellClass}>
      <div className="site-header-inner app-container">
        <Link href="/" className="site-brand" aria-label="I Love Resumes home">
          <Image
            src="/logo.png"
            alt=""
            width={1017}
            height={850}
            sizes="28px"
            className="site-brand-mark"
            priority
          />
          <span className="site-brand-name">
            I Love Resumes
          </span>
        </Link>

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
          <Link href="/dashboard" className="site-nav-cta">
            Start free
            <span className="site-nav-cta-arrow" aria-hidden>
              →
            </span>
          </Link>
        </nav>

        <div className="site-nav-mobile-bar">
          <Link href="/dashboard" className="site-nav-cta site-nav-cta-compact">
            Start free
          </Link>
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
          <Link href="/dashboard" className="site-mobile-cta" onClick={() => setOpen(false)}>
            Start free
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
