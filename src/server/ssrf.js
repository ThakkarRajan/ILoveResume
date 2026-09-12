import { getBackendBase } from "./backend";

/**
 * Only allow https URLs pointing at Firebase / Google Cloud Storage.
 * Blocks private IPs, metadata hosts, and arbitrary internet SSRF.
 * @returns {{ ok: true, url: string } | { ok: false, error: string }}
 */
export function assertSafeExtractUrl(raw) {
  if (!raw || typeof raw !== "string") {
    return { ok: false, error: "URL required" };
  }

  let parsed;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, error: "Only https URLs allowed" };
  }

  const host = parsed.hostname.toLowerCase();

  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "metadata.google.internal" ||
    host === "metadata" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host === "169.254.169.254"
  ) {
    return { ok: false, error: "URL host not allowed" };
  }

  // Block literal private IPv4
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    ) {
      return { ok: false, error: "URL host not allowed" };
    }
  }

  if (host.includes(":") && (host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80"))) {
    return { ok: false, error: "URL host not allowed" };
  }

  const allowedHosts = new Set([
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
  ]);

  const bucket = (
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    ""
  )
    .replace(/^gs:\/\//, "")
    .split("/")[0]
    .toLowerCase();

  if (bucket) allowedHosts.add(bucket);

  if (!allowedHosts.has(host)) {
    return { ok: false, error: "URL host not allowed" };
  }

  try {
    const backendHost = new URL(getBackendBase()).hostname.toLowerCase();
    if (host === backendHost) {
      return { ok: false, error: "URL host not allowed" };
    }
  } catch {
    /* ignore */
  }

  return { ok: true, url: parsed.toString() };
}
