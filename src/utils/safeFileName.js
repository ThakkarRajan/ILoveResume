/**
 * Object name for Firebase Storage under resumes/{email}/.
 * Keeps the original file name; only strips directory path segments.
 */
export function sanitizeResumeFileName(originalName) {
  const raw = typeof originalName === "string" ? originalName : "resume.pdf";
  const base = raw.split(/[/\\]/).pop()?.trim();
  return base || "resume.pdf";
}
