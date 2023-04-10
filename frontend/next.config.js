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
}


module.exports = nextConfig
