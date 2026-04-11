"use client";

import Link from "next/link";

/**
 * Required consent for signup, processing, or export flows.
 * @param {string} props.id - stable id for label/input association
 */
export default function LegalConsentCheckbox({ id = "legal-consent", checked, onChange, disabled = false }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-3 sm:px-4">
      <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 text-left text-sm leading-snug text-zinc-700 ${disabled ? "cursor-not-allowed opacity-60" : ""}`}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-blue-600/25 focus:ring-offset-0 disabled:cursor-not-allowed"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-blue-700 underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-blue-700 underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <p className="mt-2.5 border-t border-zinc-200/80 pt-2.5 text-left text-[0.7rem] leading-snug text-zinc-500 sm:text-xs">
        How we use cookies and limitations on AI output:{" "}
        <Link href="/cookies" className="font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline" target="_blank" rel="noopener noreferrer">
          Cookie Policy
        </Link>
        {" · "}
        <Link href="/disclaimer" className="font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline" target="_blank" rel="noopener noreferrer">
          Disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
