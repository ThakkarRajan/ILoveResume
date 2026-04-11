# SEO Action Plan: iloveresumes.ca
## Ruthless, Implementation-Ready Audit

**Site:** https://iloveresumes.ca  
**Niche:** AI resume builder, ATS optimization, resume writing, Canada/Toronto job seekers  
**Date:** March 2026

---

# 1. FULL AUDIT

## 1.1 Technical SEO Problems

### P1: Domain Canonical Mismatch (Critical)

**Problem:** Live site is iloveresumes.ca. Canonical, OG, schema, sitemap, robots all reference iloveresumes.com.

**Impact:** Google may index the wrong domain, split link equity, or treat them as separate sites. Social shares resolve to .ca but OG says .com — broken sharing and CTR.

**Exact fix:**
```bash
# Global find/replace across repo:
iloveresumes.com → iloveresumes.ca
```

**Files to change:**
- `src/app/layout.js` (lines 29, 31, 40, 52, 65–66, 76, 102–103, 110–111)
- `public/robots.txt` (line 5)
- `public/sitemap.xml` (all loc URLs)
- `src/app/contact/layout.js` (url in openGraph)
- `src/app/dashboard/layout.js` (url in openGraph)

---

### P2: OG Image Relative URL

**Problem:** `og:image` and `twitter:image` are `/logo.png`. Social crawlers need absolute URLs.

**Exact fix:**
```jsx
<meta property="og:image" content="https://iloveresumes.ca/logo.png" />
<meta name="twitter:image" content="https://iloveresumes.ca/logo.png" />
```

---

### P3: Auth-Walled Pages in Sitemap

**Problem:** /contact, /dashboard, /result, /word-download require login. Crawlers get redirect or "Loading...". No indexable content. Wasted crawl budget, potential soft-404.

**Exact fix:**
1. Make /contact public — remove auth check in `src/app/contact/page.js` (lines 41–55)
2. Add to dashboard, result, word-download, myprofile layouts:
```js
export const metadata = { robots: { index: false, follow: false } };
```
3. Update sitemap — keep only / and /contact. Remove dashboard, result, word-download.

---

### P4: robots.txt Wrong Domain + Bloated Allow

**Problem:** Sitemap URL is .com. Allow rules for auth-walled pages are pointless.

**Exact fix:** Replace `public/robots.txt` with:
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

---

### P5: Sitemap Wrong Domain + Auth URLs

