import { requireFirebaseUser } from "../../../server/auth";
import { backendHeaders, getBackendBase } from "../../../server/backend";
import { clientKey, rateLimit } from "../../../server/rateLimit";
import { assertSafeExtractUrl } from "../../../server/ssrf";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const auth = await requireFirebaseUser(request);
  if (auth.error) return auth.error;

  const rl = rateLimit(`extract-url:${clientKey(request, auth.user.uid)}`, {
    limit: 15,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const check = assertSafeExtractUrl(body?.url);
  if (!check.ok) {
    return Response.json({ error: check.error }, { status: 400 });
  }

  const upstream = await fetch(`${getBackendBase()}/extract-from-url`, {
    method: "POST",
    headers: backendHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ url: check.url }),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
    },
  });
}
