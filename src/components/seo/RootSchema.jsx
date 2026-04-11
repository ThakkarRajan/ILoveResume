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
      "Free web-based resume builder: tailor resumes to job descriptions, improve clarity, export Word and PDF.",
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
          "Free resume builder with AI-assisted tailoring, ATS-friendly structure, and Word/PDF export for Canadian and international job seekers.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-CA",
      },
      {
        "@type": "WebApplication",
        "@id": `${SITE_URL}/#webapp`,
        name: SITE_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        url: SITE_URL,
        offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
        browserRequirements: "Requires JavaScript. Modern browser.",
        featureList: [
          "Resume upload or paste",
          "Job description alignment",
          "In-browser editing",
          "Word and PDF export",
        ],
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
    ],
  };

  return <JsonLd data={graph} />;
}