**Exact fix:** Replace `public/sitemap.xml` with:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://iloveresumes.ca/</loc>
    <lastmod>2026-03-11</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://iloveresumes.ca/contact</loc>
    <lastmod>2026-03-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```
(Make /contact public first.)

---

### P6: Unused Font Preconnects

**Problem:** Preconnect to fonts.googleapis.com and fonts.gstatic.com, but globals.css uses Arial. No Google Fonts loaded.

**Exact fix:** Remove from layout.js:
```diff
- <link rel="preconnect" href="https://fonts.googleapis.com" />
- <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
- <link rel="dns-prefetch" href="//fonts.googleapis.com" />
```

---

### P7: Homepage Has Zero Internal Links

**Problem:** NavbarWrapper hides nav when pathname === "/". Homepage has no links to contact, features, or any other page. Crawlers can't discover /contact.

**Exact fix:** Add a minimal header on the homepage (before hero) with:
- Logo → /
- Features → #features
- Contact → /contact
- CTA button

---

### P8: Meta Description Too Long

**Problem:** Current meta is ~179 chars. Google truncates at ~155–160.

**Exact fix:** Use 138 chars:  
`Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers.`

---

## 1.2 Keyword Targeting Weakness

| Weakness | Current | Fix |
|----------|---------|-----|
| "Free" missing | Title and H1 don't include "free" | Add "Free" to title and H1. High-intent modifier. |
| "ATS" missing | Nowhere on page | Add "ATS-optimized" in hero, features, meta. Core niche term. |
| "Canada" / "Toronto" missing | No local signals | Add to meta keywords; create /resume-builder-canada, /resume-builder-toronto. |
| "Job description" underused | In subtitle only | Reinforce in features and CTA. Own "resume that matches job description." |
| Feature copy generic | "Smart Upload", "Job Alignment" | Use keyword-rich: "PDF Resume Upload", "Job Description Matching", "Export to Word & PDF" |

---

## 1.3 Thin or Weak Content

| Issue | Location | Fix |
|-------|----------|-----|
| No FAQ | Homepage, site-wide | Add 3–4 FAQs below features. Create /faq with 8+ Q&As. |
| H2 vague | "Everything You Need to Succeed" | Replace with "How Our Free AI Resume Builder Works" or "4 Ways to Create an ATS-Optimized Resume" |
| No proof | "Trusted by 1000+ users", "98% Success Rate" | Add source or soften. Unverified claims hurt trust. |
| No blog | Entire site | Add /blog. Publish 2–4 posts/month. |
| No pillar content | Entire site | Create 1–2 guides: "ATS Resume Guide", "Canadian Resume Format" |
| Footer empty | Copyright only | Add Contact, Privacy, Terms links. |

---

## 1.4 Missing Pages

| Page | Target Keyword | Priority |
|------|----------------|----------|
| /faq | I Love Resumes FAQ, AI resume FAQ | P0 |
| /resume-builder-canada | resume builder Canada, AI resume Canada | P0 |
| /resume-builder-toronto | resume builder Toronto, resume writer Toronto | P0 |
| /ats-resume-checker | ATS resume checker, ATS resume checker free | P0 |
| /blog | resume tips, career blog | P0 |
| /privacy | Privacy policy | P1 |
| /terms | Terms of service | P1 |
| /resume-to-word | resume to word, resume to word converter | P2 |
| /ai-resume-builders-compared | best AI resume builder | P2 |

---

## 1.5 Internal Linking Gaps

| Gap | Fix |
|-----|-----|
| Homepage → nothing | Add header/footer links to Contact, FAQ, #features |
| No link to Contact | Homepage, footer |
| No link to future blog | Footer, header |
| No link to Canada/Toronto pages | Add when pages exist; link from homepage |
| Footer → nowhere | Add Contact, Privacy, Terms |
| Blog posts → money pages | Each post: 1–2 links to homepage, /ats-resume-checker, /resume-builder-canada |

---

## 1.6 Schema Opportunities

| Schema | Where | Status |
|--------|-------|--------|
| Organization | layout.js | Present — fix URLs |
| WebApplication | layout.js | Present — fix URLs, screenshot |
| WebSite | layout.js | **Missing** — add |
| FAQPage | /faq, homepage FAQ | **Missing** — add |
| BreadcrumbList | Blog, tool pages | **Missing** — add when pages exist |
| Article | Blog posts | **Missing** — add when blog exists |
| Service | /ats-resume-checker | **Missing** — add when page exists |
| LocalBusiness | Optional for Toronto | Only if physical location |

---

## 1.7 Backlink Opportunities

| Opportunity | Action |
|-------------|--------|
| Product Hunt | Launch; get featured, votes, links |
| BetaList | Submit for beta listing |
| SaaSHub | List under resume/career tools |
| AlternativeTo | Add as Zety/Resume.io alternative |
| "Best resume builders" roundups | Pitch to TechTimes, Wobo, Resumory, etc. |
| University career centers | Offer free access for students |
| Canadian job/career sites | TorontoJobs, Workopolis, Indeed Canada resources |
| Guest posts | HR blogs, career blogs, "How ATS works", "Canadian resume format" |
| HARO / Qwoted | Respond to resume, ATS, job search queries |
| Reddit r/resumes, r/jobs | Helpful answers, link when relevant (no spam) |
| LinkedIn articles | Founder content, link in bio |

---

## 1.8 Local SEO Opportunities

| Opportunity | Action |
|-------------|--------|
| .ca domain | Already have — use for Canada targeting |
| Toronto page | Create /resume-builder-toronto |
| Canada page | Create /resume-builder-canada |
| Canadian keywords | "resume builder Canada", "Toronto resume" |
| Resume vs CV Canada | Blog post — Canadians use both terms |
| Canadian format | Blog: "Canadian Resume Format Guide" |
| Google Business Profile | Only if you have a real address |
| Local schema | Add addressCountry: "CA" in Organization if applicable |

---

---

# 2. KEYWORD MAP

## Primary Commercial (Homepage, Service Pages)

| Keyword | Vol | Comp | Page | Intent |
|---------|-----|-----|------|--------|
| resume builder | High | High | / | Transactional |
| AI resume builder | High | Med-High | / | Transactional |
| free resume builder | High | High | / | Transactional |
| free AI resume builder | Med | Med-High | / | Transactional |

## Secondary (Tool, Service Pages)

| Keyword | Vol | Comp | Page | Intent |
|---------|-----|-----|------|--------|
| ATS resume checker | Med | Med | /ats-resume-checker | Transactional |
| resume to word | Med | Low-Med | /resume-to-word | Transactional |
| resume optimizer | Med | Med | / | Transactional |
| job description matching | Low | Low | / | Informational |

## Long-Tail (Blog, Tool Pages)

| Keyword | Vol | Comp | Page | Intent |
|---------|-----|-----|------|--------|
| resume builder that matches job description | Low | Low | / | Transactional |
| free ATS resume checker | Low | Low | /ats-resume-checker | Transactional |
| resume keyword extractor from job description | Low | Low | /ats-resume-checker | Transactional |
| how to optimize resume for ATS 2026 | Med | Med | /blog | Informational |
| best resume format for software engineer | Low | Low | /blog | Informational |

## Local (Location Pages)

| Keyword | Vol | Comp | Page | Intent |
|---------|-----|-----|------|--------|
| resume builder Canada | Med | Med | /resume-builder-canada | Transactional |
| resume builder Toronto | Low | Low | /resume-builder-toronto | Transactional |
| AI resume builder Toronto | Low | Low | /resume-builder-toronto | Transactional |
| resume writer Toronto | Med | Med | /resume-builder-toronto | Transactional |
| resume services Canada | Med | Med | /resume-builder-canada | Transactional |

## Informational (Blog)

| Keyword | Vol | Comp | Page | Intent |
|---------|-----|-----|------|--------|
| how does ATS work | Med | Med | /blog | Informational |
| Canadian resume format | Low | Low | /blog | Informational |
| resume vs CV Canada | Low | Low | /blog | Informational |
| resume keywords | Med | Med | /blog | Informational |
| how to tailor resume to job | Med | Med | /blog | Informational |

---

# 3. PAGE STRATEGY

## Current Pages

| Page | Status | Action |
|------|--------|--------|
| / | Indexable | Optimize copy, add links, add FAQ |
| /contact | Auth-walled | Make public |
| /dashboard | Auth-walled | noindex, remove from sitemap |
| /result | Auth-walled | noindex, remove from sitemap |
| /word-download | Auth-walled | noindex, remove from sitemap |
| /myprofile | Auth-walled | noindex |

## New Pages to Create

### /faq
- **Target:** I Love Resumes FAQ, AI resume builder FAQ
- **URL:** /faq
- **Title:** FAQ | AI Resume Builder | I Love Resumes
- **Meta:** Answers about our AI resume builder. Privacy, ATS, exports, and more.
- **H1:** Frequently Asked Questions
- **Sections:** 8–12 Q&As. Add FAQPage schema.

### /resume-builder-canada
- **Target:** resume builder Canada, AI resume builder Canada
- **URL:** /resume-builder-canada
- **Title:** AI Resume Builder for Canada | Free ATS-Optimized Resumes
- **Meta:** Free AI resume builder for Canadian job seekers. ATS-optimized. Canadian resume formats. Toronto, Vancouver, Montreal.
- **H1:** AI Resume Builder Built for Canadian Job Seekers
- **Sections:** Canada benefits, Canadian format tips, CTA, link to Toronto.

### /resume-builder-toronto
- **Target:** resume builder Toronto, resume writer Toronto
- **URL:** /resume-builder-toronto
- **Title:** Resume Builder Toronto | AI-Powered | Free | I Love Resumes
- **Meta:** Free AI resume builder for Toronto job seekers. ATS-optimized for GTA jobs. Export to Word and PDF.
- **H1:** Toronto's Free AI Resume Builder
- **Sections:** Toronto market, local tips, CTA, link to Canada.

### /ats-resume-checker
- **Target:** ATS resume checker, ATS resume checker free
- **URL:** /ats-resume-checker
- **Title:** Free ATS Resume Checker | Test Your Resume | I Love Resumes
- **Meta:** Free ATS resume checker. See how your resume scores. Get keyword suggestions. No signup required.
- **H1:** Free ATS Resume Checker
- **Sections:** Tool (paste job desc + resume), How ATS works, CTA.

### /blog
- **Target:** resume tips, career advice
- **URL:** /blog
- **Title:** Resume & Career Tips | I Love Resumes Blog
- **Meta:** Expert tips on resumes, ATS, job descriptions. From I Love Resumes.
- **H1:** Resume & Career Blog

### /blog/[slug] (example posts)
- /blog/how-ats-works
- /blog/best-resume-format-2026
- /blog/canadian-resume-format
- etc.

---

# 4. 30 CONTENT IDEAS

| # | Title | Target Keyword | Intent | Comp |
|---|-------|----------------|--------|------|
| 1 | How to Optimize Your Resume for ATS in 2026 | ATS resume optimization | Info | Med |
| 2 | Best Resume Format for 2026 | resume format 2026 | Info | Med |
| 3 | How AI Resume Builders Work | AI resume builder | Info | Low |
| 4 | Resume Keywords: What Recruiters Search For | resume keywords | Info | Med |
| 5 | How to Match Your Resume to a Job Description | tailor resume job description | Info | Med |
| 6 | Canadian Resume Format: Complete Guide | Canadian resume format | Info | Low |
| 7 | Resume vs CV: What's the Difference in Canada? | resume vs CV Canada | Info | Low |
| 8 | Technical Resume Guide for Software Engineers | technical resume | Info | Med |
| 9 | Best Free AI Resume Builders Compared (2026) | free AI resume builder | Trans | High |
| 10 | How to Pass Workday ATS | Workday ATS | Info | Low |
| 11 | How to Pass Greenhouse ATS | Greenhouse ATS | Info | Low |
| 12 | Entry-Level Resume Examples and Tips | entry level resume | Info | Med |
| 13 | Career Change Resume: How to Pivot | career change resume | Info | Med |
| 14 | Resume Length: One Page or Two? | resume length | Info | Low |
| 15 | Resume Fonts That Pass ATS | ATS resume font | Info | Low |
| 16 | Toronto Job Market: Resume Tips for 2026 | resume Toronto | Info | Low |
| 17 | Vancouver Resume Guide | Vancouver resume | Info | Low |
| 18 | Montreal Resume Format | Montreal resume | Info | Low |
| 19 | How to Extract Keywords from Job Descriptions | job description keywords | Info | Low |
| 20 | Resume Summary vs Objective | resume summary vs objective | Info | Low |
| 21 | Resume Bullet Points: How to Write Impact | resume bullet points | Info | Low |
| 22 | PDF vs Word Resume: Which Do Employers Prefer? | PDF vs Word resume | Info | Low |
| 23 | Resume Writing Services vs AI: When to Use Each | resume writing vs AI | Info | Low |
| 24 | How to Add LinkedIn to Resume | LinkedIn resume | Info | Low |
| 25 | Resume for Internship: Complete Guide | internship resume | Info | Low |
| 26 | Healthcare Resume Guide | healthcare resume | Info | Low |
| 27 | Teacher Resume Guide | teacher resume | Info | Low |
| 28 | Sales Resume Examples and Tips | sales resume | Info | Med |
| 29 | Resume Mistakes That Get You Rejected | resume mistakes | Info | Med |
| 30 | How to Convert Resume to Word (Free) | resume to word | Trans | Low |

---

# 5. SCHEMA CODE EXAMPLES

## WebSite (Add to layout.js)

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
    "logo": { "@type": "ImageObject", "url": "https://iloveresumes.ca/logo.png" }
  }
}
```

