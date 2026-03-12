# SEO Super-Audit Report: I Love Resumes (iloveresumes.ca)

**Audit Date:** March 11, 2025  
**Website:** https://iloveresumes.ca  
**Niche:** AI-Powered Resume Builder

---

## Executive Summary

Your site has a **critical domain configuration error** that is likely causing significant ranking loss: canonical URLs, Open Graph, schema, sitemap, and robots.txt all reference **iloveresumes.com** while your live site is **iloveresumes.ca**. Google may be attributing signals to the wrong domain or treating these as separate entities. Additionally, 5 of 6 sitemap pages are behind authentication (redirect to login), so crawlers cannot index their content. The homepage has minimal internal linking and no crawl path to public pages.

---

# 1. Technical SEO Audit

## 1.1 Critical: Domain Mismatch (iloveresumes.com vs iloveresumes.ca)

**Problem:** Every SEO-critical asset points to the wrong domain.

| Asset | Current Value | Should Be |
|-------|---------------|-----------|
| Canonical | `https://iloveresumes.com` | `https://iloveresumes.ca` |
| OG URL | `https://iloveresumes.com` | `https://iloveresumes.ca` |
| OG Image | `/logo.png` (relative) | `https://iloveresumes.ca/logo.png` |
| robots.txt Sitemap | `https://iloveresumes.com/sitemap.xml` | `https://iloveresumes.ca/sitemap.xml` |
| sitemap.xml URLs | All `iloveresumes.com` | All `iloveresumes.ca` |
| WebApplication schema `url` | `iloveresumes.com` | `iloveresumes.ca` |
| Organization schema `url` | `iloveresumes.com` | `iloveresumes.ca` |
| Contact layout Open Graph | `iloveresumes.com/contact` | `iloveresumes.ca/contact` |
| Dashboard layout Open Graph | `iloveresumes.com/dashboard` | `iloveresumes.ca/dashboard` |

**Why it hurts rankings:** Canonical tags tell Google which URL is the “main” version. Yours points to a different domain. Google may:
- Split link equity between .com and .ca
- Index the wrong URL in search results
- Weaken E-E-A-T signals by showing mismatched URLs

**Fix:** Replace every instance of `iloveresumes.com` with `iloveresumes.ca` across the codebase. Use a single constant (e.g. `NEXT_PUBLIC_SITE_URL`) to avoid future drift.

---

## 1.2 Auth-Walled Pages (Indexation Blocked)

**Problem:** These pages redirect unauthenticated visitors (including crawlers) to `/` or show only "Loading...":
- `/contact` – redirects to `/` when not logged in
- `/dashboard` – redirects to `/`
- `/result` – redirects to `/`
- `/word-download` – redirects to `/`
- `/myprofile` – redirects to `/`

**Impact:** Google cannot index the content of these URLs. They are in your sitemap, so you are telling Google to crawl pages that return no useful content. That wastes crawl budget and can lead to soft-404 behavior.

**Fix options:**

1. **Contact page (recommended):** Make it public. Contact pages support trust signals, local SEO, and conversions. Remove the auth check from `/contact` and allow anonymous access.
2. **Dashboard/Result/Word-download/MyProfile:** Add `noindex, nofollow` to these pages so they stay out of the index, or remove them from the sitemap and allow them to remain uncrawled.

**Implementation for auth-walled pages:**

```javascript
// In layout.js for dashboard, result, word-download, myprofile - add to metadata:
export const metadata = {
  robots: { index: false, follow: false },
  // ...
};
```

**Sitemap change:** Remove auth-walled pages (`/dashboard`, `/result`, `/word-download`, `/myprofile`) from `sitemap.xml`, or keep only public pages (`/`, `/contact` if made public).

---

## 1.3 Sitemap Issues

**Problems:**
1. `https://iloveresumes.ca/sitemap.xml` returned 500 during audit (verify in production).
2. All URLs use `iloveresumes.com`.
3. `lastmod` is static `2024-01-01` everywhere – not reflecting real updates.
4. `/result` and `/word-download` appear to be flow pages, not standalone content pages; including them may not add value if they are auth-walled.

**Recommended sitemap.xml** (after fixes):

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

Make `/contact` public first, then include it. Consider a dynamic sitemap (Next.js `app/sitemap.js`) so `lastmod` stays accurate.

---

## 1.4 robots.txt

**Current issues:**
- Sitemap URL uses `iloveresumes.com`.
- `Allow: /dashboard`, `Allow: /result` are redundant if these remain auth-walled and/or noindex.
- No disallow for `/result` and `/word-download` if they use query params (e.g. `?id=xxx`) to avoid duplicate URLs.

**Recommended robots.txt:**

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

This keeps crawlers focused on indexable pages.

---

