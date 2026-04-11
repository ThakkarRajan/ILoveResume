import Link from "next/link";
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <Link href="/" className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900">
          ← Home
        </Link>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {description ? <p className="mt-2 text-sm text-zinc-500">{description}</p> : null}
        <div className="mt-10">{children}</div>
        <footer className="mt-14 border-t border-zinc-200 pt-8">
          <SiteLegalLinks />
          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-zinc-500">
            These pages describe how the site works and how we treat information. They are not a substitute for legal advice;
            consult qualified counsel if you need certainty for your situation.
          </p>
        </footer>
      </div>
    </div>
  );
}
