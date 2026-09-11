import Link from "next/link";
import SiteLegalLinks from "../legal/SiteLegalLinks";
import SocialLinks from "../SocialLinks";

const footerLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/resume-builder", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

export default function PageFooter({ className = "" }) {
  return (
    <footer className={`border-t border-[var(--border)] pt-8 sm:pt-10 ${className}`}>
      <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">I Love Resumes</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
            Free resume tailoring for job seekers. Align your draft to each posting, then export Word or PDF.
          </p>
        </div>
        <nav className="flex flex-col gap-1 sm:items-end" aria-label="Footer navigation">
          {footerLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-link w-fit">
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <SiteLegalLinks className="mt-8" />
      <SocialLinks />
      <p className="mt-6 text-xs text-[var(--muted)] sm:text-sm">
        © {new Date().getFullYear()} I Love Resumes · Built by Rajan and Aaftab
      </p>
    </footer>
  );
}
