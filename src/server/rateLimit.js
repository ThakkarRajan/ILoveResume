/**
 * Simple in-memory sliding window rate limiter (per serverless isolate).
 * Good enough as a first layer; pair with edge/WAF for production scale.
 */

const buckets = new Map();

function prune(key, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry) return;
  entry.times = entry.times.filter((t) => now - t < windowMs);
  if (entry.times.length === 0) buckets.delete(key);
}

/**
 * @param {string} key
 * @param {{ limit?: number, windowMs?: number }} opts
 * @returns {{ ok: true } | { ok: false, retryAfterSec: number }}
 */
export function rateLimit(key, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  prune(key, windowMs);
  let entry = buckets.get(key);
  if (!entry) {
    entry = { times: [] };
    buckets.set(key, entry);
  }
  if (entry.times.length >= limit) {
    const oldest = entry.times[0];
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return { ok: false, retryAfterSec };
  }
  entry.times.push(now);
  return { ok: true };
}

export function clientKey(request, userId) {
  const fwd = request.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${userId || "anon"}:${ip}`;
}
