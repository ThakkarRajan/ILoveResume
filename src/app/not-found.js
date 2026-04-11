"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import SiteLegalLinks from "../components/legal/SiteLegalLinks";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
          <FileQuestion className="h-7 w-7 text-zinc-500" strokeWidth={1.5} aria-hidden />
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
          The link may be outdated or the page may have been moved. Use the navigation above or return home.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50"
        >
          Back to home
        </Link>

        <div className="mt-10 w-full max-w-lg border-t border-zinc-200 pt-8">
          <SiteLegalLinks />
        </div>
      </div>
    </div>
  );
}
