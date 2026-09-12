export const SAVED_UPLOADS_PREVIEW = 3;

export function getSavedUploadsView(uploads, expanded) {
  const list = Array.isArray(uploads) ? uploads : [];
  const needsToggle = list.length > SAVED_UPLOADS_PREVIEW;
  const visible =
    needsToggle && !expanded ? list.slice(0, SAVED_UPLOADS_PREVIEW) : list;
  const hiddenCount = Math.max(0, list.length - SAVED_UPLOADS_PREVIEW);
  return { visible, needsToggle, hiddenCount };
}