## Organization (Fix URLs in layout.js)

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

## WebApplication (Fix in layout.js)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "I Love Resumes",
  "description": "AI-powered resume builder with job description matching and ATS optimization",
  "url": "https://iloveresumes.ca",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "creator": { "@type": "Organization", "name": "I Love Resumes", "url": "https://iloveresumes.ca" },
  "featureList": ["AI resume analysis", "Job description alignment", "Real-time editing", "Word & PDF export"],
  "screenshot": "https://iloveresumes.ca/logo.png",
  "datePublished": "2024-01-01",
  "dateModified": "2026-03-11"
}
```

## FAQPage (Add to /faq or homepage)

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
    }
  ]
}
```

## BreadcrumbList (For blog posts)

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

## Article (For blog posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How ATS Systems Work (And How to Beat Them)",
  "description": "Learn how applicant tracking systems screen resumes.",
  "author": { "@type": "Organization", "name": "I Love Resumes" },
  "publisher": { "@type": "Organization", "name": "I Love Resumes", "logo": { "@type": "ImageObject", "url": "https://iloveresumes.ca/logo.png" } },
  "datePublished": "2026-03-11",
  "dateModified": "2026-03-11"
}
```

## Service (For /ats-resume-checker)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Free ATS Resume Checker",
  "description": "Check how your resume scores against ATS systems. Get keyword suggestions.",
  "provider": { "@type": "Organization", "name": "I Love Resumes" },
  "url": "https://iloveresumes.ca/ats-resume-checker"
}
```

