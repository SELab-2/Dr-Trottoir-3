/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
