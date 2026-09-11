import Link from "next/link";
import MarketingShell from "../ui/MarketingShell";
import SiteLegalLinks from "./SiteLegalLinks";

export function LegalSection({ title, children }) {
  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="text-base font-semibold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600">{children}</div>
    </section>
  );
}

export default function LegalDocLayout({ title, description, children }) {
  return (
    <MarketingShell narrow showFooter={false}>
      <Link href="/" className="btn btn-ghost -ml-3">
        ← Home
      </Link>
      <h1 className="display-heading mt-4">{title}</h1>
      {description ? <p className="prose-lead mt-3">{description}</p> : null}
      <div className="mt-10">{children}</div>
      <footer className="mt-14 border-t border-zinc-200 pt-8">
        <SiteLegalLinks />
        <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-zinc-500">
          These pages describe how the site works and how we treat information. They are not a substitute for legal advice;
          consult qualified counsel if you need certainty for your situation.
        </p>
      </footer>
    </MarketingShell>
  );
}
