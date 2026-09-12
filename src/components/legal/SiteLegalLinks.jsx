import Link from "next/link";

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const linkClass = "site-footer__link site-footer__link--compact";

/** Compact legal nav for app / legal surfaces */
export default function SiteLegalLinks({ className = "" }) {
  return (
    <div className={`site-legal-compact ${className}`.trim()}>
      <nav className="site-legal-compact__nav" aria-label="Legal">
        {legalLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={linkClass}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
