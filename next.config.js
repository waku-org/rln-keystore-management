/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'waku.org',
      'logos.co',
      'contributors.free.technology'
    ],
  },
  reactStrictMode: true,
  output: 'export',
}

module.exports = nextConfig 