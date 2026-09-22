/** Canonical site origin — set NEXT_PUBLIC_SITE_URL in production if the domain changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iloveresumes.ca").replace(/\/$/, "");

export const SITE_NAME = "I Love Resumes";

export const TWITTER_HANDLE = "@iloveresumes_ca";

export const defaultOpenGraphImage = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Root layout defaults; child routes override via export const metadata. */
export const rootMetadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  title: {
    default: `100% Free AI Resume Tailor | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "100% free AI resume tailor for job seekers. Match each job description, keep ATS-friendly structure, export Word or PDF.",
  keywords: [
    "100% free resume",
    "100% free resume builder",
    "free resume",
    "free resume builder",
    "my resume",
    "resume builder",
    "AI resume",
    "resume AI",
    "resume tailoring",
    "tailor resume to job description",
    "resume template",
    "resume templates",
    "resume examples",
    "resume skills",
    "what is a resume",
    "cover letter for resume",
    "ATS resume",
    "ATS resume optimization",
    "resume download Word PDF",
    "Applicant Tracking System",
    "job application resume",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export function pageMeta({ title, description, path, ogType = "website" }) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  /** Absolute title avoids double suffixes and keeps length under typical SERP limits. */
  const absoluteTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: absoluteTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle,
      description,
      url,
      type: ogType,
      siteName: SITE_NAME,
      locale: "en",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title: absoluteTitle,
      description,
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
