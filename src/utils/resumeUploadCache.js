/**
 * Reuse Firebase Storage upload for the same in-memory PDF File
 * across repeat "Tailor my resume" clicks.
 */

export function pdfFileCacheKey(file) {
  if (!file || typeof file !== "object") return "";
  const name = typeof file.name === "string" ? file.name : "";
  const size = typeof file.size === "number" ? file.size : "";
  const lastModified = typeof file.lastModified === "number" ? file.lastModified : "";
  return `${name}|${size}|${lastModified}`;
}

/** @returns {{ fileURL: string, fileName: string, path: string } | null} */
export function getReusableResumeUpload(cache, file) {
  if (!cache || !file) return null;
  const key = pdfFileCacheKey(file);
  if (!key || cache.key !== key) return null;
  if (!cache.fileURL || !cache.fileName || !cache.path) return null;
  return {
    fileURL: cache.fileURL,
    fileName: cache.fileName,
    path: cache.path,
  };
}

export function buildResumeUploadCache(file, { fileURL, fileName, path }) {
  const key = pdfFileCacheKey(file);
  if (!key || !fileURL || !fileName || !path) return null;
  return { key, fileURL, fileName, path };
}
