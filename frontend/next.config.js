/** @type {import('next').NextConfig} */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const nextConfig = {
  // reactStrictMode: true,
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
    NEXT_API_URL: "http://localhost:8000/",
    NEXT_INTERNAL_API_URL: "http://localhost:3000/api/",
    NEXT_INTERNAL_API_AUTH_URL: "http://localhost:3000/api/auth/"
  },
}

module.exports = nextConfig

