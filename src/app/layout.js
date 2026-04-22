import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NavbarWrapper from "../components/NavbarWrapper";
import RootSchema from "../components/seo/RootSchema";
import { rootMetadata } from "../config/site";
import "./globals.css";

/** Enables env(safe-area-inset-*) for notched devices; use with .px-page gutters. */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata = rootMetadata;

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en-CA" className={inter.className}>
      <body className="min-h-dvh min-w-0 overflow-x-clip antialiased bg-zinc-50 text-zinc-900">
        <RootSchema />
        <NavbarWrapper />
        <main className="min-h-0 min-w-0">{children}</main>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `}
          </Script>
        ) : null}
        <SpeedInsights />
      </body>
    </html>
  );
}
