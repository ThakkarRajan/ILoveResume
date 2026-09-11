const CONSENT_KEY = "ilrLegalConsentAccepted";

export function hasExportLegalConsent() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "true";
}

export function setExportLegalConsent(accepted) {
  if (typeof window === "undefined") return;
  if (accepted) {
    localStorage.setItem(CONSENT_KEY, "true");
  } else {
    localStorage.removeItem(CONSENT_KEY);
  }
}
