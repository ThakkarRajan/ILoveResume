"use client";

import NavbarWrapper from "../components/NavbarWrapper";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <title>Free AI Resume Builder | ATS-Optimized | I Love Resumes</title>
        <meta name="description" content="Free AI resume builder. Upload, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ users." />
        <meta name="keywords" content="resume builder, AI resume, free resume builder, ATS resume, job application, resume optimization, Canada, Toronto" />
        <meta name="author" content="I Love Resumes" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="mask-icon" href="/logo.png" color="#3B82F6" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Free AI Resume Builder | ATS-Optimized | I Love Resumes" />
        <meta property="og:description" content="Free AI resume builder. Upload, match job descriptions, export to Word & PDF. ATS-optimized in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iloveresumes.ca" />
        <meta property="og:image" content="https://iloveresumes.ca/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="I Love Resumes" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Resume Builder | ATS-Optimized | I Love Resumes" />
        <meta name="twitter:description" content="Free AI resume builder. Upload, match job descriptions, export to Word & PDF. ATS-optimized in seconds." />
        <meta name="twitter:image" content="https://iloveresumes.ca/logo.png" />
        <meta name="twitter:creator" content="@iloveresumes" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="application-name" content="I Love Resumes" />
        <meta name="apple-mobile-web-app-title" content="I Love Resumes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://iloveresumes.ca" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "I Love Resumes",
              "url": "https://iloveresumes.ca",
              "description": "Free AI resume builder. ATS-optimized. Export to Word and PDF.",
              "publisher": {
                "@type": "Organization",
                "name": "I Love Resumes",
                "logo": { "@type": "ImageObject", "url": "https://iloveresumes.ca/logo.png" }
              }
            })
          }}
        />
        
        {/* WebApplication Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "I Love Resumes",
              "description": "AI-powered resume builder with job description matching and ATS optimization",
              "url": "https://iloveresumes.ca",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "I Love Resumes",
                "url": "https://iloveresumes.ca"
              },
              "featureList": [
                "AI-powered resume analysis",
                "Job description alignment",
                "Real-time editing",
                "Word & PDF export"
              ],
              "screenshot": "https://iloveresumes.ca/logo.png",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-01-01",
              "dateModified": "2025-03-11"
            })
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "I Love Resumes",
              "url": "https://iloveresumes.ca",
              "logo": "https://iloveresumes.ca/logo.png",
              "description": "AI-powered resume builder helping professionals create standout resumes",
              "addressCountry": "CA",
              "sameAs": [
                "https://github.com/iloveresumes",
                process.env.NEXT_PUBLIC_LINKEDIN_URL,
                process.env.NEXT_PUBLIC_TWITTER_URL || process.env.NEXT_PUBLIC_X_URL,
                process.env.NEXT_PUBLIC_FACEBOOK_URL,
                process.env.NEXT_PUBLIC_INSTAGRAM_URL,
                process.env.NEXT_PUBLIC_YOUTUBE_URL
              ].filter(Boolean),
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://iloveresumes.ca/contact",
                "availableLanguage": "English"
              }
            })
          }}
        />
        
        {/* FAQPage Schema - homepage FAQs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does the AI resume builder work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload your resume in PDF or paste as text. Paste a job description for keyword suggestions. Edit in real time. Export to Word or PDF."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my resume data secure?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We use Google Sign-In. We do not share your data with third parties."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is I Love Resumes free?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Create and optimize resumes for free. Export to Word and PDF at no cost."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does it work for ATS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. We focus on ATS-friendly structure and keyword alignment so your resume gets past automated screening."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Preconnect - accounts.google.com only (Google Sign-In) */}
        <link rel="preconnect" href="https://accounts.google.com" />
        <link rel="dns-prefetch" href="//accounts.google.com" />
        
        {/* Google Analytics - add NEXT_PUBLIC_GA_ID=G-XXXXXXXX to .env.local to enable */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `
              }}
            />
          </>
        )}
      </head>
      <body>
        <NavbarWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
