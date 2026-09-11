import Link from "next/link";

const linkClass =
  "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 rounded-sm";

/** Footer / utility row: site disclosure (Clarity) + legal + contact */
export default function SiteLegalLinks({ className = "" }) {
  return (
    <div className={className}>
      <p className="mx-auto mb-4 max-w-2xl px-1 text-center text-xs leading-relaxed text-zinc-500 sm:text-sm">
        We use{" "}
        <strong className="font-medium text-zinc-600">Microsoft Clarity</strong> to see how people use this site so we can
        improve it. By using the site, you agree that we and Microsoft may collect and use that data as described in our{" "}
        <Link href="/privacy" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5"
        aria-label="Legal and contact"
      >
      <Link href="/contact" className={linkClass}>
        Contact
      </Link>
      <Link href="/terms" className={linkClass}>
        Terms &amp; Conditions
      </Link>
      <Link href="/privacy" className={linkClass}>
        Privacy Policy
      </Link>
      <Link href="/cookies" className={linkClass}>
        Cookie Policy
      </Link>
      <Link href="/disclaimer" className={linkClass}>
        Disclaimer
      </Link>
    </nav>
    </div>
  );
}
