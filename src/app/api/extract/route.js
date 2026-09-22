import { requireFirebaseUser } from "../../../server/auth";
import { backendHeaders, getBackendBase } from "../../../server/backend";
import { clientKey, rateLimit } from "../../../server/rateLimit";
import { PDF_MAX_BYTES, PDF_MAX_LABEL } from "../../../utils/pdfLimits.js";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  const auth = await requireFirebaseUser(request);
  if (auth.error) return auth.error;

  const rl = rateLimit(`extract:${clientKey(request, auth.user.uid)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (!rl.ok) {
    return Response.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "file is required" }, { status: 400 });
  }

  const type = file.type || "";
  const name = typeof file.name === "string" ? file.name.toLowerCase() : "";
  if (type !== "application/pdf" && !name.endsWith(".pdf")) {
    return Response.json({ error: "Only PDF files are allowed" }, { status: 415 });
  }

  if (typeof file.size === "number" && file.size > PDF_MAX_BYTES) {
    return Response.json(
      { error: `File too large (max ${PDF_MAX_LABEL})` },
      { status: 413 }
    );
  }

  const forward = new FormData();
  forward.append("file", file, file.name || "resume.pdf");

  const upstream = await fetch(`${getBackendBase()}/extract`, {
    method: "POST",
    headers: backendHeaders(),
    body: forward,
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "application/json",
    },
  });
}
