/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname: '**'
            }
        ]
    }
};

export default nextConfig;
