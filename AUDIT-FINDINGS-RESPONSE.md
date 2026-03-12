# Audit Findings Response: iloveresumes.ca

**Source:** External SEO audit tool  
**Date:** March 2025

This document maps the audit tool's findings to exact fixes and prioritizes them by impact.

---

## CRITICAL PRIORITIES (Fix Immediately)

### 1. Wrong Canonical Domain
**Finding:** Canonical points to `https://iloveresumes.com`  
**Impact:** Confuses indexing, splits authority  
**Fix:** Change to `https://iloveresumes.ca` in layout.js

### 2. Wrong Sitemap Domain
**Finding:** sitemap.xml references `https://iloveresumes.com/sitemap.xml`  
**Impact:** Crawlers may index wrong domain  
**Fix:** Change robots.txt and sitemap.xml to `https://iloveresumes.ca`

### 3. Title Tag Too Long (72 chars → target 50–60)
**Current:** `I Love Resumes - AI-Powered Resume Builder | Create Professional Resumes` (72)  
**Fix:**
```
Free AI Resume Builder | ATS-Optimized | I Love Resumes
```
(48 chars)

### 4. Meta Description Too Long (215 chars → target 120–160)
**Current:** 215 chars (truncated in SERPs)  
**Fix:**
```
Free AI resume builder. Upload, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ users.
```
(120 chars)

