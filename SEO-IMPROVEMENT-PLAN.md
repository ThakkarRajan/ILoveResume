# SEO Improvement Plan: iloveresumes.ca

**Audit Date:** March 11, 2025  
**Site:** https://iloveresumes.ca  
**Prepared for:** I Love Resumes - AI-Powered Resume Builder

---

# 1. Technical SEO Audit

## 1.1 Indexing and Crawlability

### Critical: Domain Canonical Mismatch

**Problem:** Your live site is `iloveresumes.ca` but every SEO asset points to `iloveresumes.com`:
- layout.js canonical: `iloveresumes.com`
- layout.js og:url: `iloveresumes.com`
- layout.js schema: `iloveresumes.com`
- robots.txt Sitemap: `iloveresumes.com/sitemap.xml`
- sitemap.xml: all URLs use `iloveresumes.com`

**Why it hurts:** Google receives conflicting signals. When someone shares your site, social crawlers resolve `iloveresumes.ca` but OG/canonical say the "real" URL is .com. Link equity splits, indexation becomes confused, and you may rank the wrong domain or neither.

**Fix:** Global find/replace `iloveresumes.com` → `iloveresumes.ca`. Add `NEXT_PUBLIC_SITE_URL=https://iloveresumes.ca` to `.env.local` and use it everywhere.

---

### Critical: Auth-Walled Pages in Sitemap

**Problem:** `/contact`, `/dashboard`, `/result`, `/word-download` are in the sitemap but require login. Crawlers hit them and get:
- Redirect to `/` (for dashboard, result, word-download, myprofile)
- Brief "Loading..." then redirect (contact)

Google cannot index their content. You are telling Google to crawl pages that return no indexable content → wasted crawl budget and potential soft-404 flags.

**Fix:**
1. **Make `/contact` public** – Remove auth gate. Contact pages should be indexable for trust and local SEO.
2. **Add `noindex, nofollow`** to dashboard, result, word-download, myprofile layouts.
3. **Update sitemap** – Keep only `/` and `/contact` (after contact is public). Remove auth-walled URLs.

---

### Crawl Depth and Internal Links

**Problem:** Homepage has no navbar when `pathname === "/"`. There are zero internal links from the homepage to any other page. Crawlers cannot discover `/contact` from the homepage.