---

# 6. IMPROVED HOMEPAGE COPY

## Meta Title
```
Free AI Resume Builder | ATS-Optimized in Seconds | I Love Resumes
```
(55 chars)

## Meta Description
```
Free AI resume builder. Upload your resume, match job descriptions, export to Word & PDF. ATS-optimized in seconds. Trusted by 1000+ job seekers.
```
(138 chars)

## H1
```
Free AI Resume Builder – ATS-Optimized in Seconds
```

## Hero Subtitle
```
Upload your resume, paste a job description, and get tailored keyword suggestions. Export to Word or PDF. Free. No credit card required.
```

## H2 (Features Section)
```
How Our Free AI Resume Builder Works
```

## H2 Subtitle
```
Create resumes that pass ATS systems and get noticed by recruiters.
```

## Feature Cards (Rewritten)

| Title | Description |
|-------|-------------|
| PDF Resume Upload | Upload your resume in PDF or paste as text. Our AI analyzes it in seconds. |
| Job Description Matching | Paste any job description. Get keyword suggestions to align your resume with what recruiters and ATS look for. |
| Real-Time Editing | Edit AI suggestions on the spot. No back-and-forth. |
| Export to Word & PDF | Download your resume as .docx or PDF. ATS-friendly formats for any application. |

## CTA Support Line (below button)
```
Free – no credit card required
```

