// Central API config and helpers
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://jobdraftai-backend-production.up.railway.app";

/**
 * Fire-and-forget call to wake/health-check the backend.
 * Railway and similar hosts can sleep services after inactivity.
 * Calling this on login ensures the backend is warmed up before the user
 * uploads a resume or triggers AI processing.
 * Tries /health first; falls back to / if needed. Does not block UI.
 */
export function wakeBackend() {
  fetch(`${API_BASE}/health`, { method: "GET" })
    .catch(() => fetch(`${API_BASE}/`, { method: "GET" }))
    .catch(() => {});
}

export { API_BASE };
