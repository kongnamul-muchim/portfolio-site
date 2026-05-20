/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  async rewrites() {
    return [
      {
        source: '/api/jobs/:path*',
        destination: 'http://45.59.101.155:8000/api/jobs/:path*',
      },
    ]
  }
};

export default nextConfig;
