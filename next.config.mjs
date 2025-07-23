const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline'; frame-src 'self' https://*.firebaseapp.com https://*.firebaseio.com https://accounts.google.com https://apis.google.com; connect-src 'self' https://identitytoolkit.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebasestorage.googleapis.com https://jobdraftai-backend-production.up.railway.app;",
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
