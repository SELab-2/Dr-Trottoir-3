/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_API_URL: "http://localhost:8000/",
    NEXT_INTERNAL_API_URL: "http://localhost:3000/api/",
    NEXT_INTERNAL_API_AUTH_URL: "http://localhost:3000/api/auth/"
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
