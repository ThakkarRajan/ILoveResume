/**
 * Decode HTML entities in strings for display in controlled inputs.
 * Use when data may come pre-escaped (e.g. from API) so "&amp;" shows as "&".
 * Safe for user-typed content: pass-through if no entities.
 */
export const unescapeHtml = (str) => {
  if (str == null) return "";
  const s = typeof str === "string" ? str : String(str);
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};
