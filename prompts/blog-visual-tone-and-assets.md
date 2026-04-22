# Prompt: Blog visuals, casual tone, and licensed imagery

Use this when writing or updating **I Love Resumes** blog posts so pages feel human, scannable, and safe to ship legally.

---

## Visual hierarchy (readability)

- Break long text with **clear H2 sections** (already in HTML). Keep paragraphs **3–5 sentences** where possible.
- Prefer **one hero image** per article (cover) with consistent aspect ratio (wide crop).
- Use **lists** for steps and checklists; use **bold** for scan anchors, not whole paragraphs.
- Optional: **one** pull-quote or callout per long article (`<blockquote>` with a single punchy line).

## Tone (casual, lightly funny)

- Sound like a **knowledgeable friend**, not a corporate press release.
- **One** light joke or self-deprecating line per section is enough—don’t stack memes.
- Never punch down (no jokes at the expense of job seekers, immigrants, or junior candidates).
- Stay **accurate**: humor must not contradict facts or imply guarantees (interviews, ATS “scores”).

## Images (legal)

1. **Stock (default for this site):** Use **Pexels** via URLs in `src/data/blog-visuals.js`, with **Pexels** credit and [Pexels License](https://www.pexels.com/license/) on the article page (see `BlogPostHero.jsx`).
2. **Do not** hotlink random Google Images, Pinterest, or paid stock without a license.
3. **Brand / product:** Use assets in `public/` (logo, OG image) for product-specific visuals.
4. **Illustrations:** Prefer **original SVGs** in-repo or licensed packs; avoid copying trademarked mascots.

## Implementation hooks

- **Cover selection:** `getBlogCover(slug)` returns the image URL and credit metadata (deterministic per slug).
- **Casual strip:** `getBlogCasualLine(slug, category)` returns a short line—keep copy in `blog-visuals.js` so tone stays consistent.
- **Styling:** Article body uses `.blog-content` in `globals.css`—extend there for new elements (`blockquote`, `figure`, etc.).

## Checklist before publish

- [ ] Hero alt text matches content (`coverImageAlt` in `blog-posts.js`).
- [ ] Photographer credit visible on the post page.
- [ ] No new image host without `next.config` `images.remotePatterns`.
- [ ] Mobile: hero and cards don’t overflow horizontally.
