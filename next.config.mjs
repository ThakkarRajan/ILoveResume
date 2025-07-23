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
    const isProd = process.env.NODE_ENV === "production";
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isProd
              ? "default-src 'self'; img-src 'self' data: https://lh3.googleusercontent.com; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://jobdraftai-backend-production.up.railway.app https://identitytoolkit.googleapis.com https://firebasestorage.googleapis.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';"
              : "default-src 'self'; img-src 'self' data: https://lh3.googleusercontent.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://jobdraftai-backend-production.up.railway.app https://identitytoolkit.googleapis.com https://firebasestorage.googleapis.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
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