## 1.5 Page Speed & Core Web Vitals

**Current setup:**
- Next.js 16 with `compress: true`
- `preconnect` to fonts.googleapis.com and gstatic.com – but `globals.css` uses `Arial, Helvetica, sans-serif`, so no Google Fonts are loaded. Those preconnects add cost with no benefit.
- Framer Motion used heavily – can affect LCP/INP if overused on above-the-fold content.
- Images use `next/image` (good).

**Recommendations:**
1. Remove preconnect to Google Fonts if no fonts are imported:
```diff
- <link rel="preconnect" href="https://fonts.googleapis.com" />
- <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://accounts.google.com" />
```
2. Lazy-load Framer Motion for below-the-fold sections where possible.
3. Run PageSpeed Insights (Desktop + Mobile) and Lighthouse CI in your pipeline to track LCP, INP, CLS.

---

## 1.6 Canonical & OG Image

**Problems:**
1. Root layout has a single canonical for the whole site; nested routes do not get page-specific canonicals.
2. OG image is `/logo.png` (relative). Facebook, Twitter, etc. need an absolute URL.

**Fix for layout.js:**

```javascript
// Use absolute URLs for OG image
<meta property="og:image" content="https://iloveresumes.ca/logo.png" />
<meta name="twitter:image" content="https://iloveresumes.ca/logo.png" />
```

For child routes, use `generateMetadata` in server layouts so each page gets its own canonical and OG URL. Since the root layout is a client component with a static `<head>`, consider moving metadata to a server layout wrapper or using `next/head` only where needed so child metadata can override.

---

## 1.7 Structured Data

**Current:** WebApplication and Organization schemas are present (good).

**Issues:**
- All `url` fields use `iloveresumes.com`.
- `screenshot` is `/logo.png` – should be absolute.
- `dateModified` is `2024-01-01` – update when you change the product.
- No FAQPage or HowTo schema for resume/job-search content.

