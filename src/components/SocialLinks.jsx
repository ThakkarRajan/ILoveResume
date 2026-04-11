"use client";

/**
 * Social links for footer. Add these to .env.local to display:
 * NEXT_PUBLIC_LINKEDIN_URL, NEXT_PUBLIC_TWITTER_URL, NEXT_PUBLIC_FACEBOOK_URL,
 * NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_YOUTUBE_URL
 */
const SOCIAL_CONFIG = [
  { key: "linkedin", url: process.env.NEXT_PUBLIC_LINKEDIN_URL, label: "LinkedIn" },
  { key: "x", url: process.env.NEXT_PUBLIC_TWITTER_URL || process.env.NEXT_PUBLIC_X_URL, label: "X (Twitter)" },
  { key: "facebook", url: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook" },
  { key: "instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM_URL, label: "Instagram" },
  { key: "youtube", url: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube" },
];

export default function SocialLinks() {
  const links = SOCIAL_CONFIG.filter((item) => item.url);
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {links.map((item) => (
        <a
          key={item.key}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25"
          aria-label={`Follow us on ${item.label}`}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
