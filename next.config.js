// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only use export mode for production builds
    ...(process.env.NODE_ENV === 'production' && {
        output: 'export',
        distDir: 'out'
    }),
    trailingSlash: true,
    images: {
        unoptimized: true
    }
};

module.exports = nextConfig;
