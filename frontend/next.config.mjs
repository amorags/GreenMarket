/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for Docker
    output: 'standalone',

    // Environment variables that should be available at build time
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
    },

    // Optional: Configure image domains if you're using next/image
    images: {
        domains: ['localhost'],
    },

    // Optional: Add experimental features if needed
    experimental: {
        serverActions: true,
    },
}

export default nextConfig