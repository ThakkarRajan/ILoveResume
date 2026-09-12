import { getAuth } from "firebase/auth";
import "../utils/firebase.js";

/**
 * Client calls same-origin Next.js proxies (never the Railway host directly).
 * Proxies require a Firebase ID token.
 */
async function authHeaders(extra = {}) {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("Sign in required");
  }
  const token = await user.getIdToken();
  return {
    ...extra,
    Authorization: `Bearer ${token}`,
  };
}

/** Warm backend via authenticated-optional wake proxy. */
export function wakeBackend() {
  fetch("/api/wake", { method: "POST" }).catch(() => {});
}

/**
 * Call /api/process-text (proxied). Returns fetch Response.
 */
export async function processText(resumeText, jobDescription) {
  const headers = await authHeaders({ "Content-Type": "application/json" });
  return fetch("/api/process-text", {
    method: "POST",
    headers,
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });
}

/**
 * Upload PDF for text extraction via /api/extract.
 */
export async function extractPdf(file, { signal } = {}) {
  const headers = await authHeaders();
  const formData = new FormData();
  formData.append("file", file);
  return fetch("/api/extract", {
    method: "POST",
    headers,
    body: formData,
    signal,
  });
}

/**
 * Extract PDF text from a Firebase Storage download URL via /api/extract-from-url.
 */
export async function extractFromUrl(url, { signal } = {}) {
  const headers = await authHeaders({ "Content-Type": "application/json" });
  return fetch("/api/extract-from-url", {
    method: "POST",
    headers,
    body: JSON.stringify({ url }),
    signal,
  });
}

/** @deprecated Prefer same-origin /api/* helpers. Kept empty export for any leftover imports. */
export const API_BASE = "";
