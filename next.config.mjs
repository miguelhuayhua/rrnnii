/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname:'ip172-18-0-21-crgv8mqim2rg00aaad40-4000.direct.labs.play-with-docker.com',
            }
        ]
    }
};

export default nextConfig;
