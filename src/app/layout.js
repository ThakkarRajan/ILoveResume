import { Inter } from "next/font/google";
import Script from "next/script";
import NavbarWrapper from "../components/NavbarWrapper";
import RootSchema from "../components/seo/RootSchema";
import { rootMetadata } from "../config/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata = rootMetadata;

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en-CA" className={inter.className}>
      <body className="min-h-dvh antialiased bg-zinc-50 text-zinc-900">
        <RootSchema />
        <NavbarWrapper />
        <main className="min-h-0">{children}</main>
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
      </body>
    </html>
  );
}
