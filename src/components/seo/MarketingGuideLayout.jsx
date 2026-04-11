import Link from "next/link";
import JsonLd from "./JsonLd";
import { SITE_URL } from "../../config/site";

/**
 * Long-form marketing / SEO guide shell: breadcrumb UI + BreadcrumbList JSON-LD.
 */
export default function MarketingGuideLayout({ path, breadcrumbLabel, children }) {
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
    <>
      <JsonLd data={breadcrumbLd} />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-zinc-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="font-medium text-blue-700 hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-zinc-400">
              /
            </li>
            <li className="font-medium text-zinc-800">{breadcrumbLabel}</li>
          </ol>
        </nav>
        <div className="prose-guide space-y-8 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem] [&_h1]:text-balance [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:border-t [&_h2]:border-zinc-200 [&_h2]:pt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:first:mt-0 [&_h2]:first:border-t-0 [&_h2]:first:pt-0 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline-offset-2 [&_a]:hover:underline">
          {children}
        </div>
      </article>
    </>
  );
}