### 5. Zero Internal Links
**Finding:** 0 total links on homepage  
**Impact:** No crawl paths, no authority flow  
**Fix:** Add header with Contact, Features (#features), footer with Contact, Privacy, Terms

### 6. Thin Content (129 words)
**Finding:** Low word count signals thin content  
**Impact:** May hurt rankings for competitive terms  
**Fix:** Add FAQ section (4–6 Q&As), expand feature descriptions, add 1–2 supporting paragraphs

---

## HIGH PRIORITY (This Week)

### 7. Mobile PageSpeed Issues
**Findings:**
- LCP: 5.9s (target <2.5s)
- FCP: 4.5s
- Opportunities: Reduce unused JavaScript (1.07s), avoid multiple redirects (0.63s)

**Fixes:**
- **Unused JS:** Code-split Framer Motion, lazy-load below-the-fold animations. Consider `dynamic import` for motion.
- **Redirects:** Check for redirect chains (e.g. www → non-www, http → https). Ensure single redirect.
- **Preconnect:** Remove unused Google Fonts preconnects (you use Arial).

### 8. Analytics Not Detected
**Fix:** Add Google Analytics 4 (gtag.js) or Google Tag Manager to layout.js  
**Why:** Needed to measure traffic, conversions, and Search Console correlation.

### 9. Weak Backlink Profile
**Finding:** 4 backlinks, 2 referring domains. One link from SideProjectors (good). Others from newlyregddomains.com and 8coint.com (low quality).

**Actions:**
- **Keep:** SideProjectors – legitimate directory
- **Disavow (optional):** newlyregddomains, 8coint – if they look spammy
- **Build:** Product Hunt, BetaList, SaaSHub, career site directories, 1–2 guest posts

---

## MEDIUM PRIORITY (Next 2 Weeks)

### 10. HTTP/2 Not Detected
**Finding:** Using older HTTP protocol  
**Fix:** Vercel supports HTTP/2 by default. Verify in Vercel dashboard. If on another host, enable HTTP/2 in server config.

### 11. Inline Styles
**Finding:** Inline styles detected (likely Framer Motion / Tailwind)  
**Impact:** Minor. Framer Motion and Tailwind often require inline for dynamic styles.  
**Fix:** Low priority. Only refactor if it affects Core Web Vitals. Don't break animations.

### 12. Social Profiles Not Linked
**Finding:** No Facebook, X, Instagram, LinkedIn, YouTube linked  
**Fix:** Add social links to footer or contact page if you have profiles. In schema, add `sameAs` array:
```json
"sameAs": [
  "https://github.com/iloveresumes",
  "https://linkedin.com/company/iloveresumes",
  "https://twitter.com/iloveresumes"
]
```
Only add URLs you actually use.

### 13. Local Business Schema
**Finding:** Not present  
**Note:** Only add if you have a physical location (office, co-working). For pure SaaS, skip. For Toronto/Canada targeting without a location, use `addressCountry: "CA"` in Organization schema instead.

### 14. llms.txt
**Finding:** No llms.txt file  
**What it is:** File for LLM crawlers (e.g. OpenAI, Perplexity) to understand site boundaries  
**Fix:** Create `public/llms.txt`:
```
# I Love Resumes

## Overview
I Love Resumes is a free AI-powered resume builder. Upload your resume, match job descriptions, export to Word and PDF. ATS-optimized.

## Key Pages
- Homepage: https://iloveresumes.ca
- Contact: https://iloveresumes.ca/contact
- Blog: https://iloveresumes.ca/blog

## Contact
https://iloveresumes.ca/contact
```
**Priority:** Low. Helpful for AI search/discovery, not traditional SEO.

---

## LOW PRIORITY (When Resources Allow)

### 15. DMARC Mail Record
**Finding:** No DMARC for email  
**Fix:** Add DMARC DNS record if you send marketing/transactional email from your domain. Reduces spoofing, improves deliverability.  
**Example:** `_dmarc.iloveresumes.ca` TXT `v=DMARC1; p=none; rua=mailto:dmarc@iloveresumes.ca`

### 16. Facebook Pixel
**Fix:** Only if you run or plan Facebook/Instagram ads. Add pixel to layout when needed.

### 17. Hreflang
**Finding:** Not used  
**Fix:** Only needed if you have multiple language versions (e.g. /en, /fr). For English-only, skip.

---

## ALREADY COVERED IN OUR ACTION PLAN

| Audit Finding | Status in Our Plan |
|---------------|-------------------|
| Domain mismatch | In SEO-ACTION-PLAN.md – P1 |
| OG image relative | In plan – P2 |
| Auth-walled pages | In plan – P3 |
| robots.txt | In plan – P4 |
| sitemap | In plan – P5 |
| Unused preconnects | In plan – P6 |
| No internal links | In plan – P7 |
| Meta length | In plan – P8 |
| Thin content | In plan – add FAQ, expand copy |
| Backlink strategy | In plan – Section 1.7 |
| Page strategy | In plan – Section 3 |
| Schema | In plan – Section 5 |

---

## EXACT IMPLEMENTATION FIXES

### Layout.js – Meta Updates

```jsx
{/* REPLACE in layout.js */}
<title>Free AI Resume Builder | ATS-Optimized | I Love Resumes</title>
<meta name="description" content="Free AI resume builder. Upload, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ users." />

<meta property="og:url" content="https://iloveresumes.ca" />
<meta property="og:image" content="https://iloveresumes.ca/logo.png" />

<link rel="canonical" href="https://iloveresumes.ca" />
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /result
Disallow: /word-download
Disallow: /myprofile
Disallow: /admin/
Disallow: /api/

Sitemap: https://iloveresumes.ca/sitemap.xml
```

### sitemap.xml (after making contact public)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://iloveresumes.ca/</loc>
    <lastmod>2025-03-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iloveresumes.ca/contact</loc>
    <lastmod>2025-03-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Schema – Fix All URLs

Global replace in layout.js:
- `iloveresumes.com` → `iloveresumes.ca`
- `screenshot: "/logo.png"` → `screenshot: "https://iloveresumes.ca/logo.png"`
- `dateModified: "2024-01-01"` → `dateModified: "2025-03-11"`

### Content Additions (Homepage)

Add below features, before footer:

```jsx
{/* FAQ Section - adds ~150 words */}
<section id="faq" className="mt-16 max-w-2xl mx-auto px-4">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
  <div className="space-y-4 text-left">
    <div>
      <h3 className="font-semibold text-gray-900">Is I Love Resumes free?</h3>
      <p className="text-gray-600 text-sm">Yes. Create and optimize resumes for free. Export to Word and PDF at no cost.</p>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">How does the AI work?</h3>
      <p className="text-gray-600 text-sm">Upload your resume and paste a job description. Our AI suggests improvements and keywords to match the job.</p>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">Does it work for ATS?</h3>
      <p className="text-gray-600 text-sm">Yes. We focus on ATS-friendly structure and keyword alignment.</p>
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">What formats can I export?</h3>
      <p className="text-gray-600 text-sm">Word (.docx) and PDF—standard formats for job applications.</p>
    </div>
  </div>
</section>
```

### Analytics (GA4)

Add to layout.js `<head>`:
```jsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <>
    <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `
    }} />
  </>
)}
```
Add `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to .env.local.

---

## CHECKLIST: Audit Tool Response

- [ ] Fix canonical to iloveresumes.ca
- [ ] Fix sitemap URL in robots.txt to iloveresumes.ca
- [ ] Fix all URLs in sitemap.xml to iloveresumes.ca
- [ ] Shorten title to 48–55 chars
- [ ] Shorten meta description to 120–155 chars
- [ ] Fix OG image to absolute URL
- [ ] Fix all schema URLs to iloveresumes.ca
- [ ] Add internal links (header + footer)
- [ ] Add FAQ section to homepage (~150 words)
- [ ] Make /contact public
- [ ] Add noindex to auth-walled pages
- [ ] Remove unused font preconnects
- [ ] Add Google Analytics (if desired)
- [ ] Investigate mobile LCP (lazy-load Framer Motion)
- [ ] Add llms.txt (optional)
- [ ] Add social sameAs to schema (if profiles exist)
- [ ] Consider disavowing spam backlinks in GSC

---

*This response aligns the external audit with our existing SEO-ACTION-PLAN.md. Execute the Critical and High Priority items first.*
