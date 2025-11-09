import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: 'dist',
  // turbopack: {
  //   root: path.join(__dirname, '.'),
  // },
  async rewrites() {
    return [
      // {
      //   source: '/api/:path*',
      //   destination: 'http://localhost:8080/api/:path*',
      // },
      {
        source: '/resume',
        destination: '/William McVay - Full Stack Developer.pdf',
      },
    ];
  },
};

export default nextConfig;