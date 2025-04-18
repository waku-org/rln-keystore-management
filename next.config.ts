import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'waku.org',
      'logos.co',
      'contributors.free.technology'
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig 
