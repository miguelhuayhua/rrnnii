/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@react-pdf/renderer'],
    },
    images: {
        unoptimized: true,
        remotePatterns: [

            {
                hostname: 'rrnniifile.upea.bo',
                protocol: 'https',
            }
        ]
    }
};

export default nextConfig;
