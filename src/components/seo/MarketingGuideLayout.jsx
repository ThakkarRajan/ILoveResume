import JsonLd from "./JsonLd";
import GuideCta from "./GuideCta";
import MarketingShell from "../ui/MarketingShell";
import BreadcrumbNav from "../ui/BreadcrumbNav";
import { SITE_URL } from "../../config/site";

/**
 * Long-form marketing / SEO guide shell: breadcrumb UI + BreadcrumbList JSON-LD.
 */
export default function MarketingGuideLayout({ path, breadcrumbLabel, children, showCta = true }) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: breadcrumbLabel, item: url },
    ],
  };

  return (
    <MarketingShell narrow>
      <JsonLd data={breadcrumbLd} />
      <article>
        <BreadcrumbNav
          items={[
            { href: "/", label: "Home" },
            { label: breadcrumbLabel },
          ]}
        />
        <div className="prose-guide space-y-6">
          {children}
          {showCta ? <GuideCta /> : null}
        </div>
      </article>
    </MarketingShell>
  );
}
