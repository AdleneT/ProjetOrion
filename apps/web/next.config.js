/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/core", "@repo/db"],
};

module.exports = nextConfig;
