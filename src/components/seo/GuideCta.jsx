import Link from "next/link";

export default function GuideCta() {
  return (
    <aside className="not-prose mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-5 py-5 sm:px-6">
      <p className="text-sm font-semibold text-[var(--foreground)]">Try the free resume builder</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
        Sign in with Google, add your resume and a job description, edit the draft, then download Word or PDF.
      </p>
      <Link href="/dashboard" className="btn btn-primary mt-5">
        Start tailoring a resume
      </Link>
    </aside>
  );
}
