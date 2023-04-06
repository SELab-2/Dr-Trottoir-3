/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_API_URL: "http://localhost:8000/",
    NEXT_INTERNAL_API_URL: "http://localhost:3000/api/",
    NEXT_INTERNAL_API_AUTH_URL: "http://localhost:3000/api/auth/"
  },
}

module.exports = nextConfig

