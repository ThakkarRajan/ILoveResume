import Link from "next/link";
import Image from "next/image";
import SocialLinks from "../SocialLinks";

const exploreLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
  { href: "/resume-builder", label: "Guides" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const builders = [
  { name: "Rajan", href: "https://rajan.codes" },
  { name: "Aaftab", href: "https://aaftab.tech" },
];

export default function PageFooter({ className = "" }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`site-footer ${className}`.trim()}>
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/" className="site-footer__brand-lockup" aria-label="I Love Resumes home">
            <Image
              src="/logo.png"
              alt=""
              width={512}
              height={454}
              sizes="36px"
              className="site-footer__brand-mark"
            />
            <Image
              src="/logo-text.png"
              alt=""
              width={900}
              height={95}
              sizes="160px"
              className="site-footer__brand-wordmark"
            />
          </Link>
          <p className="site-footer__brand-desc">
            Free resume tailoring for job seekers. Align your draft to each posting, then export Word or PDF.
          </p>
        </div>

        <nav className="site-footer__nav" aria-labelledby="footer-explore-heading">
          <h2 id="footer-explore-heading" className="site-footer__heading">
            Explore
          </h2>
          <ul className="site-footer__list">
            {exploreLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="site-footer__link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="site-footer__nav" aria-labelledby="footer-legal-heading">
          <h2 id="footer-legal-heading" className="site-footer__heading">
            Legal
          </h2>
          <ul className="site-footer__list">
            {legalLinks.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="site-footer__link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <SocialLinks />

      <div className="site-footer__bar">
        <p className="site-footer__copy" translate="no">
          © {year} I Love Resumes
        </p>
        <p className="site-footer__credit">
          Built by{" "}
          {builders.map((builder, index) => (
            <span key={builder.href}>
              {index > 0 ? " and " : null}
              <a
                href={builder.href}
                className="site-footer__credit-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {builder.name}
              </a>
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