**Fix:** Add a minimal header on the homepage with links to: Home, Features (#features), Contact (once public), and the CTA button.

---

## 1.2 robots.txt

**Current:**
```
Sitemap: https://iloveresumes.com/sitemap.xml
```

**Problems:**
- Wrong domain
- No disallow for auth-walled app pages (crawlers waste budget)
- Duplicate Allow rules

**Exact Fix:**

```txt
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

---

## 1.3 sitemap.xml

**Problems:**
- Wrong domain (iloveresumes.com)
- Auth-walled pages included
- Static lastmod (2024-01-01) – never updated
- `/myprofile` missing (but auth-walled anyway – don't add)

**Exact Fix:** Replace `public/sitemap.xml` with:

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

**Better:** Use dynamic sitemap. Create `src/app/sitemap.js`:

```javascript
export default function sitemap() {
  const base = 'https://iloveresumes.ca';
  return [
    { url: base + '/', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: base + '/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // Add blog URLs when you have them: base + '/blog/[slug]'
  ];
}
```

Then delete `public/sitemap.xml` so Next.js serves the dynamic one.

---

## 1.4 Canonical Tags

**Problem:** Root layout has one canonical for the entire site: `https://iloveresumes.com`. Nested routes (contact, etc.) don't get page-specific canonicals. Also wrong domain.

**Fix:** 
1. Change root canonical to `https://iloveresumes.ca`
2. For pages with their own layouts (contact, dashboard), ensure they set `canonical` in metadata. Contact layout uses `metadata` export – add:

```javascript
export const metadata = {
  alternates: { canonical: 'https://iloveresumes.ca/contact' },
  // ... rest
};
```

---

## 1.5 Meta Robots

**Problem:** Root layout has `meta name="robots" content="index, follow"`. Auth-walled pages (dashboard, result, word-download, myprofile) should have `noindex, nofollow` but don't.

**Fix:** In each auth-walled layout (dashboard, and create layouts for result, word-download, myprofile if missing):

```javascript
export const metadata = {
  robots: { index: false, follow: false },
  // ... rest
};
```

---

## 1.6 Page Speed and Core Web Vitals

**Current:**
- Next.js 16 with `compress: true` ✓
- `next/image` used ✓
- Preconnect to fonts.googleapis.com and fonts.gstatic.com – but you use `Arial, Helvetica` in globals.css. No Google Fonts are loaded. Wasted DNS/preconnect.

**Fixes:**
1. **Remove unused preconnects** in layout.js:
   - Remove `<link rel="preconnect" href="https://fonts.googleapis.com" />`
   - Remove `<link rel="preconnect" href="https://fonts.gstatic.com" ... />`
   - Remove `dns-prefetch` for fonts
2. **Keep** preconnect to accounts.google.com (used for Google sign-in)
3. **Lazy-load** Framer Motion for below-the-fold; avoid heavy animations on LCP elements
4. **Monitor** – Run PageSpeed Insights (Desktop + Mobile) and track LCP, INP, CLS in Search Console

---

## 1.7 Mobile Responsiveness

**Status:** Site uses Tailwind responsive classes (`sm:`, `md:`, `lg:`). Layout appears mobile-friendly. No obvious issues. Verify with Google Mobile-Friendly Test.

---

## 1.8 Broken Links

**Status:** No obvious broken internal links found. External links (GitHub, contact methods) should be verified manually.

---

## 1.9 Redirect Issues

**Status:** next.config correctly redirects www.iloveresumes.ca → iloveresumes.ca (301). Good.

**Issue:** If iloveresumes.com was ever used or has backlinks, set up a 301 from .com to .ca in your hosting/DNS to consolidate equity.

---

## 1.10 Duplicate Pages / Duplicate Metadata

**Issue:** `/result` and `/word-download` may be accessible with query params (e.g. `?id=xyz`). If so, you could get duplicate content. Add canonical to the base URL and disallow param variations in robots if needed.

**Metadata:** Root layout and contact layout both output metadata. With "use client" on root, child metadata may not fully override. Consider converting root layout to a Server Component and using the Metadata API, or ensure child layouts explicitly set all needed tags.

---

## 1.11 Structured Data / Schema Markup

**Current:** WebApplication + Organization schema in layout.js. Good start.

**Problems:**
- All URLs use iloveresumes.com
- `screenshot` is relative `/logo.png` – should be absolute
- `dateModified` is stale (2024-01-01)
- Missing: WebSite (with SearchAction), FAQPage, BreadcrumbList for multi-page flows

**See Section 7 for full schema strategy.**

---

## 1.12 Internal Linking

**Gaps:**
- Homepage: no links to Contact, Features anchor, or any other page
- Footer: no links (only copyright)
- Navbar: when on dashboard/etc, logo links to /dashboard, not /
- No contextual links in body copy

---

## 1.13 Image Optimization

**Current:** Using `next/image` for logo, text logo, Google logo. Good.

**Issues:**
- Logo `alt="I Love Resumes Logo"` and text logo `alt="I Love Resumes Logo"` – consider differentiating: "I Love Resumes logo" vs "I Love Resumes wordmark"
- Ensure logo.png is appropriately sized (e.g. 1200x630 for OG); if it's a square, create a dedicated 1200x630 OG image for social sharing

---

## 1.14 Heading Hierarchy

**Homepage:**
- H1: "Build Smarter Resumes with AI" ✓ (single H1)
- H2: "Everything You Need to Succeed" ✓
- H3: Smart Upload, Job Alignment, Live Editing, Multiple Formats ✓

Structure is valid. No H4–H6 on homepage – fine for current length.

---

## 1.15 JavaScript Rendering

**Status:** Next.js App Router server-renders by default. Root layout is "use client" but the initial HTML includes the head content. Crawlers should see content. Verify with "View Page Source" and Google Search Console URL Inspection.

---

---

# 2. Homepage SEO Review

## 2.1 Primary Keyword Targeting

**Current focus:** "resume builder", "AI", "professional resumes" – decent. Missing: "free", "ATS", "job description".

**Primary keyword to target:** `free AI resume builder` or `AI resume builder` (both high intent, commercial).

---

## 2.2 Better SEO Title

**Current:** `I Love Resumes - AI-Powered Resume Builder | Create Professional Resumes` (59 chars)

**Suggested (choose one):**
- `Free AI Resume Builder | ATS-Optimized in Seconds | I Love Resumes` (55 chars)
- `AI Resume Builder – Free, ATS-Optimized | I Love Resumes` (52 chars)

"Free" captures high-intent searches. "ATS" resonates with job seekers who know the term.

---

## 2.3 Better Meta Description

**Current:** `Transform your resume with AI-powered insights. Get personalized suggestions, optimize structure, and align keywords with job descriptions. Create professional resumes in seconds with our intelligent resume builder.` (179 chars – over 160)

**Suggested:**
`Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers.` (138 chars)

---

## 2.4 Better H1

**Current:** `Build Smarter Resumes with AI`

**Suggested options:**
- `Free AI Resume Builder – ATS-Optimized in Seconds` (strongest keyword match)
- `Build ATS-Ready Resumes with AI – Free in Seconds` (alternative)

Keep the gradient styling on "with AI" or "Free" if you prefer the current design.

---

## 2.5 Better H2 Structure

**Current:** "Everything You Need to Succeed" – vague, low keyword value.

**Suggested:**
- `How Our Free AI Resume Builder Works`
- `4 Ways to Create an ATS-Optimized Resume`
- `Why Job Seekers Choose Our AI Resume Tool`

Add an H2 above the features: `Tools for Landing More Job Interviews` or `Create Resumes That Pass ATS Systems`.

---

## 2.6 Stronger Keyword Placement

**Add these naturally:**
- "ATS" or "ATS-optimized" – in hero subtitle, feature titles, or a new line
- "free" – near the CTA or in the first paragraph
- "job description" – you have it; good
- "Word" and "PDF" – in the Multiple Formats copy
- "Canada" or "Canadian" – if targeting local (see Section 11)

**Example hero subtitle rewrite:**
`Create ATS-optimized resumes in seconds. Our free AI analyzes your resume, matches job descriptions, and exports to Word & PDF—no credit card required.`

---

## 2.7 Better Internal Links from Homepage

**Add:**
- Header: Home | Features | Contact | [CTA]
- Features section: link "Contact us" or "Get started" to /contact and / (or dashboard)
- Footer: Contact | Privacy (if exists) | Terms (if exists)
- Anchor link: `#features` for "Features" in the nav

---

## 2.8 Conversion-Friendly Content (Without Hurting SEO)

- Add a short "No signup required to try" or "Free – no credit card" near CTA
- Add 1–2 one-line testimonials or a "As seen in" / "Used by X companies" if you have proof
- Stats ("8490+", "98%") – ensure they're defensible; if not, tone down or remove
- Add a simple FAQ (2–3 questions) below features – good for SEO and trust

---

---

# 3. Keyword Strategy

## 3.1 Primary Commercial Keywords

| Keyword | Intent | Competition | Page Type |
|---------|--------|-------------|-----------|
| resume builder | Transactional | High | Homepage |
| AI resume builder | Transactional | Medium-High | Homepage |
| free resume builder | Transactional | High | Homepage |
| ATS resume checker | Transactional | Medium | Tool page |
| resume optimizer | Transactional | Medium | Service/tool page |

---

## 3.2 Secondary Keywords

| Keyword | Intent | Competition | Page Type |
|---------|--------|-------------|-----------|
| resume to word converter | Transactional | Low-Medium | Tool page |
| resume keyword scanner | Informational/Transactional | Low | Tool page, blog |
| job description keyword extractor | Informational | Low | Tool page, blog |
| professional resume writing | Transactional | High | Service page |
| resume format 2025 | Informational | Medium | Blog |

---

## 3.3 Long-Tail Keywords

| Keyword | Intent | Competition | Page Type |
|---------|--------|-------------|-----------|
| free AI resume builder no signup | Transactional | Low | Homepage, blog |
| resume builder that matches job description | Transactional | Low | Homepage, feature page |
| ATS resume checker free | Transactional | Low | Tool page |
| resume keyword optimizer free | Transactional | Low | Tool page |
| best resume format for software engineer | Informational | Low | Blog |
| how to optimize resume for ATS 2025 | Informational | Medium | Blog |
| resume keywords for [industry] | Informational | Low | Blog |

---

## 3.4 Local SEO Keywords

| Keyword | Intent | Competition | Page Type |
|---------|--------|-------------|-----------|
| resume builder Canada | Transactional | Medium | Homepage, /ca |
| resume writer Toronto | Transactional | Medium | City page |
| AI resume builder Toronto | Transactional | Low | City page |
| resume services Canada | Transactional | Medium | Country page |
| job search help Toronto | Informational | Medium | Blog, city page |

---

## 3.5 Informational Blog Keywords

| Keyword | Intent | Competition | Page Type |
|---------|--------|-------------|-----------|
| how does ATS work | Informational | Medium | Blog |
| what are resume keywords | Informational | Low | Blog |
| best resume format 2025 | Informational | Medium | Blog |
| how to tailor resume to job | Informational | Medium | Blog |
| resume vs CV Canada | Informational | Low | Blog |
| technical resume format | Informational | Low | Blog |

---

## 3.6 Keyword Clusters Summary

**Cluster 1: AI Resume Builder**
- Primary: AI resume builder, free AI resume builder
- Secondary: AI resume writer, AI resume optimizer
- Intent: Strong commercial. User wants to create/improve resume with AI.
- Target: Homepage, /ai-resume-builder

**Cluster 2: ATS**
- Primary: ATS resume, ATS resume checker, ATS optimization
- Secondary: how to pass ATS, ATS keywords
- Intent: Mix of informational and transactional.
- Target: /ats-resume-checker (tool), /blog/how-ats-works, /blog/ats-keywords

**Cluster 3: Resume Formats & Export**
- Primary: resume to word, resume format, PDF resume
- Secondary: best resume format 2025
- Intent: Transactional and informational.
- Target: Tool page, blog

**Cluster 4: Canada / Toronto**
- Primary: resume builder Canada, resume writer Toronto
- Secondary: job search Canada, Canadian resume format
- Intent: Local commercial.
- Target: /resume-builder-canada, /resume-builder-toronto

---

---

# 4. Page Strategy

## Recommended Site Structure

```
/
├── / (homepage)
├── /contact
├── /ai-resume-builder (service page – optional, or merge with homepage)
├── /ats-resume-checker (tool – free keyword scanner)
├── /resume-to-word (tool – converter landing)
├── /resume-builder-canada (location)
├── /resume-builder-toronto (location)
├── /blog
│   ├── /blog/how-ats-works
│   ├── /blog/best-resume-format-2025
│   └── ...
├── /faq
├── /compare (e.g. /ai-resume-builders-compared)
└── /privacy, /terms (legal)
```

---

## Page Specs

### Homepage (/)
- **Target keyword:** free AI resume builder, AI resume builder
- **URL:** /
- **Title:** Free AI Resume Builder | ATS-Optimized in Seconds | I Love Resumes
- **Meta:** Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers.
- **H1:** Free AI Resume Builder – ATS-Optimized in Seconds
- **Sections:** Hero, How It Works (3–4 steps), Features (current + ATS focus), Stats, FAQ (2–4), CTA, Footer with links

---

### Contact (/contact)
- **Target:** contact, support, help
- **URL:** /contact
- **Title:** Contact Us | AI Resume Builder Support | I Love Resumes
- **Meta:** Get help with our AI resume builder. Support, feedback, and tips. We respond within 24 hours.
- **H1:** Get in Touch
- **Sections:** Contact form, contact methods, CTA to dashboard
- **Note:** Make public (remove auth gate)

---

### ATS Resume Checker Tool (/ats-resume-checker)
- **Target:** ATS resume checker, ATS resume checker free
- **URL:** /ats-resume-checker
- **Title:** Free ATS Resume Checker | Test Your Resume | I Love Resumes
- **Meta:** Free ATS resume checker. See how your resume scores against ATS systems. Get keyword suggestions. No signup required.
- **H1:** Free ATS Resume Checker
- **Sections:** Tool (paste job description + resume text), How ATS works (short), CTA to full builder

---

### Resume to Word (/resume-to-word)
- **Target:** resume to word, resume to word converter
- **URL:** /resume-to-word
- **Title:** Resume to Word Converter | Free Export | I Love Resumes
- **Meta:** Convert your resume to Word format. Free AI-optimized resume export. Download .docx in seconds.
- **H1:** Export Your Resume to Word
- **Sections:** Benefits, how to use, CTA to dashboard

---

### Resume Builder Canada (/resume-builder-canada)
- **Target:** resume builder Canada, AI resume builder Canada
- **URL:** /resume-builder-canada
- **Title:** AI Resume Builder for Canada | Free ATS-Optimized Resumes
- **Meta:** Free AI resume builder for Canadian job seekers. ATS-optimized. Works with Canadian resume formats. Toronto, Vancouver, Montreal.
- **H1:** AI Resume Builder Built for Canadian Job Seekers
- **Sections:** Canada benefits, Canadian format tips, CTA, link to Toronto page

---

### Resume Builder Toronto (/resume-builder-toronto)
- **Target:** resume builder Toronto, resume writer Toronto
- **URL:** /resume-builder-toronto
- **Title:** Resume Builder Toronto | AI-Powered | Free | I Love Resumes
- **Meta:** Free AI resume builder for Toronto job seekers. ATS-optimized for Toronto and GTA jobs. Export to Word and PDF.
- **H1:** Toronto's Free AI Resume Builder
- **Sections:** Toronto job market, local tips, CTA, link to Canada page

---

### FAQ (/faq)
- **Target:** I Love Resumes FAQ, AI resume builder FAQ
- **URL:** /faq
- **Title:** FAQ | AI Resume Builder | I Love Resumes
- **Meta:** Answers about our AI resume builder. Privacy, ATS, exports, and more.
- **H1:** Frequently Asked Questions
- **Sections:** 8–12 Q&As with schema

---

### Blog Hub (/blog)
- **Target:** resume tips, career advice, ATS
- **URL:** /blog
- **Title:** Resume & Career Tips | I Love Resumes Blog
- **Meta:** Expert tips on resumes, ATS, job descriptions, and career growth. From the team behind I Love Resumes.
- **H1:** Resume & Career Blog

---

### Comparison Page (/ai-resume-builders-compared)
- **Target:** best AI resume builder, AI resume builder comparison
- **URL:** /ai-resume-builders-compared
- **Title:** Best AI Resume Builders 2025 Compared | I Love Resumes
- **Meta:** Compare the top AI resume builders. Features, pricing, ATS support. See how I Love Resumes stands out.
- **H1:** AI Resume Builders Compared (2025)
- **Sections:** Comparison table (be honest), your differentiators, CTA

---

---

# 5. Content Strategy

## 5.1 Current State: Too Much Landing Page, Too Little Authority

You have one landing page and app flows. No blog, no FAQ, no pillar content. You look like a single-product SaaS, not a resource. Google favors topical authority and depth. One thin homepage cannot compete with sites that have 50+ pages.

---

## 5.2 Pillar Pages

1. **The Complete Guide to AI Resume Builders** – Target: "AI resume builder", "best AI resume builder"
2. **The ATS Resume Guide: How to Pass Applicant Tracking Systems** – Target: "ATS resume", "how ATS works"
3. **Resume Formats 2025: The Ultimate Guide** – Target: "resume format 2025", "best resume format"

---

## 5.3 Cluster Content (Around Pillars)

**Around AI Resume Builder:**
- How AI Resume Builders Work
- Free vs Paid AI Resume Tools
- AI Resume Builder vs Resume Writer
- Best AI Resume Builders for [Industry]

**Around ATS:**
- How ATS Systems Work (And How to Beat Them)
- ATS Resume Keywords: What Recruiters Look For
- ATS Resume Format: Fonts, Sections, Spacing
- Workday ATS: How to Optimize Your Resume
- Greenhouse ATS Resume Tips

**Around Resume Writing:**
- How to Tailor Your Resume to a Job Description
- Resume Keywords by Industry
- Technical Resume Guide: Software Engineers
- Entry-Level Resume Guide
- Career Change Resume Guide

**Around Canada:**
- Canadian Resume Format Guide
- Resume vs CV in Canada
- Canadian Resume Keywords
- Toronto Job Market Resume Tips
- Vancouver Resume Guide

---

## 5.4 FAQ Content

Add an FAQ section on homepage + dedicated /faq page. Example questions:
- How does the AI resume builder work?
- Is my data secure?
- What formats can I export to?
- Does it work for ATS?
- Is it free?
- Do you support Canadian resume formats?

---

## 5.5 Content Gaps

- No blog
- No pillar content
- No comparison content
- No location pages
- No tool landing pages (ATS checker, Word export)
- No industry-specific content
- No FAQ page

---

## 5.6 30+ SEO Content Ideas (Search Intent)

| # | Title | Target Keyword | Intent | Competition |
|---|-------|----------------|--------|-------------|
| 1 | How to Optimize Your Resume for ATS in 2025 | ATS resume optimization | Informational | Medium |
| 2 | Best Resume Format for 2025 | resume format 2025 | Informational | Medium |
| 3 | How AI Resume Builders Work | AI resume builder | Informational | Low |
| 4 | Resume Keywords: What Recruiters Actually Search For | resume keywords | Informational | Medium |
| 5 | How to Match Your Resume to a Job Description | tailor resume job description | Informational | Medium |
| 6 | Canadian Resume Format: Complete Guide | Canadian resume format | Informational | Low |
| 7 | Resume vs CV: What's the Difference in Canada? | resume vs CV Canada | Informational | Low |
| 8 | Technical Resume Guide for Software Engineers | technical resume | Informational | Medium |
| 9 | Best Free AI Resume Builders Compared | free AI resume builder | Transactional | High |
| 10 | How to Pass Workday ATS | Workday ATS resume | Informational | Low |
| 11 | How to Pass Greenhouse ATS | Greenhouse ATS resume | Informational | Low |
| 12 | Entry-Level Resume Examples and Tips | entry level resume | Informational | Medium |
| 13 | Career Change Resume: How to Pivot | career change resume | Informational | Medium |
| 14 | Resume Length: One Page or Two? | resume length | Informational | Low |
| 15 | Resume Fonts That Pass ATS | ATS resume font | Informational | Low |
| 16 | Toronto Job Market: Resume Tips for 2025 | resume Toronto | Informational | Low |
| 17 | Vancouver Resume Guide | Vancouver resume | Informational | Low |
| 18 | Montreal Resume Format Guide | Montreal resume | Informational | Low |
| 19 | How to Extract Keywords from Job Descriptions | job description keywords | Informational | Low |
| 20 | Resume Summary vs Objective: Which to Use? | resume summary vs objective | Informational | Low |
| 21 | Resume Bullet Points: How to Write Impact | resume bullet points | Informational | Low |
| 22 | PDF vs Word Resume: Which Do Employers Prefer? | PDF vs Word resume | Informational | Low |
| 23 | I Love Resumes vs [Competitor]: Honest Comparison | I Love Resumes comparison | Transactional | Low |
| 24 | Resume Writing Services vs AI: When to Use Each | resume writing vs AI | Informational | Low |
| 25 | How to Add LinkedIn to Resume | LinkedIn resume | Informational | Low |
| 26 | Resume for Internship: Complete Guide | internship resume | Informational | Low |
| 27 | Healthcare Resume Guide | healthcare resume | Informational | Low |
| 28 | Teacher Resume Guide | teacher resume | Informational | Low |
| 29 | Sales Resume Examples and Tips | sales resume | Informational | Medium |
| 30 | Resume Mistakes That Get You Rejected | resume mistakes | Informational | Medium |
| 31 | How to Convert Resume to Word (Free) | resume to word | Transactional | Low |
| 32 | ATS Resume Checker: What to Look For | ATS resume checker | Transactional | Low |

---

---

# 6. Internal Linking Strategy

## 6.1 Link Map

**Homepage** should link to:
- /contact
- /faq
- /blog
- /ats-resume-checker
- /resume-builder-canada
- /ai-resume-builders-compared (when created)
- #features (anchor)

**Contact** should link to:
- /
- /faq
- /dashboard (for logged-in users)

**Blog posts** should link to:
- Homepage (1–2 contextual links)
- /ats-resume-checker (when mentioning ATS)
- /resume-to-word (when mentioning Word export)
- /resume-builder-canada (when mentioning Canada)
- Other relevant blog posts (2–3 per article)
- /faq

**Tool pages** (ATS checker, resume-to-word) should link to:
- Homepage
- /blog (relevant articles)
- /faq

**Location pages** (Canada, Toronto) should link to:
- Homepage
- Each other (Canada ↔ Toronto)
- /blog (Canada-related posts)

---

## 6.2 Anchor Text Examples

| From | To | Anchor Text |
|------|-----|-------------|
| Homepage | /contact | "contact us", "get in touch", "support" |
| Homepage | /faq | "FAQ", "frequently asked questions" |
| Homepage | /ats-resume-checker | "free ATS checker", "check your resume for ATS" |
| Homepage | /resume-builder-canada | "resume builder for Canada", "Canadian job seekers" |
| Blog (ATS post) | /ats-resume-checker | "try our free ATS checker", "test your resume" |
| Blog (format post) | /resume-to-word | "export to Word", "download as .docx" |
| Blog (Canada post) | /resume-builder-canada | "our Canada resume builder", "built for Canadian job seekers" |
| Footer (all pages) | /contact | "Contact" |
| Footer | /privacy | "Privacy Policy" |
| Footer | /terms | "Terms" |

---

## 6.3 Authority Flow: Blog → Money Pages

- Every blog post: 1–2 links to homepage or tool/service pages
- Use descriptive anchors (e.g. "free AI resume builder" → homepage)
- Pillar pages: link to 3–5 cluster posts; cluster posts link back to pillar
- Tool pages: linked from relevant blog posts; tool pages link to homepage and blog

---

## 6.4 Orphan Pages

**Risk:** New blog posts and location pages with no inbound links.

**Fix:**
- Add new posts to /blog index
- Link new posts from related posts
- Add new pages to homepage "Resources" or "Tools" section
- Add to sitemap

---

## 6.5 Topical Relevance

- Group content by theme (ATS, formats, Canada, etc.)
- Interlink within clusters
- Use consistent terminology (e.g. "ATS" not "applicant tracking system" everywhere – but vary for long-tail)

---

---

# 7. Schema Markup Strategy

## 7.1 Organization (Already Present – Fix URLs)

**Where:** layout.js  
**Why:** Identifies your brand. Used for Knowledge Panel, rich results.

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "I Love Resumes",
  "url": "https://iloveresumes.ca",
  "logo": "https://iloveresumes.ca/logo.png",
  "description": "AI-powered resume builder helping professionals create standout resumes",
  "sameAs": ["https://github.com/iloveresumes"],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://iloveresumes.ca/contact",
    "availableLanguage": "English"
  }
}
```

---

## 7.2 WebSite (Add This)

**Where:** layout.js  
**Why:** Enables Sitelinks Search Box, and tells Google about your site structure.

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "I Love Resumes",
  "url": "https://iloveresumes.ca",
  "description": "Free AI resume builder. ATS-optimized. Export to Word and PDF.",
  "publisher": {
    "@type": "Organization",
    "name": "I Love Resumes",
    "logo": {
      "@type": "ImageObject",
      "url": "https://iloveresumes.ca/logo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://iloveresumes.ca/dashboard?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

(Remove or adjust SearchAction if you don't have search.)

---

## 7.3 WebApplication (Fix Existing)

**Where:** layout.js  
**Why:** For software/product. Can surface in app-related searches.

**Fixes:** Change all URLs to iloveresumes.ca; `screenshot` to absolute URL; update `dateModified`.

---

## 7.4 FAQPage (Add)

**Where:** /faq page, or homepage FAQ section  
**Why:** Enables FAQ rich results in SERPs.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does the AI resume builder work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Upload your resume in PDF or paste as text. Our AI analyzes it, suggests improvements, and lets you paste a job description to align keywords. You can edit in real time and export to Word or PDF."
      }
    },
    {
      "@type": "Question",
      "name": "Is my resume data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We use Google Sign-In for authentication and do not share your data with third parties. Your resume is processed securely."
      }
    },
    {
      "@type": "Question",
      "name": "Is I Love Resumes free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. You can create and optimize resumes for free. Export to Word and PDF at no cost."
      }
    }
  ]
}
```