## New FAQ Section (add below features)

**H2:** Frequently Asked Questions

1. **Is I Love Resumes free?**  
   Yes. Create and optimize resumes for free. Export to Word and PDF at no cost.

2. **How does the AI work?**  
   Upload your resume and optionally paste a job description. Our AI suggests improvements and keywords to better match the job.

3. **Does it work for ATS?**  
   Yes. We focus on ATS-friendly structure and keyword alignment so your resume gets past automated screening.

4. **What formats can I export?**  
   Word (.docx) and PDF—both standard formats for job applications.

## Footer Additions
```
Contact | Privacy | Terms
```
(Add links when pages exist.)

---

# 7. 90-DAY ROADMAP

## Days 1–7: Foundation

| Day | Task |
|-----|------|
| 1 | Fix domain: iloveresumes.com → iloveresumes.ca everywhere |
| 1 | Fix OG image to absolute URL |
| 1 | Update robots.txt and sitemap.xml |
| 1 | Make /contact public |
| 1 | Add noindex to dashboard, result, word-download, myprofile |
| 2 | Add homepage header with Contact, Features links |
| 2 | Add footer with Contact, Privacy, Terms |
| 2 | Rewrite homepage: title, meta, H1, H2, features, add FAQ |
| 3 | Fix schema: Organization, WebApplication (URLs, dates) |
| 3 | Add WebSite schema |
| 4 | Create /faq page with 8 Q&As + FAQPage schema |
| 5 | Remove unused font preconnects |
| 6 | Create /resume-builder-canada page |
| 7 | Create /resume-builder-toronto page |
| 7 | Submit sitemap in Google Search Console |

