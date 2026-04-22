/**
 * Blog hero imagery — Pexels (https://www.pexels.com/license/): free to use; attribution appreciated.
 * `next.config` must allow `images.pexels.com` for next/image.
 *
 * We use Pexels CDN paths verified to return 200. (Unsplash hotlinks were intermittently 404ing via Next’s image optimizer.)
 */
const UTM = "utm_source=iloveresumes&utm_medium=referral";

export const pexelsSiteUrl = `https://www.pexels.com?${UTM}`;
export const pexelsLicenseUrl = "https://www.pexels.com/license/";

const PEXELS_SIZE = "auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=1";

/** Pexels CDN url — IDs verified (jpeg 200) on their image host. */
export function pexelsPhotoSrc(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${PEXELS_SIZE}`;
}

/**
 * One Pexels photo id per blog slug so each article has a unique cover.
 * Add a row when you add a post in `blog-posts.js` (keep slugs in sync).
 */
const BLOG_COVER_PEXELS_ID_BY_SLUG = {
  "harvard-resume-template-canada-guide": 3184292,
  "free-resume-builder-download-canada": 3183150,
  "resume-templates-canada-pick-right-one": 1181517,
  "ai-resume-builder-canada-pros-cons": 1181677,
  "resume-builder-canada-how-to-compare-options": 7688337,
  "resume-examples-canada-by-role": 1181396,
  "resume-samples-canada-how-to-use-them": 3184306,
  "best-skills-to-put-on-resume-canada": 1181395,
  "google-docs-resume-template-canada": 265087,
  "overleaf-latex-resume-canada": 380769,
  "indeed-resume-builder-canada-alternatives": 1181345,
  "my-resume-checklist-canada-2026": 1181351,
  "how-to-optimize-resume-for-ats-2026": 1181354,
  "best-resume-format-2026": 1181360,
  "canadian-resume-format-guide": 1181371,
  "how-to-write-resume-with-no-experience": 1181381,
  "how-to-explain-employment-gaps": 1181382,
  "how-long-should-resume-be": 1181385,
  "resume-for-career-change": 1181390,
  "how-to-tailor-resume-to-job": 1181391,
  "resume-summary-vs-objective": 1181392,
  "how-to-quantify-resume-achievements": 1181393,
  "should-you-include-references": 1181394,
  "resume-for-remote-jobs": 1181398,
  "how-to-write-cover-letter": 1181400,
  "resume-keywords-that-get-interviews": 1181401,
  "common-resume-mistakes": 1181403,
  "resume-for-students-new-grads": 1181405,
  "how-to-format-education-on-resume": 1181410,
  "job-hopping-on-resume": 1181411,
  "resume-for-immigrants-canada": 1181412,
  "linkedin-vs-resume": 1181413,
  "resume-for-tech-software-roles": 1181414,
  "resume-for-healthcare-nursing": 1181415,
  "resume-for-teachers": 1181417,
  "resume-for-retail-service": 1181418,
  "how-to-address-being-fired": 1181419,
  "resume-for-senior-executive": 1181420,
  "skills-section-resume": 1181421,
  "resume-fonts-design-tips": 1181422,
  "functional-vs-chronological-resume": 1181423,
  "resume-for-freelancers": 1181424,
  "overqualified-candidate-resume": 1181425,
  "resume-without-degree": 3182805,
};

/** If a slug is missing from the map, pick from this pool (e.g. new post before map update). */
const FALLBACK_PEXELS_IDS = [3182811, 3182812, 3182813, 3182814, 3184292, 3183150, 1181517, 1181677];

const CASUAL_BY_CATEGORY = {
  Templates: [
    "Pretty templates are fun. Unreadable PDFs are not. We’ll keep you on the right side of that line.",
    "Think of your template as the outfit—structure still has to carry the conversation.",
  ],
  Tools: [
    "Tool shopping beats rewriting bullets… until it doesn’t. We’ll speed up the useful part.",
    "Yes, you can still panic-save at 11:47 p.m. No judgment. We’ve all tab-cycled the same sentence.",
  ],
  AI: [
    "AI can draft; only you can defend the numbers in an interview. Keep it honest.",
    "Robots can suggest synonyms. They cannot verify you actually led that migration.",
  ],
  Writing: [
    "Strong verbs > vague ‘impact.’ Your future self (in the interview) will thank you.",
    "Buzzwords decay fast. Clear outcomes age better.",
  ],
  Format: [
    "Margins matter more than you’d think. So does leaving room for human eyeballs.",
    "If your sections fight each other for attention, recruiters pick ‘close tab.’",
  ],
  Tips: [
    "Small tweaks, repeated, beat heroic rewrites once a year. Consistency is underrated.",
    "Read your resume out loud once. Awkward phrasing hides until it hears itself.",
  ],
  ATS: [
    "ATS isn’t a villain—it’s a busy filter. Make its job easy and yours gets easier too.",
    "Parsable beats pretty when the first reader is software. Sorry, fancy icons.",
  ],
  Canada: [
    "Canadian hiring likes clarity, politeness, and zero drama in the header. Photos? Usually hard pass.",
    "Spell it ‘centre’ when it counts—your resume isn’t the place to surprise a hiring manager.",
  ],
  Career: [
    "Career plot twists happen. Your resume is the narrator—keep the facts straight.",
    "Pivoting is fine; rewriting history is not. We’re team ‘accurate but confident.’",
  ],
  Industry: [
    "Different industries scan for different proof. Mirror the posting like a polite echo.",
    "Jargon is fine when it’s shared jargon—otherwise translate for humans first.",
  ],
  _default: [
    "Resume work is chores with upside. Coffee helps. So does exporting before you overthink.",
    "You’ve got this. One section at a time beats staring at a blank page forever.",
  ],
};

function slugBucket(slug, modulo) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 33 + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

/** Cover image + Pexels credit (unique photo per post when slug is in `BLOG_COVER_PEXELS_ID_BY_SLUG`). */
export function getBlogCover(slug) {
  const id =
    BLOG_COVER_PEXELS_ID_BY_SLUG[slug] ?? FALLBACK_PEXELS_IDS[slugBucket(slug, FALLBACK_PEXELS_IDS.length)];
  return {
    src: pexelsPhotoSrc(id),
    creditLabel: "Pexels",
    creditUrl: pexelsSiteUrl,
    licenseUrl: pexelsLicenseUrl,
  };
}

/** Light, casual one-liner for the mood strip (deterministic per slug + category). */
export function getBlogCasualLine(slug, category) {
  const lines = CASUAL_BY_CATEGORY[category] || CASUAL_BY_CATEGORY._default;
  return lines[slugBucket(slug, lines.length)];
}
