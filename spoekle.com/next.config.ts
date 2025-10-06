import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'api.spoekle.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.spoekle.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  async rewrites() {
    return [
      // CDN rewrites - map cdn.spoekle.com to local API
      {
        source: '/cdn/:path*',
        destination: '/api/cdn/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
      {
        source: '/profilePictures/:path*',
        destination: '/api/profilePictures/:path*',
      },
    ];
  },
};

export default nextConfig;