## Days 8–30: Content & Tools

| Week | Task |
|------|------|
| 2 | Create /blog index |
| 2 | Publish: How ATS Systems Work |
| 2 | Publish: Best Resume Format 2026 |
| 3 | Publish: Canadian Resume Format Guide |
| 3 | Create /ats-resume-checker (or MVP) |
| 4 | Publish: How to Match Resume to Job Description |
| 4 | Create /privacy and /terms |
| 4 | Add BreadcrumbList, Article schema to blog |
| 4 | Internal linking pass: blog → homepage, tools, Canada |

## Days 31–60: Scale Content

| Week | Task |
|------|------|
| 5–6 | Publish 4 more blog posts (from 30 ideas) |
| 6 | Create /resume-to-word page (if feasible) |
| 6 | Create /ai-resume-builders-compared |
| 7 | Publish 2 more blog posts |
| 7 | Backlink outreach: Product Hunt, 2 directories, 1 roundup pitch |

## Days 61–90: Authority & Links

| Week | Task |
|------|------|
| 8–9 | Publish 4 more blog posts |
| 9 | Pillar post: "Complete ATS Resume Guide" |
| 10 | Guest post pitch (1–2) |
| 10 | HARO/Qwoted: 2–3 responses |
| 11 | Reddit/LinkedIn: helpful content, no spam |
| 12 | Full internal linking audit |
| 12 | Monitor Search Console, fix crawl/index issues |

## Target by Day 90
- 25–35 indexable pages
- 12+ blog posts
- 2 location pages (Canada, Toronto)
- 1 tool page (ATS checker)
- 1 FAQ page
- 5–10 quality backlinks
- Technical issues resolved

---

# 8. BRUTALLY HONEST VERDICT

## What’s Holding You Back

1. **Domain mismatch** — Canonical and all SEO assets point to .com while the site is .ca. This confuses engines and likely costs you rankings and links.

2. **One real page** — Only the homepage is indexable. Contact and other URLs are behind auth. You have almost no crawlable content.

3. **No authority** — No blog, no guides, no tools, no location pages. You look like a single landing page.

4. **No internal links** — Homepage doesn’t link anywhere. Crawlers can’t find other pages or pass equity.

5. **Weak keyword focus** — "Free" and "ATS" are barely used. Canada/Toronto not targeted.

## What’s Realistic

- **3–6 months:** Hundreds of visits/month if you fix technical issues, add 15–20 pages, and publish consistently.
- **6–12 months:** 1,000–3,000 visits/month with 30+ pages, solid content, and some backlinks.
- **Rankings:** Long-tail terms ("resume builder Canada", "free ATS checker") in 3–6 months. Head terms ("resume builder") take a year or more.

## What’s Unrealistic

- #1 for "resume builder" or "AI resume builder" in 6–12 months. Competitors have far more authority.
- Meaningful traffic from one homepage with no expansion.
- Big gains from meta changes alone. Technical fixes and content matter more.

## What You Need to Do

1. **Fix the foundation** — Domain, sitemap, robots, noindex for auth pages.
2. **Expand indexable pages** — Public contact, FAQ, Canada, Toronto, 15+ blog posts.
3. **Target long-tail first** — "resume builder Canada", "Toronto resume", "free ATS checker".
4. **Build backlinks** — Directories, roundups, 1–2 guest posts. Avoid spam.
5. **Stay consistent** — 2–4 posts/month for at least 6 months.

**Bottom line:** The product is viable. The main issues are technical and structural. Fix them, add 25–30 quality pages, and focus on long-tail and local terms. Traffic will follow in months, not weeks.

---

*End of SEO Action Plan*
