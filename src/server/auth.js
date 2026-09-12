import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

function projectId() {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    ""
  );
}

/**
 * Require a valid Firebase ID token (Bearer).
 * @returns {{ user: { uid: string, email?: string } } | { error: Response }}
 */
export async function requireFirebaseUser(request) {
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return {
      error: Response.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  const pid = projectId();
  if (!pid) {
    return {
      error: Response.json(
        { error: "Server misconfigured: FIREBASE_PROJECT_ID missing" },
        { status: 500 }
      ),
    };
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${pid}`,
      audience: pid,
    });

    if (!payload.sub) {
      return {
        error: Response.json({ error: "Invalid token" }, { status: 401 }),
      };
    }

    return {
      user: {
        uid: String(payload.sub),
        email: typeof payload.email === "string" ? payload.email : undefined,
      },
    };
  } catch {
    return {
      error: Response.json({ error: "Invalid or expired token" }, { status: 401 }),
    };
  }
}
