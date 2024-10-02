/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname:'ip172-18-0-20-crpf82q91nsg00fvt2e0-4000.direct.labs.play-with-docker.com',
            }
        ]
    }
};

export default nextConfig;
