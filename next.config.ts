import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['127.0.0.1', 'localhost'],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1:8000",
      },
    ],
  },
};

export default nextConfig;
