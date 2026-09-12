import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import MarketingShell from "../components/ui/MarketingShell";
import NotFoundBackButton from "../components/ui/NotFoundBackButton";
import PageHeader from "../components/ui/PageHeader";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const helpfulLinks = [
  { href: "/resume-builder", label: "Resume guides" },
  { href: "/dashboard", label: "Tailor a resume" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact support" },
];

export default function NotFound() {
  return (
    <MarketingShell narrow footerClassName="mt-10">
      <PageHeader
        align="left"
        eyebrow="404"
        title="Page not found"
        description="The URL may be outdated, mistyped, or the page was moved. Use the links below to get back on track."
      />

      <div className="panel">
        <div className="panel-body space-y-6 p-6 sm:p-8">
          <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3">
            <FileQuestion className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" strokeWidth={1.75} aria-hidden />
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              If you followed a bookmark or external link, try the homepage or resume dashboard instead.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Helpful links</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {helpfulLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="card-interactive flex min-h-[44px] items-center px-4 py-3 text-sm font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn btn-primary">
              <Home className="h-4 w-4" aria-hidden />
              Go to homepage
            </Link>
            <NotFoundBackButton />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}
