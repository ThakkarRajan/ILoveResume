/** Tiny inline SVG divider — original graphic, no external license. */
export default function BlogSquiggle({ className = "", gradientId = "blog-squiggle-gradient" }) {
  const gid = gradientId.replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M0 6C20 2 40 10 60 6S100 2 120 6s40 4 60 0 40-8 60-4"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="0.5" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
    </svg>
  );
}
