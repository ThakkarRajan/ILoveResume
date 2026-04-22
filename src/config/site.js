/** Canonical site origin — set NEXT_PUBLIC_SITE_URL in production if the domain changes. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://iloveresumes.ca").replace(/\/$/, "");

export const SITE_NAME = "I Love Resumes";

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
    default: `${SITE_NAME} — Free resume builder, AI resume & ATS-friendly exports`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "I Love Resumes (iloveresumes.ca): free resume builder and AI resume tailoring—upload or paste your resume, align skills and keywords from each posting, get ATS-friendly structure, then export Word or PDF. Templates, examples, and Canada-focused guides.",
  keywords: [
    "free resume",
    "free resume builder",
    "my resume",
    "resume builder",
    "resume builder Canada",
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
    "Toronto jobs resume",
    "Canada resume",
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
    images: [`${SITE_URL}/og-image.png`],
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
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}
