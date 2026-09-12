const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    /** Match `quality` values used in <Image /> (e.g. wordmarks at 60). */
    qualities: [60, 75],
    /** Fills 384–640 gap so logos/wordmarks near ~2× DPR use 480w instead of 640w (smaller LCP bytes). */
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/blog/how-to-optimize-resume-for-ats-2025",
        destination: "/blog/how-to-optimize-resume-for-ats-2026",
        permanent: true,
      },
      {
        source: "/blog/best-resume-format-2025",
        destination: "/blog/best-resume-format-2026",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.iloveresumes.ca" }],
        destination: "https://iloveresumes.ca/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms; style-src 'self' 'unsafe-inline'; frame-src 'self' blob: https://www.googletagmanager.com https://*.firebaseapp.com https://*.firebaseio.com https://accounts.google.com https://apis.google.com; connect-src 'self' https://api.emailjs.com https://identitytoolkit.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebasestorage.googleapis.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://*.clarity.ms https://c.bing.com https://vitals.vercel-insights.com; img-src 'self' https://lh3.googleusercontent.com https://images.pexels.com https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  compress: true,
};

export default nextConfig;
