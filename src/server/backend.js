const LOCAL_BACKEND = "http://127.0.0.1:8000";
const PROD_BACKEND = "https://jobdraftai-backend-production.up.railway.app";

/**
 * Server-only backend URL + shared secret headers.
 * Prefer BACKEND_API_BASE / BACKEND_API_SECRET (never NEXT_PUBLIC_*).
 * Development default → local FastAPI; production → Railway.
 */
export function getBackendBase() {
  const explicit =
    process.env.BACKEND_API_BASE ||
    process.env.API_BASE ||
    "";
  if (explicit) {
    return String(explicit).replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return LOCAL_BACKEND;
  }

  // Legacy fallback (prefer server-only BACKEND_API_BASE in prod)
  const legacy = process.env.NEXT_PUBLIC_API_BASE;
  if (legacy) {
    return String(legacy).replace(/\/$/, "");
  }

  return PROD_BACKEND;
}

/**
 * Headers for Next → Railway. Secret stays server-side only.
 * @param {Record<string, string>} [extra]
 */
export function backendHeaders(extra = {}) {
  const secret =
    process.env.BACKEND_API_SECRET ||
    process.env.BACKEND_API_KEY ||
    "";
  const headers = { ...extra };
  if (secret) {
    headers["X-Backend-Secret"] = secret;
  }
  return headers;
}
