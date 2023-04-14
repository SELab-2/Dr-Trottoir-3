/** @type {import('next').NextConfig} */

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config();

const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: 'node_modules/leaflet/dist/images',
              to: path.resolve(__dirname, 'public', 'leaflet', 'images')
            },
          ],
        }),
    )
    return config
  },
  env: {
    NEXT_API_URL: process.env.NEXT_API_URL,
    NEXT_INTERNAL_API_URL: process.env.NEXT_INTERNAL_API_URL,
    NEXT_INTERNAL_API_AUTH_URL: process.env.NEXT_INTERNAL_API_AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};


module.exports = nextConfig;
