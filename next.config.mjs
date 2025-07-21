const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
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
};

export default nextConfig;
