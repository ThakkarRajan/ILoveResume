import Link from "next/link";

const linkClass =
  "text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 rounded-sm";

/** Footer / utility row: legal + contact */
export default function SiteLegalLinks({ className = "" }) {
  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5 ${className}`}
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
  );
}
