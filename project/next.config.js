/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/MoneyTime',
    output: 'export',  // עבור static export
    images: {
        unoptimized: true // נדרש עבור static export
    }
}

module.exports = nextConfig
