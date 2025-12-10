// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    env: {
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS,
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    }
};

module.exports = nextConfig;