---

## 7.5 SoftwareApplication (Alternative to WebApplication)

Use either WebApplication or SoftwareApplication, not both for the same product. Current WebApplication is fine; just fix URLs.

---

## 7.6 BreadcrumbList (For Blog and Multi-Level Pages)

**Where:** Blog post layout, tool pages, location pages  
**Why:** Breadcrumbs in SERPs improve CTR.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://iloveresumes.ca" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://iloveresumes.ca/blog" },
    { "@type": "ListItem", "position": 3, "name": "How ATS Works", "item": "https://iloveresumes.ca/blog/how-ats-works" }
  ]
}
```

---

## 7.7 Article (For Blog Posts)

**Where:** Each blog post  
**Why:** Article schema can enable rich results for articles.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How ATS Systems Work (And How to Beat Them)",
  "description": "Learn how applicant tracking systems screen resumes and how to optimize yours.",
  "author": { "@type": "Organization", "name": "I Love Resumes" },
  "publisher": { "@type": "Organization", "name": "I Love Resumes", "logo": { "@type": "ImageObject", "url": "https://iloveresumes.ca/logo.png" } },
  "datePublished": "2025-03-11",
  "dateModified": "2025-03-11"
}
```

---

## 7.8 Service (For Service Pages)

**Where:** /ai-resume-builder, /ats-resume-checker (if you add these as service/tool pages)  
**Why:** For local or service-oriented queries.

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "ATS Resume Checker",
  "description": "Free tool to check how your resume scores against ATS systems.",
  "provider": { "@type": "Organization", "name": "I Love Resumes" },
  "url": "https://iloveresumes.ca/ats-resume-checker"
}
```

---

## 7.9 LocalBusiness / Place (If Local SEO)

**Where:** Only if you have a physical location or serve a specific area.  
**Use:** If you add Toronto/Canada pages and want local pack visibility. For a pure SaaS with .ca domain, this may not apply unless you have a real office.

---

## 7.10 Review (Avoid for Now)

**Why:** Review schema requires real user reviews. Don't add fake reviews.

---

---

# 8. Content Rewrite Recommendations

## 8.1 Hero Section

**Current:**
- H1: Build Smarter Resumes with AI
- Subtitle: Transform your resume with AI-powered insights. Get personalized suggestions, optimize structure, and align keywords with job descriptions—all in seconds.

**Rewrite:**

```
H1: Free AI Resume Builder – ATS-Optimized in Seconds

