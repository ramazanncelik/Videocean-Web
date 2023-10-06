/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: "media.istockphoto.com" },
            { protocol: 'https', hostname: "res.cloudinary.com" },
            { protocol: 'https', hostname: "firebasestorage.googleapis.com" }
        ],
        deviceSizes: [500, 968],
        imageSizes: [475, 768],
        formats: ["image/webp"],
        minimumCacheTTL: 30
    }
}

module.exports = nextConfig
