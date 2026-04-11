"use client";

import { LEGAL_SUPPORT_EMAIL, LEGAL_SUPPORT_MAILTO } from "./legal-constants";

const defaultClassName =
  "font-medium text-blue-700 underline-offset-2 hover:underline break-all";

export default function LegalSupportEmailLink({ className = defaultClassName }) {
  return (
    <a href={LEGAL_SUPPORT_MAILTO} className={className}>
      {LEGAL_SUPPORT_EMAIL}
    </a>
  );
}
