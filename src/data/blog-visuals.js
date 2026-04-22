/**
 * Blog hero imagery — Unsplash (https://unsplash.com/license): free to use; we credit photographers on-page.
 * Add new rows here (never hotlink without license). `next.config` must allow `images.unsplash.com`.
 */
const UTM = "utm_source=iloveresumes&utm_medium=referral";

export const BLOG_STOCK_COVERS = [
  {
    src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=82",
    photographer: "Helloquence",
    photographerUrl: `https://unsplash.com/@helloquence?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1454165804606-c3d57bc86b40?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1523240795612-9a054b055db1?auto=format&fit=crop&w=1600&q=82",
    photographer: "rawpixel",
    photographerUrl: `https://unsplash.com/@rawpixel?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1523240795612-9a054b055db1?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1497032628192-86f99bc76fbc?auto=format&fit=crop&w=1600&q=82",
    photographer: "Brooke Cagle",
    photographerUrl: `https://unsplash.com/@brookecagle?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1497032628192-86f99bc76fbc?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1517245385007-929edfb5cdfe?auto=format&fit=crop&w=1600&q=82",
    photographer: "Austin Distel",
    photographerUrl: `https://unsplash.com/@austindistel?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1517245385007-929edfb5cdfe?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=82",
    photographer: "Campaign Creators",
    photographerUrl: `https://unsplash.com/@campaign_creators?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1542744173-8e7e53415bb0?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1521737711867-e59b388dfccc?auto=format&fit=crop&w=1600&q=82",
    photographer: "LinkedIn Sales Solutions",
    photographerUrl: `https://unsplash.com/@linkedinsalesnavigator?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1521737711867-e59b388dfccc?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1501504908252-473d47d871b1?auto=format&fit=crop&w=1600&q=82",
    photographer: "Carl Heyerdahl",
    photographerUrl: `https://unsplash.com/@carlheyerdahl?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1501504908252-473d47d871b1?${UTM}`,
  },
  {
    src: "https://images.unsplash.com/photo-1434030216611-0b793fd541d3?auto=format&fit=crop&w=1600&q=82",
    photographer: "Matthew Guay",
    photographerUrl: `https://unsplash.com/@matthewjoseph?${UTM}`,
    photoPageUrl: `https://unsplash.com/photos/1434030216611-0b793fd541d3?${UTM}`,
  },
];

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

/** Deterministic Unsplash cover + credit metadata for a slug. */
export function getBlogCover(slug) {
  const row = BLOG_STOCK_COVERS[slugBucket(slug, BLOG_STOCK_COVERS.length)];
  return row;
}

/** Light, casual one-liner for the mood strip (deterministic per slug + category). */
export function getBlogCasualLine(slug, category) {
  const lines = CASUAL_BY_CATEGORY[category] || CASUAL_BY_CATEGORY._default;
  return lines[slugBucket(slug, lines.length)];
}
