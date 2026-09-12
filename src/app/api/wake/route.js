import { getBackendBase } from "../../../server/backend";
import { clientKey, rateLimit } from "../../../server/rateLimit";

export const runtime = "nodejs";

/** Fire-and-forget wake; no auth (no sensitive work). Rate-limited. */
export async function POST(request) {
  const rl = rateLimit(`wake:${clientKey(request)}`, { limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return Response.json({ ok: true, skipped: true });
  }

  const base = getBackendBase();
  fetch(`${base}/health`, { method: "GET" })
    .catch(() => fetch(`${base}/`, { method: "GET" }))
    .catch(() => {});

  return Response.json({ ok: true });
}
