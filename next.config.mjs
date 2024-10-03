/** @type {import('next').NextConfig} */
const nextConfig = {
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