**Add FAQPage schema** (for a future FAQ section):

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
        "text": "Upload your resume in PDF format. Our AI analyzes it, suggests improvements, and helps align keywords with job descriptions for better ATS compatibility."
      }
    },
    {
      "@type": "Question",
      "name": "Is my resume data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We use secure authentication and do not share your data with third parties."
      }
    }
  ]
}
```

---

## 1.8 Internal Linking

**Problems:**
1. Homepage has no navbar (`NavbarWrapper` hides it for `pathname === "/"`), so no internal links to `/contact` or other pages.
2. Footer has no links (only copyright).
3. Logged-out users cannot reach `/contact` (auth redirect).
4. Navbar logo links to `/dashboard`, not `/` – when logged in, users cannot easily return to the homepage.

**Recommendations:**
1. Add a lightweight header on the homepage with links: Home, Features (anchor), Contact (once public), Login/Get Started.
2. Add footer links: About, Contact, Privacy Policy (if you have one), Terms.
3. Expose `/contact` to logged-out users so crawlers and visitors can reach it.

---

## 1.9 Crawlability Summary

| Page | Indexable? | In Sitemap? | Issue |
|------|------------|-------------|-------|
| / | Yes | Yes | No internal links to other pages |
| /contact | No (auth) | Yes | Redirects when not logged in |
| /dashboard | No (auth) | Yes | Redirects |
| /result | No (auth) | Yes | Redirects |
| /word-download | No (auth) | Yes | Redirects |
| /myprofile | No (auth) | No | Not in sitemap |

---

# 2. On-Page SEO Optimization

## 2.1 Title Tags & Meta Descriptions

**Homepage (current):**
- Title: `I Love Resumes - AI-Powered Resume Builder | Create Professional Resumes` ✓ (good length, keyword-rich)
- Meta: `Transform your resume with AI-powered insights. Get personalized suggestions...` ✓ (good)

**Suggested improvements:**

| Page | Current Title | Suggested Title | Reason |
|------|---------------|------------------|--------|
| Homepage | (good) | `Free AI Resume Builder \| Optimize & Export in Seconds \| I Love Resumes` | Add "Free" for intent, keep under 60 chars |
| Contact | Contact Us - I Love Resumes \| Get in Touch | `Contact Us \| AI Resume Builder Support \| I Love Resumes` | Keyword reinforcement |
| Dashboard | I Love Resumes \| AI Resume Builder | (noindex – less critical) | - |

**Meta description suggestions:**
- Homepage: `Create ATS-optimized resumes in seconds. Free AI resume builder with job description matching, PDF upload, and Word/PDF export. Trusted by 1000+ job seekers.`
- Contact: `Get help with the I Love Resumes AI resume builder. Support, feedback, and tips to create resumes that pass ATS systems.`

---

## 2.2 Heading Structure (H1–H6)

**Homepage:**
- H1: `Build Smarter Resumes with AI` ✓ (single H1, good)
- H2: `Everything You Need to Succeed` ✓
- H3: Smart Upload, Job Alignment, Live Editing, Multiple Formats ✓

**Recommendation:** Add an H2 above the hero for accessibility/SEO, e.g. `Free AI-Powered Resume Builder` as a supporting H2 if it fits your design, or keep structure as-is.

---

## 2.3 Keyword Placement

**Current focus:** resume builder, AI, job descriptions, professional resume.

**Add naturally:**
- "ATS" / "ATS-optimized" – high relevance for job seekers
- "free" – strong commercial intent
- "PDF" and "Word" – common export formats
- "job description" – already present ✓

**Placement:** Work "ATS-optimized" and "free" into the hero subtitle and feature descriptions where it reads naturally.

---

# 3. Keyword Strategy

## 3.1 Primary Keywords

| Keyword | Intent | Difficulty | Recommendation |
|---------|--------|------------|----------------|
| resume builder | Transactional | High | Primary, already in title |
| AI resume builder | Transactional | Medium | Strong differentiator |
| free resume builder | Transactional | High | Add "free" to messaging |
| ATS resume | Informational/Transactional | Medium | Use in content |
| resume optimizer | Transactional | Medium | Align with product |
| job description matching | Informational | Low | Good long-tail target |

## 3.2 Long-Tail Opportunities

- "free AI resume builder no sign up" (or "quick sign up")
- "resume builder that matches job description"
- "ATS resume checker free"
- "resume to word converter free"
- "AI resume writer for [industry]"
- "resume keyword optimizer free"

## 3.3 Search Intent

- **Transactional:** "resume builder", "AI resume builder", "free resume maker" → Landing page + clear CTA.
- **Informational:** "how to optimize resume for ATS", "resume keywords" → Blog, FAQ, guides.
- **Navigational:** "I Love Resumes" → Brand page, homepage.

---

# 4. Content SEO

## 4.1 Current State

- Single landing page + app flows (dashboard, result, etc.).
- No blog or long-form content.
- No FAQ section.
- Stats ("8490+ Resumes Created", "98% Success Rate") lack verification – consider adding sources or toning down if unverified.

## 4.2 Content Gaps

1. **Blog/guides**
   - "How to Optimize Your Resume for ATS in 2025"
   - "Best Resume Format for [Industry]"
   - "How to Match Your Resume to a Job Description"
   - "Resume Keywords: What Recruiters Look For"

2. **Pillar page**
   - "Complete Guide to AI Resume Builders" – target "AI resume builder" and related terms.

3. **FAQ section**
   - How it works, security, exports, ATS compatibility.

4. **Comparison content**
   - "I Love Resumes vs. [Competitor]" (only if defensible and accurate).

## 4.3 Content Clusters

```
Pillar: AI Resume Builder Guide
├── Cluster: ATS Optimization
│   ├── How ATS systems work
│   ├── ATS resume format tips
│   └── ATS keyword scanner (link to tool)
├── Cluster: Job Description Matching
│   ├── Why keywords matter
│   └── How to extract keywords from job posts
└── Cluster: Resume Formats
    ├── PDF vs Word resume
    └── Best resume formats by industry
