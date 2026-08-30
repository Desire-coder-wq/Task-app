import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://taskflow-backend-yh8o.onrender.com/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
