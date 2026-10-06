/** Normalize contact values to full URLs for hyperlinks (Word + PDF + preview). */

export const CONTACT_LINK_FIELDS = {
  github: {
    prefix: "https://github.com/",
    placeholder: "write your username",
  },
  linkedin: {
    prefix: "https://www.linkedin.com/in/",
    placeholder: "write your username",
  },
  website: {
    prefix: "https://",
    placeholder: "write your website link",
  },
};

export const stripGithubUsername = (val) => {
  if (!val || typeof val !== "string") return "";
  return val
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\/?/i, "")
    .replace(/^github\.com\/?/i, "")
    .replace(/\/+$/, "");
};

export const stripLinkedInUsername = (val) => {
  if (!val || typeof val !== "string") return "";
  return val
    .trim()
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/i, "")
    .replace(/^(www\.)?linkedin\.com\/in\/?/i, "")
    .replace(/\/+$/, "");
};

export const stripWebsiteHost = (val) => {
  if (!val || typeof val !== "string") return "";
  return val
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
};

export const displayContactLinkValue = (key, val) => {
  if (key === "github") return stripGithubUsername(val);
  if (key === "linkedin") return stripLinkedInUsername(val);
  if (key === "website") return stripWebsiteHost(val);
  return typeof val === "string" ? val : "";
};

export const toGithubUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = stripGithubUsername(val);
  if (!v) return null;
  if (/^https?:\/\//i.test(val.trim())) return val.trim();
  return `https://github.com/${v}`;
};

export const toLinkedInUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = stripLinkedInUsername(val);
  if (!v) return null;
  if (/^https?:\/\//i.test(val.trim()) && /linkedin\.com/i.test(val)) return val.trim();
  return `https://www.linkedin.com/in/${v}`;
};

export const toWebsiteUrl = (val) => {
  if (!val || typeof val !== "string") return null;
  const v = stripWebsiteHost(val);
  if (!v) return null;
  if (/^https?:\/\//i.test(val.trim())) return val.trim();
  return `https://${v}`;
};
