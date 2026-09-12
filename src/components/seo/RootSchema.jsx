import JsonLd from "./JsonLd";
import { SITE_NAME, SITE_URL } from "../../config/site";

const sameAs = [
  "https://github.com/iloveresumes",
  process.env.NEXT_PUBLIC_LINKEDIN_URL,
  process.env.NEXT_PUBLIC_TWITTER_URL || process.env.NEXT_PUBLIC_X_URL,
  process.env.NEXT_PUBLIC_FACEBOOK_URL,
  process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  process.env.NEXT_PUBLIC_YOUTUBE_URL,
].filter(Boolean);

export default function RootSchema() {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    description:
      "Free resume builder and AI resume tailoring—job description keywords, skills phrasing, ATS-friendly structure, in-browser editing, Word or PDF export.",
    knowsAbout: [
      "Resume tailoring",
      "Applicant Tracking Systems",
      "Job description keywords",
      "Professional resume writing",
      "AI-assisted resume editing",
      "Word and PDF resume export",
    ],
    address: { "@type": "PostalAddress", addressCountry: "CA" },
    ...(sameAs.length ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/contact`,
      availableLanguage: "English",
    },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Free resume builder with AI resume suggestions: resume templates and examples in guides, skills and keyword alignment to job postings, ATS-friendly exports to Word or PDF.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        copyrightHolder: { "@id": `${SITE_URL}/#organization` },
        about: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#webapp`,
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        url: SITE_URL,
        description:
          "Web app: sign in with Google, upload or paste a resume, add a job description, review AI-assisted wording and keyword ideas, edit in the browser, export Word or PDF. Core tailoring and export are free.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        browserRequirements: "Requires JavaScript. Modern browser.",
        featureList: [
          "Resume upload or paste",
          "Job description alignment, skills, and keyword suggestions",
          "In-browser editing",
          "ATS-friendly structure and Word or PDF export",
        ],
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };

  return <JsonLd data={graph} />;
}
