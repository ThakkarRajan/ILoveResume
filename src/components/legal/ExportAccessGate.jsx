"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import LegalConsentCheckbox from "./LegalConsentCheckbox";
import { wakeBackend } from "../../utils/api";
import { hasExportLegalConsent, setExportLegalConsent } from "../../utils/legalConsent";

export default function ExportAccessGate({
  idPrefix = "export",
  user,
  onUserChange,
  onReady,
  title = "Accept terms before downloading",
  description = "Review our policies, then sign in to download Word or PDF exports.",
  compact = false,
}) {
  const [legalConsent, setLegalConsent] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    setLegalConsent(hasExportLegalConsent());
  }, []);

  useEffect(() => {
    if (user && legalConsent) {
      onReady?.();
    }
  }, [user, legalConsent, onReady]);

  const handleConsentChange = (checked) => {
    setLegalConsent(checked);
    setExportLegalConsent(checked);
  };

  const handleSignIn = async () => {
    if (!legalConsent || signingIn) return;
    setSigningIn(true);
    try {
      await import("../../utils/firebase.js");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      wakeBackend();
      onUserChange?.(result.user);
    } catch {
      /* popup closed or auth error */
    } finally {
      setSigningIn(false);
    }
  };

  const ready = Boolean(user) && legalConsent;

  if (ready) {
    return null;
  }

  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] ${compact ? "" : "panel"}`}>
      <div className={compact ? "space-y-4 p-5 sm:p-6" : "panel-body space-y-4"}>
        {!compact ? (
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
          </div>
        ) : null}

        <LegalConsentCheckbox
          id={`${idPrefix}-legal-consent`}
          checked={legalConsent}
          onChange={handleConsentChange}
          disabled={signingIn}
        />

        {!user ? (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={!legalConsent || signingIn}
            className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <Image src="/google-logo.svg" alt="" width={18} height={18} className="h-[18px] w-[18px]" />
            {signingIn ? "Signing in…" : "Sign in with Google"}
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </button>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">
            Accept the terms above to unlock Word and PDF downloads.
          </p>
        )}
      </div>
    </div>
  );
}

export function canExportResume(user) {
  return Boolean(user) && hasExportLegalConsent();
}
