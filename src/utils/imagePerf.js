/** Shared image perf helpers — blur-first paint + consistent quality. */

/** Zinc-100 SVG placeholder so next/image can show paint before bytes arrive. */
export const IMAGE_BLUR_DATA_URL =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="10"><rect width="100%" height="100%" fill="#e4e4e7"/></svg>'
  );

/** Prefer smaller payloads for photos / logos (Next qualities must match next.config). */
export const IMAGE_QUALITY_PHOTO = 60;
export const IMAGE_QUALITY_UI = 60;