Subtitle: Upload your resume, paste a job description, and get tailored keyword suggestions. Export to Word or PDF. Free. No credit card required.
```

---

## 8.2 Homepage Intro (First Paragraph)

**Current:** (Subtitle only)

**Add after CTA:**
`Our AI analyzes your resume against job descriptions so you can create resumes that pass ATS systems and get noticed by recruiters.`

---

## 8.3 Feature Section

**Current H2:** Everything You Need to Succeed  
**Rewrite:** How Our Free AI Resume Builder Works

**Current feature titles/descriptions – suggested rewrites:**

| Current | Rewrite |
|---------|---------|
| Smart Upload | **PDF Resume Upload** – Upload your resume in PDF or paste as text. Our AI extracts and analyzes it in seconds. |
| Job Alignment | **Job Description Matching** – Paste any job description. Get keyword suggestions to align your resume with what recruiters and ATS look for. |
| Live Editing | **Real-Time Editing** – Edit AI suggestions on the spot. No back-and-forth. |
| Multiple Formats | **Export to Word & PDF** – Download your resume as .docx or PDF. ATS-friendly formats. |

---

## 8.4 CTA Sections

**Primary CTA (hero):** Keep "Continue with Google" but add a supporting line:  
`Free – no credit card required`

**Footer CTA (if you add one):**  
`Ready to land more interviews? Create your ATS-optimized resume in under 2 minutes.`

---

## 8.5 FAQ Section (New – Add to Homepage)

**Add 3–4 FAQs below features:**

1. **Is I Love Resumes free?**  
   Yes. Create and optimize resumes for free. Export to Word and PDF at no cost.

2. **How does the AI work?**  
   Upload your resume and optionally paste a job description. Our AI suggests improvements and keywords to better match the job.

3. **Does it work for ATS?**  
   Yes. We focus on ATS-friendly structure and keyword alignment so your resume gets past automated screening.

4. **What formats can I export?**  
   Word (.docx) and PDF—both standard formats for job applications.

---

## 8.6 Meta Title and Description (Final)

**Title:** `Free AI Resume Builder | ATS-Optimized in Seconds | I Love Resumes`

**Description:** `Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers.`

---

## 8.7 Headings (Final Structure)

- H1: Free AI Resume Builder – ATS-Optimized in Seconds
- H2: How Our Free AI Resume Builder Works
- H3: PDF Resume Upload
- H3: Job Description Matching
- H3: Real-Time Editing
- H3: Export to Word & PDF
- H2: Frequently Asked Questions (if you add FAQ)
- H3: [Per question]

---

---

# 9. Backlink Strategy

## 9.1 Where to Build Relevant Backlinks

1. **Product directories:** Product Hunt, BetaList, SaaSHub, AlternativeTo (resume tools category)
2. **Career/job sites:** Get listed in "tools for job seekers" sections, resume resource pages
3. **Roundup posts:** Pitch to "best resume builders 2025" and "best AI resume tools" articles
4. **University career centers:** Offer free access or content for their students
5. **HR/career blogs:** Guest posts on resume and hiring topics
6. **Canadian focus:** Canada-specific job and career sites, immigrant employment resources

---

## 9.2 Guest Post Ideas

- "How AI Is Changing Resume Writing" – career blog
- "ATS Optimization: What Job Seekers Need to Know" – HR blog
- "Resume Format Guide for Canadian Job Seekers" – Canadian career site
- "Technical Resume Tips for Software Engineers" – dev/career blog

---

## 9.3 Directory Ideas

- Product Hunt
- BetaList
- SaaSHub
- AlternativeTo
- Capterra / G2 (if you have enough users)
- Canadian business directories (e.g. Canada.ca business list, provincial directories)

---

## 9.4 LinkedIn / Medium / Reddit

- **LinkedIn:** Articles from founders on resumes, ATS, job search. Link to site in bio and articles.
- **Medium:** Republish or adapt blog content. Link back to site.
- **Reddit:** r/resumes, r/jobs, r/careerguidance – helpful answers, no spam. Link when directly relevant.

---

## 9.5 Partnerships

- Career coaches and outplacement firms
- Universities and colleges (career services)
- Coding bootcamps
- Immigration and settlement agencies (Canada)

---

## 9.6 Digital PR

- HARO / Qwoted: respond to queries about resumes, ATS, job search
- Press release when you hit a milestone (e.g. X resumes created)
- "State of the resume" or survey-based content for media

---

## 9.7 Avoiding Spammy Backlinks

- Skip generic link farms and Fiverr link packages
- Focus on relevant, editorial links
- Check referring domain quality (DA/DR, relevance)
- Disavow clear spam in GSC

---

---

# 10. Competitor Gap Analysis

## 10.1 Competitor Types

1. **Resume builders:** Zety, Resume.io, Kickresume, Enhancv
2. **Resume writing services:** TopResume, Resume Writing Service
3. **ATS/tools:** Jobscan, Resume Worded
4. **Career blogs:** The Muse, Indeed Career Guide, FlexJobs blog

---

## 10.2 What They Do Better

- **Content volume:** Zety, Indeed, The Muse have hundreds of articles
- **Domain authority:** Big brands have years of backlinks
- **Free tools:** Jobscan, Resume Worded have free ATS/scoring tools that attract links and traffic
- **Landing pages:** Many targeted pages (e.g. by industry, by format)
- **Reviews:** G2, Capterra reviews and aggregate ratings

---

## 10.3 Content They Have That You Don’t

- Large blogs (50–200+ posts)
- Free standalone tools (ATS checker, keyword extractor)
- Industry-specific guides
- Comparison pages
- Location pages (US cities, sometimes Canada)
- Video content
- Downloadable templates and checklists

---

## 10.4 How to Compete

- Don’t try to out-volume them immediately
- Win on **long-tail** first: "resume builder that matches job description", "free ATS checker", "resume builder Canada", "resume builder Toronto"
- Build a few high-quality pillars (ATS, formats, Canada)
- Add one standout free tool (e.g. ATS checker)
- Focus on Canada/Toronto if you have .ca domain and local angle
- Be honest in comparisons and build trust

---

## 10.5 Long-Tail Opportunities to Target First

1. resume builder that matches job description
2. free ATS resume checker
3. resume builder Canada
4. AI resume builder Toronto
5. resume to word converter free
6. how to optimize resume for ATS 2025
7. Canadian resume format
8. resume keyword extractor from job description

---

---

# 11. Local SEO

## 11.1 Does Local SEO Make Sense?

**Yes, with limits.** You’re a SaaS with a .ca domain. Local SEO helps if:
- You target Canadian job seekers
- You want "resume builder Canada" and city terms
- You might add a physical presence later

You likely won’t show in the local pack (map results) without a real location. But location pages and local keywords can still drive traffic.

---

## 11.2 Toronto Landing Page

- **URL:** /resume-builder-toronto
- **Target:** resume builder Toronto, AI resume builder Toronto, resume writer Toronto
- **Content:** Toronto job market, local industries, Canadian resume tips, CTA
- **Links:** To /resume-builder-canada and homepage

---

## 11.3 Canada-Focused Service Page

- **URL:** /resume-builder-canada
- **Target:** resume builder Canada, AI resume builder Canada
- **Content:** Canadian resume norms, format differences vs US, regional variations
- **Links:** To Toronto, Vancouver, Montreal subpages if you create them

---

## 11.4 Google Business Profile

- **Use:** Only if you have a real address (home office, co-working, etc.)
- **Category:** "Resume service" or "Career consulting"
- **Avoid:** Fake addresses; Google may suspend the listing

---

## 11.5 City/Service Combinations

**Priority:**
1. Toronto (largest market)
2. Canada (country-level)
3. Vancouver, Montreal (if you expand)

**Page structure:**
- /resume-builder-canada (pillar)
- /resume-builder-toronto
- /resume-builder-vancouver (later)
- /resume-builder-montreal (later)

---

## 11.6 Local Schema and Trust Signals

- Use `addressCountry: "CA"` in Organization if you have a Canadian presence
- Mention "Canada" and "Canadian" in copy
- Add "Toronto", "GTA" where relevant
- Link location pages to each other and to Canada content

---

---

# 12. Priority Implementation Roadmap

## Top 10 Highest-Impact SEO Fixes

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Fix domain: iloveresumes.com → iloveresumes.ca everywhere | Critical | 1 hr |
| 2 | Make /contact public (remove auth) | High | 30 min |
| 3 | Add noindex to auth-walled pages, fix sitemap/robots | High | 1 hr |
| 4 | Add homepage header with internal links (Contact, Features, etc.) | High | 1 hr |
| 5 | Rewrite homepage: title, meta, H1, H2, copy, add FAQ | High | 2 hrs |
| 6 | Add FAQ page + FAQ schema | Medium | 2 hrs |
| 7 | Create /resume-builder-canada page | High | 3 hrs |
| 8 | Add WebSite + fix existing schema (URLs, dates) | Medium | 1 hr |
| 9 | Create /ats-resume-checker tool page (or MVP) | High | 4+ hrs |
| 10 | Start blog + first 3 articles | High | Ongoing |

---

## 24-Hour Action Plan

1. **Domain fix** – Find/replace iloveresumes.com → iloveresumes.ca in layout.js, robots.txt, sitemap, contact layout, dashboard layout
2. **OG image** – Use absolute URL https://iloveresumes.ca/logo.png
3. **robots.txt** – Update Sitemap URL, add Disallow for /dashboard, /result, /word-download, /myprofile
4. **sitemap.xml** – Switch to .ca, remove auth-walled URLs, update lastmod
5. **Make contact public** – Remove auth check in contact/page.js
6. **noindex auth pages** – Add robots: { index: false } to dashboard layout; create layouts for result, word-download, myprofile if needed
7. **Homepage header** – Add simple header with Home, Features (#features), Contact, CTA
8. **Homepage copy** – Update title, meta, H1, H2, feature copy (Section 8)
9. **Footer** – Add links: Contact, Privacy (if exists), Terms (if exists)
10. **Remove font preconnects** – In layout.js

---

## 7-Day Action Plan

- Everything in 24-hour plan ✓
- Create /faq page with 6–8 Q&As + FAQ schema
- Add FAQ schema to homepage if you add a small FAQ block
- Create /resume-builder-canada page
- Implement dynamic sitemap (app/sitemap.js)
- Add WebSite schema and fix WebApplication/Organization
- Submit updated sitemap in Google Search Console
- Request indexing for key URLs

---

## 30-Day Action Plan

- Everything in 7-day plan ✓
- Create /resume-builder-toronto page
- Publish first 3 blog posts (e.g. How ATS Works, Best Resume Format 2025, Canadian Resume Format)
- Create /blog index page
- Add BreadcrumbList to blog posts
- Set up basic internal linking (blog → homepage, tools, location pages)
- Start backlink outreach (2–3 directories, 1–2 guest post pitches)
- Create /privacy and /terms if missing

---

## 90-Day SEO Growth Plan

**Month 1:** Technical fixes, contact public, Canada + Toronto pages, FAQ, first 3 blog posts  
**Month 2:** 6–8 more blog posts, /ats-resume-checker tool (or MVP), /ai-resume-builders-compared, pillar post (e.g. ATS guide)  
**Month 3:** 6–8 more posts, internal linking pass, backlink outreach, monitor Search Console and adjust

**Target:** 20–30 indexable pages, 15+ blog posts, 1–2 tool pages, 2 location pages. Realistic traffic: hundreds of organic visits/month if execution is solid; thousands takes longer.

---

---

# 13. Developer Implementation Output

## 13.1 Exact Meta Title Recommendations

| Page | Title |
|------|-------|
| Homepage | Free AI Resume Builder \| ATS-Optimized in Seconds \| I Love Resumes |
| Contact | Contact Us \| AI Resume Builder Support \| I Love Resumes |
| FAQ | FAQ \| AI Resume Builder \| I Love Resumes |
| Canada | AI Resume Builder for Canada \| Free ATS-Optimized Resumes |
| Toronto | Resume Builder Toronto \| AI-Powered \| Free \| I Love Resumes |
| ATS Checker | Free ATS Resume Checker \| Test Your Resume \| I Love Resumes |

---

## 13.2 Exact Meta Description Recommendations

| Page | Description |
|------|-------------|
| Homepage | Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers. |
| Contact | Get help with our AI resume builder. Support, feedback, and tips. We respond within 24 hours. |
| FAQ | Answers about our AI resume builder. Privacy, ATS, exports, and more. |
| Canada | Free AI resume builder for Canadian job seekers. ATS-optimized. Works with Canadian resume formats. Toronto, Vancouver, Montreal. |
| Toronto | Free AI resume builder for Toronto job seekers. ATS-optimized for Toronto and GTA jobs. Export to Word and PDF. |

---

## 13.3 Suggested Heading Structure

**Homepage:**
```
H1: Free AI Resume Builder – ATS-Optimized in Seconds
H2: How Our Free AI Resume Builder Works
  H3: PDF Resume Upload
  H3: Job Description Matching
  H3: Real-Time Editing
  H3: Export to Word & PDF
