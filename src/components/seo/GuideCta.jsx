import Link from "next/link";

export default function GuideCta() {
  return (
    <aside className="not-prose mt-12 rounded-xl border border-blue-200 bg-blue-50/60 px-5 py-6 text-center sm:px-8">
      <p className="text-sm font-semibold text-zinc-900">Use the free builder on I Love Resumes</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">
        Sign in with Google, add your resume and a job description, edit the draft, then download Word or PDF.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2"
      >
        Open the resume builder
      </Link>
    </aside>
  );
}
