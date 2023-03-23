/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_API_URL: "http://localhost:8000/",
    NEXT_INTERNAL_API_URL: "http://localhost:3002/api/",
  },
}

module.exports = nextConfig
