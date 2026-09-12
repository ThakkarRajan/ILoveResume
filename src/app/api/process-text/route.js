import { requireFirebaseUser } from "../../../server/auth";
import { backendHeaders, getBackendBase } from "../../../server/backend";
import { clientKey, rateLimit } from "../../../server/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const auth = await requireFirebaseUser(request);
  if (auth.error) return auth.error;

  const rl = rateLimit(`process-text:${clientKey(request, auth.user.uid)}`, {
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

  const resume_text = typeof body?.resume_text === "string" ? body.resume_text : "";
  const job_description =
    typeof body?.job_description === "string" ? body.job_description : "";

  if (!resume_text.trim() || !job_description.trim()) {
    return Response.json(
      { error: "resume_text and job_description are required" },
      { status: 400 }
    );
  }

  if (resume_text.length > 200_000 || job_description.length > 100_000) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  const upstream = await fetch(`${getBackendBase()}/process-text`, {
    method: "POST",
    headers: backendHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ resume_text, job_description }),
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
    },
  });
}
