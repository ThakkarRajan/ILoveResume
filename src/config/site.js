/** Canonical site origin — set NEXT_PUBLIC_SITE_URL in production if the domain changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iloveresumes.ca").replace(/\/$/, "");

export const SITE_NAME = "I Love Resumes";

export const defaultOpenGraphImage = {
  url: `${SITE_URL}/logo.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Root layout defaults; child routes override via export const metadata. */
export const rootMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free AI resume builder & job-tailored exports`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Tailor your resume to each job posting with AI-assisted edits you control—upload or paste, align clear structure and role-relevant keywords, then export Word or PDF. Built for Canada and international applications.",
  keywords: [
    "free resume builder",
    "resume tailoring",
    "resume builder Canada",
    "tailor resume to job description",
    "ATS resume",
    "resume download Word PDF",
    "AI resume builder",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@iloveresumes",
    creator: "@iloveresumes",
    images: [`${SITE_URL}/logo.png`],
  },
  robots: { index: true, follow: true },
};

export function pageMeta({ title, description, path, ogType = "website" }) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_CA",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/logo.png`],
    },
  };
}