H2: Frequently Asked Questions
  H3: Is I Love Resumes free?
  H3: How does the AI work?
  ... (etc)
```

---

## 13.4 Exact Schema Code

See Section 7. Use:
- Organization (fix URLs)
- WebSite (add)
- WebApplication (fix URLs)
- FAQPage (add to /faq and/or homepage FAQ)

---

## 13.5 Suggested URL Slugs

| Page | Slug |
|------|------|
| Homepage | / |
| Contact | /contact |
| FAQ | /faq |
| Canada | /resume-builder-canada |
| Toronto | /resume-builder-toronto |
| ATS Checker | /ats-resume-checker |
| Resume to Word | /resume-to-word |
| Blog | /blog |
| Blog post | /blog/[slug] |
| Comparison | /ai-resume-builders-compared |
| Privacy | /privacy |
| Terms | /terms |

---

## 13.6 Technical Fixes Checklist

- [ ] Replace iloveresumes.com with iloveresumes.ca in layout.js
- [ ] Replace iloveresumes.com with iloveresumes.ca in robots.txt
- [ ] Replace iloveresumes.com with iloveresumes.ca in sitemap.xml
- [ ] Replace iloveresumes.com with iloveresumes.ca in contact/layout.js
- [ ] Replace iloveresumes.com with iloveresumes.ca in dashboard/layout.js
- [ ] Set og:image and twitter:image to https://iloveresumes.ca/logo.png
- [ ] Set canonical to https://iloveresumes.ca (and per-page where applicable)
- [ ] Remove preconnect to fonts.googleapis.com and fonts.gstatic.com
- [ ] Update robots.txt: Sitemap URL + Disallow auth-walled paths
- [ ] Update sitemap: .ca URLs only, remove auth-walled pages
- [ ] Make /contact public (remove auth redirect)
- [ ] Add robots: { index: false } to dashboard layout
- [ ] Create result/layout.js, word-download/layout.js, myprofile/layout.js with noindex (or add to existing)
- [ ] Add homepage header with links: Home, Features, Contact, CTA
- [ ] Add footer links: Contact, Privacy, Terms
- [ ] Update homepage title, meta description, H1, H2, feature copy
- [ ] Add FAQ section to homepage (3–4 questions) + FAQ schema
- [ ] Add WebSite schema to layout.js
- [ ] Fix WebApplication schema: URLs, screenshot, dateModified
- [ ] Fix Organization schema: URLs
- [ ] Create app/sitemap.js for dynamic sitemap (optional)
- [ ] Create /faq page
- [ ] Create /resume-builder-canada
- [ ] Create /resume-builder-toronto
- [ ] Add NEXT_PUBLIC_SITE_URL to .env.local and use in config/meta

---

---

# Brutally Honest Verdict

## What Is Currently Holding the Site Back Most

1. **Domain mismatch** – Canonical and all assets point to iloveresumes.com while the site is iloveresumes.ca. This confuses Google and splits any equity.

2. **One indexable page** – Effectively only the homepage is indexable. Contact and other listed URLs are behind auth. You have almost no crawlable surface.

3. **No topical authority** – No blog, no pillar content, no tools, no location pages. You look like a single landing page, not a resource. Google favors sites with depth and breadth.

4. **Weak internal linking** – Homepage doesn’t link anywhere. Crawlers can’t discover other pages, and you don’t pass authority internally.

5. **Thin, generic positioning** – Copy is fine but not sharply optimized for "free", "ATS", "Canada". You’re not clearly owning a wedge (e.g. "job description matching" or "Canada").

---

## What Is Realistic

- **3–6 months:** With technical fixes, contact public, 1–2 location pages, 10–15 solid blog posts, and one simple tool (e.g. ATS checker): hundreds of organic visits per month is achievable.
- **6–12 months:** With 30+ pages, consistent content, and some backlinks: 1,000–3,000 visits/month is a reasonable target for a small team.
- **Rankings:** Long-tail terms ("resume builder Canada", "free ATS checker") can rank in 3–6 months. Head terms ("resume builder", "AI resume builder") will take a year or more due to strong competition.

---

## What Is Unrealistic

- Ranking #1 for "resume builder" or "AI resume builder" in 6–12 months. Established players have far more authority and content.
- Significant traffic from one homepage with no content expansion.
- Quick wins from schema or meta tweaks alone. They help, but content and architecture matter more.
- Guaranteed results from any single tactic. SEO is cumulative and competitive.

---

## What Needs to Happen for Serious Organic Traffic

1. **Fix the technical foundation** – Domain, indexing, sitemap, robots. Stop sending conflicting signals.

2. **Expand indexable surface** – Public contact, FAQ, 2+ location pages, 1+ tool page, 15–30 blog posts. Aim for 25–40 indexable URLs in 90 days.

3. **Build topical authority** – Pillar content on ATS, formats, and Canada. Interlink with cluster content.

4. **Target long-tail first** – "resume builder Canada", "resume builder Toronto", "free ATS checker", "resume builder that matches job description". Compete where you can win before going after head terms.

5. **Acquire real backlinks** – 5–10 quality links from relevant directories, roundups, and guest posts in the first 90 days. Avoid spam.

6. **Commit to content** – At least 2–4 posts per month for 6+ months. Consistency matters more than sporadic bursts.

7. **Differentiate** – Own "job description matching" and "Canada" in messaging and content. Give Google a reason to prefer you for those queries.

---

**Bottom line:** The product and positioning are viable. The main blocker is technical and structural: wrong domain, almost no indexable content, and minimal internal linking. Fix those, add 20–30 quality pages, and focus on long-tail and local terms. Traffic will follow, but it will take months of steady work.

---

*End of SEO Improvement Plan*
