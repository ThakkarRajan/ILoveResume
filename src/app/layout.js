"use client";

import NavbarWrapper from "../components/NavbarWrapper";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Basic Meta Tags */}
        <title>I Love Resumes - AI-Powered Resume Builder | Create Professional Resumes</title>
        <meta name="description" content="Transform your resume with AI-powered insights. Get personalized suggestions, optimize structure, and align keywords with job descriptions. Create professional resumes in seconds with our intelligent resume builder." />
        <meta name="keywords" content="resume builder, AI resume, job application, resume optimization, career tools, professional resume, CV builder, job search, career development, resume writing" />
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
        <meta property="og:title" content="I Love Resumes - AI-Powered Resume Builder" />
        <meta property="og:description" content="Transform your resume with AI-powered insights. Get personalized suggestions, optimize structure, and align keywords with job descriptions—all in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iloveresumes.com" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="I Love Resumes" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="I Love Resumes - AI-Powered Resume Builder" />
        <meta name="twitter:description" content="Transform your resume with AI-powered insights. Get personalized suggestions, optimize structure, and align keywords with job descriptions—all in seconds." />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:creator" content="@iloveresumes" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="application-name" content="I Love Resumes" />
        <meta name="apple-mobile-web-app-title" content="I Love Resumes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://iloveresumes.com" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "I Love Resumes",
              "description": "AI-powered resume builder that helps create professional resumes with intelligent suggestions and optimization",
              "url": "https://iloveresumes.com",
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
                "url": "https://iloveresumes.com"
              },
              "featureList": [
                "AI-powered resume analysis",
                "Job description alignment",
                "Real-time editing",
                "Multiple export formats",
                "Professional templates"
              ],
              "screenshot": "/logo.png",
              "softwareVersion": "1.0.0",
              "datePublished": "2024-01-01",
              "dateModified": "2024-01-01"
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
              "url": "https://iloveresumes.com",
              "logo": "https://iloveresumes.com/logo.png",
              "description": "AI-powered resume builder helping professionals create standout resumes",
              "sameAs": [
                "https://github.com/iloveresumes"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://iloveresumes.com/contact"
              }
            })
          }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://accounts.google.com" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//accounts.google.com" />
      </head>
      <body>
          <NavbarWrapper />
          <main>{children}</main>
      </body>
    </html>
  );
}
