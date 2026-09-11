"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const baseLinks = [
  { href: "/resume-builder", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function linkClass(pathname, href) {
  const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  return `nav-link${active ? " nav-link-active" : ""}`;
}

export default function PublicNav({ fixed = false, extraLinks = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [...baseLinks, ...extraLinks];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const shell = fixed
    ? `fixed inset-x-0 top-0 z-40 border-b transition-shadow duration-200 ${
        scrolled ? "border-[var(--border)] bg-white/95 shadow-sm" : "border-[var(--border)]/80 bg-white/90 backdrop-blur-md"
      }`
    : "w-full border-b border-[var(--border)] bg-white/95 backdrop-blur-sm";

  return (
    <header className={shell}>
      <nav
        className="app-container flex min-h-[var(--nav-height)] min-w-0 items-center justify-between gap-2 sm:gap-3"
        aria-label="Main"
      >
        <Link
          href="/"
          className="flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:ring-offset-2"
        >
          <Image
            src="/logo.png"
            alt="I Love Resumes logo"
            width={1017}
            height={850}
            sizes="36px"
            className="h-9 w-auto rounded-md object-contain"
            priority
          />
          <span className="hidden text-sm font-semibold tracking-tight text-[var(--foreground)] sm:inline">
            I Love Resumes
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(pathname, href)}>
              {label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn btn-primary ml-2">
            Start free
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:hidden">
          <Link href="/dashboard" className="btn btn-primary shrink-0 px-2.5 text-xs sm:px-3 sm:text-sm">
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-inset)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--border)] bg-white px-page py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className={`${linkClass(pathname, href)} rounded-lg`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