```

---

# 5. Internal Linking Strategy

## 5.1 Gaps

- Homepage: no links to Contact, Features (anchor), or any subpage.
- Contact: no link back to homepage or features (if made public).
- Navbar: no link to homepage when on other pages.
- Footer: no links anywhere.

## 5.2 Architecture Proposal

```
Homepage (/)
├── Features (anchor #features)
├── Contact (/contact)
├── FAQ (future /faq or #faq)
└── Blog (future /blog)

Contact (/contact)
├── Homepage
└── Dashboard (for logged-in users)

Footer (all pages)
├── Contact
├── Privacy Policy
├── Terms
└── (optional) Blog
```

## 5.3 Implementation

1. Add a header on the homepage with: Logo → Home, Features, Contact, CTA.
2. Add footer with: Contact | Privacy | Terms.
3. Ensure navbar logo links to `/` on the homepage and to `/dashboard` when logged in.
4. Add contextual links in content (e.g. "Learn more about ATS optimization") when you add blog/guides.

---

# 6. Backlink Strategy

## 6.1 High-Value Opportunities

1. **Product Hunt / BetaList** – Launch and collect upvotes and backlinks.
2. **Resume / career directories** – List on job-search and career sites (e.g. CareerBuilder, Indeed resources, niche directories).
3. **"Best resume builder" roundups** – Pitch to sites that curate tools (e.g. TechTimes, Resumory, Wobo comparisons).
4. **Guest posts** – Career blogs, university career centers, HR blogs.
5. **HARO / Qwoted** – Respond to journalist queries on resumes, ATS, job search.
6. **Canadian focus** – `.ca` domain can target Canadian career and immigration resources.

## 6.2 Tactics

- Create a "Press" or "Media" page with logo, screenshots, and boilerplate.
- Use tools like Ahrefs or Semrush to find broken links to resume tools and suggest your site as a replacement.
- Partner with career coaches and offer affiliate or referral links.

---

# 7. Competitor SEO Analysis

## 7.1 Key Competitors

| Competitor | Strength | What they do well |
|------------|----------|-------------------|
| Rezi | High authority | 4M+ users, strong domain, free tools (e.g. keyword scanner) |
| Zety | High | Large content hub, multiple landing pages |
| Enhancv | ATS focus | Strong "ATS" positioning and messaging |
| Teal | Job search | Combines resume builder with job tracking |
| Kickresume | GPT-4 | Emphasizes AI and templates |

## 7.2 Differentiation

1. **Focus on "job description matching"** – Few competitors own this phrase; you can.
2. **Free + quick** – Emphasize speed and no-hassle sign-up (e.g. "in seconds").
3. **Canadian angle** – Use `.ca` and Canadian job market content if relevant.
4. **Content** – Competitors have big blogs; start with 1–2 strong guides and grow from there.

---

# 8. Implementation Roadmap

## Phase 1: Immediate (24 hours)

1. **Fix domain mismatch**
   - Replace `iloveresumes.com` with `iloveresumes.ca` in:
     - `src/app/layout.js` (canonical, OG, schema)
     - `public/robots.txt`
     - `public/sitemap.xml`
     - `src/app/contact/layout.js`
     - `src/app/dashboard/layout.js`
   - Add `NEXT_PUBLIC_SITE_URL=https://iloveresumes.ca` to `.env` and use it everywhere URLs are needed.

2. **Fix OG image**
   - Use absolute URL: `https://iloveresumes.ca/logo.png`.

3. **Update robots.txt**
   - Point Sitemap to `https://iloveresumes.ca/sitemap.xml`.

4. **Restrict sitemap**
   - Remove auth-walled pages or add `noindex` to them and remove from sitemap.
   - Fix any 500 on `/sitemap.xml`.

## Phase 2: Short-term (1–2 weeks)

1. **Public contact page**
   - Remove auth requirement from `/contact`.
   - Add `/contact` to sitemap.
   - Add canonical and OG tags for `/contact`.

2. **Homepage internal links**
   - Add header with Home, Features, Contact.
   - Add footer with Contact, Privacy, Terms (if pages exist).
   - Add anchor `#features` and link from header.

3. ** metadata**
   - Add `robots: { index: false }` to dashboard, result, word-download, myprofile layouts.
   - Update sitemap to include only `/` and `/contact`.
   - Update `lastmod` dynamically or manually to a recent date.

4. **Remove unused preconnects**
   - Remove Google Fonts preconnects from `layout.js` if no Google Fonts are used.

5. **FAQ schema**
   - Add FAQPage schema (e.g. in layout or a future FAQ component).
   - Optionally add a visible FAQ section on the homepage.

## Phase 3: Long-term (3–6 months)

1. **Content hub**
   - Create `/blog`.
   - Publish 4–6 guides (ATS, job description matching, resume formats).
   - Build a pillar page around "AI resume builder".

2. **Technical**
   - Implement `app/sitemap.js` for dynamic sitemap.
   - Add `app/robots.js` for dynamic robots if needed.
   - Run Lighthouse CI and monitor Core Web Vitals.

3. **Backlinks**
   - Submit to Product Hunt and directories.
   - Reach out for roundups and guest posts.
   - Set up a simple Press/Media page.

4. **Local SEO**
   - If relevant, add LocalBusiness schema and Canadian targeting.
   - Optimize for "resume builder Canada" and similar queries.

---

# Quick Reference: Files to Edit

| File | Changes |
|------|---------|
| `src/app/layout.js` | Domain → .ca, OG image absolute, remove font preconnects |
| `public/robots.txt` | Sitemap URL, disallow auth-walled paths |
| `public/sitemap.xml` | All URLs → .ca, remove auth-walled pages, update lastmod |
| `src/app/contact/layout.js` | OG url → .ca |
| `src/app/contact/page.js` | Remove auth redirect (make public) |
| `src/app/dashboard/layout.js` | OG url → .ca, add robots: noindex |
| `src/app/result/page.js` | Add layout with noindex (create layout if missing) |
| `src/app/word-download/page.js` | Add layout with noindex (create layout if missing) |
| `src/app/myprofile/page.js` | Add layout with noindex (create layout if missing) |
| Homepage | Add header with internal links, footer with links |

---

*End of SEO Audit Report*
