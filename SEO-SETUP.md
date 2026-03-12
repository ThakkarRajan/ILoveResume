# SEO Setup – Optional Configuration

## Social Media Links (Semrush Audit)

To satisfy social media audits and add follow links, add these to `.env.local` when you create profiles:

```bash
# Optional: Social media URLs (add when profiles exist)
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/iloveresumes
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/iloveresumes
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/iloveresumes
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/iloveresumes
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@iloveresumes
```

Links appear in the footer and in Organization schema when set.

## Google Analytics

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Add your GA4 Measurement ID to track traffic.
