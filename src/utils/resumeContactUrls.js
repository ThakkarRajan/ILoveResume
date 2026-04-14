/** Normalize contact values to full URLs for hyperlinks (Word + PDF + preview). */

export const toGithubUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://github.com/${v.replace(/^github\.com\/?/i, "")}`;
};

export const toLinkedInUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://linkedin.com/in/${v.replace(/^linkedin\.com\/in\/?/i, "")}`;
};

export const toWebsiteUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = val.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};
