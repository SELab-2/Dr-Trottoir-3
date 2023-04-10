/** @type {import('next').NextConfig} */

require('dotenv').config()

const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL,
    NEXT_INTERNAL_API_URL: process.env.NEXT_INTERNAL_API_URL,
    NEXT_INTERNAL_API_AUTH_URL: process.env.NEXT_INTERNAL_API_AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  // This is required to allow images to be shown,
  // once images are available in /building_images/, hostname should
  // be changed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
